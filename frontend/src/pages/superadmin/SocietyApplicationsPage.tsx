import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { SocietyApplication } from '../../types';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';

export const SocietyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<SocietyApplication[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Application for Review Modal
  const [selectedApp, setSelectedApp] = useState<SocietyApplication | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [adminPassword, setAdminPassword] = useState('Password@123');
  const [processing, setProcessing] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const url = filterStatus
        ? `/super-admin/applications?status=${filterStatus}`
        : '/super-admin/applications';
      const res = await api.get(url);
      if (res.data?.success) {
        setApplications(res.data.data);
      }
    } catch (err: any) {
      setError('Failed to fetch society applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const handleApprove = async () => {
    if (!selectedApp) return;
    setProcessing(true);
    try {
      const res = await api.post(`/super-admin/applications/${selectedApp.id}/approve`, {
        adminPassword,
      });
      if (res.data?.success) {
        setSelectedApp(null);
        setActionType(null);
        fetchApplications();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Approval failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp || !rejectReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    setProcessing(true);
    try {
      const res = await api.post(`/super-admin/applications/${selectedApp.id}/reject`, {
        reason: rejectReason,
      });
      if (res.data?.success) {
        setSelectedApp(null);
        setActionType(null);
        setRejectReason('');
        fetchApplications();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Rejection failed');
    } finally {
      setProcessing(false);
    }
  };

  const filtered = applications.filter((app) =>
    app.societyName.toLowerCase().includes(search.toLowerCase()) ||
    app.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
    app.applicantName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Society Onboarding Applications</h2>
          <p className="text-xs text-slate-500 mt-0.5">Review, audit legal deeds, and provision housing society workspaces</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, reg no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filter dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent focus:outline-none font-medium cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
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

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Society Name & Reg No</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Units</th>
                <th className="px-5 py-3.5">Representative</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Submitted</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">Loading applications...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">No society applications found.</td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{app.societyName}</p>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">{app.registrationNumber}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <p>{app.city}, {app.state}</p>
                      <p className="text-[11px] text-slate-400">{app.pinCode}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span className="font-semibold text-slate-900">{app.buildingCount}</span> bldgs,{' '}
                      <span className="font-semibold text-slate-900">{app.flatCount}</span> flats
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{app.applicantName}</p>
                      <p className="text-[11px] text-slate-400">{app.applicantEmail}</p>
                      <p className="text-[11px] text-slate-400">{app.applicantPhone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {app.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => { setSelectedApp(app); setActionType('approve'); }}
                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => { setSelectedApp(app); setActionType('reject'); }}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold rounded-lg text-xs transition border border-rose-200"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => { setSelectedApp(app); setActionType(null); }}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold rounded-lg text-xs transition"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Decision Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Application Review</h3>
                <p className="text-xs text-slate-500">{selectedApp.societyName}</p>
              </div>
              <button
                onClick={() => { setSelectedApp(null); setActionType(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-400">Registration Number:</span>
                <span className="font-mono font-bold text-slate-900">{selectedApp.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span>{selectedApp.addressLine}, {selectedApp.city}, {selectedApp.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Infrastructure:</span>
                <span>{selectedApp.buildingCount} Buildings, ~{selectedApp.flatCount} Flats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Applicant:</span>
                <span className="font-medium text-slate-900">{selectedApp.applicantName} ({selectedApp.applicantEmail})</span>
              </div>
              {selectedApp.documentUrl && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-400">Attached Deed/Cert:</span>
                  <a
                    href={selectedApp.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Document</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {actionType === 'approve' && (
              <div className="space-y-3 mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-900">Approve & Provision Workspace</p>
                <p className="text-[11px] text-emerald-700">
                  Approving will generate an isolated society workspace and create the <strong>SOCIETY_ADMIN</strong> account for {selectedApp.applicantEmail}.
                </p>
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-900 mb-1">Temporary Admin Password</label>
                  <input
                    type="text"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {actionType === 'reject' && (
              <div className="space-y-3 mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200">
                <p className="text-xs font-bold text-rose-900">Reject Application</p>
                <p className="text-[11px] text-rose-700">Please provide a specific reason explaining why this application was denied.</p>
                <div>
                  <label className="block text-[11px] font-semibold text-rose-900 mb-1">Rejection Reason</label>
                  <textarea
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Registration document illegible or mismatch in society address"
                    className="w-full bg-white border border-rose-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setSelectedApp(null); setActionType(null); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Close
              </button>

              {actionType === 'approve' && (
                <button
                  type="button"
                  disabled={processing}
                  onClick={handleApprove}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
                >
                  {processing ? 'Provisioning...' : 'Confirm Approval & Provision Workspace'}
                </button>
              )}

              {actionType === 'reject' && (
                <button
                  type="button"
                  disabled={processing}
                  onClick={handleReject}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
                >
                  {processing ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
