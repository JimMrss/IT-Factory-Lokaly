# React Router DOM — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le système de navigation manuel (`currentPage` / `onNavigate`) par `react-router-dom` avec de vraies URLs dans le navigateur.

**Architecture:** On installe `react-router-dom`, on crée un `AuthContext` pour partager l'état de connexion, un `ProtectedRoute` pour protéger les pages, et un `router.tsx` central. Chaque composant utilise `useNavigate()` au lieu de recevoir `onNavigate` en prop.

**Tech Stack:** React 18, TypeScript, Vite, react-router-dom v6, Tailwind CSS

> **Note tests :** Ce projet n'a pas de setup de tests. Les étapes de vérification se font en lançant `npm run dev` et en testant manuellement les URLs dans le navigateur.

---

## Fichiers créés

| Fichier | Rôle |
|---------|------|
| `src/context/AuthContext.tsx` | Gère l'état de connexion (user, login, logout) |
| `src/components/ProtectedRoute.tsx` | Protège les pages — redirige vers /login si pas connecté |
| `src/layouts/PublicLayout.tsx` | Layout public : Header + Outlet + Footer |
| `src/layouts/AdminLayout.tsx` | Layout admin : AdminSidebar + Outlet |
| `src/router.tsx` | Toutes les routes de l'application |

## Fichiers modifiés

| Fichier | Ce qui change |
|---------|---------------|
| `src/main.tsx` | RouterProvider + AuthProvider à la place de App |
| `src/App.tsx` | Supprimé (plus nécessaire) |
| `src/pages/LoginPage.tsx` | useAuth().login au lieu de onLogin prop |
| `src/components/Header.tsx` | useNavigate + useLocation au lieu de onNavigate/currentPage |
| `src/components/Footer.tsx` | useNavigate au lieu de onNavigate |
| `src/components/AdminSidebar.tsx` | useNavigate + useLocation |
| `src/pages/HomePage.tsx` | useNavigate, retire prop onNavigate |
| `src/pages/AnnoncesPage.tsx` | useNavigate, retire prop onNavigate |
| `src/pages/AnnonceDetailPage.tsx` | useParams + find mockData, retire props annonce/onNavigate |
| `src/pages/NouvelleAnnoncePage.tsx` | useNavigate, retire prop onNavigate |
| `src/pages/GroupesPage.tsx` | useNavigate, retire prop onNavigate |
| `src/pages/GroupeDetailPage.tsx` | useParams + find mockData, retire props groupe/onNavigate |
| `src/pages/CreerGroupePage.tsx` | useNavigate, retire prop onNavigate |
| `src/pages/ProfilPage.tsx` | useNavigate, retire prop onNavigate |
| `src/pages/AdminGroupsPage.tsx` | useNavigate, retire prop onNavigate |
| `src/pages/AdminGroupDetailPage.tsx` | useParams + find mockData, retire props groupe/onNavigate |
| `src/pages/AdminDashboardPage.tsx` | Aucun changement (pas de navigation) |
| `src/pages/AdminUsersPage.tsx` | Aucun changement |
| `src/pages/AdminStatsPage.tsx` | Aucun changement |
| `src/pages/AdminValidationPage.tsx` | Aucun changement |
| `src/pages/AdminCustomizationPage.tsx` | Aucun changement |

---

## Task 1 : Installer react-router-dom

**Files:**
- Modify: `package.json`

- [ ] **Step 1 : Installer le package**

```bash
npm install react-router-dom
```

- [ ] **Step 2 : Vérifier que l'installation a fonctionné**

```bash
npm list react-router-dom
```

Résultat attendu : `react-router-dom@6.x.x`

- [ ] **Step 3 : Commit**

```bash
git add package.json package-lock.json
git commit -m "installe react-router-dom"
```

---

## Task 2 : Créer AuthContext

**Files:**
- Create: `src/context/AuthContext.tsx`

- [ ] **Step 1 : Créer le fichier**

