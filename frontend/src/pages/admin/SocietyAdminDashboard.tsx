import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Building,
  Home,
  Users,
  ShieldAlert,
  Wrench,
  Receipt,
  TrendingUp,
  ArrowRight,
  Plus,
  DoorOpen,
  CalendarCheck
} from 'lucide-react';

export const SocietyAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalFlats: 0,
    occupiedFlats: 0,
    vacantFlats: 0,
    pendingVerifications: 2,
    openComplaints: 3,
    activeVisitors: 4,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        const [bldgsRes, flatsRes] = await Promise.all([
          api.get('/buildings'),
          api.get('/flats'),
        ]);

        const buildings = bldgsRes.data?.data || [];
        const flats = flatsRes.data?.data || [];

        const occupied = flats.filter((f: any) => f.occupancyStatus !== 'VACANT').length;
        const vacant = flats.filter((f: any) => f.occupancyStatus === 'VACANT').length;

        setStats((prev) => ({
          ...prev,
          totalBuildings: buildings.length,
          totalFlats: flats.length,
          occupiedFlats: occupied,
          vacantFlats: vacant,
        }));
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadOverview();
  }, []);

  const occupancyRate = stats.totalFlats > 0
    ? Math.round((stats.occupiedFlats / stats.totalFlats) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Tenant Workspace
          </div>
          <h2 className="text-xl font-bold tracking-tight">{user?.societyName || 'Residential Society'}</h2>
          <p className="text-slate-400 text-xs mt-1">Tenant Code: <span className="font-mono text-emerald-400">{user?.societyCode || 'ACTIVE'}</span></p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/properties"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Manage Properties</span>
          </Link>
          <Link
            to="/admin/residents"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-700"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Resident KYC</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Buildings & Flats</span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalFlats}</span>
            <span className="text-xs font-medium text-slate-500">across {stats.totalBuildings} towers</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{stats.vacantFlats} flats currently vacant</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Occupancy Rate</span>
            <Home className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{occupancyRate}%</span>
            <span className="text-xs font-medium text-slate-500">{stats.occupiedFlats} Occupied</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${occupancyRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">KYC Verifications</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{stats.pendingVerifications}</span>
            <span className="text-xs font-medium text-slate-500">Pending Review</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Owners & Tenants awaiting approval</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Visitors</span>
            <DoorOpen className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.activeVisitors}</span>
            <span className="text-xs font-medium text-emerald-600">On Premise Now</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Logged by Gate Security</p>
        </div>
      </div>

      {/* Operational Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/admin/properties"
          className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition">Physical Property Setup</h3>
            <p className="text-xs text-slate-500 mt-1">Configure towers, add wings, floors, and register new flat units.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
            <span>Explore Properties</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/admin/residents"
          className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition">Resident Verification Queue</h3>
            <p className="text-xs text-slate-500 mt-1">Review deed and lease agreements to grant flat access to residents.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600">
            <span>Open Verification Queue</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/admin/finance"
          className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-900 transition">Invoicing & Financial Dues</h3>
            <p className="text-xs text-slate-500 mt-1">Generate monthly maintenance batch invoices and view collection records.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Manage Finances</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>
    </div>
  );
};
