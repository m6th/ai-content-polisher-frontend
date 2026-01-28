import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Search, History, Sparkles, ArrowRight, Trash2, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';

const translations = {
  fr: {
    title: 'Trouver une idée',
    subtitle: 'Entrez un thème et laissez l\'IA vous proposer des idées de contenu',
    themePlaceholder: 'Ex: Marketing digital, Productivité, Leadership...',
    findIdea: 'Trouver mon idée',
    finding: 'Recherche en cours...',
    history: 'Historique',
    ideas: 'Idées',
    generatePost: 'Générer un post',
    noHistory: 'Aucun historique pour le moment',
    noHistoryDesc: 'Vos recherches d\'idées apparaîtront ici',
    clearHistory: 'Effacer l\'historique',
    ideaCardTitle: 'Idée',
    errorGeneration: 'Erreur lors de la génération des idées',
    enterTheme: 'Veuillez entrer un thème',
    languages: {
      fr: 'Français',
      en: 'English',
      es: 'Español'
    }
  },
  en: {
    title: 'Find an Idea',
    subtitle: 'Enter a theme and let AI suggest content ideas',
    themePlaceholder: 'Ex: Digital marketing, Productivity, Leadership...',
    findIdea: 'Find my idea',
    finding: 'Searching...',
    history: 'History',
    ideas: 'Ideas',
    generatePost: 'Generate post',
    noHistory: 'No history yet',
    noHistoryDesc: 'Your idea searches will appear here',
    clearHistory: 'Clear history',
    ideaCardTitle: 'Idea',
    errorGeneration: 'Error generating ideas',
    enterTheme: 'Please enter a theme',
    languages: {
      fr: 'Français',
      en: 'English',
      es: 'Español'
    }
  },
  es: {
    title: 'Encontrar una idea',
    subtitle: 'Ingresa un tema y deja que la IA te sugiera ideas de contenido',
    themePlaceholder: 'Ej: Marketing digital, Productividad, Liderazgo...',
    findIdea: 'Encontrar mi idea',
    finding: 'Buscando...',
    history: 'Historial',
    ideas: 'Ideas',
    generatePost: 'Generar post',
    noHistory: 'Sin historial aún',
    noHistoryDesc: 'Tus búsquedas de ideas aparecerán aquí',
    clearHistory: 'Borrar historial',
    ideaCardTitle: 'Idea',
    errorGeneration: 'Error al generar ideas',
    enterTheme: 'Por favor ingresa un tema',
    languages: {
      fr: 'Français',
      en: 'English',
      es: 'Español'
    }
  }
};

export default function IdeaFinder() {
  const navigate = useNavigate();
  const { language: uiLanguage } = useLanguage();
  const t = translations[uiLanguage] || translations.fr;

  const [theme, setTheme] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [activeTab, setActiveTab] = useState('ideas'); // 'ideas' or 'history'
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ideaFinderHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem('ideaFinderHistory', JSON.stringify(newHistory));
  };

  const handleFindIdeas = async () => {
    if (!theme.trim()) {
      setError(t.enterTheme);
      return;
    }

    setLoading(true);
    setError('');
    setActiveTab('ideas');

    try {
      const response = await api.post('/content/ideas', {
        theme: theme.trim(),
        language: selectedLanguage,
        count: 3
      });

      const generatedIdeas = response.data.ideas || [];
      setIdeas(generatedIdeas);

      // Add to history
      const historyEntry = {
        id: Date.now(),
        theme: theme.trim(),
        language: selectedLanguage,
        ideas: generatedIdeas,
        createdAt: new Date().toISOString()
      };
      const newHistory = [historyEntry, ...history].slice(0, 20); // Keep last 20
      saveHistory(newHistory);

    } catch (err) {
      console.error('Error generating ideas:', err);
      setError(t.errorGeneration);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePost = (ideaText) => {
    // Navigate to dashboard with the idea text pre-filled
    navigate('/dashboard', {
      state: {
        prefillText: ideaText,
        fromIdeaFinder: true
      }
    });
  };

  const handleHistoryItemClick = (historyItem) => {
    setTheme(historyItem.theme);
    setSelectedLanguage(historyItem.language);
    setIdeas(historyItem.ideas);
    setActiveTab('ideas');
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(uiLanguage, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg mb-4">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {t.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Theme Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFindIdeas()}
                  placeholder={t.themePlaceholder}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="fr">{t.languages.fr}</option>
              <option value="en">{t.languages.en}</option>
              <option value="es">{t.languages.es}</option>
            </select>

            {/* Find Button */}
            <button
              onClick={handleFindIdeas}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[180px]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.finding}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t.findIdea}
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-red-500 text-sm">{error}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('ideas')}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'ideas'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            {t.ideas}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            {t.history}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'ideas' ? (
          <div className="space-y-4">
            {ideas.length > 0 ? (
              ideas.map((idea, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                        {t.ideaCardTitle} {index + 1}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {idea}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleGeneratePost(idea)}
                      className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                    >
                      {t.generatePost}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  {uiLanguage === 'fr'
                    ? 'Entrez un thème et cliquez sur "Trouver mon idée" pour générer des idées de contenu'
                    : uiLanguage === 'en'
                    ? 'Enter a theme and click "Find my idea" to generate content ideas'
                    : 'Ingresa un tema y haz clic en "Encontrar mi idea" para generar ideas de contenido'
                  }
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {history.length > 0 ? (
              <>
                <div className="flex justify-end mb-2">
                  <button
                    onClick={clearHistory}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t.clearHistory}
                  </button>
                </div>
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleHistoryItemClick(item)}
                    className="w-full text-left bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          <Search className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {item.theme}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(item.createdAt)}
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="uppercase text-xs font-medium">{item.language}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.noHistory}
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {t.noHistoryDesc}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
