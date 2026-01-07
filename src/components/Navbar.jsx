import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Sparkles, Globe, Shield, History, User, BarChart3, Calendar, Users, UserPlus, Key, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';
import ThemeToggle from './ThemeToggle';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const t = useTranslation(language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  const languages = [
    { code: 'fr', flag: '🇫🇷', label: 'FR' },
    { code: 'en', flag: '🇬🇧', label: 'EN' },
    { code: 'es', flag: '🇪🇸', label: 'ES' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 group flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="font-black text-base sm:text-lg xl:text-xl text-slate-900 dark:text-white hidden lg:block">
              AI Content Polisher
            </span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 flex-1 justify-end">
              {/* Desktop Navigation Links */}
              <div className="hidden xl:flex items-center gap-2">
                <Link to="/history" className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-all text-sm font-medium">
                  <History className="h-4 w-4" />
                  <span>{t.navbar.history || 'Historique'}</span>
                </Link>
                <Link to="/analytics" className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-all text-sm font-medium">
                  <BarChart3 className="h-4 w-4" />
                  <span>{t.navbar.analytics || 'Analytics'}</span>
                </Link>
                <Link to="/calendar" className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-all text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>{t.navbar.calendar || 'Calendrier'}</span>
                </Link>
                <Link to="/team" className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-all text-sm font-medium">
                  <Users className="h-4 w-4" />
                  <span>{t.navbar.team || 'Équipe'}</span>
                </Link>
                {user?.current_plan === 'business' && (
                  <Link to="/api-access" className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all text-sm font-medium shadow-md">
                    <Key className="h-4 w-4" />
                    <span>API</span>
                  </Link>
                )}
                <Link to="/join-team" className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all text-sm font-medium shadow-md">
                  <UserPlus className="h-4 w-4" />
                  <span>Rejoindre une équipe</span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-all"
                aria-label="Menu"
              >
                <Menu className="h-4 w-4" />
              </button>

              {/* User info - responsive */}
              <div className="flex items-center gap-1.5 sm:gap-2 border-l border-slate-200 dark:border-slate-700 pl-1.5 sm:pl-2">
                <ThemeToggle />
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{user.credits_remaining} {t.navbar.credits}</span>
                </div>
                <div className="flex sm:hidden">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{user.credits_remaining}</span>
                </div>
                <Link to="/account" className="p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-all" title="Compte">
                  <User className="h-4 w-4" />
                </Link>
                {user.email === 'mathdu0609@gmail.com' && (
                  <Link to="/admin" className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg" title="Admin">
                    <Shield className="h-4 w-4" />
                  </Link>
                )}
                <button onClick={handleLogout} className="p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-all" title="Déconnexion">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-4">
              {/* Theme Toggle - Always visible */}
              <ThemeToggle />

              {/* Language Selector - Always visible */}
              <div className="relative group">
                <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">{languages.find(l => l.code === language)?.label || 'FR'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        language === lang.code ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span>{lang.flag} {lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Navigation Links */}
              <Link
                to="/pricing"
                className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium transition-colors hidden md:block"
              >
                {t.navbar.pricing}
              </Link>

              <Link
                to="/join-team"
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hidden md:flex"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden lg:inline">Rejoindre une équipe</span>
              </Link>

              <Link
                to="/login"
                className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium transition-colors hidden md:block"
              >
                {t.navbar.login}
              </Link>

              <Link
                to="/register"
                className="px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 hidden md:inline-flex"
              >
                {t.navbar.getStarted}
              </Link>

              {/* Mobile Menu Button - Far right */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu - Not logged in */}
        {!user && mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                {t.navbar.getStarted}
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all font-medium"
              >
                {t.navbar.pricing}
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all font-medium"
              >
                {t.navbar.login}
              </Link>
              <Link
                to="/join-team"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all font-medium"
              >
                Rejoindre une équipe
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu - Logged in */}
        {user && mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all font-medium"
              >
                <History className="h-4 w-4" />
                <span>{t.navbar.history || 'Historique'}</span>
              </Link>
              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all font-medium"
              >
                <BarChart3 className="h-4 w-4" />
                <span>{t.navbar.analytics || 'Analytics'}</span>
              </Link>
              <Link
                to="/calendar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all font-medium"
              >
                <Calendar className="h-4 w-4" />
                <span>{t.navbar.calendar || 'Calendrier'}</span>
              </Link>
              <Link
                to="/team"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all font-medium"
              >
                <Users className="h-4 w-4" />
                <span>{t.navbar.team || 'Équipe'}</span>
              </Link>
              <Link
                to="/join-team"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all font-medium"
              >
                <UserPlus className="h-4 w-4" />
                <span>Rejoindre une équipe</span>
              </Link>
              {user?.current_plan === 'business' && (
                <Link
                  to="/api-access"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all font-medium shadow-md"
                >
                  <Key className="h-4 w-4" />
                  <span>API Access</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;