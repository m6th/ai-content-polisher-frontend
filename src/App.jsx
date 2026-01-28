import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { getCurrentUser } from './services/api';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load components for code splitting
const LandingPage = lazy(() => import('./components/LandingPage'));
const Pricing = lazy(() => import('./components/Pricing'));
const Checkout = lazy(() => import('./components/Checkout'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const VerifyEmail = lazy(() => import('./components/VerifyEmail'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const History = lazy(() => import('./components/History'));
const Account = lazy(() => import('./components/Account'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const LegalNotice = lazy(() => import('./components/LegalNotice'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const EditorialCalendar = lazy(() => import('./components/EditorialCalendar'));
const TeamManagement = lazy(() => import('./components/TeamManagement'));
const AcceptInvitation = lazy(() => import('./components/AcceptInvitation'));
const JoinTeam = lazy(() => import('./components/JoinTeam'));
const APIAccess = lazy(() => import('./components/APIAccess'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const DashboardWrapper = lazy(() => import('./components/DashboardWrapper'));
const ComingSoon = lazy(() => import('./components/ComingSoon'));
const IdeaFinder = lazy(() => import('./components/IdeaFinder'));

// Layout wrapper component that handles sidebar visibility and content positioning
function LayoutWrapper({ user, onLogout, children }) {
  const location = useLocation();

  // Pages where sidebar should always be hidden (full-screen pages for logged-in users)
  const hideSidebarRoutes = ['/onboarding', '/login', '/register', '/verify-email'];

  // Public pages where sidebar should not appear (non-logged in users)
  const publicRoutes = ['/', '/pricing', '/privacy', '/terms', '/legal', '/accept-invitation', '/join-team'];

  // Hide sidebar if:
  // 1. User is not logged in (show public pages without sidebar)
  // 2. User is on specific routes that should be full-screen
  const isPublicPage = publicRoutes.includes(location.pathname);
  const isHiddenRoute = hideSidebarRoutes.includes(location.pathname);
  const hideSidebar = !user || isHiddenRoute || (isPublicPage && !user);

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar user={user} onLogout={onLogout} />
      {/* Main content with left margin for sidebar on desktop, top margin for mobile header */}
      <div className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        {children}
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const handleLogin = () => {
    checkAuth();
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 dark:border-purple-900"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 dark:border-purple-400 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 dark:border-purple-900"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 dark:border-purple-400 absolute top-0 left-0"></div>
                  </div>
                </div>
              }>
                <LayoutWrapper user={user} onLogout={handleLogout}>
                  <Routes>
                    <Route
                      path="/"
                      element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
                    />
                    <Route
                      path="/login"
                      element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
                    />
                    <Route
                      path="/register"
                      element={user ? <Navigate to="/dashboard" /> : <Register />}
                    />
                    <Route
                      path="/verify-email"
                      element={<VerifyEmail />}
                    />
                    <Route
                      path="/pricing"
                      element={<Pricing user={user} onUpdateUser={checkAuth} />}
                    />
                    <Route
                      path="/checkout"
                      element={
                        user ? (
                          <Checkout />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/onboarding"
                      element={
                        user ? (
                          <Onboarding user={user} />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        user ? (
                          <DashboardWrapper user={user} onUpdateUser={checkAuth} />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        user && user.is_admin === 1 ? (
                          <AdminDashboard />
                        ) : (
                          <Navigate to="/dashboard" />
                        )
                      }
                    />
                    <Route
                      path="/history"
                      element={
                        user ? (
                          <History />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        user ? (
                          <AnalyticsDashboard user={user} />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/calendar"
                      element={
                        user ? (
                          <EditorialCalendar user={user} />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/team"
                      element={
                        user ? (
                          <TeamManagement user={user} />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/api-access"
                      element={
                        user ? (
                          <APIAccess user={user} />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/accept-invitation"
                      element={<AcceptInvitation />}
                    />
                    <Route
                      path="/join-team"
                      element={<JoinTeam />}
                    />
                    <Route
                      path="/account"
                      element={
                        user ? (
                          <Account user={user} onUpdateUser={checkAuth} />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/privacy"
                      element={<PrivacyPolicy />}
                    />
                    <Route
                      path="/terms"
                      element={<TermsOfService />}
                    />
                    <Route
                      path="/legal"
                      element={<LegalNotice />}
                    />
                    <Route
                      path="/coming-soon"
                      element={<ComingSoon />}
                    />
                    <Route
                      path="/ideas"
                      element={
                        user ? (
                          <IdeaFinder />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                  </Routes>
                </LayoutWrapper>
              </Suspense>
            </div>
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
