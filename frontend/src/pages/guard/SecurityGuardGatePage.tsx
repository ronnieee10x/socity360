import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { VisitorEntryResponseDto } from '../../types';
import {
  Shield,
  KeyRound,
  UserPlus,
  DoorOpen,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Car,
  AlertCircle
} from 'lucide-react';

export const SecurityGuardGatePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verify' | 'walkin' | 'active'>('verify');
  const [activeVisitors, setActiveVisitors] = useState<VisitorEntryResponseDto[]>([]);
  const [expectedVisitors, setExpectedVisitors] = useState<VisitorEntryResponseDto[]>([]);
  const [flats, setFlats] = useState<any[]>([]);

  // Verification PIN
  const [passCode, setPassCode] = useState('');

  // Walk-in form
  const [walkin, setWalkin] = useState({
    flatId: '',
    visitorName: '',
    phoneNumber: '',
    purpose: 'GUEST',
    vehicleNumber: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadGateData = async () => {
    try {
      const [activeRes, expectedRes, flatsRes] = await Promise.all([
        api.get('/visitors/active'),
        api.get('/visitors/expected'),
        api.get('/flats'),
      ]);
      setActiveVisitors(activeRes.data?.data || []);
      setExpectedVisitors(expectedRes.data?.data || []);
      setFlats(flatsRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load gate data', err);
    }
  };

  useEffect(() => {
    loadGateData();
  }, []);

  const handleVerifyPassCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passCode || passCode.length < 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit numerical pass code' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/visitors/check-in', { passCode: passCode.trim() });
      if (res.data?.success) {
        setMessage({
          type: 'success',
          text: `Entry Authorized: ${res.data.data.visitorName} for Flat ${res.data.data.flatNumber}`,
        });
        setPassCode('');
        loadGateData();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Invalid or expired pass code' });
    } finally {
      setLoading(false);
    }
  };

  const handleWalkinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkin.flatId || !walkin.visitorName || !walkin.phoneNumber) {
      setMessage({ type: 'error', text: 'Please fill in flat, visitor name, and phone number' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/visitors/check-in', walkin);
      if (res.data?.success) {
        setMessage({
          type: 'success',
          text: `Walk-in visitor ${res.data.data.visitorName} checked in for Flat ${res.data.data.flatNumber}`,
        });
        setWalkin({
          flatId: '',
          visitorName: '',
          phoneNumber: '',
          purpose: 'GUEST',
          vehicleNumber: '',
        });
        loadGateData();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Check-in failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (visitorId: string) => {
    try {
      const res = await api.post(`/visitors/${visitorId}/check-out`);
      if (res.data?.success) {
        setMessage({
          type: 'success',
          text: `Visitor exit recorded. Visit duration: ${res.data.data.durationString || 'completed'}`,
        });
        loadGateData();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Check-out failed' });
    }
  };

  return (
    <div className="space-y-6">
      {/* High-Contrast Guard Gate Header */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Main Perimeter Gate</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Security Guard Gate Console</h2>
          <p className="text-xs text-slate-400 mt-1">High-speed verification, walk-in registration, and active visitor roster</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center">
            <p className="text-xl font-black text-emerald-400">{activeVisitors.length}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Active On Premise</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center">
            <p className="text-xl font-black text-teal-400">{expectedVisitors.length}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Expected Passes</p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => { setActiveTab('verify'); setMessage(null); }}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'verify'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Verify 6-Digit Pass Code</span>
        </button>
        <button
          onClick={() => { setActiveTab('walkin'); setMessage(null); }}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'walkin'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Walk-In Registration</span>
        </button>
        <button
          onClick={() => { setActiveTab('active'); setMessage(null); }}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'active'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DoorOpen className="w-4 h-4" />
          <span>Active Visitors ({activeVisitors.length})</span>
        </button>
      </div>

      {/* Tab 1: Pass Code Verification */}
      {activeTab === 'verify' && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Enter 6-Digit Visitor Pass Code</h3>
          <p className="text-xs text-slate-500 mb-6">Ask guest for the pre-approved 6-digit numeric OTP generated by resident</p>

          <form onSubmit={handleVerifyPassCode} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              autoFocus
              value={passCode}
              onChange={(e) => setPassCode(e.target.value.replace(/\D/g, ''))}
              placeholder="0 0 0 0 0 0"
              className="w-full text-center tracking-[0.5em] font-mono text-2xl font-black py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || passCode.length < 6}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Authorize Entry'}
            </button>
          </form>

          {expectedVisitors.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100 text-left">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Expected Guests for Today:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {expectedVisitors.map((v) => (
                  <div key={v.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{v.visitorName}</span>
                      <span className="text-slate-500 ml-2">$\to$ Flat {v.flatNumber}</span>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{v.phoneNumber}</p>
                    </div>
                    <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      PIN: {v.passCode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Walk-In Registration */}
      {activeTab === 'walkin' && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">New Walk-In Visitor Entry</h3>
          <p className="text-xs text-slate-500 mb-6">Register guests, food/parcel delivery, cabs, or service technicians</p>

          <form onSubmit={handleWalkinSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destination Flat</label>
              <select
                required
                value={walkin.flatId}
                onChange={(e) => setWalkin({ ...walkin, flatId: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Select Flat</option>
                {flats.map((f) => (
                  <option key={f.id} value={f.id}>
                    Flat {f.flatNumber} ({f.buildingName} - {f.wingName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Visitor Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Amit Kumar"
                value={walkin.visitorName}
                onChange={(e) => setWalkin({ ...walkin, visitorName: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98000 00000"
                value={walkin.phoneNumber}
                onChange={(e) => setWalkin({ ...walkin, phoneNumber: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visit Purpose</label>
                <select
                  value={walkin.purpose}
                  onChange={(e) => setWalkin({ ...walkin, purpose: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="GUEST">Guest / Family</option>
                  <option value="DELIVERY">Delivery / Courier</option>
                  <option value="CAB">Cab / Ride Share</option>
                  <option value="SERVICE_REPAIR">Service / Repair</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle No (Optional)</label>
                <input
                  type="text"
                  placeholder="MH-12-AB-1234"
                  value={walkin.vehicleNumber}
                  onChange={(e) => setWalkin({ ...walkin, vehicleNumber: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-emerald-500/20 disabled:opacity-50 mt-2"
            >
              {loading ? 'Recording Entry...' : 'Record Walk-In Entry & Check-In'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Active Visitors Inside Premises */}
      {activeTab === 'active' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Visitors Currently Inside Society Premises</h3>
            <span className="text-xs font-semibold text-emerald-600">{activeVisitors.length} Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Visitor</th>
                  <th className="px-5 py-3.5">Host Flat</th>
                  <th className="px-5 py-3.5">Purpose & Type</th>
                  <th className="px-5 py-3.5">Entry Time</th>
                  <th className="px-5 py-3.5">Vehicle</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">No visitors currently on premise.</td>
                  </tr>
                ) : (
                  activeVisitors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{v.visitorName}</p>
                        <p className="text-[11px] font-mono text-slate-400">{v.phoneNumber}</p>
                      </td>
                      <td className="px-5 py-3.5 font-black text-slate-900 text-sm">
                        Flat {v.flatNumber}
                        <p className="font-normal text-[11px] text-slate-400">{v.buildingName}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 text-[10px]">
                          {v.purpose}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{v.entryType}</p>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600 text-[11px]">
                        {v.checkInTime ? new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600">
                        {v.vehicleNumber || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleCheckOut(v.id)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition inline-flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Check Out</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
