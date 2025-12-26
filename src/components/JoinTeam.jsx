import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Key, Sparkles, ArrowRight } from 'lucide-react';
import { joinTeamWithCode } from '../services/api';

function JoinTeam() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Veuillez entrer un code d\'invitation');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Redirect to login with code
        navigate(`/login?join_code=${encodeURIComponent(code)}`);
        return;
      }

      await joinTeamWithCode(code);

      // Success - redirect to team page
      navigate('/team');
    } catch (err) {
      console.error('Error joining team:', err);
      if (err.response?.status === 404) {
        setError('Code d\'invitation invalide ou expiré');
      } else if (err.response?.status === 400) {
        setError(err.response.data.detail || 'Erreur lors de la tentative de rejoindre l\'équipe');
      } else if (err.response?.status === 401) {
        // Token expiré, redirect to login
        navigate(`/login?join_code=${encodeURIComponent(code)}`);
      } else {
        setError('Erreur lors de la tentative de rejoindre l\'équipe');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-20 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-md w-full">
        {/* Logo Badge */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <span>AI Content Polisher</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full mb-4">
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              Rejoindre une équipe
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Entrez le code d'invitation pour rejoindre une équipe
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Code d'invitation
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Entrez le code d'invitation"
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span>Rejoindre l'équipe</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Help text */}
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>Vous n'avez pas de code ?</p>
            <p className="mt-1">Demandez à l'administrateur de l'équipe de vous en fournir un.</p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JoinTeam;
