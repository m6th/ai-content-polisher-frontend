import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContentHistory } from '../services/api';
import ContentPolisher from './ContentPolisher';
import Analytics from './Analytics';
import { History, Calendar, MessageSquare, BarChart3, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';

function Dashboard({ user, onUpdateUser }) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('polisher'); // 'polisher' ou 'analytics'

  useEffect(() => {
    // Vérifier si l'email est vérifié
    if (user && user.email_verified === 0) {
      navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (showHistory) {
      loadHistory();
    }
  }, [showHistory]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await getContentHistory();
      setHistory(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err);
    } finally {
      setLoading(false);
    }
  };

  const platformEmojis = {
    linkedin: '💼',
    instagram: '📸',
    tiktok: '🎵',
    facebook: '👥',
    twitter: '🐦',
  };

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
                onClick={() => navigate('/pricing')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold text-sm shadow-lg"
              >
                {language === 'fr' ? 'Améliorer mon plan' : language === 'en' ? 'Upgrade plan' : 'Mejorar plan'}
              </button>
            </div>
          </div>

          {/* History button - Below stats on mobile */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition flex items-center justify-center space-x-2 mx-auto text-sm sm:text-base"
            >
              <History className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="whitespace-nowrap">{showHistory ? (language === 'fr' ? 'Masquer' : language === 'en' ? 'Hide' : 'Ocultar') : (language === 'fr' ? 'Voir' : language === 'en' ? 'View' : 'Ver')} {language === 'fr' ? "l'historique" : language === 'en' ? 'history' : 'historial'}</span>
            </button>
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'polisher' ? (
          <>
            {/* Content Polisher */}
            <ContentPolisher user={user} onUpdateUser={onUpdateUser} />

            {/* History Section */}
            {showHistory && (
              <div className="mt-6 sm:mt-8 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center space-x-2">
                  <History className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>{language === 'fr' ? 'Historique des transformations' : language === 'en' ? 'Transformation history' : 'Historial de transformaciones'}</span>
                </h3>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-sm sm:text-base text-gray-500 dark:text-slate-400">
                    Aucune transformation pour le moment
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 hover:shadow-md transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2 sm:gap-0">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-xl sm:text-2xl">
                              {platformEmojis[item.platform]}
                            </span>
                            <span className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white capitalize">
                              {item.platform}
                            </span>
                            <span className="text-gray-500 dark:text-slate-400">•</span>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                              {item.tone}
                            </span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {new Date(item.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 text-gray-600 dark:text-slate-300">
                          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mt-1 flex-shrink-0" />
                          <p className="text-xs sm:text-sm line-clamp-2">{item.original_text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Analytics Section */
          <Analytics user={user} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;