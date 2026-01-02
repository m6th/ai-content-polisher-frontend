import { useState, useEffect } from 'react';
import { Users, Plus, Mail, Shield, Trash2, UserPlus, Crown, AlertCircle, Check, Copy, X, Sparkles } from 'lucide-react';
import {
  getMyTeam,
  createTeam,
  inviteTeamMember,
  removeTeamMember,
  leaveTeam,
  updateTeam,
  getProTrialStatus
} from '../services/api';
import ProTrialModal from './ProTrialModal';
import { useNavigate } from 'react-router-dom';

function TeamManagement({ user }) {
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);
  const [lastInvitation, setLastInvitation] = useState(null);

  // Pro Trial Modal
  const [showProTrialModal, setShowProTrialModal] = useState(false);
  const [canUseTrial, setCanUseTrial] = useState(false);
  const [previewMode, setPreviewMode] = useState(false); // Mode aperçu pour Free/Starter

  const isPro = user?.current_plan === 'pro' || user?.current_plan === 'business';

  useEffect(() => {
    const checkAccess = async () => {
      if (!isPro) {
        if (previewMode) {
          // Si on est en mode preview, charger les données de démo
          loadDemoData();
        } else {
          // Sinon, charger le statut du trial et afficher le modal
          try {
            const response = await getProTrialStatus();
            setCanUseTrial(response.data.can_use_trial);
          } catch (err) {
            console.error('Error loading trial status:', err);
          }
          setShowProTrialModal(true);
          setLoading(false);
        }
      } else {
        loadTeamData();
      }
    };

    checkAccess();
  }, [isPro, previewMode]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyTeam();
      setTeamData(response.data);
    } catch (err) {
      console.error('Error loading team:', err);
      if (err.response?.status === 403) {
        setError('La gestion d\'équipe est réservée aux plans Pro et Business');
      } else {
        setError('Erreur lors du chargement de l\'équipe');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    // Créer des données de démonstration pour le mode aperçu
    setTeamData({
      team: {
        id: 'demo-team',
        name: 'Mon Équipe Marketing',
        plan: 'Pro',
        current_members: 3,
        max_members: 5,
        team_credits: 250
      },
      membership: {
        id: 'demo-membership-1',
        role: 'owner',
        user_id: user?.id,
        email: user?.email,
        joined_at: new Date().toISOString()
      },
      members: [
        {
          id: 'demo-membership-1',
          user_id: user?.id,
          email: user?.email,
          role: 'owner',
          joined_at: new Date().toISOString()
        },
        {
          id: 'demo-membership-2',
          user_id: 'demo-user-2',
          email: 'marie.durand@example.com',
          role: 'admin',
          joined_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-membership-3',
          user_id: 'demo-user-3',
          email: 'jean.martin@example.com',
          role: 'member',
          joined_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    });
    setLoading(false);
  };

  const handleActivatePreview = () => {
    setShowProTrialModal(false);
    setPreviewMode(true);
    // Charger immédiatement les données de démo
    loadDemoData();
  };

  const handleCreateTeam = async () => {
    // Bloquer la création en mode preview
    if (previewMode) {
      alert('⚠️ Mode Aperçu\n\nVous explorez l\'interface Pro en mode démonstration.\n\nPour créer réellement une équipe, vous devez passer à un plan Pro ou Business.\n\nCliquez sur "Passer à Pro" pour débloquer cette fonctionnalité !');
      return;
    }

    if (!teamName.trim()) {
      alert('Veuillez entrer un nom d\'équipe');
      return;
    }

    try {
      await createTeam(teamName);
      setShowCreateModal(false);
      setTeamName('');
      loadTeamData();
    } catch (err) {
      console.error('Error creating team:', err);
      alert(err.response?.data?.detail || 'Erreur lors de la création de l\'équipe');
    }
  };

  const handleInviteMember = async () => {
    // Bloquer l'invitation en mode preview
    if (previewMode) {
      alert('⚠️ Mode Aperçu\n\nVous explorez l\'interface Pro en mode démonstration.\n\nPour inviter réellement des membres, vous devez passer à un plan Pro ou Business.\n\nCliquez sur "Passer à Pro" pour débloquer cette fonctionnalité !');
      return;
    }

    if (!inviteEmail.trim()) {
      alert('Veuillez entrer une adresse email');
      return;
    }

    try {
      const response = await inviteTeamMember(inviteEmail);
      setLastInvitation(response.data);
      setInviteEmail('');
      loadTeamData();
    } catch (err) {
      console.error('Error inviting member:', err);
      alert(err.response?.data?.detail || 'Erreur lors de l\'invitation');
    }
  };

  const handleRemoveMember = async (memberId) => {
    // Bloquer le retrait en mode preview
    if (previewMode) {
      alert('⚠️ Mode Aperçu\n\nVous explorez l\'interface Pro en mode démonstration.\n\nPour retirer réellement des membres, vous devez passer à un plan Pro ou Business.\n\nCliquez sur "Passer à Pro" pour débloquer cette fonctionnalité !');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) {
      return;
    }

    try {
      await removeTeamMember(memberId);
      loadTeamData();
    } catch (err) {
      console.error('Error removing member:', err);
      alert(err.response?.data?.detail || 'Erreur lors du retrait du membre');
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm('Êtes-vous sûr de vouloir quitter cette équipe ?')) {
      return;
    }

    try {
      await leaveTeam();
      loadTeamData();
    } catch (err) {
      console.error('Error leaving team:', err);
      alert(err.response?.data?.detail || 'Erreur lors du départ de l\'équipe');
    }
  };

  const handleUpdateTeam = async () => {
    // Bloquer la mise à jour en mode preview
    if (previewMode) {
      alert('⚠️ Mode Aperçu\n\nVous explorez l\'interface Pro en mode démonstration.\n\nPour modifier réellement votre équipe, vous devez passer à un plan Pro ou Business.\n\nCliquez sur "Passer à Pro" pour débloquer cette fonctionnalité !');
      return;
    }

    if (!teamName.trim()) {
      alert('Veuillez entrer un nom d\'équipe');
      return;
    }

    try {
      await updateTeam(teamName);
      setShowEditModal(false);
      loadTeamData();
    } catch (err) {
      console.error('Error updating team:', err);
      alert(err.response?.data?.detail || 'Erreur lors de la mise à jour');
    }
  };

  const copyInvitationCode = () => {
    if (lastInvitation) {
      navigator.clipboard.writeText(lastInvitation.token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
            <Crown className="h-3 w-3" />
            Propriétaire
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
            Membre
          </span>
        );
    }
  };

  if (!isPro && !previewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Gestion d'Équipe
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              La collaboration en équipe est une fonctionnalité exclusive des plans Pro et Business.
              Invitez des membres, gérez les permissions et collaborez efficacement sur vos projets de contenu.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              <span>Passer à Pro</span>
            </a>
          </div>
        </div>

        {/* Pro Trial Modal */}
        <ProTrialModal
          isOpen={showProTrialModal}
          onClose={() => {
            setShowProTrialModal(false);
            navigate('/dashboard');
          }}
          feature="team"
          canUseTrial={canUseTrial}
          onActivateTrial={() => {
            setShowProTrialModal(false);
            navigate('/dashboard');
          }}
          onActivatePreview={handleActivatePreview}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 dark:border-purple-900"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 dark:border-purple-400 absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de l'équipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No team yet
  if (!teamData || !teamData.team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Créez votre équipe
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Vous n'avez pas encore d'équipe. Créez-en une pour commencer à collaborer avec vos collègues
              et partager vos crédits de génération de contenu.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Créer une équipe</span>
            </button>
          </div>
        </div>

        {/* Create Team Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Créer une équipe
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nom de l'équipe
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Ex: Équipe Marketing"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTeam()}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={handleCreateTeam}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Créer
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const isOwner = teamData.membership?.role === 'owner';
  const isAdmin = teamData.membership?.role === 'admin' || isOwner;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <Users className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                {teamData.team.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {teamData.team.current_members} / {teamData.team.max_members} membres • Plan {teamData.team.plan}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {isOwner && (
                <button
                  onClick={() => {
                    setTeamName(teamData.team.name);
                    setShowEditModal(true);
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
                >
                  Modifier
                </button>
              )}
              {isAdmin && teamData.team.current_members < teamData.team.max_members && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Inviter</span>
                </button>
              )}
            </div>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Members List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Membres de l'équipe
              </h2>

              <div className="space-y-4">
                {teamData.members.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {member.name?.charAt(0) || member.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {member.name || member.email}
                          </p>
                          {getRoleBadge(member.role)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Rejoint le {new Date(member.joined_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    {isAdmin && member.role !== 'owner' && member.user_id !== user.id && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}

                    {!isAdmin && member.user_id === user.id && member.role !== 'owner' && (
                      <button
                        onClick={handleLeaveTeam}
                        className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                      >
                        Quitter
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Membres actifs</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {teamData.team.current_members}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Capacité max</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {teamData.team.max_members}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Places restantes</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {teamData.team.max_members - teamData.team.current_members}
                  </span>
                </div>
              </div>
            </div>

            {/* Pending Invitations */}
            {teamData.pending_invitations.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Invitations en attente
                </h3>
                <div className="space-y-3">
                  {teamData.pending_invitations.map(invitation => (
                    <div
                      key={invitation.id}
                      className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {invitation.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Expire le {new Date(invitation.expires_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Your Role */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Votre rôle
              </h3>
              <div className="text-center">
                {getRoleBadge(teamData.membership.role)}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Membre depuis le {new Date(teamData.membership.joined_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Inviter un membre
              </h3>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setLastInvitation(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {!lastInvitation ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="membre@example.com"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && handleInviteMember()}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-6">
                  <button
                    onClick={handleInviteMember}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    <Mail className="h-4 w-4 inline mr-2" />
                    Envoyer l'invitation
                  </button>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Invitation créée pour <strong>{lastInvitation.email}</strong>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                    Partagez ce code d'invitation :
                  </p>
                  <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Code d'invitation</p>
                    <p className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400 break-all">
                      {lastInvitation.token}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    💡 La personne invitée doit aller sur "Rejoindre une équipe" et entrer ce code
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={copyInvitationCode}
                    className="flex-1 flex items-center justify-center space-x-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-6 py-3 rounded-xl font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
                  >
                    {copiedToken ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Code copié!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        <span>Copier le code</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setLastInvitation(null);
                    }}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Modifier l'équipe
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nom de l'équipe
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdateTeam()}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleUpdateTeam}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Mettre à jour
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamManagement;
