import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Sparkles, Globe, Shield, History, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';
import ThemeToggle from './ThemeToggle';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const t = useTranslation(language);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="font-black text-xl text-slate-900 dark:text-white hidden sm:block">
              AI Content Polisher
            </span>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {user.name} • <span className="font-bold text-purple-600 dark:text-purple-400">{user.credits_remaining} {t.navbar.credits}</span>
              </span>
              <Link
                to="/history"
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all font-medium"
              >
                <History className="h-4 w-4" />
                <span>{t.navbar.history || 'Historique'}</span>
              </Link>
              <Link
                to="/account"
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all font-medium"
              >
                <User className="h-4 w-4" />
                <span>{t.navbar.account || 'Compte'}</span>
              </Link>
              {user.is_admin === 1 && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium shadow-lg"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>{t.navbar.logout}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                to="/pricing"
                className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium transition-colors hidden md:block"
              >
                {t.navbar.pricing}
              </Link>

              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
                  <Globe className="h-4 w-4" />
                  <span>{languages.find(l => l.code === language)?.label || 'FR'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
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

              <Link
                to="/login"
                className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium transition-colors hidden sm:block"
              >
                {t.navbar.login}
              </Link>

              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {t.navbar.getStarted}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;