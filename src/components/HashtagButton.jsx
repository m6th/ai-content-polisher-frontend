import { useState } from 'react';
import { Hash, Copy, Check } from 'lucide-react';
import { generateHashtags } from '../services/api';
import { useToast } from '../contexts/ToastContext';

function HashtagButton({ content, platform, language, uiLanguage }) {
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHashtags, setShowHashtags] = useState(false);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const loadHashtags = async () => {
    if (hashtags.length > 0) {
      setShowHashtags(!showHashtags);
      return;
    }

    setLoading(true);
    try {
      const response = await generateHashtags(content, platform, language);
      setHashtags(response.data.hashtags || []);
      setShowHashtags(true);
    } catch (error) {
      console.error('Error generating hashtags:', error);
      toast.error(
        uiLanguage === 'fr' ? 'Erreur lors de la génération' :
        uiLanguage === 'en' ? 'Error generating hashtags' :
        'Error al generar hashtags'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyAllHashtags = () => {
    const hashtagText = hashtags.join(' ');
    navigator.clipboard.writeText(hashtagText);
    setCopied(true);
    toast.success(
      uiLanguage === 'fr' ? 'Hashtags copiés !' :
      uiLanguage === 'en' ? 'Hashtags copied!' :
      '¡Hashtags copiados!'
    );
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={loadHashtags}
        disabled={loading}
        className="bg-white/90 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/60 text-white px-3 py-2 rounded-lg transition-all tooltip disabled:opacity-50"
        data-tooltip={
          uiLanguage === 'fr' ? 'Générer hashtags' :
          uiLanguage === 'en' ? 'Generate hashtags' :
          'Generar hashtags'
        }
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <Hash className="h-4 w-4" />
        )}
      </button>

      {showHashtags && hashtags.length > 0 && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-10 min-w-[300px] max-w-[400px]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              {uiLanguage === 'fr' ? 'Hashtags suggérés' :
               uiLanguage === 'en' ? 'Suggested Hashtags' :
               'Hashtags sugeridos'}
            </h4>
            <button
              onClick={copyAllHashtags}
              className="flex items-center space-x-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>{uiLanguage === 'fr' ? 'Copié' : uiLanguage === 'en' ? 'Copied' : 'Copiado'}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>{uiLanguage === 'fr' ? 'Tout copier' : uiLanguage === 'en' ? 'Copy all' : 'Copiar todo'}</span>
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded text-xs font-medium cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(tag);
                  toast.success(
                    uiLanguage === 'fr' ? `${tag} copié !` :
                    uiLanguage === 'en' ? `${tag} copied!` :
                    `¡${tag} copiado!`
                  );
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HashtagButton;
