import { api } from "./apiConnect";

export function B_groupes() {
  return {
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    getAllGroups
  };
}

// type complet d'un groupe
export interface Group {
  group_id: number;
  name: string;
  description: string;
  category: string;
  niveau: string;
  members: number[];
  annonces: number[];
}

// champs autorisé pour les groupes
export interface GroupPayload {
  name?: string;
  description?: string;
  members?: number[];
  annonces?: number[];
  category?: string;
  niveau?: string;
}

const autorizedFields: (keyof GroupPayload)[] = [
  "name",
  "description",
  "members",
  "annonces",
  "category",
  "niveau"
];

const filterGroupPayload = (payload: GroupPayload): Partial<GroupPayload> => {
  const gPayload: Partial<GroupPayload> = {};
  for (const key in payload) {
    const k = key as keyof GroupPayload;
    if (autorizedFields.includes(k)) {
      gPayload[k] = payload[k] as any;
    }
  }
  return gPayload;
};

// Fonction pour créer un nouveau groupe (à modifier)
const createGroup = async (payload: GroupPayload): Promise<Group> => {
  const gPayload = filterGroupPayload(payload);
  const res = await api.post("/groupes/", gPayload);
  return res.data;
};

// Fonction pour récupérer les informations d'un groupe par son ID
const getGroup = async (id: number | string): Promise<Group> => {
  const res = await api.get(`/groupes/${id}`);
  return res.data;
};
const getAllGroups = async (): Promise<Group[]> => {
  const res = await api.get('/groupes/');
  return res.data;
}

// Fonction pour mettre à jour les informations d'un groupe
const updateGroup = async (id: number | string, payload: GroupPayload): Promise<Group> => {
  const gPayload = filterGroupPayload(payload);
  const res = await api.patch(`/groupes/${id}`, gPayload);
  return res.data;
};

// Fonction pour supprimer un groupe
const deleteGroup = async (id: number | string): Promise<any> => {
  const res = await api.delete(`/groupes/${id}`);
  return res.data;
};

// fonction pour ajouter un membre à un groupe
const addMemberToGroup = async (groupId: number | string,userId: number | string): Promise<Group> => {
  const res = await api.post(`/groupes/${groupId}/add_member/`, { user_id: userId });
  return res.data;
};

// fonction pour supprimer un membre d'un groupe
const removeMemberFromGroup = async (groupId: number | string, userId: number | string): Promise<Group> => {
  const res = await api.post(`/groupes/${groupId}/remove_member/`, { user_id: userId });
  return res.data;
};