import { api } from "../apiConnect";

export interface CommunauteSettings {
  couleur: string;
  logo: string | null;
  tagsRegion: string[];
  messageAccueil: string;
}

export type CommunauteSettingsPayload = Partial<CommunauteSettings>;

const getCommunauteSettings = async (): Promise<CommunauteSettings> => {
  const res = await api.get("/communaute/settings/");
  return res.data;
};

const updateCommunauteSettings = async (
  payload: CommunauteSettingsPayload
): Promise<CommunauteSettings> => {
  const res = await api.patch("/communaute/settings/", payload);
  return res.data;
};

export function B_admin_customization() {
  return {
    getCommunauteSettings,
    updateCommunauteSettings,
  };
}
