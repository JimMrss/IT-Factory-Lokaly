import { api } from "../apiConnect";
import type { User } from "../../types";
import type { Group } from "../BRIDGE_groupe";

export interface GroupMember extends Pick<User, "id" | "name" | "surname" | "identifier" | "avatar"> {}

export interface GroupInterested {
  user_id: number | string;
  name: string;
  surname: string;
  identifier: string;
  annonce_id: number | string;
  annonce_name: string;
}

const getAllGroupsAdmin = async (): Promise<Group[]> => {
  const res = await api.get("/groupes/");
  return res.data;
};

const getGroupMembers = async (groupId: number | string): Promise<GroupMember[]> => {
  const res = await api.get(`/groupes/${groupId}/members/`);
  return res.data;
};

const getGroupInterested = async (groupId: number | string): Promise<GroupInterested[]> => {
  const res = await api.get(`/groupes/${groupId}/interested/`);
  return res.data;
};

export function B_admin_groupes() {
  return {
    getAllGroupsAdmin,
    getGroupMembers,
    getGroupInterested,
  };
}
