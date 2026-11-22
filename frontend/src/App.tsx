import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { LandingPage } from './pages/public/LandingPage';
import { SocietyRegistrationPage } from './pages/public/SocietyRegistrationPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Super Admin Pages
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import { SocietyApplicationsPage } from './pages/superadmin/SocietyApplicationsPage';
import { SocietiesListPage } from './pages/superadmin/SocietiesListPage';
import { AuditLogsPage } from './pages/superadmin/AuditLogsPage';

// Society Admin Pages
import { SocietyAdminDashboard } from './pages/admin/SocietyAdminDashboard';
import { PropertyManagementPage } from './pages/admin/PropertyManagementPage';
import { ResidentVerificationQueuePage } from './pages/admin/ResidentVerificationQueuePage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminFinancePage } from './pages/admin/AdminFinancePage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

// Guard, Resident & Staff Pages
import { SecurityGuardGatePage } from './pages/guard/SecurityGuardGatePage';
import { ResidentVisitorsPage } from './pages/resident/ResidentVisitorsPage';
import { ResidentComplaintsPage } from './pages/resident/ResidentComplaintsPage';
import { ResidentInvoicesPage } from './pages/resident/ResidentInvoicesPage';
import { FacilitiesPage } from './pages/facilities/FacilitiesPage';
import { NoticesPage } from './pages/notices/NoticesPage';
import { StaffTasksPage } from './pages/staff/StaffTasksPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Layout Shell wrapper for authenticated role workspaces
const AuthenticatedShell: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <div className="min-h-screen flex flex-col bg-slate-50">
    <Navbar />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {title && <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">{title}</h1>}
          {children}
        </div>
      </main>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register-society" element={<SocietyRegistrationPage />} />

            {/* Platform Super Admin Routes */}
            <Route
              path="/super-admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['PLATFORM_SUPER_ADMIN']}>
                  <AuthenticatedShell>
                    <SuperAdminDashboard />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/applications"
              element={
                <ProtectedRoute allowedRoles={['PLATFORM_SUPER_ADMIN']}>
                  <AuthenticatedShell>
                    <SocietyApplicationsPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/societies"
              element={
                <ProtectedRoute allowedRoles={['PLATFORM_SUPER_ADMIN']}>
                  <AuthenticatedShell>
                    <SocietiesListPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['PLATFORM_SUPER_ADMIN']}>
                  <AuthenticatedShell>
                    <AuditLogsPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />

            {/* Society Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['SOCIETY_ADMIN']}>
                  <AuthenticatedShell>
                    <SocietyAdminDashboard />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/properties"
              element={
                <ProtectedRoute allowedRoles={['SOCIETY_ADMIN']}>
                  <AuthenticatedShell>
                    <PropertyManagementPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/residents"
              element={
                <ProtectedRoute allowedRoles={['SOCIETY_ADMIN', 'COMMITTEE_MEMBER']}>
                  <AuthenticatedShell>
                    <ResidentVerificationQueuePage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <ProtectedRoute allowedRoles={['SOCIETY_ADMIN', 'COMMITTEE_MEMBER']}>
                  <AuthenticatedShell>
                    <AdminComplaintsPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/finance"
              element={
                <ProtectedRoute allowedRoles={['SOCIETY_ADMIN', 'COMMITTEE_MEMBER']}>
                  <AuthenticatedShell>
                    <AdminFinancePage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/facilities"
              element={
                <ProtectedRoute allowedRoles={['SOCIETY_ADMIN', 'COMMITTEE_MEMBER']}>
                  <AuthenticatedShell>
                    <FacilitiesPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notices"
              element={
                <ProtectedRoute allowedRoles={['SOCIETY_ADMIN', 'COMMITTEE_MEMBER']}>
                  <AuthenticatedShell>
                    <NoticesPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['SOCIETY_ADMIN', 'COMMITTEE_MEMBER']}>
                  <AuthenticatedShell>
                    <AdminAnalyticsPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />

            {/* Committee Member Routes */}
            <Route
              path="/committee/dashboard"
              element={
                <ProtectedRoute allowedRoles={['COMMITTEE_MEMBER']}>
                  <AuthenticatedShell title="Committee Member Oversight">
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-slate-600">Committee Member Workspace Initialized.</p>
                    </div>
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/committee/residents"
              element={
                <ProtectedRoute allowedRoles={['COMMITTEE_MEMBER', 'SOCIETY_ADMIN']}>
                  <AuthenticatedShell>
                    <ResidentVerificationQueuePage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/committee/complaints"
              element={
                <ProtectedRoute allowedRoles={['COMMITTEE_MEMBER', 'SOCIETY_ADMIN']}>
                  <AuthenticatedShell>
                    <AdminComplaintsPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/committee/finance"
              element={
                <ProtectedRoute allowedRoles={['COMMITTEE_MEMBER', 'SOCIETY_ADMIN']}>
                  <AuthenticatedShell>
                    <AdminFinancePage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/committee/facilities"
              element={
                <ProtectedRoute allowedRoles={['COMMITTEE_MEMBER', 'SOCIETY_ADMIN']}>
                  <AuthenticatedShell>
                    <FacilitiesPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/committee/notices"
              element={
                <ProtectedRoute allowedRoles={['COMMITTEE_MEMBER', 'SOCIETY_ADMIN']}>
                  <AuthenticatedShell>
                    <NoticesPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />

            {/* Resident Portals */}
            <Route
              path="/resident/owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['FLAT_OWNER']}>
                  <AuthenticatedShell title="Flat Owner Resident Portal">
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-slate-600">Flat Owner Portal Initialized.</p>
                    </div>
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/owner/visitors"
              element={
                <ProtectedRoute allowedRoles={['FLAT_OWNER']}>
                  <AuthenticatedShell>
                    <ResidentVisitorsPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/owner/complaints"
              element={
                <ProtectedRoute allowedRoles={['FLAT_OWNER']}>
                  <AuthenticatedShell>
                    <ResidentComplaintsPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/owner/invoices"
              element={
                <ProtectedRoute allowedRoles={['FLAT_OWNER']}>
                  <AuthenticatedShell>
                    <ResidentInvoicesPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/owner/facilities"
              element={
                <ProtectedRoute allowedRoles={['FLAT_OWNER']}>
                  <AuthenticatedShell>
                    <FacilitiesPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/owner/notices"
              element={
                <ProtectedRoute allowedRoles={['FLAT_OWNER']}>
                  <AuthenticatedShell>
                    <NoticesPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/resident/tenant/dashboard"
              element={
                <ProtectedRoute allowedRoles={['TENANT']}>
                  <AuthenticatedShell title="Resident Tenant Portal">
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-slate-600">Tenant Resident Portal Initialized.</p>
                    </div>
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/tenant/visitors"
              element={
                <ProtectedRoute allowedRoles={['TENANT']}>
                  <AuthenticatedShell>
                    <ResidentVisitorsPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/tenant/complaints"
              element={
                <ProtectedRoute allowedRoles={['TENANT']}>
                  <AuthenticatedShell>
                    <ResidentComplaintsPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/tenant/facilities"
              element={
                <ProtectedRoute allowedRoles={['TENANT']}>
                  <AuthenticatedShell>
                    <FacilitiesPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/tenant/notices"
              element={
                <ProtectedRoute allowedRoles={['TENANT']}>
                  <AuthenticatedShell>
                    <NoticesPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />

            {/* Security Guard */}
            <Route
              path="/guard/gate"
              element={
                <ProtectedRoute allowedRoles={['SECURITY_GUARD']}>
                  <AuthenticatedShell>
                    <SecurityGuardGatePage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />

            {/* Maintenance Staff */}
            <Route
              path="/staff/tasks"
              element={
                <ProtectedRoute allowedRoles={['MAINTENANCE_STAFF']}>
                  <AuthenticatedShell>
                    <StaffTasksPage />
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
