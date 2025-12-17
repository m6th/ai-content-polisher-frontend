import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();

  const translations = {
    fr: {
      product: 'Produit',
      pricing: 'Tarifs',
      features: 'Fonctionnalités',
      legal: 'Légal',
      privacy: 'Confidentialité',
      terms: 'CGU',
      legalNotice: 'Mentions légales',
      contact: 'Contact',
      email: 'Email',
      support: 'Support',
      rights: '© 2024 AI Content Polisher. Tous droits réservés.',
      madeWith: 'Créé avec',
      by: 'par'
    },
    en: {
      product: 'Product',
      pricing: 'Pricing',
      features: 'Features',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms',
      legalNotice: 'Legal Notice',
      contact: 'Contact',
      email: 'Email',
      support: 'Support',
      rights: '© 2024 AI Content Polisher. All rights reserved.',
      madeWith: 'Made with',
      by: 'by'
    },
    es: {
      product: 'Producto',
      pricing: 'Precios',
      features: 'Características',
      legal: 'Legal',
      privacy: 'Privacidad',
      terms: 'Términos',
      legalNotice: 'Aviso Legal',
      contact: 'Contacto',
      email: 'Email',
      support: 'Soporte',
      rights: '© 2024 AI Content Polisher. Todos los derechos reservados.',
      madeWith: 'Hecho con',
      by: 'por'
    }
  };

  const t = translations[language] || translations.fr;

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Content Polisher
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t.madeWith} ❤️ {t.by} Mathieu Durand
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t.product}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  {t.pricing}
                </Link>
              </li>
              <li>
                <Link to="/#features" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  {t.features}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t.legal}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  {t.legalNotice}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t.contact}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:mathdu0609@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  {t.support}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
