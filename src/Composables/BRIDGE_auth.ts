import { api } from './apiConnect'
export function B_auth() {
    
    const login = async (identifier: string, password: string) => {
        const res = await api.post('/auth/login/', { identifier, password });
        return res.data;
    }
    const register = async (name: string, surname: string, mail: string, password: string) => {
        const res = await api.post('/auth/register/', { name, surname, mail, password });
        return res.data;
    }
    const logout = async () => {
        const res = await api.post('/auth/logout/');
        return res.data;
    }
    const getCurrentUser = async () => {
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