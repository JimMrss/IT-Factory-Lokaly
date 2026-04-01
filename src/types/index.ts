// Types alignés avec les PayloadTypes du backend (DOC BackEnd Lokaly.pdf)
// + champs supplémentaires demandés dans BACKEND_MANQUANT.md

// === USERS ===

export interface UserPayload {
  identifier?: string;
  name?: string;
  surname?: string;
  description?: string;
  groups?: string[];
  activities?: string[];
  // Champs demandés au backend (pas encore implémentés côté back)
  email?: string;
  communaute?: string;
  statut?: 'actif' | 'desactive';
  role?: 'habitant' | 'admin';
  dateCreation?: string;
  avatar?: string;
}

export interface User {
  id: string;
  identifier: string;
  name: string;
  surname: string;
  description?: string;
  groups?: string[];
  activities?: string[];
  email?: string;
  communaute?: string;
  statut: 'actif' | 'desactive';
  role?: 'habitant' | 'admin';
  dateCreation: string;
  avatar?: string;
}

export interface UserProfile {
  nom: string; // Nom complet affiché (ex: "Marie Dubois")
  identifier: string;
  bio: string;
  centresInteret: string[];
  competences: string[];
  objetsDisponibles: string[];
  contactExterne: string;
}

export interface HabitantEnAttente {
  id: string;
  name: string;
  surname: string;
  email: string;
  communaute: string;
  date: string;
  statut: 'en_attente' | 'valide' | 'refuse';
}

// === GROUPES ===

export interface GroupPayload {
  name?: string;
  description?: string;
  members?: number[];
  annonces?: number[];
  // Champs demandés au backend (pas encore implémentés côté back)
  categorie?: string;
  niveau?: number;
  image?: string;
}

export interface Groupe {
  id: string;
  name: string;
  description: string;
  members: number;
  annonces: string[];
  categorie: string;
  niveau: number;
  image?: string;
}

// === ANNONCES ===

export interface AnnoncePayload {
  name?: string;
  interested_users?: number[];
  date?: string;
  hour?: string;
  description?: string;
  location?: string;
  provider?: number;
  state?: string;
  // Champs demandés au backend (pas encore implémentés côté back)
  type?: string;
  zone?: string;
  disponibilite?: string;
  image?: string;
}

export interface Annonce {
  id: string;
  name: string;
  description: string;
  location: string;
  disponibilite: string;
  type: string;
  image?: string;
  auteur: {
    nom: string;
    avatar?: string;
  };
  date?: string;
  hour?: string;
  provider?: number;
  state?: string;
  interested_users?: number[];
}

// === STATS ===

export interface Stats {
  annonces: number;
  habitants: number;
  groupes: number;
  participation: number;
}

export interface ActiviteMensuelle {
  mois: string;
  annonces: number;
  participation: number;
}

// === COMMUNAUTES ===

export interface Communaute {
  id: string;
  nom: string;
  habitants: number;
  annonces: number;
  groupes: number;
}
