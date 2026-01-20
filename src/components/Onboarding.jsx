import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, Wand2, Copy, RefreshCw, Heart, Edit3, X, Linkedin, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { saveOnboardingData, polishContent } from '../services/api';
import { useToast } from '../contexts/ToastContext';

function Onboarding({ user }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 4: First post creation - sub-steps
  const [postCreationStep, setPostCreationStep] = useState('topic'); // 'topic', 'hooks', 'posts'
  const [firstPostText, setFirstPostText] = useState('');

  // Hooks state
  const [hooks, setHooks] = useState([]);
  const [selectedHookIndex, setSelectedHookIndex] = useState(null);
  const [editingHookIndex, setEditingHookIndex] = useState(null);
  const [generatingHooks, setGeneratingHooks] = useState(false);

  // Generated posts state
  const [generatedPosts, setGeneratedPosts] = useState({
    linkedin: null,
    instagram: null,
    twitter: null
  });
  const [generatingPosts, setGeneratingPosts] = useState(false);
  const [copiedPost, setCopiedPost] = useState(null);
  const [favorites, setFavorites] = useState({});

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  // Onboarding data
  const [onboardingData, setOnboardingData] = useState({
    discoverySource: '',
    discoverySourceOther: '',
    styleOption: '', // 'creator', 'predefined'
    creatorPosts: '', // Posts collés du créateur pour analyse
    preferredStyle: '',
    consentDataStorage: false
  });

  const totalSteps = 5;

  // Discovery sources
  const discoverySources = {
    fr: [
      { id: 'google', label: 'Google / Moteur de recherche' },
      { id: 'social', label: 'Réseaux sociaux' },
      { id: 'friend', label: 'Recommandation d\'un ami' },
      { id: 'blog', label: 'Article de blog / Site web' },
      { id: 'ads', label: 'Publicité' },
      { id: 'other', label: 'Autre' }
    ],
    en: [
      { id: 'google', label: 'Google / Search engine' },
      { id: 'social', label: 'Social media' },
      { id: 'friend', label: 'Friend recommendation' },
      { id: 'blog', label: 'Blog post / Website' },
      { id: 'ads', label: 'Advertisement' },
      { id: 'other', label: 'Other' }
    ],
    es: [
      { id: 'google', label: 'Google / Motor de búsqueda' },
      { id: 'social', label: 'Redes sociales' },
      { id: 'friend', label: 'Recomendación de un amigo' },
      { id: 'blog', label: 'Artículo de blog / Sitio web' },
      { id: 'ads', label: 'Publicidad' },
      { id: 'other', label: 'Otro' }
    ]
  };

  // Writing styles
  const writingStyles = {
    fr: [
      { id: 'professional', label: 'Professionnel', emoji: '💼', description: 'Ton formel et structuré' },
      { id: 'friendly', label: 'Amical', emoji: '😊', description: 'Ton décontracté et accessible' },
      { id: 'inspiring', label: 'Inspirant', emoji: '✨', description: 'Motivant et encourageant' },
      { id: 'narrative', label: 'Narratif', emoji: '📖', description: 'Storytelling et récits' },
      { id: 'promotional', label: 'Promotionnel', emoji: '🎯', description: 'Orienté vente et conversion' },
      { id: 'educational', label: 'Éducatif', emoji: '🎓', description: 'Pédagogique et informatif' },
      { id: 'humorous', label: 'Humoristique', emoji: '😄', description: 'Léger et divertissant' }
    ],
    en: [
      { id: 'professional', label: 'Professional', emoji: '💼', description: 'Formal and structured tone' },
      { id: 'friendly', label: 'Friendly', emoji: '😊', description: 'Casual and accessible tone' },
      { id: 'inspiring', label: 'Inspiring', emoji: '✨', description: 'Motivating and encouraging' },
      { id: 'narrative', label: 'Narrative', emoji: '📖', description: 'Storytelling and stories' },
      { id: 'promotional', label: 'Promotional', emoji: '🎯', description: 'Sales and conversion focused' },
      { id: 'educational', label: 'Educational', emoji: '🎓', description: 'Pedagogical and informative' },
      { id: 'humorous', label: 'Humorous', emoji: '😄', description: 'Light and entertaining' }
    ],
    es: [
      { id: 'professional', label: 'Profesional', emoji: '💼', description: 'Tono formal y estructurado' },
      { id: 'friendly', label: 'Amigable', emoji: '😊', description: 'Tono casual y accesible' },
      { id: 'inspiring', label: 'Inspirador', emoji: '✨', description: 'Motivador y alentador' },
      { id: 'narrative', label: 'Narrativo', emoji: '📖', description: 'Storytelling y relatos' },
      { id: 'promotional', label: 'Promocional', emoji: '🎯', description: 'Enfocado en ventas' },
      { id: 'educational', label: 'Educativo', emoji: '🎓', description: 'Pedagógico e informativo' },
      { id: 'humorous', label: 'Humorístico', emoji: '😄', description: 'Ligero y entretenido' }
    ]
  };

  const texts = {
    fr: {
      step1: {
        title: `Bienvenue, ${user?.name} !`,
        subtitle: 'Je suis AI Content Polisher, ton assistant IA personnel pour tous tes réseaux sociaux.',
        description: 'Je vais t\'aider à créer des posts parfaits qui t\'aideront à développer ton audience et à atteindre tes objectifs.',
        button: 'Commençons'
      },
      step2: {
        title: 'Comment nous as-tu trouvé ?',
        subtitle: 'Ensuite on parle de toi, promis 😉',
        otherPlaceholder: 'Précise comment tu nous as trouvé...'
      },
      step3: {
        title: 'Comment veux-tu que l\'IA écrive ?',
        subtitle: 'Choisis la méthode qui te correspond le mieux',
        options: {
          creator: {
            label: 'Style d\'un créateur',
            description: 'Copie le texte de 2-3 posts LinkedIn ou Instagram d\'un créateur que tu admires',
            placeholder: 'Colle ici le TEXTE de 2-3 posts LinkedIn ou Instagram (pas les URLs)...\n\nExemple:\n---\nPost 1:\nAujourd\'hui j\'ai appris quelque chose d\'important. Après 5 ans dans le marketing, je réalise que...\n---\nPost 2:\nLa clé du succès ? Ce n\'est pas le talent. C\'est la régularité...'
          },
          predefined: {
            label: 'Style prédéfini',
            description: 'Choisis parmi nos styles optimisés pour tous les réseaux'
          }
        }
      },
      step4: {
        title: 'Crée ton premier post !',
        subtitle: 'Teste l\'IA avec une idée simple',
        topicTitle: 'De quoi veux-tu parler ?',
        topicSubtitle: 'Décris ton sujet ou ton idée',
        placeholder: 'Ex: Je viens de terminer un projet important...\nOu: 3 conseils pour être plus productif...\nOu: Mon avis sur l\'intelligence artificielle...',
        generateHooksButton: 'Générer les hooks',
        generating: 'Génération en cours...',
        hooksTitle: 'Choisis ton hook',
        hooksSubtitle: 'Le hook est la première phrase qui capte l\'attention. Sélectionne ou modifie celui que tu préfères.',
        editHook: 'Modifier',
        saveHook: 'Enregistrer',
        cancelEdit: 'Annuler',
        generatePostsButton: 'Générer les posts',
        postsTitle: 'Tes posts sont prêts !',
        postsSubtitle: 'Voici 3 versions adaptées à chaque plateforme',
        finishButton: 'Finir le tutoriel et accéder à l\'application',
        copyButton: 'Copier',
        copied: 'Copié !',
        editButton: 'Modifier',
        favoriteButton: 'Favoris',
        words: 'mots',
        characters: 'caractères',
        regenerate: 'Régénérer',
        skipButton: 'Passer cette étape',
        continueButton: 'Continuer',
        emptyError: 'Entre une idée pour ton post',
        selectHookError: 'Sélectionne un hook pour continuer',
        examples: [
          'Je viens de terminer un projet qui m\'a appris beaucoup',
          '3 erreurs que je ne ferai plus jamais',
          'Pourquoi j\'ai décidé de changer de carrière'
        ],
        platforms: {
          linkedin: 'LinkedIn',
          instagram: 'Instagram',
          twitter: 'Twitter / X'
        },
        editModal: {
          title: 'Modifier le post',
          save: 'Enregistrer',
          cancel: 'Annuler'
        }
      },
      step5: {
        title: 'Dernière étape !',
        subtitle: 'Tes données sont importantes pour nous',
        consent: 'J\'accepte que mes préférences soient enregistrées pour améliorer mon expérience et personnaliser mes contenus.',
        privacy: 'En cochant cette case, tu acceptes notre',
        privacyLink: 'Politique de confidentialité',
        and: 'et nos',
        termsLink: 'Conditions d\'utilisation',
        note: 'Tes données sont stockées de manière sécurisée et ne seront jamais partagées avec des tiers.',
        button: 'Commencer à créer'
      },
      continue: 'Continuer',
      skip: 'Passer',
      back: 'Retour'
    },
    en: {
      step1: {
        title: `Welcome, ${user?.name}!`,
        subtitle: 'I\'m AI Content Polisher, your personal AI assistant for all your social networks.',
        description: 'I\'ll help you create perfect posts that will help you grow your audience and achieve your goals.',
        button: 'Let\'s start'
      },
      step2: {
        title: 'How did you find us?',
        subtitle: 'Then we\'ll talk about you, promise 😉',
        otherPlaceholder: 'Specify how you found us...'
      },
      step3: {
        title: 'How do you want the AI to write?',
        subtitle: 'Choose the method that suits you best',
        options: {
          creator: {
            label: 'Creator\'s style',
            description: 'Copy the text of 2-3 LinkedIn or Instagram posts from a creator you admire',
            placeholder: 'Paste the TEXT of 2-3 LinkedIn or Instagram posts here (not URLs)...\n\nExample:\n---\nPost 1:\nToday I learned something important. After 5 years in marketing, I realized that...\n---\nPost 2:\nThe key to success? It\'s not talent. It\'s consistency...'
          },
          predefined: {
            label: 'Predefined style',
            description: 'Choose from our styles optimized for all networks'
          }
        }
      },
      step4: {
        title: 'Create your first post!',
        subtitle: 'Test the AI with a simple idea',
        topicTitle: 'What do you want to talk about?',
        topicSubtitle: 'Describe your topic or idea',
        placeholder: 'Ex: I just finished an important project...\nOr: 3 tips to be more productive...\nOr: My thoughts on artificial intelligence...',
        generateHooksButton: 'Generate hooks',
        generating: 'Generating...',
        hooksTitle: 'Choose your hook',
        hooksSubtitle: 'The hook is the first sentence that grabs attention. Select or modify the one you prefer.',
        editHook: 'Edit',
        saveHook: 'Save',
        cancelEdit: 'Cancel',
        generatePostsButton: 'Generate posts',
        postsTitle: 'Your posts are ready!',
        postsSubtitle: 'Here are 3 versions adapted to each platform',
        finishButton: 'Finish tutorial and access the app',
        copyButton: 'Copy',
        copied: 'Copied!',
        editButton: 'Edit',
        favoriteButton: 'Favorite',
        words: 'words',
        characters: 'characters',
        regenerate: 'Regenerate',
        skipButton: 'Skip this step',
        continueButton: 'Continue',
        emptyError: 'Enter an idea for your post',
        selectHookError: 'Select a hook to continue',
        examples: [
          'I just finished a project that taught me a lot',
          '3 mistakes I will never make again',
          'Why I decided to change careers'
        ],
        platforms: {
          linkedin: 'LinkedIn',
          instagram: 'Instagram',
          twitter: 'Twitter / X'
        },
        editModal: {
          title: 'Edit post',
          save: 'Save',
          cancel: 'Cancel'
        }
      },
      step5: {
        title: 'Last step!',
        subtitle: 'Your data matters to us',
        consent: 'I agree to have my preferences saved to improve my experience and personalize my content.',
        privacy: 'By checking this box, you accept our',
        privacyLink: 'Privacy Policy',
        and: 'and our',
        termsLink: 'Terms of Service',
        note: 'Your data is stored securely and will never be shared with third parties.',
        button: 'Start creating'
      },
      continue: 'Continue',
      skip: 'Skip',
      back: 'Back'
    },
    es: {
      step1: {
        title: `¡Bienvenido, ${user?.name}!`,
        subtitle: 'Soy AI Content Polisher, tu asistente IA personal para todas tus redes sociales.',
        description: 'Te ayudaré a crear publicaciones perfectas que te ayudarán a hacer crecer tu audiencia y alcanzar tus objetivos.',
        button: 'Comencemos'
      },
      step2: {
        title: '¿Cómo nos encontraste?',
        subtitle: 'Luego hablamos de ti, lo prometo 😉',
        otherPlaceholder: 'Especifica cómo nos encontraste...'
      },
      step3: {
        title: '¿Cómo quieres que escriba la IA?',
        subtitle: 'Elige el método que mejor te convenga',
        options: {
          creator: {
            label: 'Estilo de un creador',
            description: 'Copia el texto de 2-3 publicaciones de LinkedIn o Instagram de un creador que admiras',
            placeholder: 'Pega aquí el TEXTO de 2-3 publicaciones de LinkedIn o Instagram (no las URLs)...\n\nEjemplo:\n---\nPost 1:\nHoy aprendí algo importante. Después de 5 años en marketing, me di cuenta de que...\n---\nPost 2:\n¿La clave del éxito? No es el talento. Es la constancia...'
          },
          predefined: {
            label: 'Estilo predefinido',
            description: 'Elige entre nuestros estilos optimizados para todas las redes'
          }
        }
      },
      step4: {
        title: '¡Crea tu primera publicación!',
        subtitle: 'Prueba la IA con una idea simple',
        topicTitle: '¿De qué quieres hablar?',
        topicSubtitle: 'Describe tu tema o idea',
        placeholder: 'Ej: Acabo de terminar un proyecto importante...\nO: 3 consejos para ser más productivo...\nO: Mi opinión sobre la inteligencia artificial...',
        generateHooksButton: 'Generar hooks',
        generating: 'Generando...',
        hooksTitle: 'Elige tu hook',
        hooksSubtitle: 'El hook es la primera frase que capta la atención. Selecciona o modifica el que prefieras.',
        editHook: 'Editar',
        saveHook: 'Guardar',
        cancelEdit: 'Cancelar',
        generatePostsButton: 'Generar posts',
        postsTitle: '¡Tus posts están listos!',
        postsSubtitle: 'Aquí tienes 3 versiones adaptadas a cada plataforma',
        finishButton: 'Terminar tutorial y acceder a la app',
        copyButton: 'Copiar',
        copied: '¡Copiado!',
        editButton: 'Editar',
        favoriteButton: 'Favorito',
        words: 'palabras',
        characters: 'caracteres',
        regenerate: 'Regenerar',
        skipButton: 'Omitir este paso',
        continueButton: 'Continuar',
        emptyError: 'Ingresa una idea para tu post',
        selectHookError: 'Selecciona un hook para continuar',
        examples: [
          'Acabo de terminar un proyecto que me enseñó mucho',
          '3 errores que nunca volveré a cometer',
          'Por qué decidí cambiar de carrera'
        ],
        platforms: {
          linkedin: 'LinkedIn',
          instagram: 'Instagram',
          twitter: 'Twitter / X'
        },
        editModal: {
          title: 'Editar post',
          save: 'Guardar',
          cancel: 'Cancelar'
        }
      },
      step5: {
        title: '¡Último paso!',
        subtitle: 'Tus datos son importantes para nosotros',
        consent: 'Acepto que mis preferencias se guarden para mejorar mi experiencia y personalizar mis contenidos.',
        privacy: 'Al marcar esta casilla, aceptas nuestra',
        privacyLink: 'Política de privacidad',
        and: 'y nuestros',
        termsLink: 'Términos de servicio',
        note: 'Tus datos se almacenan de forma segura y nunca se compartirán con terceros.',
        button: 'Comenzar a crear'
      },
      continue: 'Continuar',
      skip: 'Omitir',
      back: 'Atrás'
    }
  };

  const t = texts[language] || texts.fr;

  // Utility functions
  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const countCharacters = (text) => {
    if (!text) return 0;
    return text.length;
  };

  const handleDiscoverySourceSelect = (sourceId) => {
    setOnboardingData({ ...onboardingData, discoverySource: sourceId });
  };

  const handleStyleOptionSelect = (option) => {
    setOnboardingData({
      ...onboardingData,
      styleOption: option,
      creatorPosts: option === 'creator' ? onboardingData.creatorPosts : '',
      preferredStyle: option === 'predefined' ? onboardingData.preferredStyle : ''
    });
  };

  const handleCreatorPostsChange = (posts) => {
    setOnboardingData({ ...onboardingData, creatorPosts: posts });
  };

  const handleStyleSelect = (styleId) => {
    setOnboardingData({ ...onboardingData, preferredStyle: styleId });
  };

  // Step 4: Generate hooks
  const handleGenerateHooks = async () => {
    if (!firstPostText.trim()) {
      toast.error(t.step4.emptyError);
      return;
    }

    setGeneratingHooks(true);
    setHooks([]);
    setSelectedHookIndex(null);

    try {
      const toneToUse = onboardingData.preferredStyle || 'professional';

      // Generate 3 different hooks based on the topic
      const hookPrompts = [
        `Génère UN SEUL hook accrocheur (première phrase) pour un post sur: "${firstPostText}". Style: question provocante. Réponds UNIQUEMENT avec le hook, rien d'autre.`,
        `Génère UN SEUL hook accrocheur (première phrase) pour un post sur: "${firstPostText}". Style: statistique ou fait surprenant. Réponds UNIQUEMENT avec le hook, rien d'autre.`,
        `Génère UN SEUL hook accrocheur (première phrase) pour un post sur: "${firstPostText}". Style: histoire personnelle. Réponds UNIQUEMENT avec le hook, rien d'autre.`
      ];

      const generatedHooks = [];

      for (const prompt of hookPrompts) {
        try {
          const response = await polishContent(prompt, toneToUse, language);
          const content = response.data.formats?.[0]?.content || response.data.content;
          if (content) {
            // Extract just the first sentence/hook
            const hook = content.split('\n')[0].trim();
            generatedHooks.push(hook);
          }
        } catch (err) {
          console.error('Error generating hook:', err);
        }
      }

      if (generatedHooks.length === 0) {
        // Fallback hooks if API fails
        generatedHooks.push(
          language === 'fr' ? `Et si je vous disais que ${firstPostText.toLowerCase()} a changé ma vie ?` :
          language === 'es' ? `¿Y si les dijera que ${firstPostText.toLowerCase()} cambió mi vida?` :
          `What if I told you that ${firstPostText.toLowerCase()} changed my life?`,

          language === 'fr' ? `90% des gens ignorent cette vérité sur ${firstPostText.toLowerCase()}.` :
          language === 'es' ? `El 90% de las personas ignora esta verdad sobre ${firstPostText.toLowerCase()}.` :
          `90% of people ignore this truth about ${firstPostText.toLowerCase()}.`,

          language === 'fr' ? `Il y a 3 ans, je ne savais rien sur ${firstPostText.toLowerCase()}. Aujourd'hui...` :
          language === 'es' ? `Hace 3 años, no sabía nada sobre ${firstPostText.toLowerCase()}. Hoy...` :
          `3 years ago, I knew nothing about ${firstPostText.toLowerCase()}. Today...`
        );
      }

      setHooks(generatedHooks);
      setPostCreationStep('hooks');
    } catch (error) {
      console.error('Error generating hooks:', error);
      toast.error(language === 'fr' ? 'Erreur lors de la génération des hooks' : language === 'en' ? 'Error generating hooks' : 'Error al generar los hooks');
    } finally {
      setGeneratingHooks(false);
    }
  };

  // Update hook
  const handleUpdateHook = (index, newValue) => {
    const newHooks = [...hooks];
    newHooks[index] = newValue;
    setHooks(newHooks);
    setEditingHookIndex(null);
  };

  // Generate posts for all platforms
  const handleGeneratePosts = async () => {
    if (selectedHookIndex === null) {
      toast.error(t.step4.selectHookError);
      return;
    }

    setGeneratingPosts(true);
    setGeneratedPosts({ linkedin: null, instagram: null, twitter: null });

    const selectedHook = hooks[selectedHookIndex];
    const toneToUse = onboardingData.preferredStyle || 'professional';

    try {
      // Generate LinkedIn post
      const linkedinPrompt = `Crée un post LinkedIn professionnel complet basé sur ce hook: "${selectedHook}" et ce sujet: "${firstPostText}". Le post doit être engageant, avec des sauts de ligne, et faire environ 150-200 mots. N'inclus PAS de hashtags.`;

      // Generate Instagram post
      const instagramPrompt = `Crée un post Instagram engageant basé sur ce hook: "${selectedHook}" et ce sujet: "${firstPostText}". Le post doit être plus court et visuellement structuré avec des emojis. Inclus 5-10 hashtags pertinents à la fin.`;

      // Generate Twitter post
      const twitterPrompt = `Crée un tweet percutant de maximum 280 caractères basé sur ce hook: "${selectedHook}" et ce sujet: "${firstPostText}". Sois concis et impactant.`;

      const [linkedinRes, instagramRes, twitterRes] = await Promise.all([
        polishContent(linkedinPrompt, toneToUse, language).catch(() => null),
        polishContent(instagramPrompt, toneToUse, language).catch(() => null),
        polishContent(twitterPrompt, toneToUse, language).catch(() => null)
      ]);

      setGeneratedPosts({
        linkedin: linkedinRes?.data?.formats?.[0]?.content || linkedinRes?.data?.content || `${selectedHook}\n\n${firstPostText}`,
        instagram: instagramRes?.data?.formats?.[0]?.content || instagramRes?.data?.content || `${selectedHook}\n\n${firstPostText}\n\n#content #social`,
        twitter: twitterRes?.data?.formats?.[0]?.content || twitterRes?.data?.content || selectedHook.substring(0, 280)
      });

      setPostCreationStep('posts');
    } catch (error) {
      console.error('Error generating posts:', error);
      toast.error(language === 'fr' ? 'Erreur lors de la génération des posts' : language === 'en' ? 'Error generating posts' : 'Error al generar los posts');
    } finally {
      setGeneratingPosts(false);
    }
  };

  // Copy post content
  const handleCopyPost = (platform) => {
    const content = generatedPosts[platform];
    if (content) {
      navigator.clipboard.writeText(content);
      setCopiedPost(platform);
      toast.success(t.step4.copied);
      setTimeout(() => setCopiedPost(null), 2000);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (platform) => {
    setFavorites(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  // Open edit modal
  const handleOpenEditModal = (platform) => {
    setEditingPlatform(platform);
    setEditingContent(generatedPosts[platform]);
    setEditModalOpen(true);
  };

  // Save edited post
  const handleSaveEdit = () => {
    setGeneratedPosts(prev => ({
      ...prev,
      [editingPlatform]: editingContent
    }));
    setEditModalOpen(false);
    setEditingPlatform(null);
    setEditingContent('');
  };

  const handleUseExample = (example) => {
    setFirstPostText(example);
  };

  const handleNext = () => {
    // Validation
    if (step === 2 && !onboardingData.discoverySource) {
      toast.error(language === 'fr' ? 'Merci de sélectionner une option' : language === 'en' ? 'Please select an option' : 'Por favor selecciona una opción');
      return;
    }
    if (step === 2 && onboardingData.discoverySource === 'other' && !onboardingData.discoverySourceOther.trim()) {
      toast.error(language === 'fr' ? 'Merci de préciser comment tu nous as trouvé' : language === 'en' ? 'Please specify how you found us' : 'Por favor especifica cómo nos encontraste');
      return;
    }
    if (step === 3) {
      if (!onboardingData.styleOption) {
        toast.error(language === 'fr' ? 'Choisis une option de style' : language === 'en' ? 'Choose a style option' : 'Elige una opción de estilo');
        return;
      }
      if (onboardingData.styleOption === 'creator' && !onboardingData.creatorPosts.trim()) {
        toast.error(language === 'fr' ? 'Colle au moins un post du créateur' : language === 'en' ? 'Paste at least one creator post' : 'Pega al menos una publicación del creador');
        return;
      }
      if (onboardingData.styleOption === 'predefined' && !onboardingData.preferredStyle) {
        toast.error(language === 'fr' ? 'Choisis un style prédéfini' : language === 'en' ? 'Choose a predefined style' : 'Elige un estilo predefinido');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 4) {
      // Handle sub-steps in step 4
      if (postCreationStep === 'hooks') {
        setPostCreationStep('topic');
        return;
      } else if (postCreationStep === 'posts') {
        setPostCreationStep('hooks');
        return;
      }
    }
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkipStep4 = () => {
    setStep(5);
    setPostCreationStep('topic');
    setFirstPostText('');
    setHooks([]);
    setSelectedHookIndex(null);
    setGeneratedPosts({ linkedin: null, instagram: null, twitter: null });
  };

  const handleFinishFromPosts = async () => {
    // Go directly to finish/consent step
    setStep(5);
  };

  const handleFinish = async () => {
    if (!onboardingData.consentDataStorage) {
      toast.error(language === 'fr' ? 'Tu dois accepter la politique de confidentialité pour continuer' : language === 'en' ? 'You must accept the privacy policy to continue' : 'Debes aceptar la política de privacidad para continuar');
      return;
    }

    setLoading(true);

    try {
      await saveOnboardingData({
        discovery_source: onboardingData.discoverySource === 'other' ? onboardingData.discoverySourceOther : onboardingData.discoverySource,
        style_option: onboardingData.styleOption,
        creator_posts: onboardingData.creatorPosts,
        preferred_style: onboardingData.preferredStyle,
        consent_data_storage: onboardingData.consentDataStorage
      });

      toast.success(language === 'fr' ? 'Configuration terminée ! Bienvenue 🎉' : language === 'en' ? 'Setup complete! Welcome 🎉' : '¡Configuración completa! Bienvenido 🎉');

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.error(language === 'fr' ? 'Erreur lors de la sauvegarde' : language === 'en' ? 'Error saving data' : 'Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Platform icon component
  const PlatformIcon = ({ platform, className }) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className={className} />;
      case 'instagram':
        return <Instagram className={className} />;
      case 'twitter':
        return <Twitter className={className} />;
      default:
        return null;
    }
  };

  // Post card component
  const PostCard = ({ platform, content }) => {
    const platformColors = {
      linkedin: 'from-blue-500 to-blue-600',
      instagram: 'from-pink-500 via-purple-500 to-orange-500',
      twitter: 'from-sky-400 to-sky-500'
    };

    const platformBgColors = {
      linkedin: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      instagram: 'from-pink-50 via-purple-50 to-orange-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-orange-900/20',
      twitter: 'from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20'
    };

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${platformColors[platform]} px-4 py-3 flex items-center gap-2`}>
          <PlatformIcon platform={platform} className="h-5 w-5 text-white" />
          <span className="font-semibold text-white">{t.step4.platforms[platform]}</span>
        </div>

        {/* Content */}
        <div className={`bg-gradient-to-br ${platformBgColors[platform]} p-4`}>
          <p className="text-gray-800 dark:text-slate-200 whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </p>
        </div>

        {/* Stats */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
            <span>{countWords(content)} {t.step4.words}</span>
            <span>•</span>
            <span>{countCharacters(content)} {t.step4.characters}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 flex flex-wrap gap-2 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={() => handleToggleFavorite(platform)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              favorites[platform]
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${favorites[platform] ? 'fill-current' : ''}`} />
            {t.step4.favoriteButton}
          </button>

          <button
            onClick={() => handleCopyPost(platform)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
          >
            {copiedPost === platform ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedPost === platform ? t.step4.copied : t.step4.copyButton}
          </button>

          <button
            onClick={() => handleOpenEditModal(platform)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
          >
            <Edit3 className="h-3.5 w-3.5" />
            {t.step4.editButton}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl w-full mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 mx-1 rounded-full transition-all ${
                  i + 1 <= step ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-slate-400">
            {language === 'fr' ? 'Étape' : language === 'en' ? 'Step' : 'Paso'} {step} / {totalSteps}
          </p>
        </div>

        {/* Content card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-6 rounded-full">
                  <Sparkles className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t.step1.title}
              </h1>
              <p className="text-xl text-gray-700 dark:text-slate-300 mb-4">
                {t.step1.subtitle}
              </p>
              <p className="text-gray-600 dark:text-slate-400 mb-8">
                {t.step1.description}
              </p>
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                {t.step1.button}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Step 2: Discovery source */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t.step2.title}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-8 text-center">
                {t.step2.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {discoverySources[language].map((source) => (
                  <button
                    key={source.id}
                    onClick={() => handleDiscoverySourceSelect(source.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      onboardingData.discoverySource === source.id
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">{source.label}</span>
                      {onboardingData.discoverySource === source.id && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {onboardingData.discoverySource === 'other' && (
                <input
                  type="text"
                  value={onboardingData.discoverySourceOther}
                  onChange={(e) => setOnboardingData({ ...onboardingData, discoverySourceOther: e.target.value })}
                  placeholder={t.step2.otherPlaceholder}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
                />
              )}

              <div className="flex gap-3 justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2"
                >
                  {t.continue}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Writing style method */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t.step3.title}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-8 text-center">
                {t.step3.subtitle}
              </p>

              {/* Style option selection */}
              <div className="space-y-4 mb-6">
                {/* Option 1: Creator style */}
                <div>
                  <button
                    onClick={() => handleStyleOptionSelect('creator')}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      onboardingData.styleOption === 'creator'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{t.step3.options.creator.label}</span>
                      </div>
                      {onboardingData.styleOption === 'creator' && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{t.step3.options.creator.description}</p>
                  </button>
                  {onboardingData.styleOption === 'creator' && (
                    <textarea
                      value={onboardingData.creatorPosts}
                      onChange={(e) => handleCreatorPostsChange(e.target.value)}
                      placeholder={t.step3.options.creator.placeholder}
                      rows={6}
                      className="w-full mt-3 px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  )}
                </div>

                {/* Option 2: Predefined style */}
                <button
                  onClick={() => handleStyleOptionSelect('predefined')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    onboardingData.styleOption === 'predefined'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📝</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{t.step3.options.predefined.label}</span>
                    </div>
                    {onboardingData.styleOption === 'predefined' && (
                      <Check className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{t.step3.options.predefined.description}</p>
                </button>
              </div>

              {/* Show style selection for predefined option */}
              {onboardingData.styleOption === 'predefined' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                    {language === 'fr' ? 'Choisis ton style' : language === 'en' ? 'Choose your style' : 'Elige tu estilo'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {writingStyles[language].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => handleStyleSelect(style.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          onboardingData.preferredStyle === style.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{style.emoji}</span>
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{style.label}</span>
                          {onboardingData.preferredStyle === style.id && (
                            <Check className="h-4 w-4 text-purple-600 ml-auto" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-slate-400">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2"
                >
                  {t.continue}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Create first post - Topic */}
          {step === 4 && postCreationStep === 'topic' && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t.step4.title}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-2 text-center">
                {t.step4.subtitle}
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {t.step4.topicTitle}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                  {t.step4.topicSubtitle}
                </p>

                {/* Examples chips */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 dark:text-slate-500 mb-2">
                    {language === 'fr' ? 'Exemples d\'idées :' : language === 'en' ? 'Example ideas:' : 'Ideas de ejemplo:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {t.step4.examples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => handleUseExample(example)}
                        className="text-xs px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                      >
                        {example.length > 40 ? example.substring(0, 40) + '...' : example}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text input */}
                <textarea
                  value={firstPostText}
                  onChange={(e) => setFirstPostText(e.target.value)}
                  placeholder={t.step4.placeholder}
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none mb-4"
                />

                {/* Generate hooks button */}
                <button
                  onClick={handleGenerateHooks}
                  disabled={generatingHooks || !firstPostText.trim()}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingHooks ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      {t.step4.generating}
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5" />
                      {t.step4.generateHooksButton}
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-3 justify-between mt-6">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleSkipStep4}
                  className="px-6 py-3 text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 font-medium transition-all"
                >
                  {t.step4.skipButton}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Create first post - Hooks selection */}
          {step === 4 && postCreationStep === 'hooks' && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t.step4.hooksTitle}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-6 text-center">
                {t.step4.hooksSubtitle}
              </p>

              {/* Hooks list */}
              <div className="space-y-4 mb-6">
                {hooks.map((hook, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedHookIndex === index
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    {editingHookIndex === index ? (
                      <div className="space-y-3">
                        <textarea
                          value={hook}
                          onChange={(e) => {
                            const newHooks = [...hooks];
                            newHooks[index] = e.target.value;
                            setHooks(newHooks);
                          }}
                          rows={3}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateHook(index, hook)}
                            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors"
                          >
                            {t.step4.saveHook}
                          </button>
                          <button
                            onClick={() => setEditingHookIndex(null)}
                            className="px-3 py-1.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                          >
                            {t.step4.cancelEdit}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => setSelectedHookIndex(index)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                              selectedHookIndex === index
                                ? 'border-purple-600 bg-purple-600'
                                : 'border-gray-300 dark:border-slate-600'
                            }`}>
                              {selectedHookIndex === index && (
                                <Check className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <p className="text-gray-800 dark:text-slate-200 text-sm leading-relaxed">
                              {hook}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingHookIndex(index);
                            }}
                            className="px-2 py-1 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded transition-colors flex-shrink-0"
                          >
                            {t.step4.editHook}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Generate posts button */}
              <button
                onClick={handleGeneratePosts}
                disabled={generatingPosts || selectedHookIndex === null}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {generatingPosts ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    {t.step4.generating}
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    {t.step4.generatePostsButton}
                  </>
                )}
              </button>

              <div className="flex gap-3 justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleSkipStep4}
                  className="px-6 py-3 text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 font-medium transition-all"
                >
                  {t.step4.skipButton}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Create first post - Generated posts */}
          {step === 4 && postCreationStep === 'posts' && (
            <div>
              {/* Finish button at top */}
              <div className="mb-6">
                <button
                  onClick={handleFinishFromPosts}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Check className="h-6 w-6" />
                  {t.step4.finishButton}
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t.step4.postsTitle}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-6 text-center">
                {t.step4.postsSubtitle}
              </p>

              {/* Posts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {generatedPosts.linkedin && (
                  <PostCard platform="linkedin" content={generatedPosts.linkedin} />
                )}
                {generatedPosts.instagram && (
                  <PostCard platform="instagram" content={generatedPosts.instagram} />
                )}
                {generatedPosts.twitter && (
                  <PostCard platform="twitter" content={generatedPosts.twitter} />
                )}
              </div>

              <div className="flex gap-3 justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleGeneratePosts}
                  disabled={generatingPosts}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${generatingPosts ? 'animate-spin' : ''}`} />
                  {t.step4.regenerate}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Consent */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t.step5.title}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-8 text-center">
                {t.step5.subtitle}
              </p>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onboardingData.consentDataStorage}
                    onChange={(e) => setOnboardingData({ ...onboardingData, consentDataStorage: e.target.checked })}
                    className="mt-1 h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium mb-3">
                      {t.step5.consent}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {t.step5.privacy}{' '}
                      <a href="/privacy" target="_blank" className="text-purple-600 hover:underline font-semibold">
                        {t.step5.privacyLink}
                      </a>{' '}
                      {t.step5.and}{' '}
                      <a href="/terms" target="_blank" className="text-purple-600 hover:underline font-semibold">
                        {t.step5.termsLink}
                      </a>.
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  🔒 {t.step5.note}
                </p>
              </div>

              <div className="flex gap-3 justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleFinish}
                  disabled={loading || !onboardingData.consentDataStorage}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {language === 'fr' ? 'Enregistrement...' : language === 'en' ? 'Saving...' : 'Guardando...'}
                    </>
                  ) : (
                    <>
                      {t.step5.button}
                      <Check className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer logo */}
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-slate-500 text-sm flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Content Polisher
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <PlatformIcon platform={editingPlatform} className="h-5 w-5 text-gray-600 dark:text-slate-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t.step4.editModal.title} - {t.step4.platforms[editingPlatform]}
                </h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6">
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />

              {/* Stats */}
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-slate-400">
                <span>{countWords(editingContent)} {t.step4.words}</span>
                <span>•</span>
                <span>{countCharacters(editingContent)} {t.step4.characters}</span>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
              >
                {t.step4.editModal.cancel}
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {t.step4.editModal.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Onboarding;
