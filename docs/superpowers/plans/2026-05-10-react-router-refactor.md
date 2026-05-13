# Migration React Router DOM + Refactor style étudiant

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer le routing maison (useState) vers React Router DOM v6 avec BrowserRouter, supprimer tous les props `onNavigate`, et réécrire le code avec un style "3ème année" commenté partout.

**Architecture:** BrowserRouter dans main.tsx, App.tsx utilise Outlet/layouts (UserLayout + AdminLayout), ProtectedRoute vérifie l'auth, les pages de détail utilisent useParams pour chercher dans mockData.

**Tech Stack:** React 18, TypeScript, react-router-dom v6, Vite, Tailwind CSS

---

## Structure des fichiers modifiés

| Fichier | Type | Changement |
|---|---|---|
| `package.json` | Modifié | Ajout react-router-dom |
| `vite.config.ts` | Modifié | Suppression base: '/lokaly/' |
| `src/main.tsx` | Modifié | Wrap avec BrowserRouter |
| `src/App.tsx` | Réécrit | Routes, ProtectedRoute, UserLayout, AdminLayout |
| `src/components/Header.tsx` | Modifié | useNavigate + useLocation, suppression onNavigate |
| `src/components/Footer.tsx` | Modifié | Link, suppression onNavigate |
| `src/components/AdminSidebar.tsx` | Modifié | useNavigate + useLocation, suppression props |
| `src/pages/LoginPage.tsx` | Modifié | useNavigate pour rediriger après login |
| `src/pages/HomePage.tsx` | Modifié | useNavigate, suppression onNavigate |
| `src/pages/AnnoncesPage.tsx` | Modifié | useNavigate, suppression onNavigate |
| `src/pages/AnnonceDetailPage.tsx` | Réécrit | useParams pour récupérer l'annonce par id |
| `src/pages/NouvelleAnnoncePage.tsx` | Modifié | useNavigate, suppression onNavigate |
| `src/pages/GroupesPage.tsx` | Modifié | useNavigate, suppression onNavigate |
| `src/pages/GroupeDetailPage.tsx` | Réécrit | useParams pour récupérer le groupe par id |
| `src/pages/CreerGroupePage.tsx` | Modifié | useNavigate, suppression onNavigate |
| `src/pages/ProfilPage.tsx` | Modifié | Suppression onNavigate (non utilisé) |
| `src/pages/AdminGroupsPage.tsx` | Modifié | useNavigate, suppression onNavigate |
| `src/pages/AdminGroupDetailPage.tsx` | Réécrit | useParams pour récupérer le groupe par id |
| `src/pages/AdminCustomizationPage.tsx` | Modifié | Suppression prop communaute |
| Pages admin sans nav | Modifié | Suppression onNavigate (non utilisé) |

---

## Task 1 : Installer react-router-dom

**Files:**
- Modify: `package.json`

- [ ] **Étape 1 : Installer le package**

```bash
npm install react-router-dom
```

- [ ] **Étape 2 : Vérifier que l'installation a réussi**

Ouvrir `package.json` et vérifier que `react-router-dom` apparaît dans `dependencies`.

- [ ] **Étape 3 : Commit**

```bash
git add package.json package-lock.json
git commit -m "install react-router-dom"
```

---

## Task 2 : Mettre à jour vite.config.ts et main.tsx

**Files:**
- Modify: `vite.config.ts`
- Modify: `src/main.tsx`

- [ ] **Étape 1 : Supprimer la base GitHub Pages dans vite.config.ts**

Remplacer le contenu de `vite.config.ts` par :

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// configuration de Vite pour le projet Lokaly
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'vaul@1.1.2': 'vaul',
      'sonner@2.0.3': 'sonner',
      'recharts@2.15.2': 'recharts',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',
      'react-hook-form@7.55.0': 'react-hook-form',
      'react-day-picker@8.10.1': 'react-day-picker',
      'next-themes@0.4.6': 'next-themes',
      'lucide-react@0.487.0': 'lucide-react',
      'input-otp@1.4.2': 'input-otp',
      'embla-carousel-react@8.6.0': 'embla-carousel-react',
      'cmdk@1.1.1': 'cmdk',
      'class-variance-authority@0.7.1': 'class-variance-authority',
      '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
      '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
      '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
      '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
      '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
      '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
      '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
      '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
      '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
      '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
      '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
      '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
      '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
      '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
      '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
      '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
      '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
      '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
      '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
      '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
      '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
      '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
      '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

- [ ] **Étape 2 : Envelopper l'app dans BrowserRouter dans main.tsx**

Remplacer le contenu de `src/main.tsx` par :

```tsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './styles/globals.css';

// On enveloppe toute l'application dans BrowserRouter
// pour que React Router puisse gérer les URLs
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

- [ ] **Étape 3 : Commit**

```bash
git add vite.config.ts src/main.tsx
git commit -m "configure BrowserRouter and remove github pages base"
```

---

## Task 3 : Réécrire App.tsx

**Files:**
- Rewrite: `src/App.tsx`

- [ ] **Étape 1 : Remplacer le contenu complet de App.tsx**

```tsx
// App.tsx
// Composant racine - gère l'auth et la structure de navigation
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { Toaster } from 'sonner';

