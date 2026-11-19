import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { NoticeResponseDto } from '../../types';
import {
  Bell,
  Plus,
  AlertTriangle,
  Calendar,
  Wrench,
  Flame,
  Info,
  Trash2,
  X,
  Megaphone,
  UserCheck
} from 'lucide-react';

export const NoticesPage: React.FC = () => {
  const { user } = useAuth();
  const isAdminOrCommittee = user?.role === 'SOCIETY_ADMIN' || user?.role === 'COMMITTEE_MEMBER';

  const [notices, setNotices] = useState<NoticeResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Broadcast Modal
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    noticeType: 'GENERAL',
    priority: 'NORMAL'
  });

  const loadNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notices');
      setNotices(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load notices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/notices', {
        title: formData.title,
        content: formData.content,
        noticeType: formData.noticeType,
        priority: formData.priority
      });
      setShowModal(false);
      setFormData({
        title: '',
        content: '',
        noticeType: 'GENERAL',
        priority: 'NORMAL'
      });
      loadNotices();
    } catch (err) {
      console.error('Failed to broadcast notice', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this circular?')) return;
    try {
      await api.delete(`/notices/${id}`);
      loadNotices();
    } catch (err) {
      console.error('Failed to delete notice', err);
    }
  };

  const urgentNotices = notices.filter((n) => n.priority === 'URGENT' || n.noticeType === 'EMERGENCY');

  const filteredNotices = notices.filter((n) =>
    activeFilter === 'ALL' ? true : n.noticeType === activeFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" />
            Official Notices & Circulars
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Society announcements, emergency broadcasts, utility shutdown notices, and community events.
          </p>
        </div>
        {isAdminOrCommittee && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            Broadcast Notice
          </button>
        )}
      </div>

      {/* Urgent Emergency Banner (if any) */}
      {urgentNotices.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl">
          <div className="flex items-start gap-3">
            <Flame className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                High Priority Advisory
              </span>
              <h3 className="text-base font-bold text-rose-900">{urgentNotices[0].title}</h3>
              <p className="text-xs text-rose-800 leading-relaxed">{urgentNotices[0].content}</p>
              <div className="text-[11px] text-rose-600 pt-1 font-medium">
                Published by {urgentNotices[0].publishedByName} on{' '}
                {new Date(urgentNotices[0].createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        {[
          { key: 'ALL', label: 'All Notices' },
          { key: 'GENERAL', label: 'General' },
          { key: 'MAINTENANCE', label: 'Maintenance & Water' },
          { key: 'EVENT', label: 'Events & Meetings' },
          { key: 'EMERGENCY', label: 'Emergencies' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notices Feed */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">No Circulars Published</h3>
          <p className="text-xs text-slate-400 mt-1">Check back later for community updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotices.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl p-6 border shadow-sm transition-all flex flex-col justify-between ${
                n.priority === 'URGENT' ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        n.noticeType === 'MAINTENANCE'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : n.noticeType === 'EVENT'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : n.noticeType === 'EMERGENCY'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {n.noticeType}
                    </span>
                    {n.priority === 'URGENT' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        Urgent
                      </span>
                    )}
                  </div>

                  {isAdminOrCommittee && (
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Archive notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{n.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">{n.content}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 font-medium text-slate-600">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{n.publishedByName}</span>
                </div>
                <span>{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                Broadcast Society Notice
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Circular Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Water Tank Sanitization on Saturday"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notice Category *
                  </label>
                  <select
                    value={formData.noticeType}
                    onChange={(e) => setFormData({ ...formData, noticeType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="GENERAL">General Bulletin</option>
                    <option value="MAINTENANCE">Maintenance & Utility</option>
                    <option value="EVENT">Event & Meeting</option>
                    <option value="EMERGENCY">Emergency Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="URGENT">Urgent Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Announcement Details *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Draft the official notification text..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish to Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default NoticesPage;
