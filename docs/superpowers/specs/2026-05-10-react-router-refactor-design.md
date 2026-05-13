# Design : Migration React Router DOM + Refactor style étudiant

**Date :** 2026-05-10  
**Scope :** Tout le frontend (App.tsx, 16 pages, Header, Footer, AdminSidebar)

---

## Contexte

Le routing actuel est basé sur un `useState<PageType>` dans App.tsx. Chaque composant reçoit `onNavigate` en prop. Les pages de détail reçoivent `pageData: any`. Ce système ne permet pas d'URLs partageable, pas de bouton retour, et le code paraît généré automatiquement.

---

## Objectif

1. Migrer vers React Router DOM v6 (BrowserRouter)
2. URLs lisibles et fonctionnelles
3. Code style "étudiant 3ème année" : fonctionnel, commenté partout, sans sur-ingénierie

---

## Architecture de routing

### main.tsx
Enveloppe `<App />` dans `<BrowserRouter>`.

### App.tsx
Gère uniquement :
- Lecture du user depuis localStorage au montage
- Affichage de `<LoginPage />` si non connecté
- Layout user (Header + main + Footer) pour les routes `/`
- Layout admin (AdminSidebar + main) pour les routes `/admin/*`
- Un composant `<ProtectedRoute>` pour rediriger vers `/login` si non authentifié

### Routes

| URL | Composant |
|---|---|
| `/login` | LoginPage |
| `/` | HomePage |
| `/annonces` | AnnoncesPage |
| `/annonces/nouvelle` | NouvelleAnnoncePage |
| `/annonces/:id` | AnnonceDetailPage |
| `/groupes` | GroupesPage |
| `/groupes/creer` | CreerGroupePage |
| `/groupes/:id` | GroupeDetailPage |
| `/profil` | ProfilPage |
| `/admin` | AdminDashboardPage |
| `/admin/users` | AdminUsersPage |
| `/admin/groupes` | AdminGroupsPage |
| `/admin/groupes/:id` | AdminGroupDetailPage |
| `/admin/stats` | AdminStatsPage |
| `/admin/validation` | AdminValidationPage |
| `/admin/config` | AdminCustomizationPage |

---

## Suppression des onNavigate props

Tous les `onNavigate: (page: string, data?: any) => void` sont supprimés.

**Remplacement :**
- Navigation programmatique → `useNavigate()` hook dans le composant
- Liens statiques → `<Link to="/chemin">` de React Router
- `Header`, `Footer`, `AdminSidebar` deviennent autonomes (plus de props de navigation)

**Pages de détail :**
- `AnnonceDetailPage` : reçoit `useParams<{ id: string }>()`, cherche l'annonce dans `mockAnnonces` par id
- `GroupeDetailPage` : idem avec `mockGroupes`
- `AdminGroupDetailPage` : idem avec `mockGroupes`
- Fini le `pageData: any`

---

## Style de code "étudiant 3ème année"

- Commentaires sur tout, même l'évident
- `console.log` laissés dans le login et quelques pages
- Variables nommées clairement mais sans abstraction excessive
- Pas de hooks custom — tout inline dans les composants
- Parfois un peu verbeux (un `if` explicite plutôt qu'un ternaire cryptique)
- Interfaces TypeScript simples et directes

---

## Auth

Inchangée : `user` dans le state de `App.tsx`, persisté dans `localStorage` sous `lokaly_user`.

Ajout d'un `<ProtectedRoute>` simple :
```tsx
// Si l'utilisateur n'est pas connecté, on le redirige vers /login
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}
```

---

## Fichiers impactés

- `package.json` — ajout de `react-router-dom`
- `vite.config.ts` — suppression de `base: '/lokaly/'` (plus de GitHub Pages)
- `main.tsx` — wrap BrowserRouter
- `App.tsx` — réécriture complète (Routes, ProtectedRoute, layouts)
- `src/components/Header.tsx` — suppression onNavigate, ajout useNavigate + Link
- `src/components/Footer.tsx` — idem
- `src/components/AdminSidebar.tsx` — idem
- `src/pages/AdminCustomizationPage.tsx` — suppression prop `communaute`, utilise une valeur mock interne
- `src/pages/*.tsx` — toutes les 16 pages (suppression onNavigate, useParams pour les détails)
