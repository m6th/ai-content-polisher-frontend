import { useLanguage } from '../contexts/LanguageContext';

export default function LegalNotice() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Mentions Légales",
      lastUpdated: "Dernière mise à jour : 17 décembre 2024",
      sections: [
        {
          title: "1. Éditeur du site",
          content: "Le site aicontentpolisher.com est édité par :",
          list: [
            "Mathieu Durand",
            "Email : mathdu0609@gmail.com",
            "Auto-entrepreneur / Indépendant"
          ]
        },
        {
          title: "2. Hébergement",
          content: "Le site est hébergé par :",
          subsections: [
            {
              subtitle: "Backend :",
              list: [
                "Render",
                "525 Brannan Street, Suite 300",
                "San Francisco, CA 94107, USA",
                "https://render.com"
              ]
            },
            {
              subtitle: "Frontend :",
              list: [
                "Vercel Inc.",
                "340 S Lemon Ave #4133",
                "Walnut, CA 91789, USA",
                "https://vercel.com"
              ]
            }
          ]
        },
        {
          title: "3. Données personnelles",
          content: "Pour toute information concernant la collecte et le traitement de vos données personnelles, veuillez consulter notre Politique de Confidentialité."
        },
        {
          title: "4. Propriété intellectuelle",
          content: "L'ensemble du contenu du site (textes, images, logos, design) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite. Le contenu généré par l'IA appartient aux utilisateurs."
        },
        {
          title: "5. Responsabilité",
          content: "Nous nous efforçons de fournir des informations exactes et à jour, mais ne pouvons garantir l'absence d'erreurs. Le contenu généré par l'IA est fourni \"en l'état\" et vous êtes responsable de sa vérification avant utilisation."
        },
        {
          title: "6. Cookies",
          content: "Le site utilise des cookies essentiels pour son fonctionnement (authentification, préférences utilisateur). En utilisant le site, vous acceptez l'utilisation de ces cookies."
        },
        {
          title: "7. Services tiers",
          content: "Le site utilise les services suivants :",
          list: [
            "Stripe : traitement des paiements (https://stripe.com)",
            "Groq : génération de contenu IA (https://groq.com)",
            "Google OAuth : authentification (https://google.com)"
          ]
        },
        {
          title: "8. Droit applicable",
          content: "Le site est régi par le droit français. En cas de litige, les tribunaux français seront seuls compétents."
        },
        {
          title: "9. Contact",
          content: "Pour toute question concernant ces mentions légales :",
          list: [
            "Email : mathdu0609@gmail.com",
            "Site web : https://aicontentpolisher.com"
          ]
        }
      ]
    },
    en: {
      title: "Legal Notice",
      lastUpdated: "Last updated: December 17, 2024",
      sections: [
        {
          title: "1. Site Publisher",
          content: "The website aicontentpolisher.com is published by:",
          list: [
            "Mathieu Durand",
            "Email: mathdu0609@gmail.com",
            "Self-employed / Independent"
          ]
        },
        {
          title: "2. Hosting",
          content: "The site is hosted by:",
          subsections: [
            {
              subtitle: "Backend:",
              list: [
                "Render",
                "525 Brannan Street, Suite 300",
                "San Francisco, CA 94107, USA",
                "https://render.com"
              ]
            },
            {
              subtitle: "Frontend:",
              list: [
                "Vercel Inc.",
                "340 S Lemon Ave #4133",
                "Walnut, CA 91789, USA",
                "https://vercel.com"
              ]
            }
          ]
        },
        {
          title: "3. Personal Data",
          content: "For information regarding the collection and processing of your personal data, please consult our Privacy Policy."
        },
        {
          title: "4. Intellectual Property",
          content: "All site content (texts, images, logos, design) is protected by copyright. Any reproduction without authorization is prohibited. AI-generated content belongs to users."
        },
        {
          title: "5. Liability",
          content: "We strive to provide accurate and up-to-date information, but cannot guarantee the absence of errors. AI-generated content is provided \"as is\" and you are responsible for verifying it before use."
        },
        {
          title: "6. Cookies",
          content: "The site uses essential cookies for its operation (authentication, user preferences). By using the site, you accept the use of these cookies."
        },
        {
          title: "7. Third-party Services",
          content: "The site uses the following services:",
          list: [
            "Stripe: payment processing (https://stripe.com)",
            "Groq: AI content generation (https://groq.com)",
            "Google OAuth: authentication (https://google.com)"
          ]
        },
        {
          title: "8. Governing Law",
          content: "The site is governed by French law. In case of dispute, French courts shall have sole jurisdiction."
        },
        {
          title: "9. Contact",
          content: "For any questions regarding this legal notice:",
          list: [
            "Email: mathdu0609@gmail.com",
            "Website: https://aicontentpolisher.com"
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
                {section.subsections && (
                  <div className="space-y-4 mt-4">
                    {section.subsections.map((sub, subIndex) => (
                      <div key={subIndex} className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          {sub.subtitle}
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                          {sub.list.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pour plus d'informations, consultez notre{' '}
              <a href="/privacy" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                Politique de Confidentialité
              </a>
              {' '}et nos{' '}
              <a href="/terms" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                Conditions d'Utilisation
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
