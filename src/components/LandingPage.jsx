import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../locales/translations';
import {
  Zap, Target, ArrowRight, Check,
  FileText, Mail, Video, Linkedin, Instagram,
  Twitter, Megaphone, ChevronDown, UserPlus, Layers
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

function LandingPage() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [openFaq, setOpenFaq] = useState(null);

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
          a: "Soyons transparents : les outils de détection IA (comme GPTZero, Originality.ai, etc.) existent et peuvent parfois identifier du contenu généré par IA. Cependant, plusieurs éléments jouent en votre faveur : notre IA produit du contenu plus naturel et varié que les IA génériques grâce à des prompts spécialisés par plateforme. Nous varions automatiquement les structures et formulations pour éviter les patterns répétitifs facilement détectables. Surtout, nous vous encourageons fortement à personnaliser et éditer le contenu généré - ajoutez vos anecdotes personnelles, votre ton unique, vos expressions favorites. C'est cette touche humaine qui rend le contenu authentique. Bientôt, vous pourrez créer des styles personnalisés basés sur vos propres contenus pour reproduire votre voix. Point important : les plateformes comme LinkedIn, Instagram ou TikTok ne pénalisent pas officiellement le contenu assisté par IA. Ce qui compte pour elles, c'est la valeur apportée à l'audience, pas la méthode de création."
        },
        {
          q: "Est-ce que ça fonctionne vraiment pour augmenter l'engagement ?",
          a: "Soyons honnêtes : personne ne peut garantir qu'un post deviendra viral, et aucune IA ne peut l'assurer. Cependant, AI Content Polisher maximise vos chances de succès en appliquant des techniques éprouvées inspirées des meilleurs créateurs de contenu. Concrètement, notre IA intègre : des hooks d'accroche qui captent l'attention dans les 2 premières secondes (élément crucial pour les algorithmes de toutes les plateformes), des structures narratives qui maintiennent le lecteur engagé jusqu'à la fin du post, des call-to-action psychologiquement optimisés qui encouragent les commentaires et partages, le ratio idéal texte/emojis/hashtags spécifique à chaque plateforme (ce qui fonctionne sur LinkedIn est différent d'Instagram ou TikTok). En structurant efficacement vos idées et en vous fournissant du contenu bien cadré selon les codes de chaque plateforme, notre outil vous aide à créer des posts de qualité professionnelle, plus susceptibles d'engager votre audience cible. Le résultat dépendra toujours de la qualité de votre idée initiale et de votre connaissance de votre audience, mais vous partez avec une longueur d'avance."
        },
        {
          q: "Un crédit = combien de contenus générés ?",
          a: "C'est là que notre système est particulièrement avantageux. Un crédit vous permet de transformer UNE idée en contenus optimisés pour les plateformes de votre choix (LinkedIn, Instagram, TikTok, Twitter, Email, Publicité). Vous sélectionnez les plateformes qui vous intéressent et l'IA génère uniquement ces formats - 1 crédit par génération, quel que soit le nombre de formats choisis. Besoin uniquement de LinkedIn et Instagram ? Sélectionnez-les et obtenez 2 contenus parfaitement optimisés. Vous voulez les 6 ? C'est toujours 1 crédit. C'est un rapport qualité/prix imbattable comparé aux agences ou au temps passé à tout créer manuellement."
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
          a: "Let's be transparent: AI detection tools (like GPTZero, Originality.ai, etc.) exist and can sometimes identify AI-generated content. However, several factors work in your favor: our AI produces more natural and varied content than generic AIs thanks to platform-specific prompts. We automatically vary structures and phrasings to avoid easily detectable repetitive patterns. Most importantly, we strongly encourage you to personalize and edit the generated content - add your personal anecdotes, your unique tone, your favorite expressions. It's this human touch that makes content authentic. Soon, you'll be able to create custom styles based on your own content to reproduce your voice. Important point: platforms like LinkedIn, Instagram, or TikTok don't officially penalize AI-assisted content. What matters to them is the value provided to the audience, not the creation method."
        },
        {
          q: "Does it really work to increase engagement?",
          a: "Let's be honest: no one can guarantee that a post will go viral, and no AI can ensure it. However, AI Content Polisher maximizes your chances of success by applying proven techniques inspired by top content creators. Specifically, our AI integrates: attention-grabbing hooks that capture attention in the first 2 seconds (a crucial element for all platform algorithms), narrative structures that keep readers engaged until the end of the post, psychologically optimized call-to-actions that encourage comments and shares, the ideal text/emoji/hashtag ratio specific to each platform (what works on LinkedIn is different from Instagram or TikTok). By effectively structuring your ideas and providing well-framed content according to each platform's codes, our tool helps you create professional-quality posts that are more likely to engage your target audience. The result will always depend on the quality of your initial idea and your knowledge of your audience, but you start with a head start."
        },
        {
          q: "One credit = how many generated contents?",
          a: "This is where our system is particularly advantageous. One credit allows you to transform ONE idea into optimized content for the platforms of your choice (LinkedIn, Instagram, TikTok, Twitter, Email, Ads). You select the platforms you want and the AI generates only those formats - 1 credit per generation, regardless of how many formats you choose. Only need LinkedIn and Instagram? Select them and get 2 perfectly optimized contents. Want all 6? Still just 1 credit. That's unbeatable value compared to agencies or the time spent creating everything manually."
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
      color: 'bg-[#0A66C2]',
      desc: t.landing.formats.linkedin
    },
    {
      name: 'Instagram Caption',
      icon: Instagram,
      color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
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
      color: 'bg-black',
      desc: t.landing.formats.twitter
    },
    {
      name: 'Email Pro',
      icon: Mail,
      color: 'bg-blue-600',
      desc: t.landing.formats.email
    },
    {
      name: 'Publicité',
      icon: Megaphone,
      color: 'bg-amber-500',
      desc: t.landing.formats.copywriting
    }
  ];

  const features = [
    {
      icon: Zap,
      title: t.landing.features.feature1Title,
      description: t.landing.features.feature1Desc,
      iconColor: 'text-amber-500'
    },
    {
      icon: Target,
      title: t.landing.features.feature2Title,
      description: t.landing.features.feature2Desc,
      iconColor: 'text-blue-600'
    },
    {
      icon: Layers,
      title: t.landing.features.feature3Title,
      description: t.landing.features.feature3Desc,
      iconColor: 'text-emerald-500'
    },
    {
      icon: FileText,
      title: t.landing.features.feature4Title,
      description: t.landing.features.feature4Desc,
      iconColor: 'text-violet-500'
    }
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100">
              {t.landing.hero.badge}
            </Badge>

            {/* Main Heading */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
                {t.landing.hero.title1}
                <br />
                <span className="text-blue-600 dark:text-blue-400">
                  {t.landing.hero.title2}
                </span>
                <br />
                {t.landing.hero.title3}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                {t.landing.hero.subtitle}
                <span className="font-medium text-foreground">{t.landing.hero.subtitleBold}</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base bg-blue-600 hover:bg-blue-700">
                <Link to="/register">
                  {t.landing.hero.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/join-team">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Rejoindre une équipe
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Preview Card */}
          <div className="hidden lg:block">
            <Card className="p-8 shadow-xl border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">AI Content Polisher</div>
                  <div className="text-sm text-muted-foreground">{t.polisher.generating}</div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-3 bg-slate-100 dark:bg-slate-800 rounded" style={{ width: `${100 - i * 10}%` }} />
                ))}
              </div>

              <div className="pt-6 border-t border-border flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-[#0A66C2] rounded flex items-center justify-center">
                    <Linkedin className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <Twitter className="w-4 h-4 text-white" />
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {t.landing.stats.formats}
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {t.landing.stats.formats}
              </div>
              <div className="text-muted-foreground">{t.landing.stats.formatsDesc}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {t.landing.stats.languages}
              </div>
              <div className="text-muted-foreground">{t.landing.stats.languagesDesc}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {t.landing.stats.speed}
              </div>
              <div className="text-muted-foreground">{t.landing.stats.speedDesc}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Formats Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.landing.formats.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.landing.formats.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formats.map((format, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-700">
                <CardContent className="p-0">
                  <div className={`w-12 h-12 ${format.color} rounded-xl flex items-center justify-center mb-4`}>
                    <format.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{format.name}</h3>
                  <p className="text-sm text-muted-foreground">{format.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.landing.howItWorks.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                color: 'bg-blue-600'
              },
              {
                step: '02',
                title: t.landing.howItWorks.step2Title,
                desc: t.landing.howItWorks.step2Desc,
                icon: Target,
                color: 'bg-violet-600'
              },
              {
                step: '03',
                title: t.landing.howItWorks.step3Title,
                desc: t.landing.howItWorks.step3Desc,
                icon: Zap,
                color: 'bg-emerald-600'
              }
            ].map((item, idx) => (
              <Card key={idx} className="p-8 relative border-slate-200 dark:border-slate-700">
                <div className="absolute -top-3 left-6">
                  <Badge className={`${item.color} text-white text-sm font-mono`}>
                    {item.step}
                  </Badge>
                </div>
                <CardContent className="p-0 pt-4">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.landing.features.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.landing.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-8 hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-700">
                <CardContent className="p-0">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              {faq.title}
            </h2>
          </div>

          <div className="space-y-3">
            {faq.questions.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <Card key={index} className="overflow-hidden border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="font-medium text-foreground pr-8">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? 'max-h-[500px]' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t.landing.finalCta.title}
          </h2>

          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
            {t.landing.finalCta.subtitle}
          </p>

          <Button asChild size="lg" className="text-base bg-white text-blue-600 hover:bg-blue-50 mb-8">
            <Link to="/register">
              {t.landing.finalCta.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-6 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-white" />
              <span>{t.landing.finalCta.feature1}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-white" />
              <span>{t.landing.finalCta.feature2}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-white" />
              <span>{t.landing.finalCta.feature3}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
