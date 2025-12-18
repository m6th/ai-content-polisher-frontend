import { Check, X, Sparkles, Rocket, Briefcase, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

function Pricing({ user, onUpdateUser }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const toast = useToast();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const translations = {
    fr: {
      title: 'Choisissez votre plan',
      subtitle: 'Des solutions adaptées à tous vos besoins de création de contenu',
      popular: '⭐ POPULAIRE',
      perMonth: '€/mois',
      creditsPerMonth: 'crédits/mois',
      currentPlan: 'Plan actuel',
      changePlan: 'Changer de plan',
      choosePlan: 'Choisir ce plan',
      loading: 'Chargement...',
      paymentInfo: '💳 Tous les paiements sont sécurisés et peuvent être annulés à tout moment',
      helpText: 'Besoin d\'aide pour choisir ?',
      contactUs: 'Contactez-nous',
      plans: {
        free: {
          name: 'Gratuit',
          features: [
            '3 formats (LinkedIn, Instagram, TikTok)',
            '4 tons (Professionnel, Casual, Engageant, Storytelling)',
            '3 langues (FR, EN, ES)',
            'Historique (7 derniers jours)',
            'Support communautaire'
          ]
        },
        starter: {
          name: 'Starter',
          features: [
            'Tous les 6 formats',
            '4 tons disponibles',
            '3 langues (FR, EN, ES)',
            'Historique complet (illimité)',
            'Export des contenus',
            'Support email (48h)'
          ]
        },
        pro: {
          name: 'Pro',
          features: [
            'Tous les 6 formats',
            '4 tons disponibles',
            '3 langues (FR, EN, ES)',
            'Historique complet',
            'Export des contenus',
            'Analytics détaillées',
            '3 variantes par requête',
            'Suggestions de hashtags',
            '2 utilisateurs par compte',
            'Support email (24h)'
          ]
        },
        business: {
          name: 'Business',
          features: [
            'Tout du plan Pro +',
            '5 utilisateurs par compte',
            'API access',
            'Crédits supplémentaires (0.08€/crédit)',
            'Personnalisation des tons',
            'Export en masse (CSV, JSON)',
            'Support prioritaire (12h) + chat'
          ]
        }
      }
    },
    en: {
      title: 'Choose your plan',
      subtitle: 'Solutions tailored to all your content creation needs',
      popular: '⭐ POPULAR',
      perMonth: '€/month',
      creditsPerMonth: 'credits/month',
      currentPlan: 'Current plan',
      changePlan: 'Change plan',
      choosePlan: 'Choose this plan',
      loading: 'Loading...',
      paymentInfo: '💳 All payments are secure and can be cancelled at any time',
      helpText: 'Need help choosing?',
      contactUs: 'Contact us',
      plans: {
        free: {
          name: 'Free',
          features: [
            '3 formats (LinkedIn, Instagram, TikTok)',
            '4 tones (Professional, Casual, Engaging, Storytelling)',
            '3 languages (FR, EN, ES)',
            'History (last 7 days)',
            'Community support'
          ]
        },
        starter: {
          name: 'Starter',
          features: [
            'All 6 formats',
            '4 tones available',
            '3 languages (FR, EN, ES)',
            'Complete history (unlimited)',
            'Content export',
            'Email support (48h)'
          ]
        },
        pro: {
          name: 'Pro',
          features: [
            'All 6 formats',
            '4 tones available',
            '3 languages (FR, EN, ES)',
            'Complete history',
            'Content export',
            'Detailed analytics',
            '3 variants per request',
            'Hashtag suggestions',
            '2 users per account',
            'Email support (24h)'
          ]
        },
        business: {
          name: 'Business',
          features: [
            'Everything in Pro +',
            '5 users per account',
            'API access',
            'Additional credits (€0.08/credit)',
            'Tone customization',
            'Bulk export (CSV, JSON)',
            'Priority support (12h) + chat'
          ]
        }
      }
    },
    es: {
      title: 'Elige tu plan',
      subtitle: 'Soluciones adaptadas a todas tus necesidades de creación de contenido',
      popular: '⭐ POPULAR',
      perMonth: '€/mes',
      creditsPerMonth: 'créditos/mes',
      currentPlan: 'Plan actual',
      changePlan: 'Cambiar plan',
      choosePlan: 'Elegir este plan',
      loading: 'Cargando...',
      paymentInfo: '💳 Todos los pagos son seguros y pueden cancelarse en cualquier momento',
      helpText: '¿Necesitas ayuda para elegir?',
      contactUs: 'Contáctanos',
      plans: {
        free: {
          name: 'Gratis',
          features: [
            '5 formatos (LinkedIn, TikTok, Email, Humor, Instagram Story)',
            '3 tonos (Profesional, Casual, Atractivo)',
            '3 idiomas (FR, EN, ES)',
            'Historial (últimos 7 días)',
            'Exportar contenidos',
            'Analytics básicos',
            '1 variante por formato',
            'Soporte comunitario'
          ]
        },
        starter: {
          name: 'Starter',
          features: [
            'Todas las plataformas',
            'Mismos 3 tonos que Free',
            '3 idiomas (FR, EN, ES)',
            'Historial completo (ilimitado)',
            'Exportar contenidos',
            'Soporte por email (48h)',
            'Analytics',
            'Variantes múltiples'
          ]
        },
        pro: {
          name: 'Pro',
          features: [
            'Todas las plataformas',
            'Todos los tonos disponibles',
            '3 idiomas (FR, EN, ES)',
            'Historial completo',
            'Exportar contenidos',
            'Analytics detalladas',
            '3 variantes por solicitud',
            'Sugerencias de hashtags',
            '2 usuarios por cuenta',
            'Soporte por email (24h)'
          ]
        },
        business: {
          name: 'Business',
          features: [
            'Todo del plan Pro +',
            '5 usuarios por cuenta',
            'Acceso API',
            'Créditos adicionales (0.08€/crédito)',
            'Personalización de tonos',
            'Exportación masiva (CSV, JSON)',
            'Soporte prioritario (12h) + chat'
          ]
        }
      }
    }
  };

  const t = translations[language] || translations.fr;

  const plans = [
    {
      key: 'free',
      name: t.plans.free.name,
      icon: Sparkles,
      price: '0',
      credits: '3',
      color: 'from-slate-500 to-slate-600',
      popular: false,
      features: t.plans.free.features.map((text, idx) => ({
        text,
        included: idx < 4
      }))
    },
    {
      key: 'starter',
      name: t.plans.starter.name,
      icon: Rocket,
      price: '7.99',
      credits: '40',
      color: 'from-purple-500 to-purple-600',
      popular: false,
      features: t.plans.starter.features.map((text, idx) => ({
        text,
        included: idx < 6
      }))
    },
    {
      key: 'pro',
      name: t.plans.pro.name,
      icon: Briefcase,
      price: '17.99',
      credits: '150',
      color: 'from-blue-500 to-blue-600',
      popular: true,
      features: t.plans.pro.features.map((text) => ({
        text,
        included: true
      }))
    },
    {
      key: 'business',
      name: t.plans.business.name,
      icon: Building2,
      price: '44.99',
      credits: '500',
      color: 'from-pink-500 to-pink-600',
      popular: false,
      features: t.plans.business.features.map((text) => ({
        text,
        included: true
      }))
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

    // Redirect to checkout page
    navigate(`/checkout?plan=${planValue}&planName=${encodeURIComponent(plan.name)}&price=${plan.price}`);
  };

  return (
    <section id="tarifs" className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {success && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl max-w-2xl mx-auto shadow-lg">
            <p className="font-semibold">✅ {success}</p>
          </div>
        )}

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl max-w-2xl mx-auto shadow-lg">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = user && user.current_plan === plan.key;

            return (
              <div
                key={plan.key}
                className={`relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-purple-500 ring-offset-4' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 text-sm font-bold rounded-bl-2xl">
                    {t.popular}
                  </div>
                )}

                <div className="p-8">
                  {/* Icon & Name */}
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-2">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                      <span className="text-xl text-slate-600 dark:text-slate-400 ml-2">{t.perMonth}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {plan.credits} {t.creditsPerMonth}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-slate-300 mr-2 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button
                    onClick={() => handleChoosePlan(plan.key)}
                    disabled={isCurrentPlan}
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all text-white shadow-lg ${
                      isCurrentPlan
                        ? 'bg-slate-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${plan.color} hover:shadow-2xl hover:scale-105`
                    }`}
                  >
                    {isCurrentPlan ? (
                      t.currentPlan
                    ) : user ? (
                      t.changePlan
                    ) : (
                      t.choosePlan
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {t.paymentInfo}
          </p>
          <p className="text-sm text-slate-500">
            {t.helpText} <a href="mailto:mathdu0609@gmail.com?subject=Aide%20pour%20choisir%20un%20plan%20AI%20Content%20Polisher" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">{t.contactUs}</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
