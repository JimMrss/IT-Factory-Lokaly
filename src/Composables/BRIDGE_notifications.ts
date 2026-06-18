import { api } from "./apiConnect";
// Bridge pour les notifications
export function B_notifications() {
  return { getNotifications, markAsRead, markAllAsRead };
}

export interface Notification {
  id: number | string;
  type: string;
  message: string;
  lien?: string;
  lu: boolean;
  date: string;
}

const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get('/notifications/');
  return res.data;
};

const markAsRead = async (id: number | string): Promise<Notification> => {
  const res = await api.patch(`/notifications/${id}`, { lu: true });
  return res.data;
};

const markAllAsRead = async (): Promise<any> => {
  const res = await api.put('/notifications/readAll');
  return res.data;
};
