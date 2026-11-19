package com.society360.controller;

import com.society360.dto.request.GenerateBatchInvoicesRequest;
import com.society360.dto.request.SimulatePaymentRequest;
import com.society360.dto.response.ApiResponse;
import com.society360.dto.response.InvoiceResponseDto;
import com.society360.dto.response.PaymentReceiptDto;
import com.society360.service.FinanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@Tag(name = "Finance & Invoicing", description = "Endpoints for maintenance dues generation, ledger management, simulated online payments, and digital receipts")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @PostMapping("/invoices/generate-batch")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Batch generate monthly maintenance invoices for flats")
    public ResponseEntity<ApiResponse<List<InvoiceResponseDto>>> generateBatchInvoices(
            @Valid @RequestBody GenerateBatchInvoicesRequest request) {
        List<InvoiceResponseDto> invoices = financeService.generateBatchInvoices(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Batch invoices generated successfully", invoices));
    }

    @GetMapping("/invoices")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get all society maintenance invoices and dues ledger")
    public ResponseEntity<ApiResponse<List<InvoiceResponseDto>>> getAllInvoices() {
        List<InvoiceResponseDto> invoices = financeService.getAllSocietyInvoices();
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @GetMapping("/invoices/my")
    @PreAuthorize("hasAnyRole('FLAT_OWNER', 'TENANT')")
    @Operation(summary = "Get invoices for the current authenticated resident's flat")
    public ResponseEntity<ApiResponse<List<InvoiceResponseDto>>> getMyInvoices() {
        List<InvoiceResponseDto> invoices = financeService.getMyInvoices();
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @PostMapping("/payments/simulate")
    @PreAuthorize("hasAnyRole('FLAT_OWNER', 'TENANT')")
    @Operation(summary = "Execute simulated payment for an invoice via payment gateway")
    public ResponseEntity<ApiResponse<PaymentReceiptDto>> simulatePayment(
            @Valid @RequestBody SimulatePaymentRequest request) {
        PaymentReceiptDto receipt = financeService.simulatePayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", receipt));
    }

    @GetMapping("/receipts/{receiptNumber}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get detailed digital payment receipt by receipt number")
    public ResponseEntity<ApiResponse<PaymentReceiptDto>> getReceipt(@PathVariable String receiptNumber) {
        PaymentReceiptDto receipt = financeService.getReceipt(receiptNumber);
        return ResponseEntity.ok(ApiResponse.success(receipt));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get financial performance summary and collection rate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary() {
        Map<String, Object> summary = financeService.getFinancialSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
