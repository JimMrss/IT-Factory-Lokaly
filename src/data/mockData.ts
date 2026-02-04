// Données mock pour l'application Lokaly

export const mockAnnonces = [
  {
    id: '1',
    titre: 'Prêt de tondeuse à gazon',
    description: 'Tondeuse électrique en bon état, disponible pour prêt aux voisins. Parfait pour petits jardins.',
    zone: 'Centre-ville',
    disponibilite: 'Week-ends',
    type: 'Prêt',
    image: 'https://images.unsplash.com/photo-1537877853655-34bdcda5e833?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1080&h=720&q=80',
    auteur: {
      nom: 'Marie Dubois',
      avatar: ''
    }
  },
  {
    id: '2',
    titre: 'Cours de couture gratuits',
    description: 'Je propose des cours de couture pour débutants. Amenez votre tissu et votre bonne humeur !',
    zone: 'Quartier Nord',
    disponibilite: 'Mercredis 14h-16h',
    type: 'Atelier',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1080&h=720&q=80',
    auteur: {
      nom: 'Sophie Martin',
      avatar: ''
    }
  },
  {
    id: '3',
    titre: 'Don de livres pour enfants',
    description: 'Collection de livres pour enfants (3-8 ans) en très bon état. À récupérer sur place.',
    zone: 'Quartier Sud',
    disponibilite: 'À convenir',
    type: 'Don',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1080&h=720&q=80',
    auteur: {
      nom: 'Pierre Leroy',
      avatar: ''
    }
  },
  {
    id: '4',
    titre: 'Aide au jardinage',
    description: 'Je propose mon aide pour entretenir les jardins des personnes âgées ou à mobilité réduite.',
    zone: 'Toute la commune',
    disponibilite: 'Samedis matin',
    type: 'Service',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1080&h=720&q=80',
    auteur: {
      nom: 'Lucas Bernard',
      avatar: ''
    }
  }
];

export const mockGroupes = [
  {
    id: '1',
    nom: 'Jardiniers du quartier',
    description: 'Échange de graines, conseils de jardinage et organisation de trocs de plants.',
    niveau: 3,
    membres: 28,
    categorie: 'Jardinage',
    annonces: ['1', '4']
  },
  {
    id: '2',
    nom: 'Couture & DIY',
    description: 'Apprenez la couture, le tricot et plein d\'autres activités créatives ensemble.',
    niveau: 2,
    membres: 15,
    categorie: 'Culture',
    annonces: ['2']
  },
  {
    id: '3',
    nom: 'Bibliothèque partagée',
    description: 'Échangez vos livres, BD et magazines avec les autres habitants.',
    niveau: 5,
    membres: 56,
    categorie: 'Culture',
    annonces: ['3']
  },
  {
    id: '4',
    nom: 'Sport ensemble',
    description: 'Organisation de sorties vélo, jogging et autres activités sportives collectives.',
    niveau: 2,
    membres: 19,
    categorie: 'Sport',
    annonces: []
  },
  {
    id: '5',
    nom: 'Repair Café',
    description: 'Réparons ensemble nos objets du quotidien plutôt que de les jeter.',
    niveau: 1,
    membres: 8,
    categorie: 'Bricolage',
    annonces: []
  }
];

export const mockCommunautes = [
  {
    id: '1',
    nom: 'Commune de Tori',
    habitants: 156,
    annonces: 47,
    groupes: 12
  },
  {
    id: '2',
    nom: 'Quartier des Fleurs',
    habitants: 89,
    annonces: 23,
    groupes: 7
  },
  {
    id: '3',
    nom: 'Village de Saint-Martin',
    habitants: 203,
    annonces: 61,
    groupes: 15
  }
];

// Liste des utilisateurs de la commune (créés par l'admin local)
export const mockUtilisateurs = [
  {
    id: '1',
    prenom: 'Julie',
    nom: 'Petit',
    identifiant: 'julie.petit',
    communaute: 'Commune de Tori',
    dateCreation: '2024-12-08',
    statut: 'actif'
  },
  {
    id: '2',
    prenom: 'Marc',
    nom: 'Durand',
    identifiant: 'marc.durand',
    communaute: 'Commune de Tori',
    dateCreation: '2024-12-09',
    statut: 'actif'
  },
  {
    id: '3',
    prenom: 'Emma',
    nom: 'Rousseau',
    identifiant: 'emma.rousseau',
    communaute: 'Village de Saint-Martin',
    dateCreation: '2024-12-10',
    statut: 'actif'
  },
  {
    id: '4',
    prenom: 'Marie',
    nom: 'Dubois',
    identifiant: 'marie.dubois',
    communaute: 'Commune de Tori',
    dateCreation: '2024-11-15',
    statut: 'actif'
  },
  {
    id: '5',
    prenom: 'Ancien',
    nom: 'Utilisateur',
    identifiant: 'ancien.user',
    communaute: 'Commune de Tori',
    dateCreation: '2024-06-01',
    statut: 'desactive' // Les utilisateurs ne sont jamais supprimés, juste désactivés
  }
];

export const mockUserProfile = {
  nom: 'Marie Dubois',
  identifiant: 'marie.dubois', // Créé par l'admin local (pas d'email selon CDC)
  bio: 'Passionnée de jardinage et d\'entraide locale. Heureuse de faire partie de cette belle communauté !',
  centresInteret: ['Jardinage', 'Couture', 'Cuisine', 'Bricolage'],
  competences: ['Jardinage', 'Couture', 'Informatique de base'],
  objetsDisponibles: ['Tondeuse', 'Perceuse', 'Livres de jardinage'],
  contactExterne: 'https://line.me/ti/p/marie-dubois'
};

export const mockStats = {
  annonces: 47,
  habitants: 156,
  groupes: 12,
  participation: 68
};

export const mockActivite = [
  { mois: 'Juin', annonces: 12, participation: 45 },
  { mois: 'Juillet', annonces: 18, participation: 52 },
  { mois: 'Août', annonces: 15, participation: 48 },
  { mois: 'Sept', annonces: 22, participation: 61 },
  { mois: 'Oct', annonces: 28, participation: 65 },
  { mois: 'Nov', annonces: 35, participation: 72 },
  { mois: 'Déc', annonces: 47, participation: 68 }
];
