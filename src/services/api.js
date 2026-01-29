import axios from 'axios';

// Use environment variable in production, localhost in development
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Rediriger vers la page de connexion seulement si on n'est pas déjà dessus
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Authentification
export const register = (email, name, password, plan = 'free') => {
  return api.post('/users/register', { email, name, password, plan });
};

export const googleLogin = (token) => {
  return api.post('/users/auth/google', { token });
};

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await axios.post(`${API_URL}/users/token`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response;
};

export const getCurrentUser = () => {
  return api.get('/users/me');
};

// Contenu
export const polishContent = (originalText, tone, language, useProTrial = false, formats = null) => {
  return api.post('/content/polish', {
    original_text: originalText,
    platform: 'multi_format', // On n'utilise plus platform
    tone,
    language,
    use_pro_trial: useProTrial,  // Paramètre pour l'essai Pro
    formats: formats,  // Liste des formats à générer (null = tous)
  });
};

export const getContentHistory = (skip = 0, limit = 20, search = null) => {
  const params = { skip, limit };
  if (search) params.search = search;
  return api.get('/content/history', { params });
};

export const getContentRequestDetail = (requestId) => {
  return api.get(`/content/history/${requestId}`);
};

export const deleteContentRequest = (requestId) => {
  return api.delete(`/content/history/${requestId}`);
};

// Plans
export const changePlan = (plan) => {
  return api.post('/users/change-plan', { plan });
};

// Email Verification
export const verifyEmail = (email, code) => {
  return api.post('/users/verify-email', { email, code });
};

export const resendVerificationCode = (email) => {
  return api.post(`/users/resend-verification?email=${email}`);
};

// Analytics
export const getAnalyticsStats = () => {
  return api.get('/analytics/stats');
};

export const getDailyUsage = () => {
  return api.get('/analytics/daily-usage');
};

// Stripe Payment
export const createPaymentIntent = (plan, billing = 'monthly') => {
  return api.post('/stripe/create-payment-intent', { plan, billing });
};

export const getPlatformUsage = () => {
  return api.get('/analytics/platform-usage');
};

export const getRecentActivity = (limit = 10) => {
  return api.get(`/analytics/recent-activity?limit=${limit}`);
};

// Plans & Restrictions
export const getMyPlanRestrictions = () => {
  return api.get('/plans/my-restrictions');
};

// Admin
export const getAdminStats = () => {
  return api.get('/admin/stats');
};

export const getAllUsers = (skip = 0, limit = 50) => {
  return api.get(`/admin/users?skip=${skip}&limit=${limit}`);
};

export const getUserDetails = (userId) => {
  return api.get(`/admin/users/${userId}`);
};

export const updateUserCredits = (userId, credits) => {
  return api.put(`/admin/users/${userId}/credits`, { credits });
};

export const updateUserPlan = (userId, plan) => {
  return api.put(`/admin/users/${userId}/plan`, { plan });
};

export const toggleAdminStatus = (userId, isAdmin) => {
  return api.put(`/admin/users/${userId}/admin`, { is_admin: isAdmin });
};

export const getRecentRequests = (limit = 50) => {
  return api.get(`/admin/requests/recent?limit=${limit}`);
};

export const getUsageTrends = (days = 30) => {
  return api.get(`/admin/analytics/usage-trends?days=${days}`);
};

export const getPlatformDistribution = () => {
  return api.get('/admin/analytics/platform-distribution');
};

export const deleteUser = (userId) => {
  return api.delete(`/admin/users/${userId}`);
};

export const renewUserCredits = (userId) => {
  return api.post(`/admin/users/${userId}/renew-credits`);
};

export const renewAllCredits = () => {
  return api.post('/admin/renew-all-credits');
};

// Account Management
export const updateProfile = (name) => {
  return api.put('/users/profile', { name });
};

export const changePassword = (currentPassword, newPassword) => {
  return api.put('/users/change-password', {
    current_password: currentPassword,
    new_password: newPassword
  });
};

