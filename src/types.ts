export interface User {
  id: number | string;
  name: string;
  surname: string;
  identifier: string;
  avatar?: string;
  bio?: string;
  statut?: "actif" | "desactive" | "valide" | "refuse" | "en_attente";
  centresInteret?: string[];
  competences?: string[];
}

export interface HabitantEnAttente extends User {
  statut: "en_attente";
  date_inscription?: string;
}

export interface Stats {
  total_users: number;
  total_groupes: number;
  total_annonces: number;
  total_evenements: number;
  taux_participation?: number;
}

export interface ActiviteMensuelle {
  mois: string;
  annonces: number;
  evenements: number;
}
