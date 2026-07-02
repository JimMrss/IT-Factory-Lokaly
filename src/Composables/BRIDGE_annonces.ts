import { api } from "./apiConnect";

export function B_Annonces() {
  return {
    getAnnonces,
    getAllAnnonces,
    createAnnonce,
    updateAnnonce,
    deleteAnnonce,
    toggleInterest
  }
}

// champs autorisé pour les annonces
export interface AnnoncePayload {
  name?: string;
  type?: string;
  disponibilite?: string;
  interested_users?: number[];
  date?: string;
  hour?: string;
  description?: string;
  location?: string;
  provider?: number;
  state?: string;
}

const autorizedFields: (keyof AnnoncePayload)[] = [
  'name','type','disponibilite','interested_users','date','hour','description','location','provider','state'
];

// Fonction pour créer une nouvelle annonce (à modifier)
const createAnnonce = async (payload: AnnoncePayload): Promise<any> => {
  const upayload: Partial<AnnoncePayload> = {};

  //traitement du payload pour ne garder que les champs autorisés
  for (const key in payload) {
    const k = key as keyof AnnoncePayload;
    if (autorizedFields.includes(k)) {
      upayload[k] = payload[k] as any;
    }
  }
  const res = await api.post('/annonces/', upayload);
  return res.data;
}

// Fonction pour récupérer les informations d'une annonce par son ID
const getAnnonces = async (id: number | string): Promise<any> => {
  const res = await api.get(`/annonces/${id}`);
  return res.data;
}
const getAllAnnonces = async (): Promise<any> => {
  const res = await api.get('/annonces/');
  return res.data;
}
// Fonction pour mettre à jour les informations d'une annonce
const updateAnnonce = async (id: number | string, payload: AnnoncePayload): Promise<any> => {
  const uPayload: Partial<AnnoncePayload> = {};

  //traitement du payload pour ne garder que les champs autorisés
  for (const key in payload) {
    const k = key as keyof AnnoncePayload;
    if (autorizedFields.includes(k)) {
      uPayload[k] = payload[k] as any;
    }
  }

  const res = await api.put(`/annonces/${id}`, uPayload);
  return res.data;
}

// Fonction pour supprimer une annonce
const deleteAnnonce = async (id: number | string): Promise<any> => {
  const res = await api.delete(`/annonces/${id}`);
  return res.data;
}

// Ajoute ou retire l'utilisateur de la liste des intéressés (toggle côté serveur)
// L'API demande l'id de l'annonce en query en plus du path, et renvoie l'annonce mise à jour
const toggleInterest = async (id: number | string, userId: number): Promise<any> => {
  const res = await api.post(`/annonces/${id}/interest/`, { user_id: userId }, { params: { annonceId: id } });
  return res.data;
}