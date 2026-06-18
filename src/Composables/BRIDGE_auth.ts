import { api } from './apiConnect'

const authorizedFields: (keyof AuthPayload)[] = ['name','surname','mail','password', 'permissions','statut'];
export interface AuthPayload {
    user_id?: number;
    name?: string;
    surname?: string;
    mail?: string;
    password?: string;
    permissions?: number;  
    statut?: string;    
}
export function B_auth() {
    const login = async (payload: AuthPayload): Promise<any> => {
        const lPayload: Partial<AuthPayload> = {};
        for (const key in payload) {
            const k = key as keyof AuthPayload;
            if (authorizedFields.includes(k)) {
                lPayload[k] = payload[k] as any;
            }
        }
        const res = await api.post('/auth/login/', lPayload);
        return res.data;
    }
    const register = async (payload: AuthPayload): Promise<any> => {
        const rPayload: Partial<AuthPayload> = {};
        for (const key in payload) {
            const k = key as keyof AuthPayload;
            if (authorizedFields.includes(k)) {
                rPayload[k] = payload[k] as any;
            }
        }
        if(!rPayload.permissions) rPayload.permissions = 0;
        const res = await api.post('/auth/register/', rPayload);
        return res.data;
    }
    const logout = async () => {
        const res = await api.post('/auth/logout/');
        return res.data;
    }
    const getCurrentUser = async (): Promise<AuthPayload> => {
        const res = await api.get('/auth/user/');
        return res.data;
    }
    return {
        login,
        register,
        logout,
        getCurrentUser
    }
}