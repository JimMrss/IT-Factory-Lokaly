# Design : Migration vers React Router DOM

**Date :** 2026-05-13  
**Projet :** Lokaly  
**Scope :** Remplacer le système de navigation manuel (`currentPage` / `onNavigate`) par `react-router-dom` avec de vraies URLs dans le navigateur.

---

## Contexte

Actuellement, la navigation dans Lokaly fonctionne avec un état `currentPage` dans `App.tsx`. Quand on clique sur un lien, on appelle `onNavigate('annonces')` qui change l'état. Aucune URL ne change dans le navigateur — si on rafraîchit la page, on revient toujours à l'accueil.

L'objectif est de remplacer tout ça par `react-router-dom` pour avoir de vraies URLs comme `/annonces`, `/annonces/3`, `/admin/utilisateurs`, etc.

---

## Package à installer

```
react-router-dom
```

À ajouter dans `package.json` via `npm install react-router-dom`.

---

## Structure des URLs

### Pages publiques (protégées — login requis)

| URL | Page |
|-----|------|
| `/login` | LoginPage |
| `/` | HomePage |
| `/annonces` | AnnoncesPage |
| `/annonces/nouvelle` | NouvelleAnnoncePage |
| `/annonces/:id` | AnnonceDetailPage |
| `/groupes` | GroupesPage |
| `/groupes/creer` | CreerGroupePage |
| `/groupes/:id` | GroupeDetailPage |
| `/profil` | ProfilPage |

> **Important :** Dans le fichier `router.tsx`, `/annonces/nouvelle` doit être déclaré **avant** `/annonces/:id`. React Router v6 matche les segments statiques en priorité, mais par clarté on les met dans le bon ordre.

### Pages admin (protégées — login requis)

| URL | Page |
|-----|------|
| `/admin` | AdminDashboardPage |
| `/admin/utilisateurs` | AdminUsersPage |
| `/admin/groupes` | AdminGroupsPage |
| `/admin/groupes/:id` | AdminGroupDetailPage |
| `/admin/stats` | AdminStatsPage |
| `/admin/validation` | AdminValidationPage |
| `/admin/personnalisation` | AdminCustomizationPage |

---

## Nouveaux fichiers à créer

### `src/router.tsx`
Fichier central qui définit toutes les routes avec `createBrowserRouter`. Contient la liste complète des routes et les layouts (Header+Footer pour le public, AdminSidebar pour l'admin).

### `src/components/ProtectedRoute.tsx`
Composant qui vérifie si l'utilisateur est connecté (via `localStorage`). Si non connecté → redirige vers `/login`. Si connecté → affiche la page demandée.

---

## Fichiers à modifier

### `src/main.tsx`
- Entourer `<App />` avec `<RouterProvider router={router} />` (le router vient de `router.tsx`)

### `src/App.tsx`
- Retirer tout : `currentPage`, `pageData`, `handleNavigate`, le switch des pages
- Garder uniquement la logique auth : `user`, `handleLogin`, `handleLogout`
- Passer `user` et `handleLogout` via Context React (pour éviter le prop drilling)

### `src/components/Header.tsx`
- Retirer le prop `onNavigate` et `currentPage`
- Utiliser `useNavigate()` pour la navigation
- Utiliser `useLocation()` pour savoir quelle page est active (mettre en surbrillance le bon onglet)

### `src/components/Footer.tsx`
- Retirer le prop `onNavigate`
- Utiliser `useNavigate()`

### `src/components/AdminSidebar.tsx`
- Retirer les props `onNavigate` et `currentPage`
- Utiliser `useNavigate()` et `useLocation()`

### Toutes les pages (`src/pages/*.tsx`)
- Retirer le prop `onNavigate: (page: string, data?: any) => void`
- Remplacer `onNavigate('annonces')` par `navigate('/annonces')` (via `useNavigate()`)
- Remplacer `onNavigate('annonce-detail', annonce)` par `navigate('/annonces/' + annonce.id)`

### Pages de détail avec données
- `AnnonceDetailPage` : retirer le prop `annonce`, utiliser `useParams()` pour lire l'ID, faire `mockAnnonces.find(a => a.id === Number(id))`
- `GroupeDetailPage` : idem avec `mockGroupes`
- `AdminGroupDetailPage` : idem avec `mockGroupes`

---

## Context React pour l'auth

Pour éviter de passer `user` et `onLogout` à travers 3-4 niveaux de composants, on crée un `AuthContext` simple :

```tsx
// src/context/AuthContext.tsx
export const AuthContext = createContext(...)
export function AuthProvider({ children }) { ... }
export function useAuth() { return useContext(AuthContext) }
```

Le Header lira `user` et `onLogout` depuis ce contexte au lieu de les recevoir en props.

---

## Style de code : étudiant débutant

Tout le code doit être écrit avec :
- **Beaucoup de commentaires** qui expliquent POURQUOI et COMMENT chaque partie fonctionne
- Des commentaires qui expliquent les concepts react-router-dom (ce que fait `useNavigate`, `useParams`, `ProtectedRoute`, etc.)
- Des noms de variables clairs et simples
- Pas d'abstractions inutiles — du code direct et lisible

Exemple de style attendu :
```tsx
// On utilise useNavigate pour changer de page
// C'est l'équivalent de l'ancien onNavigate
const navigate = useNavigate();

// useParams nous donne les paramètres de l'URL
// Par exemple pour /annonces/3, params.id vaut "3"
const { id } = useParams();
```

---

## Ordre d'implémentation

1. Installer `react-router-dom`
2. Créer `src/context/AuthContext.tsx`
3. Créer `src/components/ProtectedRoute.tsx`
4. Créer `src/router.tsx`
5. Modifier `src/main.tsx`
6. Modifier `src/App.tsx`
7. Modifier `Header.tsx`, `Footer.tsx`, `AdminSidebar.tsx`
8. Modifier toutes les pages (retirer `onNavigate`, ajouter `useNavigate`)
9. Modifier les pages de détail (ajouter `useParams` + lookup mockData)
10. Tester que tout fonctionne (navigation, refresh, URLs directes)