```tsx
// src/context/AuthContext.tsx
// Ce fichier crée un "contexte" React pour partager les infos de connexion
// dans toute l'application sans passer des props partout

import React, { createContext, useContext, useState, useEffect } from 'react';

// On définit les types TypeScript pour notre utilisateur
interface User {
  username: string;
  email?: string; // le ? veut dire que c'est optionnel
}

// On définit ce que notre contexte va exposer aux composants
interface AuthContextType {
  user: User | null;        // l'utilisateur connecté, ou null si pas connecté
  isLoading: boolean;       // true pendant qu'on vérifie le localStorage
  login: (user: User) => void;
  logout: () => void;
}

// createContext crée le contexte — null par défaut car pas encore initialisé
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider est le composant qui va "entourer" l'app
// Il rend les infos disponibles partout à l'intérieur
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // useState crée des variables qui déclenchent un re-rendu quand elles changent
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect s'exécute une seule fois au chargement (le [] vide = "juste au montage")
  // On vérifie si l'utilisateur était déjà connecté avant (dans le localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('lokaly_user');
    if (savedUser) {
      try {
        // JSON.parse convertit le texte stocké en objet JavaScript
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Si le texte stocké est corrompu, on le supprime
        localStorage.removeItem('lokaly_user');
      }
    }
    // On indique que le chargement est terminé
    setIsLoading(false);
  }, []);

  // Fonction appelée quand l'utilisateur se connecte
  const login = (loggedUser: User) => {
    // On sauvegarde dans localStorage pour garder la connexion après refresh
    localStorage.setItem('lokaly_user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  // Fonction appelée quand l'utilisateur se déconnecte
  const logout = () => {
    localStorage.removeItem('lokaly_user');
    setUser(null);
  };

  // On "fournit" ces valeurs à tous les composants enfants via le contexte
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte facilement dans n'importe quel composant
// Au lieu de : const { user } = useContext(AuthContext)
// On fait juste : const { user } = useAuth()
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Erreur de développeur : useAuth doit être utilisé dans un AuthProvider
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/context/AuthContext.tsx
git commit -m "ajoute AuthContext pour gérer la connexion"
```

---

## Task 3 : Créer ProtectedRoute

**Files:**
- Create: `src/components/ProtectedRoute.tsx`

- [ ] **Step 1 : Créer le fichier**

```tsx
// src/components/ProtectedRoute.tsx
// Ce composant protège les pages qui nécessitent une connexion
// Si l'utilisateur n'est pas connecté → on le redirige vers /login
// Si l'utilisateur est connecté → on affiche la page normalement

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode; // les composants enfants à afficher si connecté
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // On récupère l'état de connexion depuis notre contexte
  const { user, isLoading } = useAuth();

  // Pendant le chargement, on affiche un écran d'attente
  // (le temps de vérifier le localStorage)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
        <div className="text-center">
          {/* Logo animé pendant le chargement */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-xl mb-4 animate-pulse">
            <span className="text-3xl font-bold bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">L</span>
          </div>
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, Navigate le redirige vers /login
  // "replace" remplace l'entrée dans l'historique (pas de retour arrière vers la page protégée)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté, on affiche le contenu normalement
  // Le fragment <> </> évite d'ajouter une div inutile dans le DOM
  return <>{children}</>;
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/components/ProtectedRoute.tsx
git commit -m "ajoute ProtectedRoute pour sécuriser les pages"
```

---

## Task 4 : Créer les layouts

**Files:**
- Create: `src/layouts/PublicLayout.tsx`
- Create: `src/layouts/AdminLayout.tsx`

- [ ] **Step 1 : Créer src/layouts/PublicLayout.tsx**

```tsx
// src/layouts/PublicLayout.tsx
// Ce composant est le "cadre" des pages publiques
// Il affiche le Header en haut, le contenu de la page au milieu, le Footer en bas
// <Outlet /> est un composant de react-router-dom qui dit "affiche la page ici"

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export function PublicLayout() {
  // useNavigate permet de changer de page
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      {/* Notifications toast (messages en haut à droite) */}
      <Toaster position="top-right" richColors />

      {/* Header avec la barre de navigation */}
      <Header />

      {/* Zone principale : react-router affiche ici la bonne page selon l'URL */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer en bas */}
      <Footer />

      {/* Bouton flottant pour accéder au panel admin */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate('/admin')}
          className="bg-[var(--color-danger)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-[var(--color-danger-hover)] transition-colors"
        >
          Admin
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2 : Créer src/layouts/AdminLayout.tsx**

```tsx
// src/layouts/AdminLayout.tsx
// Ce composant est le "cadre" des pages admin
// Il affiche la sidebar à gauche et le contenu de la page à droite

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AdminSidebar } from '../components/AdminSidebar';

