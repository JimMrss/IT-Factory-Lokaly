import { api } from "./apiConnect";

export function B_Evenements() {
    return {
        getEvenements,
        createEvenement,
        updateEvenement,
        deleteEvenement
    }
}
const authorizedFields: (keyof EvenementPayload)[] = [
    'name','date','hour','description','location','provider'
];
export interface EvenementPayload {
    name?: string;
    date?: string;
    hour?: string;
    description?: string;
    location?: string;
    provider?: number;
}
// Fonction pour créer un nouvel événement (à modifier)
const createEvenement = async (payload: EvenementPayload): Promise<any> => {
    const ePayload: Partial<EvenementPayload> = {};
    //traitement du payload pour ne garder que les champs autorisés
    for (const key in payload) {
        const k = key as keyof EvenementPayload;
        if (authorizedFields.includes(k)) {
            ePayload[k] = payload[k] as any;
        }
    }
    const res = await api.post('/evenements/', ePayload);
    return res.data;
}
// Fonction pour récupérer les informations d'un événement par son ID
const getEvenements = async (id: number | string): Promise<any> => {
    const res = await api.get(`/evenements/${id}`);
    return res.data;
}
// Fonction pour mettre à jour les informations d'un événement
const updateEvenement = async (id: number | string, payload: EvenementPayload): Promise<any> => {
    const ePayload: Partial<EvenementPayload> = {};
    //traitement du payload pour ne garder que les champs autorisés
    for (const key in payload) {
        const k = key as keyof EvenementPayload;
        if (authorizedFields.includes(k)) {
            ePayload[k] = payload[k] as any;
        }
    }
    const res = await api.patch(`/evenements/${id}`, ePayload);
    return res.data;
}
// Fonction pour supprimer un événement
const deleteEvenement = async (id: number | string): Promise<any> => {
    const res = await api.delete(`/evenements/${id}`);
    return res.data;
}