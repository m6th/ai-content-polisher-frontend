import { Check, X, Sparkles, Rocket, Briefcase, Building2, ChevronDown, HelpCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

function Pricing({ user }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const toast = useToast();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'annual'
  const [openFaq, setOpenFaq] = useState(null);

  const translations = {
    fr: {
      title: 'Tarifs simples et transparents',
      subtitle: 'Choisissez le plan qui correspond à vos besoins',
      monthly: 'Mensuel',
      annual: 'Annuel',
      saveUpTo: 'Économisez jusqu\'à 20%',
      perMonth: '€/mois',
      perYear: '€/an',
      billedMonthly: 'Soit {price}€ facturé mensuellement',
      billedAnnually: 'Soit {price}€ facturé annuellement',
      creditsPerMonth: 'crédits/mois',
      currentPlan: 'Plan actuel',
      changePlan: 'Changer de plan',
      choosePlan: 'Commencer gratuitement',
      choosePaid: 'Choisir ce plan',
      contactSales: 'Nous contacter',
      popular: 'POPULAIRE',
      bestValue: 'MEILLEUR RAPPORT QUALITÉ/PRIX',
      recommended: 'RECOMMANDÉ',
      allFromPrevious: 'Tout du plan',
      plus: '+',
      paymentInfo: 'Tous les paiements sont sécurisés et peuvent être annulés à tout moment',
      annualBillingNote: 'Abonnements annuels : paiement en une seule fois. En cas d\'annulation, accès maintenu jusqu\'à la fin de la période payée (pas de remboursement au prorata).',
      helpText: 'Besoin d\'aide pour choisir ?',
      contactUs: 'Contactez-nous',
      compareTitle: 'Comparez les fonctionnalités',
      compareSubtitle: 'Trouvez le plan qui correspond parfaitement à vos besoins',
      faqTitle: 'Questions fréquentes',
      faqSubtitle: 'Tout ce que vous devez savoir sur nos plans',
      faqs: [
        {
          question: 'Puis-je changer de plan à tout moment ?',
          answer: 'Oui ! Vous pouvez changer de plan à tout moment. Si vous passez à un plan supérieur, vous bénéficiez immédiatement des nouvelles fonctionnalités. Si vous rétrogradez, le changement prendra effet à la fin de votre période de facturation actuelle.'
        },
        {
          question: 'Que se passe-t-il si j\'utilise tous mes crédits ?',
          answer: 'Pour les plans Free et Starter, vos crédits se renouvellent automatiquement chaque mois. Pour les plans Pro et Business, vous pouvez acheter des crédits supplémentaires à 0.08€/crédit si nécessaire.'
        },
        {
          question: 'Y a-t-il une période d\'essai gratuite ?',
          answer: 'Oui ! Tous les nouveaux utilisateurs commencent avec le plan Free qui inclut 3 crédits gratuits pour tester l\'outil. Aucune carte bancaire n\'est requise pour démarrer.'
        },
        {
          question: 'Comment fonctionnent les crédits ?',
          answer: '1 crédit = 1 génération de contenu. Par exemple, si vous transformez un texte pour LinkedIn, Instagram et TikTok, cela consomme 1 crédit et génère 3 versions optimisées (une par plateforme).'
        },
        {
          question: 'Puis-je annuler mon abonnement ?',
          answer: 'Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Vous conserverez l\'accès à votre plan jusqu\'à la fin de votre période de facturation.'
        },
        {
          question: 'Quelle est la différence entre export simple et export en masse ?',
          answer: 'L\'export simple vous permet de télécharger vos contenus un par un. L\'export en masse (disponible en Pro et Business) vous permet de télécharger tous vos contenus d\'un coup en CSV ou JSON.'
        }
      ],
      features: {
        credits: 'Crédits mensuels',
        platforms: 'Formats disponibles',
        variants: 'Variantes par génération',
        tones: 'Tons disponibles',
        languages: 'Langues',
        history: 'Historique',
        export: 'Export des contenus',
        bulkExport: 'Export en masse',
        analytics: 'Analytics détaillés',
        hashtags: 'Hashtags IA',
        aiSuggestions: 'Suggestions IA',
        calendar: 'Calendrier éditorial',
        team: 'Utilisateurs',
        apiAccess: 'Accès API',
        customTones: 'Tons personnalisés',
        support: 'Support'
      },
      plans: {
        free: {
          name: 'Gratuit',
          description: 'Parfait pour découvrir l\'outil',
          features: [
            '3 crédits/mois',
            '3 formats (LinkedIn, Instagram, TikTok)',
            '1 variante par génération',
            '3 tons disponibles',
            '3 langues (FR, EN, ES)',
            'Historique 7 jours',
            'Support communautaire'
          ],
          detailedFeatures: {
            credits: '3',
            platforms: '3 formats',
            variants: '1',
            tones: '3 tons',
            languages: '3',
            history: '7 jours',
            export: false,
            bulkExport: false,
            analytics: false,
            hashtags: false,
            aiSuggestions: false,
            calendar: false,
            team: '1',
            apiAccess: false,
            customTones: false,
            support: 'Communauté'
          }
        },
        starter: {
          name: 'Starter',
          description: 'Pour les créateurs réguliers',
          badge: null,
          allFromPrevious: 'free',
          features: [
            '40 crédits/mois',
            'Tous les 6 formats',
            'Historique complet',
            'Export des contenus',
            'Support email (48h)'
          ],
          detailedFeatures: {
            credits: '40',
            platforms: '6 formats',
            variants: '1',
            tones: '3 tons',
            languages: '3',
            history: 'Illimité',
            export: true,
            bulkExport: false,
            analytics: false,
            hashtags: false,
            aiSuggestions: false,
            calendar: false,
            team: '1',
            apiAccess: false,
            customTones: false,
            support: 'Email 48h'
          }
        },
        pro: {
          name: 'Pro',
          description: 'Pour les professionnels exigeants',
          badge: 'RECOMMANDÉ',
          allFromPrevious: 'starter',
          features: [
            '200 crédits/mois',
            '3 variantes par génération (A/B testing)',
            'Analytics détaillés',
            'Hashtags IA intelligents',
            'Suggestions d\'amélioration IA',
            'Calendrier éditorial',
            'Export en masse (CSV, JSON)',
            '2 utilisateurs par compte',
            'Support email (24h)'
          ],
          detailedFeatures: {
            credits: '200',
            platforms: '6 formats',
            variants: '3',
            tones: '3 tons',
            languages: '3',
            history: 'Illimité',
            export: true,
            bulkExport: true,
            analytics: true,
            hashtags: true,
            aiSuggestions: true,
            calendar: true,
            team: '2',
            apiAccess: false,
            customTones: false,
            support: 'Email 24h'
          }
        },
        business: {
          name: 'Business',
          description: 'Pour les équipes et agences',
          badge: null,
          allFromPrevious: 'pro',
          features: [
            '500 crédits/mois',
            '5 utilisateurs par compte',
            'Accès API complet',
            'Tons personnalisés',
            'Crédits supplémentaires (0.08€/crédit)',
            'Support prioritaire (12h) + chat'
          ],
          detailedFeatures: {
            credits: '500',
            platforms: '6 formats',
            variants: '3',
            tones: 'Illimité',
            languages: '3',
            history: 'Illimité',
            export: true,
            bulkExport: true,
            analytics: true,
            hashtags: true,
            aiSuggestions: true,
            calendar: true,
            team: '5',
            apiAccess: true,
            customTones: true,
            support: 'Prioritaire 12h + Chat'
          }
        }
      }
    },
    en: {
      title: 'Simple, transparent pricing',
      subtitle: 'Choose the plan that fits your needs',
      monthly: 'Monthly',
      annual: 'Annual',
      saveUpTo: 'Save up to 20%',
      perMonth: '€/month',
      perYear: '€/year',
      billedMonthly: 'Or {price}€ billed monthly',
      billedAnnually: 'Or {price}€ billed annually',
      creditsPerMonth: 'credits/month',
      currentPlan: 'Current plan',
      changePlan: 'Change plan',
      choosePlan: 'Start for free',
      choosePaid: 'Choose this plan',
      contactSales: 'Contact us',
      popular: 'POPULAR',
      bestValue: 'BEST VALUE',
      recommended: 'RECOMMENDED',
      allFromPrevious: 'Everything in',
      plus: '+',
      paymentInfo: 'All payments are secure and can be cancelled at any time',
      annualBillingNote: 'Annual subscriptions: one-time payment. If cancelled, access maintained until the end of the paid period (no prorated refund).',
      helpText: 'Need help choosing?',
      contactUs: 'Contact us',
      compareTitle: 'Compare features',
      compareSubtitle: 'Find the plan that perfectly matches your needs',
      faqTitle: 'Frequently asked questions',
      faqSubtitle: 'Everything you need to know about our plans',
      faqs: [
        {
          question: 'Can I change my plan at any time?',
          answer: 'Yes! You can change your plan at any time. If you upgrade, you immediately benefit from the new features. If you downgrade, the change will take effect at the end of your current billing period.'
        },
        {
          question: 'What happens if I use all my credits?',
          answer: 'For Free and Starter plans, your credits automatically renew each month. For Pro and Business plans, you can purchase additional credits at €0.08/credit if needed.'
        },
        {
          question: 'Is there a free trial period?',
          answer: 'Yes! All new users start with the Free plan which includes 3 free credits to test the tool. No credit card required to start.'
        },
        {
          question: 'How do credits work?',
          answer: '1 credit = 1 content generation. For example, if you transform text for LinkedIn, Instagram and TikTok, it consumes 1 credit and generates 3 optimized versions (one per platform).'
        },
        {
          question: 'Can I cancel my subscription?',
          answer: 'Yes, you can cancel your subscription at any time from your dashboard. You will retain access to your plan until the end of your billing period.'
        },
        {
          question: 'What\'s the difference between simple export and bulk export?',
          answer: 'Simple export allows you to download your content one by one. Bulk export (available in Pro and Business) allows you to download all your content at once in CSV or JSON.'
        }
      ],
      features: {
        credits: 'Monthly credits',
        platforms: 'Available formats',
        variants: 'Variants per generation',
        tones: 'Available tones',
        languages: 'Languages',
        history: 'History',
        export: 'Content export',
        bulkExport: 'Bulk export',
        analytics: 'Detailed analytics',
        hashtags: 'AI Hashtags',
        aiSuggestions: 'AI Suggestions',
        calendar: 'Editorial calendar',
        team: 'Users',
        apiAccess: 'API Access',
        customTones: 'Custom tones',
        support: 'Support'
      },
      plans: {
        free: {
          name: 'Free',
          description: 'Perfect to discover the tool',
          features: [
            '3 credits/month',
            '3 formats (LinkedIn, Instagram, TikTok)',
            '1 variant per generation',
            '3 available tones',
            '3 languages (FR, EN, ES)',
            '7-day history',
            'Community support'
          ],
          detailedFeatures: {
            credits: '3',
            platforms: '3 formats',
            variants: '1',
            tones: '3 tones',
            languages: '3',
            history: '7 days',
            export: false,
            bulkExport: false,
            analytics: false,
            hashtags: false,
            aiSuggestions: false,
            calendar: false,
            team: '1',
            apiAccess: false,
            customTones: false,
            support: 'Community'
          }
        },
        starter: {
          name: 'Starter',
          description: 'For regular creators',
          badge: null,
          allFromPrevious: 'free',
          features: [
            '40 credits/month',
            'All 6 formats',
            'Complete history',
            'Content export',
            'Email support (48h)'
          ],
          detailedFeatures: {
            credits: '40',
            platforms: '6 formats',
            variants: '1',
            tones: '3 tones',
            languages: '3',
            history: 'Unlimited',
            export: true,
            bulkExport: false,
            analytics: false,
            hashtags: false,
            aiSuggestions: false,
            calendar: false,
            team: '1',
            apiAccess: false,
            customTones: false,
            support: 'Email 48h'
          }
        },
        pro: {
          name: 'Pro',
          description: 'For demanding professionals',
          badge: 'RECOMMENDED',
          allFromPrevious: 'starter',
          features: [
            '200 credits/month',
            '3 variants per generation (A/B testing)',
            'Detailed analytics',
            'Smart AI hashtags',
            'AI improvement suggestions',
            'Editorial calendar',
            'Bulk export (CSV, JSON)',
            '2 users per account',
            'Email support (24h)'
          ],
          detailedFeatures: {
            credits: '200',
            platforms: '6 formats',
            variants: '3',
            tones: '3 tones',
            languages: '3',
            history: 'Unlimited',
            export: true,
            bulkExport: true,
            analytics: true,
            hashtags: true,
            aiSuggestions: true,
            calendar: true,
            team: '2',
            apiAccess: false,
            customTones: false,
            support: 'Email 24h'
          }
        },
        business: {
          name: 'Business',
          description: 'For teams and agencies',
          badge: null,
          allFromPrevious: 'pro',
          features: [
            '500 credits/month',
            '5 users per account',
            'Full API access',
            'Custom tones',
            'Additional credits (€0.08/credit)',
            'Priority support (12h) + chat'
          ],
          detailedFeatures: {
            credits: '500',
            platforms: '6 formats',
            variants: '3',
            tones: 'Unlimited',
            languages: '3',
            history: 'Unlimited',
            export: true,
            bulkExport: true,
            analytics: true,
            hashtags: true,
            aiSuggestions: true,
            calendar: true,
            team: '5',
            apiAccess: true,
            customTones: true,
            support: 'Priority 12h + Chat'
          }
        }
      }
    }
  };

  const t = translations[language] || translations.fr;

  const pricing = {
    monthly: {
      free: 0,
      starter: 14.99,
      pro: 29.99,
      business: 77.99
    },
    annual: {
      free: 0,
      starter: 143.88,  // Prix annuel total (payé en une fois)
      pro: 287.88,      // Prix annuel total (payé en une fois)
      business: 755.88  // Prix annuel total (payé en une fois)
    }
  };

  // Calcul du prix mensuel équivalent pour les plans annuels
  const getMonthlyEquivalent = (planKey) => {
    return (pricing.annual[planKey] / 12).toFixed(2);
  };

  // Retourne le prix annuel total
  const getAnnualTotal = (planKey) => {
    return pricing.annual[planKey].toFixed(2);
  };

  const plans = [
    {
      key: 'free',
      name: t.plans.free.name,
      description: t.plans.free.description,
      icon: Sparkles,
      price: pricing[billingPeriod].free,
      credits: '3',
      color: 'from-slate-500 to-slate-600',
      popular: false,
      badge: null,
      features: t.plans.free.features,
      allFromPrevious: null
    },
    {
      key: 'starter',
      name: t.plans.starter.name,
      description: t.plans.starter.description,
      icon: Rocket,
      price: pricing[billingPeriod].starter,
      credits: '40',
      color: 'from-purple-500 to-purple-600',
      popular: false,
      badge: null,
      features: t.plans.starter.features,
      allFromPrevious: 'free'
    },
    {
      key: 'pro',
      name: t.plans.pro.name,
      description: t.plans.pro.description,
      icon: Briefcase,
      price: pricing[billingPeriod].pro,
      credits: '200',
      color: 'from-blue-500 to-blue-600',
      popular: true,
      badge: t.recommended,
      features: t.plans.pro.features,
      allFromPrevious: 'starter'
    },
    {
      key: 'business',
      name: t.plans.business.name,
      description: t.plans.business.description,
      icon: Building2,
      price: pricing[billingPeriod].business,
      credits: '500',
      color: 'from-pink-500 to-pink-600',
      popular: false,
      badge: null,
      features: t.plans.business.features,
      allFromPrevious: 'pro'
    }
  ];

  const handleChoosePlan = async (planValue) => {
    // Free plan - no payment required
    if (planValue === 'free') {
      toast.info(
        language === 'fr' ? 'Le plan gratuit est déjà actif' :
        language === 'en' ? 'Free plan is already active' :
        'El plan gratuito ya está activo'
      );
      return;
    }

    // Not logged in - redirect to register
    if (!user) {
      navigate(`/register?plan=${planValue}`);
      return;
    }

    setError('');
    setSuccess('');

    // Get plan details
    const plan = plans.find(p => p.key === planValue);
    if (!plan) return;

    // Redirect to checkout page with billing period
    navigate(`/checkout?plan=${planValue}&planName=${encodeURIComponent(plan.name)}&price=${plan.price}&billing=${billingPeriod}`);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const getDiscountPercentage = (planKey) => {
    if (planKey === 'free') return 0;
    const monthlyPrice = pricing.monthly[planKey];
    const annualPrice = pricing.annual[planKey];
    return Math.round(((monthlyPrice - annualPrice) / monthlyPrice) * 100);
  };

  return (
    <section id="tarifs" className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {success && (
          <div className="mb-8 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 px-6 py-4 rounded-xl max-w-2xl mx-auto shadow-lg">
            <p className="font-semibold">✅ {success}</p>
          </div>
        )}

        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl max-w-2xl mx-auto shadow-lg">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            {t.subtitle}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.monthly}
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-3 rounded-full font-semibold transition-all relative ${
                billingPeriod === 'annual'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.annual}
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
          {billingPeriod === 'annual' && (
            <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-3">
              💰 {t.saveUpTo}
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = user && user.current_plan === plan.key;
            const discount = getDiscountPercentage(plan.key);

            return (
              <div
                key={plan.key}
                className={`relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-blue-500 ring-offset-4 dark:ring-offset-slate-900 lg:scale-110' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 text-xs font-bold rounded-bl-2xl shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="p-6">
                  {/* Icon & Name */}
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="text-center mb-6">
                    {billingPeriod === 'annual' && plan.key !== 'free' ? (
                      <>
                        {/* Mode annuel : afficher le prix mensuel équivalent en gros */}
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-black text-slate-900 dark:text-white">{getMonthlyEquivalent(plan.key)}</span>
                          <span className="text-lg text-slate-600 dark:text-slate-400 ml-2">{t.perMonth}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          Soit {getAnnualTotal(plan.key)}€/an (payé en une fois), Hors Taxes | Annulation à tout moment
                        </p>
                        {discount > 0 && (
                          <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                            Économisez 20%
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Mode mensuel : afficher le prix mensuel */}
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price.toFixed(2)}</span>
                          <span className="text-lg text-slate-600 dark:text-slate-400 ml-2">{t.perMonth}</span>
                        </div>
                        {plan.key !== 'free' && (
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            Hors Taxes | Annulation à tout moment
                          </p>
                        )}
                      </>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-semibold">
                      {plan.credits} {t.creditsPerMonth}
                    </p>
                  </div>

                  {/* "All from previous plan +" */}
                  {plan.allFromPrevious && (
                    <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        {t.allFromPrevious} <span className="font-semibold text-slate-900 dark:text-white">{plans.find(p => p.key === plan.allFromPrevious)?.name}</span> {t.plus}
                      </p>
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button
                    onClick={() => handleChoosePlan(plan.key)}
                    disabled={isCurrentPlan}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold transition-all text-white shadow-lg ${
                      isCurrentPlan
                        ? 'bg-slate-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${plan.color} hover:shadow-2xl hover:scale-105`
                    }`}
                  >
                    {isCurrentPlan ? (
                      t.currentPlan
                    ) : plan.key === 'free' ? (
                      t.choosePlan
                    ) : user ? (
                      t.changePlan
                    ) : (
                      t.choosePaid
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              {t.compareTitle}
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t.compareSubtitle}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-blue-600">
                    <th className="py-4 px-6 text-left text-white font-bold">Fonctionnalité</th>
                    <th className="py-4 px-6 text-center text-white font-bold">Free</th>
                    <th className="py-4 px-6 text-center text-white font-bold">Starter</th>
                    <th className="py-4 px-6 text-center text-white font-bold bg-blue-700">Pro</th>
                    <th className="py-4 px-6 text-center text-white font-bold">Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {Object.keys(t.features).map((featureKey, idx) => (
                    <tr key={featureKey} className={idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'}>
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                        {t.features[featureKey]}
                      </td>
                      {['free', 'starter', 'pro', 'business'].map((planKey) => {
                        const value = t.plans[planKey].detailedFeatures[featureKey];
                        return (
                          <td key={planKey} className={`py-4 px-6 text-center ${planKey === 'pro' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                            {typeof value === 'boolean' ? (
                              value ? (
                                <Check className="h-6 w-6 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-6 w-6 text-slate-300 dark:text-slate-600 mx-auto" />
                              )
                            ) : (
                              <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              {t.faqTitle}
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t.faqSubtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {t.faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-lg">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-6 w-6 text-slate-400 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-14">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-4">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="text-slate-700 dark:text-slate-300 font-semibold">
              {t.paymentInfo}
            </p>
          </div>

          {/* Note sur les abonnements annuels */}
          <div className="max-w-3xl mx-auto mb-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              ℹ️ {t.annualBillingNote}
            </p>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.helpText}{' '}
            <a
              href="mailto:mathdu0609@gmail.com?subject=Aide%20pour%20choisir%20un%20plan%20AI%20Content%20Polisher"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold transition-colors underline"
            >
              {t.contactUs}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
