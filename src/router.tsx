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
import { AdminRoute } from './components/AdminRoute';

// On importe la page d'erreur personnalisée
import { ErrorPage } from './pages/ErrorPage';

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
    errorElement: <ErrorPage />,
  },

  // ========== PAGES PUBLIQUES ==========
  // Ces pages sont protégées (login requis) et utilisent le PublicLayout (Header + Footer)
  {
    path: '/',
    errorElement: <ErrorPage />,
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
    errorElement: <ErrorPage />,
    element: (
      // ProtectedRoute : login requis — AdminRoute : réservé aux admins (permissions === 1)
      <ProtectedRoute>
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
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
