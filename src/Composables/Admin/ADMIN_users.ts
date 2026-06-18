import { api } from "../apiConnect";
import type { User } from "../../types";

export interface AdminUserStatusPayload {
  statut: "actif" | "desactive";
}

const toggleUserStatus = async (
  id: number | string,
  statut: "actif" | "desactive"
): Promise<User> => {
  const res = await api.patch(`/users/${id}`, { statut });
  return res.data;
};

// Bascule le rôle admin de l'utilisateur. permissions : 0 = utilisateur, 1 = admin
const setUserPermissions = async (
  id: number | string,
  permissions: 0 | 1
): Promise<User> => {
  const res = await api.patch(`/users/${id}`, { permissions });
  return res.data;
};

export function B_admin_users() {
  return {
    toggleUserStatus,
    setUserPermissions,
  };
}
