// Données mock pour l'application Lokaly
// Noms de champs alignés avec le backend (DOC BackEnd Lokaly.pdf)

import type { Annonce, Groupe, Communaute, User, UserProfile, HabitantEnAttente, Stats, ActiviteMensuelle } from '../types';

export const mockAnnonces: Annonce[] = [
  {
    id: '1',
    name: 'Prêt de tondeuse à gazon',
    description: 'Tondeuse électrique en bon état, disponible pour prêt aux voisins. Parfait pour petits jardins.',
    location: 'Centre-ville',
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
    name: 'Cours de couture gratuits',
    description: 'Je propose des cours de couture pour débutants. Amenez votre tissu et votre bonne humeur !',
    location: 'Quartier Nord',
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
    name: 'Don de livres pour enfants',
    description: 'Collection de livres pour enfants (3-8 ans) en très bon état. À récupérer sur place.',
    location: 'Quartier Sud',
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
    name: 'Aide au jardinage',
    description: 'Je propose mon aide pour entretenir les jardins des personnes âgées ou à mobilité réduite.',
    location: 'Toute la commune',
    disponibilite: 'Samedis matin',
    type: 'Service',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1080&h=720&q=80',
    auteur: {
      nom: 'Lucas Bernard',
      avatar: ''
    }
  }
];

export const mockGroupes: Groupe[] = [
  {
    id: '1',
    name: 'Jardiniers du quartier',
    description: 'Échange de graines, conseils de jardinage et organisation de trocs de plants.',
    niveau: 3,
    members: 28,
    categorie: 'Jardinage',
    annonces: ['1', '4']
  },
  {
    id: '2',
    name: 'Couture & DIY',
    description: 'Apprenez la couture, le tricot et plein d\'autres activités créatives ensemble.',
    niveau: 2,
    members: 15,
    categorie: 'Culture',
    annonces: ['2']
  },
  {
    id: '3',
    name: 'Bibliothèque partagée',
    description: 'Échangez vos livres, BD et magazines avec les autres habitants.',
    niveau: 5,
    members: 56,
    categorie: 'Culture',
    annonces: ['3']
  },
  {
    id: '4',
    name: 'Sport ensemble',
    description: 'Organisation de sorties vélo, jogging et autres activités sportives collectives.',
    niveau: 2,
    members: 19,
    categorie: 'Sport',
    annonces: []
  },
  {
    id: '5',
    name: 'Repair Café',
    description: 'Réparons ensemble nos objets du quotidien plutôt que de les jeter.',
    niveau: 1,
    members: 8,
    categorie: 'Bricolage',
    annonces: []
  }
];

export const mockCommunautes: Communaute[] = [
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
export const mockUtilisateurs: User[] = [
  {
    id: '1',
    name: 'Julie',
    surname: 'Petit',
    identifier: 'julie.petit',
    communaute: 'Commune de Tori',
    dateCreation: '2024-12-08',
    statut: 'actif'
  },
  {
    id: '2',
    name: 'Marc',
    surname: 'Durand',
    identifier: 'marc.durand',
    communaute: 'Commune de Tori',
    dateCreation: '2024-12-09',
    statut: 'actif'
  },
  {
    id: '3',
    name: 'Emma',
    surname: 'Rousseau',
    identifier: 'emma.rousseau',
    communaute: 'Village de Saint-Martin',
    dateCreation: '2024-12-10',
    statut: 'actif'
  },
  {
    id: '4',
    name: 'Marie',
    surname: 'Dubois',
    identifier: 'marie.dubois',
    communaute: 'Commune de Tori',
    dateCreation: '2024-11-15',
    statut: 'actif'
  },
  {
    id: '5',
    name: 'Ancien',
    surname: 'Utilisateur',
    identifier: 'ancien.user',
    communaute: 'Commune de Tori',
    dateCreation: '2024-06-01',
    statut: 'desactive' // Les utilisateurs ne sont jamais supprimés, juste désactivés
  }
];

export const mockUserProfile: UserProfile = {
  nom: 'Marie Dubois',
  identifier: 'marie.dubois',
  bio: 'Passionnée de jardinage et d\'entraide locale. Heureuse de faire partie de cette belle communauté !',
  centresInteret: ['Jardinage', 'Couture', 'Cuisine', 'Bricolage'],
  competences: ['Jardinage', 'Couture', 'Informatique de base'],
  objetsDisponibles: ['Tondeuse', 'Perceuse', 'Livres de jardinage'],
  contactExterne: 'https://line.me/ti/p/marie-dubois'
};

export const mockHabitantsEnAttente: HabitantEnAttente[] = [
  {
    id: '1',
    name: 'Camille',
    surname: 'Fontaine',
    email: 'camille.fontaine@email.com',
    communaute: 'Commune de Tori',
    date: '2025-01-15',
    statut: 'en_attente'
  },
  {
    id: '2',
    name: 'Thomas',
    surname: 'Garnier',
    email: 'thomas.garnier@email.com',
    communaute: 'Quartier des Fleurs',
    date: '2025-01-18',
    statut: 'en_attente'
  },
  {
    id: '3',
    name: 'Nadia',
    surname: 'Belkacem',
    email: 'nadia.belkacem@email.com',
    communaute: 'Commune de Tori',
    date: '2025-01-20',
    statut: 'valide'
  },
  {
    id: '4',
    name: 'Hugo',
    surname: 'Perrin',
    email: 'hugo.perrin@email.com',
    communaute: 'Village de Saint-Martin',
    date: '2025-01-22',
    statut: 'refuse'
  }
];

export const mockStats: Stats = {
  annonces: 47,
  habitants: 156,
  groupes: 12,
  participation: 68
};

export const mockActivite: ActiviteMensuelle[] = [
  { mois: 'Juin', annonces: 12, participation: 45 },
  { mois: 'Juillet', annonces: 18, participation: 52 },
  { mois: 'Août', annonces: 15, participation: 48 },
  { mois: 'Sept', annonces: 22, participation: 61 },
  { mois: 'Oct', annonces: 28, participation: 65 },
  { mois: 'Nov', annonces: 35, participation: 72 },
  { mois: 'Déc', annonces: 47, participation: 68 }
];
