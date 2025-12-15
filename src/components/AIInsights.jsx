import { useState, useEffect } from 'react';
import { Hash, Smile, Lightbulb, Clock, TrendingUp, Target } from 'lucide-react';
import { generateHashtags, analyzeContent, getBestPostingTime } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

function AIInsights({ content, platform, tone, language: contentLanguage }) {
  const { language: uiLanguage } = useLanguage();
  const [hashtags, setHashtags] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [postingTime, setPostingTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hashtags');

  useEffect(() => {
    if (content && content.length > 20) {
      loadInsights();
    }
  }, [content, platform]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      // Load all insights in parallel
      const [hashtagsRes, analysisRes, postingTimeRes] = await Promise.all([
        generateHashtags(content, platform, contentLanguage).catch(() => ({ data: { hashtags: [] } })),
        analyzeContent(content).catch(() => ({ data: null })),
        getBestPostingTime(platform).catch(() => ({ data: null }))
      ]);

      setHashtags(hashtagsRes.data.hashtags || []);
      setAnalysis(analysisRes.data);
      setPostingTime(postingTimeRes.data);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
      neutral: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
      negative: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
    };
    return colors[sentiment] || colors.neutral;
  };

  const getSentimentEmoji = (sentiment) => {
    const emojis = {
      positive: '😊',
      neutral: '😐',
      negative: '😟'
    };
    return emojis[sentiment] || '😐';
  };

  if (!content || content.length < 20) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {uiLanguage === 'fr' ? 'Insights IA' : uiLanguage === 'en' ? 'AI Insights' : 'Insights IA'}
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {uiLanguage === 'fr'
            ? 'Entrez du contenu pour obtenir des suggestions IA'
            : uiLanguage === 'en'
            ? 'Enter content to get AI suggestions'
            : 'Ingrese contenido para obtener sugerencias de IA'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-white" />
          <h3 className="font-semibold text-white">
            {uiLanguage === 'fr' ? 'Insights IA' : uiLanguage === 'en' ? 'AI Insights' : 'Insights IA'}
          </h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <button
          onClick={() => setActiveTab('hashtags')}
          className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === 'hashtags'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-slate-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Hash className="h-4 w-4 inline mr-1" />
          {uiLanguage === 'fr' ? 'Hashtags' : uiLanguage === 'en' ? 'Hashtags' : 'Hashtags'}
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === 'analysis'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-slate-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Target className="h-4 w-4 inline mr-1" />
          {uiLanguage === 'fr' ? 'Analyse' : uiLanguage === 'en' ? 'Analysis' : 'Análisis'}
        </button>
        <button
          onClick={() => setActiveTab('timing')}
          className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === 'timing'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-slate-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="h-4 w-4 inline mr-1" />
          {uiLanguage === 'fr' ? 'Timing' : uiLanguage === 'en' ? 'Timing' : 'Momento'}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {uiLanguage === 'fr' ? 'Analyse en cours...' : uiLanguage === 'en' ? 'Analyzing...' : 'Analizando...'}
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'hashtags' && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {uiLanguage === 'fr'
                    ? 'Hashtags suggérés pour maximiser la portée :'
                    : uiLanguage === 'en'
                    ? 'Suggested hashtags to maximize reach:'
                    : 'Hashtags sugeridos para maximizar el alcance:'}
                </p>
                {hashtags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        onClick={() => navigator.clipboard.writeText(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    {uiLanguage === 'fr' ? 'Aucun hashtag disponible' : uiLanguage === 'en' ? 'No hashtags available' : 'No hay hashtags disponibles'}
                  </p>
                )}
              </div>
            )}

            {activeTab === 'analysis' && analysis && (
              <div className="space-y-4">
                {/* Sentiment */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                    {uiLanguage === 'fr' ? 'Sentiment' : uiLanguage === 'en' ? 'Sentiment' : 'Sentimiento'}
                  </label>
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${getSentimentColor(analysis.sentiment)}`}>
                    <span className="text-2xl">{getSentimentEmoji(analysis.sentiment)}</span>
                    <span className="font-semibold capitalize">{analysis.sentiment}</span>
                  </div>
                </div>

                {/* Engagement Score */}
                {analysis.engagement_score && (
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      {uiLanguage === 'fr' ? 'Score d\'engagement' : uiLanguage === 'en' ? 'Engagement Score' : 'Puntuación de compromiso'}
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                          style={{ width: `${analysis.engagement_score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {analysis.engagement_score}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      {uiLanguage === 'fr' ? 'Suggestions d\'amélioration' : uiLanguage === 'en' ? 'Improvement Suggestions' : 'Sugerencias de mejora'}
                    </label>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-300">
                          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timing' && postingTime && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                    {uiLanguage === 'fr' ? 'Meilleur moment pour publier' : uiLanguage === 'en' ? 'Best Time to Post' : 'Mejor momento para publicar'}
                  </label>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">
                          {postingTime.best_time}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {postingTime.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {postingTime.peak_days && (
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      {uiLanguage === 'fr' ? 'Meilleurs jours' : uiLanguage === 'en' ? 'Best Days' : 'Mejores días'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {postingTime.peak_days.map((day, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AIInsights;
