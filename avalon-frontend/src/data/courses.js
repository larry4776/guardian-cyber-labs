export const courses = [
  {
    id: 1,
    title: "Hacking Éthique & Pentest : Les Fondations",
    price: 25000,
    isFree: false,
    category: "Hacking Offensif",
    description: "Apprenez les bases de l'audit de sécurité et de l'exploitation de failles.",
    lessons: [
      { id: 1, title: "Introduction au programme", locked: false },
      { id: 2, title: "Configuration du lab pfSense", locked: true }
    ]
  },
  {
    id: 2,
    title: "Sécurisation des Architectures Réseaux & pfSense",
    price: 40000,
    isFree: false,
    category: "Réseau & Défense",
    description: "Maîtrisez le durcissement des équipements réseaux et la gestion des flux en milieu hostile.",
    lessons: [
      { id: 1, title: "Bases de la segmentation", locked: false },
      { id: 2, title: "Audit de pare-feu", locked: true }
    ]
  },
  {
    id: 3,
    title: "Hygiène Numérique",
    price: 0,
    isFree: true,
    category: "Réseau & Défense",
    description: "Les bonnes pratiques pour sécuriser votre environnement de travail personnel.",
    lessons: [
      { id: 1, title: "Gestion des mots de passe", locked: false },
      { id: 2, title: "Chiffrement des données", locked: false }
    ]
  }
];