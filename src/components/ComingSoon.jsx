import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Rocket, Sparkles, ArrowLeft,
  Linkedin, Instagram, Palette
} from 'lucide-react';

function ComingSoon() {
  const { language } = useLanguage();

  const texts = {
    fr: {
      title: "Prochainement",
      subtitle: "Ces fonctionnalités arrivent bientôt !",
      description: "Nous travaillons dur pour vous apporter de nouvelles fonctionnalités incroyables. Restez à l'écoute !",
      backHome: "Retour à l'accueil",
      backDashboard: "Retour au dashboard",
      features: [
        {
          icon: Palette,
          title: "Style d'écriture personnel",
          description: "Analysez votre profil LinkedIn ou Instagram pour que l'IA reproduise parfaitement votre style unique.",
          status: "En développement"
        },
        {
          icon: Linkedin,
          title: "Intégration LinkedIn",
          description: "Connectez votre compte LinkedIn pour publier directement vos contenus générés.",
          status: "Planifié"
        },
        {
          icon: Instagram,
          title: "Intégration Instagram",
          description: "Publiez automatiquement sur Instagram avec les hashtags optimisés.",
          status: "Planifié"
        }
      ]
    },
    en: {
      title: "Coming Soon",
      subtitle: "These features are coming soon!",
      description: "We're working hard to bring you amazing new features. Stay tuned!",
      backHome: "Back to home",
      backDashboard: "Back to dashboard",
      features: [
        {
          icon: Palette,
          title: "Personal Writing Style",
          description: "Analyze your LinkedIn or Instagram profile so AI perfectly reproduces your unique style.",
          status: "In development"
        },
        {
          icon: Linkedin,
          title: "LinkedIn Integration",
          description: "Connect your LinkedIn account to publish your generated content directly.",
          status: "Planned"
        },
        {
          icon: Instagram,
          title: "Instagram Integration",
          description: "Automatically post to Instagram with optimized hashtags.",
          status: "Planned"
        }
      ]
    },
    es: {
      title: "Próximamente",
      subtitle: "¡Estas funciones llegarán pronto!",
      description: "Estamos trabajando duro para traerte nuevas funciones increíbles. ¡Mantente atento!",
      backHome: "Volver al inicio",
      backDashboard: "Volver al dashboard",
      features: [
        {
          icon: Palette,
          title: "Estilo de escritura personal",
          description: "Analiza tu perfil de LinkedIn o Instagram para que la IA reproduzca perfectamente tu estilo único.",
          status: "En desarrollo"
        },
        {
          icon: Linkedin,
          title: "Integración con LinkedIn",
          description: "Conecta tu cuenta de LinkedIn para publicar directamente tu contenido generado.",
          status: "Planificado"
        },
        {
          icon: Instagram,
          title: "Integración con Instagram",
          description: "Publica automáticamente en Instagram con hashtags optimizados.",
          status: "Planificado"
        }
      ]
    }
  };

  const t = texts[language] || texts.fr;

  const getStatusColor = (status) => {
    if (status.includes('développement') || status.includes('development') || status.includes('desarrollo')) {
      return 'from-yellow-500 to-orange-500';
    }
    return 'from-blue-500 to-purple-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl mb-6 animate-bounce">
            <Rocket className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600">
              {t.title}
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-700 dark:text-slate-300 font-semibold mb-4">
            {t.subtitle}
          </p>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {t.features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                {/* Status Badge */}
                <div className="absolute -top-1 -right-1">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getStatusColor(feature.status)}`}>
                    {feature.status}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Back Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl hover:border-purple-500 dark:hover:border-purple-500 transform hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            {t.backHome}
          </Link>

          <Link
            to="/dashboard"
            className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {t.backDashboard}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
