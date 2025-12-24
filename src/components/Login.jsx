import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { login, googleLogin } from '../services/api';
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';

function Login({ onLogin }) {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const plan = searchParams.get('plan') || 'free';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.data.access_token);
      onLogin();

      // Si un plan payant a été sélectionné, rediriger vers le paiement
      if (plan !== 'free') {
        navigate(`/checkout?plan=${plan}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(t.login.errorInvalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse.credential);

      localStorage.setItem('token', response.data.access_token);
      onLogin();

      // Si un plan payant a été sélectionné, rediriger vers le paiement
      if (plan !== 'free') {
        navigate(`/checkout?plan=${plan}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Erreur lors de la connexion avec Google');
    }
  };

  const handleGoogleError = () => {
    setError(t.login.errorGeneric);
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

        {/* Login Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-700/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{t.login.title}</h2>
            <p className="text-slate-600 dark:text-slate-400">{t.login.subtitle}</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl mb-6 flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <p className="font-semibold">Erreur</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {!showEmailLogin ? (
            <>
              {/* Google Login Button */}
              <div className="mb-6">
                <GoogleLogin
                  key={language}
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="large"
                  width="100%"
                  text="continue_with"
                  locale={language === 'fr' ? 'fr' : language === 'en' ? 'en' : 'es'}
                />
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">{language === 'fr' ? 'OU' : language === 'en' ? 'OR' : 'O'}</span>
                </div>
              </div>

              {/* Email Login Button */}
              <button
                onClick={() => setShowEmailLogin(true)}
                className="w-full flex items-center justify-center space-x-2 py-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                <Mail className="h-5 w-5" />
                <span>{language === 'fr' ? 'Continuer avec Email' : language === 'en' ? 'Continue with Email' : 'Continuar con Email'}</span>
              </button>
            </>
          ) : (
            <>
              {/* Email Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center text-slate-700 dark:text-slate-200 font-semibold mb-3">
                    <Mail className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    {t.login.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="vous@exemple.com"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-slate-700 dark:text-slate-200 font-semibold mb-3">
                    <Lock className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    {t.login.password}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg pr-12 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t.login.loggingIn}</span>
                    </div>
                  ) : (
                    t.login.loginButton
                  )}
                </button>
              </form>

              <button
                onClick={() => setShowEmailLogin(false)}
                className="w-full mt-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm"
              >
                ← {language === 'fr' ? 'Retour aux options de connexion' : language === 'en' ? 'Back to login options' : 'Volver a opciones de inicio de sesión'}
              </button>
            </>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">{t.login.noAccount}</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="block w-full text-center py-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          >
            {t.login.signUp}
          </Link>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            ← {t.navbar.appName}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;