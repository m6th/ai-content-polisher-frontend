import { useLanguage } from '../contexts/LanguageContext';

export default function PrivacyPolicy() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Politique de confidentialité",
      lastUpdated: "Dernière mise à jour : 17 décembre 2024",
      sections: [
        {
          title: "1. Introduction",
          content: "AI Content Polisher (\"nous\", \"notre\" ou \"nos\") s'engage à protéger la confidentialité de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations."
        },
        {
          title: "2. Données collectées",
          content: "Nous collectons les informations suivantes :",
          list: [
            "Informations de compte : nom, adresse email",
            "Données d'utilisation : contenu généré, historique des générations",
            "Données de paiement : gérées de manière sécurisée par Stripe (nous ne stockons pas vos coordonnées bancaires)",
            "Données techniques : adresse IP, type de navigateur, système d'exploitation",
            "Cookies : pour maintenir votre session et améliorer l'expérience utilisateur"
          ]
        },
        {
          title: "3. Utilisation des données",
          content: "Vos données sont utilisées pour :",
          list: [
            "Fournir et améliorer nos services",
            "Gérer votre compte et vos abonnements",
            "Communiquer avec vous (support, mises à jour)",
            "Analyser l'utilisation du service pour l'améliorer",
            "Respecter nos obligations légales"
          ]
        },
        {
          title: "4. Partage des données",
          content: "Nous ne vendons jamais vos données. Nous partageons vos informations uniquement avec :",
          list: [
            "Stripe : pour le traitement des paiements",
            "Groq : pour la génération de contenu IA",
            "Google : si vous utilisez Google OAuth pour la connexion",
            "Hébergeurs : Render (backend) et Vercel (frontend) pour l'infrastructure"
          ]
        },
        {
          title: "5. Vos droits (RGPD)",
          content: "Conformément au RGPD, vous avez le droit de :",
          list: [
            "Accéder à vos données personnelles",
            "Rectifier vos données inexactes",
            "Supprimer vos données (droit à l'oubli)",
            "Limiter le traitement de vos données",
            "Portabilité de vos données",
            "Vous opposer au traitement de vos données",
            "Retirer votre consentement à tout moment"
          ]
        },
        {
          title: "6. Suppression de compte",
          content: "Vous pouvez supprimer votre compte à tout moment depuis la page \"Mon compte\". La suppression est immédiate et irréversible. Toutes vos données personnelles seront définitivement supprimées dans un délai de 30 jours."
        },
        {
          title: "7. Sécurité",
          content: "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction."
        },
        {
          title: "8. Conservation des données",
          content: "Nous conservons vos données aussi longtemps que votre compte est actif ou selon les besoins pour vous fournir nos services. Après suppression du compte, les données sont supprimées dans un délai de 30 jours, sauf obligations légales."
        },
        {
          title: "9. Cookies",
          content: "Nous utilisons des cookies essentiels pour le fonctionnement du service (authentification, préférences). Vous pouvez désactiver les cookies dans votre navigateur, mais cela peut affecter les fonctionnalités du site."
        },
        {
          title: "10. Modifications",
          content: "Nous pouvons modifier cette politique de confidentialité. Les modifications importantes vous seront notifiées par email. L'utilisation continue du service après modification vaut acceptation."
        },
        {
          title: "11. Contact",
          content: "Pour toute question concernant vos données personnelles ou pour exercer vos droits :",
          list: [
            "Email : mathdu0609@gmail.com",
            "Réponse sous 48h maximum"
          ]
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: December 17, 2024",
      sections: [
        {
          title: "1. Introduction",
          content: "AI Content Polisher (\"we\", \"our\" or \"us\") is committed to protecting your personal data privacy. This privacy policy explains how we collect, use and protect your information."
        },
        {
          title: "2. Data Collected",
          content: "We collect the following information:",
          list: [
            "Account information: name, email address",
            "Usage data: generated content, generation history",
            "Payment data: securely managed by Stripe (we do not store your bank details)",
            "Technical data: IP address, browser type, operating system",
            "Cookies: to maintain your session and improve user experience"
          ]
        },
        {
          title: "3. Use of Data",
          content: "Your data is used to:",
          list: [
            "Provide and improve our services",
            "Manage your account and subscriptions",
            "Communicate with you (support, updates)",
            "Analyze service usage for improvement",
            "Comply with legal obligations"
          ]
        },
        {
          title: "4. Data Sharing",
          content: "We never sell your data. We only share your information with:",
          list: [
            "Stripe: for payment processing",
            "Groq: for AI content generation",
            "Google: if you use Google OAuth for login",
            "Hosting providers: Render (backend) and Vercel (frontend) for infrastructure"
          ]
        },
        {
          title: "5. Your Rights (GDPR)",
          content: "Under GDPR, you have the right to:",
          list: [
            "Access your personal data",
            "Rectify inaccurate data",
            "Delete your data (right to be forgotten)",
            "Restrict processing of your data",
            "Data portability",
            "Object to data processing",
            "Withdraw consent at any time"
          ]
        },
        {
          title: "6. Account Deletion",
          content: "You can delete your account at any time from the \"My Account\" page. Deletion is immediate and irreversible. All your personal data will be permanently deleted within 30 days."
        },
        {
          title: "7. Security",
          content: "We implement appropriate technical and organizational security measures to protect your data against unauthorized access, modification, disclosure or destruction."
        },
        {
          title: "8. Data Retention",
          content: "We retain your data as long as your account is active or as needed to provide our services. After account deletion, data is deleted within 30 days, except for legal obligations."
        },
        {
          title: "9. Cookies",
          content: "We use essential cookies for service operation (authentication, preferences). You can disable cookies in your browser, but this may affect site functionality."
        },
        {
          title: "10. Changes",
          content: "We may modify this privacy policy. Significant changes will be notified by email. Continued use of the service after modification constitutes acceptance."
        },
        {
          title: "11. Contact",
          content: "For any questions regarding your personal data or to exercise your rights:",
          list: [
            "Email: mathdu0609@gmail.com",
            "Response within 48h maximum"
          ]
        }
      ]
    }
  };

  const t = content[language] || content.fr;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t.lastUpdated}
          </p>

          <div className="space-y-8">
            {t.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {section.content}
                </p>
                {section.list && (
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cette politique de confidentialité fait partie intégrante de nos{' '}
              <a href="/terms" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                Conditions Générales d'Utilisation
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
