import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut, Sparkles, Globe, Shield, History, User, BarChart3,
  Calendar, Users, UserPlus, Key, Menu, X, Home, Rocket,
  CreditCard, ChevronLeft, ChevronRight, Sun, Moon
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';
import { useTheme } from '../contexts/ThemeContext';

function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const t = useTranslation(language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  const languages = [
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'es', flag: '🇪🇸', label: 'Español' }
  ];

  const isActive = (path) => location.pathname === path;

  // Navigation items for logged-in users
  const navItems = [
    { path: '/dashboard', icon: Home, label: t.navbar.dashboard || 'Dashboard' },
    { path: '/history', icon: History, label: t.navbar.history || 'Historique' },
    { path: '/analytics', icon: BarChart3, label: t.navbar.analytics || 'Analytics' },
    { path: '/calendar', icon: Calendar, label: t.navbar.calendar || 'Calendrier' },
    { path: '/team', icon: Users, label: t.navbar.team || 'Équipe' },
    { path: '/coming-soon', icon: Rocket, label: t.navbar.comingSoon || 'Prochainement' },
  ];

  // Navigation items for non-logged-in users
  const publicNavItems = [
    { path: '/', icon: Home, label: t.navbar.home || 'Accueil' },
    { path: '/pricing', icon: CreditCard, label: t.navbar.pricing || 'Tarifs' },
    { path: '/coming-soon', icon: Rocket, label: t.navbar.comingSoon || 'Prochainement' },
  ];

  const NavLink = ({ item, onClick }) => (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
        isActive(item.path)
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      } ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.path) ? '' : 'group-hover:text-purple-600 dark:group-hover:text-purple-400'}`} />
      {!collapsed && <span className="font-medium">{item.label}</span>}
    </Link>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-40 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-slate-200 dark:border-slate-700`}>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <span className="font-black text-lg text-slate-900 dark:text-white">
              AI Content Polisher
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors ${collapsed ? 'absolute -right-3 top-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md' : ''}`}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* User info (if logged in) */}
      {user && (
        <div className={`p-4 border-b border-slate-200 dark:border-slate-700 ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  {user.credits_remaining} {t.navbar.credits || 'crédits'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {user ? (
          <>
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}

            {/* Special items */}
            <Link
              to="/join-team"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-400 hover:from-green-500/20 hover:to-emerald-500/20 ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? 'Rejoindre une équipe' : undefined}
            >
              <UserPlus className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">Rejoindre une équipe</span>}
            </Link>

            {user?.current_plan === 'business' && (
              <Link
                to="/api-access"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400 hover:from-blue-500/20 hover:to-indigo-500/20 ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? 'API Access' : undefined}
              >
                <Key className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">API Access</span>}
              </Link>
            )}
          </>
        ) : (
          <>
            {publicNavItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
            <Link
              to="/join-team"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-400 hover:from-green-500/20 hover:to-emerald-500/20 ${collapsed ? 'justify-center' : ''}`}
            >
              <UserPlus className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">Rejoindre une équipe</span>}
            </Link>
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <Globe className="h-5 w-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="font-medium flex-1 text-left">
                  {languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.label}
                </span>
              </>
            )}
          </button>
          {langMenuOpen && (
            <div className={`absolute ${collapsed ? 'left-full ml-2' : 'left-0 right-0'} bottom-full mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50`}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 ${
                    language === lang.code ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 flex-shrink-0" /> : <Moon className="h-5 w-5 flex-shrink-0" />}
          {!collapsed && <span className="font-medium">{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>}
        </button>

        {user ? (
          <>
            {/* Account */}
            <Link
              to="/account"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
              <User className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{t.navbar.account || 'Mon compte'}</span>}
            </Link>

            {/* Admin */}
            {user.email === 'mathdu0609@gmail.com' && (
              <Link
                to="/admin"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all ${collapsed ? 'justify-center' : ''}`}
              >
                <Shield className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">Admin</span>}
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{t.navbar.logout || 'Déconnexion'}</span>}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
              <User className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{t.navbar.login || 'Connexion'}</span>}
            </Link>
            <Link
              to="/register"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
              <Sparkles className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{t.navbar.getStarted || 'Commencer'}</span>}
            </Link>
          </>
        )}
      </div>
    </aside>
  );

  // Mobile Header + Drawer
  const MobileNav = () => (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">AI Content Polisher</span>
        </Link>

        <div className="w-10" /> {/* Spacer for balance */}
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white">AI Content Polisher</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info (if logged in) */}
        {user && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  {user.credits_remaining} {t.navbar.credits || 'crédits'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {user ? (
            <>
              {navItems.map((item) => (
                <NavLink key={item.path} item={item} onClick={() => setMobileMenuOpen(false)} />
              ))}

              <Link
                to="/join-team"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-400 hover:from-green-500/20 hover:to-emerald-500/20"
              >
                <UserPlus className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Rejoindre une équipe</span>
              </Link>

              {user?.current_plan === 'business' && (
                <Link
                  to="/api-access"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400 hover:from-blue-500/20 hover:to-indigo-500/20"
                >
                  <Key className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">API Access</span>
                </Link>
              )}
            </>
          ) : (
            <>
              {publicNavItems.map((item) => (
                <NavLink key={item.path} item={item} onClick={() => setMobileMenuOpen(false)} />
              ))}
              <Link
                to="/join-team"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-400 hover:from-green-500/20 hover:to-emerald-500/20"
              >
                <UserPlus className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Rejoindre une équipe</span>
              </Link>
            </>
          )}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Globe className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium flex-1 text-left">
                {languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.label}
              </span>
            </button>
            {langMenuOpen && (
              <div className="absolute left-0 right-0 bottom-full mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 ${
                      language === lang.code ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 flex-shrink-0" /> : <Moon className="h-5 w-5 flex-shrink-0" />}
            <span className="font-medium">{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
          </button>

          {user ? (
            <>
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <User className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{t.navbar.account || 'Mon compte'}</span>
              </Link>

              {user.email === 'mathdu0609@gmail.com' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  <Shield className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{t.navbar.logout || 'Déconnexion'}</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <User className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{t.navbar.login || 'Connexion'}</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <Sparkles className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{t.navbar.getStarted || 'Commencer'}</span>
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileNav />
    </>
  );
}

export default Sidebar;
