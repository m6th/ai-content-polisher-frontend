import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { polishContent, getMyPlanRestrictions, getProTrialStatus, getAvailableTones } from '../services/api';
import { Wand2, Copy, Check, Download, Globe, Smile, Lock, Crown, AlertCircle, CheckCircle, Info, Search, Sparkles, RefreshCw, Coins, Calendar, Lightbulb, ArrowUp, Eye, X, FileText, Share2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import AIInsights from './AIInsights';
import HashtagButton from './HashtagButton';
import VariantSelector from './VariantSelector';
import AIFeatures from './AIFeatures';
import ProTrialComparisonModal from './ProTrialComparisonModal';

function ContentPolisher({ user, onUpdateUser }) {
  const { language: uiLanguage } = useLanguage();
  const t = useTranslation(uiLanguage);
  const navigate = useNavigate();
  const toast = useToast();

  const [originalText, setOriginalText] = useState('');
  const [tone, setTone] = useState('professional');
  const [contentLanguage, setContentLanguage] = useState('fr');
  const [generatedFormats, setGeneratedFormats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [planRestrictions, setPlanRestrictions] = useState(null);

  // New states for Tier 1 improvements
  const [charCount, setCharCount] = useState(0);
  const [textQuality, setTextQuality] = useState('empty');
  const [generationStep, setGenerationStep] = useState(0);
  const [showOriginal, setShowOriginal] = useState({});
  const [regeneratingFormat, setRegeneratingFormat] = useState(null);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const resultsRef = useRef(null);

  // Tier 2: Sidebar states
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [timeUntilRenewal, setTimeUntilRenewal] = useState('');

  // Tier 2: Preview modal & confetti
  const [previewModal, setPreviewModal] = useState({ isOpen: false, format: null, content: '' });
  const [showConfetti, setShowConfetti] = useState(false);

  // Pro/Business features
  const [hashtags, setHashtags] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [requestId, setRequestId] = useState(null);

  // Pro trial states
  const [canUseTrial, setCanUseTrial] = useState(false);
  const [showProTrialComparison, setShowProTrialComparison] = useState(false);
  const [trialUsed, setTrialUsed] = useState(false);

  // Custom style modal states
  const [showAddStyleModal, setShowAddStyleModal] = useState(false);
  const [newStyleUrl, setNewStyleUrl] = useState(''); // Posts collés du créateur
  const [newStyleName, setNewStyleName] = useState('');
  const [creatingStyle, setCreatingStyle] = useState(false);

  // Dynamic tones (predefined + custom styles)
  const [allTones, setAllTones] = useState([
    { value: 'professional', label: t.polisher.tones.professional },
    { value: 'engaging', label: t.polisher.tones.engaging },
    { value: 'storytelling', label: t.polisher.tones.storytelling },
  ]);

  const languages = [
    { value: 'fr', label: t.polisher.languages.fr },
    { value: 'en', label: t.polisher.languages.en },
    { value: 'es', label: t.polisher.languages.es },
  ];

  const formatLabels = {
    linkedin: { name: 'LinkedIn Post', icon: '💼', color: 'from-blue-500 to-blue-600', recommended: true },
    instagram: { name: 'Instagram Caption', icon: '📸', color: 'from-purple-500 to-pink-500', recommended: true },
    tiktok: { name: 'Script TikTok', icon: '🎵', color: 'from-pink-500 to-pink-600' },
    twitter: { name: 'Tweet / Thread', icon: '🐦', color: 'from-sky-500 to-sky-600' },
    email: { name: 'Email Pro', icon: '📧', color: 'from-green-500 to-green-600' },
    persuasive: { name: 'Publicité', icon: '🎯', color: 'from-orange-500 to-orange-600', recommended: true },
  };

  // Helper functions for new features
  const updateTextQuality = (text) => {
    const len = text.length;
    if (len === 0) return 'empty';
    if (len < 20) return 'short';
    if (len < 50) return 'medium';
    if (len <= 500) return 'ideal';
    return 'long';
  };

  const useExample = (exampleText) => {
    setOriginalText(exampleText);
    setCharCount(exampleText.length);
    setTextQuality(updateTextQuality(exampleText));
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getQualityConfig = () => {
    switch (textQuality) {
      case 'short':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          message: t.polisher.charCounter.tooShort
        };
      case 'medium':
        return {
          icon: Info,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          message: t.polisher.charCounter.short
        };
      case 'ideal':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          message: t.polisher.charCounter.ideal
        };
      case 'long':
        return {
          icon: Info,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          message: t.polisher.charCounter.long
        };
      default:
        return null;
    }
  };

  const getProgressStep = () => {
    if (generationStep < 33) {
      return { text: t.polisher.progress.analyzing, icon: Search };
    } else if (generationStep < 66) {
      return { text: t.polisher.progress.generating, icon: Wand2 };
    } else {
      return { text: t.polisher.progress.finalizing, icon: Sparkles };
    }
  };

  // Tier 2: Sidebar helpers
  const calculateTimeUntilRenewal = () => {
    // Use last_credit_renewal if available, otherwise use created_at as fallback
    const referenceDate = user?.last_credit_renewal || user?.created_at;

    if (!referenceDate) return '';

    const lastRenewal = new Date(referenceDate);
    const nextRenewal = new Date(lastRenewal);
    nextRenewal.setMonth(nextRenewal.getMonth() + 1);

    const now = new Date();
    const diff = nextRenewal - now;

    if (diff <= 0) return '0j';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days}j ${hours}h`;
    } else {
      return `${hours}h`;
    }
  };

  const getPlanBadgeColor = () => {
    switch (user?.current_plan) {
      case 'free':
        return 'from-gray-500 to-gray-600';
      case 'starter':
        return 'from-blue-500 to-blue-600';
      case 'pro':
        return 'from-purple-500 to-purple-600';
      case 'business':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPlanDisplayName = () => {
    const planNames = {
      'free': 'Free',
      'starter': 'Starter',
      'pro': 'Pro',
      'business': 'Business'
    };
    return planNames[user?.current_plan] || 'Free';
  };

  // Tier 2: Confetti animation
  const triggerConfetti = () => {
    setShowConfetti(true);
    const colors = ['#9333ea', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3500);
      }, i * 30);
    }

    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Rotation des tips toutes les 10 secondes
  useEffect(() => {
    const tips = [
      t.polisher.sidebar.tips.tip1,
      t.polisher.sidebar.tips.tip2,
      t.polisher.sidebar.tips.tip3,
      t.polisher.sidebar.tips.tip4,
      t.polisher.sidebar.tips.tip5,
      t.polisher.sidebar.tips.tip6,
    ];

    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [t]);

  // Mise à jour du countdown toutes les minutes
  useEffect(() => {
    const updateCountdown = () => {
      setTimeUntilRenewal(calculateTimeUntilRenewal());
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user]);

  // Charger les restrictions du plan au montage
  useEffect(() => {
    const loadRestrictions = async () => {
      try {
        const response = await getMyPlanRestrictions();
        setPlanRestrictions(response.data);

        // Si le ton actuel n'est pas autorisé, sélectionner le premier ton autorisé
        if (response.data.tones && !response.data.tones.includes(tone)) {
          setTone(response.data.tones[0]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des restrictions:', error);
      }
    };

    loadRestrictions();
  }, []);

  // Charger les tons disponibles (prédéfinis + styles personnalisés)
  useEffect(() => {
    const loadTones = async () => {
      try {
        const response = await getAvailableTones();
        const tones = response.data;

        // Séparer les tons prédéfinis et customs
        const predefinedTones = tones
          .filter(t => t.type === 'predefined')
          .map(t => ({
            value: t.id,
            label: t.name
          }));

        const customTones = tones
          .filter(t => t.type === 'custom')
          .map(t => ({
            value: t.id,
            label: t.name,
            status: t.status,
            platform: t.platform,
            isCustom: true
          }));

        setAllTones([...predefinedTones, ...customTones]);
      } catch (error) {
        console.error('Erreur lors du chargement des tons:', error);
      }
    };

    loadTones();
  }, []);

  // Charger le statut de l'essai Pro
  useEffect(() => {
    const checkTrialStatus = async () => {
      try {
        const response = await getProTrialStatus();
        setCanUseTrial(response.data.can_use_trial);
        setTrialUsed(response.data.has_used_trial);
      } catch (error) {
        console.error('Erreur lors du chargement du statut Pro trial:', error);
      }
    };

    if (user?.current_plan === 'free' || user?.current_plan === 'starter') {
      checkTrialStatus();
    }
  }, [user]);

  const handleProTrialGeneration = async () => {
    setError('');
    setGeneratedFormats([]);
    setLoading(true);
    setShowSuccessFeedback(false);
    setGenerationStep(0);

    // Simulate progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 95) {
        clearInterval(progressInterval);
        setGenerationStep(95);
      } else {
        setGenerationStep(progress);
      }
    }, 300);

    try {
      const response = await polishContent(originalText, tone, contentLanguage, true); // use_pro_trial = true
      clearInterval(progressInterval);
      setGenerationStep(100);

      // Group formats by format name and collect variants
      const formatsMap = {};
      response.data.formats.forEach(item => {
        if (!formatsMap[item.format]) {
          formatsMap[item.format] = {
            format: item.format,
            variants: [],
            id: item.id,
            created_at: item.created_at
          };
        }
        formatsMap[item.format].variants.push(item.content);
      });

      // Convert to array and simplify if only one variant
      const processedFormats = Object.values(formatsMap).map(f => ({
        ...f,
        content: f.variants.length === 1 ? f.variants[0] : f.variants[0],
        variants: f.variants.length > 1 ? f.variants : null
      }));

      setGeneratedFormats(processedFormats);
      setHashtags(response.data.hashtags || null);
      setAiSuggestions(response.data.ai_suggestions || null);
      setRequestId(response.data.request_id);
      setShowSuccessFeedback(true);
      setCanUseTrial(false);
      setTrialUsed(true);
      onUpdateUser();

      // Trigger confetti animation
      triggerConfetti();

      toast.success(
        uiLanguage === 'fr' ? `✨ Essai Pro activé ! ${response.data.formats.length} formats générés avec toutes les fonctionnalités Pro !` :
        uiLanguage === 'en' ? `✨ Pro trial activated! ${response.data.formats.length} formats generated with all Pro features!` :
        `✨ ¡Prueba Pro activada! ¡${response.data.formats.length} formatos generados con todas las funciones Pro!`
      );

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      // Show comparison modal after 3 seconds
      setTimeout(() => {
        setShowProTrialComparison(true);
      }, 3000);
    } catch (err) {
      clearInterval(progressInterval);
      setGenerationStep(0);
      if (err.response?.status === 403) {
        toast.error(err.response?.data?.detail || t.polisher.errorInsufficientCredentials);
      } else {
        toast.error(t.polisher.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGeneratedFormats([]);
    setLoading(true);
    setShowSuccessFeedback(false);
    setGenerationStep(0);

    if (user.credits_remaining <= 0) {
      toast.error(t.polisher.errorNoCredits);
      setLoading(false);
      return;
    }

    // Simulate progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 95) {
        clearInterval(progressInterval);
        setGenerationStep(95);
      } else {
        setGenerationStep(progress);
      }
    }, 300);

    try {
      const response = await polishContent(originalText, tone, contentLanguage);
      clearInterval(progressInterval);
      setGenerationStep(100);

      // Group formats by format name and collect variants
      const formatsMap = {};
      response.data.formats.forEach(item => {
        if (!formatsMap[item.format]) {
          formatsMap[item.format] = {
            format: item.format,
            variants: [],
            id: item.id,
            created_at: item.created_at
          };
        }
        formatsMap[item.format].variants.push(item.content);
      });

      // Convert to array and simplify if only one variant
      const processedFormats = Object.values(formatsMap).map(f => ({
        ...f,
        content: f.variants.length === 1 ? f.variants[0] : f.variants[0], // Keep first variant as default content
        variants: f.variants.length > 1 ? f.variants : null
      }));

      setGeneratedFormats(processedFormats);
      setHashtags(response.data.hashtags || null);
      setAiSuggestions(response.data.ai_suggestions || null);
      setRequestId(response.data.request_id);
      setShowSuccessFeedback(true);
      onUpdateUser();

      // Trigger confetti animation
      triggerConfetti();

      toast.success(
        uiLanguage === 'fr' ? `${response.data.formats.length} formats générés avec succès !` :
        uiLanguage === 'en' ? `${response.data.formats.length} formats generated successfully!` :
        `¡${response.data.formats.length} formatos generados con éxito!`
      );

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      clearInterval(progressInterval);
      setGenerationStep(0);
      if (err.response?.status === 403) {
        toast.error(t.polisher.errorInsufficientCredentials);
      } else {
        toast.error(t.polisher.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);

    // Add bounce animation
    const element = document.getElementById(`card-${id}`);
    if (element) {
      element.classList.add('bounce-once');
      setTimeout(() => element.classList.remove('bounce-once'), 300);
    }

    setTimeout(() => setCopiedId(null), 2000);
    toast.success(
      uiLanguage === 'fr' ? 'Contenu copié !' :
      uiLanguage === 'en' ? 'Content copied!' :
      '¡Contenido copiado!'
    );
  };

  // Handler for text area change - memoized to prevent unnecessary re-renders
  const handleTextChange = useCallback((e) => {
    const text = e.target.value;
    setOriginalText(text);
    setCharCount(text.length);
    setTextQuality(updateTextQuality(text));
  }, []);

  const handleDownloadAll = useCallback(() => {
    const allContent = generatedFormats
      .map((format) => {
        const label = formatLabels[format.format]?.name || format.format;
        return `========================================\n${label.toUpperCase()}\n========================================\n\n${format.content}\n\n`;
      })
      .join('\n');

    const blob = new Blob([allContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-content-polisher-export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generatedFormats, formatLabels]);

  // Export individual content as TXT
  const handleDownloadTxt = useCallback((content, formatName) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formatName.toLowerCase().replace(/\s+/g, '-')}-content.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(
      uiLanguage === 'fr' ? 'Fichier téléchargé !' :
      uiLanguage === 'en' ? 'File downloaded!' :
      '¡Archivo descargado!'
    );
  }, [toast, uiLanguage]);

  // Export individual content as PDF
  const handleDownloadPdf = useCallback((content, formatName) => {
    // Create a simple PDF using jsPDF-like approach (HTML to canvas to PDF)
    // For simplicity, we'll create a print-friendly HTML and use browser print
    const printWindow = window.open('', '_blank');
    const formatLabel = formatLabels[formatName]?.name || formatName;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${formatLabel} - AI Content Polisher</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              line-height: 1.6;
              color: #333;
            }
            h1 {
              color: #7c3aed;
              border-bottom: 3px solid #7c3aed;
              padding-bottom: 10px;
              margin-bottom: 30px;
            }
            .content {
              white-space: pre-wrap;
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #7c3aed;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 0.9em;
            }
            @media print {
              body { margin: 0; padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>${formatLabel}</h1>
          <div class="content">${content.replace(/\n/g, '<br>')}</div>
          <div class="footer">
            <p>Generated with AI Content Polisher</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 250);

    toast.success(
      uiLanguage === 'fr' ? 'Ouverture de l\'aperçu PDF...' :
      uiLanguage === 'en' ? 'Opening PDF preview...' :
      'Abriendo vista previa PDF...'
    );
  }, [toast, uiLanguage, formatLabels]);

  // Share to social media
  const handleShare = useCallback((content, platform) => {
    const encodedContent = encodeURIComponent(content);
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedContent}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedContent}`;
        break;
      default:
        // Generic share using Web Share API if available
        if (navigator.share) {
          navigator.share({
            title: 'AI Content Polisher',
            text: content,
          }).catch(() => {});
          return;
        }
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      toast.success(
        uiLanguage === 'fr' ? 'Partage ouvert !' :
        uiLanguage === 'en' ? 'Share opened!' :
        '¡Compartir abierto!'
      );
    }
  }, [toast, uiLanguage]);

  const isToneAllowed = useCallback((toneValue) => {
    if (!planRestrictions) return true;
    return planRestrictions.tones.includes(toneValue);
  }, [planRestrictions]);

  const tips = [
    t.polisher.sidebar.tips.tip1,
    t.polisher.sidebar.tips.tip2,
    t.polisher.sidebar.tips.tip3,
    t.polisher.sidebar.tips.tip4,
    t.polisher.sidebar.tips.tip5,
    t.polisher.sidebar.tips.tip6,
  ];

  return (
    <div className="max-w-full px-2 sm:px-4 mx-auto relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-3xl float-particle"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl float-particle-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-indigo-200 rounded-full opacity-20 blur-3xl float-particle"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-purple-300 rounded-full opacity-20 blur-3xl float-particle-delayed"></div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 items-start">
        {/* Main Content */}
        <div className="flex-1 w-full bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-slate-700">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
            <Wand2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
            {t.polisher.title}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-slate-400">
            {t.polisher.subtitle}
          </p>
        </div>

        {/* Plan Restriction Alert */}
        {planRestrictions && (user.current_plan === 'free' || user.current_plan === 'starter') && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-purple-900 mb-1">
                  Plan {user.current_plan === 'free' ? 'Gratuit' : 'Starter'} - Accès limité
                </h3>
                <p className="text-xs sm:text-sm text-purple-700 mb-2">
                  {user.current_plan === 'free'
                    ? 'Vous avez accès à 3 plateformes et 3 tons uniquement.'
                    : 'Vous avez accès à toutes les plateformes mais seulement 3 tons.'
                  }
                </p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="inline-flex items-center text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-800 transition"
                >
                  <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="line-clamp-1">Passer à Pro pour débloquer tous les tons et fonctionnalités</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Tone Selection with restrictions */}
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <label className="flex items-center text-gray-700 dark:text-slate-300 font-semibold text-sm sm:text-base lg:text-lg">
                  <Smile className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-purple-600" />
                  {t.polisher.toneLabel}
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddStyleModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {uiLanguage === 'fr' ? 'Nouveau style' : uiLanguage === 'en' ? 'New style' : 'Nuevo estilo'}
                </button>
              </div>
              <div className="relative">
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base lg:text-lg appearance-none"
                >
                  {/* Tons prédéfinis */}
                  <optgroup label={uiLanguage === 'fr' ? '📝 Styles prédéfinis' : uiLanguage === 'en' ? '📝 Predefined styles' : '📝 Estilos predefinidos'}>
                    {allTones.filter(t => !t.isCustom).map((toneOption) => {
                      const allowed = isToneAllowed(toneOption.value);
                      return (
                        <option
                          key={toneOption.value}
                          value={toneOption.value}
                          disabled={!allowed}
                        >
                          {toneOption.label} {!allowed ? '🔒 (Pro/Business)' : ''}
                        </option>
                      );
                    })}
                  </optgroup>

                  {/* Styles personnalisés */}
                  {allTones.some(t => t.isCustom) && (
                    <optgroup label={uiLanguage === 'fr' ? '✨ Mes styles personnels' : uiLanguage === 'en' ? '✨ My personal styles' : '✨ Mis estilos personales'}>
                      {allTones.filter(t => t.isCustom).map((toneOption) => {
                        const statusIcon = toneOption.status === 'ready' ? '✅' :
                                          toneOption.status === 'analyzing' ? '⏳' :
                                          toneOption.status === 'failed' ? '❌' : '⏸️';
                        return (
                          <option
                            key={toneOption.value}
                            value={toneOption.value}
                            disabled={toneOption.status !== 'ready'}
                          >
                            {statusIcon} {toneOption.label}
                          </option>
                        );
                      })}
                    </optgroup>
                  )}
                </select>
              </div>
              {planRestrictions && (user.current_plan === 'free' || user.current_plan === 'starter') && (
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                  💡 Tons disponibles : {planRestrictions.tones.length}/{allTones.filter(t => !t.isCustom).length}
                </p>
              )}
            </div>

            {/* Language Selection */}
            <div>
              <label className="flex items-center text-gray-700 dark:text-slate-300 font-semibold mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-blue-600" />
                {t.polisher.languageLabel}
              </label>
              <select
                value={contentLanguage}
                onChange={(e) => setContentLanguage(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base lg:text-lg"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label className="text-gray-700 dark:text-slate-300 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base lg:text-lg">
              {t.polisher.inputLabel}
            </label>
            <textarea
              value={originalText}
              onChange={handleTextChange}
              className="w-full px-3 sm:px-5 py-3 sm:py-4 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-sm sm:text-base lg:text-lg placeholder:text-gray-400 dark:placeholder:text-slate-500"
              rows="6"
              placeholder={t.polisher.inputPlaceholder}
              required
            />

            {/* Character Counter & Quality Indicator */}
            {originalText.length > 0 && (
              <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between">
                <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                  {charCount} {t.polisher.charCounter.characters}
                </span>
                {textQuality !== 'empty' && (() => {
                  const config = getQualityConfig();
                  const IconComponent = config.icon;
                  return (
                    <div className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border ${config.borderColor} ${config.bgColor} transition-all`}>
                      <IconComponent className={`h-3 w-3 sm:h-4 sm:w-4 ${config.color}`} />
                      <span className={`text-xs sm:text-sm font-medium ${config.color}`}>
                        {config.message}
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Pro Trial Info Box */}
          {canUseTrial && !trialUsed && (user?.current_plan === 'free' || user?.current_plan === 'starter') && (
            <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-pink-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    ✨ Essai Pro Gratuit Disponible !
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Testez toutes les fonctionnalités Pro avec 1 crédit gratuit. Vous recevrez :
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">3 variantes créatives</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Plusieurs versions de votre contenu</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Hashtags optimisés par IA</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Maximisez votre portée</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Suggestions d'amélioration IA</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Conseils personnalisés</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Accès complet Calendar & Analytics</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Planification et statistiques</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span>Entrez votre texte ci-dessus, puis cliquez sur "Tester Pro Gratuitement" pour découvrir toutes les fonctionnalités Pro !</span>
                </p>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="space-y-2 sm:space-y-3">
            {/* Pro Trial Button - Only for Free/Starter who can use trial */}
            {canUseTrial && !trialUsed && (user?.current_plan === 'free' || user?.current_plan === 'starter') && (
              <button
                type="button"
                onClick={handleProTrialGeneration}
                disabled={loading || !originalText.trim()}
                className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                    <span>{t.polisher.generating}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
                    <span className="hidden sm:inline">✨ Tester Pro Gratuitement (1 crédit)</span>
                    <span className="sm:hidden">✨ Tester Pro Gratuit</span>
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
                  </>
                )}
              </button>
            )}

            {/* Regular Submit Button */}
            <button
              type="submit"
              disabled={loading || !originalText.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                  <span>{t.polisher.generating}</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>{t.polisher.generateButton}</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mt-6">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const step = getProgressStep();
                      const StepIcon = step.icon;
                      return (
                        <>
                          <StepIcon className="h-5 w-5 text-purple-600 animate-pulse" />
                          <span className="text-sm font-semibold text-purple-700">
                            {step.text}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                  <span className="text-sm font-semibold text-purple-700">
                    {Math.round(generationStep)}%
                  </span>
                </div>
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-purple-100">
                  <div
                    style={{ width: `${generationStep}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 ease-out"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Empty State with Examples */}
        {!loading && generatedFormats.length === 0 && (
          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
              <Wand2 className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 animate-pulse" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">
              {t.polisher.emptyState.title}
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-slate-400 mb-6 sm:mb-8 px-4">
              {t.polisher.emptyState.subtitle}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
              {t.polisher.emptyState.examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => useExample(example)}
                  className="group relative p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-dashed border-purple-200 dark:border-purple-700 rounded-xl sm:rounded-2xl hover:border-purple-400 dark:hover:border-purple-500 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all text-left"
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1 group-hover:animate-spin" />
                    <div>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-slate-200 leading-relaxed">
                        {example}
                      </p>
                      <span className="inline-block mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                        {t.polisher.emptyState.tryExample} →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Success Feedback */}
        {showSuccessFeedback && generatedFormats.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 fade-in-up">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl bounce-once">
                  <Check className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  {t.polisher.success.title}
                </h3>
                <div className="space-y-1 text-sm text-green-800">
                  <p>
                    🪙 1 {t.polisher.success.creditsUsed} • {user.credits_remaining} {t.polisher.success.creditsRemaining}
                  </p>
                  <p>⏱️ {t.polisher.success.timeSaved}</p>
                  <p className="font-medium mt-2">💡 {t.polisher.success.nextStep}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setGeneratedFormats([]);
                  setShowSuccessFeedback(false);
                  setOriginalText('');
                  setCharCount(0);
                  setTextQuality('empty');
                }}
                className="flex-shrink-0 ml-4 flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-semibold"
              >
                <RefreshCw className="h-4 w-4" />
                <span>{t.polisher.success.regenerate}</span>
              </button>
            </div>
          </div>
        )}

        {/* Generated Content */}
        <div ref={resultsRef}>
        {generatedFormats.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                {t.polisher.generatedContent}
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {requestId && (user.current_plan === 'pro' || user.current_plan === 'business') && (
                  <a
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/content/export/${requestId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg text-sm sm:text-base font-semibold"
                  >
                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Export ZIP (Pro)</span>
                    <span className="sm:hidden">Export ZIP</span>
                  </a>
                )}
                <button
                  onClick={handleDownloadAll}
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg text-sm sm:text-base font-semibold"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Tout télécharger</span>
                  <span className="sm:hidden">Télécharger</span>
                </button>
              </div>
            </div>

            {/* AI Features for Pro/Business */}
            {(hashtags || aiSuggestions) && (
              <div className="mb-8">
                <AIFeatures hashtags={hashtags} aiSuggestions={aiSuggestions} />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
              {generatedFormats.map((format, index) => {
                const formatInfo = formatLabels[format.format] || {
                  name: format.format,
                  icon: '📝',
                  color: 'from-gray-500 to-gray-600'
                };
                const wordCount = countWords(format.content);
                const charCount = format.content.length;
                const isRecommended = formatInfo.recommended;
                const staggerClass = `stagger-${(index % 15) + 1}`;

                return (
                  <div
                    key={index}
                    id={`card-${index}`}
                    className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all fade-in-up ${staggerClass}`}
                  >
                    <div className={`bg-gradient-to-r ${formatInfo.color} px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-2xl sm:text-3xl">{formatInfo.icon}</span>
                        <div>
                          <h4 className="text-white font-bold text-base sm:text-lg">{formatInfo.name}</h4>
                          {isRecommended && (
                            <span className="inline-block mt-0.5 sm:mt-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shimmer">
                              ⭐ {t.polisher.formatCard.recommended}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-wrap w-full sm:w-auto justify-end">
                        <button
                          onClick={() => setShowOriginal(prev => ({ ...prev, [index]: !prev[index] }))}
                          className="bg-white/95 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/40 text-gray-700 dark:text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-xs font-medium shadow-md tooltip"
                          data-tooltip={showOriginal[index] ? t.polisher.formatCard.hideOriginal : t.polisher.formatCard.showOriginal}
                        >
                          {showOriginal[index] ? '👁️‍🗨️' : '👁️'}
                        </button>
                        <button
                          onClick={() => setPreviewModal({ isOpen: true, format: format.format, content: format.content })}
                          className="bg-white/95 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/40 text-gray-700 dark:text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all tooltip shadow-md"
                          data-tooltip={t.polisher.preview.viewPreview}
                        >
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                        <button
                          onClick={() => handleCopy(format.content, index)}
                          className="bg-white/95 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/40 text-gray-700 dark:text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all flex items-center space-x-1.5 sm:space-x-2 shadow-md"
                        >
                          {copiedId === index ? (
                            <>
                              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                                {uiLanguage === 'fr' ? 'Copié !' : uiLanguage === 'en' ? 'Copied!' : '¡Copiado!'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                                {uiLanguage === 'fr' ? 'Copier' : uiLanguage === 'en' ? 'Copy' : 'Copiar'}
                              </span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDownloadTxt(format.content, formatInfo.name)}
                          className="bg-white/95 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/40 text-gray-700 dark:text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all tooltip shadow-md hidden sm:inline-flex"
                          data-tooltip={uiLanguage === 'fr' ? 'Télécharger TXT' : uiLanguage === 'en' ? 'Download TXT' : 'Descargar TXT'}
                        >
                          <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(format.content, format.format)}
                          className="bg-white/95 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/40 text-gray-700 dark:text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all tooltip shadow-md hidden lg:inline-flex"
                          data-tooltip={uiLanguage === 'fr' ? 'Exporter PDF' : uiLanguage === 'en' ? 'Export PDF' : 'Exportar PDF'}
                        >
                          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                        <button
                          onClick={() => handleShare(format.content, format.format.toLowerCase())}
                          className="bg-white/95 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/40 text-gray-700 dark:text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all tooltip shadow-md hidden lg:inline-flex"
                          data-tooltip={uiLanguage === 'fr' ? 'Partager' : uiLanguage === 'en' ? 'Share' : 'Compartir'}
                        >
                          <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                        <div className="hidden sm:block">
                          <HashtagButton
                            content={format.content}
                            platform={format.format.toLowerCase()}
                            language={contentLanguage}
                            uiLanguage={uiLanguage}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Original vs Generated Toggle */}
                    {showOriginal[index] && (
                      <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-2">📝 Texte original :</p>
                        <p className="text-gray-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                          {originalText}
                        </p>
                      </div>
                    )}

                    {/* Use VariantSelector for multi-variant or single content */}
                    <VariantSelector
                      variants={format.variants || [format.content]}
                      format={format.format}
                      onCopy={handleCopy}
                      copiedVariant={copiedId}
                      formatInfo={formatInfo}
                    />

                    {/* Stats & Actions Footer */}
                    <div className="px-6 py-3 bg-gray-50 dark:bg-slate-900border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                      <div className="text-xs text-gray-600 dark:text-slate-400">
                        <span className="font-medium">{wordCount}</span> {t.polisher.formatCard.words} • <span className="font-medium">{charCount}</span> {t.polisher.formatCard.characters}
                      </div>
                      <button
                        onClick={() => {
                          // Placeholder for regenerate individual format
                          alert('Fonction de régénération individuelle à implémenter avec le backend');
                        }}
                        disabled={regeneratingFormat === index}
                        className="flex items-center space-x-1 text-xs font-semibold text-purple-600 hover:text-purple-800 transition disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3 w-3 ${regeneratingFormat === index ? 'animate-spin' : ''}`} />
                        <span>{t.polisher.formatCard.regenerate}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
        </div>

        {/* Sidebar - Desktop only (≥1280px) */}
        <div className="hidden xl:block w-80 flex-shrink-0">
          <div className="sticky top-6 space-y-4">
            {/* User Info Card */}
            <div className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-purple-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t.polisher.sidebar.title}</h3>
                <Crown className="h-5 w-5 text-purple-600" />
              </div>

              {/* Credits */}
              <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-slate-400 flex items-center">
                    <Coins className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                    {t.polisher.sidebar.creditsRemaining}
                  </span>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {user?.credits_remaining || 0}
                </div>
              </div>

              {/* Plan Badge */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
                <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">{t.polisher.sidebar.currentPlan}</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getPlanBadgeColor()} text-white font-bold text-sm`}>
                  {getPlanDisplayName()}
                </div>
              </div>

              {/* Renewal Countdown */}
              {timeUntilRenewal && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
                  <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {t.polisher.sidebar.nextRenewal}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    {timeUntilRenewal}
                  </div>
                </div>
              )}

              {/* Upgrade Button */}
              {user?.current_plan !== 'business' && (
                <button
                  onClick={() => navigate('/pricing')}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2.5 px-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <ArrowUp className="h-4 w-4" />
                  <span>{t.polisher.sidebar.upgradePlan}</span>
                </button>
              )}
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg border-2 border-yellow-200 p-6">
              <div className="flex items-center mb-3">
                <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="text-sm font-bold text-yellow-900">{t.polisher.sidebar.tips.title}</h3>
              </div>
              <p className="text-sm text-yellow-800 leading-relaxed fade-in-up">
                {tips[currentTipIndex]}
              </p>
            </div>

            {/* AI Insights Card */}
            <AIInsights
              content={originalText}
              platform="multi"
              tone={tone}
              language={contentLanguage}
            />
          </div>
        </div>
      </div>

      {/* Pro Trial Comparison Modal */}
      <ProTrialComparisonModal
        isOpen={showProTrialComparison}
        onClose={() => setShowProTrialComparison(false)}
      />

      {/* Preview Modal */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewModal({ isOpen: false, format: null, content: '' })}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${formatLabels[previewModal.format]?.color || 'from-gray-500 to-gray-600'} px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{formatLabels[previewModal.format]?.icon || '📝'}</span>
                <div>
                  <h3 className="text-white font-bold text-xl">{t.polisher.preview.title}</h3>
                  <p className="text-white/80 text-sm">{formatLabels[previewModal.format]?.name || previewModal.format}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewModal({ isOpen: false, format: null, content: '' })}
                className="bg-white dark:bg-slate-800/20 hover:bg-white dark:bg-slate-800/30 text-white p-2 rounded-lg transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content - Platform-specific preview */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
              {/* LinkedIn Preview */}
              {previewModal.format === 'linkedin' && (
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Utilisateur'}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Maintenant</p>
                    </div>
                  </div>
                  <p className="text-gray-800 dark:text-white whitespace-pre-wrap leading-relaxed">{previewModal.content}</p>
                  <div className="flex items-center space-x-4 mt-4 pt-3 border-t border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 text-sm">
                    <span>👍 J'aime</span>
                    <span>💬 Commenter</span>
                    <span>🔄 Partager</span>
                  </div>
                </div>
              )}

              {/* Instagram Preview */}
              {previewModal.format === 'instagram' && (
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
                  <div className="flex items-center space-x-3 p-3 border-b border-gray-200 dark:border-slate-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                    <span className="font-semibold text-sm">{user?.name || 'utilisateur'}</span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-gray-400 dark:text-slate-500">
                    <span className="text-sm">📸 Image du post</span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-800 dark:text-white whitespace-pre-wrap leading-relaxed">{previewModal.content}</p>
                  </div>
                </div>
              )}

              {/* Twitter Preview */}
              {previewModal.format === 'twitter' && (
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900 dark:text-white">{user?.name || 'Utilisateur'}</span>
                        <span className="text-gray-500 dark:text-slate-400">@{user?.name?.toLowerCase().replace(/\s/g, '') || 'user'}</span>
                        <span className="text-gray-500 dark:text-slate-400">· 1m</span>
                      </div>
                      <p className="text-gray-800 dark:text-white whitespace-pre-wrap mt-1 leading-relaxed">{previewModal.content}</p>
                      <div className="flex items-center space-x-8 mt-3 text-gray-500 dark:text-slate-400 text-sm">
                        <span>💬</span>
                        <span>🔄</span>
                        <span>❤️</span>
                        <span>📊</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Default Preview for other formats */}
              {!['linkedin', 'instagram', 'twitter'].includes(previewModal.format) && (
                <div className="bg-gray-50 dark:bg-slate-900rounded-lg p-6 border border-gray-200 dark:border-slate-700">
                  <p className="text-gray-800 dark:text-white whitespace-pre-wrap leading-relaxed">{previewModal.content}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900border-t border-gray-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setPreviewModal({ isOpen: false, format: null, content: '' })}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all"
              >
                {t.polisher.preview.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Style Modal */}
      {showAddStyleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  {uiLanguage === 'fr' ? "Style d'un créateur" : uiLanguage === 'en' ? "Creator's style" : 'Estilo de creador'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddStyleModal(false);
                    setNewStyleUrl('');
                    setNewStyleName('');
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Description */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-sm text-gray-700 dark:text-slate-300">
                      {uiLanguage === 'fr'
                        ? "Copie le texte de 2-3 posts d'un créateur que tu admires. L'IA analysera son style d'écriture pour générer du contenu similaire."
                        : uiLanguage === 'en'
                        ? "Copy the text of 2-3 posts from a creator you admire. The AI will analyze their writing style to generate similar content."
                        : "Copia el texto de 2-3 publicaciones de un creador que admiras. La IA analizará su estilo de escritura para generar contenido similar."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Posts Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  {uiLanguage === 'fr' ? 'Colle le texte des posts ici' : uiLanguage === 'en' ? 'Paste the posts text here' : 'Pega el texto de las publicaciones aquí'}
                </label>
                <textarea
                  value={newStyleUrl}
                  onChange={(e) => setNewStyleUrl(e.target.value)}
                  rows={8}
                  placeholder={
                    uiLanguage === 'fr'
                      ? `Colle ici le TEXTE de 2-3 posts LinkedIn, Instagram ou Facebook (pas les URLs)...\n\nExemple:\n---\nPost 1:\nAujourd'hui j'ai appris quelque chose d'important. Après 5 ans dans le marketing, je réalise que...\n---\nPost 2:\nLa clé du succès ? Ce n'est pas le talent. C'est la régularité...`
                      : uiLanguage === 'en'
                      ? `Paste the TEXT of 2-3 LinkedIn, Instagram or Facebook posts here (not URLs)...\n\nExample:\n---\nPost 1:\nToday I learned something important. After 5 years in marketing, I realized that...\n---\nPost 2:\nThe key to success? It's not talent. It's consistency...`
                      : `Pega aquí el TEXTO de 2-3 publicaciones de LinkedIn, Instagram o Facebook (no las URLs)...\n\nEjemplo:\n---\nPost 1:\nHoy aprendí algo importante. Después de 5 años en marketing, me di cuenta de que...\n---\nPost 2:\n¿La clave del éxito? No es el talento. Es la constancia...`
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-900 dark:text-white resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {uiLanguage === 'fr'
                      ? '✅ Supports: LinkedIn, Instagram, Facebook'
                      : uiLanguage === 'en'
                      ? '✅ Platforms: LinkedIn, Instagram, Facebook'
                      : '✅ Plataformas: LinkedIn, Instagram, Facebook'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {newStyleUrl.length} {uiLanguage === 'fr' ? 'caractères' : uiLanguage === 'en' ? 'characters' : 'caracteres'}
                  </p>
                </div>
              </div>

              {/* Style Name (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  {uiLanguage === 'fr' ? 'Nom du style (optionnel)' : uiLanguage === 'en' ? 'Style name (optional)' : 'Nombre del estilo (opcional)'}
                </label>
                <input
                  type="text"
                  value={newStyleName}
                  onChange={(e) => setNewStyleName(e.target.value)}
                  placeholder={
                    uiLanguage === 'fr'
                      ? 'Ex: Style de Gary Vee'
                      : uiLanguage === 'en'
                      ? 'Ex: Gary Vee style'
                      : 'Ej: Estilo de Gary Vee'}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddStyleModal(false);
                  setNewStyleUrl('');
                  setNewStyleName('');
                }}
                className="px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-semibold transition-all"
              >
                {uiLanguage === 'fr' ? 'Annuler' : uiLanguage === 'en' ? 'Cancel' : 'Cancelar'}
              </button>
              <button
                onClick={async () => {
                  if (!newStyleUrl.trim()) {
                    toast.error(uiLanguage === 'fr' ? 'Veuillez coller au moins un post' : uiLanguage === 'en' ? 'Please paste at least one post' : 'Por favor pegue al menos una publicación');
                    return;
                  }

                  if (newStyleUrl.trim().length < 100) {
                    toast.error(uiLanguage === 'fr' ? 'Le contenu est trop court. Ajoutez plus de posts.' : uiLanguage === 'en' ? 'Content is too short. Add more posts.' : 'El contenido es muy corto. Añade más publicaciones.');
                    return;
                  }

                  setCreatingStyle(true);
                  try {
                    const { createStyleProfile } = await import('../services/api');
                    await createStyleProfile('creator', newStyleUrl, newStyleName || null);

                    toast.success(uiLanguage === 'fr' ? 'Style ajouté ! Analyse en cours...' : uiLanguage === 'en' ? 'Style added! Analyzing...' : 'Estilo añadido! Analizando...');

                    // Recharger les tons
                    const { getAvailableTones } = await import('../services/api');
                    const response = await getAvailableTones();
                    const tones = response.data;

                    const predefinedTones = tones
                      .filter(t => t.type === 'predefined')
                      .map(t => ({ value: t.id, label: t.name }));

                    const customTones = tones
                      .filter(t => t.type === 'custom')
                      .map(t => ({
                        value: t.id,
                        label: t.name,
                        status: t.status,
                        platform: t.platform,
                        isCustom: true
                      }));

                    setAllTones([...predefinedTones, ...customTones]);

                    setShowAddStyleModal(false);
                    setNewStyleUrl('');
                    setNewStyleName('');
                  } catch (error) {
                    console.error('Error creating style:', error);
                    toast.error(uiLanguage === 'fr' ? 'Erreur lors de la création du style' : uiLanguage === 'en' ? 'Error creating style' : 'Error al crear el estilo');
                  } finally {
                    setCreatingStyle(false);
                  }
                }}
                disabled={creatingStyle || !newStyleUrl.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creatingStyle ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {uiLanguage === 'fr' ? 'Création...' : uiLanguage === 'en' ? 'Creating...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {uiLanguage === 'fr' ? 'Créer le style' : uiLanguage === 'en' ? 'Create style' : 'Crear estilo'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentPolisher;
