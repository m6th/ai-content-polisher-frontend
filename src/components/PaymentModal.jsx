import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X } from 'lucide-react';
import { createPaymentIntent } from '../services/api';

// Composant interne qui utilise les hooks Stripe
function CheckoutForm({ plan, planName, onSuccess, onCancel, language }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/pricing?success=true`,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message);
        setProcessing(false);
      } else {
        // Payment réussi
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  const translations = {
    fr: {
      title: 'Finaliser le paiement',
      processing: 'Traitement en cours...',
      pay: 'Payer',
      cancel: 'Annuler'
    },
    en: {
      title: 'Complete payment',
      processing: 'Processing...',
      pay: 'Pay',
      cancel: 'Cancel'
    },
    es: {
      title: 'Completar pago',
      processing: 'Procesando...',
      pay: 'Pagar',
      cancel: 'Cancelar'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {planName}
        </p>
      </div>

      <PaymentElement />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? t.processing : t.pay}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.cancel}
        </button>
      </div>
    </form>
  );
}

// Composant principal Modal
export default function PaymentModal({ isOpen, onClose, plan, planName, language = 'fr' }) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && plan) {
      initializePayment();
    }
  }, [isOpen, plan]);

  const initializePayment = async () => {
    if (!plan) {
      console.error('No plan specified');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Créer le payment intent
      const response = await createPaymentIntent(plan);

      if (!response.data.publishable_key) {
        throw new Error('No publishable key received');
      }

      // Charger Stripe avec la clé publique
      const stripe = await loadStripe(response.data.publishable_key);

      if (!stripe) {
        throw new Error('Failed to load Stripe');
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

  const handleSuccess = () => {
    // Recharger la page pour mettre à jour les crédits
    window.location.href = '/pricing?success=true';
  };

  const handleClose = () => {
    setClientSecret(null);
    setStripePromise(null);
    onClose();
  };

  if (!isOpen) return null;

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#9333ea',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '12px',
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Paiement sécurisé
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Chargement...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!loading && !error && stripePromise && clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm
                plan={plan}
                planName={planName}
                onSuccess={handleSuccess}
                onCancel={handleClose}
                language={language}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