// composants de mise en page
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AdminSidebar } from './components/AdminSidebar';

// pages utilisateur
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { AnnoncesPage } from './pages/AnnoncesPage';
import { AnnonceDetailPage } from './pages/AnnonceDetailPage';
import { NouvelleAnnoncePage } from './pages/NouvelleAnnoncePage';
import { GroupesPage } from './pages/GroupesPage';
import { GroupeDetailPage } from './pages/GroupeDetailPage';
import { CreerGroupePage } from './pages/CreerGroupePage';
import { ProfilPage } from './pages/ProfilPage';

// pages admin
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminCustomizationPage } from './pages/AdminCustomizationPage';
import { AdminStatsPage } from './pages/AdminStatsPage';
import { AdminGroupsPage } from './pages/AdminGroupsPage';
import { AdminGroupDetailPage } from './pages/AdminGroupDetailPage';
import { AdminValidationPage } from './pages/AdminValidationPage';

// type qui représente un utilisateur connecté
interface User {
  username: string;
  email?: string;
}

// Composant qui protège les routes privées
// Si l'utilisateur n'est pas connecté, on le redirige vers /login
function ProtectedRoute({ user }: { user: User | null }) {
  if (!user) {
    // replace évite d'avoir /login dans l'historique de navigation
    return <Navigate to="/login" replace />;
  }
  // Outlet rend le composant enfant correspondant à la route
  return <Outlet />;
}

// Layout des pages utilisateur normales (accueil, annonces, groupes...)
// Contient le header en haut et le footer en bas
function UserLayout({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-1">
        {/* Outlet affiche la page correspondant à l'URL actuelle */}
        <Outlet />
      </main>
      <Footer />
      {/* Bouton flottant pour accéder rapidement à l'admin */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/admin"
          className="bg-[var(--color-danger)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-[var(--color-danger-hover)] transition-colors"
        >
          Admin
        </Link>
      </div>
    </div>
  );
}

// Layout des pages admin (dashboard, users, groupes admin...)
// Contient la sidebar à gauche
function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  // null = pas connecté, sinon on a les infos du user
  const [user, setUser] = useState<User | null>(null);
  // pour afficher l'écran de chargement le temps de lire le localStorage
  const [isLoading, setIsLoading] = useState(true);

  // au montage du composant, on vérifie si un user est déjà connecté
  useEffect(() => {
    const savedUser = localStorage.getItem('lokaly_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // le JSON stocké est corrompu, on supprime la clé
        localStorage.removeItem('lokaly_user');
      }
    }
    setIsLoading(false);
  }, []);

  // appelé depuis LoginPage quand la connexion réussit
  const handleLogin = (loggedUser: User) => {
    console.log('Connexion réussie pour :', loggedUser.username);
    setUser(loggedUser);
  };

  // appelé depuis le Header quand l'utilisateur clique sur "déconnexion"
  const handleLogout = () => {
    localStorage.removeItem('lokaly_user');
    setUser(null);
  };

  // écran de chargement pendant la lecture du localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-xl mb-4 animate-pulse">
            <span className="text-3xl font-bold bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              L
            </span>
          </div>
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* les toasts (notifications) sont visibles sur toutes les pages */}
      <Toaster position="top-right" richColors />

      <Routes>
        {/* page de login - pas besoin d'être connecté pour y accéder */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {/* toutes les routes qui nécessitent d'être connecté */}
        <Route element={<ProtectedRoute user={user} />}>

          {/* pages utilisateur avec header + footer */}
          <Route element={<UserLayout user={user} onLogout={handleLogout} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/annonces" element={<AnnoncesPage />} />
            {/* /annonces/nouvelle doit être AVANT /annonces/:id sinon "nouvelle" serait interprété comme un id */}
            <Route path="/annonces/nouvelle" element={<NouvelleAnnoncePage />} />
            <Route path="/annonces/:id" element={<AnnonceDetailPage />} />
            <Route path="/groupes" element={<GroupesPage />} />
            <Route path="/groupes/creer" element={<CreerGroupePage />} />
            <Route path="/groupes/:id" element={<GroupeDetailPage />} />
            <Route path="/profil" element={<ProfilPage />} />
          </Route>

          {/* pages admin avec sidebar */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/groupes" element={<AdminGroupsPage />} />
            <Route path="/admin/groupes/:id" element={<AdminGroupDetailPage />} />
            <Route path="/admin/stats" element={<AdminStatsPage />} />
            <Route path="/admin/validation" element={<AdminValidationPage />} />
            <Route path="/admin/config" element={<AdminCustomizationPage />} />
          </Route>

        </Route>
      </Routes>
    </div>
  );
}
```

- [ ] **Étape 2 : Commit**

```bash
git add src/App.tsx
git commit -m "rewrite App.tsx with React Router v6 routes and layouts"
```

---

## Task 4 : Mettre à jour Header.tsx

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Étape 1 : Remplacer le contenu de Header.tsx**

```tsx
// Header.tsx
// Barre de navigation principale affichée sur toutes les pages utilisateur
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Users, User, Menu, X, LogOut } from 'lucide-react';

