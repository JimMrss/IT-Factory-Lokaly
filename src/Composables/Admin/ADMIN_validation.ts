import { api } from "../apiConnect";
import type { HabitantEnAttente } from "../../types";

const validateHabitant = async (id: number | string): Promise<HabitantEnAttente> => {
  // Validé = "valide" : l'utilisateur passera à "actif" lors de sa 1re connexion.
  const res = await api.patch(`/users/${id}`, { statut: "valide" });
  return res.data;
};

const refuseHabitant = async (id: number | string): Promise<HabitantEnAttente> => {
  const res = await api.patch(`/users/${id}`, { statut: "refuse" });
  return res.data;
};

export function B_admin_validation() {
  return {
    validateHabitant,
    refuseHabitant,
  };
}
