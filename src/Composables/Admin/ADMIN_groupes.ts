import { api } from "../apiConnect";
import type { Group } from "../BRIDGE_groupe";

const getAllGroupsAdmin = async (): Promise<Group[]> => {
  const res = await api.get("/groupes/");
  // protege les pages admin si l'API renvoie une reponse vide
  return res.data ?? [];
};

export function B_admin_groupes() {
  return {
    getAllGroupsAdmin,
  };
}
