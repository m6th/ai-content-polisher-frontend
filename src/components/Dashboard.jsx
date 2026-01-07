import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentPolisher from './ContentPolisher';
import Analytics from './Analytics';
import { BarChart3, Sparkles, CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getAnalyticsStats } from '../services/api';

function Dashboard({ user, onUpdateUser }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('polisher'); // 'polisher' ou 'analytics'
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Vérifier si l'email est vérifié
    if (user && user.email_verified === 0) {
      navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);
    }
  }, [user, navigate]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getAnalyticsStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNextRenewal = () => {
    if (!user?.last_credit_renewal && !user?.created_at) return '-';
    const referenceDate = user.last_credit_renewal || user.created_at;
    const lastRenewal = new Date(referenceDate);
    const nextRenewal = new Date(lastRenewal);
    nextRenewal.setMonth(nextRenewal.getMonth() + 1);
    return formatDate(nextRenewal);
  };

  const getPlanBadgeColor = () => {
    const planColors = {
      free: 'from-gray-500 to-gray-600',
      starter: 'from-blue-500 to-blue-600',
      pro: 'from-purple-500 to-purple-600',
      business: 'from-yellow-500 to-yellow-600'
    };
    return planColors[user?.current_plan] || 'from-gray-500 to-gray-600';
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

        {/* Votre compte - Account Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border-2 border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r ${getPlanBadgeColor()} text-white rounded-lg text-xs sm:text-sm font-semibold uppercase`}>
                {user?.current_plan}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">{user?.credits_remaining}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
              {language === 'fr' ? 'Crédits restants' : language === 'en' ? 'Credits remaining' : 'Créditos restantes'}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border-2 border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-base sm:text-lg font-bold text-gray-800 dark:text-blue-400">{calculateNextRenewal()}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
              {language === 'fr' ? 'Prochain renouvellement' : language === 'en' ? 'Next renewal' : 'Próxima renovación'}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border-2 border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">{stats?.total_requests || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
              {language === 'fr' ? 'Générations totales' : language === 'en' ? 'Total generations' : 'Generaciones totales'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center">
            <button
              onClick={() => navigate('/pricing')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold text-sm text-center shadow-lg"
            >
              {language === 'fr' ? 'Améliorer mon plan' : language === 'en' ? 'Upgrade plan' : 'Mejorar plan'}
            </button>
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