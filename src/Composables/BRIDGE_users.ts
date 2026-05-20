import { api } from "./apiConnect";

export function B_users() {
  return { getUser, getAllUsers, updateUser };
}

export interface UserPayload {
  bio?: string;
  centresInteret?: string[];
  competences?: string[];
  objetsDisponibles?: string[];
  contactExterne?: string;
}

const authorizedFields: (keyof UserPayload)[] = [
  "bio", "centresInteret", "competences", "objetsDisponibles", "contactExterne"
];

function filterPayload(payload: Record<string, any>): Partial<UserPayload> {
  const filtered: Partial<UserPayload> = {};
  for (const key in payload) {
    if (authorizedFields.includes(key as keyof UserPayload)) {
      filtered[key as keyof UserPayload] = payload[key];
    }
  }
  return filtered;
}

const getUser = async (id: number | string): Promise<any> => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

const getAllUsers = async (): Promise<any> => {
  const res = await api.get('/users/');
  return res.data;
};

const updateUser = async (id: number | string, payload: UserPayload): Promise<any> => {
  const res = await api.patch(`/users/${id}`, filterPayload(payload));
  return res.data;
};