// on n'a plus besoin de onNavigate et currentPage en props
// React Router s'occupe de tout ça maintenant
interface HeaderProps {
  communityName?: string;
  user?: { username: string; email?: string };
  onLogout?: () => void;
}

export function Header({ communityName = 'Commune de Tori', user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation(); // pour savoir sur quelle page on est actuellement
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // liste des items du menu avec leur chemin de navigation
  const navItems = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/annonces', label: 'Annonces', icon: FileText },
    { path: '/groupes', label: 'Groupes', icon: Users },
    { path: '/profil', label: 'Profil', icon: User },
  ];

  // vérifie si un item de nav est actif selon l'URL actuelle
  const isActive = (path: string) => {
    if (path === '/') {
      // pour l'accueil on vérifie l'égalité exacte sinon tout serait actif
      return location.pathname === '/';
    }
    // pour les autres pages on vérifie si l'URL commence par le chemin
    // ex: /annonces/1 -> l'item Annonces est actif
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo - clic pour aller à l'accueil */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
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
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.path)
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

          {/* Infos utilisateur et bouton déconnexion (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <div className="w-7 h-7 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-[var(--color-danger)] hover:bg-red-50 rounded-lg transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>

          {/* Bouton hamburger pour mobile */}
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
            {/* info user sur mobile */}
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-lg mx-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Connecté</p>
                </div>
              </div>
            )}

            {/* items du menu mobile */}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false); // on ferme le menu après navigation
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                    isActive(item.path)
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-primary)] hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* bouton déconnexion mobile */}
            {user && onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-[var(--color-danger)] hover:bg-red-50 transition-all border-t border-[var(--color-border)]"
              >
                <LogOut size={20} />
                <span>Se déconnecter</span>
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Étape 2 : Commit**

```bash
git add src/components/Header.tsx
git commit -m "update Header to use useNavigate and useLocation"
```

---

## Task 5 : Mettre à jour Footer.tsx

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Étape 1 : Supprimer onNavigate et utiliser Link**

Remplacer la ligne `interface FooterProps` et la fonction par :

```tsx
// Footer.tsx
// Pied de page affiché sur toutes les pages utilisateur
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Heart } from 'lucide-react';

// plus besoin de onNavigate, on utilise Link directement
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-gray-300 mt-auto border-t-4 border-[var(--color-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* À propos */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl">Lokaly</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              La plateforme qui connecte les habitants de votre quartier.
              Partagez, échangez et créez des liens avec vos voisins.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[var(--color-primary)] rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[var(--color-primary)] rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[var(--color-primary)] rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              {/* on utilise Link au lieu de button+onNavigate */}
              <li><Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Accueil</Link></li>
              <li><Link to="/annonces" className="hover:text-[var(--color-primary)] transition-colors">Annonces</Link></li>
              <li><Link to="/groupes" className="hover:text-[var(--color-primary)] transition-colors">Groupes</Link></li>
              <li><Link to="/profil" className="hover:text-[var(--color-primary)] transition-colors">Mon profil</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <MapPin size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                <span>1 Place de la Mairie, 75001</span>
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Mail size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                <span>contact@lokaly.fr</span>
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Phone size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                <span>01 23 45 67 89</span>
              </li>
            </ul>
          </div>

          {/* Actions rapides */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4">Actions rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/annonces/nouvelle" className="hover:text-[var(--color-primary)] transition-colors">Publier une annonce</Link></li>
              <li><Link to="/groupes/creer" className="hover:text-[var(--color-primary)] transition-colors">Créer un groupe</Link></li>
              <li><Link to="/annonces" className="hover:text-[var(--color-primary)] transition-colors">Voir les annonces</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barre du bas */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} Lokaly. Tous droits réservés.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Fait avec <Heart size={14} className="text-red-500" /> pour notre communauté
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Étape 2 : Commit**

```bash
git add src/components/Footer.tsx
git commit -m "update Footer to use Link from react-router-dom"
```

---

## Task 6 : Mettre à jour AdminSidebar.tsx

**Files:**
- Modify: `src/components/AdminSidebar.tsx`

- [ ] **Étape 1 : Remplacer le contenu de AdminSidebar.tsx**

```tsx
// AdminSidebar.tsx
// Barre latérale de navigation pour les pages admin
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, BarChart3, Palette, Menu, X, UsersRound, ClipboardCheck } from 'lucide-react';

