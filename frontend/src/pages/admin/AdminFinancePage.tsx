import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { InvoiceResponseDto, PaymentReceiptDto } from '../../types';
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  TrendingUp,
  CreditCard,
  X,
  FileText
} from 'lucide-react';

export const AdminFinancePage: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [summary, setSummary] = useState<any>({
    totalBilled: 0,
    totalCollected: 0,
    pendingDues: 0,
    collectionPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNPAID' | 'PAID'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Generate Batch Invoices Modal
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [submittingBatch, setSubmittingBatch] = useState(false);
  const [batchForm, setBatchForm] = useState({
    billingMonth: 'DEC-2026',
    baseAmount: 3500,
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    description: 'Monthly Society Maintenance Assessment'
  });

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceiptDto | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invRes, sumRes] = await Promise.all([
        api.get('/finance/invoices').catch(() => ({ data: { data: [] } })),
        api.get('/finance/summary').catch(() => ({ data: { data: {} } }))
      ]);

      setInvoices(invRes.data?.data || []);
      setSummary(sumRes.data?.data || {});
    } catch (err) {
      console.error('Failed to load financial records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBatchGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingBatch(true);
      await api.post('/finance/invoices/generate-batch', {
        billingMonth: batchForm.billingMonth,
        baseAmount: Number(batchForm.baseAmount),
        dueDate: batchForm.dueDate,
        description: batchForm.description
      });
      setShowBatchModal(false);
      loadData();
    } catch (err) {
      console.error('Failed to generate batch invoices', err);
    } finally {
      setSubmittingBatch(false);
    }
  };

  const handleViewReceipt = async (receiptNumber: string) => {
    try {
      const res = await api.get(`/finance/receipts/${receiptNumber}`);
      setSelectedReceipt(res.data?.data || null);
      setShowReceiptModal(true);
    } catch (err) {
      console.error('Failed to fetch receipt', err);
    }
  };

  const filteredInvoices = invoices
    .filter((inv) => (activeTab === 'ALL' ? true : inv.status === activeTab))
    .filter((inv) => {
      const q = searchTerm.toLowerCase();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        (inv.flatNumber && inv.flatNumber.toLowerCase().includes(q)) ||
        inv.billingMonth.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-600" />
            Financial Management & Dues Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Automated maintenance billing, collection analytics, bank reconciliation, and dues audit.
          </p>
        </div>
        <button
          onClick={() => setShowBatchModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          Generate Monthly Dues
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Billed</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">
            ₹{Number(summary.totalBilled || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Aggregate maintenance dues</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Collected</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-3">
            ₹{Number(summary.totalCollected || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">Realized via digital payments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Receivables</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-3">
            ₹{Number(summary.pendingDues || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-600 mt-1">Awaiting resident settlement</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Collection Efficiency</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-700 mt-3">
            {summary.collectionPercentage || 0}%
          </div>
          <p className="text-[11px] text-indigo-600 mt-1">Settlement conversion rate</p>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2">
          {(['ALL', 'UNPAID', 'PAID'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Invoices' : tab === 'UNPAID' ? 'Pending Dues' : 'Paid Invoices'}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice #, flat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700">No Invoices Found</h3>
            <p className="text-xs text-slate-400 mt-1">Click "Generate Monthly Dues" to issue maintenance bills.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Flat & Block</th>
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-indigo-500" />
                        Flat {inv.flatNumber} ({inv.buildingName})
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {inv.billingMonth}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{Number(inv.amount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {inv.dueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {inv.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" /> Unpaid
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {inv.receiptNumber ? (
                        <button
                          onClick={() => handleViewReceipt(inv.receiptNumber!)}
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {inv.receiptNumber}
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Batch Invoices Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                Generate Monthly Dues
              </h2>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBatchGenerate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Billing Month Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DEC-2026, JAN-2027"
                  value={batchForm.billingMonth}
                  onChange={(e) => setBatchForm({ ...batchForm, billingMonth: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assessment Amount Per Flat (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={batchForm.baseAmount}
                  onChange={(e) => setBatchForm({ ...batchForm, baseAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={batchForm.dueDate}
                  onChange={(e) => setBatchForm({ ...batchForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Remarks
                </label>
                <input
                  type="text"
                  value={batchForm.description}
                  onChange={(e) => setBatchForm({ ...batchForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBatch}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submittingBatch ? 'Generating Invoices...' : 'Confirm Batch Run'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="bg-emerald-600 text-white p-6 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-100" />
              <h2 className="text-lg font-bold">Maintenance Payment Receipt</h2>
              <p className="text-xs text-emerald-100 mt-1">{selectedReceipt.societyName}</p>
            </div>

            <div className="p-6 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Receipt Number</span>
                <span className="font-mono font-bold text-slate-900">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Transaction Ref</span>
                <span className="font-mono font-semibold text-slate-800">{selectedReceipt.transactionReference}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Invoice Number</span>
                <span className="font-mono text-slate-800">{selectedReceipt.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Flat</span>
                <span className="font-semibold text-slate-900">Flat {selectedReceipt.flatNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Paid By</span>
                <span className="font-semibold text-slate-900">{selectedReceipt.residentName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Payment Mode</span>
                <span className="font-bold text-indigo-600">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2 bg-slate-50 px-3 rounded-xl text-sm font-bold text-slate-900">
                <span>Amount Paid</span>
                <span className="text-emerald-700">₹{Number(selectedReceipt.amountPaid).toLocaleString()}</span>
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
export default AdminFinancePage;
