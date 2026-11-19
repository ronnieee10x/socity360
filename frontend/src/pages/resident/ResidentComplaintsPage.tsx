import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { ComplaintResponseDto } from '../../types';
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  User,
  Phone,
  FileText,
  X,
  Building,
  Info
} from 'lucide-react';

export const ResidentComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintResponseDto[]>([]);
  const [myOccupancy, setMyOccupancy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'PLUMBING',
    priority: 'MEDIUM',
    description: '',
    photoUrl: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [occRes, compRes] = await Promise.all([
        api.get('/residents/my-occupancy').catch(() => ({ data: { data: null } })),
        api.get('/complaints/my').catch(() => ({ data: { data: [] } }))
      ]);

      setMyOccupancy(occRes.data?.data || null);
      setComplaints(compRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load resident complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myOccupancy?.flatId) {
      setErrorMsg('You must have an approved flat occupancy before filing complaints.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await api.post('/complaints', {
        flatId: myOccupancy.flatId,
        ...formData
      });

      setShowModal(false);
      setFormData({
        title: '',
        category: 'PLUMBING',
        priority: 'MEDIUM',
        description: '',
        photoUrl: ''
      });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to file complaint');
    } finally {
      setSubmitting(false);
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
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-600" />
            Maintenance & Complaints
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Log maintenance issues, track real-time resolution status, and view service technician notes.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          Log New Complaint
        </button>
      </div>

      {/* Flat banner */}
      {myOccupancy && (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-indigo-900 text-sm">
          <Building className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <span className="font-semibold">Associated Residence: </span>
            Flat {myOccupancy.flatNumber || 'N/A'} ({myOccupancy.buildingName || 'Tower A'}, {myOccupancy.wingName || 'Wing'}) • Role: {myOccupancy.occupancyType}
          </div>
        </div>
      )}

      {/* Complaints List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Complaints Logged</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Everything in your flat is operating smoothly! If you face plumbing, electrical, or lift issues, click below.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> Log First Complaint
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                      {c.ticketNumber}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                      {c.category}
                    </span>
                    {getPriorityBadge(c.priority)}
                    {getStatusBadge(c.status)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.description}</p>
                </div>

                {/* Status card on right */}
                <div className="w-full md:w-64 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-2 shrink-0">
                  <div className="text-slate-500 font-medium">Assignment & Progress</div>
                  {c.assignedToName ? (
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span>{c.assignedToName}</span>
                    </div>
                  ) : (
                    <div className="text-amber-700 italic flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Pending technician assignment
                    </div>
                  )}

                  {c.resolutionNotes && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <div className="text-slate-500 font-medium">Technician Notes:</div>
                      <div className="text-slate-700 mt-0.5 italic">{c.resolutionNotes}</div>
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-200 text-slate-400">
                    Logged: {new Date(c.createdAt).toLocaleDateString()} at{' '}
                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {c.resolvedAt && (
                    <div className="text-emerald-700 font-medium">
                      Resolved: {new Date(c.resolvedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Log Maintenance Complaint</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master bathroom tap leaking continuously"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="PLUMBING">Plumbing</option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="CARPENTRY">Carpentry</option>
                    <option value="CIVIL">Civil / Masonry</option>
                    <option value="LIFT">Lift & Elevator</option>
                    <option value="SECURITY">Security & Access</option>
                    <option value="HOUSEKEEPING">Housekeeping</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent / Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the problem, location inside the flat, and preferred inspection time..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Photo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ResidentComplaintsPage;
