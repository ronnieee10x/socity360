import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Users, Shield, CheckCircle, ChevronDown } from 'lucide-react';
import api from '../../services/api';

interface DemoAccount {
  label: string;
  email: string;
  role: UserRole;
  society: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { label: 'Super Admin', email: 'superadmin@society360.io', role: 'PLATFORM_SUPER_ADMIN', society: 'Global' },
  { label: 'Society Admin', email: 'admin@greenfield.com', role: 'SOCIETY_ADMIN', society: 'Greenfield Heights' },
  { label: 'Committee Member', email: 'treasurer@greenfield.com', role: 'COMMITTEE_MEMBER', society: 'Greenfield Heights' },
  { label: 'Flat Owner', email: 'owner@greenfield.com', role: 'FLAT_OWNER', society: 'Greenfield (A-502)' },
  { label: 'Resident Tenant', email: 'tenant@greenfield.com', role: 'TENANT', society: 'Greenfield (B-201)' },
  { label: 'Security Guard', email: 'guard@greenfield.com', role: 'SECURITY_GUARD', society: 'Main Gate' },
  { label: 'Maintenance Staff', email: 'staff@greenfield.com', role: 'MAINTENANCE_STAFF', society: 'Facilities' },
];

export const RoleSwitcher: React.FC = () => {
  const { user, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = async (email: string) => {
    try {
      setIsSwitching(true);
      const res = await api.post('/auth/login', {
        email,
        password: 'Password@123',
      });
      if (res.data?.success && res.data?.data) {
        const { accessToken, refreshToken, user: userData } = res.data.data;
        login(accessToken, refreshToken, userData);
        setIsOpen(false);
      }
    } catch (err) {
      console.error('Failed to switch demo account', err);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition shadow-sm"
        title="Switch user role for project viva demonstration"
      >
        <Users className="w-3.5 h-3.5 text-emerald-600" />
        <span>Switch Demo Role</span>
        <ChevronDown className="w-3 h-3 text-emerald-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-slate-100 z-50">
          <div className="p-3 bg-slate-900 text-white rounded-t-xl">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Viva Showcase Role Switcher</p>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Instant 1-click authentication across all 7 platform roles</p>
          </div>

          <div className="p-1 max-h-72 overflow-y-auto">
            {DEMO_ACCOUNTS.map((acc) => {
              const isCurrent = user?.email === acc.email;
              return (
                <button
                  key={acc.email}
                  disabled={isSwitching}
                  onClick={() => handleSwitch(acc.email)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                    isCurrent
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span>{acc.label}</span>
                      {isCurrent && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-slate-400">{acc.society}</p>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {acc.role.replace(/_/g, ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
