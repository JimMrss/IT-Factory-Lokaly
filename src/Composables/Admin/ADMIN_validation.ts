import { api } from "../apiConnect";
import type { HabitantEnAttente } from "../../types";

const getPendingHabitants = async (): Promise<HabitantEnAttente[]> => {
  const res = await api.get("/users/", { params: { statut: "en_attente" } });
  return res.data;
};

const validateHabitant = async (id: number | string): Promise<HabitantEnAttente> => {
  const res = await api.patch(`/users/${id}/`, { statut: "valide" });
  return res.data;
};

const refuseHabitant = async (id: number | string): Promise<HabitantEnAttente> => {
  const res = await api.patch(`/users/${id}/`, { statut: "refuse" });
  return res.data;
};

export function B_admin_validation() {
  return {
    getPendingHabitants,
    validateHabitant,
    refuseHabitant,
  };
}
