import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
const Dashboard = lazy(() => import('./components/Dashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const History = lazy(() => import('./components/History'));
const Account = lazy(() => import('./components/Account'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const LegalNotice = lazy(() => import('./components/LegalNotice'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const EditorialCalendar = lazy(() => import('./components/EditorialCalendar'));
const TeamManagement = lazy(() => import('./components/TeamManagement'));

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
              <Navbar user={user} onLogout={handleLogout} />
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 dark:border-purple-900"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 dark:border-purple-400 absolute top-0 left-0"></div>
                  </div>
                </div>
              }>
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
              path="/dashboard"
              element={
                user ? (
                  <Dashboard user={user} onUpdateUser={checkAuth} />
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
              </Routes>
              </Suspense>
              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;