import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { ComplaintResponseDto } from '../../types';
import {
  Wrench,
  Search,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Filter,
  User,
  Phone,
  Building,
  CheckCircle,
  X
} from 'lucide-react';

export const AdminComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<any>({ total: 0, submitted: 0, inProgress: 0, resolved: 0 });

  // Assign Modal
  const [selectedTicket, setSelectedTicket] = useState<ComplaintResponseDto | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigneeId, setAssigneeId] = useState('');
  const [submittingAssign, setSubmittingAssign] = useState(false);

  // Status Modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [compRes, statRes] = await Promise.all([
        api.get(`/complaints${activeTab !== 'ALL' ? `?status=${activeTab}` : ''}`).catch(() => ({ data: { data: [] } })),
        api.get('/complaints/stats').catch(() => ({ data: { data: {} } }))
      ]);

      setComplaints(compRes.data?.data || []);
      setStats(statRes.data?.data || {});
    } catch (err) {
      console.error('Failed to load admin complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !assigneeId) return;

    try {
      setSubmittingAssign(true);
      await api.put(`/complaints/${selectedTicket.id}/assign`, {
        assignedToId: assigneeId
      });
      setShowAssignModal(false);
      setSelectedTicket(null);
      loadData();
    } catch (err) {
      console.error('Failed to assign staff', err);
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      setSubmittingStatus(true);
      await api.put(`/complaints/${selectedTicket.id}/status`, {
        status: newStatus,
        resolutionNotes: resolutionNotes
      });
      setShowStatusModal(false);
      setSelectedTicket(null);
      setResolutionNotes('');
      loadData();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setSubmittingStatus(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.ticketNumber.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      (c.flatNumber && c.flatNumber.toLowerCase().includes(q)) ||
      (c.createdByName && c.createdByName.toLowerCase().includes(q))
    );
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <Flame className="w-3 h-3" /> Urgent
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> High
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Medium
          </span>
        );
      case 'LOW':
        return (
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Submitted
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <User className="w-3 h-3" /> Assigned
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Wrench className="w-3 h-3" /> In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Closed
          </span>
        );
      default:
        return <span className="px-2 py-1 rounded text-xs bg-slate-100">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-indigo-600" />
              Complaints & Helpdesk Triage
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Oversee resident maintenance complaints, assign technical staff, and enforce service level agreements.
            </p>
          </div>
        </div>

        {/* KPI stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
            <div className="text-xs font-medium text-slate-500">Total Registered</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total || 0}</div>
          </div>
          <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-xl">
            <div className="text-xs font-medium text-amber-700">Pending Assignment</div>
            <div className="text-2xl font-bold text-amber-800 mt-1">{stats.submitted || 0}</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200/60 p-4 rounded-xl">
            <div className="text-xs font-medium text-indigo-700">Under Service</div>
            <div className="text-2xl font-bold text-indigo-800 mt-1">
              {(stats.assigned || 0) + (stats.inProgress || 0)}
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200/60 p-4 rounded-xl">
            <div className="text-xs font-medium text-emerald-700">Resolved / Closed</div>
            <div className="text-2xl font-bold text-emerald-800 mt-1">
              {(stats.resolved || 0) + (stats.closed || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {[
            { key: 'ALL', label: 'All Issues' },
            { key: 'SUBMITTED', label: 'Pending Assignment' },
            { key: 'ASSIGNED', label: 'Assigned' },
            { key: 'IN_PROGRESS', label: 'In Progress' },
            { key: 'RESOLVED', label: 'Resolved' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ticket, flat, resident..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700">No Complaints in This Category</h3>
            <p className="text-xs text-slate-400 mt-1">All tickets are either resolved or none have been submitted.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Residence & Reporter</th>
                  <th className="py-3 px-4">Issue Details</th>
                  <th className="py-3 px-4">Category & Priority</th>
                  <th className="py-3 px-4">Assigned Technician</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {c.ticketNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-indigo-500" />
                        Flat {c.flatNumber}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" /> {c.createdByName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 line-clamp-1">{c.title}</div>
                      <div className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{c.description}</div>
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded text-[10px] uppercase">
                        {c.category}
                      </span>
                      <div>{getPriorityBadge(c.priority)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {c.assignedToName ? (
                        <div className="flex items-center gap-1.5 font-medium text-slate-900">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{c.assignedToName}</span>
                        </div>
                      ) : (
                        <span className="text-amber-700 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(c.status)}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTicket(c);
                          setShowAssignModal(true);
                        }}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTicket(c);
                          setNewStatus(c.status === 'SUBMITTED' ? 'IN_PROGRESS' : c.status);
                          setResolutionNotes(c.resolutionNotes || '');
                          setShowStatusModal(true);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                Assign Technician
              </h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssign} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                <div className="font-semibold text-slate-800">{selectedTicket.ticketNumber} — {selectedTicket.title}</div>
                <div className="text-slate-500">Flat: {selectedTicket.flatNumber} • Category: {selectedTicket.category}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Maintenance Technician *
                </label>
                <div className="space-y-2">
                  <div
                    onClick={() => setAssigneeId('00000000-0000-0000-0000-000000000007')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      assigneeId === '00000000-0000-0000-0000-000000000007'
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900">Sunil Jadhav</div>
                      <div className="text-[11px] text-slate-500">Senior Technician (Plumbing, Electrical, Civil)</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      Available
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAssign || !assigneeId}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submittingAssign ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-600" />
                Update Ticket Status
              </h2>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="SUBMITTED">SUBMITTED (Pending)</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Technician Onsite)</option>
                  <option value="RESOLVED">RESOLVED (Work Completed)</option>
                  <option value="CLOSED">CLOSED (Verified by Resident)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resolution / Service Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Details of parts replaced, repairs completed, or inspection outcome..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingStatus}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submittingStatus ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminComplaintsPage;