export const changeEmail = (newEmail, password) => {
  return api.put('/users/change-email', {
    new_email: newEmail,
    password
  });
};

// AI Features
export const generateHashtags = (content, platform, language = 'fr') => {
  return api.post('/ai/hashtags', {
    content,
    platform,
    language
  });
};

export const suggestEmojis = (content, platform) => {
  return api.post('/ai/emojis', {
    content,
    platform
  });
};

export const analyzeContent = (content) => {
  return api.post('/ai/analyze', {
    content
  });
};

export const getBestPostingTime = (platform) => {
  return api.get(`/ai/best-posting-time?platform=${platform}`);
};

export const improveContent = (content, tone, language) => {
  return api.post('/ai/improve', {
    content,
    tone,
    language
  });
};

// Stripe Payments
export const createCheckoutSession = (plan, successUrl, cancelUrl) => {
  return api.post('/stripe/create-checkout-session', {
    plan,
    success_url: successUrl,
    cancel_url: cancelUrl
  });
};

export const createPortalSession = (returnUrl) => {
  return api.post('/stripe/create-portal-session', {
    return_url: returnUrl
  });
};

export const getSubscriptionInfo = () => {
  return api.get('/stripe/subscription-info');
};

// Pro/Business Analytics
export const getFormatAnalytics = () => {
  return api.get('/analytics/format-analytics');
};

export const getPerformanceSummary = (days = 30) => {
  return api.get(`/analytics/performance-summary?days=${days}`);
};

// Calendar
export const scheduleContent = (data) => {
  return api.post('/calendar/schedule', data);
};

export const getCalendarView = (startDate, endDate, platform = null) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (platform) params.append('platform', platform);
  return api.get(`/calendar/view?${params.toString()}`);
};

export const updateScheduledContent = (scheduleId, data) => {
  return api.put(`/calendar/${scheduleId}`, data);
};

export const deleteScheduledContent = (scheduleId) => {
  return api.delete(`/calendar/${scheduleId}`);
};

export const getUpcomingContent = (days = 7) => {
  return api.get(`/calendar/upcoming?days=${days}`);
};

// Teams
export const createTeam = (name) => {
  return api.post('/teams/create', { name });
};

export const getMyTeam = () => {
  return api.get('/teams/my-team');
};

export const inviteTeamMember = (email) => {
  return api.post('/teams/invite', { email });
};

export const acceptTeamInvitation = (token) => {
  return api.post(`/teams/accept-invitation?token=${token}`);
};

export const removeTeamMember = (memberId) => {
  return api.delete(`/teams/members/${memberId}`);
};

export const leaveTeam = () => {
  return api.post('/teams/leave');
};

export const updateTeam = (name) => {
  return api.put('/teams/update', null, { params: { name } });
};

export const joinTeamWithCode = (code) => {
  return api.post('/teams/join', { code });
};

// Pro Trial
export const getProTrialStatus = () => {
  return api.get('/trial/status');
};

export const activateProTrial = () => {
  return api.post('/trial/activate-pro-trial');
};

// Onboarding
export const saveOnboardingData = (data) => {
  return api.post('/onboarding/complete', data);
};

export const getOnboardingStatus = () => {
  return api.get('/onboarding/status');
};

export const resetOnboarding = () => {
  return api.post('/onboarding/reset');
};

// Style Profiles
export const getAvailableTones = () => {
  return api.get('/styles/available-tones');
};

export const getMyStyleProfiles = () => {
  return api.get('/styles/my-profiles');
};

export const createStyleProfile = (styleType, sourceUrl, styleName = null) => {
  return api.post('/styles/create', {
    style_type: styleType,
    source_url: sourceUrl,
    style_name: styleName
  });
};

export const deleteStyleProfile = (profileId) => {
  return api.delete(`/styles/${profileId}`);
};

export const reanalyzeStyleProfile = (profileId) => {
  return api.post(`/styles/${profileId}/reanalyze`);
};

export { API_URL };

export default api;