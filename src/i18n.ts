import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "about": "About",
        "services": "Services",
        "portfolio": "Portfolio",
        "projects": "Projects",
        "blog": "Blog",
        "careers": "Careers",
        "contact": "Contact",
        "terminal": "Terminal",
        "privacy": "Privacy",
        "terms": "Terms"
      },
      "footer": {
        "tagline": "Engineering the future of structural excellence across Central Africa.",
        "company": "Company",
        "offices": "Offices",
        "contact": "Contact",
        "rights": "ALL RIGHTS RESERVED."
      },
      "chat": {
        "title": "MADECC Bot",
        "status": "Always Online",
        "welcome": "Hello! Welcome to MADECC Group. How can we help you build your dream project today?",
        "placeholder": "Type a message...",
        "typing": "Typing...",
        "accessGranted": "ACCESS GRANTED: Check your triage for confirmation."
      },
      "blog": {
        "title": "STRUCTURAL KNOWLEDGE.",
        "subtitle": "Engineering Insights",
        "description": "Deep dives into the technical milestones and methodologies that define the MADECC engineering signature.",
        "readMore": "Read Full Audit",
        "weeklyBrief": "WEEKLY STRUCTURAL BRIEFINGS.",
        "subscribeDesc": "Subscribe to our technical digest. Zero spam, just engineering data.",
        "subscribe": "Subscribe",
        "subscribed": "Subscribed",
        "accessGranted": "ACCESS GRANTED: Check your triage for confirmation."
      },
      "common": {
        "getStarted": "Get Started",
        "learnMore": "Learn More",
        "contactUs": "Contact Us",
        "viewPortfolio": "View Portfolios",
        "contactOffice": "Contact Office",
        "processing": "Processing..."
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "home": "Accueil",
        "about": "À Propos",
        "services": "Services",
        "portfolio": "Portfolio",
        "projects": "Projets",
        "blog": "Blog",
        "careers": "Carrières",
        "contact": "Contact",
        "terminal": "Terminal",
        "privacy": "Confidentialité",
        "terms": "Conditions"
      },
      "footer": {
        "tagline": "Façonner l'avenir de l'excellence structurelle en Afrique Centrale.",
        "company": "Entreprise",
        "offices": "Bureaux",
        "contact": "Contact",
        "rights": "TOUS DROITS RÉSERVÉS."
      },
      "chat": {
        "title": "MADECC Bot",
        "status": "Toujours en ligne",
        "welcome": "Bonjour ! Bienvenue chez MADECC Group. Comment pouvons-nous vous aider aujourd'hui ?",
        "placeholder": "Tapez un message...",
        "typing": "En train d'écrire...",
        "accessGranted": "ACCÈS ACCORDÉ : Vérifiez votre centre de tri."
      },
      "blog": {
        "title": "SAVOIR STRUCTUREL.",
        "subtitle": "Aperçus d'Ingénierie",
        "description": "Plongées profondes dans les jalons techniques et les méthodologies qui définissent la signature MADECC.",
        "readMore": "Lire l'Audit Complet",
        "weeklyBrief": "BREFINGS STRUCTURELS HEBDOMADAIRES.",
        "subscribeDesc": "Abonnez-vous à notre condensé technique. Zéro spam, juste des données.",
        "subscribe": "S'abonner",
        "subscribed": "Abonné",
        "accessGranted": "ACCÈS ACCORDÉ: Vérifiez votre centre de tri."
      },
      "common": {
        "getStarted": "Démarrer",
        "learnMore": "En savoir plus",
        "contactUs": "Contactez-nous",
        "viewPortfolio": "Voir les Portefeuilles",
        "contactOffice": "Contacter le Bureau",
        "processing": "Traitement..."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
