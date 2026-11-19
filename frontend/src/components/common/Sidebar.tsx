import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building,
  Users,
  ShieldAlert,
  Wrench,
  Receipt,
  CalendarDays,
  Bell,
  Settings,
  Shield,
  FileCheck2,
  History,
  DoorOpen,
  PieChart
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const getNavItems = (): NavItem[] => {
    switch (user.role) {
      case 'PLATFORM_SUPER_ADMIN':
        return [
          { label: 'Platform Dashboard', to: '/super-admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Society Applications', to: '/super-admin/applications', icon: <FileCheck2 className="w-4 h-4" /> },
          { label: 'Registered Societies', to: '/super-admin/societies', icon: <Building className="w-4 h-4" /> },
          { label: 'Global Audit Logs', to: '/super-admin/audit-logs', icon: <History className="w-4 h-4" /> },
        ];
      case 'SOCIETY_ADMIN':
        return [
          { label: 'Overview', to: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Buildings & Flats', to: '/admin/properties', icon: <Building className="w-4 h-4" /> },
          { label: 'Resident KYC Queue', to: '/admin/residents', icon: <Users className="w-4 h-4" /> },
          { label: 'Visitor Logs', to: '/admin/visitors', icon: <ShieldAlert className="w-4 h-4" /> },
          { label: 'Complaints', to: '/admin/complaints', icon: <Wrench className="w-4 h-4" /> },
          { label: 'Invoicing & Dues', to: '/admin/finance', icon: <Receipt className="w-4 h-4" /> },
          { label: 'Facilities', to: '/admin/facilities', icon: <CalendarDays className="w-4 h-4" /> },
          { label: 'Notice Board', to: '/admin/notices', icon: <Bell className="w-4 h-4" /> },
          { label: 'Analytics', to: '/admin/analytics', icon: <PieChart className="w-4 h-4" /> },
          { label: 'Society Settings', to: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
        ];
      case 'COMMITTEE_MEMBER':
        return [
          { label: 'Committee Dashboard', to: '/committee/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Financial Collections', to: '/committee/finance', icon: <Receipt className="w-4 h-4" /> },
          { label: 'Resident Verifications', to: '/committee/residents', icon: <Users className="w-4 h-4" /> },
          { label: 'Complaints Oversight', to: '/committee/complaints', icon: <Wrench className="w-4 h-4" /> },
          { label: 'Facility Approvals', to: '/committee/facilities', icon: <CalendarDays className="w-4 h-4" /> },
          { label: 'Notice Bulletins', to: '/committee/notices', icon: <Bell className="w-4 h-4" /> },
        ];
      case 'FLAT_OWNER':
        return [
          { label: 'Owner Portal', to: '/resident/owner/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Pay Invoices', to: '/resident/owner/invoices', icon: <Receipt className="w-4 h-4" /> },
          { label: 'Pre-Approve Visitors', to: '/resident/owner/visitors', icon: <DoorOpen className="w-4 h-4" /> },
          { label: 'Raise Complaint', to: '/resident/owner/complaints', icon: <Wrench className="w-4 h-4" /> },
          { label: 'Book Amenities', to: '/resident/owner/facilities', icon: <CalendarDays className="w-4 h-4" /> },
          { label: 'Society Notices', to: '/resident/owner/notices', icon: <Bell className="w-4 h-4" /> },
        ];
      case 'TENANT':
        return [
          { label: 'Tenant Portal', to: '/resident/tenant/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Visitor Approvals', to: '/resident/tenant/visitors', icon: <DoorOpen className="w-4 h-4" /> },
          { label: 'Maintenance Tickets', to: '/resident/tenant/complaints', icon: <Wrench className="w-4 h-4" /> },
          { label: 'Book Amenities', to: '/resident/tenant/facilities', icon: <CalendarDays className="w-4 h-4" /> },
          { label: 'Notices & Alerts', to: '/resident/tenant/notices', icon: <Bell className="w-4 h-4" /> },
        ];
      case 'SECURITY_GUARD':
        return [
          { label: 'Gate Console', to: '/guard/gate', icon: <Shield className="w-4 h-4" /> },
          { label: 'Active Visitors', to: '/guard/active', icon: <DoorOpen className="w-4 h-4" /> },
          { label: 'Visitor History', to: '/guard/history', icon: <History className="w-4 h-4" /> },
        ];
      case 'MAINTENANCE_STAFF':
        return [
          { label: 'Assigned Work Orders', to: '/staff/tasks', icon: <Wrench className="w-4 h-4" /> },
          { label: 'Task History', to: '/staff/history', icon: <History className="w-4 h-4" /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Navigation Workspace</p>
        <p className="text-xs font-semibold text-emerald-400 mt-0.5">{user.role.replace(/_/g, ' ')}</p>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-emerald-500 text-white font-semibold shadow-sm shadow-emerald-500/20'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
        Society360 SaaS v1.0.0
      </div>
    </aside>
  );
};
