import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  PieChart as PieIcon,
  TrendingUp,
  Building,
  Users,
  Wrench,
  Shield,
  Receipt,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/overview');
        setData(res.data?.data || null);
      } catch (err) {
        console.error('Failed to load society analytics', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const OCCUPANCY_COLORS = ['#4f46e5', '#06b6d4', '#94a3b8'];
  const CATEGORY_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <PieIcon className="w-6 h-6 text-indigo-600" />
            Executive Society Analytics & Telemetry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time business intelligence: financial health, occupancy ratio, service MTTR, and security telemetry.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Occupancy Rate</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">
            {data?.occupancyPercentage || 0}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {data?.occupiedFlats || 0} of {data?.totalFlats || 0} flats occupied
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Collection Ratio</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-3">
            {data?.collectionPercentage || 0}%
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">
            ₹{Number(data?.totalCollected || 0).toLocaleString()} realized
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Resolution Rate</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-3">
            {data?.totalComplaints > 0
              ? Math.round(((data.resolvedComplaints || 0) / data.totalComplaints) * 100)
              : 100}
            %
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {data?.openComplaints || 0} open / {data?.totalComplaints || 0} total tickets
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Gate Footfall Today</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-800 mt-3">
            {data?.totalVisitorsToday || 0}
          </div>
          <p className="text-[11px] text-amber-600 mt-1">
            {data?.activeVisitorsNow || 0} visitors currently on campus
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Collections Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Maintenance Billing vs. Digital Collections
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.financialTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="billed" name="Billed Assessment (₹)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Realized Collections (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Ratio Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Flat Occupancy Ratio
          </h2>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.occupancyDistribution || []}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                >
                  {(data?.occupancyDistribution || []).map((_: any, idx: number) => (
                    <Cell key={`cell-${idx}`} fill={OCCUPANCY_COLORS[idx % OCCUPANCY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Flats`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint Categories Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-600" />
            Maintenance Ticket Distribution by Domain
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.complaintCategories || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} width={120} />
                <Tooltip
                  formatter={(val: any) => [`${val} Complaints`, 'Count']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminAnalyticsPage;
