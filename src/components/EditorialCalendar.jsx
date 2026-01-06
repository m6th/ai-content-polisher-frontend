import { useState, useEffect } from 'react';
import { Calendar, Plus, X, Edit2, Trash2, Clock, Share2, AlertCircle, Sparkles } from 'lucide-react';
import {
  getCalendarView,
  scheduleContent,
  updateScheduledContent,
  deleteScheduledContent,
  getUpcomingContent,
  getContentHistory,
  getProTrialStatus
} from '../services/api';
import ProTrialModal from './ProTrialModal';
import { useNavigate } from 'react-router-dom';

function EditorialCalendar({ user }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [upcomingContent, setUpcomingContent] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [availableContent, setAvailableContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pro Trial Modal
  const [showProTrialModal, setShowProTrialModal] = useState(false);
  const [canUseTrial, setCanUseTrial] = useState(false);
  const [previewMode, setPreviewMode] = useState(false); // Mode aperçu pour Free/Starter

  const [scheduleForm, setScheduleForm] = useState({
    generated_content_id: '',
    scheduled_date: '',
    scheduled_time: '09:00',
    platform: 'linkedin',
    title: '',
    notes: ''
  });

  const [selectedVariant, setSelectedVariant] = useState(0); // 0 = Équilibrée, 1 = Audacieuse, 2 = Alternative

  const isPro = user?.current_plan === 'pro' || user?.current_plan === 'business';

  // Debug: Log user plan
  useEffect(() => {
    console.log('EditorialCalendar - User:', user);
    console.log('EditorialCalendar - Current plan:', user?.current_plan);
    console.log('EditorialCalendar - isPro:', isPro);
  }, [user, isPro]);

  // Helper to format date showing the exact time stored (without timezone conversion)
  const formatScheduledDate = (dateString, options = {}) => {
    const date = new Date(dateString);

    // Force UTC timezone in formatting to show the exact stored time
    const utcOptions = { ...options, timeZone: 'UTC' };
    return date.toLocaleDateString('fr-FR', utcOptions);
  };

  const platforms = [
    { value: 'linkedin', label: 'LinkedIn', color: 'bg-blue-500' },
    { value: 'twitter', label: 'Twitter', color: 'bg-sky-500' },
    { value: 'facebook', label: 'Facebook', color: 'bg-indigo-600' },
    { value: 'instagram', label: 'Instagram', color: 'bg-pink-500' },
    { value: 'blog', label: 'Blog', color: 'bg-purple-600' },
    { value: 'email', label: 'Email', color: 'bg-green-600' }
  ];

  // Check if user can access calendar (show modal if Free/Starter)
  useEffect(() => {
    const checkAccess = async () => {
      // Attendre que user soit chargé avant de vérifier le plan
      if (!user) {
        setLoading(true);
        return;
      }

      if (!isPro && !previewMode) {
        // Load trial status
        try {
          const response = await getProTrialStatus();
          setCanUseTrial(response.data.can_use_trial);
        } catch (err) {
          console.error('Error loading trial status:', err);
        }
        // Show modal for Free/Starter users
        setShowProTrialModal(true);
        setLoading(false);
      } else if (isPro) {
        // Pro users: load calendar normally
        loadCalendarData();
        loadUpcoming();
        loadAvailableContent();
      } else if (previewMode) {
        // Preview mode: load demo data
        loadDemoData();
      }
    };

    checkAccess();
  }, [currentDate, isPro, previewMode, user]);

  useEffect(() => {
    // Only load if Pro
    if (isPro) {
      loadCalendarData();
      loadUpcoming();
      loadAvailableContent();
    }
  }, [currentDate]);

  const loadDemoData = () => {
    // Données de démonstration pour le mode preview
    const today = new Date();
    const demoCalendar = {};

    // Ajouter des événements de démo pour le mois en cours
    for (let i = 0; i < 5; i++) {
      const demoDate = new Date(today);
      demoDate.setDate(today.getDate() + (i * 3));
      const dateKey = demoDate.toISOString().split('T')[0];

      demoCalendar[dateKey] = [
        {
          id: i + 1,
          title: `Publication ${['LinkedIn', 'Instagram', 'Twitter', 'Facebook', 'Email'][i % 5]}`,
          platform: ['linkedin', 'instagram', 'twitter', 'facebook', 'email'][i % 5],
          scheduled_date: demoDate.toISOString(),
          content_preview: `Exemple de contenu planifié pour démonstration du mode Pro. Ce contenu montre comment vous pouvez organiser vos publications.`,
          notes: 'Note de démonstration'
        }
      ];
    }

    setCalendarData(demoCalendar);

    // Upcoming demo content
    setUpcomingContent([
      {
        id: 1,
        title: 'Publication LinkedIn',
        platform: 'linkedin',
        scheduled_date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        content_preview: 'Contenu de démonstration pour LinkedIn...'
      },
      {
        id: 2,
        title: 'Post Instagram',
        platform: 'instagram',
        scheduled_date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        content_preview: 'Contenu de démonstration pour Instagram...'
      }
    ]);

    // Available content demo
    setAvailableContent([
      { id: 1, format_name: 'LinkedIn Post', content: 'Exemple de contenu disponible...', created_at: new Date().toISOString() },
      { id: 2, format_name: 'Instagram Caption', content: 'Exemple de contenu disponible...', created_at: new Date().toISOString() },
      { id: 3, format_name: 'Tweet', content: 'Exemple de contenu disponible...', created_at: new Date().toISOString() }
    ]);

    setLoading(false);
  };

  const handleActivatePreview = () => {
    setShowProTrialModal(false);
    setPreviewMode(true);
  };

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      // Fix: Include full last day of month (23:59:59)
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

      console.log('📅 Loading calendar data:');
      console.log('  Start:', startDate.toISOString());
      console.log('  End:', endDate.toISOString());
      console.log('  Current date:', currentDate);

      const response = await getCalendarView(
        startDate.toISOString(),
        endDate.toISOString()
      );

      console.log('📊 Calendar response:', response.data.calendar);
      console.log('🔑 Date keys in calendar:', Object.keys(response.data.calendar));
      console.log('📝 Calendar entries count:', Object.keys(response.data.calendar).length);

      // Log each date's content
      Object.entries(response.data.calendar).forEach(([date, items]) => {
        console.log(`  ${date}: ${items.length} items`);
      });

      setCalendarData(response.data.calendar);
    } catch (err) {
      console.error('Error loading calendar:', err);
      if (err.response?.status === 403) {
        setError('Le calendrier éditorial est réservé aux plans Pro et Business');
      } else {
        setError('Erreur lors du chargement du calendrier');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUpcoming = async () => {
    try {
      const response = await getUpcomingContent(7);
      setUpcomingContent(response.data.upcoming);
    } catch (err) {
      console.error('Error loading upcoming content:', err);
    }
  };

  const loadAvailableContent = async () => {
    try {
      // Use same approach as History.jsx - call with default parameters
      const response = await getContentHistory(0, 100);

      // Extract items from response (same as History.jsx line 32)
      const historyItems = response.data?.items || [];

      // Format labels for display
      const formatDisplayNames = {
        linkedin: 'LinkedIn',
        instagram: 'Instagram',
        tiktok: 'TikTok',
        twitter: 'Twitter',
        email: 'Email Pro',
        persuasive: 'Publicité'
      };

      // Get all generated content from history, filtering out errors
      const content = historyItems.flatMap(request =>
        (request.generated_contents || [])
          .filter(gc => gc.content && !gc.content.startsWith('[Erreur'))
          .map(gc => {
            const formatName = gc.format_name || 'unknown';
            const displayName = formatDisplayNames[formatName] || formatName;

            // Debug log for missing format_name
            if (!gc.format_name) {
              console.warn('⚠️ Content without format_name:', {
                id: gc.id,
                variant_number: gc.variant_number,
                content_preview: gc.content.substring(0, 50) + '...'
              });
            }

            return {
              id: gc.id,
              text: gc.content,
              format_name: displayName,
              variant_number: gc.variant_number || 1,
              created_at: request.created_at
            };
          })
      );

      console.log('📊 Loaded content for calendar:', content.length, 'items');
      console.log('📝 Sample content:', content.slice(0, 5));
      console.log('🔢 Content by variant:', {
        variant1: content.filter(c => c.variant_number === 1).length,
        variant2: content.filter(c => c.variant_number === 2).length,
        variant3: content.filter(c => c.variant_number === 3).length
      });
      console.log('📁 Content by format:', {
        linkedin: content.filter(c => c.format_name === 'LinkedIn').length,
        instagram: content.filter(c => c.format_name === 'Instagram').length,
        tiktok: content.filter(c => c.format_name === 'TikTok').length,
        twitter: content.filter(c => c.format_name === 'Twitter').length,
        email: content.filter(c => c.format_name === 'Email Pro').length,
        publicite: content.filter(c => c.format_name === 'Publicité').length,
        unknown: content.filter(c => c.format_name === 'unknown').length
      });
      setAvailableContent(content);
    } catch (err) {
      console.error('Error loading available content:', err);
      setAvailableContent([]);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handleSchedule = async () => {
    // Bloquer la planification en mode preview
    if (previewMode) {
      alert('⚠️ Mode Aperçu\n\nVous explorez l\'interface Pro en mode démonstration.\n\nPour planifier réellement du contenu, vous devez passer à un plan Pro ou Business.\n\nCliquez sur "Passer à Pro" pour débloquer cette fonctionnalité !');
      return;
    }

    try {
      // Parse date and time separately
      const [year, month, day] = scheduleForm.scheduled_date.split('-').map(Number);
      const [hours, minutes] = scheduleForm.scheduled_time.split(':').map(Number);

      // Create date in LOCAL timezone (not UTC!)
      const scheduledDateTime = new Date(year, month - 1, day, hours, minutes);

      await scheduleContent({
        generated_content_id: parseInt(scheduleForm.generated_content_id),
        scheduled_date: scheduledDateTime.toISOString(),
        platform: scheduleForm.platform,
        title: scheduleForm.title,
        notes: scheduleForm.notes
      });

      setShowScheduleModal(false);
      setScheduleForm({
        generated_content_id: '',
        scheduled_date: '',
        scheduled_time: '09:00',
        platform: 'linkedin',
        title: '',
        notes: ''
      });

      loadCalendarData();
      loadUpcoming();
    } catch (err) {
      console.error('Error scheduling content:', err);
      alert('Erreur lors de la planification');
    }
  };

  const handleUpdate = async () => {
    // Bloquer la mise à jour en mode preview
    if (previewMode) {
      alert('⚠️ Mode Aperçu\n\nVous explorez l\'interface Pro en mode démonstration.\n\nPour modifier réellement du contenu planifié, vous devez passer à un plan Pro ou Business.\n\nCliquez sur "Passer à Pro" pour débloquer cette fonctionnalité !');
      return;
    }

    try {
      const scheduledDateTime = new Date(`${scheduleForm.scheduled_date}T${scheduleForm.scheduled_time}`);

      await updateScheduledContent(editingItem.id, {
        scheduled_date: scheduledDateTime.toISOString(),
        platform: scheduleForm.platform,
        title: scheduleForm.title,
        notes: scheduleForm.notes
      });

      setShowEditModal(false);
      setEditingItem(null);
      loadCalendarData();
      loadUpcoming();
    } catch (err) {
      console.error('Error updating content:', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (itemId) => {
    // Bloquer la suppression en mode preview
    if (previewMode) {
      alert('⚠️ Mode Aperçu\n\nVous explorez l\'interface Pro en mode démonstration.\n\nPour supprimer réellement du contenu planifié, vous devez passer à un plan Pro ou Business.\n\nCliquez sur "Passer à Pro" pour débloquer cette fonctionnalité !');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contenu planifié ?')) {
      return;
    }

    try {
      await deleteScheduledContent(itemId);
      setShowEditModal(false);
      setEditingItem(null);
      loadCalendarData();
      loadUpcoming();
    } catch (err) {
      console.error('Error deleting content:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const openScheduleModal = (date) => {
    // Create date key without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    setScheduleForm({
      ...scheduleForm,
      scheduled_date: dateString
    });
    setShowScheduleModal(true);
  };

  const openEditModal = (item) => {
    const itemDate = new Date(item.scheduled_date);
    // Extract LOCAL timezone components
    const year = itemDate.getFullYear();
    const month = String(itemDate.getMonth() + 1).padStart(2, '0');
    const day = String(itemDate.getDate()).padStart(2, '0');
    const hours = String(itemDate.getHours()).padStart(2, '0');
    const minutes = String(itemDate.getMinutes()).padStart(2, '0');

    setEditingItem(item);
    setScheduleForm({
      generated_content_id: item.generated_content_id,
      scheduled_date: `${year}-${month}-${day}`,
      scheduled_time: `${hours}:${minutes}`,
      platform: item.platform,
      title: item.title || '',
      notes: item.notes || ''
    });
    setShowEditModal(true);
  };

  const getPlatformColor = (platform) => {
    return platforms.find(p => p.value === platform)?.color || 'bg-gray-500';
  };

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  if (!isPro && !previewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Calendrier Éditorial
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Le calendrier éditorial est une fonctionnalité exclusive des plans Pro et Business.
              Planifiez vos publications sur tous vos réseaux sociaux et gardez une vue d'ensemble de votre stratégie de contenu.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              <span>Passer à Pro</span>
            </a>
          </div>
        </div>

        {/* Pro Trial Modal */}
        <ProTrialModal
          isOpen={showProTrialModal}
          onClose={() => {
            setShowProTrialModal(false);
            navigate('/dashboard');
          }}
          feature="calendar"
          canUseTrial={canUseTrial}
          onActivateTrial={() => {
            setShowProTrialModal(false);
            navigate('/dashboard');
          }}
          onActivatePreview={handleActivatePreview}
        />
      </div>
    );
  }

  if (loading && Object.keys(calendarData).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 dark:border-purple-900"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 dark:border-purple-400 absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du calendrier...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const days = getDaysInMonth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <Calendar className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Calendrier Éditorial</span>
            <span className="sm:hidden">Calendrier</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Planifiez et gérez vos publications sur tous vos réseaux sociaux
          </p>
        </div>

        {/* Preview Mode Banner */}
        {previewMode && (
          <div className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6" />
                <div>
                  <p className="font-bold text-lg">Mode Aperçu Pro</p>
                  <p className="text-sm text-blue-100">Vous explorez l'interface Pro. Les données affichées sont des exemples.</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Passer à Pro
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6">
              {/* Calendar Controls */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm sm:text-base"
                >
                  ←
                </button>

                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm sm:text-base"
                >
                  →
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 text-xs sm:text-sm py-1 sm:py-2">
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.slice(0, 1)}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  // Create date key without timezone conversion
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const dateKey = `${year}-${month}-${day}`;
                  const dayContent = calendarData[dateKey] || [];
                  const isToday = new Date().toDateString() === date.toDateString();

                  // Debug log for today
                  if (isToday) {
                    console.log('🎯 Today detected:', {
                      dateKey,
                      date: date.toDateString(),
                      dayContent: dayContent.length,
                      calendarDataKeys: Object.keys(calendarData)
                    });
                  }

                  return (
                    <div
                      key={dateKey}
                      className={`
                        aspect-square border-2 rounded-lg sm:rounded-xl p-1 sm:p-2 transition-all cursor-pointer
                        ${isToday
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-slate-700/50'
                        }
                      `}
                      onClick={() => openScheduleModal(date)}
                    >
                      <div className="flex flex-col h-full">
                        <span className={`text-sm font-semibold mb-1 ${isToday ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {date.getDate()}
                        </span>

                        <div className="flex-1 overflow-y-auto space-y-1">
                          {dayContent.slice(0, 3).map(item => (
                            <div
                              key={item.id}
                              className={`${getPlatformColor(item.platform)} text-white text-xs px-1.5 py-0.5 rounded truncate`}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal({...item, scheduled_date: `${dateKey}T${item.time}`});
                              }}
                            >
                              {item.time} {item.title || platforms.find(p => p.value === item.platform)?.label}
                            </div>
                          ))}
                          {dayContent.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                              +{dayContent.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Content Button */}
            <button
              onClick={() => {
                setScheduleForm({
                  generated_content_id: '',
                  scheduled_date: '',
                  scheduled_time: '09:00',
                  platform: 'linkedin',
                  title: '',
                  notes: ''
                });
                setShowScheduleModal(true);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Planifier</span>
            </button>

            {/* Upcoming Content */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Prochains 7 jours
              </h3>

              {upcomingContent.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Aucun contenu planifié</p>
              ) : (
                <div className="space-y-3">
                  {upcomingContent.map(item => (
                    <div
                      key={item.id}
                      className="border-l-4 border-purple-500 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-r-lg"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className={`${getPlatformColor(item.platform)} text-white text-xs px-2 py-0.5 rounded`}>
                          {platforms.find(p => p.value === item.platform)?.label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          J-{item.days_until}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title || 'Sans titre'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatScheduledDate(item.scheduled_date, {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Platform Legend */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Plateformes
              </h3>
              <div className="space-y-2">
                {platforms.map(platform => (
                  <div key={platform.value} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 ${platform.color} rounded`}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{platform.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Planifier du contenu
                </h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Contenu à publier
                  </label>

                  {isPro ? (
                    <>
                      {/* Variant Tabs for Pro/Business */}
                      <div className="flex gap-2 mb-3">
                        {['Équilibrée', 'Audacieuse', 'Alternative'].map((label, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedVariant(index)}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                              selectedVariant === index
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            {['⚖️', '🚀', '✨'][index]} {label}
                          </button>
                        ))}
                      </div>

                      {/* Content cards filtered by variant */}
                      <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-300 dark:border-slate-600 rounded-xl p-3 bg-gray-50 dark:bg-slate-900">
                        {availableContent.filter(c => c.variant_number === selectedVariant + 1).length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            Aucun contenu disponible pour cette variante.
                          </p>
                        ) : (
                          availableContent
                            .filter(c => c.variant_number === selectedVariant + 1)
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .map(content => {
                              const isSelected = scheduleForm.generated_content_id === content.id.toString();
                              return (
                                <button
                                  key={content.id}
                                  type="button"
                                  onClick={() => setScheduleForm({...scheduleForm, generated_content_id: content.id.toString()})}
                                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                    isSelected
                                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                      : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600'
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                      isSelected
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                                    }`}>
                                      {content.format_name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(content.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                  </div>
                                  <p className={`text-sm line-clamp-2 ${
                                    isSelected
                                      ? 'text-gray-900 dark:text-white font-medium'
                                      : 'text-gray-600 dark:text-gray-300'
                                  }`}>
                                    {content.text}
                                  </p>
                                </button>
                              );
                            })
                        )}
                      </div>
                    </>
                  ) : (
                    /* Simple list for Free/Starter */
                    <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-300 dark:border-slate-600 rounded-xl p-3 bg-gray-50 dark:bg-slate-900">
                      {availableContent.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                          Aucun contenu disponible. Générez du contenu d'abord.
                        </p>
                      ) : (
                        availableContent
                          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                          .map(content => {
                            const isSelected = scheduleForm.generated_content_id === content.id.toString();
                            return (
                              <button
                                key={content.id}
                                type="button"
                                onClick={() => setScheduleForm({...scheduleForm, generated_content_id: content.id.toString()})}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                  isSelected
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                    isSelected
                                      ? 'bg-purple-500 text-white'
                                      : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {content.format_name}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(content.created_at).toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                                <p className={`text-sm line-clamp-2 ${
                                  isSelected
                                    ? 'text-gray-900 dark:text-white font-medium'
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}>
                                  {content.text}
                                </p>
                              </button>
                            );
                          })
                      )}
                    </div>
                  )}

                  {scheduleForm.generated_content_id && (
                    <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <label className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                          Aperçu du contenu sélectionné
                        </label>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto p-3 bg-white dark:bg-slate-800 rounded-lg">
                        {availableContent.find(c => c.id === parseInt(scheduleForm.generated_content_id))?.text}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduleForm.scheduled_date}
                      onChange={(e) => setScheduleForm({...scheduleForm, scheduled_date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Heure
                    </label>
                    <input
                      type="time"
                      value={scheduleForm.scheduled_time}
                      onChange={(e) => setScheduleForm({...scheduleForm, scheduled_time: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Plateforme
                  </label>
                  <select
                    value={scheduleForm.platform}
                    onChange={(e) => setScheduleForm({...scheduleForm, platform: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  >
                    {platforms.map(platform => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Titre (optionnel)
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
                    placeholder="Ex: Lancement nouveau produit"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                    placeholder="Ajouter des notes..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={handleSchedule}
                  disabled={!scheduleForm.generated_content_id || !scheduleForm.scheduled_date}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Planifier
                </button>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Modifier le contenu planifié
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduleForm.scheduled_date}
                      onChange={(e) => setScheduleForm({...scheduleForm, scheduled_date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Heure
                    </label>
                    <input
                      type="time"
                      value={scheduleForm.scheduled_time}
                      onChange={(e) => setScheduleForm({...scheduleForm, scheduled_time: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Plateforme
                  </label>
                  <select
                    value={scheduleForm.platform}
                    onChange={(e) => setScheduleForm({...scheduleForm, platform: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  >
                    {platforms.map(platform => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white resize-none"
                  />
                </div>

                {editingItem.content_preview && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Aperçu du contenu
                    </label>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-sm text-gray-700 dark:text-gray-300">
                      {editingItem.content_preview}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  <Edit2 className="h-4 w-4 inline mr-2" />
                  Mettre à jour
                </button>
                <button
                  onClick={() => handleDelete(editingItem.id)}
                  className="px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 className="h-4 w-4 inline mr-2" />
                  Supprimer
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorialCalendar;
