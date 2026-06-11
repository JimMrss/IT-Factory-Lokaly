import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell size={20} />
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          0
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[var(--color-border)] z-50">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <p className="font-semibold text-[var(--color-text-primary)]">Notifications</p>
          </div>
          <div className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">
            Aucune notification pour le moment
          </div>
        </div>
      )}
    </div>
  );
}
