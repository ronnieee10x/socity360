import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Building2,
  Users,
  ShieldCheck,
  Receipt,
  CalendarDays,
  Wrench,
  DoorOpen,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  BarChart3
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="h-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 font-black text-xl shadow-lg">
            360
          </div>
          <div>
            <span className="font-extrabold text-xl text-white tracking-tight">Society360</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Enterprise SaaS
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-emerald-400 transition">Features</a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a>
          <a href="#roles" className="hover:text-emerald-400 transition">The 7 Roles</a>
          <a href="#security" className="hover:text-emerald-400 transition">Tenant Isolation</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            to="/register-society"
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <span>Register Society</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cloud-Native Multi-Tenant Residential Society Operating System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          One Platform. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Every Society.
          </span> Smarter Living.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Society360 delivers complete digital operations for gated communities: strict multi-tenant logical data isolation, high-speed gate security, automated maintenance invoicing, verified resident KYC, and real-time governance.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span>Explore 1-Click Viva Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register-society"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Onboard Your Society</span>
          </Link>
        </div>

        {/* Hero Metric Badges */}
        <div className="mt-16 pt-12 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <p className="text-2xl font-black text-white">100%</p>
            <p className="text-xs text-slate-400 mt-1">Tenant Logical Isolation</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <p className="text-2xl font-black text-emerald-400">7 Roles</p>
            <p className="text-xs text-slate-400 mt-1">Specialized Dashboards</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <p className="text-2xl font-black text-white">&lt; 2s</p>
            <p className="text-xs text-slate-400 mt-1">Gate Check-in Latency</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <p className="text-2xl font-black text-emerald-400">Zero Leak</p>
            <p className="text-xs text-slate-400 mt-1">Server-Side JWT Scoping</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Capabilities</h2>
          <p className="text-3xl font-extrabold text-white">Engineered for Modern Residential Communities</p>
          <p className="text-slate-400 text-sm mt-3">Replacing chaotic WhatsApp groups and paper registers with an auditable software system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">High-Speed Gate Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Walk-in visitor registration, 6-digit pre-approved guest passes, delivery check-ins, and automated visit duration calculations with anti-duplication concurrency locks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Billing & Invoicing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Batch maintenance invoice generation, flat-wise dues ledgers, simulated payment gateway with instant PDF receipt issuance, and financial audit reports.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Complaint Ticket Lifecycle</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full ticketing state machine (SUBMITTED $\to$ ASSIGNED $\to$ IN_PROGRESS $\to$ RESOLVED $\to$ CLOSED) with technician assignment, evidence photo uploads, and resolution tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Facility Anti-Double-Booking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pessimistic database write locks prevent simultaneous reservations of community halls, tennis courts, and party lawns with automated slot overlap verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Resident Onboarding & KYC</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Self-service join requests for Owners and Tenants with deed/lease verification queue, preventing unverified accounts from accessing protected society services.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Operational Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive charts for collection rates, ticket resolution time (MTTR), occupancy ratios, and visitor footfall trends tailored per role.
            </p>
          </div>
        </div>
      </section>

      {/* The 7 Roles Showcase */}
      <section id="roles" className="py-20 px-6 lg:px-12 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Role-Based Access Control</h2>
            <p className="text-3xl font-extrabold text-white">Seven Specialized Dashboards</p>
            <p className="text-slate-400 text-sm mt-3">Every user role receives a dedicated, customized layout and restricted API permissions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Platform Governance</span>
              <h4 className="text-base font-bold text-white mt-1">Platform Super Admin</h4>
              <p className="text-xs text-slate-400 mt-2">Evaluates incoming society applications, manages cross-tenant health, and audits global activity.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Society Leadership</span>
              <h4 className="text-base font-bold text-white mt-1">Society Admin</h4>
              <p className="text-xs text-slate-400 mt-2">Configures buildings, wings, flats, approves resident KYC, assigns maintenance staff, and runs billing.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Executive Oversight</span>
              <h4 className="text-base font-bold text-white mt-1">Committee Member</h4>
              <p className="text-xs text-slate-400 mt-2">Monitors financial collections, audits outstanding dues ledger, and reviews community complaints.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Property Owner</span>
              <h4 className="text-base font-bold text-white mt-1">Flat Owner</h4>
              <p className="text-xs text-slate-400 mt-2">Pays maintenance dues, issues pre-approved guest passes, participates in society polls, and logs complaints.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Residing Resident</span>
              <h4 className="text-base font-bold text-white mt-1">Resident Tenant</h4>
              <p className="text-xs text-slate-400 mt-2">Approves walk-in visitors in real time, reserves amenities, submits maintenance tickets, and views notices.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Perimeter Security</span>
              <h4 className="text-base font-bold text-white mt-1">Security Guard</h4>
              <p className="text-xs text-slate-400 mt-2">High-contrast console to verify 6-digit visitor passes, register walk-ins, log deliveries, and record exit timestamps.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Facility Operations</span>
              <h4 className="text-base font-bold text-white mt-1">Maintenance Staff</h4>
              <p className="text-xs text-slate-400 mt-2">Mobile-friendly task queue: update ticket status, upload resolution notes, and complete work orders.</p>
            </div>
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-center text-center">
              <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-emerald-400">1-Click Role Switcher</h4>
              <p className="text-[11px] text-slate-300 mt-1">Experience all 7 roles instantly during viva evaluation.</p>
              <Link to="/login" className="mt-3 text-xs font-bold text-white underline hover:text-emerald-300">
                Launch Demo Login $\to$
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Workflow</h2>
          <p className="text-3xl font-extrabold text-white">How Society Onboarding Works</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <span className="text-3xl font-black text-slate-700">01</span>
            <h4 className="text-base font-bold text-white mt-2">Application Submitted</h4>
            <p className="text-xs text-slate-400 mt-2">Representative enters society details, registration certificate, and flat counts.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <span className="text-3xl font-black text-slate-700">02</span>
            <h4 className="text-base font-bold text-white mt-2">Super Admin Audit</h4>
            <p className="text-xs text-slate-400 mt-2">Platform operator verifies legal documents, approvals, and provisions tenant workspace.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <span className="text-3xl font-black text-slate-700">03</span>
            <h4 className="text-base font-bold text-white mt-2">Property Setup</h4>
            <p className="text-xs text-slate-400 mt-2">Society Admin configures towers, wings, floors, and registers flats.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <span className="text-3xl font-black text-slate-700">04</span>
            <h4 className="text-base font-bold text-white mt-2">Resident KYC & Live</h4>
            <p className="text-xs text-slate-400 mt-2">Residents join and are verified; smart gate and billing operations begin immediately.</p>
          </div>
        </div>
      </section>

      {/* Security & Multi-Tenancy */}
      <section id="security" className="py-20 px-6 lg:px-12 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Cryptographic Tenant Isolation Guarantee</h3>
              <p className="text-xs text-slate-400">Zero data leakage between independent residential societies.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Server-Derived Identity:</strong> The platform never accepts tenant identifiers from client parameters. Identity is strictly derived from the validated JWT token.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Thread-Scoped Context:</strong> An interceptor injects the verified society UUID into ThreadLocal storage and clears it in a guaranteed finally block.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Automated Boundary Enforcement:</strong> Any query or update targeting another society’s record throws an immediate HTTP 403 Security Violation and logs an audit trail.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 lg:px-12 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ready to Modernize Your Housing Society?
        </h2>
        <p className="mt-4 text-sm text-slate-400 max-w-xl mx-auto">
          Join leading residential communities transitioning from paper registers and spreadsheets to Society360.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register-society"
            className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm transition shadow-xl shadow-emerald-500/20"
          >
            Register Your Society
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition"
          >
            Explore Live Demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-12 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <p>© 2026 Society360 Platform. Designed and developed as a Production-Grade Multi-Tenant Architecture.</p>
        <p className="mt-1">Primary Reference: &quot;A Multi-Tenant Digital Platform for Residential Society Management&quot;</p>
      </footer>
    </div>
  );
};
