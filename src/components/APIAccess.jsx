import { useState, useEffect } from 'react';
import { Key, Plus, Copy, Trash2, AlertCircle, Check, Code, Book, Activity, X, FileText, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function APIAccess({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('keys'); // 'keys' ou 'docs'
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState(null); // Clé complète affichée une seule fois
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

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

  const copyCodeToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
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

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('keys')}
                className={`pb-4 px-1 font-semibold transition-colors relative ${
                  activeTab === 'keys'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Mes clés API
                </span>
                {activeTab === 'keys' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`pb-4 px-1 font-semibold transition-colors relative ${
                  activeTab === 'docs'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Documentation
                </span>
                {activeTab === 'docs' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'keys' ? (
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
        ) : (
          /* Documentation Tab */
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Quick Start */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Documentation API</h2>
                  <p className="text-gray-600 dark:text-gray-400">Guide complet pour intégrer AI Content Polisher</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Base URL</h3>
                <code className="block bg-white dark:bg-slate-900 p-3 rounded border border-blue-200 dark:border-blue-800 text-sm">
                  {API_URL}
                </code>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Authentication</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Toutes les requêtes doivent inclure votre clé API dans le header Authorization:
                  </p>
                  <code className="block bg-gray-100 dark:bg-slate-900 p-3 rounded text-sm">
                    Authorization: Bearer acp_live_xxxxxxxxxxxxx
                  </code>
                </div>

                <div className="pt-4">
                  <a
                    href={`${API_URL}/docs`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Voir la documentation Swagger interactive
                  </a>
                </div>
              </div>
            </div>

            {/* Endpoints */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Endpoints disponibles</h2>

              <div className="space-y-6">
                {/* POST /generate */}
                <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-6 rounded-r-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md">POST</span>
                    <code className="text-lg font-mono text-gray-900 dark:text-white">/api/v1/generate</code>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Génère du contenu optimisé pour une plateforme spécifique.
                  </p>

                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Paramètres (JSON body)</h4>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded border border-green-200 dark:border-green-800 space-y-2 text-sm">
                    <div><code className="text-blue-600">text</code> <span className="text-red-600">*</span> <span className="text-gray-600 dark:text-gray-400">string</span> - Le texte à transformer</div>
                    <div><code className="text-blue-600">platform</code> <span className="text-red-600">*</span> <span className="text-gray-600 dark:text-gray-400">string</span> - linkedin | instagram | tiktok | facebook | twitter | multi_format</div>
                    <div><code className="text-blue-600">tone</code> <span className="text-gray-600 dark:text-gray-400">string</span> - professional | engaging | storytelling (défaut: professional)</div>
                    <div><code className="text-blue-600">language</code> <span className="text-gray-600 dark:text-gray-400">string</span> - fr | en | es (défaut: fr)</div>
                  </div>

                  <h4 className="font-semibold text-gray-900 dark:text-white mt-4 mb-2">Réponse (200 OK)</h4>
                  <pre className="bg-white dark:bg-slate-900 p-4 rounded border border-green-200 dark:border-green-800 text-xs overflow-x-auto">
{`{
  "request_id": 123,
  "original_text": "Votre texte...",
  "platform": "linkedin",
  "variants": [
    {
      "id": 456,
      "polished_text": "Contenu généré...",
      "format_name": "linkedin",
      "variant_number": 1,
      "created_at": "2026-01-03T12:00:00"
    }
  ],
  "credits_used": 1,
  "credits_remaining": 999
}`}
                  </pre>
                </div>

                {/* GET /content */}
                <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-r-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-md">GET</span>
                    <code className="text-lg font-mono text-gray-900 dark:text-white">/api/v1/content</code>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Récupère l'historique de vos contenus générés.
                  </p>

                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Paramètres (Query params)</h4>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded border border-blue-200 dark:border-blue-800 space-y-2 text-sm">
                    <div><code className="text-blue-600">limit</code> <span className="text-gray-600 dark:text-gray-400">integer</span> - Nombre de résultats (défaut: 50, max: 100)</div>
                    <div><code className="text-blue-600">offset</code> <span className="text-gray-600 dark:text-gray-400">integer</span> - Pagination (défaut: 0)</div>
                  </div>
                </div>

                {/* GET /content/{id} */}
                <div className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 p-6 rounded-r-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-md">GET</span>
                    <code className="text-lg font-mono text-gray-900 dark:text-white">/api/v1/content/{'{request_id}'}</code>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Récupère un contenu spécifique par son ID avec toutes ses variantes.
                  </p>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Exemples de code</h2>

              <div className="space-y-6">
                {/* cURL */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">cURL</h3>
                    <button
                      onClick={() => copyCodeToClipboard(`curl -X POST '${API_URL}/api/v1/generate' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "text": "Votre texte ici",
    "platform": "linkedin",
    "tone": "professional",
    "language": "fr"
  }'`, 'curl')}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {copiedCode === 'curl' ? (
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
                  <pre className="bg-gray-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST '${API_URL}/api/v1/generate' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "text": "Votre texte ici",
    "platform": "linkedin",
    "tone": "professional",
    "language": "fr"
  }'`}
                  </pre>
                </div>

                {/* Python */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Python</h3>
                    <button
                      onClick={() => copyCodeToClipboard(`import requests

API_KEY = "YOUR_API_KEY"
url = "${API_URL}/api/v1/generate"

response = requests.post(
    url,
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    },
    json={
        "text": "Votre texte ici",
        "platform": "linkedin",
        "tone": "professional",
        "language": "fr"
    }
)

data = response.json()
print(data)`, 'python')}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {copiedCode === 'python' ? (
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
                  <pre className="bg-gray-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto">
{`import requests

API_KEY = "YOUR_API_KEY"
url = "${API_URL}/api/v1/generate"

response = requests.post(
    url,
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    },
    json={
        "text": "Votre texte ici",
        "platform": "linkedin",
        "tone": "professional",
        "language": "fr"
    }
)

data = response.json()
print(data)`}
                  </pre>
                </div>

                {/* JavaScript/Node.js */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">JavaScript / Node.js</h3>
                    <button
                      onClick={() => copyCodeToClipboard(`const API_KEY = "YOUR_API_KEY";

fetch("${API_URL}/api/v1/generate", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    text: "Votre texte ici",
    platform: "linkedin",
    tone: "professional",
    language: "fr"
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));`, 'javascript')}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {copiedCode === 'javascript' ? (
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
                  <pre className="bg-gray-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto">
{`const API_KEY = "YOUR_API_KEY";

fetch("${API_URL}/api/v1/generate", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    text: "Votre texte ici",
    platform: "linkedin",
    tone: "professional",
    language: "fr"
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));`}
                  </pre>
                </div>

                {/* PHP */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PHP</h3>
                    <button
                      onClick={() => copyCodeToClipboard(`<?php
$api_key = "YOUR_API_KEY";
$url = "${API_URL}/api/v1/generate";

$data = [
    "text" => "Votre texte ici",
    "platform" => "linkedin",
    "tone" => "professional",
    "language" => "fr"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $api_key,
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
print_r($result);
?>`, 'php')}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {copiedCode === 'php' ? (
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
                  <pre className="bg-gray-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto">
{`<?php
$api_key = "YOUR_API_KEY";
$url = "${API_URL}/api/v1/generate";

$data = [
    "text" => "Votre texte ici",
    "platform" => "linkedin",
    "tone" => "professional",
    "language" => "fr"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $api_key,
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
print_r($result);
?>`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Error Codes */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Codes d'erreur</h2>

              <div className="space-y-3">
                <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-bold text-yellow-900 dark:text-yellow-200">400 Bad Request</code>
                  </div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">Paramètres invalides ou manquants</p>
                </div>

                <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-bold text-red-900 dark:text-red-200">401 Unauthorized</code>
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-300">Clé API invalide ou manquante</p>
                </div>

                <div className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-bold text-orange-900 dark:text-orange-200">402 Payment Required</code>
                  </div>
                  <p className="text-sm text-orange-800 dark:text-orange-300">Crédits insuffisants</p>
                </div>

                <div className="border-l-4 border-pink-500 bg-pink-50 dark:bg-pink-900/20 p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-bold text-pink-900 dark:text-pink-200">403 Forbidden</code>
                  </div>
                  <p className="text-sm text-pink-800 dark:text-pink-300">Accès refusé (plan Business requis)</p>
                </div>

                <div className="border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-900/20 p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-bold text-gray-900 dark:text-gray-200">500 Internal Server Error</code>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-300">Erreur serveur, réessayez plus tard</p>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cas d'usage</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Automatisation de posts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Intégrez dans votre CMS ou outil de social media management pour générer automatiquement du contenu optimisé.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Workflows personnalisés</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connectez à Zapier, Make, ou n'importe quel outil d'automatisation pour créer des workflows sur mesure.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Applications internes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Intégrez dans vos outils internes pour permettre à vos équipes de générer du contenu directement depuis leurs applications.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Génération en masse</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Créez des scripts pour générer du contenu en masse pour plusieurs plateformes simultanément.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
