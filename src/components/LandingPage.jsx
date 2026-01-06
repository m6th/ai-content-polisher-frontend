import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';
import {
  Sparkles, Zap, Target, ArrowRight, Check,
  FileText, Mail, Video, Linkedin, Instagram,
  Twitter, BookOpen, Megaphone, GraduationCap,
  Smile, Drama, Facebook, Image, Send, ChevronDown, UserPlus
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
          q: "Qu'est-ce qu'AI Content Polisher ?",
          a: "AI Content Polisher est un outil SaaS qui utilise l'intelligence artificielle pour générer et optimiser votre contenu pour différentes plateformes (LinkedIn, TikTok, Email, etc.). Il adapte automatiquement le ton, le format et le style selon vos besoins."
        },
        {
          q: "Quels sont les différents plans disponibles ?",
          a: "Nous proposons 4 plans : Gratuit (3 crédits, 5 formats), Starter à 7,99€/mois (40 crédits), Pro à 17,99€/mois (150 crédits) et Business à 44,99€/mois (500 crédits). Tous les plans payants ont accès à tous les formats et fonctionnalités."
        },
        {
          q: "Qu'est-ce qu'un crédit ?",
          a: "Un crédit = une génération complète de contenu. Par exemple, si vous générez du contenu LinkedIn + TikTok + Email à partir d'un texte, cela consomme 1 crédit et vous recevez les 3 (ou plus) formats optimisés."
        },
        {
          q: "Puis-je annuler mon abonnement ?",
          a: "Oui, vous pouvez annuler votre abonnement à tout moment sans frais. Votre accès reste actif jusqu'à la fin de la période payée, puis vous repassez automatiquement au plan gratuit."
        },
        {
          q: "Mes données sont-elles sécurisées ?",
          a: "Oui, absolument. Nous utilisons le chiffrement SSL/TLS pour toutes les communications. Les paiements sont gérés par Stripe (certifié PCI-DSS niveau 1). Nous ne stockons jamais vos coordonnées bancaires."
        },
        {
          q: "Comment puis-je obtenir de l'aide ?",
          a: "Vous pouvez nous contacter par email à mathdu0609@gmail.com. Nous répondons généralement sous 48h maximum. Pour les questions urgentes, précisez-le dans l'objet de votre email."
        }
      ]
    },
    en: {
      title: "Frequently Asked Questions",
      questions: [
        {
          q: "What is AI Content Polisher?",
          a: "AI Content Polisher is a SaaS tool that uses artificial intelligence to generate and optimize your content for different platforms (LinkedIn, TikTok, Email, etc.). It automatically adapts tone, format and style according to your needs."
        },
        {
          q: "What are the different plans available?",
          a: "We offer 4 plans: Free (3 credits, 5 formats), Starter at €7.99/month (40 credits), Pro at €17.99/month (150 credits) and Business at €44.99/month (500 credits). All paid plans have access to all formats and features."
        },
        {
          q: "What is a credit?",
          a: "A credit = one complete content generation. For example, if you generate LinkedIn + TikTok + Email content from one text, it consumes 1 credit and you receive 3 (or more) optimized formats."
        },
        {
          q: "Can I cancel my subscription?",
          a: "Yes, you can cancel your subscription at any time without fees. Your access remains active until the end of the paid period, then you automatically return to the free plan."
        },
        {
          q: "Is my data secure?",
          a: "Yes, absolutely. We use SSL/TLS encryption for all communications. Payments are handled by Stripe (PCI-DSS Level 1 certified). We never store your bank details."
        },
        {
          q: "How can I get help?",
          a: "You can contact us by email at mathdu0609@gmail.com. We usually respond within 48h maximum. For urgent questions, specify it in the email subject."
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
                className="group inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  {t.landing.hero.cta}
                  <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Link>
              <Link
                to="/join-team"
                className="group inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl hover:border-green-500 dark:hover:border-green-500 transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  <UserPlus className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  Rejoindre une équipe
                </span>
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

      {/* Formats Grid */}
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

                <div className="relative">
                  <div className={`w-14 h-14 ${format.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
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

      {/* How It Works */}
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
                  <div className={`absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                    <span className="text-2xl font-black text-white">{item.step}</span>
                  </div>

                  <div className="pt-8">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
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

      {/* Features */}
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
                className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
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
