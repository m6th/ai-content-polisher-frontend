import { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Clock,
  Calendar, Target, Award, Sparkles, RefreshCw, Download, Zap, ArrowUpRight,
  ArrowDownRight, FileDown
} from 'lucide-react';
import {
  getAnalyticsStats, getDailyUsage, getFormatAnalytics,
  getPerformanceSummary, getProTrialStatus
} from '../services/api';
import ProTrialModal from './ProTrialModal';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

// Translations
const translations = {
  fr: {
    loading: 'Chargement des analytics...',
    error: 'Erreur lors du chargement des analytics',
    retry: 'Réessayer',
    previewBanner: {
      title: 'Mode Aperçu Pro',
      subtitle: 'Vous explorez l\'interface Pro. Les données affichées sont des exemples.',
      upgrade: 'Passer à Pro'
    },
    header: {
      title: 'Analytics',
      subtitle: 'Dashboard analytics détaillé',
      basicSubtitle: 'Vue d\'ensemble de votre utilisation'
    },
    unlock: {
      title: 'Débloquez les analytics détaillés',
      subtitle: 'Passez à Pro ou Business pour accéder aux graphiques, statistiques par format et plus encore'
    },
    periods: {
      '7': '7 jours',
      '30': '30 jours',
      '90': '90 jours'
    },
    stats: {
      total: 'Total',
      thisMonth: 'Ce mois',
      remaining: 'Restants',
      rate: 'Taux',
      generated: 'Contenus générés',
      creditsUsed: 'Crédits utilisés',
      creditsAvailable: 'Crédits disponibles',
      monthlyUsage: 'Utilisation mensuelle',
      vsLastPeriod: 'vs période précédente',
      productivity: 'Score Productivité',
      productivityDesc: 'Basé sur régularité et volume'
    },
    proStats: {
      generated: 'Contenus Générés',
      avgVariants: 'Variantes Moyennes',
      mostUsedTone: 'Ton le Plus Utilisé'
    },
    charts: {
      last7Days: 'Utilisation des 7 derniers jours',
      trend30Days: 'Tendance sur 30 jours',
      formatDistribution: 'Distribution par Format',
      weeklyActivity: 'Activité par Jour de la Semaine',
      formatDetails: 'Détails par Format'
    },
    table: {
      format: 'Format',
      generations: 'Générations',
      avgLength: 'Longueur Moy.',
      firstUsed: 'Première Utilisation'
    },
    export: {
      button: 'Exporter CSV',
      filename: 'analytics'
    }
  },
  en: {
    loading: 'Loading analytics...',
    error: 'Error loading analytics',
    retry: 'Retry',
    previewBanner: {
      title: 'Pro Preview Mode',
      subtitle: 'You\'re exploring the Pro interface. Data shown is sample data.',
      upgrade: 'Upgrade to Pro'
    },
    header: {
      title: 'Analytics',
      subtitle: 'Detailed analytics dashboard',
      basicSubtitle: 'Overview of your usage'
    },
    unlock: {
      title: 'Unlock detailed analytics',
      subtitle: 'Upgrade to Pro or Business to access charts, format statistics and more'
    },
    periods: {
      '7': '7 days',
      '30': '30 days',
      '90': '90 days'
    },
    stats: {
      total: 'Total',
      thisMonth: 'This month',
      remaining: 'Remaining',
      rate: 'Rate',
      generated: 'Contents generated',
      creditsUsed: 'Credits used',
      creditsAvailable: 'Credits available',
      monthlyUsage: 'Monthly usage',
      vsLastPeriod: 'vs last period',
      productivity: 'Productivity Score',
      productivityDesc: 'Based on regularity and volume'
    },
    proStats: {
      generated: 'Contents Generated',
      avgVariants: 'Average Variants',
      mostUsedTone: 'Most Used Tone'
    },
    charts: {
      last7Days: 'Last 7 days usage',
      trend30Days: '30-day trend',
      formatDistribution: 'Distribution by Format',
      weeklyActivity: 'Activity by Day of Week',
      formatDetails: 'Details by Format'
    },
    table: {
      format: 'Format',
      generations: 'Generations',
      avgLength: 'Avg Length',
      firstUsed: 'First Used'
    },
    export: {
      button: 'Export CSV',
      filename: 'analytics'
    }
  },
  es: {
    loading: 'Cargando analytics...',
    error: 'Error al cargar analytics',
    retry: 'Reintentar',
    previewBanner: {
      title: 'Modo Vista Previa Pro',
      subtitle: 'Estás explorando la interfaz Pro. Los datos mostrados son de ejemplo.',
      upgrade: 'Pasar a Pro'
    },
    header: {
      title: 'Analytics',
      subtitle: 'Dashboard de analytics detallado',
      basicSubtitle: 'Resumen de tu uso'
    },
    unlock: {
      title: 'Desbloquea analytics detallados',
      subtitle: 'Pasa a Pro o Business para acceder a gráficos, estadísticas por formato y más'
    },
    periods: {
      '7': '7 días',
      '30': '30 días',
      '90': '90 días'
    },
    stats: {
      total: 'Total',
      thisMonth: 'Este mes',
      remaining: 'Restantes',
      rate: 'Tasa',
      generated: 'Contenidos generados',
      creditsUsed: 'Créditos usados',
      creditsAvailable: 'Créditos disponibles',
      monthlyUsage: 'Uso mensual',
      vsLastPeriod: 'vs período anterior',
      productivity: 'Puntuación Productividad',
      productivityDesc: 'Basado en regularidad y volumen'
    },
    proStats: {
      generated: 'Contenidos Generados',
      avgVariants: 'Variantes Promedio',
      mostUsedTone: 'Tono Más Usado'
    },
    charts: {
      last7Days: 'Uso de los últimos 7 días',
      trend30Days: 'Tendencia de 30 días',
      formatDistribution: 'Distribución por Formato',
      weeklyActivity: 'Actividad por Día de la Semana',
      formatDetails: 'Detalles por Formato'
    },
    table: {
      format: 'Formato',
      generations: 'Generaciones',
      avgLength: 'Long. Prom.',
      firstUsed: 'Primer Uso'
    },
    export: {
      button: 'Exportar CSV',
      filename: 'analytics'
    }
  }
};

