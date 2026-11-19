import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Building2,
  FileCheck2,
  Users,
  ShieldAlert,
  History,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface Stats {
  totalSocieties: number;
  activeSocieties: number;
  suspendedSocieties: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalPlatformUsers: number;
}

export const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/dashboard');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load super admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Global SaaS Platform Operator
          </div>
          <h2 className="text-xl font-bold tracking-tight">Platform Governance & Multi-Tenant Oversight</h2>
          <p className="text-slate-400 text-xs mt-1">Cross-tenant monitoring, society onboarding verification, and system security logs</p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/super-admin/applications"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Applications Queue</span>
          </Link>
          <Link
            to="/super-admin/societies"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-700"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Societies</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Societies</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalSocieties ?? 0}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {stats?.activeSocieties ?? 0} Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{stats?.suspendedSocieties ?? 0} suspended workspaces</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pending Applications</span>
            <FileCheck2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{stats?.pendingApplications ?? 0}</span>
            <span className="text-xs font-medium text-slate-500">Requires Review</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{stats?.approvedApplications ?? 0} approved to date</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Platform Users</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalPlatformUsers ?? 0}</span>
            <span className="text-xs font-medium text-emerald-600">Across All Tenants</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">7 distinct operational roles</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Application Rejections</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.rejectedApplications ?? 0}</span>
            <span className="text-xs font-medium text-slate-400">Rejected Applications</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">With audit rationale logged</p>
        </div>
      </div>

      {/* Actionable Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding Queue Alert */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Society Onboarding Verification</h3>
            </div>
            <Link
              to="/super-admin/applications"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(stats?.pendingApplications ?? 0) > 0 ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>{stats?.pendingApplications} pending application(s)</strong> awaiting document review and workspace provisioning.
                </span>
              </div>
              <Link
                to="/super-admin/applications?status=PENDING"
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs shrink-0 hover:bg-amber-700 transition"
              >
                Review Now
              </Link>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
              <p>All society onboarding applications have been processed and reviewed.</p>
            </div>
          )}
        </div>

        {/* Security & Audit Logs Quick Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-slate-700" />
              <h3 className="font-bold text-slate-900 text-sm">Security & Administrative Auditing</h3>
            </div>
            <Link
              to="/super-admin/audit-logs"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Full Audit Trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every administrative approval, tenant workspace suspension, and security violation triggers an immutable structured audit log recording the actor UUID, IP address, timestamp, and target entity.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">Audit Record Immutability:</span>
            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              ENFORCED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
