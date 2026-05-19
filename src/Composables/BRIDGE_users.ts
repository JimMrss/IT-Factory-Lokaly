import { api } from "./apiConnect";

export function B_users() {
  return {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers
  }
}
export interface UserPayload {
  identifier?: string;
  name?: string;
  surname?: string;
  description?: string;
  groups?: string[];
  activities?: string[];
}
function filterPayload(payload: Record<string, any>): Partial<UserPayload> {
  const filtered: Partial<UserPayload> = {};
  for (const key in payload) {
    if (authorizedFields.includes(key as keyof UserPayload)) {filtered[key as keyof UserPayload] = payload[key];}
  }
  return filtered;
}
// champs autorisé pour les utilisateurs : name, email, password, phone, address
const authorizedFields: (keyof UserPayload)[] = ["identifier","name","surname","description","groups","activities"];

// Fonction pour créer un nouvel utilisateur (à modifier)
const createUser = async (payload: UserPayload): Promise<any> => {
  const filteredPayload = filterPayload(payload);
  const res = await api.post("/clients/", filteredPayload);
  return res.data;
};
// Fonction pour récupérer les informations d'un utilisateur par son ID
const getUser = async (id: number | string): Promise<any> => {
  const res = await api.get(`/clients/${id}`);
  return res.data;
};
const getAllUsers = async (): Promise<any> => {
  const res = await api.get('/clients/');
  return res.data;
}
// Fonction pour mettre à jour les informations d'un utilisateur (à modifier)
const updateUser = async (id: number | string,payload: UserPayload): Promise<any> => {
  const filteredPayload = filterPayload(payload);
  const res = await api.patch(`/clients/${id}`, filteredPayload);
  return res.data;
};
// Fonction pour supprimer un utilisateur
const deleteUser = async (id: number | string): Promise<any> => {
  const res = await api.delete(`/clients/${id}`);
  return res.data;
}