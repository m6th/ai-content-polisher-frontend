import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, CreditCard, Shield, Check, Eye, EyeOff, Sparkles, RefreshCw } from 'lucide-react';
import { updateProfile, changePassword, changeEmail, getAnalyticsStats, resetOnboarding } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

function Account({ user, onUpdateUser }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Email state
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Stats state
  const [stats, setStats] = useState(null);

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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      await updateProfile(name);
      setEditingProfile(false);
      onUpdateUser();
      toast.success(
        language === 'fr' ? 'Profil mis à jour avec succès !' :
        language === 'en' ? 'Profile updated successfully!' :
        '¡Perfil actualizado con éxito!'
      );
    } catch (error) {
      const errorMsg = error.response?.data?.detail ||
        (language === 'fr' ? 'Erreur lors de la mise à jour du profil' :
         language === 'en' ? 'Failed to update profile' :
         'Error al actualizar el perfil');
      toast.error(errorMsg);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      const errorMsg = language === 'fr' ? 'Les mots de passe ne correspondent pas' :
        language === 'en' ? 'Passwords do not match' :
        'Las contraseñas no coinciden';
      toast.error(errorMsg);
      return;
    }

    if (newPassword.length < 6) {
      const errorMsg = language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères' :
        language === 'en' ? 'Password must be at least 6 characters' :
        'La contraseña debe tener al menos 6 caracteres';
      toast.error(errorMsg);
      return;
    }

    setPasswordLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(
        language === 'fr' ? 'Mot de passe modifié avec succès !' :
        language === 'en' ? 'Password changed successfully!' :
        '¡Contraseña cambiada con éxito!'
      );
    } catch (error) {
      const errorMsg = error.response?.data?.detail ||
        (language === 'fr' ? 'Erreur lors du changement de mot de passe' :
         language === 'en' ? 'Failed to change password' :
         'Error al cambiar la contraseña');
      toast.error(errorMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();

    if (!newEmail || !newEmail.includes('@')) {
      const errorMsg = language === 'fr' ? 'Email invalide' :
        language === 'en' ? 'Invalid email' :
        'Email inválido';
      toast.error(errorMsg);
      return;
    }

    setEmailLoading(true);

    try {
      await changeEmail(newEmail, emailPassword);
      setEditingEmail(false);
      setNewEmail('');
      setEmailPassword('');
      onUpdateUser();
      toast.success(
        language === 'fr' ? 'Email modifié ! Vérifiez votre nouveau email.' :
        language === 'en' ? 'Email changed! Check your new email.' :
        '¡Email cambiado! Verifica tu nuevo email.'
      );
    } catch (error) {
      const errorMsg = error.response?.data?.detail ||
        (language === 'fr' ? 'Erreur lors du changement d\'email' :
         language === 'en' ? 'Failed to change email' :
         'Error al cambiar el email');
      toast.error(errorMsg);
    } finally {
      setEmailLoading(false);
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

  const isGoogleAccount = !user?.password_hash;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-3 sm:mb-4">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400 mr-2 sm:mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
              {language === 'fr' ? 'Mon compte' : language === 'en' ? 'My Account' : 'Mi cuenta'}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400">
            {language === 'fr' ? 'Gérez vos informations personnelles et vos paramètres' : language === 'en' ? 'Manage your personal information and settings' : 'Gestiona tu información personal y configuración'}
          </p>
        </div>

        {/* Account Stats */}
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
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
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
            <a
              href="/pricing"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold text-sm text-center shadow-lg"
            >
              {language === 'fr' ? 'Améliorer mon plan' : language === 'en' ? 'Upgrade plan' : 'Mejorar plan'}
            </a>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-gray-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <User className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-600 dark:text-purple-400" />
              {language === 'fr' ? 'Profil' : language === 'en' ? 'Profile' : 'Perfil'}
            </h2>
            {!editingProfile && (
              <button
                onClick={() => setEditingProfile(true)}
                className="w-full sm:w-auto px-4 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg transition-colors text-sm sm:text-base font-medium"
              >
                {language === 'fr' ? 'Modifier' : language === 'en' ? 'Edit' : 'Editar'}
              </button>
            )}
          </div>

          {editingProfile ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  {language === 'fr' ? 'Nom' : language === 'en' ? 'Name' : 'Nombre'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {profileLoading ? (language === 'fr' ? 'Enregistrement...' : language === 'en' ? 'Saving...' : 'Guardando...') : (language === 'fr' ? 'Enregistrer' : language === 'en' ? 'Save' : 'Guardar')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(false);
                    setName(user?.name || '');
                  }}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {language === 'fr' ? 'Annuler' : language === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600 dark:text-slate-400">{language === 'fr' ? 'Nom' : language === 'en' ? 'Name' : 'Nombre'}</span>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{user?.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Email Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-gray-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 dark:text-blue-400" />
              Email
            </h2>
            {!editingEmail && !isGoogleAccount && (
              <button
                onClick={() => setEditingEmail(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors text-sm sm:text-base font-medium"
              >
                {language === 'fr' ? 'Modifier' : language === 'en' ? 'Change' : 'Cambiar'}
              </button>
            )}
          </div>

          {isGoogleAccount && (
            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-300 mb-4">
              <Shield className="h-5 w-5 mr-2" />
              <span>
                {language === 'fr' ? 'Compte Google OAuth - Email non modifiable' : language === 'en' ? 'Google OAuth Account - Email cannot be changed' : 'Cuenta Google OAuth - Email no modificable'}
              </span>
            </div>
          )}

          {editingEmail ? (
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  {language === 'fr' ? 'Email actuel' : language === 'en' ? 'Current email' : 'Email actual'}
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  {language === 'fr' ? 'Nouvel email' : language === 'en' ? 'New email' : 'Nuevo email'}
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  {language === 'fr' ? 'Mot de passe (pour confirmation)' : language === 'en' ? 'Password (for confirmation)' : 'Contraseña (para confirmación)'}
                </label>
                <input
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {emailLoading ? (language === 'fr' ? 'Modification...' : language === 'en' ? 'Changing...' : 'Cambiando...') : (language === 'fr' ? 'Modifier l\'email' : language === 'en' ? 'Change email' : 'Cambiar email')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEmail(false);
                    setNewEmail('');
                    setEmailPassword('');
                  }}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {language === 'fr' ? 'Annuler' : language === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600 dark:text-slate-400">Email</span>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{user?.email}</p>
                  {user?.email_verified === 1 && (
                    <span className="flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-semibold">
                      <Check className="h-3 w-3 mr-1" />
                      {language === 'fr' ? 'Vérifié' : language === 'en' ? 'Verified' : 'Verificado'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preferences Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-gray-100 dark:border-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center">
            <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-600 dark:text-purple-400" />
            {language === 'fr' ? 'Préférences' : language === 'en' ? 'Preferences' : 'Preferencias'}
          </h2>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 sm:p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'fr' ? 'Guide de démarrage' : language === 'en' ? 'Getting Started Guide' : 'Guía de inicio'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {language === 'fr'
                    ? 'Refaites le guide de démarrage pour mettre à jour vos préférences (réseaux sociaux, style d\'écriture, etc.)'
                    : language === 'en'
                    ? 'Redo the getting started guide to update your preferences (social networks, writing style, etc.)'
                    : 'Rehace la guía de inicio para actualizar tus preferencias (redes sociales, estilo de escritura, etc.)'}
                </p>
              </div>
              <button
                onClick={async () => {
                  try {
                    await resetOnboarding();
                    toast.success(
                      language === 'fr' ? 'Redirection vers le guide...' :
                      language === 'en' ? 'Redirecting to guide...' :
                      'Redirigiendo a la guía...'
                    );
                    setTimeout(() => {
                      navigate('/onboarding');
                    }, 500);
                  } catch (error) {
                    toast.error(
                      language === 'fr' ? 'Erreur lors de la réinitialisation' :
                      language === 'en' ? 'Error resetting onboarding' :
                      'Error al reiniciar la guía'
                    );
                  }
                }}
                className="shrink-0 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                {language === 'fr' ? 'Refaire le guide' : language === 'en' ? 'Redo guide' : 'Rehacer guía'}
              </button>
            </div>
          </div>
        </div>

        {/* Password Section */}
        {!isGoogleAccount && (
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border-2 border-gray-100 dark:border-slate-700">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center">
              <Lock className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-red-600 dark:text-red-400" />
              {language === 'fr' ? 'Mot de passe' : language === 'en' ? 'Password' : 'Contraseña'}
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  {language === 'fr' ? 'Mot de passe actuel' : language === 'en' ? 'Current password' : 'Contraseña actual'}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  {language === 'fr' ? 'Nouveau mot de passe' : language === 'en' ? 'New password' : 'Nueva contraseña'}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  {language === 'fr' ? 'Confirmer le nouveau mot de passe' : language === 'en' ? 'Confirm new password' : 'Confirmar nueva contraseña'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {passwordLoading ? (language === 'fr' ? 'Modification...' : language === 'en' ? 'Changing...' : 'Cambiando...') : (language === 'fr' ? 'Modifier le mot de passe' : language === 'en' ? 'Change password' : 'Cambiar contraseña')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
