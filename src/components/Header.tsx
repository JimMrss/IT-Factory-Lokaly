// src/components/Header.tsx
// Barre de navigation en haut de toutes les pages publiques
// useNavigate remplace onNavigate
// useLocation remplace currentPage (pour savoir quelle page est active)
// useAuth remplace les props user et onLogout

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCommunaute } from '../context/CommunauteContext';
import { Home, FileText, Users, User, Menu, X, LogOut } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

// Plus de props nécessaires — tout vient des hooks
export function Header({ communityName = 'Commune de Tori' }: { communityName?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // useNavigate retourne une fonction pour changer d'URL
  const navigate = useNavigate();

  // useLocation retourne l'objet URL actuel — on utilise pathname pour savoir où on est
  const location = useLocation();

  // useAuth donne accès à l'utilisateur connecté et à logout
  const { user, logout } = useAuth();

  // settings de la communauté (logo personnalisé si défini par l'admin)
  const { settings } = useCommunaute();

  // Liste des liens de navigation avec leur URL
  const navItems = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/annonces', label: 'Annonces', icon: FileText },
    { path: '/groupes', label: 'Groupes', icon: Users },
    { path: '/profil', label: 'Profil', icon: User },
  ];

  // Une page est "active" si son chemin correspond à l'URL actuelle
  // Pour l'accueil, on vérifie que c'est exactement "/"
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    // Pour les autres pages, on vérifie si l'URL commence par le chemin
    // Ex: /annonces/1 → isActive('/annonces') = true
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    // Après déconnexion, on redirige vers /login
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — clique pour aller à l'accueil */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center overflow-hidden">
                {settings?.logo ? (
                  <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-xl">L</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[var(--color-primary)]">Lokaly</span>
                <span className="text-xs text-[var(--color-text-secondary)] hidden sm:block">{communityName}</span>
              </div>
            </div>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    active
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-primary)] hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Infos utilisateur et bouton déconnexion */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <div className="w-7 h-7 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(user.name ?? '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {user.name}
                  </span>
                </div>
                <NotificationBell />
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-[var(--color-danger)] hover:bg-red-50 rounded-lg transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[var(--color-border)]">
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-lg mx-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {(user.name ?? '?').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Connecté</p>
                </div>
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                    active
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-primary)] hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {user && (
              <>
                <div className="px-4 py-3 border-t border-[var(--color-border)]">
                  <NotificationBell />
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[var(--color-danger)] hover:bg-red-50 transition-all border-t border-[var(--color-border)]"
                >
                  <LogOut size={20} />
                  <span>Se déconnecter</span>
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
