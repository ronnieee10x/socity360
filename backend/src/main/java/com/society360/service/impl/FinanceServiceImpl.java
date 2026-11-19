package com.society360.service.impl;

import com.society360.domain.auth.UserAccount;
import com.society360.domain.finance.Invoice;
import com.society360.domain.finance.Payment;
import com.society360.domain.property.Building;
import com.society360.domain.property.Flat;
import com.society360.domain.property.Occupancy;
import com.society360.domain.society.Society;
import com.society360.dto.request.GenerateBatchInvoicesRequest;
import com.society360.dto.request.SimulatePaymentRequest;
import com.society360.dto.response.InvoiceResponseDto;
import com.society360.dto.response.PaymentReceiptDto;
import com.society360.exception.BadRequestException;
import com.society360.exception.ResourceNotFoundException;
import com.society360.repository.*;
import com.society360.security.CustomUserPrincipal;
import com.society360.security.TenantContextHolder;
import com.society360.service.FinanceService;
import com.society360.service.payment.PaymentGateway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class FinanceServiceImpl implements FinanceService {

    private static final Logger log = LoggerFactory.getLogger(FinanceServiceImpl.class);

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final FlatRepository flatRepository;
    private final BuildingRepository buildingRepository;
    private final SocietyRepository societyRepository;
    private final OccupancyRepository occupancyRepository;
    private final UserAccountRepository userRepository;
    private final PaymentGateway paymentGateway;

    private static final String ALPHANUMERIC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final SecureRandom random = new SecureRandom();

    public FinanceServiceImpl(
            InvoiceRepository invoiceRepository,
            PaymentRepository paymentRepository,
            FlatRepository flatRepository,
            BuildingRepository buildingRepository,
            SocietyRepository societyRepository,
            OccupancyRepository occupancyRepository,
            UserAccountRepository userRepository,
            PaymentGateway paymentGateway) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.flatRepository = flatRepository;
        this.buildingRepository = buildingRepository;
        this.societyRepository = societyRepository;
        this.occupancyRepository = occupancyRepository;
        this.userRepository = userRepository;
        this.paymentGateway = paymentGateway;
    }

    private UUID requireTenantId() {
        UUID tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null) {
            throw new BadRequestException("No active society tenant context found");
        }
        return tenantId;
    }

    private UserAccount getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserPrincipal p)) {
            throw new BadRequestException("No authenticated user found");
        }
        return userRepository.findById(p.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public List<InvoiceResponseDto> generateBatchInvoices(GenerateBatchInvoicesRequest request) {
        UUID societyId = requireTenantId();
        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new ResourceNotFoundException("Society not found"));

        List<Flat> targetFlats;
        if (request.getBuildingId() != null) {
            targetFlats = flatRepository.findAllBySocietyIdAndBuildingId(
                    societyId, request.getBuildingId());
        } else {
            targetFlats = flatRepository.findAllBySocietyId(societyId);
        }

        List<Invoice> createdInvoices = new ArrayList<>();
        String normalizedMonth = request.getBillingMonth().toUpperCase().trim();

        for (Flat flat : targetFlats) {
            // Avoid generating duplicate invoice for the same flat in the same billing month
            if (invoiceRepository.existsBySocietyIdAndFlatIdAndBillingMonth(societyId, flat.getId(), normalizedMonth)) {
                continue;
            }

            String invNo = "INV-" + society.getRegistrationNumber().replaceAll("[^a-zA-Z0-9]", "") +
                    "-" + normalizedMonth.replaceAll("[^a-zA-Z0-9]", "") +
                    "-" + flat.getFlatNumber().replaceAll("[^a-zA-Z0-9]", "");

            Invoice invoice = new Invoice(
                    flat.getId(),
                    invNo,
                    normalizedMonth,
                    request.getBaseAmount(),
                    request.getDueDate(),
                    request.getDescription() != null ? request.getDescription() : "Monthly Society Maintenance Assessment"
            );
            invoice.setSocietyId(societyId);
            createdInvoices.add(invoice);
        }

        List<Invoice> savedList = invoiceRepository.saveAll(createdInvoices);
        log.info("Batch generated {} maintenance invoices for society={} month={}", savedList.size(), societyId, normalizedMonth);

        return savedList.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponseDto> getAllSocietyInvoices() {
        UUID societyId = requireTenantId();
        return invoiceRepository.findBySocietyIdOrderByCreatedAtDesc(societyId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponseDto> getMyInvoices() {
        UUID societyId = requireTenantId();
        UserAccount user = getCurrentUser();

        // Find resident flat from approved occupancy
        List<Occupancy> occupancies = occupancyRepository.findAllByUserId(user.getId());
        List<UUID> flatIds = occupancies.stream()
                .filter(o -> "APPROVED".equalsIgnoreCase(o.getStatus()))
                .map(Occupancy::getFlatId)
                .toList();

        if (flatIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<InvoiceResponseDto> results = new ArrayList<>();
        for (UUID flatId : flatIds) {
            List<Invoice> invoices = invoiceRepository.findBySocietyIdAndFlatIdOrderByCreatedAtDesc(societyId, flatId);
            for (Invoice inv : invoices) {
                results.add(toDto(inv));
            }
        }
        return results;
    }

    @Override
    public PaymentReceiptDto simulatePayment(SimulatePaymentRequest request) {
        UUID societyId = requireTenantId();
        UserAccount user = getCurrentUser();

        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .filter(i -> i.getSocietyId().equals(societyId))
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found in your society"));

        if ("PAID".equalsIgnoreCase(invoice.getStatus())) {
            throw new BadRequestException("This invoice has already been fully paid.");
        }

        BigDecimal totalPayable = invoice.getAmount().add(
                invoice.getLateFee() != null ? invoice.getLateFee() : BigDecimal.ZERO);

        // Process through simulated payment gateway
        PaymentGateway.PaymentGatewayResult gatewayResult = paymentGateway.processPayment(
                invoice.getInvoiceNumber(),
                totalPayable,
                request.getPaymentMethod(),
                request.getPaymentAccountOrVpa() != null ? request.getPaymentAccountOrVpa() : "simulated-resident-account"
        );

        if (!gatewayResult.successful()) {
            throw new BadRequestException("Payment failed: " + gatewayResult.gatewayMessage());
        }

        // Generate receipt number e.g. REC-2026-9B3D7F12
        String receiptNumber = "REC-" + Year.now().getValue() + "-" + generateRandomCode(8);

        Payment payment = new Payment(
                invoice.getId(),
                user.getId(),
                receiptNumber,
                totalPayable,
                request.getPaymentMethod().toUpperCase(),
                gatewayResult.transactionReference()
        );
        payment.setSocietyId(societyId);
        Payment savedPayment = paymentRepository.save(payment);

        // Mark invoice as PAID
        invoice.setStatus("PAID");
        invoiceRepository.save(invoice);

        log.info("Invoice {} paid successfully! Receipt={}, TxnRef={}",
                invoice.getInvoiceNumber(), receiptNumber, gatewayResult.transactionReference());

        return toReceiptDto(savedPayment, invoice, user);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentReceiptDto getReceipt(String receiptNumber) {
        UUID societyId = requireTenantId();

        Payment payment = paymentRepository.findBySocietyIdAndReceiptNumber(societyId, receiptNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Payment receipt not found"));

        Invoice invoice = invoiceRepository.findById(payment.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

        UserAccount user = userRepository.findById(payment.getPaidBy())
                .orElse(null);

        return toReceiptDto(payment, invoice, user);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getFinancialSummary() {
        UUID societyId = requireTenantId();
        List<Invoice> invoices = invoiceRepository.findBySocietyIdOrderByCreatedAtDesc(societyId);

        BigDecimal totalBilled = BigDecimal.ZERO;
        BigDecimal totalCollected = BigDecimal.ZERO;
        BigDecimal pendingDues = BigDecimal.ZERO;
        long paidCount = 0;
        long unpaidCount = 0;

        for (Invoice inv : invoices) {
            BigDecimal invTotal = inv.getAmount().add(inv.getLateFee() != null ? inv.getLateFee() : BigDecimal.ZERO);
            totalBilled = totalBilled.add(invTotal);

            if ("PAID".equalsIgnoreCase(inv.getStatus())) {
                totalCollected = totalCollected.add(invTotal);
                paidCount++;
            } else {
                pendingDues = pendingDues.add(invTotal);
                unpaidCount++;
            }
        }

        double collectionRate = totalBilled.compareTo(BigDecimal.ZERO) > 0
                ? (totalCollected.doubleValue() / totalBilled.doubleValue()) * 100.0
                : 0.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalBilled", totalBilled);
        summary.put("totalCollected", totalCollected);
        summary.put("pendingDues", pendingDues);
        summary.put("paidInvoicesCount", paidCount);
        summary.put("unpaidInvoicesCount", unpaidCount);
        summary.put("collectionPercentage", Math.round(collectionRate * 10.0) / 10.0);

        return summary;
    }

    private InvoiceResponseDto toDto(Invoice inv) {
        Flat flat = flatRepository.findById(inv.getFlatId()).orElse(null);
        Building building = flat != null ? buildingRepository.findById(flat.getBuildingId()).orElse(null) : null;
        Payment payment = paymentRepository.findBySocietyIdAndInvoiceId(inv.getSocietyId(), inv.getId()).orElse(null);

        InvoiceResponseDto dto = new InvoiceResponseDto();
        dto.setId(inv.getId());
        dto.setSocietyId(inv.getSocietyId());
        dto.setFlatId(inv.getFlatId());
        dto.setFlatNumber(flat != null ? flat.getFlatNumber() : "N/A");
        dto.setBuildingName(building != null ? building.getName() : "N/A");
        dto.setInvoiceNumber(inv.getInvoiceNumber());
        dto.setBillingMonth(inv.getBillingMonth());
        dto.setAmount(inv.getAmount());
        dto.setLateFee(inv.getLateFee());
        dto.setTotalAmount(inv.getAmount().add(inv.getLateFee() != null ? inv.getLateFee() : BigDecimal.ZERO));
        dto.setDueDate(inv.getDueDate());
        dto.setStatus(inv.getStatus());
        dto.setDescription(inv.getDescription());
        dto.setCreatedAt(inv.getCreatedAt());

        if (payment != null) {
            dto.setReceiptNumber(payment.getReceiptNumber());
            dto.setTransactionReference(payment.getTransactionReference());
            dto.setPaidAt(payment.getPaidAt());
            dto.setPaymentMethod(payment.getPaymentMethod());
        }

        return dto;
    }

    private PaymentReceiptDto toReceiptDto(Payment payment, Invoice invoice, UserAccount user) {
        Society society = societyRepository.findById(payment.getSocietyId()).orElse(null);
        Flat flat = flatRepository.findById(invoice.getFlatId()).orElse(null);
        Building building = flat != null ? buildingRepository.findById(flat.getBuildingId()).orElse(null) : null;

        PaymentReceiptDto receipt = new PaymentReceiptDto();
        receipt.setReceiptNumber(payment.getReceiptNumber());
        receipt.setTransactionReference(payment.getTransactionReference());
        receipt.setInvoiceNumber(invoice.getInvoiceNumber());
        receipt.setBillingMonth(invoice.getBillingMonth());
        receipt.setSocietyName(society != null ? society.getName() : "Society360 Residential");
        receipt.setBuildingName(building != null ? building.getName() : "Main Building");
        receipt.setFlatNumber(flat != null ? flat.getFlatNumber() : "N/A");
        receipt.setResidentName(user != null ? user.getFullName() : "Resident");
        receipt.setResidentEmail(user != null ? user.getEmail() : "resident@society.com");
        receipt.setAmountPaid(payment.getAmountPaid());
        receipt.setPaymentMethod(payment.getPaymentMethod());
        receipt.setPaymentStatus(payment.getPaymentStatus());
        receipt.setPaidAt(payment.getPaidAt());

        return receipt;
    }

    private String generateRandomCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHANUMERIC.charAt(random.nextInt(ALPHANUMERIC.length())));
        }
        return sb.toString();
    }
}
