// src/components/AdminSidebar.tsx
// Sidebar du panel admin
// useNavigate + useLocation remplacent les props onNavigate et currentPage

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, BarChart3, Palette, Menu, X, UsersRound, ClipboardCheck } from 'lucide-react';

// Plus besoin de props — useNavigate et useLocation font le travail
export function AdminSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  // useNavigate pour aller sur une page admin
  const navigate = useNavigate();

  // useLocation pour savoir quelle page admin est active
  const location = useLocation();

  // Liste des pages admin avec leur URL complète
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/utilisateurs', label: 'Utilisateurs', icon: UserPlus },
    { path: '/admin/groupes', label: 'Groupes', icon: UsersRound },
    { path: '/admin/stats', label: 'Statistiques', icon: BarChart3 },
    { path: '/admin/validation', label: 'Validation', icon: ClipboardCheck },
    { path: '/admin/personnalisation', label: 'Personnalisation', icon: Palette },
  ];

  // Un item est actif si son chemin correspond exactement à l'URL actuelle
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Bouton menu mobile */}
      <button
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-white rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay mobile — fond sombre quand la sidebar est ouverte */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar principale */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-slate-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo en haut de la sidebar */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
          <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <p className="font-bold text-sm">Lokaly Admin</p>
            <p className="text-xs text-slate-400">Panel de gestion</p>
          </div>
        </div>

        {/* Menu de navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // On vérifie si cette page est la page active
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  // navigate change l'URL et affiche la bonne page
                  navigate(item.path);
                  // On ferme la sidebar sur mobile après avoir cliqué
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  active
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bouton retour vers le site public */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm"
          >
            <span>← Retour au site</span>
          </button>
        </div>
      </aside>
    </>
  );
}
