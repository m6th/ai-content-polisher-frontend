import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Loader, Sparkles } from 'lucide-react';
import axios from 'axios';

function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [teamName, setTeamName] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const acceptInvitation = async () => {
      // Vérifier si l'utilisateur est connecté
      const authToken = localStorage.getItem('token');

      if (!authToken) {
        // Rediriger vers la page de connexion avec le token
        navigate(`/login?invitation=${token}`);
        return;
      }

      if (!token) {
        setStatus('error');
        setMessage('Token d\'invitation manquant');
        return;
      }

      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/teams/accept-invitation',
          null,
          {
            params: { token },
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
        );

        setStatus('success');
        setTeamName(response.data.team.name || 'l\'équipe');
        setMessage('Vous avez rejoint l\'équipe avec succès !');

        // Rediriger vers la page équipe après 2 secondes
        setTimeout(() => {
          navigate('/team');
        }, 2000);

      } catch (err) {
        console.error('Error accepting invitation:', err);
        setStatus('error');

        if (err.response?.status === 404) {
          setMessage('Invitation introuvable ou déjà utilisée');
        } else if (err.response?.status === 400) {
          setMessage(err.response.data.detail || 'Cette invitation a expiré ou n\'est plus valide');
        } else if (err.response?.status === 401) {
          // Token expiré, rediriger vers login
          navigate(`/login?invitation=${token}`);
        } else {
          setMessage('Erreur lors de l\'acceptation de l\'invitation');
        }
      }
    };

    acceptInvitation();
  }, [token, navigate]);

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
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full mb-6">
                  <Loader className="h-10 w-10 text-purple-600 dark:text-purple-400 animate-spin" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                  Acceptation de l'invitation
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Veuillez patienter pendant que nous traitons votre invitation...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                  Bienvenue dans l'équipe !
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  {message}
                </p>
                {teamName && (
                  <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">
                    {teamName}
                  </p>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Vous allez être redirigé vers la page équipe...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full mb-6">
                  <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                  Erreur
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {message}
                </p>
                <div className="space-y-3">
                  <Link
                    to="/team"
                    className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    <Users className="inline-block h-5 w-5 mr-2" />
                    Voir mes équipes
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                  >
                    Retour au tableau de bord
                  </Link>
                </div>
              </>
            )}
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

export default AcceptInvitation;
