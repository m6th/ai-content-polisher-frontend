import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentPolisher from './ContentPolisher';
import Analytics from './Analytics';
import { History, BarChart3, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';

function Dashboard({ user, onUpdateUser }) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('polisher'); // 'polisher' ou 'analytics'

  useEffect(() => {
    // Vérifier si l'email est vérifié
    if (user && user.email_verified === 0) {
      navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Onglets de navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-1.5 sm:p-2 mb-6 sm:mb-8 flex gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('polisher')}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base ${
              activeTab === 'polisher'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Content Polisher</span>
            <span className="sm:hidden">Polisher</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-0 bg-purple-50 dark:bg-slate-700/50 sm:bg-transparent rounded-lg sm:rounded-none">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">
                {user.credits_remaining}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-slate-400 mt-1 sm:mt-2">{t.dashboard.creditsRemaining}</div>
            </div>
            <div className="text-center p-3 sm:p-0 bg-blue-50 dark:bg-slate-700/50 sm:bg-transparent rounded-lg sm:rounded-none">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 capitalize">
                {user.current_plan}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-slate-400 mt-1 sm:mt-2">{language === 'fr' ? 'Plan actuel' : language === 'en' ? 'Current plan' : 'Plan actual'}</div>
            </div>
            <div className="text-center p-3 sm:p-0 bg-green-50 dark:bg-slate-700/50 sm:bg-transparent rounded-lg sm:rounded-none">
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {user.last_credit_renewal ? new Date(new Date(user.last_credit_renewal).getTime() + 30*24*60*60*1000).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' }) : '-'}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-slate-400 mt-1 sm:mt-2">
                {language === 'fr' ? 'Prochain renouvellement' : language === 'en' ? 'Next renewal' : 'Próxima renovación'}
              </div>
            </div>
            <div className="text-center p-3 sm:p-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:bg-slate-700/50 sm:bg-transparent rounded-lg sm:rounded-none">
              <button
                onClick={() => navigate('/history')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold text-sm shadow-lg"
              >
                <History className="h-4 w-4 inline mr-1.5" />
                {language === 'fr' ? "Voir l'historique" : language === 'en' ? 'View history' : 'Ver historial'}
              </button>
            </div>
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'polisher' ? (
          <ContentPolisher user={user} onUpdateUser={onUpdateUser} />
        ) : (
          <Analytics user={user} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;