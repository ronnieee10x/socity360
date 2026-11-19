import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { VisitorEntryResponseDto } from '../../types';
import {
  DoorOpen,
  Plus,
  KeyRound,
  CheckCircle2,
  Clock,
  Phone,
  AlertCircle,
  Copy
} from 'lucide-react';

export const ResidentVisitorsPage: React.FC = () => {
  const [visitors, setVisitors] = useState<VisitorEntryResponseDto[]>([]);
  const [myOccupancy, setMyOccupancy] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createdPass, setCreatedPass] = useState<VisitorEntryResponseDto | null>(null);

  const [formData, setFormData] = useState({
    visitorName: '',
    phoneNumber: '',
    purpose: 'GUEST',
    vehicleNumber: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [occRes, visRes] = await Promise.all([
        api.get('/residents/my-occupancy').catch(() => ({ data: { data: null } })),
        api.get('/visitors/my-visitors').catch(() => ({ data: { data: [] } })),
      ]);

      const occ = occRes.data?.data;
      setMyOccupancy(occ);
      setVisitors(visRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load resident visitors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePreApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myOccupancy?.flatId) return;

    try {
      const res = await api.post('/visitors/pre-approve', {
        flatId: myOccupancy.flatId,
        ...formData,
      });

      if (res.data?.success) {
        setCreatedPass(res.data.data);
        setFormData({ visitorName: '', phoneNumber: '', purpose: 'GUEST', vehicleNumber: '' });
        loadData();
      }
    } catch (err) {
      console.error('Failed to pre-approve visitor', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Visitor Passes & Gate Approvals</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Host Flat: <span className="font-bold text-slate-800">{myOccupancy ? `Flat ${myOccupancy.flatNumber} (${myOccupancy.buildingName})` : 'A-502'}</span>
          </p>
        </div>

        <button
          onClick={() => { setShowModal(true); setCreatedPass(null); }}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate Guest Pass</span>
        </button>
      </div>

      {/* Visitor History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Visitor Log History</h3>
          <span className="text-xs text-slate-500">{visitors.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Visitor</th>
                <th className="px-5 py-3.5">Purpose</th>
                <th className="px-5 py-3.5">Pass / PIN</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Check-In</th>
                <th className="px-5 py-3.5">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">Loading visitor logs...</td>
                </tr>
              ) : visitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">No visitors logged for your flat yet.</td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{v.visitorName}</p>
                      <p className="text-[11px] font-mono text-slate-400">{v.phoneNumber}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-700">{v.purpose}</span>
                      <p className="text-[10px] text-slate-400">{v.entryType}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {v.passCode ? (
                        <span className="font-mono text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {v.passCode}
                        </span>
                      ) : (
                        <span className="text-slate-400">Walk-in</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          v.status === 'CHECKED_IN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'CHECKED_OUT'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 text-[11px]">
                      {v.checkInTime ? new Date(v.checkInTime).toLocaleString() : 'Expected'}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 text-[11px]">
                      {v.durationString || (v.status === 'CHECKED_IN' ? 'In Progress' : '—')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Pre-Approved Pass Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            {createdPass ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Guest Pass Generated!</h3>
                <p className="text-xs text-slate-500 mb-6">Share this 6-digit PIN code with {createdPass.visitorName} to show at the gate</p>

                <div className="bg-slate-950 rounded-2xl p-6 text-white text-center border border-slate-800 mb-6">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 block mb-1">One-Time Gate PIN</span>
                  <span className="text-4xl font-mono font-black tracking-widest text-white">{createdPass.passCode}</span>
                  <p className="text-[11px] text-slate-400 mt-2">Valid for Flat {createdPass.flatNumber}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                  <h3 className="font-bold text-slate-900 text-base">Generate Pre-Approved Pass</h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handlePreApproveSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Visitor Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Verma"
                      value={formData.visitorName}
                      onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Visitor Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98000 00000"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Purpose</label>
                      <select
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="GUEST">Guest / Family</option>
                        <option value="DELIVERY">Delivery</option>
                        <option value="CAB">Cab</option>
                        <option value="SERVICE_REPAIR">Service Technician</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Vehicle (Optional)</label>
                      <input
                        type="text"
                        placeholder="MH-12-CD-5678"
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 bg-emerald-500 text-white font-bold rounded-xl shadow-sm">
                      Create Pass & PIN
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