// plus de props onNavigate et currentPage - React Router gère tout
export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // pour savoir quelle page admin est active
  const [isOpen, setIsOpen] = React.useState(false);

  // liste des items du menu admin avec leurs chemins
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Utilisateurs', icon: UserPlus },
    { path: '/admin/groupes', label: 'Groupes', icon: UsersRound },
    { path: '/admin/stats', label: 'Statistiques', icon: BarChart3 },
    { path: '/admin/validation', label: 'Validation', icon: ClipboardCheck },
    { path: '/admin/config', label: 'Personnalisation', icon: Palette },
  ];

  // vérifie si l'item de menu correspond à la page actuelle
  const isActive = (path: string) => {
    if (path === '/admin') {
      // pour le dashboard on vérifie l'égalité exacte
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Bouton hamburger visible uniquement sur mobile */}
      <button
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-white rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Fond semi-transparent quand la sidebar est ouverte sur mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* La sidebar elle-même */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-[var(--color-border)] w-64 z-40 transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* En-tête de la sidebar */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-primary)]">Lokaly</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">Administration</p>
            </div>
          </div>
        </div>

        {/* Menu de navigation admin */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false); // fermer la sidebar sur mobile après navigation
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-primary)] hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Lien retour au site principal */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            ← Retour au site
          </button>
        </div>
      </aside>
    </>
  );
}
```

- [ ] **Étape 2 : Commit**

```bash
git add src/components/AdminSidebar.tsx
git commit -m "update AdminSidebar to use useNavigate and useLocation"
```

---

## Task 7 : Mettre à jour LoginPage.tsx

**Files:**
- Modify: `src/pages/LoginPage.tsx`

La LoginPage garde le prop `onLogin` (pour mettre à jour le state dans App), mais on ajoute `useNavigate` pour rediriger vers `/` après connexion.

- [ ] **Étape 1 : Ajouter useNavigate et les redirections**

Ajouter l'import en haut du fichier :
```tsx
import { useNavigate } from 'react-router-dom';
```

Ajouter `useNavigate` à l'intérieur de la fonction `LoginPage` (juste après les useState) :
```tsx
const navigate = useNavigate();
```

Dans `handleLogin`, remplacer le bloc final par :
```tsx
if (loginUsername === 'test' && loginPassword === 'test') {
  const loggedUser = { username: loginUsername };
  localStorage.setItem('lokaly_user', JSON.stringify(loggedUser));
  console.log('login OK, redirection vers accueil');
  onLogin(loggedUser);
  navigate('/'); // on redirige vers l'accueil après connexion réussie
} else {
  setError('Identifiants incorrects');
  setIsLoading(false);
}
```

Dans `handleRegister`, remplacer le bloc final par :
```tsx
const newUser = { username: registerUsername, email: registerEmail };
localStorage.setItem('lokaly_user', JSON.stringify(newUser));
console.log('inscription OK, redirection vers accueil');
onLogin(newUser);
navigate('/'); // redirection après inscription
```

- [ ] **Étape 2 : Commit**

```bash
git add src/pages/LoginPage.tsx
git commit -m "add useNavigate to LoginPage for post-login redirect"
```

---

## Task 8 : Mettre à jour les pages simples (sans données passées)

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/AnnoncesPage.tsx`
- Modify: `src/pages/GroupesPage.tsx`
- Modify: `src/pages/NouvelleAnnoncePage.tsx`
- Modify: `src/pages/CreerGroupePage.tsx`
- Modify: `src/pages/ProfilPage.tsx`

Pattern à appliquer sur chaque fichier :
1. Supprimer l'interface `XxxPageProps`
2. Supprimer le paramètre `{ onNavigate }` de la fonction
3. Ajouter `import { useNavigate } from 'react-router-dom';`
4. Ajouter `const navigate = useNavigate();` en début de fonction
5. Remplacer chaque `onNavigate('page')` par `navigate('/chemin')`
6. Pour `onNavigate('annonce-detail', annonce)` → `navigate('/annonces/' + annonce.id)`
7. Pour `onNavigate('groupe-detail', groupe)` → `navigate('/groupes/' + groupe.id)`
8. Ajouter des commentaires partout

- [ ] **Étape 1 : Mettre à jour HomePage.tsx**

