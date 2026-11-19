import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDefaultDashboardForRole } from '../../routes/ProtectedRoute';
import api from '../../services/api';
import { Shield, Sparkles, Building2, User, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';

interface DemoAccount {
  label: string;
  email: string;
  role: string;
  society: string;
  desc: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { label: 'Platform Super Admin', email: 'superadmin@society360.io', role: 'PLATFORM_SUPER_ADMIN', society: 'Global Platform', desc: 'Approve society onboarding, review platform audits, manage tenants' },
  { label: 'Society Admin (President)', email: 'admin@greenfield.com', role: 'SOCIETY_ADMIN', society: 'Greenfield Heights', desc: 'Manage buildings, flats, resident verifications, billing & staff' },
  { label: 'Committee Member (Treasurer)', email: 'treasurer@greenfield.com', role: 'COMMITTEE_MEMBER', society: 'Greenfield Heights', desc: 'Review financial collections, dues ledger, audit records' },
  { label: 'Flat Owner (Resident)', email: 'owner@greenfield.com', role: 'FLAT_OWNER', society: 'Greenfield Heights (A-502)', desc: 'Pay maintenance bills, pre-approve guests, raise complaints' },
  { label: 'Resident Tenant', email: 'tenant@greenfield.com', role: 'TENANT', society: 'Greenfield Heights (B-201)', desc: 'Real-time gate approval, maintenance tickets, community notices' },
  { label: 'Security Guard', email: 'guard@greenfield.com', role: 'SECURITY_GUARD', society: 'Main Gate 1', desc: 'Check in walk-ins, verify 6-digit passes, log departures' },
  { label: 'Maintenance Technician', email: 'staff@greenfield.com', role: 'MAINTENANCE_STAFF', society: 'Facilities Team', desc: 'View assigned tasks, update repair progress, add notes' },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState<'demo' | 'standard'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email: loginEmail,
        password: loginPass,
      });

      if (res.data?.success && res.data?.data) {
        const { accessToken, refreshToken, user } = res.data.data;
        login(accessToken, refreshToken, user);
        navigate(getDefaultDashboardForRole(user.role));
      } else {
        setError(res.data?.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }
    executeLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Background glow decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-extrabold text-xl shadow-lg mb-4">
          360
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Society360</h2>
        <p className="mt-1 text-sm text-slate-400">
          One Platform. Every Society. Smarter Living.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4 relative z-10">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 mb-6">
            <button
              onClick={() => { setActiveTab('demo'); setError(null); }}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
                activeTab === 'demo'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Viva Showcase 1-Click Login</span>
            </button>
            <button
              onClick={() => { setActiveTab('standard'); setError(null); }}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
                activeTab === 'standard'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Standard Credentials</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'demo' ? (
            <div>
              <div className="mb-4 text-xs text-slate-400 flex items-center justify-between">
                <span>Select a role to test role-specific dashboards & workflows:</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Password: Password@123
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    disabled={loading}
                    onClick={() => executeLogin(acc.email, 'Password@123')}
                    className="group text-left p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800 transition flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-100 group-hover:text-emerald-400 transition">
                          {acc.label}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {acc.society}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{acc.desc}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-1">{acc.email}</p>
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500 transition">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleStandardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@society.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-sm transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Society360'}
              </button>
            </form>
          )}

          {/* Quick links footer */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <Link to="/landing" className="hover:text-emerald-400 transition flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/register-society" className="text-emerald-400 hover:underline">
                Register Your Society
              </Link>
              <span>•</span>
              <Link to="/register-resident" className="text-slate-300 hover:underline">
                Resident Join Request
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
