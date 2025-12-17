import { useLanguage } from '../contexts/LanguageContext';

export default function TermsOfService() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Conditions Générales d'Utilisation",
      lastUpdated: "Dernière mise à jour : 17 décembre 2024",
      sections: [
        {
          title: "1. Acceptation des conditions",
          content: "En accédant et en utilisant AI Content Polisher, vous acceptez d'être lié par ces Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service."
        },
        {
          title: "2. Description du service",
          content: "AI Content Polisher est un service SaaS de génération et d'optimisation de contenu utilisant l'intelligence artificielle. Le service permet de créer du contenu adapté à différentes plateformes (LinkedIn, TikTok, Email, etc.) dans différents tons et langues."
        },
        {
          title: "3. Inscription et compte",
          content: "Pour utiliser le service, vous devez :",
          list: [
            "Créer un compte avec des informations exactes et à jour",
            "Être âgé d'au moins 18 ans",
            "Maintenir la confidentialité de vos identifiants",
            "Être responsable de toutes les activités sur votre compte",
            "Nous informer immédiatement de toute utilisation non autorisée"
          ]
        },
        {
          title: "4. Plans et paiements",
          content: "Nous proposons différents plans d'abonnement :",
          list: [
            "Plan gratuit : 3 crédits, 5 formats disponibles",
            "Plan Starter : 7,99€/mois, 40 crédits",
            "Plan Pro : 17,99€/mois, 150 crédits",
            "Plan Business : 44,99€/mois, 500 crédits",
            "Les paiements sont traités par Stripe de manière sécurisée",
            "Les abonnements se renouvellent automatiquement",
            "Vous pouvez annuler à tout moment sans frais",
            "Aucun remboursement pour les périodes partielles"
          ]
        },
        {
          title: "5. Utilisation acceptable",
          content: "Vous vous engagez à :",
          list: [
            "Ne pas utiliser le service à des fins illégales",
            "Ne pas générer de contenu haineux, diffamatoire ou offensant",
            "Ne pas tenter de contourner les limitations de crédit",
            "Ne pas partager votre compte avec d'autres personnes",
            "Ne pas utiliser le service pour spammer ou harceler",
            "Respecter les droits de propriété intellectuelle"
          ]
        },
        {
          title: "6. Propriété intellectuelle",
          content: "Le contenu généré par l'IA vous appartient. Vous êtes libre de l'utiliser commercialement. Cependant, le code source, le design et la technologie d'AI Content Polisher restent notre propriété exclusive."
        },
        {
          title: "7. Limitations et garanties",
          content: "Le service est fourni \"en l'état\" :",
          list: [
            "Nous ne garantissons pas que le service sera ininterrompu",
            "Nous ne garantissons pas l'exactitude du contenu généré",
            "Vous êtes responsable de vérifier et valider le contenu avant publication",
            "Nous ne sommes pas responsables des dommages résultant de l'utilisation du contenu généré"
          ]
        },
        {
          title: "8. Résiliation",
          content: "Nous nous réservons le droit de suspendre ou résilier votre compte si :",
          list: [
            "Vous violez ces conditions d'utilisation",
            "Vous utilisez le service de manière abusive",
            "Votre paiement échoue de manière répétée",
            "Pour toute autre raison légitime avec préavis"
          ]
        },
        {
          title: "9. Modification du service",
          content: "Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou partie du service à tout moment, avec ou sans préavis."
        },
        {
          title: "10. Limitation de responsabilité",
          content: "Dans toute la mesure permise par la loi, nous ne serons pas responsables des dommages indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le service."
        },
        {
          title: "11. Droit applicable",
          content: "Ces conditions sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris, France."
        },
        {
          title: "12. Contact",
          content: "Pour toute question concernant ces conditions :",
          list: [
            "Email : mathdu0609@gmail.com"
          ]
        }
      ]
    },
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated: December 17, 2024",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: "By accessing and using AI Content Polisher, you agree to be bound by these Terms of Service. If you do not accept these terms, please do not use the service."
        },
        {
          title: "2. Service Description",
          content: "AI Content Polisher is a SaaS service for content generation and optimization using artificial intelligence. The service allows you to create content adapted to different platforms (LinkedIn, TikTok, Email, etc.) in different tones and languages."
        },
        {
          title: "3. Registration and Account",
          content: "To use the service, you must:",
          list: [
            "Create an account with accurate and up-to-date information",
            "Be at least 18 years old",
            "Maintain confidentiality of your credentials",
            "Be responsible for all activities on your account",
            "Notify us immediately of any unauthorized use"
          ]
        },
        {
          title: "4. Plans and Payments",
          content: "We offer different subscription plans:",
          list: [
            "Free plan: 3 credits, 5 formats available",
            "Starter plan: €7.99/month, 40 credits",
            "Pro plan: €17.99/month, 150 credits",
            "Business plan: €44.99/month, 500 credits",
            "Payments are securely processed by Stripe",
            "Subscriptions renew automatically",
            "You can cancel anytime without fees",
            "No refunds for partial periods"
          ]
        },
        {
          title: "5. Acceptable Use",
          content: "You agree to:",
          list: [
            "Not use the service for illegal purposes",
            "Not generate hateful, defamatory or offensive content",
            "Not attempt to bypass credit limitations",
            "Not share your account with others",
            "Not use the service for spam or harassment",
            "Respect intellectual property rights"
          ]
        },
        {
          title: "6. Intellectual Property",
          content: "AI-generated content belongs to you. You are free to use it commercially. However, the source code, design and technology of AI Content Polisher remain our exclusive property."
        },
        {
          title: "7. Limitations and Warranties",
          content: "The service is provided \"as is\":",
          list: [
            "We do not guarantee uninterrupted service",
            "We do not guarantee accuracy of generated content",
            "You are responsible for verifying and validating content before publishing",
            "We are not liable for damages resulting from use of generated content"
          ]
        },
        {
          title: "8. Termination",
          content: "We reserve the right to suspend or terminate your account if:",
          list: [
            "You violate these terms of use",
            "You use the service abusively",
            "Your payment fails repeatedly",
            "For any other legitimate reason with notice"
          ]
        },
        {
          title: "9. Service Modification",
          content: "We reserve the right to modify, suspend or discontinue all or part of the service at any time, with or without notice."
        },
        {
          title: "10. Limitation of Liability",
          content: "To the fullest extent permitted by law, we will not be liable for indirect, incidental, special or consequential damages resulting from the use or inability to use the service."
        },
        {
          title: "11. Governing Law",
          content: "These terms are governed by French law. Any dispute will be submitted to the competent courts of Paris, France."
        },
        {
          title: "12. Contact",
          content: "For any questions regarding these terms:",
          list: [
            "Email: mathdu0609@gmail.com"
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
              Ces conditions d'utilisation sont complétées par notre{' '}
              <a href="/privacy" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                Politique de Confidentialité
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
