export const site = {
  name: "Municip'All",
  tagline: "La plateforme citoyenne des communes connectées",
  description:
    "Application mobile, backoffice mairie et pilotage : rapprochez votre commune des habitants avec une solution clé en main, en marque blanche.",
  email: "contact@municipall.fr",
  phone: "+33 1 84 80 00 00",
};

export const navLinks = [
  { href: "#solution", label: "Solution" },
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#contact", label: "Contact" },
] as const;

export const heroStats = [
  { value: "1 app", label: "pour vos citoyens" },
  { value: "1 backoffice", label: "pour vos équipes" },
  { value: "100 %", label: "marque blanche" },
] as const;

export const features = [
  {
    title: "Signalements géolocalisés",
    description:
      "Voirie, éclairage, propreté, sécurité… Les habitants signalent en photo sur la carte, vous traitez et répondez en temps réel.",
    icon: "map-pin" as const,
  },
  {
    title: "Contact & suggestions",
    description:
      "Questions, idées d'amélioration, suivi conversationnel : un canal direct entre citoyens et mairie, structuré et traçable.",
    icon: "messages" as const,
  },
  {
    title: "Vie locale & commune",
    description:
      "Fiche de la commune, associations, événements, travaux, transports : toute l'info utile au quotidien dans une seule app.",
    icon: "landmark" as const,
  },
  {
    title: "Backoffice de modération",
    description:
      "File d'attente unifiée, statuts, archives, chat agent–citoyen : vos équipes gèrent signalements, questions et suggestions.",
    icon: "shield" as const,
  },
  {
    title: "Pilotage & satisfaction",
    description:
      "Tableau de bord, KPIs, avis citoyens après clôture : le maire pilote la qualité de service avec des données réelles.",
    icon: "chart" as const,
  },
  {
    title: "Marque blanche",
    description:
      "Couleurs, blason, contenus : chaque commune dispose de son identité visuelle et de son espace dédié.",
    icon: "palette" as const,
  },
] as const;

export const steps = [
  {
    step: "01",
    title: "Déploiement sur-mesure",
    description:
      "Nous configurons votre commune : identité visuelle, modules activés, formation de vos équipes.",
  },
  {
    step: "02",
    title: "Adoption citoyenne",
    description:
      "Vos habitants téléchargent l'app, signalent, posent des questions et suivent les réponses de la mairie.",
  },
  {
    step: "03",
    title: "Amélioration continue",
    description:
      "Vous analysez les retours, ajustez vos processus et renforcez la confiance avec la commune.",
  },
] as const;

export const pricingPlans = [
  {
    id: "essentiel",
    name: "Essentiel",
    audience: "Communes jusqu'à 5 000 habitants",
    price: "À partir de 199 €",
    period: "/ mois HT",
    highlight: false,
    features: [
      "Application mobile marque blanche",
      "Signalements & contact citoyen",
      "Backoffice modération (2 comptes)",
      "Tableau de bord & alertes",
      "Support email",
    ],
    cta: "Demander un devis",
  },
  {
    id: "pro",
    name: "Pro",
    audience: "Communes 5 000 à 30 000 habitants",
    price: "À partir de 449 €",
    period: "/ mois HT",
    highlight: true,
    features: [
      "Tout Essentiel, plus :",
      "Suggestions & suivi avancé",
      "Notifications ciblées",
      "Comptes équipe illimités",
      "KPIs satisfaction & pilotage maire",
      "Accompagnement au lancement",
    ],
    cta: "Demander un devis",
  },
  {
    id: "collectivite",
    name: "Collectivité",
    audience: "Agglos, métropoles, intercommunalités",
    price: "Sur devis",
    period: "",
    highlight: false,
    features: [
      "Multi-communes & gouvernance",
      "Intégrations sur mesure",
      "SLA & support prioritaire",
      "Formation & ateliers équipes",
      "Évolutions produit dédiées",
    ],
    cta: "Nous contacter",
  },
] as const;

export const faqs = [
  {
    q: "Faut-il développer une application par commune ?",
    a: "Non. Municip'All est une plateforme unique : chaque commune dispose de son espace, de sa marque et de ses données, sans développement spécifique.",
  },
  {
    q: "Les données sont-elles hébergées en France ?",
    a: "Oui. Nous privilégions un hébergement souverain et conforme au RGPD, avec cloisonnement strict par commune.",
  },
  {
    q: "Combien de temps pour être en ligne ?",
    a: "En général 2 à 4 semaines selon la personnalisation et la taille de votre collectivité.",
  },
] as const;
