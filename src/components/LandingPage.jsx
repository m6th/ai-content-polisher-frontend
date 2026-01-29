import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';
import {
  Sparkles, Zap, Target, ArrowRight, Check,
  FileText, Mail, Video, Linkedin, Instagram,
  Twitter, BookOpen, Megaphone, GraduationCap,
  Smile, Drama, Facebook, Image, Send, ChevronDown, UserPlus, Rocket
} from 'lucide-react';
import { useState, useEffect } from 'react';

function LandingPage() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [scrollY, setScrollY] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqContent = {
    fr: {
      title: "Questions Fréquentes",
      questions: [
        {
          q: "Comment fonctionne AI Content Polisher concrètement ?",
          a: "Le processus est simple et rapide en 3 étapes : 1) Vous entrez votre idée, texte brut ou contenu existant à reformuler dans notre éditeur. 2) Vous choisissez parmi nos 4 tons optimisés (professionnel, storytelling, engageant, éducatif) et vous sélectionnez les plateformes cibles parmi les 6 disponibles (LinkedIn, Instagram, TikTok, Twitter, Email, Publicité). Bientôt, vous pourrez également créer vos propres styles personnalisés basés sur vos contenus existants. 3) Notre IA génère les versions optimisées uniquement pour les plateformes que vous avez sélectionnées, respectant les bonnes pratiques de chacune : longueur idéale, hashtags pertinents, emojis adaptés, hooks percutants et structures qui maximisent l'engagement. Vous pouvez ensuite éditer, régénérer ou copier directement le contenu."
        },
        {
          q: "Quelle est la différence avec ChatGPT ou d'autres IA génériques ?",
          a: "La différence est majeure. ChatGPT est un assistant généraliste qui produit du texte correct mais générique, sans connaissance des spécificités de chaque réseau social. AI Content Polisher est un outil spécialisé dans le contenu social et marketing, développé par des experts en growth et création de contenu. Notre IA intègre : les algorithmes de chaque plateforme (ce que LinkedIn favorise vs Instagram), les formats qui génèrent le plus d'engagement (carrousels, listes, storytelling...), les hooks et structures psychologiques éprouvés, les bonnes pratiques de longueur, hashtags et emojis par plateforme. Résultat : vous obtenez du contenu prêt à publier qui performe, pas juste du texte à retravailler pendant 30 minutes."
        },
        {
          q: "Mon contenu sera-t-il détecté comme généré par IA ?",
          a: "Non, et c'est l'un de nos points forts. Notre IA est spécifiquement entraînée pour produire du contenu naturel, fluide et humain, loin du style 'robotique' des IA génériques. De plus, plusieurs éléments garantissent l'authenticité : chaque génération peut être facilement éditée pour ajouter vos touches personnelles, et nous varions automatiquement les structures et formulations pour éviter les patterns répétitifs. Prochainement, vous pourrez créer des styles personnalisés basés sur vos propres contenus pour reproduire votre voix unique. Les plateformes comme LinkedIn ne pénalisent pas le contenu assisté par IA, tant qu'il apporte de la valeur - et c'est exactement ce que nous produisons."
        },
        {
          q: "Est-ce que ça fonctionne vraiment pour augmenter l'engagement ?",
          a: "Oui, et les résultats sont mesurables. Notre IA intègre les meilleures pratiques validées par des millions de posts analysés : des hooks qui captent l'attention dans les 2 premières secondes (crucial pour les algorithmes), des structures narratives qui maintiennent le lecteur jusqu'au bout, des call-to-action optimisés qui génèrent des commentaires et partages, le bon ratio texte/emojis/hashtags par plateforme. Nos utilisateurs constatent en moyenne 2 à 3x plus d'engagement (likes, commentaires, partages) après quelques semaines d'utilisation régulière. Certains créateurs ont même vu leur audience LinkedIn doubler en 2-3 mois grâce à une publication plus régulière et mieux optimisée."
        },
        {
          q: "Un crédit = combien de contenus générés ?",
          a: "C'est là que notre système est particulièrement avantageux. Un crédit vous permet de transformer UNE idée en contenus optimisés pour les plateformes de votre choix (LinkedIn, Instagram, TikTok, Twitter, Email, Publicité). Vous sélectionnez les plateformes qui vous intéressent et l'IA génère uniquement ces formats - 1 crédit par génération, quel que soit le nombre de formats choisis. Besoin uniquement de LinkedIn et Instagram ? Sélectionnez-les et obtenez 2 contenus parfaitement optimisés. Vous voulez les 6 ? C'est toujours 1 crédit. Avec le plan Starter à 7,99€/mois (40 crédits), vous pouvez générer jusqu'à 240 contenus optimisés par mois. C'est un rapport qualité/prix imbattable comparé aux agences ou au temps passé à tout créer manuellement."
        },
        {
          q: "Quels sont les différents plans et leurs avantages ?",
          a: "Nous proposons 4 plans adaptés à tous les besoins : GRATUIT - 3 crédits/mois, 5 formats disponibles, idéal pour tester l'outil. STARTER (7,99€/mois) - 40 crédits/mois, tous les formats et tons, parfait pour les créateurs individuels qui publient régulièrement. PRO (17,99€/mois) - 150 crédits/mois, analytics détaillés, calendrier éditorial, idéal pour les créateurs sérieux et freelances. BUSINESS (44,99€/mois) - 500 crédits/mois, gestion d'équipe, accès API, support prioritaire, parfait pour les agences et entreprises. Tous les plans payants ont accès à tous les formats et tous les tons. La différence principale est le volume de crédits et les fonctionnalités avancées (analytics, équipe, API)."
        },
        {
          q: "Puis-je annuler mon abonnement à tout moment ?",
          a: "Absolument, sans aucune contrainte. Nous croyons en notre produit et ne voulons pas vous retenir artificiellement. Voici comment ça fonctionne : vous pouvez annuler en 2 clics depuis votre espace compte, à tout moment. Aucun frais d'annulation, aucune pénalité, aucune question embarrassante. Votre accès premium reste actif jusqu'à la fin de votre période de facturation en cours (vous avez payé pour, vous en profitez). Après cette date, vous repassez automatiquement au plan gratuit avec 3 crédits mensuels - vous ne perdez pas votre compte ni votre historique. Si vous changez d'avis, vous pouvez vous réabonner à tout moment."
        },
        {
          q: "Mes données et contenus sont-ils sécurisés ?",
          a: "La sécurité est notre priorité absolue. Voici nos garanties : Chiffrement SSL/TLS pour toutes les communications entre votre navigateur et nos serveurs. Paiements gérés par Stripe, leader mondial certifié PCI-DSS niveau 1 - nous ne voyons et ne stockons jamais vos coordonnées bancaires. Vos contenus ne sont jamais utilisés pour entraîner notre IA ou partagés avec des tiers. Hébergement sur des serveurs européens conformes au RGPD. Vous restez propriétaire à 100% de tous les contenus que vous générez. Possibilité de supprimer votre compte et toutes vos données à tout moment depuis les paramètres."
        }
      ]
    },
    en: {
      title: "Frequently Asked Questions",
      questions: [
        {
          q: "How does AI Content Polisher actually work?",
          a: "The process is simple and fast in 3 steps: 1) You enter your idea, raw text, or existing content to rephrase in our editor. 2) You choose from our 4 optimized tones (professional, storytelling, engaging, educational) and select your target platforms from the 6 available (LinkedIn, Instagram, TikTok, Twitter, Email, Ads). Soon, you'll also be able to create your own custom styles based on your existing content. 3) Our AI generates optimized versions only for the platforms you've selected, following each platform's best practices: ideal length, relevant hashtags, appropriate emojis, compelling hooks, and structures that maximize engagement. You can then edit, regenerate, or directly copy the content."
        },
        {
          q: "What's the difference with ChatGPT or other generic AI?",
          a: "The difference is major. ChatGPT is a generalist assistant that produces correct but generic text, without knowledge of each social network's specifics. AI Content Polisher is a tool specialized in social and marketing content, developed by growth and content creation experts. Our AI integrates: each platform's algorithms (what LinkedIn favors vs Instagram), formats that generate the most engagement (carousels, lists, storytelling...), proven psychological hooks and structures, best practices for length, hashtags, and emojis per platform. Result: you get ready-to-publish content that performs, not just text to rework for 30 minutes."
        },
        {
          q: "Will my content be detected as AI-generated?",
          a: "No, and this is one of our strengths. Our AI is specifically trained to produce natural, fluid, and human content, far from the 'robotic' style of generic AI. Additionally, several elements guarantee authenticity: each generation can be easily edited to add your personal touches, and we automatically vary structures and phrasings to avoid repetitive patterns. Coming soon, you'll be able to create custom styles based on your own content to reproduce your unique voice. Platforms like LinkedIn don't penalize AI-assisted content, as long as it provides value - and that's exactly what we produce."
        },
        {
          q: "Does it really work to increase engagement?",
          a: "Yes, and the results are measurable. Our AI integrates best practices validated by millions of analyzed posts: hooks that capture attention in the first 2 seconds (crucial for algorithms), narrative structures that keep readers engaged until the end, optimized call-to-actions that generate comments and shares, the right text/emoji/hashtag ratio per platform. Our users see on average 2-3x more engagement (likes, comments, shares) after a few weeks of regular use. Some creators have even seen their LinkedIn audience double in 2-3 months thanks to more regular and better-optimized publishing."
        },
        {
          q: "One credit = how many generated contents?",
          a: "This is where our system is particularly advantageous. One credit allows you to transform ONE idea into optimized content for the platforms of your choice (LinkedIn, Instagram, TikTok, Twitter, Email, Ads). You select the platforms you want and the AI generates only those formats - 1 credit per generation, regardless of how many formats you choose. Only need LinkedIn and Instagram? Select them and get 2 perfectly optimized contents. Want all 6? Still just 1 credit. With the Starter plan at €7.99/month (40 credits), you can generate up to 240 optimized contents per month. That's unbeatable value compared to agencies or the time spent creating everything manually."
        },
        {
          q: "What are the different plans and their benefits?",
          a: "We offer 4 plans suited to all needs: FREE - 3 credits/month, 5 available formats, ideal for testing the tool. STARTER (€7.99/month) - 40 credits/month, all formats and tones, perfect for individual creators who publish regularly. PRO (€17.99/month) - 150 credits/month, detailed analytics, editorial calendar, ideal for serious creators and freelancers. BUSINESS (€44.99/month) - 500 credits/month, team management, API access, priority support, perfect for agencies and businesses. All paid plans have access to all formats and all tones. The main difference is credit volume and advanced features (analytics, team, API)."
        },
        {
          q: "Can I cancel my subscription at any time?",
          a: "Absolutely, without any constraints. We believe in our product and don't want to artificially retain you. Here's how it works: you can cancel in 2 clicks from your account space, at any time. No cancellation fees, no penalties, no awkward questions. Your premium access stays active until the end of your current billing period (you paid for it, you enjoy it). After that date, you automatically return to the free plan with 3 monthly credits - you don't lose your account or your history. If you change your mind, you can resubscribe at any time."
        },
        {
          q: "Are my data and content secure?",
          a: "Security is our absolute priority. Here are our guarantees: SSL/TLS encryption for all communications between your browser and our servers. Payments handled by Stripe, the global leader certified PCI-DSS Level 1 - we never see or store your bank details. Your content is never used to train our AI or shared with third parties. Hosting on European servers compliant with GDPR. You remain 100% owner of all content you generate. Ability to delete your account and all your data at any time from settings."
        }
      ]
    }
  };

  const faq = faqContent[language] || faqContent.fr;

  const formats = [
    {
      name: 'LinkedIn Post',
      icon: Linkedin,
      color: 'bg-blue-600',
      desc: t.landing.formats.linkedin
    },
    {
      name: 'Instagram Caption',
      icon: Instagram,
      color: 'bg-gradient-to-br from-purple-600 to-pink-600',
      desc: t.landing.formats.instagram
    },
    {
      name: 'Script TikTok',
      icon: Video,
      color: 'bg-black',
      desc: t.landing.formats.tiktok
    },
    {
      name: 'Tweet / Thread',
      icon: Twitter,
      color: 'bg-sky-500',
      desc: t.landing.formats.twitter
    },
    {
      name: 'Email Pro',
      icon: Mail,
      color: 'bg-orange-500',
      desc: t.landing.formats.email
    },
    {
      name: 'Publicité',
      icon: Megaphone,
      color: 'bg-orange-600',
      desc: t.landing.formats.copywriting
    }
  ];

  const features = [
    {
      icon: Zap,
      title: t.landing.features.feature1Title,
      description: t.landing.features.feature1Desc,
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Target,
      title: t.landing.features.feature2Title,
      description: t.landing.features.feature2Desc,
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Sparkles,
      title: t.landing.features.feature3Title,
      description: t.landing.features.feature3Desc,
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: t.landing.features.feature4Title,
      description: t.landing.features.feature4Desc,
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full opacity-20 blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div
            className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg border border-purple-100 dark:border-purple-900">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                ⏱️ {t.landing.hero.badge}
              </span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4 sm:mb-6">
                <span className="text-slate-900 dark:text-white">{t.landing.hero.title1}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600">
                  {t.landing.hero.title2}
                </span>
                <br />
                <span className="text-slate-900 dark:text-white">{t.landing.hero.title3}</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.landing.hero.subtitle}
                <span className="font-semibold text-slate-900 dark:text-white">{t.landing.hero.subtitleBold}</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                <span className="relative z-10 flex items-center">
                  {t.landing.hero.cta}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0" />
                </span>
              </Link>
              <Link
                to="/join-team"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl hover:border-green-500 dark:hover:border-green-500 transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                <span className="relative z-10 flex items-center">
                  <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Rejoindre une équipe
                </span>
              </Link>
            </div>

            {/* Coming Soon Button */}
            <div className="pt-2">
              <Link
                to="/coming-soon"
                className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <Rocket className="h-4 w-4" />
                <span>{language === 'fr' ? 'Voir les fonctionnalités à venir' : language === 'es' ? 'Ver las próximas funciones' : 'See upcoming features'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Content - Preview Card */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">AI Content Polisher</div>
                    <div className="text-sm text-slate-500">{t.polisher.generating}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-3 bg-slate-200 rounded-full" style={{ width: `${100 - i * 10}%` }} />
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex gap-2">
                    {/* LinkedIn */}
                    <div className="w-8 h-8 bg-[#0A66C2] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>

                    {/* Instagram */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'}}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>

                    {/* TikTok */}
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </div>

                    {/* X (Twitter) */}
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>

                    {/* YouTube */}
                    <div className="w-8 h-8 bg-[#FF0000] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">✓ {t.landing.stats.formats}</div>
                </div>
              </div>

              {/* Floating Stat */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 border border-slate-200 dark:border-slate-700 animate-bounce">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  +340%
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Engagement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {t.landing.stats.formats}
              </div>
              <div className="text-slate-600 dark:text-slate-400 font-medium">{t.landing.stats.formatsDesc}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                {t.landing.stats.languages}
              </div>
              <div className="text-slate-600 dark:text-slate-400 font-medium">{t.landing.stats.languagesDesc}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                {t.landing.stats.speed}
              </div>
              <div className="text-slate-600 dark:text-slate-400 font-medium">{t.landing.stats.speedDesc}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Formats Grid - "Tous tes réseaux" */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              {t.landing.formats.title}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              {t.landing.formats.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formats.map((format, idx) => (
              <div
                key={idx}
                className="group relative bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 dark:border-slate-700 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative text-center md:text-left">
                  <div className={`w-14 h-14 ${format.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform mx-auto md:mx-0`}>
                    <format.icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{format.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{format.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - "Simple. Rapide. Efficace" */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              {t.landing.howItWorks.title}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              {t.landing.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: t.landing.howItWorks.step1Title,
                desc: t.landing.howItWorks.step1Desc,
                icon: FileText,
                color: 'from-purple-500 to-purple-600'
              },
              {
                step: '02',
                title: t.landing.howItWorks.step2Title,
                desc: t.landing.howItWorks.step2Desc,
                icon: Sparkles,
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '03',
                title: t.landing.howItWorks.step3Title,
                desc: t.landing.howItWorks.step3Desc,
                icon: Zap,
                color: 'from-pink-500 to-pink-600'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700">
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-left-4 w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                    <span className="text-2xl font-black text-white">{item.step}</span>
                  </div>

                  <div className="pt-8 text-center md:text-left">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-6 shadow-lg mx-auto md:mx-0`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - "Pourquoi AI Content Polisher" */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              {t.landing.features.title}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              {t.landing.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700 text-center md:text-left"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform mx-auto md:mx-0`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              {faq.title}
            </h2>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {faq.questions.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-slate-900 dark:text-white pr-8">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all ${
                      isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-5 pt-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Animated Background - Same as Hero */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            <span className="text-slate-900 dark:text-white">{t.landing.finalCta.title.split(' ').slice(0, 3).join(' ')} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600">{t.landing.finalCta.title.split(' ').slice(3).join(' ')}</span>
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            {t.landing.finalCta.subtitle}
          </p>

          <Link
            to="/register"
            className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center">
              {t.landing.finalCta.cta}
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Link>

          <div className="mt-8 flex items-center justify-center gap-6 text-slate-600 dark:text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>{t.landing.finalCta.feature1}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>{t.landing.finalCta.feature2}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>{t.landing.finalCta.feature3}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
