import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { register } from '../services/api';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Sparkles, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';

function Register() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    plan: searchParams.get('plan') || 'free',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailRegister, setShowEmailRegister] = useState(false);
  const navigate = useNavigate();

  // Display plan name in UI
  const planNames = {
    'free': 'Free',
    'standard': 'Standard',
    'premium': 'Premium',
    'agency': 'Agency'
  };

  const planCredits = {
    'free': '10',
    'standard': '100',
    'premium': '300',
    'agency': '1000'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t.register.errorPasswordMismatch || 'Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError(t.register.errorPasswordLength || 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.name, formData.password, formData.plan);
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(t.register.errorEmailExists);
      } else {
        setError(t.register.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/auth/google', {
        token: credentialResponse.credential,
        plan: formData.plan
      });

      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(t.register.errorGeneric);
    }
  };

  const handleGoogleError = () => {
    setError(t.register.errorGeneric);
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

        {/* Register Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{t.register.title}</h2>
            <p className="text-slate-600 dark:text-slate-400">{t.register.subtitle}</p>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 mb-6 border border-purple-100">
            <div className="space-y-2">
              {formData.plan !== 'free' && (
                <div className="flex items-center space-x-2 text-sm font-semibold text-purple-700 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Plan sélectionné : {planNames[formData.plan]} ({planCredits[formData.plan]} crédits)</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-slate-700">
                <Check className="h-4 w-4 text-green-500" />
                <span>{t.register.bonus}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <p className="font-semibold">Erreur</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {!showEmailRegister ? (
            <>
              {/* Google Register Button */}
              <div className="mb-6">
                <GoogleLogin
                  key={language}
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="large"
                  width="100%"
                  text="signup_with"
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

              {/* Email Register Button */}
              <button
                onClick={() => setShowEmailRegister(true)}
                className="w-full flex items-center justify-center space-x-2 py-4 bg-white border-2 border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <Mail className="h-5 w-5" />
                <span>{language === 'fr' ? "S'inscrire avec Email" : language === 'en' ? 'Sign up with Email' : 'Registrarse con Email'}</span>
              </button>
            </>
          ) : (
            <>
              {/* Email Register Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="flex items-center text-slate-700 dark:text-slate-200 font-semibold mb-2">
                    <User className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                    {t.register.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder={t.register.name}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-slate-700 dark:text-slate-200 font-semibold mb-2">
                    <Mail className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                    {t.register.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="vous@exemple.com"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-slate-700 dark:text-slate-200 font-semibold mb-2">
                    <Lock className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                    {t.register.password}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-slate-700 dark:text-slate-200 font-semibold mb-2">
                    <Lock className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                    {language === 'fr' ? 'Confirmer le mot de passe' : language === 'en' ? 'Confirm password' : 'Confirmar contraseña'}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                      <span>{t.register.registering}</span>
                    </div>
                  ) : (
                    t.register.registerButton
                  )}
                </button>
              </form>

              <button
                onClick={() => setShowEmailRegister(false)}
                className="w-full mt-4 text-slate-600 hover:text-slate-900 text-sm"
              >
                ← {language === 'fr' ? "Retour aux options d'inscription" : language === 'en' ? 'Back to sign up options' : 'Volver a opciones de registro'}
              </button>
            </>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">{t.register.hasAccount}</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full text-center py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all border-2 border-slate-200 hover:border-slate-300"
          >
            {t.register.login}
          </Link>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors">
            ← {t.navbar.appName}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;