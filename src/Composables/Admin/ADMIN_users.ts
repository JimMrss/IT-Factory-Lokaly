import { api } from "../apiConnect";
import type { User } from "../../types";

export interface AdminUserStatusPayload {
  statut: "actif" | "desactive";
}

export interface AdminResetPasswordPayload {
  password: string;
}

const toggleUserStatus = async (
  id: number | string,
  statut: "actif" | "desactive"
): Promise<User> => {
  const res = await api.patch(`/users/${id}/`, { statut });
  return res.data;
};

const resetUserPassword = async (
  id: number | string,
  newPassword: string
): Promise<void> => {
  await api.post(`/users/${id}/reset-password/`, { password: newPassword });
};

export function B_admin_users() {
  return {
    toggleUserStatus,
    resetUserPassword,
  };
}
