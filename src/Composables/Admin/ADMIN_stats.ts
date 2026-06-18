import { B_users } from "../BRIDGE_users";
import { B_Annonces } from "../BRIDGE_annonces";
import { B_groupes } from "../BRIDGE_groupe";
import type { Stats, ActiviteMensuelle } from "../../types";

export interface CategoryStat {
  name: string;
  value: number;
}

export interface GroupStat {
  name: string;
  annonces: number;
  membres: number;
}

const MOIS = ["Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

const getDashboardStats = async (): Promise<Stats> => {
  const { getAllAnnonces } = B_Annonces();
  const { getAllUsers } = B_users();
  const { getAllGroups } = B_groupes();
  const [annonces, habitants, groupes] = await Promise.all([
    getAllAnnonces(),
    getAllUsers(),
    getAllGroups(),
  ]);
  return {
    annonces: annonces.length,
    habitants: habitants.length,
    groupes: groupes.length,
    // nécessite une date de dernière activité par utilisateur, pas encore exposée par l'API
    participation: 0,
  };
};

const getMonthlyActivity = async (): Promise<ActiviteMensuelle[]> => {
  const { getAllAnnonces } = B_Annonces();
  const annonces = await getAllAnnonces();
  const counts = new Map<string, number>();
  for (const a of annonces) {
    if (!a.date) continue;
    const mois = MOIS[new Date(a.date).getMonth()];
    counts.set(mois, (counts.get(mois) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([mois, annonces]) => ({
    mois,
    annonces,
    // nécessite un suivi d'activité par utilisateur, pas encore exposé par l'API
    participation: 0,
  }));
};

const getStatsByCategory = async (): Promise<CategoryStat[]> => {
  const { getAllAnnonces } = B_Annonces();
  const annonces = await getAllAnnonces();
  const counts = new Map<string, number>();
  for (const a of annonces) {
    const type = a.type ?? "Autre";
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
};

const getStatsByGroup = async (): Promise<GroupStat[]> => {
  const { getAllGroups } = B_groupes();
  const groupes = await getAllGroups();
  return groupes.map((g) => ({
    name: g.name,
    annonces: g.annonces?.length ?? 0,
    membres: g.members?.length ?? 0,
  }));
};

export function B_admin_stats() {
  return {
    getDashboardStats,
    getMonthlyActivity,
    getStatsByCategory,
    getStatsByGroup,
  };
}
