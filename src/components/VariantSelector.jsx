import { useState } from 'react';
import { Copy, Check, Eye, RefreshCw } from 'lucide-react';

function VariantSelector({ variants, format, onCopy, copiedVariant, formatInfo }) {
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!variants || variants.length <= 1) {
    // Single variant - render normally
    const content = Array.isArray(variants) ? variants[0] : variants;
    return (
      <div className="p-6">
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    );
  }

  // Multiple variants - show selector
  const currentVariant = variants[selectedVariant];

  const getVariantLabel = (index) => {
    switch(index) {
      case 0: return 'Équilibrée';
      case 1: return 'Audacieuse';
      case 2: return 'Alternative';
      default: return `Variante ${index + 1}`;
    }
  };

  const getVariantIcon = (index) => {
    switch(index) {
      case 0: return '⚖️';
      case 1: return '🚀';
      case 2: return '✨';
      default: return '📝';
    }
  };

  const getVariantDescription = (index) => {
    switch(index) {
      case 0: return 'Version polyvalente et équilibrée';
      case 1: return 'Version plus créative et audacieuse';
      case 2: return 'Approche unique et originale';
      default: return '';
    }
  };

  return (
    <div className="p-6">
      {/* Variant selector tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Choisissez votre variante
          </h5>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full font-medium">
            ✨ Pro/Business
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {variants.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedVariant(index)}
              className={`
                p-3 rounded-xl border-2 transition-all duration-200 text-left
                ${selectedVariant === index
                  ? `border-${formatInfo.color.split('-')[1]}-500 bg-gradient-to-br ${formatInfo.color} bg-opacity-10 shadow-md`
                  : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 bg-white dark:bg-slate-700/50'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getVariantIcon(index)}</span>
                <span className={`text-sm font-bold ${
                  selectedVariant === index
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {getVariantLabel(index)}
                </span>
              </div>
              <p className={`text-xs ${
                selectedVariant === index
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-500 dark:text-gray-500'
              }`}>
                {getVariantDescription(index)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected variant content */}
      <div className="prose dark:prose-invert max-w-none">
        <div className="relative">
          <div className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
            {getVariantIcon(selectedVariant)} {getVariantLabel(selectedVariant)}
          </div>
          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed pt-6 pl-2">
            {currentVariant}
          </div>
        </div>
      </div>

      {/* Variant statistics */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>{currentVariant.split(/\s+/).length} mots</span>
            <span>{currentVariant.length} caractères</span>
          </div>
          <button
            onClick={() => onCopy(currentVariant, `${format}-v${selectedVariant}`)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium
              ${copiedVariant === `${format}-v${selectedVariant}`
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }
            `}
          >
            {copiedVariant === `${format}-v${selectedVariant}` ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copié!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copier
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VariantSelector;
