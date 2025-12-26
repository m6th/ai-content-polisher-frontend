import { useState, useEffect } from 'react';
import { getContentHistory, deleteContentRequest } from '../services/api';
import { History as HistoryIcon, Search, Trash2, Eye, Copy, Check, ChevronLeft, ChevronRight, Calendar, FileText, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';
import { useToast } from '../contexts/ToastContext';

function History() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const toast = useToast();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const itemsPerPage = 20;

  useEffect(() => {
    loadHistory();
  }, [currentPage, searchQuery]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const response = await getContentHistory(skip, itemsPerPage, searchQuery || null);
      setHistory(response.data.items);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmMsg = language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette génération ?' :
      language === 'en' ? 'Are you sure you want to delete this generation?' :
      '¿Estás seguro de que quieres eliminar esta generación?';

    if (window.confirm(confirmMsg)) {
      try {
        await deleteContentRequest(id);
        loadHistory();
        toast.success(
          language === 'fr' ? 'Génération supprimée avec succès' :
          language === 'en' ? 'Generation deleted successfully' :
          'Generación eliminada con éxito'
        );
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error(
          language === 'fr' ? 'Erreur lors de la suppression' :
          language === 'en' ? 'Error deleting generation' :
          'Error al eliminar la generación'
        );
      }
    }
  };

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success(
      language === 'fr' ? 'Contenu copié !' :
      language === 'en' ? 'Content copied!' :
      '¡Contenido copiado!'
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const formatLabels = {
    linkedin: { name: 'LinkedIn', icon: '💼', color: 'bg-blue-500' },
    instagram: { name: 'Instagram', icon: '📸', color: 'bg-purple-500' },
    tiktok: { name: 'TikTok', icon: '🎵', color: 'bg-pink-500' },
    twitter: { name: 'Twitter', icon: '🐦', color: 'bg-sky-500' },
    email: { name: 'Email', icon: '📧', color: 'bg-green-500' },
    persuasive: { name: 'Publicité', icon: '🎯', color: 'bg-orange-500' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <HistoryIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Historique des générations</h1>
        </div>
        <p className="text-gray-600 dark:text-slate-400">Retrouvez tous vos contenus générés</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans vos générations..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && history.length === 0 && (
        <div className="text-center py-20">
          <FileText className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-slate-400 mb-2">Aucun contenu généré</h3>
          <p className="text-gray-500 dark:text-slate-500">Vos générations de contenu apparaîtront ici</p>
        </div>
      )}

      {/* History List */}
      {!loading && history.length > 0 && (
        <>
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-slate-700 p-6 hover:shadow-lg transition-all fade-in-up stagger-${(index % 15) + 1}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Date & Stats */}
                    <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {getRelativeTime(item.created_at)}
                      </span>
                      {item.created_by && !item.is_own && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                          👤 {item.created_by.name}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                        {item.formats_count} formats
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-full text-xs">
                        {item.tone || 'Professionnel'}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs uppercase">
                        {item.language || 'FR'}
                      </span>
                    </div>

                    {/* Original Text Preview */}
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3 line-clamp-2">
                      {item.original_text}
                    </p>

                    {/* Format Badges */}
                    <div className="flex flex-wrap gap-2">
                      {item.generated_contents.slice(0, 8).map((content, idx) => {
                        // Extract format name from generated content (we need to map variant_number to format)
                        // For now, show variant numbers
                        return (
                          <span
                            key={content.id}
                            className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-xs font-medium"
                          >
                            Format #{content.variant_number}
                          </span>
                        );
                      })}
                      {item.generated_contents.length > 8 && (
                        <span className="px-2 py-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-xs font-medium">
                          +{item.generated_contents.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="p-2 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 rounded-lg transition-colors tooltip"
                      data-tooltip="Voir les détails"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-700 dark:text-red-300 rounded-lg transition-colors tooltip"
                      data-tooltip="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-xl">Détails de la génération</h3>
                <p className="text-white/80 text-sm">{getRelativeTime(selectedItem.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* Original Text */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700">
                <h4 className="font-semibold text-gray-700 dark:text-slate-200 mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Texte original
                </h4>
                <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedItem.original_text}
                </p>
              </div>

              {/* Generated Formats */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 dark:text-white text-lg mb-4">
                  {selectedItem.formats_count} formats générés
                </h4>
                {selectedItem.generated_contents.map((content) => (
                  <div
                    key={content.id}
                    className="p-4 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-xl hover:border-purple-200 dark:hover:border-purple-600 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-semibold">
                        Format #{content.variant_number}
                      </span>
                      <button
                        onClick={() => handleCopy(content.content, content.id)}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 rounded-lg transition-colors text-sm font-medium"
                      >
                        {copiedId === content.id ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {content.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
