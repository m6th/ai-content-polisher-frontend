import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, BarChart3, PieChart as PieChartIcon, Clock,
  Calendar, Target, Award, Sparkles, RefreshCw, Download
} from 'lucide-react';
import {
  getAnalyticsStats, getDailyUsage, getFormatAnalytics,
  getPerformanceSummary, getProTrialStatus
} from '../services/api';
import ProTrialModal from './ProTrialModal';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

function AnalyticsDashboard({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [dailyUsage, setDailyUsage] = useState([]);
  const [formatAnalytics, setFormatAnalytics] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  // Pro Trial Modal
  const [showProTrialModal, setShowProTrialModal] = useState(false);
  const [canUseTrial, setCanUseTrial] = useState(false);
  const [previewMode, setPreviewMode] = useState(false); // Mode aperçu pour Free/Starter

  const isPro = user?.current_plan === 'pro' || user?.current_plan === 'business';

  // Check access on mount
  useEffect(() => {
    const checkAccess = async () => {
      if (!isPro && !previewMode) {
        try {
          const response = await getProTrialStatus();
          setCanUseTrial(response.data.can_use_trial);
        } catch (err) {
          console.error('Error loading trial status:', err);
        }
        setShowProTrialModal(true);
        setLoading(false); // Stop loading for Free/Starter users
      } else if (isPro) {
        loadAnalytics();
      } else if (previewMode) {
        loadDemoData();
      }
    };

    checkAccess();
  }, [isPro, previewMode]);

  useEffect(() => {
    if (isPro) {
      loadAnalytics();
    }
  }, [selectedPeriod]);

  const loadDemoData = () => {
    // Données de démonstration pour le mode preview
    setStats({
      total_requests: 156,
      total_formats: 468,
      most_used_platform: 'LinkedIn',
      analytics_enabled: true
    });

    setDailyUsage([
      { date: '2025-01-25', count: 12 },
      { date: '2025-01-26', count: 18 },
      { date: '2025-01-27', count: 15 },
      { date: '2025-01-28', count: 22 },
      { date: '2025-01-29', count: 19 },
      { date: '2025-01-30', count: 25 },
      { date: '2025-01-31', count: 20 }
    ]);

    setFormatAnalytics({
      formats: [
        { format: 'LinkedIn', count: 142, percentage: 30 },
        { format: 'Instagram', count: 118, percentage: 25 },
        { format: 'TikTok', count: 94, percentage: 20 },
        { format: 'Twitter', count: 71, percentage: 15 },
        { format: 'Email', count: 43, percentage: 10 }
      ]
    });

    setPerformance({
      avg_generation_time: 2.3,
      success_rate: 98.5,
      total_credits_used: 156
    });

    setLoading(false);
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, dailyRes] = await Promise.all([
        getAnalyticsStats(),
        getDailyUsage()
      ]);

      setStats(statsRes.data);
      setDailyUsage(dailyRes.data);

      // Load Pro/Business analytics if enabled
      if (statsRes.data.analytics_enabled) {
        const [formatRes, perfRes] = await Promise.all([
          getFormatAnalytics(),
          getPerformanceSummary(selectedPeriod)
        ]);
        setFormatAnalytics(formatRes.data);
        setPerformance(perfRes.data);
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Erreur lors du chargement des analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleActivatePreview = () => {
    setShowProTrialModal(false);
    setPreviewMode(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <>
        {/* Pro Trial Modal */}
        <ProTrialModal
          isOpen={showProTrialModal}
          onClose={() => {
            setShowProTrialModal(false);
            navigate('/dashboard');
          }}
          feature="analytics"
          canUseTrial={canUseTrial}
          onActivateTrial={() => {
            setShowProTrialModal(false);
            navigate('/dashboard');
          }}
          onActivatePreview={handleActivatePreview}
        />
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Preview Mode Banner */}
      {previewMode && (
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              <div>
                <p className="font-bold text-lg">Mode Aperçu Pro</p>
                <p className="text-sm text-blue-100">Vous explorez l'interface Pro. Les données affichées sont des exemples.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition-all"
            >
              Passer à Pro
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isPro || previewMode ? 'Dashboard analytics détaillé' : 'Vue d\'ensemble de votre utilisation'}
            </p>
          </div>

          {isPro && (
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                className="px-4 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value={7}>7 derniers jours</option>
                <option value={30}>30 derniers jours</option>
                <option value={90}>90 derniers jours</option>
              </select>
              <button
                onClick={loadAnalytics}
                className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {!isPro && (
          <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Débloquez les analytics détaillés
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Passez à Pro ou Business pour accéder aux graphiques, statistiques par format et plus encore
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Requests */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-8 w-8 text-blue-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_requests}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Contenus générés</p>
        </div>

        {/* Credits Used */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Ce mois</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.credits_used_this_month}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Crédits utilisés</p>
        </div>

        {/* Credits Remaining */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Award className="h-8 w-8 text-purple-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Restants</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.credits_remaining}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Crédits disponibles</p>
        </div>

        {/* Usage Rate */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <PieChartIcon className="h-8 w-8 text-orange-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Taux</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.usage_rate}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Utilisation mensuelle</p>
        </div>
      </div>

      {/* Pro/Business Stats */}
      {isPro && stats.analytics_enabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg border-2 border-purple-200 dark:border-purple-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Contenus Générés</p>
            </div>
            <p className="text-4xl font-bold text-purple-600">{stats.total_generated_contents}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-6 w-6 text-blue-600" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Variantes Moyennes</p>
            </div>
            <p className="text-4xl font-bold text-blue-600">{stats.avg_variants_per_request}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg border-2 border-green-200 dark:border-green-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-6 w-6 text-green-600" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Ton le Plus Utilisé</p>
            </div>
            <p className="text-2xl font-bold text-green-600 capitalize">{stats.most_used_tone || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Daily Usage Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          Utilisation des 7 derniers jours
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyUsage}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pro/Business Analytics */}
      {isPro && formatAnalytics && performance && (
        <>
          {/* Format Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-pink-600" />
                Distribution par Format
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={formatAnalytics.formats}
                    dataKey="total_generated"
                    nameKey="format"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ format, total_generated }) => `${format}: ${total_generated}`}
                  >
                    {formatAnalytics.formats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Activity by Day of Week */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Activité par Jour de la Semaine
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(performance.activity_by_day_of_week || {}).map(([day, count]) => ({
                    day,
                    count
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Format Details Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Détails par Format
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Format</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Générations</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Longueur Moy.</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Première Utilisation</th>
                  </tr>
                </thead>
                <tbody>
                  {formatAnalytics.formats.map((format, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium text-gray-900 dark:text-white">{format.format}</span>
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">{format.total_generated}</td>
                      <td className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">{format.avg_length} car.</td>
                      <td className="text-right py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                        {format.first_used ? new Date(format.first_used).toLocaleDateString('fr-FR') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