```tsx
// HomePage.tsx
// Page d'accueil - affiche les annonces et groupes récents
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { AnnonceCard } from '../components/AnnonceCard';
import { GroupeCard } from '../components/GroupeCard';
import { Plus, ArrowRight } from 'lucide-react';
import { mockAnnonces, mockGroupes, mockStats } from '../data/mockData';
import { toast } from 'sonner';

// plus de props - on utilise useNavigate directement
export function HomePage() {
  // hook pour naviguer entre les pages
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">

      {/* Section hero avec les stats et les boutons d'action */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Bienvenue dans votre communauté
            </h1>
            <p className="text-lg text-white opacity-90 mb-8">
              Lokaly facilite l'entraide et les échanges entre voisins.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {/* bouton pour créer une nouvelle annonce */}
              <Button
                variant="white"
                icon={<Plus size={18} />}
                onClick={() => navigate('/annonces/nouvelle')}
              >
                Nouvelle annonce
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/annonces')}
                className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
              >
                Voir les annonces
              </Button>
            </div>

            {/* statistiques de la communauté */}
            <div className="flex gap-8 mt-8 pt-6 border-t border-white/20 justify-center">
              <div>
                <p className="text-2xl font-bold text-white">{mockStats.habitants}</p>
                <p className="text-white text-sm opacity-70">Habitants</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{mockStats.annonces}</p>
                <p className="text-white text-sm opacity-70">Annonces</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{mockStats.groupes}</p>
                <p className="text-white text-sm opacity-70">Groupes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section annonces récentes - on affiche les 4 premières */}
      <section className="py-16 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[var(--color-primary)] font-medium text-sm uppercase tracking-wider">
                Découvrir
              </span>
              <h2 className="text-3xl font-bold mt-1">Annonces récentes</h2>
            </div>
            <Button
              variant="outline"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/annonces')}
              className="hidden sm:flex"
            >
              Voir toutes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockAnnonces.slice(0, 4).map((annonce) => (
              <AnnonceCard
                key={annonce.id}
                annonce={annonce}
                onClick={() => navigate('/annonces/' + annonce.id)}
                onInterested={() => toast.success('Intérêt manifesté ! Le contact sera partagé.')}
              />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button
              variant="outline"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/annonces')}
            >
              Voir toutes les annonces
            </Button>
          </div>
        </div>
      </section>

      {/* Section groupes actifs - on affiche les 3 premiers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[var(--color-secondary)] font-medium text-sm uppercase tracking-wider">
                Communauté
              </span>
              <h2 className="text-3xl font-bold mt-1">Groupes actifs</h2>
            </div>
            <Button
              variant="outline"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/groupes')}
              className="hidden sm:flex"
            >
              Voir tous
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockGroupes.slice(0, 3).map((groupe) => (
              <GroupeCard
                key={groupe.id}
                groupe={groupe}
                onClick={() => navigate('/groupes/' + groupe.id)}
              />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button
              variant="outline"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/groupes')}
            >
              Voir tous les groupes
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
```

- [ ] **Étape 2 : Mettre à jour AnnoncesPage.tsx**

Changer l'en-tête de la fonction :
```tsx
// AnnoncesPage.tsx
// Liste de toutes les annonces avec filtres de recherche
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { AnnonceCard } from '../components/AnnonceCard';
import { Button } from '../components/Button';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { mockAnnonces } from '../data/mockData';
import { toast } from 'sonner';

// plus de props onNavigate
export function AnnoncesPage() {
  const navigate = useNavigate();
  // ... (garder tous les useState existants)
```

Et remplacer toutes les occurrences de `onNavigate` :
- `onNavigate('nouvelle-annonce')` → `navigate('/annonces/nouvelle')`
- `onNavigate('annonce-detail', annonce)` → `navigate('/annonces/' + annonce.id)`

- [ ] **Étape 3 : Mettre à jour GroupesPage.tsx**

```tsx
// GroupesPage.tsx
// Liste de tous les groupes communautaires
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { GroupeCard } from '../components/GroupeCard';
import { Plus } from 'lucide-react';
import { mockGroupes } from '../data/mockData';

// plus de props
export function GroupesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* en-tête avec bouton créer un groupe */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1>Groupes communautaires</h1>
            <p className="text-[var(--color-text-secondary)] mt-2">
              Rejoignez des groupes qui partagent vos centres d'intérêt
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={() => navigate('/groupes/creer')}
          >
            Créer un groupe
          </Button>
        </div>

        {/* grille de toutes les cartes groupe */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockGroupes.map((groupe) => (
            <GroupeCard
              key={groupe.id}
              groupe={groupe}
              onClick={() => navigate('/groupes/' + groupe.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Étape 4 : Mettre à jour NouvelleAnnoncePage.tsx**

Changer l'en-tête :
```tsx
// NouvelleAnnoncePage.tsx
// Formulaire de création d'une nouvelle annonce
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// ... (garder tous les autres imports)

// plus de props
export function NouvelleAnnoncePage() {
  const navigate = useNavigate();
  // ... (garder tous les useState existants)
```

Remplacer :
- `onNavigate('home')` → `navigate('/')`
- `onNavigate('annonces')` → `navigate('/annonces')`

- [ ] **Étape 5 : Mettre à jour CreerGroupePage.tsx**

```tsx
// CreerGroupePage.tsx
// Formulaire pour créer un nouveau groupe communautaire
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Select } from '../components/Select';
import { Card } from '../components/Card';
import { ArrowLeft, Users, Send } from 'lucide-react';
import { toast } from 'sonner';

// plus de props
export function CreerGroupePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: envoyer les données au backend quand il sera prêt
    toast.success('Groupe créé avec succès ! Il commencera au Niveau 1.');
    navigate('/groupes'); // retour à la liste des groupes après création
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* bouton retour */}
        <Button
          variant="outline"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/groupes')}
          className="mb-6"
        >
          Retour
        </Button>
        {/* ... (garder le reste du JSX existant sans modification) */}
```

- [ ] **Étape 6 : Mettre à jour ProfilPage.tsx**

Changer uniquement l'en-tête (ProfilPage n'utilise pas onNavigate dans le JSX) :
```tsx
// ProfilPage.tsx
// Page de profil de l'utilisateur connecté
import React, { useState } from 'react';
// pas besoin de useNavigate ici, ProfilPage ne navigue nulle part
import { Button } from '../components/Button';
// ... (garder tous les autres imports)

