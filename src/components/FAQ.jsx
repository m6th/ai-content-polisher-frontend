import { useState } from 'react';
import { ChevronDown, HelpCircle, Zap, CreditCard, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FAQ() {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const content = {
    fr: {
      title: "Questions Fréquentes",
      subtitle: "Tout ce que vous devez savoir sur AI Content Polisher",
      categories: [
        {
          icon: Sparkles,
          title: "Général",
          questions: [
            {
              q: "Qu'est-ce qu'AI Content Polisher ?",
              a: "AI Content Polisher est un outil SaaS qui utilise l'intelligence artificielle pour générer et optimiser votre contenu pour différentes plateformes (LinkedIn, TikTok, Email, etc.). Il adapte automatiquement le ton, le format et le style selon vos besoins."
            },
            {
              q: "Comment fonctionne l'IA ?",
              a: "Nous utilisons le modèle Groq llama-3.3-70b-versatile, l'un des modèles d'IA les plus performants du marché. Il analyse votre texte original et le transforme en versions optimisées pour chaque plateforme, en respectant le ton et la langue que vous choisissez."
            },
            {
              q: "Quelles plateformes sont supportées ?",
              a: "Nous supportons actuellement 11 formats : LinkedIn, TikTok, Email, Instagram Story, Facebook, Twitter, YouTube Description, Blog, Newsletter, Publicité et Humour. Chaque format est optimisé pour maximiser l'engagement sur sa plateforme."
            },
            {
              q: "Puis-je générer du contenu dans plusieurs langues ?",
              a: "Oui ! AI Content Polisher supporte 3 langues : Français, Anglais et Espagnol. Vous pouvez générer du contenu dans n'importe quelle langue, quel que soit votre plan."
            }
          ]
        },
        {
          icon: CreditCard,
          title: "Plans et Tarifs",
          questions: [
            {
              q: "Quels sont les différents plans disponibles ?",
              a: "Nous proposons 4 plans : Gratuit (3 crédits, 5 formats), Starter à 7,99€/mois (40 crédits), Pro à 17,99€/mois (150 crédits) et Business à 44,99€/mois (500 crédits). Tous les plans payants ont accès à tous les formats et fonctionnalités."
            },
            {
              q: "Qu'est-ce qu'un crédit ?",
              a: "Un crédit = une génération complète de contenu. Par exemple, si vous générez du contenu LinkedIn + TikTok + Email à partir d'un texte, cela consomme 1 crédit et vous recevez les 3 (ou plus) formats optimisés."
            },
            {
              q: "Les crédits expirent-ils ?",
              a: "Les crédits sont renouvelés chaque mois. Les crédits non utilisés ne sont pas reportés au mois suivant, mais vous pouvez toujours voir votre historique pendant 7 jours (plan gratuit) ou illimité (plans payants)."
            },
            {
              q: "Puis-je annuler mon abonnement ?",
              a: "Oui, vous pouvez annuler votre abonnement à tout moment sans frais. Votre accès reste actif jusqu'à la fin de la période payée, puis vous repassez automatiquement au plan gratuit."
            },
            {
              q: "Y a-t-il un engagement minimum ?",
              a: "Non, aucun engagement. Tous nos abonnements sont mensuels et vous pouvez annuler quand vous voulez. Pas de frais cachés, pas de pénalités."
            }
          ]
        },
        {
          icon: Zap,
          title: "Utilisation",
          questions: [
            {
              q: "Combien de temps prend la génération ?",
              a: "La génération prend environ 30 secondes pour créer tous les formats. Nous utilisons des délais entre les requêtes pour garantir la meilleure qualité possible et respecter les limites de l'API."
            },
            {
              q: "Puis-je modifier le contenu généré ?",
              a: "Bien sûr ! Vous pouvez copier, modifier et utiliser le contenu généré comme bon vous semble. Le contenu vous appartient à 100%."
            },
            {
              q: "Le contenu généré est-il unique ?",
              a: "Oui, chaque génération est unique. L'IA crée du contenu original basé sur votre texte, pas de copier-coller. Cependant, nous recommandons toujours de relire et personnaliser le contenu avant publication."
            },
            {
              q: "Puis-je sauvegarder mes générations ?",
              a: "Oui ! Toutes vos générations sont automatiquement sauvegardées dans votre historique. Plan gratuit : 7 derniers jours. Plans payants : historique illimité."
            },
            {
              q: "Comment choisir le bon ton ?",
              a: "Nous proposons 3 tons : Professionnel (formel, sérieux), Casual (décontracté, amical) et Engageant (dynamique, persuasif). Choisissez selon votre audience et l'objectif de votre contenu."
            }
          ]
        },
        {
          icon: Shield,
          title: "Sécurité et Confidentialité",
          questions: [
            {
              q: "Mes données sont-elles sécurisées ?",
              a: "Oui, absolument. Nous utilisons le chiffrement SSL/TLS pour toutes les communications. Les paiements sont gérés par Stripe (certifié PCI-DSS niveau 1). Nous ne stockons jamais vos coordonnées bancaires."
            },
            {
              q: "Que faites-vous de mon contenu ?",
              a: "Votre contenu vous appartient à 100%. Nous ne l'utilisons pas pour entraîner nos modèles, nous ne le partageons pas et nous ne le vendons pas. Il est stocké uniquement pour vous permettre d'accéder à votre historique."
            },
            {
              q: "Puis-je supprimer mes données ?",
              a: "Oui, vous avez un droit à l'oubli (RGPD). Vous pouvez supprimer votre compte et toutes vos données à tout moment depuis la page \"Mon compte\". La suppression est immédiate et irréversible."
            },
            {
              q: "Utilisez-vous des cookies ?",
              a: "Nous utilisons uniquement des cookies essentiels pour l'authentification et le bon fonctionnement du service. Pas de cookies publicitaires ou de tracking tiers."
            }
          ]
        },
        {
          icon: HelpCircle,
          title: "Support",
          questions: [
            {
              q: "Comment puis-je obtenir de l'aide ?",
              a: "Vous pouvez nous contacter par email à mathdu0609@gmail.com. Nous répondons généralement sous 48h maximum. Pour les questions urgentes, précisez-le dans l'objet de votre email."
            },
            {
              q: "Proposez-vous des tutoriels ?",
              a: "Oui, notre interface est intuitive, mais nous préparons des tutoriels vidéo et des guides d'utilisation. En attendant, n'hésitez pas à nous contacter si vous avez besoin d'aide."
            },
            {
              q: "Puis-je suggérer de nouvelles fonctionnalités ?",
              a: "Absolument ! Nous adorons recevoir vos suggestions. Envoyez-nous vos idées par email, nous les étudions toutes et implémentons les plus demandées."
            },
            {
              q: "Y a-t-il une version API ?",
              a: "Pas encore, mais c'est prévu dans notre roadmap pour le plan Business. Si vous êtes intéressé, contactez-nous pour être prévenu lors du lancement."
            }
          ]
        }
      ],
      stillQuestions: "Vous avez encore des questions ?",
      contactUs: "Contactez-nous",
      contactEmail: "mathdu0609@gmail.com"
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about AI Content Polisher",
      categories: [
        {
          icon: Sparkles,
          title: "General",
          questions: [
            {
              q: "What is AI Content Polisher?",
              a: "AI Content Polisher is a SaaS tool that uses artificial intelligence to generate and optimize your content for different platforms (LinkedIn, TikTok, Email, etc.). It automatically adapts tone, format and style according to your needs."
            },
            {
              q: "How does the AI work?",
              a: "We use the Groq llama-3.3-70b-versatile model, one of the most powerful AI models on the market. It analyzes your original text and transforms it into optimized versions for each platform, respecting the tone and language you choose."
            },
            {
              q: "Which platforms are supported?",
              a: "We currently support 11 formats: LinkedIn, TikTok, Email, Instagram Story, Facebook, Twitter, YouTube Description, Blog, Newsletter, Advertising and Humor. Each format is optimized to maximize engagement on its platform."
            },
            {
              q: "Can I generate content in multiple languages?",
              a: "Yes! AI Content Polisher supports 3 languages: French, English and Spanish. You can generate content in any language, regardless of your plan."
            }
          ]
        },
        {
          icon: CreditCard,
          title: "Plans and Pricing",
          questions: [
            {
              q: "What are the different plans available?",
              a: "We offer 4 plans: Free (3 credits, 5 formats), Starter at €7.99/month (40 credits), Pro at €17.99/month (150 credits) and Business at €44.99/month (500 credits). All paid plans have access to all formats and features."
            },
            {
              q: "What is a credit?",
              a: "A credit = one complete content generation. For example, if you generate LinkedIn + TikTok + Email content from one text, it consumes 1 credit and you receive 3 (or more) optimized formats."
            },
            {
              q: "Do credits expire?",
              a: "Credits are renewed each month. Unused credits are not carried over to the next month, but you can always see your history for 7 days (free plan) or unlimited (paid plans)."
            },
            {
              q: "Can I cancel my subscription?",
              a: "Yes, you can cancel your subscription at any time without fees. Your access remains active until the end of the paid period, then you automatically return to the free plan."
            },
            {
              q: "Is there a minimum commitment?",
              a: "No, no commitment. All our subscriptions are monthly and you can cancel whenever you want. No hidden fees, no penalties."
            }
          ]
        },
        {
          icon: Zap,
          title: "Usage",
          questions: [
            {
              q: "How long does generation take?",
              a: "Generation takes about 30 seconds to create all formats. We use delays between requests to ensure the best possible quality and respect API limits."
            },
            {
              q: "Can I edit the generated content?",
              a: "Of course! You can copy, modify and use the generated content as you wish. The content is 100% yours."
            },
            {
              q: "Is the generated content unique?",
              a: "Yes, each generation is unique. The AI creates original content based on your text, no copy-paste. However, we always recommend reviewing and personalizing the content before publishing."
            },
            {
              q: "Can I save my generations?",
              a: "Yes! All your generations are automatically saved in your history. Free plan: last 7 days. Paid plans: unlimited history."
            },
            {
              q: "How to choose the right tone?",
              a: "We offer 3 tones: Professional (formal, serious), Casual (relaxed, friendly) and Engaging (dynamic, persuasive). Choose according to your audience and content objective."
            }
          ]
        },
        {
          icon: Shield,
          title: "Security and Privacy",
          questions: [
            {
              q: "Is my data secure?",
              a: "Yes, absolutely. We use SSL/TLS encryption for all communications. Payments are handled by Stripe (PCI-DSS Level 1 certified). We never store your bank details."
            },
            {
              q: "What do you do with my content?",
              a: "Your content is 100% yours. We don't use it to train our models, we don't share it and we don't sell it. It's stored only to allow you to access your history."
            },
            {
              q: "Can I delete my data?",
              a: "Yes, you have the right to be forgotten (GDPR). You can delete your account and all your data at any time from the \"My Account\" page. Deletion is immediate and irreversible."
            },
            {
              q: "Do you use cookies?",
              a: "We only use essential cookies for authentication and proper service operation. No advertising or third-party tracking cookies."
            }
          ]
        },
        {
          icon: HelpCircle,
          title: "Support",
          questions: [
            {
              q: "How can I get help?",
              a: "You can contact us by email at mathdu0609@gmail.com. We usually respond within 48h maximum. For urgent questions, specify it in the email subject."
            },
            {
              q: "Do you offer tutorials?",
              a: "Yes, our interface is intuitive, but we're preparing video tutorials and user guides. In the meantime, don't hesitate to contact us if you need help."
            },
            {
              q: "Can I suggest new features?",
              a: "Absolutely! We love receiving your suggestions. Send us your ideas by email, we study them all and implement the most requested ones."
            },
            {
              q: "Is there an API version?",
              a: "Not yet, but it's planned in our roadmap for the Business plan. If you're interested, contact us to be notified at launch."
            }
          ]
        }
      ],
      stillQuestions: "Still have questions?",
      contactUs: "Contact us",
      contactEmail: "mathdu0609@gmail.com"
    }
  };

  const t = content[language] || content.fr;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t.subtitle}
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {t.categories.map((category, catIndex) => {
            const Icon = category.icon;
            return (
              <div key={catIndex}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                </div>

                {/* Questions */}
                <div className="space-y-3">
                  {category.questions.map((item, qIndex) => {
                    const globalIndex = `${catIndex}-${qIndex}`;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <div
                        key={qIndex}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleQuestion(globalIndex)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <span className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        <div
                          className={`overflow-hidden transition-all ${
                            isOpen ? 'max-h-96' : 'max-h-0'
                          }`}
                        >
                          <div className="px-6 pb-5 pt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t.stillQuestions}
            </h2>
            <p className="text-purple-100 mb-8 text-lg">
              {t.contactUs}
            </p>
            <a
              href={`mailto:${t.contactEmail}`}
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors shadow-lg"
            >
              <HelpCircle className="w-5 h-5" />
              {t.contactEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