export function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Notifications toast */}
      <Toaster position="top-right" richColors />

      {/* Sidebar admin à gauche */}
      <AdminSidebar />

      {/* Contenu de la page admin à droite */}
      <main className="flex-1 lg:ml-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* react-router affiche ici la bonne page admin */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/layouts/PublicLayout.tsx src/layouts/AdminLayout.tsx
git commit -m "ajoute les layouts public et admin"
```

---

## Task 5 : Créer router.tsx

**Files:**
- Create: `src/router.tsx`

- [ ] **Step 1 : Créer le fichier**

```tsx
// src/router.tsx
// Ce fichier définit TOUTES les routes de l'application
// Une route = une URL + la page à afficher
// createBrowserRouter crée le routeur avec l'API moderne de react-router-dom v6

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// On importe les layouts (cadres des pages)
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// On importe le composant de protection
import { ProtectedRoute } from './components/ProtectedRoute';

// On importe toutes les pages
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { AnnoncesPage } from './pages/AnnoncesPage';
import { AnnonceDetailPage } from './pages/AnnonceDetailPage';
import { NouvelleAnnoncePage } from './pages/NouvelleAnnoncePage';
import { GroupesPage } from './pages/GroupesPage';
import { GroupeDetailPage } from './pages/GroupeDetailPage';
import { CreerGroupePage } from './pages/CreerGroupePage';
import { ProfilPage } from './pages/ProfilPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminGroupsPage } from './pages/AdminGroupsPage';
import { AdminGroupDetailPage } from './pages/AdminGroupDetailPage';
import { AdminStatsPage } from './pages/AdminStatsPage';
import { AdminValidationPage } from './pages/AdminValidationPage';
import { AdminCustomizationPage } from './pages/AdminCustomizationPage';

// createBrowserRouter prend un tableau de routes
// Chaque route a : path (l'URL) et element (ce qu'on affiche)
// Les "children" sont des routes imbriquées (pages dans un layout)
export const router = createBrowserRouter([

  // ========== PAGE DE LOGIN ==========
  // Pas de layout ni de protection — tout le monde peut y accéder
  {
    path: '/login',
    element: <LoginPage />,
  },

  // ========== PAGES PUBLIQUES ==========
  // Ces pages sont protégées (login requis) et utilisent le PublicLayout (Header + Footer)
  {
    path: '/',
    element: (
      // ProtectedRoute vérifie que l'utilisateur est connecté
      // S'il ne l'est pas → redirige vers /login
      <ProtectedRoute>
        <PublicLayout />
      </ProtectedRoute>
    ),
    // Les "children" s'affichent dans le <Outlet /> du PublicLayout
    children: [
      // index: true veut dire que c'est la page par défaut pour ce chemin (/)
      { index: true, element: <HomePage /> },

      // /annonces → liste des annonces
      { path: 'annonces', element: <AnnoncesPage /> },

      // /annonces/nouvelle → formulaire de création
      // IMPORTANT : cette route doit être avant /annonces/:id
      // sinon "nouvelle" serait interprété comme un ID
      { path: 'annonces/nouvelle', element: <NouvelleAnnoncePage /> },

      // /annonces/1 (ou n'importe quel ID) → détail d'une annonce
      // :id est un paramètre dynamique — on le récupère avec useParams()
      { path: 'annonces/:id', element: <AnnonceDetailPage /> },

      // /groupes → liste des groupes
      { path: 'groupes', element: <GroupesPage /> },

      // /groupes/creer → formulaire de création de groupe
      { path: 'groupes/creer', element: <CreerGroupePage /> },

      // /groupes/1 → détail d'un groupe
      { path: 'groupes/:id', element: <GroupeDetailPage /> },

      // /profil → page de profil
      { path: 'profil', element: <ProfilPage /> },
    ],
  },

  // ========== PAGES ADMIN ==========
  // Ces pages utilisent le AdminLayout (avec la sidebar)
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // /admin → tableau de bord
      { index: true, element: <AdminDashboardPage /> },

      // /admin/utilisateurs
      { path: 'utilisateurs', element: <AdminUsersPage /> },

      // /admin/groupes → liste des groupes (vue admin)
      { path: 'groupes', element: <AdminGroupsPage /> },

      // /admin/groupes/1 → détail d'un groupe (vue admin)
      { path: 'groupes/:id', element: <AdminGroupDetailPage /> },

      // /admin/stats
      { path: 'stats', element: <AdminStatsPage /> },

      // /admin/validation
      { path: 'validation', element: <AdminValidationPage /> },

      // /admin/personnalisation
      { path: 'personnalisation', element: <AdminCustomizationPage /> },
    ],
  },
]);
```

- [ ] **Step 2 : Commit**

```bash
git add src/router.tsx
git commit -m "ajoute le router avec toutes les routes"
```

---

## Task 6 : Mettre à jour main.tsx

**Files:**
- Modify: `src/main.tsx`

- [ ] **Step 1 : Remplacer le contenu de main.tsx**

```tsx
// src/main.tsx
// Point d'entrée de l'application React
// On configure ici les "providers" qui entourent toute l'app

