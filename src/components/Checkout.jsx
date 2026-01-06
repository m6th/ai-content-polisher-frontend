import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ArrowLeft, Lock, CreditCard } from 'lucide-react';
import { createPaymentIntent } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

// Composant interne pour le formulaire de paiement
function CheckoutForm({ planPrice, billing, language, email, plan }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Build return URL based on whether this is a guest checkout
      const successUrl = email
        ? `${window.location.origin}/login?success=true&email=${encodeURIComponent(email)}&plan=${plan}`
        : `${window.location.origin}/pricing?success=true`;

      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: successUrl,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message);
        setProcessing(false);
      } else {
        // Payment réussi - redirection
        navigate(email ? `/login?success=true&email=${encodeURIComponent(email)}&plan=${plan}` : '/pricing?success=true');
      }
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  const translations = {
    fr: {
      processing: 'Traitement en cours...',
      pay: 'Payer maintenant',
      secure: 'Paiement 100% sécurisé',
      guarantee: 'Annulation possible à tout moment'
    },
    en: {
      processing: 'Processing...',
      pay: 'Pay now',
      secure: '100% secure payment',
      guarantee: 'Cancel anytime'
    },
    es: {
      processing: 'Procesando...',
      pay: 'Pagar ahora',
      secure: 'Pago 100% seguro',
      guarantee: 'Cancelar en cualquier momento'
    }
  };

  const t = translations[language] || translations.fr;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Payment Element */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        <PaymentElement
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            }
          }}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-[#635BFF] hover:bg-[#5851ea] text-white font-semibold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-base"
      >
        {processing ? t.processing : `${t.pay} ${planPrice}€`}
      </button>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>{t.secure}</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span>{t.guarantee}</span>
        </div>
      </div>
    </form>
  );
}

// Composant principal de la page Checkout
export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { isDark } = useTheme();

  const plan = searchParams.get('plan');
  const planName = searchParams.get('planName');
  const planPrice = searchParams.get('price');
  const billing = searchParams.get('billing') || 'monthly'; // monthly or annual
  const email = searchParams.get('email'); // Guest checkout support

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!plan) {
      navigate('/pricing');
      return;
    }
    initializePayment();
  }, [plan, navigate]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (email) {
        // Guest checkout - unauthenticated payment
        response = await axios.post('http://127.0.0.1:8000/stripe/create-payment-intent-guest',
          { plan, billing },
          { params: { email } }
        );
      } else {
        // Authenticated checkout
        response = await createPaymentIntent(plan, billing);
      }

      if (!response.data.publishable_key) {
        throw new Error('Configuration Stripe manquante');
      }

      // Charger Stripe
      const stripe = await loadStripe(response.data.publishable_key);
      if (!stripe) {
        throw new Error('Erreur lors du chargement de Stripe');
      }

      setStripePromise(stripe);
      setClientSecret(response.data.client_secret);
      setLoading(false);
    } catch (err) {
      console.error('Error initializing payment:', err);
      setError(err.response?.data?.detail || err.message || 'Erreur lors de l\'initialisation du paiement');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/pricing');
  };

  const translations = {
    fr: {
      title: 'Finaliser votre abonnement',
      loading: 'Chargement du formulaire de paiement...',
      orderSummary: 'Récapitulatif',
      plan: 'Plan',
      price: 'Prix',
      perMonth: '/mois',
      perYear: '/an',
      total: 'Total aujourd\'hui',
      oneTimePayment: '(paiement unique)',
      monthlyPayment: '(paiement mensuel)'
    },
    en: {
      title: 'Complete your subscription',
      loading: 'Loading payment form...',
      orderSummary: 'Order Summary',
      plan: 'Plan',
      price: 'Price',
      perMonth: '/month',
      perYear: '/year',
      total: 'Total today',
      oneTimePayment: '(one-time payment)',
      monthlyPayment: '(monthly payment)'
    },
    es: {
      title: 'Completar su suscripción',
      loading: 'Cargando formulario de pago...',
      orderSummary: 'Resumen',
      plan: 'Plan',
      price: 'Precio',
      perMonth: '/mes',
      perYear: '/año',
      total: 'Total hoy',
      oneTimePayment: '(pago único)',
      monthlyPayment: '(pago mensual)'
    }
  };

  const t = translations[language] || translations.fr;

  const options = {
    clientSecret,
    appearance: {
      theme: 'flat',
      variables: {
        colorPrimary: '#635BFF',
        colorBackground: isDark ? '#1f2937' : '#ffffff',
        colorText: isDark ? '#f9fafb' : '#30313d',
        colorDanger: '#df1b41',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
        fontSizeBase: '16px',
        fontWeightNormal: '400',
        fontWeightMedium: '500',
        fontWeightBold: '600',
      },
      rules: {
        '.Input': {
          border: isDark ? '1.5px solid #374151' : '1.5px solid #e0e0e0',
          backgroundColor: isDark ? '#111827' : '#ffffff',
          color: isDark ? '#f9fafb' : '#30313d',
          boxShadow: 'none',
          padding: '14px 12px',
          fontSize: '16px',
        },
        '.Input:focus': {
          border: '1.5px solid #635BFF',
          boxShadow: '0 0 0 3px rgba(99, 91, 255, 0.1)',
          outline: 'none',
        },
        '.Label': {
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px',
          color: isDark ? '#f9fafb' : '#30313d',
        },
        '.Tab': {
          border: isDark ? '1.5px solid #374151' : '1.5px solid #e0e0e0',
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#f9fafb' : '#30313d',
          boxShadow: 'none',
        },
        '.Tab:hover': {
          border: '1.5px solid #635BFF',
        },
        '.Tab--selected': {
          border: '1.5px solid #635BFF',
          backgroundColor: isDark ? '#111827' : '#f8f9fa',
          boxShadow: '0 0 0 3px rgba(99, 91, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux plans</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t.orderSummary}
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 dark:text-gray-400">{t.plan}</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-right">
                    {planName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t.price}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {planPrice}€{billing === 'annual' ? t.perYear : t.perMonth}
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">{t.total}</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {planPrice}€
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {billing === 'annual' ? t.oneTimePayment : t.monthlyPayment}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                {t.title}
              </h1>

              {loading && (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    {t.loading}
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {!loading && !error && stripePromise && clientSecret && (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm
                    planPrice={planPrice}
                    billing={billing}
                    language={language}
                    email={email}
                    plan={plan}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
