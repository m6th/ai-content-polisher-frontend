import { useState } from 'react';
import { Hash, Lightbulb, TrendingUp, Copy, Check, Sparkles, Target, Award } from 'lucide-react';

function AIFeatures({ hashtags, aiSuggestions }) {
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [expandedSection, setExpandedSection] = useState('hashtags');

  if (!hashtags && !aiSuggestions) {
    return null;
  }

  const copyHashtags = () => {
    if (hashtags && hashtags.length > 0) {
      navigator.clipboard.writeText(hashtags.join(' '));
      setCopiedHashtags(true);
      setTimeout(() => setCopiedHashtags(false), 2000);
    }
  };

  const getEngagementColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getEngagementLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'À améliorer';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Fonctionnalités IA Pro
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Boostez votre contenu avec nos outils intelligents
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Hashtags Section */}
        {hashtags && hashtags.length > 0 && (
          <div
            className={`
              bg-white dark:bg-slate-800 rounded-xl p-4 border-2 transition-all cursor-pointer
              ${expandedSection === 'hashtags'
                ? 'border-purple-300 dark:border-purple-600 shadow-md'
                : 'border-gray-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-700'
              }
            `}
            onClick={() => setExpandedSection(expandedSection === 'hashtags' ? null : 'hashtags')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-bold text-gray-900 dark:text-white">
                  Hashtags Intelligents
                </h4>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold px-2 py-1 rounded-full">
                  {hashtags.length} hashtags
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyHashtags();
                }}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm font-medium
                  ${copiedHashtags
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                  }
                `}
              >
                {copiedHashtags ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copié!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier tout
                  </>
                )}
              </button>
            </div>

            {expandedSection === 'hashtags' && (
              <div className="flex flex-wrap gap-2 animate-fadeIn">
                {hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:shadow-md transition-all cursor-pointer border border-purple-200 dark:border-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(tag);
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Suggestions Section */}
        {aiSuggestions && (
          <div
            className={`
              bg-white dark:bg-slate-800 rounded-xl p-4 border-2 transition-all cursor-pointer
              ${expandedSection === 'suggestions'
                ? 'border-pink-300 dark:border-pink-600 shadow-md'
                : 'border-gray-200 dark:border-slate-700 hover:border-pink-200 dark:hover:border-pink-700'
              }
            `}
            onClick={() => setExpandedSection(expandedSection === 'suggestions' ? null : 'suggestions')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                <h4 className="font-bold text-gray-900 dark:text-white">
                  Suggestions d'Amélioration
                </h4>
              </div>
              {aiSuggestions.engagement_score && (
                <div className="flex items-center gap-2">
                  <TrendingUp className={`h-4 w-4 ${getEngagementColor(aiSuggestions.engagement_score)}`} />
                  <span className={`font-bold ${getEngagementColor(aiSuggestions.engagement_score)}`}>
                    {aiSuggestions.engagement_score}/100
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getEngagementLabel(aiSuggestions.engagement_score)}
                  </span>
                </div>
              )}
            </div>

            {expandedSection === 'suggestions' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Strengths */}
                {aiSuggestions.strengths && aiSuggestions.strengths.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Points Forts
                      </h5>
                    </div>
                    <ul className="space-y-1.5">
                      {aiSuggestions.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {aiSuggestions.improvements && aiSuggestions.improvements.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Axes d'Amélioration
                      </h5>
                    </div>
                    <ul className="space-y-1.5">
                      {aiSuggestions.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-blue-500 mt-0.5">→</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keywords */}
                {aiSuggestions.keywords && aiSuggestions.keywords.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Mots-clés SEO Recommandés
                      </h5>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {aiSuggestions.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Emojis */}
                {aiSuggestions.suggested_emojis && aiSuggestions.suggested_emojis.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Émojis Suggérés
                      </h5>
                    </div>
                    <div className="flex gap-2">
                      {aiSuggestions.suggested_emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(emoji);
                          }}
                          className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                          title="Cliquer pour copier"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIFeatures;