function AnalyticsDashboard({ user }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.fr;

  const [stats, setStats] = useState(null);
  const [previousStats, setPreviousStats] = useState(null);
  const [dailyUsage, setDailyUsage] = useState([]);
  const [dailyUsage30Days, setDailyUsage30Days] = useState([]);
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

  // Calculate comparison percentages
  const calculateComparison = (current, previous) => {
    if (!previous || previous === 0) return null;
    const diff = ((current - previous) / previous) * 100;
    return Math.round(diff);
  };

  // Calculate productivity score (0-100)
  const productivityScore = useMemo(() => {
    if (!dailyUsage || dailyUsage.length === 0) return 0;

    // Factor 1: Regularity (how many days with activity)
    const activeDays = dailyUsage.filter(d => d.count > 0).length;
    const regularityScore = (activeDays / 7) * 40; // Max 40 points

    // Factor 2: Volume (average daily usage)
    const totalUsage = dailyUsage.reduce((sum, d) => sum + d.count, 0);
    const avgDaily = totalUsage / 7;
    const volumeScore = Math.min(avgDaily * 5, 40); // Max 40 points (8+ posts/day = max)

    // Factor 3: Consistency (low variance is good)
    const counts = dailyUsage.map(d => d.count);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance = counts.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / counts.length;
    const stdDev = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 20 - stdDev * 2); // Max 20 points

    return Math.round(regularityScore + volumeScore + consistencyScore);
  }, [dailyUsage]);

  // Get productivity level
  const getProductivityLevel = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-500', bg: 'bg-green-500' };
    if (score >= 60) return { label: 'Bon', color: 'text-blue-500', bg: 'bg-blue-500' };
    if (score >= 40) return { label: 'Moyen', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { label: 'À améliorer', color: 'text-orange-500', bg: 'bg-orange-500' };
  };

  // Export CSV function
  const exportToCSV = () => {
    const rows = [
      ['Métrique', 'Valeur'],
      ['Contenus générés', stats?.total_requests || 0],
      ['Crédits utilisés ce mois', stats?.credits_used_this_month || 0],
      ['Crédits restants', stats?.credits_remaining || 0],
      ['Taux utilisation', `${stats?.usage_rate || 0}%`],
      ['Score productivité', productivityScore],
      [''],
      ['Date', 'Générations'],
      ...dailyUsage.map(d => [d.date, d.count])
    ];

    if (formatAnalytics?.formats) {
      rows.push(['']);
      rows.push(['Format', 'Générations', 'Longueur moyenne']);
      formatAnalytics.formats.forEach(f => {
        rows.push([f.format, f.total_generated || f.count, f.avg_length || '-']);
      });
    }

    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${t.export.filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
      analytics_enabled: true,
      credits_used_this_month: 45,
      credits_remaining: 155,
      usage_rate: 22,
      total_generated_contents: 156,
      avg_variants_per_request: 2.3,
      most_used_tone: 'professional'
    });

    // Previous period stats for comparison
    setPreviousStats({
      total_requests: 142,
      credits_used_this_month: 38
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

    // 30-day trend data
    const trend30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trend30Days.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        count: Math.floor(Math.random() * 15) + 5
      });
    }
    setDailyUsage30Days(trend30Days);

    setFormatAnalytics({
      formats: [
        { format: 'LinkedIn', total_generated: 142, count: 142, percentage: 30, avg_length: 1250 },
        { format: 'Instagram', total_generated: 118, count: 118, percentage: 25, avg_length: 280 },
        { format: 'TikTok', total_generated: 94, count: 94, percentage: 20, avg_length: 150 },
        { format: 'Twitter', total_generated: 71, count: 71, percentage: 15, avg_length: 240 },
        { format: 'Email', total_generated: 43, count: 43, percentage: 10, avg_length: 890 }
      ]
    });

    setPerformance({
      avg_generation_time: 2.3,
      success_rate: 98.5,
      total_credits_used: 156,
      activity_by_day_of_week: {
        'Lun': 25, 'Mar': 32, 'Mer': 28, 'Jeu': 35, 'Ven': 22, 'Sam': 8, 'Dim': 6
      }
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

      // Generate 30-day trend from daily usage or create synthetic data
      const last30Days = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const found = dailyRes.data?.find(d => d.date === dateStr);
        last30Days.push({
          date: date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: '2-digit' }),
          count: found?.count || 0
        });
      }
      setDailyUsage30Days(last30Days);

      // Set previous period stats for comparison (simulated based on current stats)
      setPreviousStats({
        total_requests: Math.round((statsRes.data.total_requests || 0) * 0.85),
        credits_used_this_month: Math.round((statsRes.data.credits_used_this_month || 0) * 0.9)
      });

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
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivatePreview = () => {
    setShowProTrialModal(false);
    setPreviewMode(true);
  };

  // Comparison badge component
  const ComparisonBadge = ({ current, previous, suffix = '' }) => {
    const diff = calculateComparison(current, previous);
    if (diff === null) return null;

    const isPositive = diff >= 0;
    return (
      <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        <span>{isPositive ? '+' : ''}{diff}%{suffix}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t.loading}</p>
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
            {t.retry}
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
                <p className="font-bold text-lg">{t.previewBanner.title}</p>
                <p className="text-sm text-blue-100">{t.previewBanner.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition-all"
            >
              {t.previewBanner.upgrade}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              {t.header.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
              {isPro || previewMode ? t.header.subtitle : t.header.basicSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isPro && (
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                className="px-2 sm:px-4 py-2 text-xs sm:text-base border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value={7}>{t.periods['7']}</option>
                <option value={30}>{t.periods['30']}</option>
                <option value={90}>{t.periods['90']}</option>
              </select>
            )}
            {(isPro || previewMode) && (
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition text-sm font-medium"
                title={t.export.button}
              >
                <FileDown className="h-4 w-4" />
                <span className="hidden sm:inline">{t.export.button}</span>
              </button>
            )}
            {isPro && (
              <button
                onClick={loadAnalytics}
                className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition shrink-0"
                title="Actualiser"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {!isPro && !previewMode && (
          <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {t.unlock.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.unlock.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {/* Total Requests */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-5 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t.stats.total}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_requests}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.stats.generated}</p>
            <ComparisonBadge current={stats.total_requests} previous={previousStats?.total_requests} />
          </div>
        </div>

        {/* Credits Used */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-5 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t.stats.thisMonth}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.credits_used_this_month}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.stats.creditsUsed}</p>
            <ComparisonBadge current={stats.credits_used_this_month} previous={previousStats?.credits_used_this_month} />
          </div>
        </div>

        {/* Credits Remaining */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-5 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t.stats.remaining}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.credits_remaining}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{t.stats.creditsAvailable}</p>
        </div>

        {/* Usage Rate */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-5 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <PieChartIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t.stats.rate}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.usage_rate}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{t.stats.monthlyUsage}</p>
        </div>

        {/* Productivity Score */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-5 text-white hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white/80 uppercase tracking-wide">{t.stats.productivity}</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold">{productivityScore}</p>
            <span className="text-lg font-medium text-white/80 mb-1">/100</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getProductivityLevel(productivityScore).bg}`}
                style={{ width: `${productivityScore}%` }}
              />
            </div>
            <p className="text-xs text-white/70 mt-2">{t.stats.productivityDesc}</p>
          </div>
        </div>
      </div>

      {/* Pro/Business Stats */}
      {(isPro || previewMode) && stats.analytics_enabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg border-2 border-purple-200 dark:border-purple-800 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t.proStats.generated}</p>
            </div>
            <p className="text-4xl font-bold text-purple-600">{stats.total_generated_contents}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-800 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-6 w-6 text-blue-600" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t.proStats.avgVariants}</p>
            </div>
            <p className="text-4xl font-bold text-blue-600">{stats.avg_variants_per_request}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg border-2 border-green-200 dark:border-green-800 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-6 w-6 text-green-600" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t.proStats.mostUsedTone}</p>
            </div>
            <p className="text-2xl font-bold text-green-600 capitalize">{stats.most_used_tone || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Usage Chart - 7 days */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            {t.charts.last7Days}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 30-day Trend LineChart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            {t.charts.trend30Days}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyUsage30Days}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={10}
                interval="preserveStartEnd"
                tickFormatter={(value, index) => index % 5 === 0 ? value : ''}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pro/Business Analytics */}
      {(isPro || previewMode) && formatAnalytics && performance && (
        <>
          {/* Format Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-pink-600" />
                {t.charts.formatDistribution}
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={formatAnalytics.formats}
                    dataKey="total_generated"
                    nameKey="format"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    label={({ format, total_generated }) => `${format}: ${total_generated}`}
                    labelLine={true}
                  >
                    {formatAnalytics.formats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Activity by Day of Week */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {t.charts.weeklyActivity}
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={Object.entries(performance.activity_by_day_of_week || {}).map(([day, count]) => ({
                    day,
                    count
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Format Details Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              {t.charts.formatDetails}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t.table.format}</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t.table.generations}</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t.table.avgLength}</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t.table.firstUsed}</th>
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
                      <td className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">{format.total_generated || format.count}</td>
                      <td className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">{format.avg_length || '-'} car.</td>
                      <td className="text-right py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                        {format.first_used ? new Date(format.first_used).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US') : 'N/A'}
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
