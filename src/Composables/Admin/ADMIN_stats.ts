import { B_users } from "../BRIDGE_users";
import { B_Annonces } from "../BRIDGE_annonces";
import { B_groupes } from "../BRIDGE_groupe";
import { B_Evenements } from "../BRIDGE_evenements";
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
  const { getAllEvenements } = B_Evenements();
  const [annonces, users, groupes, evenements] = await Promise.all([
    getAllAnnonces(),
    getAllUsers(),
    getAllGroups(),
    getAllEvenements(),
  ]);
  return {
    total_annonces: annonces.length,
    total_users: users.length,
    total_groupes: groupes.length,
    total_evenements: evenements.length,
    // nécessite une date de dernière activité par utilisateur, pas encore exposée par l'API
    taux_participation: 0,
  };
};

const getMonthlyActivity = async (): Promise<ActiviteMensuelle[]> => {
  const { getAllAnnonces } = B_Annonces();
  const { getAllEvenements } = B_Evenements();
  const [annonces, evenements] = await Promise.all([getAllAnnonces(), getAllEvenements()]);
  const counts = new Map<string, { annonces: number; evenements: number }>();
  const add = (date: string | undefined, key: "annonces" | "evenements") => {
    if (!date) return;
    const cle = String(date).slice(0, 7); // YYYY-MM, pour trier chronologiquement
    if (!counts.has(cle)) counts.set(cle, { annonces: 0, evenements: 0 });
    counts.get(cle)![key] += 1;
  };
  annonces.forEach((a: any) => add(a.date, "annonces"));
  evenements.forEach((e: any) => add(e.date, "evenements"));
  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([cle, c]) => ({ mois: MOIS[Number(cle.slice(5, 7)) - 1], ...c }));
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
