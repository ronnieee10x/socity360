import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { InvoiceResponseDto, PaymentReceiptDto } from '../../types';
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  Clock,
  Building,
  ArrowRight,
  ShieldCheck,
  FileText,
  X,
  AlertCircle
} from 'lucide-react';

export const ResidentInvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Pay Modal
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponseDto | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CREDIT_CARD' | 'NET_BANKING'>('UPI');
  const [vpaOrCard, setVpaOrCard] = useState('rahul@okhdfcbank');
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Receipt Modal
  const [receipt, setReceipt] = useState<PaymentReceiptDto | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/finance/invoices/my');
      setInvoices(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load resident invoices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      setProcessing(true);
      setErrorMessage('');
      const res = await api.post('/finance/payments/simulate', {
        invoiceId: selectedInvoice.id,
        paymentMethod: paymentMethod,
        paymentAccountOrVpa: vpaOrCard
      });

      setShowPayModal(false);
      setReceipt(res.data?.data);
      setShowReceiptModal(true);
      loadInvoices();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Payment simulation failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewReceipt = async (receiptNumber: string) => {
    try {
      const res = await api.get(`/finance/receipts/${receiptNumber}`);
      setReceipt(res.data?.data || null);
      setShowReceiptModal(true);
    } catch (err) {
      console.error('Failed to fetch receipt', err);
    }
  };

  const pendingInvoices = invoices.filter((i) => i.status !== 'PAID');
  const paidInvoices = invoices.filter((i) => i.status === 'PAID');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-600" />
            Maintenance Bills & Dues
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View monthly maintenance assessments, pay online with zero convenience fee, and download receipts.
          </p>
        </div>
      </div>

      {/* Dues Alert Banner */}
      {pendingInvoices.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                You have {pendingInvoices.length} outstanding maintenance bill(s)
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Total outstanding dues: ₹
                {pendingInvoices.reduce((acc, i) => acc + Number(i.totalAmount || i.amount), 0).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedInvoice(pendingInvoices[0]);
              setShowPayModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors shrink-0"
          >
            Pay Latest Bill <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Invoices List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-800">Your Maintenance Invoices</h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800">No Dues Outstanding</h3>
            <p className="text-xs text-slate-400 mt-1">Your flat account has zero pending assessments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className={`bg-white rounded-2xl p-6 border shadow-sm transition-all ${
                  inv.status === 'PAID'
                    ? 'border-slate-100'
                    : 'border-amber-200 ring-1 ring-amber-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-500">{inv.invoiceNumber}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{inv.billingMonth} Assessment</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-indigo-500" />
                      Flat {inv.flatNumber} ({inv.buildingName})
                    </p>
                  </div>
                  <div>
                    {inv.status === 'PAID' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> Due {inv.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Payable</span>
                    <span className="text-2xl font-bold text-slate-900">
                      ₹{Number(inv.totalAmount || inv.amount).toLocaleString()}
                    </span>
                  </div>

                  {inv.status === 'PAID' ? (
                    inv.receiptNumber && (
                      <button
                        onClick={() => handleViewReceipt(inv.receiptNumber!)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Receipt
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setShowPayModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm shadow-indigo-200"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pay Modal */}
      {showPayModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Pay Maintenance Bill
              </h2>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePay} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Invoice: {selectedInvoice.invoiceNumber}</span>
                  <span>Month: {selectedInvoice.billingMonth}</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  ₹{Number(selectedInvoice.totalAmount || selectedInvoice.amount).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Flat {selectedInvoice.flatNumber} ({selectedInvoice.buildingName})
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Choose Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'UPI', label: 'UPI / QR' },
                    { key: 'CREDIT_CARD', label: 'Card' },
                    { key: 'NET_BANKING', label: 'NetBanking' }
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.key}
                      onClick={() => setPaymentMethod(m.key as any)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        paymentMethod === m.key
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {paymentMethod === 'UPI'
                    ? 'Virtual Payment Address (VPA)'
                    : paymentMethod === 'CREDIT_CARD'
                    ? 'Simulated Card Number'
                    : 'Bank Account ID'}
                </label>
                <input
                  type="text"
                  required
                  value={vpaOrCard}
                  onChange={(e) => setVpaOrCard(e.target.value)}
                  placeholder={
                    paymentMethod === 'UPI'
                      ? 'e.g. resident@okhdfcbank'
                      : '4111 2222 3333 4444'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Simulated 256-bit SSL encrypted PCI-DSS banking gateway</span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {processing ? 'Processing Payment...' : 'Authorize & Pay ₹' + Number(selectedInvoice.totalAmount || selectedInvoice.amount).toLocaleString()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {showReceiptModal && receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="bg-emerald-600 text-white p-6 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-100" />
              <h2 className="text-lg font-bold">Payment Successful!</h2>
              <p className="text-xs text-emerald-100 mt-1">{receipt.societyName}</p>
            </div>

            <div className="p-6 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Receipt #</span>
                <span className="font-mono font-bold text-slate-900">{receipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Txn Reference</span>
                <span className="font-mono font-semibold text-slate-800">{receipt.transactionReference}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Invoice #</span>
                <span className="font-mono text-slate-800">{receipt.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Flat</span>
                <span className="font-semibold text-slate-900">Flat {receipt.flatNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Payment Mode</span>
                <span className="font-bold text-indigo-600">{receipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2 bg-emerald-50 px-3 rounded-xl text-sm font-bold text-emerald-900">
                <span>Amount Paid</span>
                <span>₹{Number(receipt.amountPaid).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ResidentInvoicesPage;
