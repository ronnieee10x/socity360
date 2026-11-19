import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Society } from '../../types';
import {
  Building2,
  ShieldAlert,
  CheckCircle,
  Ban,
  Search,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const SocietiesListPage: React.FC = () => {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);
  const [statusReason, setStatusReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchSocieties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/societies');
      if (res.data?.success) {
        setSocieties(res.data.data);
      }
    } catch (err: any) {
      setError('Failed to fetch societies list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocieties();
  }, []);

  const handleToggleStatus = async (society: Society) => {
    const newStatus = society.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setProcessing(true);
    try {
      const res = await api.patch(`/super-admin/societies/${society.id}/status`, {
        status: newStatus,
        reason: statusReason || `Administrative ${newStatus.toLowerCase()} action by Super Admin`,
      });
      if (res.data?.success) {
        setSelectedSociety(null);
        setStatusReason('');
        fetchSocieties();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Status update failed');
    } finally {
      setProcessing(false);
    }
  };

  const filtered = societies.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Registered Housing Societies</h2>
          <p className="text-xs text-slate-500 mt-0.5">Active multi-tenant society workspaces and operational statuses</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search society, code, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
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

      {/* Grid of Society Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">Loading society workspaces...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">No societies registered yet.</div>
        ) : (
          filtered.map((society) => (
            <div
              key={society.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      society.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {society.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{society.name}</h3>
                <p className="font-mono text-[11px] text-emerald-600 font-semibold mt-0.5">{society.code}</p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{society.city}, {society.state} - {society.pinCode}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Reg No: {society.registrationNumber}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Workspace Active</span>
                {society.status === 'ACTIVE' ? (
                  <button
                    onClick={() => setSelectedSociety(society)}
                    className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs rounded-lg transition border border-rose-200"
                  >
                    Suspend Society
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedSociety(society)}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs rounded-lg transition border border-emerald-200"
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedSociety && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {selectedSociety.status === 'ACTIVE' ? 'Suspend Society Workspace' : 'Reactivate Society Workspace'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedSociety.name} ({selectedSociety.code})
            </p>

            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 mb-4 border border-slate-200">
              {selectedSociety.status === 'ACTIVE' ? (
                <p>
                  <strong>Warning:</strong> Suspending this society will immediately block all logins and API access for its Society Admin, committee members, residents, and staff.
                </p>
              ) : (
                <p>
                  Reactivating will restore normal operational access to this society workspace immediately.
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Audit Log Note</label>
              <input
                type="text"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="e.g. Annual renewal pending / Audit verified"
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSociety(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={() => handleToggleStatus(selectedSociety)}
                className={`px-5 py-2 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 ${
                  selectedSociety.status === 'ACTIVE'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {processing ? 'Updating...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
