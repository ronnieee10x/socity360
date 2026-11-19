import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleSwitcher } from './RoleSwitcher';
import { Building2, LogOut, ShieldCheck, UserCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-emerald-400 font-black text-lg shadow-sm">
            360
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">Society360</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
              Multi-Tenant SaaS
            </span>
          </div>
        </div>

        {/* Tenant Scope Badge */}
        {user?.societyName && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="max-w-[200px] truncate">{user.societyName}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Viva Demo Role Switcher */}
        <RoleSwitcher />

        {/* User Info & Role Badge */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900">{user.fullName}</span>
              <div className="flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] font-semibold text-emerald-700">
                  {user.role.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
              <UserCircle className="w-5 h-5" />
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
