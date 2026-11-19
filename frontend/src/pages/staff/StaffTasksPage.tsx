import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { ComplaintResponseDto } from '../../types';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Play,
  Phone,
  Building,
  User,
  AlertTriangle,
  Flame,
  Check,
  X,
  FileText
} from 'lucide-react';

export const StaffTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<ComplaintResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<ComplaintResponseDto | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints/assigned');
      setTasks(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load assigned work orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStartWork = async (taskId: string) => {
    try {
      await api.put(`/complaints/${taskId}/status`, {
        status: 'IN_PROGRESS',
        resolutionNotes: 'Technician arrived onsite and commenced diagnostic/repair work.'
      });
      loadTasks();
    } catch (err) {
      console.error('Failed to start task', err);
    }
  };

  const handleResolveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    try {
      setUpdating(true);
      await api.put(`/complaints/${selectedTask.id}/status`, {
        status: 'RESOLVED',
        resolutionNotes: resolutionNotes || 'Work completed and tested in resident presence.'
      });
      setShowResolveModal(false);
      setSelectedTask(null);
      setResolutionNotes('');
      loadTasks();
    } catch (err) {
      console.error('Failed to resolve task', err);
    } finally {
      setUpdating(false);
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
            <AlertTriangle className="w-3 h-3" /> High Priority
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-600" />
            Maintenance Technician Work Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your daily maintenance queue. Update progress, coordinate with residents, and log resolution notes.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl text-indigo-900 text-xs font-semibold">
          <span>Active Queue: {tasks.filter((t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length} Jobs</span>
        </div>
      </div>

      {/* Task Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">All Work Orders Completed!</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            You currently have no pending tasks assigned. Any new maintenance requests will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl p-6 border shadow-sm transition-all ${
                task.status === 'RESOLVED' || task.status === 'CLOSED'
                  ? 'border-slate-100 opacity-75'
                  : task.priority === 'URGENT'
                  ? 'border-rose-200 ring-1 ring-rose-100'
                  : 'border-slate-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                      {task.ticketNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase">{task.category}</span>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2">{task.title}</h3>
                </div>

                <div>
                  {task.status === 'IN_PROGRESS' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                      <Wrench className="w-3 h-3 animate-spin" /> In Progress
                    </span>
                  ) : task.status === 'RESOLVED' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3" /> Assigned
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {task.description}
              </p>

              {/* Residence and Contact */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Building className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Flat {task.flatNumber} ({task.buildingName})</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{task.createdByName}</span>
                </div>
                {task.createdByPhone && (
                  <div className="col-span-2 flex items-center gap-1.5 text-slate-500 font-mono mt-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{task.createdByPhone}</span>
                  </div>
                )}
              </div>

              {task.resolutionNotes && (
                <div className="mt-3 text-xs bg-emerald-50/60 border border-emerald-100 p-2.5 rounded-lg text-emerald-800">
                  <span className="font-bold">Resolution Notes: </span>
                  <span>{task.resolutionNotes}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                {task.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleStartWork(task.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Work
                  </button>
                )}

                {task.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowResolveModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolution Notes Modal */}
      {showResolveModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Complete Work Order
              </h2>
              <button
                onClick={() => setShowResolveModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveTask} className="p-6 space-y-4">
              <div className="text-xs text-slate-500">
                Ticket <span className="font-mono font-bold text-slate-800">{selectedTask.ticketNumber}</span> —{' '}
                {selectedTask.title} (Flat {selectedTask.flatNumber})
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resolution Notes *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail the root cause and repair action (e.g. Replaced faulty washer, tightened flange bolt, tested water pressure)..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default StaffTasksPage;
