import { X, Sparkles, ArrowRight, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ProTrialComparisonModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <Sparkles className="h-10 w-10" />
            </div>
            <h2 className="text-4xl font-bold mb-2">Vous avez testé Pro !</h2>
            <p className="text-white/90 text-lg">Vous avez vu la différence. Prêt à passer au niveau supérieur ?</p>
          </div>
        </div>

        {/* Comparaison */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Colonne Free/Starter */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Free / Starter</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ce que vous aviez avant</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 dark:text-red-400 text-sm">✕</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">1 seule version</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Limité à une seule proposition</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 dark:text-red-400 text-sm">✕</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">Pas de hashtags</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Vous devez les trouver manuellement</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 dark:text-red-400 text-sm">✕</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">Pas de calendrier</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Organisation manuelle</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 dark:text-red-400 text-sm">✕</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">Pas d'analytics</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Aucune métrique</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Pro */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  PRO
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">Pro</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">Ce que vous venez de tester</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">3 variantes créatives</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Équilibrée, Audacieuse, Alternative</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Hashtags IA optimisés</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">10-15 hashtags stratégiques</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Calendrier éditorial</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Planification + rappels email</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Analytics détaillées</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Suivi des performances</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <button
              onClick={handleUpgrade}
              className="w-full py-5 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
            >
              <span>Passer à Pro maintenant</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Débloquez toutes les fonctionnalités Pro dès aujourd'hui
            </p>

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

export default ProTrialComparisonModal;