import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./router";
import "./styles/globals.css";

// createRoot monte l'application React dans la div #root du HTML
createRoot(document.getElementById("root")!).render(
  // AuthProvider rend les infos de connexion disponibles partout
  <AuthProvider>
    {/* RouterProvider active le système de routing de react-router-dom */}
    <RouterProvider router={router} />
  </AuthProvider>
);
```

- [ ] **Step 2 : Supprimer App.tsx**

App.tsx n'est plus nécessaire — toute sa logique est maintenant dans AuthContext, router.tsx et les layouts.

```bash
# Supprimer App.tsx (il n'est plus importé nulle part)
del src\App.tsx
```

- [ ] **Step 3 : Vérifier que l'app compile sans erreurs**

```bash
npm run dev
```

Ouvrir http://localhost:5173 — on doit être redirigé vers /login (car pas connecté).

- [ ] **Step 4 : Commit**

```bash
git add src/main.tsx
git rm src/App.tsx
git commit -m "branche main.tsx sur RouterProvider + supprime App.tsx"
```

---

## Task 7 : Mettre à jour LoginPage

**Files:**
- Modify: `src/pages/LoginPage.tsx`

- [ ] **Step 1 : Modifier LoginPage pour utiliser useAuth et useNavigate**

Remplacer le début du fichier (interface + fonction) :

```tsx
// src/pages/LoginPage.tsx
// Page de connexion et d'inscription
// Utilise useAuth() pour connecter l'utilisateur
// Utilise useNavigate() pour rediriger après connexion

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Users, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Plus besoin de props — on utilise le contexte et le router directement
export function LoginPage() {
  // useNavigate permet de changer de page en changeant l'URL
  const navigate = useNavigate();

  // useAuth donne accès à la fonction login de notre AuthContext
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulation d'un délai réseau (sera remplacé par un vrai appel API)
    await new Promise(resolve => setTimeout(resolve, 800));

    if (loginUsername === 'test' && loginPassword === 'test') {
      // On utilise login() du contexte au lieu de onLogin prop
      login({ username: loginUsername });
      // Après connexion, on redirige vers la page d'accueil
      navigate('/');
    } else {
      setError('Identifiants incorrects');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!registerUsername || !registerEmail || !registerPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (registerPassword.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = { username: registerUsername, email: registerEmail };
    login(user);
    navigate('/');
  };

  // ... le reste du JSX reste exactement pareil
```

Garder tout le JSX existant (le return) sans modification.

- [ ] **Step 2 : Vérifier que la connexion fonctionne**

```bash
npm run dev
```

- Aller sur http://localhost:5173 → redirigé vers /login
- Connexion avec `test` / `test` → redirigé vers /
- L'URL dans le navigateur doit changer

- [ ] **Step 3 : Commit**

```bash
git add src/pages/LoginPage.tsx
git commit -m "LoginPage utilise useAuth et useNavigate"
```

---

## Task 8 : Mettre à jour Header

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1 : Réécrire Header.tsx**

```tsx
// src/components/Header.tsx
// Barre de navigation en haut de toutes les pages publiques
// useNavigate remplace onNavigate
// useLocation remplace currentPage (pour savoir quelle page est active)
// useAuth remplace les props user et onLogout

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, FileText, Users, User, Menu, X, LogOut } from 'lucide-react';

// Plus de props nécessaires — tout vient des hooks
export function Header({ communityName = 'Commune de Tori' }: { communityName?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // useNavigate retourne une fonction pour changer d'URL
  const navigate = useNavigate();

  // useLocation retourne l'objet URL actuel — on utilise pathname pour savoir où on est
  const location = useLocation();

  // useAuth donne accès à l'utilisateur connecté et à logout
  const { user, logout } = useAuth();

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
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {user.username}
                  </span>
                </div>
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
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{user.username}</p>
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
              <button
                onClick={() => {
                  handleLogout();
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

- [ ] **Step 2 : Commit**

```bash
git add src/components/Header.tsx
git commit -m "Header utilise useNavigate, useLocation et useAuth"
```

---

## Task 9 : Mettre à jour Footer et AdminSidebar

**Files:**
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/AdminSidebar.tsx`

- [ ] **Step 1 : Mettre à jour Footer.tsx**

Remplacer l'interface et la signature de fonction :

```tsx
// src/components/Footer.tsx
// Pied de page — utilise useNavigate au lieu du prop onNavigate

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Heart } from 'lucide-react';

// Plus de props — useNavigate remplace onNavigate
export function Footer() {
  const currentYear = new Date().getFullYear();

  // useNavigate pour naviguer vers les pages
  const navigate = useNavigate();
```

Dans le JSX, remplacer les appels `onNavigate?.(item.page)` par `navigate(url)`.

Remplacer la liste de navigation dans le Footer :

```tsx
{[
  { label: 'Accueil', path: '/' },
  { label: 'Annonces', path: '/annonces' },
  { label: 'Groupes', path: '/groupes' },
  { label: 'Mon Profil', path: '/profil' },
].map((item) => (
  <li key={item.path}>
    <button
      onClick={() => navigate(item.path)}
      className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm inline-block"
    >
      {item.label}
    </button>
  </li>
))}
```

Garder tout le reste du JSX identique.

- [ ] **Step 2 : Mettre à jour AdminSidebar.tsx**

```tsx
// src/components/AdminSidebar.tsx
// Sidebar du panel admin — useNavigate + useLocation remplacent les props

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, BarChart3, Palette, Menu, X, UsersRound, ClipboardCheck } from 'lucide-react';

// Plus de props nécessaires
export function AdminSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  // useNavigate pour aller sur une page admin
  const navigate = useNavigate();

  // useLocation pour savoir quelle page admin est active
  const location = useLocation();

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
```

Dans le JSX, remplacer `onNavigate(item.id)` par `navigate(item.path)` et `currentPage === item.id` par `isActive(item.path)`.

- [ ] **Step 3 : Commit**

```bash
git add src/components/Footer.tsx src/components/AdminSidebar.tsx
git commit -m "Footer et AdminSidebar utilisent useNavigate et useLocation"
```

---

## Task 10 : Mettre à jour les pages simples

Pages qui utilisent `onNavigate` mais **pas** `useParams` (pas de détail avec ID).

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/AnnoncesPage.tsx`
- Modify: `src/pages/NouvelleAnnoncePage.tsx`
- Modify: `src/pages/GroupesPage.tsx`
- Modify: `src/pages/CreerGroupePage.tsx`
- Modify: `src/pages/ProfilPage.tsx`

Pour **chaque** page ci-dessus, faire ces 3 changements :

**Changement 1 — Supprimer l'interface de props et le prop dans la signature :**

```tsx
// AVANT
interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}
export function HomePage({ onNavigate }: HomePageProps) {

// APRÈS
export function HomePage() {
```

**Changement 2 — Ajouter les imports et le hook en haut de la fonction :**

```tsx
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  // useNavigate retourne une fonction navigate() pour changer de page
  const navigate = useNavigate();
```

**Changement 3 — Remplacer chaque appel onNavigate par navigate avec la bonne URL :**

| Ancien appel | Nouveau appel |
|---|---|
| `onNavigate('home')` | `navigate('/')` |
| `onNavigate('annonces')` | `navigate('/annonces')` |
| `onNavigate('nouvelle-annonce')` | `navigate('/annonces/nouvelle')` |
| `onNavigate('annonce-detail', annonce)` | `navigate('/annonces/' + annonce.id)` |
| `onNavigate('groupes')` | `navigate('/groupes')` |
| `onNavigate('groupe-detail', groupe)` | `navigate('/groupes/' + groupe.id)` |
| `onNavigate('creer-groupe')` | `navigate('/groupes/creer')` |
| `onNavigate('profil')` | `navigate('/profil')` |

- [ ] **Step 1 : Mettre à jour HomePage.tsx** (appliquer les 3 changements ci-dessus)

- [ ] **Step 2 : Mettre à jour AnnoncesPage.tsx** (appliquer les 3 changements)

- [ ] **Step 3 : Mettre à jour NouvelleAnnoncePage.tsx** (appliquer les 3 changements)

- [ ] **Step 4 : Mettre à jour GroupesPage.tsx** (appliquer les 3 changements)

- [ ] **Step 5 : Mettre à jour CreerGroupePage.tsx** (appliquer les 3 changements)

- [ ] **Step 6 : Mettre à jour ProfilPage.tsx** (appliquer les 3 changements)

- [ ] **Step 7 : Vérifier dans le navigateur**

```bash
npm run dev
```

- Naviguer entre accueil, annonces, groupes, profil
- Vérifier que les URLs changent bien dans le navigateur

- [ ] **Step 8 : Commit**

```bash
git add src/pages/HomePage.tsx src/pages/AnnoncesPage.tsx src/pages/NouvelleAnnoncePage.tsx src/pages/GroupesPage.tsx src/pages/CreerGroupePage.tsx src/pages/ProfilPage.tsx
git commit -m "pages publiques utilisent useNavigate"
```

---

## Task 11 : Mettre à jour AnnonceDetailPage

**Files:**
- Modify: `src/pages/AnnonceDetailPage.tsx`

- [ ] **Step 1 : Réécrire le début de AnnonceDetailPage.tsx**

```tsx
// src/pages/AnnonceDetailPage.tsx
// Page de détail d'une annonce
// useParams récupère l'ID depuis l'URL (ex: /annonces/3 → id = "3")
// On cherche ensuite l'annonce correspondante dans mockData

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { MapPin, Calendar, Heart, ArrowLeft, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { mockAnnonces } from '../data/mockData';

// Plus de props — on utilise useParams pour lire l'ID depuis l'URL
export function AnnonceDetailPage() {
  // useParams lit les paramètres dynamiques de l'URL
  // Pour l'URL /annonces/3, id vaut "3" (c'est une string)
  const { id } = useParams();

  // useNavigate pour le bouton "retour"
  const navigate = useNavigate();

  const [interested, setInterested] = React.useState(false);

  // On cherche l'annonce dans mockData avec cet ID
  // id est une string et annonce.id aussi, donc pas besoin de convertir
  const annonce = mockAnnonces.find(a => a.id === id);

  // Si l'annonce n'existe pas (ID invalide dans l'URL), on affiche un message
  if (!annonce) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500">Annonce introuvable</p>
          <button
            onClick={() => navigate('/annonces')}
            className="mt-4 text-[var(--color-primary)] hover:underline"
          >
            Retour aux annonces
          </button>
        </div>
      </div>
    );
  }

  const handleInterest = () => {
    setInterested(true);
    alert('Merci pour votre intérêt ! Vous pouvez maintenant contacter l\'auteur via le lien ci-dessous.');
  };
```

Dans le JSX, remplacer `onNavigate('annonces')` par `navigate('/annonces')`.

- [ ] **Step 2 : Tester**

```bash
npm run dev
```

- Cliquer sur une annonce depuis la liste → l'URL doit devenir `/annonces/1`
- Rafraîchir la page → la page doit s'afficher correctement
- Aller sur une URL invalide `/annonces/999` → message "Annonce introuvable"

- [ ] **Step 3 : Commit**

```bash
git add src/pages/AnnonceDetailPage.tsx
git commit -m "AnnonceDetailPage utilise useParams pour lire l'ID"
```

---

## Task 12 : Mettre à jour GroupeDetailPage

**Files:**
- Modify: `src/pages/GroupeDetailPage.tsx`

- [ ] **Step 1 : Réécrire le début de GroupeDetailPage.tsx**

```tsx
// src/pages/GroupeDetailPage.tsx
// Page de détail d'un groupe
// Même principe que AnnonceDetailPage : useParams + find dans mockData

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { AnnonceCard } from '../components/AnnonceCard';
import { ArrowLeft, Users, UserPlus, TrendingUp } from 'lucide-react';
import { mockAnnonces, mockGroupes } from '../data/mockData';
import { toast } from 'sonner';

// Plus de props groupe et onNavigate
export function GroupeDetailPage() {
  // useParams lit l'ID depuis l'URL (/groupes/2 → id = "2")
  const { id } = useParams();
  const navigate = useNavigate();

  const [isMember, setIsMember] = React.useState(false);

  // On cherche le groupe dans mockData
  const groupe = mockGroupes.find(g => g.id === id);

  // Si le groupe n'existe pas, on affiche un message d'erreur
  if (!groupe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500">Groupe introuvable</p>
          <button
            onClick={() => navigate('/groupes')}
            className="mt-4 text-[var(--color-primary)] hover:underline"
          >
            Retour aux groupes
          </button>
        </div>
      </div>
    );
  }

  // Les annonces liées à ce groupe
  const groupeAnnonces = mockAnnonces.filter((a) => groupe.annonces?.includes(a.id));
```

Dans le JSX :
- Remplacer `onNavigate('groupes')` par `navigate('/groupes')`
- Remplacer `onNavigate('annonce-detail', annonce)` par `navigate('/annonces/' + annonce.id)`

- [ ] **Step 2 : Tester**

```bash
npm run dev
```

- Cliquer sur un groupe → l'URL doit devenir `/groupes/1`
- Rafraîchir → la page reste

- [ ] **Step 3 : Commit**

```bash
git add src/pages/GroupeDetailPage.tsx
git commit -m "GroupeDetailPage utilise useParams pour lire l'ID"
```

---

## Task 13 : Mettre à jour les pages admin

**Files:**
- Modify: `src/pages/AdminGroupsPage.tsx`

Les autres pages admin (AdminDashboardPage, AdminUsersPage, AdminStatsPage, AdminValidationPage, AdminCustomizationPage) n'utilisent pas `onNavigate` — **aucun changement nécessaire**.

- [ ] **Step 1 : Mettre à jour AdminGroupsPage.tsx**

Remplacer l'interface, la signature et les appels onNavigate :

```tsx
// src/pages/AdminGroupsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Search, Users, Eye, TrendingUp, Star } from 'lucide-react';
import { mockGroupes } from '../data/mockData';

// Plus de props onNavigate
export function AdminGroupsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // useNavigate pour naviguer vers le détail d'un groupe
  const navigate = useNavigate();

  const filteredGroupes = mockGroupes.filter(groupe =>
    groupe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewGroup = (groupe: typeof mockGroupes[0]) => {
    // Au lieu de passer l'objet entier, on navigue vers l'URL avec l'ID
    navigate('/admin/groupes/' + groupe.id);
  };
```

Garder tout le reste du JSX identique.

- [ ] **Step 2 : Commit**

```bash
git add src/pages/AdminGroupsPage.tsx
git commit -m "AdminGroupsPage utilise useNavigate"
```

---

## Task 14 : Mettre à jour AdminGroupDetailPage

**Files:**
- Modify: `src/pages/AdminGroupDetailPage.tsx`

- [ ] **Step 1 : Réécrire le début de AdminGroupDetailPage.tsx**

```tsx
// src/pages/AdminGroupDetailPage.tsx
// Page de détail d'un groupe dans le panel admin
// Utilise useParams pour lire l'ID depuis /admin/groupes/:id

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ArrowLeft, Users, Calendar, Heart, UserMinus, Crown } from 'lucide-react';
import { mockGroupes } from '../data/mockData';

// Données mock locales pour les membres (resteront jusqu'à l'implémentation du backend)
const mockMembres = [
  { id: '1', nom: 'Marie Dubois', role: 'admin', dateAdhesion: '2024-06-15' },
  { id: '2', nom: 'Pierre Leroy', role: 'membre', dateAdhesion: '2024-07-20' },
  { id: '3', nom: 'Sophie Martin', role: 'membre', dateAdhesion: '2024-08-10' },
  { id: '4', nom: 'Lucas Bernard', role: 'membre', dateAdhesion: '2024-09-05' },
];

const mockInteresses = [
  { id: '1', nom: 'Julie Petit', annonce: 'Cours de couture gratuits', date: '2024-12-10' },
  { id: '2', nom: 'Marc Durand', annonce: 'Cours de couture gratuits', date: '2024-12-09' },
  { id: '3', nom: 'Emma Rousseau', annonce: 'Échange de graines', date: '2024-12-08' },
];

// Plus de props groupe et onNavigate
export function AdminGroupDetailPage() {
  const [activeTab, setActiveTab] = useState<'membres' | 'interesses'>('membres');

  // useParams lit l'ID depuis /admin/groupes/2 → id = "2"
  const { id } = useParams();
  const navigate = useNavigate();

  // On cherche le groupe dans mockData
  const groupe = mockGroupes.find(g => g.id === id);

  // Si le groupe n'existe pas
  if (!groupe) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">Groupe introuvable</p>
        <button
          onClick={() => navigate('/admin/groupes')}
          className="mt-4 text-[var(--color-primary)] hover:underline"
        >
          Retour à la liste
        </button>
      </div>
    );
  }
```

Dans le JSX, remplacer `onNavigate('admin-groups')` par `navigate('/admin/groupes')`.

- [ ] **Step 2 : Vérifier le panel admin**

```bash
npm run dev
```

- Aller sur /admin/groupes → la liste s'affiche
- Cliquer sur un groupe → l'URL devient /admin/groupes/1
- Rafraîchir → la page reste

- [ ] **Step 3 : Commit**

```bash
git add src/pages/AdminGroupDetailPage.tsx
git commit -m "AdminGroupDetailPage utilise useParams pour lire l'ID"
```

---

## Task 15 : Vérification finale

- [ ] **Step 1 : Lancer l'application**

```bash
npm run dev
```

- [ ] **Step 2 : Tester toutes les URLs**

| URL à tester | Résultat attendu |
|---|---|
| http://localhost:5173 | Redirigé vers /login |
| Se connecter (test/test) | Redirigé vers / |
| http://localhost:5173/annonces | Page liste annonces |
| Cliquer sur une annonce | URL devient /annonces/1 |
| Rafraîchir /annonces/1 | Page reste affichée |
| http://localhost:5173/groupes | Page liste groupes |
| Cliquer sur un groupe | URL devient /groupes/1 |
| http://localhost:5173/admin | Dashboard admin |
| http://localhost:5173/admin/groupes | Liste groupes admin |
| Cliquer sur un groupe admin | URL devient /admin/groupes/1 |
| Bouton retour dans les pages | Fonctionne correctement |
| Se déconnecter | Redirigé vers /login |
| Aller sur /annonces sans être connecté | Redirigé vers /login |

- [ ] **Step 3 : Commit final**

```bash
git add -A
git commit -m "migration complète vers react-router-dom"
```
