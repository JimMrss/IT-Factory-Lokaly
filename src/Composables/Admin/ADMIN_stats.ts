import { api } from "../apiConnect";
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

const getDashboardStats = async (): Promise<Stats> => {
  const res = await api.get("/stats/dashboard/");
  return res.data;
};

const getMonthlyActivity = async (): Promise<ActiviteMensuelle[]> => {
  const res = await api.get("/stats/activite/");
  return res.data;
};

const getStatsByCategory = async (): Promise<CategoryStat[]> => {
  const res = await api.get("/stats/categories/");
  return res.data;
};

const getStatsByGroup = async (): Promise<GroupStat[]> => {
  const res = await api.get("/stats/groupes/");
  return res.data;
};

export function B_admin_stats() {
  return {
    getDashboardStats,
    getMonthlyActivity,
    getStatsByCategory,
    getStatsByGroup,
  };
}
