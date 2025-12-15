import { useState, useEffect, useMemo } from 'react';
import { getAnalyticsStats, getDailyUsage, getPlatformUsage, getRecentActivity } from '../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Target, Calendar } from 'lucide-react';
import { useApiCache } from '../hooks/useApiCache';

function Analytics({ user }) {
  const [stats, setStats] = useState(null);
  const [dailyUsage, setDailyUsage] = useState([]);
  const [platformUsage, setPlatformUsage] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cache analytics data with 2 minute expiration
  const { data: cachedStats, isLoading: statsLoading } = useApiCache(
    'analytics-stats',
    getAnalyticsStats,
    { cacheTime: 2 * 60 * 1000 }
  );

  const { data: cachedDaily, isLoading: dailyLoading } = useApiCache(
    'analytics-daily',
    getDailyUsage,
    { cacheTime: 2 * 60 * 1000 }
  );

  const { data: cachedPlatform, isLoading: platformLoading } = useApiCache(
    'analytics-platform',
    getPlatformUsage,
    { cacheTime: 2 * 60 * 1000 }
  );

  const { data: cachedActivity, isLoading: activityLoading } = useApiCache(
    'analytics-activity',
    () => getRecentActivity(10),
    { cacheTime: 1 * 60 * 1000 } // 1 minute for activity
  );

  useEffect(() => {
    const isAllLoading = statsLoading || dailyLoading || platformLoading || activityLoading;
    setLoading(isAllLoading);

    if (!isAllLoading) {
      if (cachedStats) setStats(cachedStats);
      if (cachedDaily) setDailyUsage(cachedDaily);
      if (cachedPlatform) setPlatformUsage(cachedPlatform);
      if (cachedActivity) setRecentActivity(cachedActivity);
    }
  }, [cachedStats, cachedDaily, cachedPlatform, cachedActivity, statsLoading, dailyLoading, platformLoading, activityLoading]);

  const loadAnalytics = async () => {
    // This function is kept for compatibility but now uses cached data
    setLoading(true);
    try {
      const [statsRes, dailyRes, platformRes, activityRes] = await Promise.all([
        getAnalyticsStats(),
        getDailyUsage(),
        getPlatformUsage(),
        getRecentActivity(10)
      ]);

      setStats(statsRes.data);
      setDailyUsage(dailyRes.data);
      setPlatformUsage(platformRes.data);
      setRecentActivity(activityRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Couleurs pour les graphiques
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

  // Couleur pour le plan
  const getPlanColor = (plan) => {
    const colors = {
      free: 'bg-slate-100 text-slate-700',
      standard: 'bg-purple-100 text-purple-700',
      premium: 'bg-blue-100 text-blue-700',
      agency: 'bg-pink-100 text-pink-700'
    };
    return colors[plan] || colors.free;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 dark:border-purple-900"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 dark:border-purple-400 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 dark:text-slate-400">Erreur lors du chargement des statistiques</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Analytics 📊</h2>
        <p className="text-slate-600 dark:text-slate-400">Suivez vos performances et votre utilisation</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de requêtes */}
        <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-800 rounded-2xl p-6 border-2 border-purple-100 dark:border-purple-900 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanColor(stats.current_plan)}`}>
              {stats.current_plan.toUpperCase()}
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stats.total_requests}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Requêtes totales</div>
        </div>

        {/* Crédits utilisés ce mois */}
        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800 rounded-2xl p-6 border-2 border-blue-100 dark:border-blue-900 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stats.credits_used_this_month}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Crédits utilisés ce mois</div>
        </div>

        {/* Crédits restants */}
        <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-slate-800 rounded-2xl p-6 border-2 border-green-100 dark:border-green-900 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stats.credits_remaining}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Crédits restants</div>
        </div>

        {/* Taux d'utilisation */}
        <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-slate-800 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-900 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stats.usage_rate}%</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Taux d'utilisation</div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilisation quotidienne */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Utilisation des 7 derniers jours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="date" stroke="#64748b" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#667eea"
                strokeWidth={3}
                dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par plateforme */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Répartition par plateforme</h3>
          {platformUsage.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500 dark:text-slate-400">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </div>

      {/* Activités récentes */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Activités récentes</h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white">{activity.platform}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{activity.tone}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{activity.preview}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {new Date(activity.created_at).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            Aucune activité récente
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
