package com.society360.service;

import com.society360.dto.request.GenerateBatchInvoicesRequest;
import com.society360.dto.request.SimulatePaymentRequest;
import com.society360.dto.response.InvoiceResponseDto;
import com.society360.dto.response.PaymentReceiptDto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface FinanceService {

    List<InvoiceResponseDto> generateBatchInvoices(GenerateBatchInvoicesRequest request);

    List<InvoiceResponseDto> getAllSocietyInvoices();

    List<InvoiceResponseDto> getMyInvoices();

    PaymentReceiptDto simulatePayment(SimulatePaymentRequest request);

    PaymentReceiptDto getReceipt(String receiptNumber);

    Map<String, Object> getFinancialSummary();
}
