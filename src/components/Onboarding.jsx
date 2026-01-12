import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, Linkedin, Twitter, Instagram, Facebook, MessageCircle, Youtube } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { saveOnboardingData } from '../services/api';
import { useToast } from '../contexts/ToastContext';

function Onboarding({ user }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Onboarding data
  const [onboardingData, setOnboardingData] = useState({
    discoverySource: '',
    discoverySourceOther: '',
    preferredNetworks: [],
    socialUrls: {
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: '',
      tiktok: '',
      youtube: ''
    },
    styleOption: '', // 'personal', 'creator', 'predefined'
    creatorUrl: '',
    preferredStyle: '',
    fallbackStyle: '', // Style de secours si le scraping échoue
    consentDataStorage: false
  });

  const totalSteps = 5;

  // Discovery sources
  const discoverySources = {
    fr: [
      { id: 'google', label: 'Google / Moteur de recherche' },
      { id: 'social', label: 'Réseaux sociaux' },
      { id: 'friend', label: 'Recommandation d\'un ami' },
      { id: 'blog', label: 'Article de blog / Site web' },
      { id: 'ads', label: 'Publicité' },
      { id: 'other', label: 'Autre' }
    ],
    en: [
      { id: 'google', label: 'Google / Search engine' },
      { id: 'social', label: 'Social media' },
      { id: 'friend', label: 'Friend recommendation' },
      { id: 'blog', label: 'Blog post / Website' },
      { id: 'ads', label: 'Advertisement' },
      { id: 'other', label: 'Other' }
    ],
    es: [
      { id: 'google', label: 'Google / Motor de búsqueda' },
      { id: 'social', label: 'Redes sociales' },
      { id: 'friend', label: 'Recomendación de un amigo' },
      { id: 'blog', label: 'Artículo de blog / Sitio web' },
      { id: 'ads', label: 'Publicidad' },
      { id: 'other', label: 'Otro' }
    ]
  };

  // Social networks
  const socialNetworks = [
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-700' },
    { id: 'twitter', label: 'Twitter / X', icon: Twitter, color: 'from-sky-500 to-sky-600' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-600' },
    { id: 'tiktok', label: 'TikTok', icon: MessageCircle, color: 'from-gray-800 to-black' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' }
  ];

  // Writing styles
  const writingStyles = {
    fr: [
      { id: 'professional', label: 'Professionnel', emoji: '💼', description: 'Ton formel et structuré' },
      { id: 'friendly', label: 'Amical', emoji: '😊', description: 'Ton décontracté et accessible' },
      { id: 'inspiring', label: 'Inspirant', emoji: '✨', description: 'Motivant et encourageant' },
      { id: 'narrative', label: 'Narratif', emoji: '📖', description: 'Storytelling et récits' },
      { id: 'promotional', label: 'Promotionnel', emoji: '🎯', description: 'Orienté vente et conversion' },
      { id: 'educational', label: 'Éducatif', emoji: '🎓', description: 'Pédagogique et informatif' },
      { id: 'humorous', label: 'Humoristique', emoji: '😄', description: 'Léger et divertissant' }
    ],
    en: [
      { id: 'professional', label: 'Professional', emoji: '💼', description: 'Formal and structured tone' },
      { id: 'friendly', label: 'Friendly', emoji: '😊', description: 'Casual and accessible tone' },
      { id: 'inspiring', label: 'Inspiring', emoji: '✨', description: 'Motivating and encouraging' },
      { id: 'narrative', label: 'Narrative', emoji: '📖', description: 'Storytelling and stories' },
      { id: 'promotional', label: 'Promotional', emoji: '🎯', description: 'Sales and conversion focused' },
      { id: 'educational', label: 'Educational', emoji: '🎓', description: 'Pedagogical and informative' },
      { id: 'humorous', label: 'Humorous', emoji: '😄', description: 'Light and entertaining' }
    ],
    es: [
      { id: 'professional', label: 'Profesional', emoji: '💼', description: 'Tono formal y estructurado' },
      { id: 'friendly', label: 'Amigable', emoji: '😊', description: 'Tono casual y accesible' },
      { id: 'inspiring', label: 'Inspirador', emoji: '✨', description: 'Motivador y alentador' },
      { id: 'narrative', label: 'Narrativo', emoji: '📖', description: 'Storytelling y relatos' },
      { id: 'promotional', label: 'Promocional', emoji: '🎯', description: 'Enfocado en ventas' },
      { id: 'educational', label: 'Educativo', emoji: '🎓', description: 'Pedagógico e informativo' },
      { id: 'humorous', label: 'Humorístico', emoji: '😄', description: 'Ligero y entretenido' }
    ]
  };

  const texts = {
    fr: {
      step1: {
        title: `Bienvenue, ${user?.name} !`,
        subtitle: 'Je suis AI Content Polisher, ton assistant IA personnel pour tous tes réseaux sociaux.',
        description: 'Je vais t\'aider à créer des posts parfaits qui t\'aideront à développer ton audience et à atteindre tes objectifs.',
        button: 'Commençons'
      },
      step2: {
        title: 'Comment nous as-tu trouvé ?',
        subtitle: 'Ensuite on parle de toi, promis 😉',
        otherPlaceholder: 'Précise comment tu nous as trouvé...'
      },
      step3: {
        title: 'Connecte tes réseaux sociaux',
        subtitle: 'Ajoute les URLs de tes profils pour que l\'IA apprenne ton style d\'écriture (optionnel)',
        note: 'Ces informations nous permettront de personnaliser les contenus générés selon ton style',
        placeholders: {
          linkedin: 'https://linkedin.com/in/ton-profil',
          twitter: 'https://twitter.com/ton-pseudo',
          instagram: 'https://instagram.com/ton-pseudo',
          facebook: 'https://facebook.com/ton-profil',
          tiktok: 'https://tiktok.com/@ton-pseudo',
          youtube: 'https://youtube.com/@ta-chaine'
        }
      },
      step4: {
        title: 'Comment veux-tu que l\'IA écrive ?',
        subtitle: 'Choisis la méthode qui te correspond le mieux',
        options: {
          personal: {
            label: 'Mon style personnel',
            description: 'L\'IA analyse tes posts sur LinkedIn/Instagram/Facebook pour apprendre ton style unique',
            note: 'Nécessite au moins une URL renseignée à l\'étape précédente'
          },
          creator: {
            label: 'Style d\'un créateur',
            description: 'Imite le style d\'un créateur que tu admires',
            placeholder: 'https://linkedin.com/in/createur-inspire'
          },
          predefined: {
            label: 'Style prédéfini',
            description: 'Choisis parmi nos styles optimisés pour tous les réseaux'
          }
        },
        fallbackLabel: 'Style de secours',
        fallbackNote: 'Ce style sera utilisé si l\'analyse échoue ou pour les réseaux non supportés (Twitter, TikTok, YouTube)'
      },
      step5: {
        title: 'Dernière étape !',
        subtitle: 'Tes données sont importantes pour nous',
        consent: 'J\'accepte que mes préférences soient enregistrées pour améliorer mon expérience et personnaliser mes contenus.',
        privacy: 'En cochant cette case, tu acceptes notre',
        privacyLink: 'Politique de confidentialité',
        and: 'et nos',
        termsLink: 'Conditions d\'utilisation',
        note: 'Tes données sont stockées de manière sécurisée et ne seront jamais partagées avec des tiers.',
        button: 'Commencer à créer'
      },
      continue: 'Continuer',
      skip: 'Passer',
      back: 'Retour'
    },
    en: {
      step1: {
        title: `Welcome, ${user?.name}!`,
        subtitle: 'I\'m AI Content Polisher, your personal AI assistant for all your social networks.',
        description: 'I\'ll help you create perfect posts that will help you grow your audience and achieve your goals.',
        button: 'Let\'s start'
      },
      step2: {
        title: 'How did you find us?',
        subtitle: 'Then we\'ll talk about you, promise 😉',
        otherPlaceholder: 'Specify how you found us...'
      },
      step3: {
        title: 'Connect your social networks',
        subtitle: 'Add your profile URLs so the AI can learn your writing style (optional)',
        note: 'This will help us personalize generated content to match your style',
        placeholders: {
          linkedin: 'https://linkedin.com/in/your-profile',
          twitter: 'https://twitter.com/your-username',
          instagram: 'https://instagram.com/your-username',
          facebook: 'https://facebook.com/your-profile',
          tiktok: 'https://tiktok.com/@your-username',
          youtube: 'https://youtube.com/@your-channel'
        }
      },
      step4: {
        title: 'How do you want the AI to write?',
        subtitle: 'Choose the method that suits you best',
        options: {
          personal: {
            label: 'My personal style',
            description: 'AI analyzes your posts on LinkedIn/Instagram/Facebook to learn your unique style',
            note: 'Requires at least one URL from the previous step'
          },
          creator: {
            label: 'Creator\'s style',
            description: 'Mimic the style of a creator you admire',
            placeholder: 'https://linkedin.com/in/inspiring-creator'
          },
          predefined: {
            label: 'Predefined style',
            description: 'Choose from our styles optimized for all networks'
          }
        },
        fallbackLabel: 'Fallback style',
        fallbackNote: 'This style will be used if analysis fails or for unsupported networks (Twitter, TikTok, YouTube)'
      },
      step5: {
        title: 'Last step!',
        subtitle: 'Your data matters to us',
        consent: 'I agree to have my preferences saved to improve my experience and personalize my content.',
        privacy: 'By checking this box, you accept our',
        privacyLink: 'Privacy Policy',
        and: 'and our',
        termsLink: 'Terms of Service',
        note: 'Your data is stored securely and will never be shared with third parties.',
        button: 'Start creating'
      },
      continue: 'Continue',
      skip: 'Skip',
      back: 'Back'
    },
    es: {
      step1: {
        title: `¡Bienvenido, ${user?.name}!`,
        subtitle: 'Soy AI Content Polisher, tu asistente IA personal para todas tus redes sociales.',
        description: 'Te ayudaré a crear publicaciones perfectas que te ayudarán a hacer crecer tu audiencia y alcanzar tus objetivos.',
        button: 'Comencemos'
      },
      step2: {
        title: '¿Cómo nos encontraste?',
        subtitle: 'Luego hablamos de ti, lo prometo 😉',
        otherPlaceholder: 'Especifica cómo nos encontraste...'
      },
      step3: {
        title: 'Conecta tus redes sociales',
        subtitle: 'Añade las URLs de tus perfiles para que la IA aprenda tu estilo de escritura (opcional)',
        note: 'Esto nos ayudará a personalizar el contenido generado según tu estilo',
        placeholders: {
          linkedin: 'https://linkedin.com/in/tu-perfil',
          twitter: 'https://twitter.com/tu-usuario',
          instagram: 'https://instagram.com/tu-usuario',
          facebook: 'https://facebook.com/tu-perfil',
          tiktok: 'https://tiktok.com/@tu-usuario',
          youtube: 'https://youtube.com/@tu-canal'
        }
      },
      step4: {
        title: '¿Cómo quieres que escriba la IA?',
        subtitle: 'Elige el método que mejor te convenga',
        options: {
          personal: {
            label: 'Mi estilo personal',
            description: 'La IA analiza tus publicaciones en LinkedIn/Instagram/Facebook para aprender tu estilo único',
            note: 'Requiere al menos una URL del paso anterior'
          },
          creator: {
            label: 'Estilo de un creador',
            description: 'Imita el estilo de un creador que admiras',
            placeholder: 'https://linkedin.com/in/creador-inspirador'
          },
          predefined: {
            label: 'Estilo predefinido',
            description: 'Elige entre nuestros estilos optimizados para todas las redes'
          }
        },
        fallbackLabel: 'Estilo de respaldo',
        fallbackNote: 'Este estilo se usará si el análisis falla o para redes no soportadas (Twitter, TikTok, YouTube)'
      },
      step5: {
        title: '¡Último paso!',
        subtitle: 'Tus datos son importantes para nosotros',
        consent: 'Acepto que mis preferencias se guarden para mejorar mi experiencia y personalizar mis contenidos.',
        privacy: 'Al marcar esta casilla, aceptas nuestra',
        privacyLink: 'Política de privacidad',
        and: 'y nuestros',
        termsLink: 'Términos de servicio',
        note: 'Tus datos se almacenan de forma segura y nunca se compartirán con terceros.',
        button: 'Comenzar a crear'
      },
      continue: 'Continuar',
      skip: 'Omitir',
      back: 'Atrás'
    }
  };

  const t = texts[language] || texts.fr;

  const handleDiscoverySourceSelect = (sourceId) => {
    setOnboardingData({ ...onboardingData, discoverySource: sourceId });
  };

  const handleSocialUrlChange = (network, url) => {
    setOnboardingData({
      ...onboardingData,
      socialUrls: {
        ...onboardingData.socialUrls,
        [network]: url
      }
    });

    // Auto-update preferredNetworks based on which URLs are filled
    const filledNetworks = Object.entries({
      ...onboardingData.socialUrls,
      [network]: url
    })
      .filter(([_, url]) => url.trim() !== '')
      .map(([network, _]) => network);

    setOnboardingData(prev => ({
      ...prev,
      socialUrls: {
        ...prev.socialUrls,
        [network]: url
      },
      preferredNetworks: filledNetworks
    }));
  };

  const handleStyleOptionSelect = (option) => {
    setOnboardingData({
      ...onboardingData,
      styleOption: option,
      // Reset other fields when changing option
      creatorUrl: option === 'creator' ? onboardingData.creatorUrl : '',
      preferredStyle: option === 'predefined' ? onboardingData.preferredStyle : ''
    });
  };

  const handleCreatorUrlChange = (url) => {
    setOnboardingData({ ...onboardingData, creatorUrl: url });
  };

  const handleStyleSelect = (styleId) => {
    setOnboardingData({ ...onboardingData, preferredStyle: styleId });
  };

  const handleFallbackStyleSelect = (styleId) => {
    setOnboardingData({ ...onboardingData, fallbackStyle: styleId });
  };

  const handleNext = () => {
    // Validation
    if (step === 2 && !onboardingData.discoverySource) {
      toast.error(language === 'fr' ? 'Merci de sélectionner une option' : language === 'en' ? 'Please select an option' : 'Por favor selecciona una opción');
      return;
    }
    if (step === 2 && onboardingData.discoverySource === 'other' && !onboardingData.discoverySourceOther.trim()) {
      toast.error(language === 'fr' ? 'Merci de préciser comment tu nous as trouvé' : language === 'en' ? 'Please specify how you found us' : 'Por favor especifica cómo nos encontraste');
      return;
    }
    // Step 3 is optional - no validation needed
    if (step === 4) {
      if (!onboardingData.styleOption) {
        toast.error(language === 'fr' ? 'Choisis une option de style' : language === 'en' ? 'Choose a style option' : 'Elige una opción de estilo');
        return;
      }
      if (onboardingData.styleOption === 'personal' && onboardingData.preferredNetworks.length === 0) {
        toast.error(language === 'fr' ? 'Retourne à l\'étape précédente pour ajouter au moins une URL' : language === 'en' ? 'Go back to add at least one URL' : 'Vuelve para añadir al menos una URL');
        return;
      }
      if (onboardingData.styleOption === 'creator' && !onboardingData.creatorUrl.trim()) {
        toast.error(language === 'fr' ? 'Entre l\'URL du créateur' : language === 'en' ? 'Enter the creator\'s URL' : 'Ingresa la URL del creador');
        return;
      }
      if (onboardingData.styleOption === 'predefined' && !onboardingData.preferredStyle) {
        toast.error(language === 'fr' ? 'Choisis un style prédéfini' : language === 'en' ? 'Choose a predefined style' : 'Elige un estilo predefinido');
        return;
      }
      // Fallback style is required for personal and creator options
      if ((onboardingData.styleOption === 'personal' || onboardingData.styleOption === 'creator') && !onboardingData.fallbackStyle) {
        toast.error(language === 'fr' ? 'Choisis un style de secours' : language === 'en' ? 'Choose a fallback style' : 'Elige un estilo de respaldo');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    if (!onboardingData.consentDataStorage) {
      toast.error(language === 'fr' ? 'Tu dois accepter la politique de confidentialité pour continuer' : language === 'en' ? 'You must accept the privacy policy to continue' : 'Debes aceptar la política de privacidad para continuar');
      return;
    }

    setLoading(true);

    try {
      await saveOnboardingData({
        discovery_source: onboardingData.discoverySource === 'other' ? onboardingData.discoverySourceOther : onboardingData.discoverySource,
        preferred_networks: onboardingData.preferredNetworks,
        social_urls: onboardingData.socialUrls,
        style_option: onboardingData.styleOption,
        creator_url: onboardingData.creatorUrl,
        preferred_style: onboardingData.preferredStyle,
        fallback_style: onboardingData.fallbackStyle,
        consent_data_storage: onboardingData.consentDataStorage
      });

      toast.success(language === 'fr' ? 'Configuration terminée ! Bienvenue 🎉' : language === 'en' ? 'Setup complete! Welcome 🎉' : '¡Configuración completa! Bienvenido 🎉');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.error(language === 'fr' ? 'Erreur lors de la sauvegarde' : language === 'en' ? 'Error saving data' : 'Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 mx-1 rounded-full transition-all ${
                  i + 1 <= step ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-slate-400">
            {language === 'fr' ? 'Étape' : language === 'en' ? 'Step' : 'Paso'} {step} / {totalSteps}
          </p>
        </div>

        {/* Content card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-6 rounded-full">
                  <Sparkles className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t.step1.title}
              </h1>
              <p className="text-xl text-gray-700 dark:text-slate-300 mb-4">
                {t.step1.subtitle}
              </p>
              <p className="text-gray-600 dark:text-slate-400 mb-8">
                {t.step1.description}
              </p>
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                {t.step1.button}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Step 2: Discovery source */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t.step2.title}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-8 text-center">
                {t.step2.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {discoverySources[language].map((source) => (
                  <button
                    key={source.id}
                    onClick={() => handleDiscoverySourceSelect(source.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      onboardingData.discoverySource === source.id
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">{source.label}</span>
                      {onboardingData.discoverySource === source.id && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {onboardingData.discoverySource === 'other' && (
                <input
                  type="text"
                  value={onboardingData.discoverySourceOther}
                  onChange={(e) => setOnboardingData({ ...onboardingData, discoverySourceOther: e.target.value })}
                  placeholder={t.step2.otherPlaceholder}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
                />
              )}

              <div className="flex gap-3 justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2"
                >
                  {t.continue}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Social network URLs */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t.step3.title}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-8 text-center">
                {t.step3.subtitle}
              </p>

              <div className="space-y-4 mb-6">
                {socialNetworks.map((network) => {
                  const Icon = network.icon;
                  return (
                    <div key={network.id} className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <div className={`bg-gradient-to-r ${network.color} p-2 rounded-lg`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        {network.label}
                      </label>
                      <input
                        type="url"
                        value={onboardingData.socialUrls[network.id]}
                        onChange={(e) => handleSocialUrlChange(network.id, e.target.value)}
                        placeholder={t.step3.placeholders[network.id]}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 dark:text-slate-500 text-center mb-6">
                {t.step3.note}
              </p>

              <div className="flex gap-3 justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2"
                >
                  {t.continue}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Writing style method */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t.step4.title}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-8 text-center">
                {t.step4.subtitle}
              </p>

              {/* Style option selection */}
              <div className="space-y-4 mb-6">
                {/* Option 1: Personal style */}
                <button
                  onClick={() => handleStyleOptionSelect('personal')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    onboardingData.styleOption === 'personal'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👤</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{t.step4.options.personal.label}</span>
                    </div>
                    {onboardingData.styleOption === 'personal' && (
                      <Check className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{t.step4.options.personal.description}</p>
                  {onboardingData.preferredNetworks.length === 0 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">⚠️ {t.step4.options.personal.note}</p>
                  )}
                </button>

                {/* Option 2: Creator style */}
                <div>
                  <button
                    onClick={() => handleStyleOptionSelect('creator')}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      onboardingData.styleOption === 'creator'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{t.step4.options.creator.label}</span>
                      </div>
                      {onboardingData.styleOption === 'creator' && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{t.step4.options.creator.description}</p>
                  </button>
                  {onboardingData.styleOption === 'creator' && (
                    <input
                      type="url"
                      value={onboardingData.creatorUrl}
                      onChange={(e) => handleCreatorUrlChange(e.target.value)}
                      placeholder={t.step4.options.creator.placeholder}
                      className="w-full mt-3 px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  )}
                </div>

                {/* Option 3: Predefined style */}
                <button
                  onClick={() => handleStyleOptionSelect('predefined')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    onboardingData.styleOption === 'predefined'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📝</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{t.step4.options.predefined.label}</span>
                    </div>
                    {onboardingData.styleOption === 'predefined' && (
                      <Check className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{t.step4.options.predefined.description}</p>
                </button>
              </div>

              {/* Show style selection based on option */}
              {onboardingData.styleOption === 'predefined' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                    {language === 'fr' ? 'Choisis ton style' : language === 'en' ? 'Choose your style' : 'Elige tu estilo'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {writingStyles[language].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => handleStyleSelect(style.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          onboardingData.preferredStyle === style.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{style.emoji}</span>
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{style.label}</span>
                          {onboardingData.preferredStyle === style.id && (
                            <Check className="h-4 w-4 text-purple-600 ml-auto" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-slate-400">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback style selection for personal and creator options */}
              {(onboardingData.styleOption === 'personal' || onboardingData.styleOption === 'creator') && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t.step4.fallbackLabel}
                  </label>
                  <p className="text-xs text-gray-600 dark:text-slate-400 mb-3">
                    {t.step4.fallbackNote}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {writingStyles[language].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => handleFallbackStyleSelect(style.id)}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          onboardingData.fallbackStyle === style.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg">{style.emoji}</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white text-center">{style.label}</span>
                          {onboardingData.fallbackStyle === style.id && (
                            <Check className="h-3 w-3 text-purple-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2"
                >
                  {t.continue}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Consent */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t.step5.title}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-8 text-center">
                {t.step5.subtitle}
              </p>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onboardingData.consentDataStorage}
                    onChange={(e) => setOnboardingData({ ...onboardingData, consentDataStorage: e.target.checked })}
                    className="mt-1 h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium mb-3">
                      {t.step5.consent}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {t.step5.privacy}{' '}
                      <a href="/privacy" target="_blank" className="text-purple-600 hover:underline font-semibold">
                        {t.step5.privacyLink}
                      </a>{' '}
                      {t.step5.and}{' '}
                      <a href="/terms" target="_blank" className="text-purple-600 hover:underline font-semibold">
                        {t.step5.termsLink}
                      </a>.
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  🔒 {t.step5.note}
                </p>
              </div>

              <div className="flex gap-3 justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleFinish}
                  disabled={loading || !onboardingData.consentDataStorage}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {language === 'fr' ? 'Enregistrement...' : language === 'en' ? 'Saving...' : 'Guardando...'}
                    </>
                  ) : (
                    <>
                      {t.step5.button}
                      <Check className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer logo */}
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-slate-500 text-sm flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Content Polisher
          </p>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
