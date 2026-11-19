import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { OccupancyResponseDto } from '../../types';
import {
  Users,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  FileCheck2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const ResidentVerificationQueuePage: React.FC = () => {
  const [occupancies, setOccupancies] = useState<OccupancyResponseDto[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('PENDING');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [selectedOcc, setSelectedOcc] = useState<OccupancyResponseDto | null>(null);
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const url = filterStatus
        ? `/residents/verification-queue?status=${filterStatus}`
        : '/residents/verification-queue';
      const res = await api.get(url);
      if (res.data?.success) {
        setOccupancies(res.data.data);
      }
    } catch (err: any) {
      setError('Failed to fetch verification queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [filterStatus]);

  const handleDecisionSubmit = async () => {
    if (!selectedOcc || !decision) return;
    if (decision === 'REJECTED' && !rejectReason.trim()) {
      setError('Please provide a rejection explanation');
      return;
    }

    setProcessing(true);
    try {
      const res = await api.post(`/residents/verifications/${selectedOcc.id}/decision`, {
        decision,
        rejectionReason: rejectReason,
      });

      if (res.data?.success) {
        setSelectedOcc(null);
        setDecision(null);
        setRejectReason('');
        fetchQueue();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification update failed');
    } finally {
      setProcessing(false);
    }
  };

  const filtered = occupancies.filter((occ) =>
    (occ.userName && occ.userName.toLowerCase().includes(search.toLowerCase())) ||
    (occ.userEmail && occ.userEmail.toLowerCase().includes(search.toLowerCase())) ||
    (occ.flatNumber && occ.flatNumber.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Resident Verification & KYC Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">Audit flat ownership deeds and tenant lease agreements before granting society access</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search resident, email, flat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent focus:outline-none font-medium cursor-pointer"
            >
              <option value="">All Applications</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 font-bold">✕</button>
        </div>
      )}

      {/* Verification Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Applicant Details</th>
                <th className="px-5 py-3.5">Assigned Flat</th>
                <th className="px-5 py-3.5">Occupancy Type</th>
                <th className="px-5 py-3.5">Document Proof</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date Submitted</th>
                <th className="px-5 py-3.5 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">Loading verification roster...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">No verification records found.</td>
                </tr>
              ) : (
                filtered.map((occ) => (
                  <tr key={occ.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{occ.userName}</p>
                      <p className="text-[11px] text-slate-400">{occ.userEmail}</p>
                      <p className="text-[11px] text-slate-400">{occ.userPhone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-black text-slate-900 text-sm">{occ.flatNumber}</p>
                      <p className="text-[11px] text-slate-500">{occ.buildingName} • {occ.wingName}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        occ.occupancyType === 'OWNER'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {occ.occupancyType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {occ.documentProofUrl ? (
                        <a
                          href={occ.documentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 hover:underline font-semibold"
                        >
                          <span>Inspect Proof</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">None uploaded</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          occ.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : occ.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {occ.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                      {new Date(occ.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {occ.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setSelectedOcc(occ); setDecision('APPROVED'); }}
                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => { setSelectedOcc(occ); setDecision('REJECTED'); }}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold rounded-lg text-xs transition border border-rose-200"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-medium">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Dialog Modal */}
      {selectedOcc && decision && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {decision === 'APPROVED' ? 'Approve Resident Flat Access' : 'Reject Resident Application'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Resident: {selectedOcc.userName} • Flat {selectedOcc.flatNumber} ({selectedOcc.occupancyType})
            </p>

            {decision === 'APPROVED' ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-xs text-emerald-900 border border-emerald-200 mb-4">
                <p>
                  Approving this verification will activate the resident’s account, assign the <strong>{selectedOcc.occupancyType === 'OWNER' ? 'FLAT_OWNER' : 'TENANT'}</strong> role, and update Flat {selectedOcc.flatNumber} to <strong>OCCUPIED</strong> status.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <div className="p-3 rounded-xl bg-rose-50 text-xs text-rose-900 border border-rose-200">
                  <p>Please enter an explanation note for the rejection so the applicant can submit corrections.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rejection Reason</label>
                  <textarea
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Agreement document illegible or name does not match property deed"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setSelectedOcc(null); setDecision(null); }}
                className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={handleDecisionSubmit}
                className={`px-5 py-2 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 ${
                  decision === 'APPROVED' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {processing ? 'Processing...' : `Confirm ${decision}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
