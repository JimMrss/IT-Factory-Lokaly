import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { B_notifications, Notification } from '../Composables/BRIDGE_notifications';

const POLL_INTERVAL_MS = 25000;

function formatRelativeDate(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffJ = Math.floor(diffH / 24);
  return `il y a ${diffJ} j`;
}

export function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const { getNotifications } = B_notifications();
    let cancelled = false;
    const fetchNotifications = () => {
      getNotifications()
        .then((data) => {
          if (!cancelled) setNotifications(data);
        })
        .catch(() => {
          // échec silencieux : on ne veut pas interrompre l'utilisateur toutes les 25s
        });
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.lu).length;

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      const { markAsRead } = B_notifications();
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, lu: true } : n))
      );
      markAsRead(notification.id).catch(() => {});
      setOpen(false);
      if (notification.lien) {
        navigate(notification.lien);
      }
    },
    [navigate]
  );

  const handleMarkAllAsRead = useCallback(() => {
    const { markAllAsRead } = B_notifications();
    setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
    markAllAsRead().catch(() => {});
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[var(--color-border)] z-50">
          <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
            <p className="font-semibold text-[var(--color-text-primary)]">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-[var(--color-primary)] hover:underline"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">
                Aucune notification pour le moment
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-4 py-3 border-b border-[var(--color-border)] last:border-b-0 hover:bg-gray-50 transition-colors ${
                    !notification.lu ? 'bg-[var(--color-primary)]/5' : ''
                  }`}
                >
                  <p className="text-sm text-[var(--color-text-primary)]">{notification.message}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {formatRelativeDate(notification.date)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
