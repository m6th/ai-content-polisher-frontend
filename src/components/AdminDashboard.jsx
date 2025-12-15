import { useState, useEffect } from 'react';
import {
  getAdminStats,
  getAllUsers,
  getUserDetails,
  updateUserCredits,
  updateUserPlan,
  toggleAdminStatus,
  getRecentRequests,
  getUsageTrends,
  getPlatformDistribution,
  deleteUser,
  renewUserCredits,
  renewAllCredits
} from '../services/api';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Search,
  Edit,
  Trash2,
  Shield,
  LineChart as LineChartIcon,
  BarChart3,
  Clock,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [usageTrends, setUsageTrends] = useState([]);
  const [platformDistribution, setPlatformDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, requests, analytics
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, requestsRes, trendsRes, platformRes] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getRecentRequests(),
        getUsageTrends(30),
        getPlatformDistribution()
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setRecentRequests(requestsRes.data);
      setUsageTrends(trendsRes.data);
      setPlatformDistribution(platformRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données admin:', error);
      if (error.response?.status === 403) {
        alert('Vous n\'avez pas les permissions d\'administrateur');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCredits = async (userId, newCredits) => {
    try {
      await updateUserCredits(userId, parseInt(newCredits));
      alert('Crédits mis à jour avec succès');
      loadAdminData();
      setEditingUser(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour des crédits');
    }
  };

  const handleUpdatePlan = async (userId, newPlan) => {
    try {
      await updateUserPlan(userId, newPlan);
      alert('Plan mis à jour avec succès');
      loadAdminData();
      setEditingUser(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du plan');
    }
  };

  const handleRenewCredits = async (userId) => {
    if (window.confirm('Renouveler les crédits pour cet utilisateur ?')) {
      try {
        const response = await renewUserCredits(userId);
        alert(`Crédits renouvelés avec succès: ${response.data.new_credits} crédits`);
        await loadAdminData();
        // Reload selected user details if this user is currently selected
        if (selectedUser && selectedUser.id === userId) {
          const userDetails = await getUserDetails(userId);
          setSelectedUser(userDetails.data);
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du renouvellement des crédits');
      }
    }
  };

  const handleRenewAllCredits = async () => {
    if (window.confirm('Renouveler les crédits de tous les utilisateurs éligibles (>30 jours) ?')) {
      try {
        const response = await renewAllCredits();
        alert(response.data.message);
        loadAdminData();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du renouvellement global');
      }
    }
  };

  const handleToggleAdmin = async (userId, currentStatus) => {
    const newStatus = currentStatus === 1 ? false : true;
    try {
      await toggleAdminStatus(userId, newStatus);
      alert('Statut admin mis à jour');
      loadAdminData();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du statut admin');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      return;
    }
    try {
      await deleteUser(userId);
      alert('Utilisateur supprimé');
      loadAdminData();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Shield className="h-10 w-10 text-purple-600" />
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Gérez votre plateforme et vos utilisateurs</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-2 mb-8 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 min-w-fit py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Vue d'ensemble</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 min-w-fit py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Utilisateurs</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 min-w-fit py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Clock className="h-5 w-5" />
            <span>Requêtes</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 min-w-fit py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <LineChartIcon className="h-5 w-5" />
            <span>Analytiques</span>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-800 rounded-2xl p-6 border-2 border-purple-100 dark:border-purple-900 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stats.total_users}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Utilisateurs totaux</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800 rounded-2xl p-6 border-2 border-blue-100 dark:border-blue-900 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stats.active_users}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Utilisateurs actifs (30j)</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-slate-800 rounded-2xl p-6 border-2 border-green-100 dark:border-green-900 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stats.total_requests}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Requêtes totales</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-slate-800 rounded-2xl p-6 border-2 border-yellow-100 dark:border-yellow-900 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">${stats.monthly_revenue.toFixed(2)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Revenus mensuels potentiels</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users by Plan */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Utilisateurs par plan</h3>
                {stats.users_by_plan.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.users_by_plan}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ plan, count }) => `${plan}: ${count}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {stats.users_by_plan.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-slate-500">
                    Aucune donnée disponible
                  </div>
                )}
              </div>

              {/* Requests this month */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Statistiques mensuelles</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">Requêtes ce mois</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.requests_this_month}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">Moyenne par utilisateur actif</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.active_users > 0 ? (stats.requests_this_month / stats.active_users).toFixed(1) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">Taux d'activation</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.total_users > 0 ? ((stats.active_users / stats.total_users) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search Bar & Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par email ou nom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-purple-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <button
                  onClick={handleRenewAllCredits}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all whitespace-nowrap"
                >
                  <RefreshCw className="h-5 w-5" />
                  Renouveler tous les crédits
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Crédits</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Requêtes</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Admin</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-700 dark:text-slate-300">{user.name || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <select
                              defaultValue={user.current_plan}
                              onChange={(e) => handleUpdatePlan(user.id, e.target.value)}
                              className="text-sm px-2 py-1 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-purple-300 dark:border-purple-700 rounded"
                            >
                              <option value="free">Gratuit (5 crédits)</option>
                              <option value="starter">Starter (40 crédits)</option>
                              <option value="pro">Pro (150 crédits)</option>
                              <option value="business">Business (500 crédits)</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.current_plan === 'free' ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200' :
                              user.current_plan === 'starter' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                              user.current_plan === 'pro' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                              'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300'
                            }`}>
                              {user.current_plan === 'free' ? 'Gratuit' :
                               user.current_plan === 'starter' ? 'Starter' :
                               user.current_plan === 'pro' ? 'Pro' :
                               user.current_plan === 'business' ? 'Business' :
                               user.current_plan}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <input
                              type="number"
                              defaultValue={user.credits_remaining}
                              onBlur={(e) => handleUpdateCredits(user.id, e.target.value)}
                              className="w-20 text-sm px-2 py-1 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-purple-300 dark:border-purple-700 rounded"
                            />
                          ) : (
                            <div className="text-sm text-slate-700 dark:text-slate-300">{user.credits_remaining}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-700 dark:text-slate-300">{user.total_requests}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.is_admin === 1
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {user.is_admin === 1 ? 'Admin' : 'User'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                              className="text-blue-600 hover:text-blue-800 transition"
                              title="Éditer"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRenewCredits(user.id)}
                              className="text-green-600 hover:text-green-800 transition"
                              title="Renouveler les crédits"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 transition"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Requêtes récentes</h3>
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div key={request.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{request.user_email}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {request.user_name} - <span className="font-medium text-purple-600 dark:text-purple-400">{request.user_plan}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(request.created_at).toLocaleString('fr-FR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                      {request.platform}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                      {request.tone}
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                      {request.language}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{request.original_text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Usage Trends */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tendances d'utilisation (30 derniers jours)</h3>
              {usageTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
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
                      dataKey="requests"
                      stroke="#667eea"
                      strokeWidth={3}
                      dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-slate-500">
                  Aucune donnée disponible
                </div>
              )}
            </div>

            {/* Platform Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Distribution par plateforme</h3>
              {platformDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="platform" stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-slate-500">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
