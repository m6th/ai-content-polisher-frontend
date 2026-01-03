import { useState, useEffect } from 'react';
import { Key, Plus, Copy, Trash2, AlertCircle, Check, Code, Book, Activity, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function APIAccess({ user }) {
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState(null); // Clé complète affichée une seule fois
  const [copiedKey, setCopiedKey] = useState(false);

  // Vérifier que l'utilisateur est Business
  const isBusiness = user?.current_plan === 'business';

  useEffect(() => {
    if (isBusiness) {
      loadAPIKeys();
    } else {
      setLoading(false);
    }
  }, [isBusiness]);

  const loadAPIKeys = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/keys`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiKeys(response.data);
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      alert('Veuillez entrer un nom pour la clé');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/keys`,
        { name: newKeyName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCreatedKey(response.data);
      setNewKeyName('');
      setShowCreateModal(false);
      loadAPIKeys();
    } catch (error) {
      console.error('Error creating API key:', error);
      alert(error.response?.data?.detail || 'Erreur lors de la création de la clé');
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!confirm('Êtes-vous sûr de vouloir révoquer cette clé API ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/keys/${keyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadAPIKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      alert('Erreur lors de la suppression de la clé');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (!isBusiness) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Accès API
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              L'accès API est une fonctionnalité exclusive du plan Business.
              Intégrez AI Content Polisher directement dans vos applications et workflows.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              <span>Passer à Business</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-900"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 dark:border-blue-400 absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Key className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            Accès API
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos clés API et intégrez AI Content Polisher dans vos applications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* API Keys Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* API Keys List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Vos clés API
                </h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle clé
                </button>
              </div>

              {apiKeys.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Vous n'avez pas encore de clés API
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Créer votre première clé →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map(key => (
                    <div
                      key={key.id}
                      className="border-2 border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {key.name}
                            </h3>
                            {key.is_active ? (
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
                                Révoquée
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <code className="text-sm bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                              {key.key_prefix}••••••••••••••
                            </code>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Créée: {new Date(key.created_at).toLocaleDateString('fr-FR')}</span>
                            {key.last_used_at && (
                              <span>
                                Dernière utilisation: {new Date(key.last_used_at).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteKey(key.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Documentation Quick Links */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Book className="h-6 w-6 text-blue-600" />
                Documentation API
              </h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Génération de contenu</h4>
                  <code className="text-sm text-gray-600 dark:text-gray-400">POST /api/v1/generate</code>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Génère du contenu optimisé pour vos plateformes sociales
                  </p>
                </div>
                <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Historique des contenus</h4>
                  <code className="text-sm text-gray-600 dark:text-gray-400">GET /api/v1/content</code>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Récupère l'historique de vos contenus générés
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Utilisation
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Crédits restants</span>
                    <span className="font-bold text-gray-900 dark:text-white">{user?.credits_remaining || 0}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Clés actives</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {apiKeys.filter(k => k.is_active).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Code */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Exemple cURL
              </h3>
              <pre className="bg-gray-100 dark:bg-slate-900 p-3 rounded-lg text-xs overflow-x-auto">
{`curl -X POST \\
  '${API_URL}/api/v1/generate' \\
  -H 'Authorization: Bearer acp_live_xxxxx' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "text": "Votre texte ici",
    "platform": "linkedin",
    "tone": "professional"
  }'`}
              </pre>
            </div>
          </div>
        </div>

        {/* Create Key Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Créer une clé API
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
                    Nom de la clé
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Ex: Production Server, Development"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateKey()}
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Important:</strong> La clé sera affichée une seule fois après la création.
                      Copiez-la dans un endroit sûr.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateKey}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Créer la clé
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
          </div>
        )}

        {/* Created Key Modal */}
        {createdKey && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  ✅ Clé API créée avec succès !
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Copiez cette clé maintenant. Vous ne pourrez plus la voir après.
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900 dark:text-red-200 mb-1">
                      ⚠️ Stockez cette clé en sécurité
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-300">
                      Cette clé ne sera plus jamais affichée. Si vous la perdez, vous devrez en créer une nouvelle.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Votre clé API:</span>
                  <button
                    onClick={() => copyToClipboard(createdKey.api_key)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copier
                      </>
                    )}
                  </button>
                </div>
                <code className="block bg-white dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-slate-700 text-sm font-mono break-all">
                  {createdKey.api_key}
                </code>
              </div>

              <button
                onClick={() => setCreatedKey(null)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                J'ai sauvegardé ma clé
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default APIAccess;