// on supprime l'interface ProfilPageProps et le paramètre { onNavigate }
export function ProfilPage() {
  // ... (garder tout le reste exactement pareil)
```

- [ ] **Étape 7 : Commit**

```bash
git add src/pages/HomePage.tsx src/pages/AnnoncesPage.tsx src/pages/GroupesPage.tsx src/pages/NouvelleAnnoncePage.tsx src/pages/CreerGroupePage.tsx src/pages/ProfilPage.tsx
git commit -m "update user pages to use useNavigate, remove onNavigate props"
```

---

## Task 9 : Mettre à jour les pages de détail (useParams)

**Files:**
- Rewrite: `src/pages/AnnonceDetailPage.tsx`
- Rewrite: `src/pages/GroupeDetailPage.tsx`

Ces pages n'ont plus besoin de recevoir les données en prop — elles récupèrent l'id depuis l'URL et cherchent l'objet dans mockData.

- [ ] **Étape 1 : Réécrire AnnonceDetailPage.tsx**

```tsx
// AnnonceDetailPage.tsx
// Détail d'une annonce - on récupère l'annonce via l'id dans l'URL
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { MapPin, Calendar, Heart, ArrowLeft, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { mockAnnonces } from '../data/mockData';

// plus de props - on utilise useParams pour récupérer l'id depuis l'URL
export function AnnonceDetailPage() {
  const { id } = useParams<{ id: string }>(); // récupère l'id depuis /annonces/:id
  const navigate = useNavigate();
  const [interested, setInterested] = React.useState(false);

  // on cherche l'annonce correspondant à l'id dans les données mock
  const annonce = mockAnnonces.find(a => a.id === id);

  // si l'annonce n'existe pas, on affiche un message d'erreur
  if (!annonce) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Annonce introuvable</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Cette annonce n'existe pas ou a été supprimée.
          </p>
          <Button variant="primary" onClick={() => navigate('/annonces')}>
            Retour aux annonces
          </Button>
        </div>
      </div>
    );
  }

  const handleInterest = () => {
    setInterested(true);
    alert('Merci pour votre intérêt ! Vous pouvez maintenant contacter l\'auteur via le lien ci-dessous.');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* bouton retour vers la liste */}
        <Button
          variant="outline"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/annonces')}
          className="mb-6"
        >
          Retour aux annonces
        </Button>

        {/* Carte principale de l'annonce */}
        <Card>
          <div className="overflow-hidden">
            {/* image de l'annonce */}
            <div className="aspect-[16/9] overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={annonce.image}
                alt={annonce.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* titre et badge type */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="flex-1">{annonce.name}</h1>
                  <Badge variant="accent">{annonce.type}</Badge>
                </div>
              </div>

              {/* localisation et disponibilité */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <MapPin size={20} />
                  <span>{annonce.location}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <Calendar size={20} />
                  <span>{annonce.disponibilite}</span>
                </div>
              </div>

              {/* description complète */}
              <div className="space-y-2">
                <h3>Description</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {annonce.description}
                </p>
              </div>

              {/* informations sur l'auteur */}
              <div className="pt-6 border-t border-[var(--color-border)]">
                <h4 className="mb-3">Proposé par</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">
                      {annonce.auteur.nom.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{annonce.auteur.nom}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Membre de la communauté</p>
                  </div>
                </div>
              </div>

              {/* bouton pour manifester son intérêt */}
              <div className="pt-6 border-t border-[var(--color-border)]">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Heart size={20} />}
                  onClick={handleInterest}
                  disabled={interested}
                >
                  {interested ? 'Intérêt manifesté ✓' : 'Je suis intéressé·e'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* encadré de contact affiché seulement si l'user a manifesté son intérêt */}
        {interested && (
          <Card className="mt-6">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-3">
                <MessageCircle size={24} className="text-[var(--color-primary)] flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4>Contactez l'auteur</h4>
                  <p className="text-[var(--color-text-secondary)]">
                    La messagerie se fait en dehors de la plateforme. Contactez {annonce.auteur.nom} via Line ou WhatsApp.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => window.open('https://line.me/', '_blank')}
                    className="mt-3"
                  >
                    Contacter via Line
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Étape 2 : Réécrire GroupeDetailPage.tsx**

```tsx
// GroupeDetailPage.tsx
// Détail d'un groupe - on récupère le groupe via l'id dans l'URL
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { AnnonceCard } from '../components/AnnonceCard';
import { ArrowLeft, Users, UserPlus, TrendingUp } from 'lucide-react';
import { mockAnnonces, mockGroupes } from '../data/mockData';
import { toast } from 'sonner';

// plus de props - on récupère l'id depuis l'URL
export function GroupeDetailPage() {
  const { id } = useParams<{ id: string }>(); // id depuis /groupes/:id
  const navigate = useNavigate();
  const [isMember, setIsMember] = React.useState(false);

  // cherche le groupe dans les données mock
  const groupe = mockGroupes.find(g => g.id === id);

  // cas où le groupe n'existe pas
  if (!groupe) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Groupe introuvable</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Ce groupe n'existe pas ou a été supprimé.
          </p>
          <Button variant="primary" onClick={() => navigate('/groupes')}>
            Retour aux groupes
          </Button>
        </div>
      </div>
    );
  }

  // on filtre les annonces qui appartiennent à ce groupe
  const groupeAnnonces = mockAnnonces.filter(a => groupe.annonces?.includes(a.id));

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* bouton retour */}
        <Button
          variant="outline"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/groupes')}
          className="mb-6"
        >
          Retour aux groupes
        </Button>

        {/* carte d'en-tête du groupe */}
        <Card className="mb-8">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1>{groupe.name}</h1>
                  <Badge variant="level" level={groupe.niveau}>
                    Niveau {groupe.niveau}
                  </Badge>
                </div>
                <p className="text-[var(--color-text-secondary)]">
                  {groupe.description}
                </p>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <Users size={20} />
                  <span>{groupe.members} membre{groupe.members > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* bouton pour rejoindre/quitter le groupe */}
              <Button
                variant={isMember ? 'secondary' : 'primary'}
                icon={<UserPlus size={20} />}
                onClick={() => setIsMember(!isMember)}
              >
                {isMember ? 'Membre ✓' : 'Rejoindre le groupe'}
              </Button>
            </div>
          </div>
        </Card>

        {/* annonces liées à ce groupe (s'il y en a) */}
        {groupeAnnonces.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-6">Annonces du groupe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupeAnnonces.map((annonce) => (
                <AnnonceCard
                  key={annonce.id}
                  annonce={annonce}
                  onClick={() => navigate('/annonces/' + annonce.id)}
                  onInterested={() => toast.success('Intérêt manifesté ! Le contact sera partagé.')}
                />
              ))}
            </div>
          </section>
        )}

        {/* activité récente (données statiques pour l'instant) */}
        <section>
          <h2 className="mb-6">Activité récente</h2>
          <div className="space-y-4">
            <Card>
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">3 nouveaux membres ce mois</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Le groupe continue de grandir !
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">2 ateliers organisés récemment</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Merci à tous les participants !
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Étape 3 : Commit**

```bash
git add src/pages/AnnonceDetailPage.tsx src/pages/GroupeDetailPage.tsx
git commit -m "rewrite detail pages to use useParams instead of pageData prop"
```

---

## Task 10 : Mettre à jour les pages admin

**Files:**
- Modify: `src/pages/AdminGroupsPage.tsx`
- Rewrite: `src/pages/AdminGroupDetailPage.tsx`
- Modify: `src/pages/AdminCustomizationPage.tsx`
- Modify: `src/pages/AdminDashboardPage.tsx` (supprimer onNavigate si présent)
- Modify: `src/pages/AdminUsersPage.tsx` (supprimer onNavigate si présent)
- Modify: `src/pages/AdminStatsPage.tsx` (supprimer onNavigate si présent)
- Modify: `src/pages/AdminValidationPage.tsx` (supprimer onNavigate si présent)

- [ ] **Étape 1 : Mettre à jour AdminGroupsPage.tsx**

Changer l'en-tête :
```tsx
// AdminGroupsPage.tsx
// Page admin - liste et gestion de tous les groupes
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Search, Users, Eye, TrendingUp, Star } from 'lucide-react';
import { mockGroupes } from '../data/mockData';

// plus de props
export function AdminGroupsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroupes = mockGroupes.filter(groupe =>
    groupe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // navigue vers la page de détail admin du groupe
  const handleViewGroup = (groupeId: string) => {
    navigate('/admin/groupes/' + groupeId);
  };

  // ... (garder tout le reste du JSX, juste remplacer les appels à onNavigate)
```

Remplacer `onNavigate('admin-group-detail', groupe)` par `handleViewGroup(groupe.id)`.

- [ ] **Étape 2 : Réécrire AdminGroupDetailPage.tsx**

```tsx
// AdminGroupDetailPage.tsx
// Page admin - détail d'un groupe avec membres et intéressés
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ArrowLeft, Users, Calendar, Heart, UserMinus, Crown } from 'lucide-react';
import { mockGroupes } from '../data/mockData';

// données mock des membres (en attendant le backend)
const mockMembres = [
  { id: '1', nom: 'Marie Dubois', role: 'admin', dateAdhesion: '2024-06-15' },
  { id: '2', nom: 'Pierre Leroy', role: 'membre', dateAdhesion: '2024-07-20' },
  { id: '3', nom: 'Sophie Martin', role: 'membre', dateAdhesion: '2024-08-10' },
  { id: '4', nom: 'Lucas Bernard', role: 'membre', dateAdhesion: '2024-09-05' },
];

// données mock des personnes intéressées
const mockInteresses = [
  { id: '1', nom: 'Julie Petit', annonce: 'Cours de couture gratuits', date: '2024-12-10' },
  { id: '2', nom: 'Marc Durand', annonce: 'Cours de couture gratuits', date: '2024-12-09' },
  { id: '3', nom: 'Emma Rousseau', annonce: 'Échange de graines', date: '2024-12-08' },
];

// plus de props - on récupère l'id depuis l'URL
export function AdminGroupDetailPage() {
  const { id } = useParams<{ id: string }>(); // id depuis /admin/groupes/:id
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'membres' | 'interesses'>('membres');

  // on cherche le groupe dans les données mock
  const groupe = mockGroupes.find(g => g.id === id);

  // si le groupe n'existe pas
  if (!groupe) {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--color-text-secondary)]">Groupe non trouvé</p>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/groupes')}
          className="mt-4"
        >
          Retour aux groupes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* en-tête avec bouton retour */}
      <div>
        <Button
          variant="outline"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/admin/groupes')}
          className="mb-4"
        >
          Retour aux groupes
        </Button>
        <h1>{groupe.name}</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">{groupe.description}</p>
      </div>

      {/* stats rapides du groupe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{groupe.members}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Membres</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Crown size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{groupe.niveau}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Niveau</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Heart size={24} className="text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockInteresses.length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Intéressés</p>
            </div>
          </div>
        </Card>
      </div>

      {/* onglets membres / intéressés */}
      <div className="flex gap-2 border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab('membres')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'membres'
              ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          Membres ({mockMembres.length})
        </button>
        <button
          onClick={() => setActiveTab('interesses')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'interesses'
              ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          Intéressés ({mockInteresses.length})
        </button>
      </div>

      {/* contenu des onglets */}
      {activeTab === 'membres' && (
        <Card>
          <div className="divide-y divide-[var(--color-border)]">
            {mockMembres.map((membre) => (
              <div key={membre.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {membre.nom.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{membre.nom}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Membre depuis le {membre.dateAdhesion}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={membre.role === 'admin' ? 'primary' : 'neutral'}>
                    {membre.role}
                  </Badge>
                  <button className="p-2 text-[var(--color-danger)] hover:bg-red-50 rounded-lg transition-colors">
                    <UserMinus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'interesses' && (
        <Card>
          <div className="divide-y divide-[var(--color-border)]">
            {mockInteresses.map((interesse) => (
              <div key={interesse.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {interesse.nom.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{interesse.nom}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Intéressé par : {interesse.annonce}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[var(--color-text-secondary)]" />
                  <span className="text-sm text-[var(--color-text-secondary)]">{interesse.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
```

- [ ] **Étape 3 : Mettre à jour AdminCustomizationPage.tsx**

Supprimer le prop `communaute` (la page utilise ses propres valeurs par défaut) :

```tsx
// AdminCustomizationPage.tsx
// Page admin - personnalisation de l'apparence de la communauté
// ... (garder tous les imports)

// on supprime le prop communaute - la page utilise des valeurs par défaut
export function AdminCustomizationPage() {
  // ... (garder tout le reste exactement pareil)
```

- [ ] **Étape 4 : Supprimer onNavigate dans les pages admin qui ne naviguent pas**

Pour `AdminDashboardPage`, `AdminUsersPage`, `AdminStatsPage`, `AdminValidationPage` : vérifier si elles ont un prop `onNavigate` et si oui, le supprimer de l'interface et de la signature de fonction.

- [ ] **Étape 5 : Commit**

```bash
git add src/pages/AdminGroupsPage.tsx src/pages/AdminGroupDetailPage.tsx src/pages/AdminCustomizationPage.tsx src/pages/AdminDashboardPage.tsx src/pages/AdminUsersPage.tsx src/pages/AdminStatsPage.tsx src/pages/AdminValidationPage.tsx
git commit -m "update admin pages to use useNavigate and useParams"
```

---

## Task 11 : Vérification finale

**Files:** aucun fichier modifié dans cette tâche

- [ ] **Étape 1 : Lancer le serveur de dev**

```bash
npm run dev
```

Ouvrir `http://localhost:3000`

- [ ] **Étape 2 : Tester le parcours utilisateur complet**

Vérifier dans le navigateur :
- [ ] `/login` → page de login s'affiche
- [ ] Login avec `test / test` → redirige vers `/`
- [ ] Navigation vers `/annonces` → liste des annonces
- [ ] Clic sur une annonce → `/annonces/1` s'affiche avec le bon contenu
- [ ] Bouton retour du navigateur → revient à `/annonces`
- [ ] Navigation vers `/groupes` → liste des groupes
- [ ] Clic sur un groupe → `/groupes/1` avec le bon groupe
- [ ] Navigation vers `/annonces/nouvelle` → formulaire de création
- [ ] Navigation vers `/groupes/creer` → formulaire de création groupe
- [ ] Navigation vers `/profil` → page profil
- [ ] Bouton "Admin" flottant → `/admin`
- [ ] Navigation dans la sidebar admin → URLs `/admin/users`, `/admin/groupes`, etc.
- [ ] Clic sur un groupe en admin → `/admin/groupes/1`
- [ ] Bouton "Retour au site" dans sidebar → `/`
- [ ] Bouton déconnexion → retour à `/login`
- [ ] Taper une URL directement (ex: `/annonces/2`) → page correcte s'affiche

- [ ] **Étape 3 : Commit final**

```bash
git add -A
git commit -m "complete React Router migration - all pages updated"
```
