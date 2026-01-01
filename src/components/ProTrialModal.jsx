import { X, Sparkles, Check, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ProTrialModal({ isOpen, onClose, feature, canUseTrial, onActivateTrial, onActivatePreview }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const featureInfo = {
    calendar: {
      icon: '📅',
      title: 'Calendrier Éditorial',
      description: 'Planifiez vos contenus sur plusieurs plateformes, recevez des rappels par email, et organisez votre stratégie de contenu.',
      benefits: [
        'Planification multi-plateformes',
        'Rappels email automatiques',
        'Vue calendrier mensuelle',
        'Gestion des publications'
      ]
    },
    analytics: {
      icon: '📊',
      title: 'Analytics Avancées',
      description: 'Suivez vos performances, analysez vos contenus les plus performants, et optimisez votre stratégie.',
      benefits: [
        'Statistiques détaillées',
        'Suivi des performances',
        'Analyses par plateforme',
        'Rapports exportables'
      ]
    },
    team: {
      icon: '👥',
      title: 'Travail en Équipe',
      description: 'Collaborez avec votre équipe, partagez des crédits, et gérez les accès de manière centralisée.',
      benefits: [
        'Crédits partagés',
        'Gestion des membres',
        'Historique commun',
        'Collaboration en temps réel'
      ]
    }
  };

  const info = featureInfo[feature] || featureInfo.calendar;

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing');
  };

  const handleTryPro = () => {
    // Utiliser le crédit réel pour générer du contenu
    onActivateTrial();
  };

  const handlePreview = () => {
    // Activer le mode preview sans utiliser le crédit
    if (onActivatePreview) {
      onActivatePreview();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative z-10">
            <div className="text-6xl mb-4">{info.icon}</div>
            <h2 className="text-3xl font-bold mb-2">{info.title}</h2>
            <p className="text-white/90 text-lg">{info.description}</p>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8">
          {/* Avantages */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Ce que vous débloquez :
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {info.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparaison Free vs Pro */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Découvrez la différence Pro
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-500 dark:text-gray-400 font-medium mb-2">Free/Starter</div>
                <div className="space-y-2">
                  <div className="text-gray-600 dark:text-gray-400">❌ 1 seule version</div>
                  <div className="text-gray-600 dark:text-gray-400">❌ Pas de hashtags</div>
                  <div className="text-gray-600 dark:text-gray-400">❌ Pas de calendrier</div>
                </div>
              </div>
              <div className="text-center border-l-2 border-purple-200 dark:border-purple-700">
                <div className="text-purple-600 dark:text-purple-400 font-bold mb-2">Pro</div>
                <div className="space-y-2">
                  <div className="text-gray-900 dark:text-white font-medium">✅ 3 variantes créatives</div>
                  <div className="text-gray-900 dark:text-white font-medium">✅ Hashtags IA optimisés</div>
                  <div className="text-gray-900 dark:text-white font-medium">✅ Planification illimitée</div>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            {/* Bouton Explorer en mode aperçu - toujours visible */}
            <button
              onClick={handlePreview}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
              Explorer en Mode Aperçu
            </button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Découvrez l'interface Pro complète (sans utiliser votre crédit)
            </p>

            {canUseTrial && feature !== 'analytics' && feature !== 'calendar' && feature !== 'team' && (
              <>
                <button
                  onClick={handleTryPro}
                  className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <Zap className="h-5 w-5 group-hover:animate-pulse" />
                  Utiliser mon Crédit Pro Gratuit
                </button>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Générez 1 contenu avec toutes les fonctionnalités Pro
                </p>
              </>
            )}

            <button
              onClick={handleUpgrade}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
                canUseTrial
                  ? 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              Passer à Pro
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProTrialModal;
