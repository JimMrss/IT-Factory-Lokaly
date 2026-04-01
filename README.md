# Lokaly

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

---

## Ce que le frontend attend du backend

> Ce document compare ce que vous avez livré (DOC BackEnd Lokaly.pdf) avec ce dont le frontend a besoin pour fonctionner.
> Pour chaque point, vous trouverez : **ce qui existe**, **ce qui manque**, et des **exemples concrets** de requêtes/réponses attendues.

---

## Table des matières

1. [Ce qui existe et fonctionne](#1-ce-qui-existe-et-fonctionne)
2. [Endpoints manquants](#2-endpoints-manquants)
3. [Champs manquants sur vos modèles](#3-champs-manquants-sur-vos-modèles)
4. [Mapping des noms backend ↔ frontend](#4-mapping-des-noms-backend--frontend)
5. [Questions à trancher ensemble](#5-questions-à-trancher-ensemble)
6. [Résumé des priorités](#6-résumé-des-priorités)

---

## 1. Ce qui existe et fonctionne

Voici ce que vous avez livré et qui correspond à nos besoins :

| Bridge | Fonction | Verdict |
|--------|----------|---------|
| BRIDGE_users | `getUser(id)` | OK |
| BRIDGE_users | `createUser(payload)` | OK (mais champs manquants, voir section 3) |
| BRIDGE_users | `updateUser(id, payload)` | OK |
| BRIDGE_users | `deleteUser(id)` | A noter : côté front on ne supprime jamais, on désactive (`statut: "desactive"`) |
| BRIDGE_Groupe | `getGroup(id)` | OK (mais champs manquants) |
| BRIDGE_Groupe | `createGroup(payload)` | OK |
| BRIDGE_Groupe | `updateGroup(id, payload)` | OK |
| BRIDGE_Groupe | `deleteGroup(id)` | OK |
| BRIDGE_Groupe | `addMemberToGroup(groupId, userId)` | OK |
| BRIDGE_Groupe | `removeMemberFromGroup(groupId, userId)` | OK |
| BRIDGE_Annonces | `getAnnonces(id)` | OK (mais champs manquants) |
| BRIDGE_Annonces | `createAnnonce(payload)` | OK |
| BRIDGE_Annonces | `updateAnnonce(id, payload)` | OK |
| BRIDGE_Annonces | `deleteAnnonce(id)` | OK |

**En résumé :** Le CRUD unitaire (par ID) fonctionne. Ce qui manque, c'est tout le reste : auth, listes, stats, et des champs importants.

---

## 2. Endpoints manquants

### 2.1 Authentification

**Aucun endpoint d'auth n'existe.** Le frontend a une page de connexion et d'inscription qui sont actuellement simulées.

#### `POST /api/auth/login` — Connexion

Le frontend envoie :
```json
{
  "identifiant": "marie.dubois",
  "motDePasse": "monMotDePasse123"
}
```

Le frontend attend en retour :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "name": "Marie",
    "surname": "Dubois",
    "identifier": "marie.dubois",
    "role": "habitant",
    "communaute": "Commune de Tori"
  }
}
```

> **Pourquoi on a besoin du `role` :** le frontend affiche un bouton "Admin" uniquement pour les admins. Sans ça, n'importe qui peut accéder au panel admin.

#### `POST /api/auth/register` — Inscription

Le frontend envoie :
```json
{
  "name": "Camille",
  "surname": "Fontaine",
  "email": "camille.fontaine@email.com",
  "motDePasse": "monMotDePasse123",
  "communauteId": "1"
}
```

Le frontend attend en retour :
```json
{
  "success": true,
  "message": "Inscription enregistrée. Un administrateur doit valider votre compte."
}
```

> **Règle métier :** L'inscription ne crée PAS un compte actif. L'habitant est mis en attente de validation par un admin (voir section 2.5).

---

### 2.2 Lister les ressources (getAll)

**C'est le manque le plus bloquant.** Vos bridges permettent de récupérer UNE ressource par ID, mais le frontend a besoin de récupérer TOUTES les ressources pour afficher des listes.

#### `GET /api/annonces` — Liste de toutes les annonces

**Pages qui utilisent ce endpoint :** HomePage (les 4 dernières), AnnoncesPage (toutes avec filtres), GroupeDetailPage (annonces d'un groupe)

Le frontend appelle :
```
GET /api/annonces
GET /api/annonces?type=Don
GET /api/annonces?zone=Centre-ville
GET /api/annonces?search=tondeuse
GET /api/annonces?type=Service&zone=Quartier+Nord
```

Le frontend attend en retour :
```json
[
  {
    "id": 1,
    "name": "Prêt de tondeuse à gazon",
    "description": "Tondeuse électrique en bon état...",
    "type": "Prêt",
    "zone": "Centre-ville",
    "disponibilite": "Week-ends",
    "image": "https://example.com/photo.jpg",
    "location": "Centre-ville",
    "date": "2025-01-15",
    "hour": "14:00",
    "provider": 4,
    "auteur": {
      "id": 4,
      "nom": "Marie Dubois",
      "avatar": ""
    },
    "state": "active",
    "interested_users": [1, 2]
  },
  {
    "id": 2,
    "name": "Cours de couture gratuits",
    "..."
  }
]
```

> **Point important sur `auteur` :** Le frontend affiche le nom et l'avatar de l'auteur directement sur chaque carte d'annonce. Si vous ne retournez que `provider: 4` (un ID), le frontend devra faire 1 appel `getUser()` par annonce pour récupérer le nom. C'est très inefficace. Merci d'inclure un objet `auteur` dans la réponse, ou au minimum les champs `provider_name` et `provider_avatar`.

#### `GET /api/groupes` — Liste de tous les groupes

**Pages qui utilisent ce endpoint :** HomePage (les 3 premiers), GroupesPage (tous), AdminGroupsPage (tous avec stats)

Le frontend appelle :
```
GET /api/groupes
GET /api/groupes?categorie=Jardinage
```

Le frontend attend en retour :
```json
[
  {
    "id": 1,
    "name": "Jardiniers du quartier",
    "description": "Échange de graines, conseils...",
    "categorie": "Jardinage",
    "niveau": 3,
    "members": [1, 2, 4, 7, 8, 12, 15, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    "annonces": [1, 4]
  },
  {
    "id": 2,
    "name": "Couture & DIY",
    "..."
  }
]
```

> **A noter :** Le frontend calcule le nombre de membres avec `members.length`. Si vous préférez envoyer un `membresCount: 28` à la place du tableau complet dans la liste, c'est OK aussi (le tableau complet serait uniquement dans `getGroup(id)`).

#### `GET /api/users` — Liste de tous les utilisateurs (admin)

**Page qui utilise ce endpoint :** AdminUsersPage

Le frontend appelle :
```
GET /api/users
GET /api/users?statut=actif
GET /api/users?communaute=Commune+de+Tori
```

Le frontend attend en retour :
```json
[
  {
    "id": 1,
    "name": "Julie",
    "surname": "Petit",
    "identifier": "julie.petit",
    "email": "julie.petit@email.com",
    "communaute": "Commune de Tori",
    "dateCreation": "2024-12-08",
    "statut": "actif",
    "role": "habitant"
  },
  {
    "id": 2,
    "name": "Marc",
    "surname": "Durand",
    "..."
  }
]
```

---

### 2.3 Statistiques

**Pages qui utilisent ce endpoint :** HomePage, AdminDashboardPage, AdminStatsPage

#### `GET /api/stats` — Stats globales

Le frontend attend :
```json
{
  "annonces": 47,
  "habitants": 156,
  "groupes": 12,
  "participation": 68
}
```

> `participation` = pourcentage d'utilisateurs actifs (qui ont posté ou rejoint un groupe dans les 30 derniers jours par exemple).

#### `GET /api/stats/activite` — Historique mensuel

Le frontend attend :
```json
[
  { "mois": "Juin", "annonces": 12, "participation": 45 },
  { "mois": "Juillet", "annonces": 18, "participation": 52 },
  { "mois": "Août", "annonces": 15, "participation": 48 },
  { "mois": "Sept", "annonces": 22, "participation": 61 },
  { "mois": "Oct", "annonces": 28, "participation": 65 },
  { "mois": "Nov", "annonces": 35, "participation": 72 },
  { "mois": "Déc", "annonces": 47, "participation": 68 }
]
```

> Ces données alimentent les graphiques (LineChart et BarChart) du dashboard admin.

---

### 2.4 Profil utilisateur

**Page qui utilise ce endpoint :** ProfilPage

Le profil est différent du User : c'est les infos que l'utilisateur remplit lui-même (bio, compétences, etc.).

#### `GET /api/profil` — Récupérer son profil (utilisateur connecté)

Le frontend attend :
```json
{
  "nom": "Marie Dubois",
  "identifiant": "marie.dubois",
  "bio": "Passionnée de jardinage et d'entraide locale.",
  "centresInteret": ["Jardinage", "Couture", "Cuisine", "Bricolage"],
  "competences": ["Jardinage", "Couture", "Informatique de base"],
  "objetsDisponibles": ["Tondeuse", "Perceuse", "Livres de jardinage"],
  "contactExterne": "https://line.me/ti/p/marie-dubois"
}
```

#### `PUT /api/profil` — Modifier son profil

Le frontend envoie (seuls les champs modifiés) :
```json
{
  "bio": "Nouvelle bio mise à jour",
  "objetsDisponibles": ["Tondeuse", "Perceuse", "Machine à coudre"]
}
```

Le frontend attend la même réponse que le GET avec les données mises à jour.

> **Lien avec UserPayload :** Vous pourriez intégrer ces champs directement dans `updateUser()` en ajoutant `bio`, `centresInteret`, `competences`, `objetsDisponibles`, `contactExterne` aux `authorizedFields`. Comme vous préférez.

---

### 2.5 Validation des habitants (admin)

**Page qui utilise ce endpoint :** AdminValidationPage

Quand un habitant s'inscrit via `/api/auth/register`, il arrive ici en attente de validation.

#### `GET /api/validation` — Liste des inscriptions

Le frontend appelle :
```
GET /api/validation
GET /api/validation?statut=en_attente
```

Le frontend attend :
```json
[
  {
    "id": 1,
    "name": "Camille",
    "surname": "Fontaine",
    "email": "camille.fontaine@email.com",
    "communaute": "Commune de Tori",
    "date": "2025-01-15",
    "statut": "en_attente"
  },
  {
    "id": 2,
    "name": "Thomas",
    "surname": "Garnier",
    "email": "thomas.garnier@email.com",
    "communaute": "Quartier des Fleurs",
    "date": "2025-01-18",
    "statut": "en_attente"
  }
]
```

#### `PUT /api/validation/:id` — Valider ou refuser

Le frontend envoie :
```json
{
  "statut": "valide"
}
```
ou
```json
{
  "statut": "refuse"
}
```

> Quand `statut` passe à `"valide"`, l'habitant doit pouvoir se connecter. Quand `"refuse"`, la demande est archivée.

---

### 2.6 Communauté / Personnalisation (admin)

**Page qui utilise ce endpoint :** AdminCustomizationPage

#### `GET /api/communaute` — Infos de la communauté

Le frontend attend :
```json
{
  "id": 1,
  "nom": "Commune de Tori",
  "habitants": 156,
  "annonces": 47,
  "groupes": 12,
  "customization": {
    "logoUrl": "https://example.com/logo.png",
    "messageAccueil": "Bienvenue dans notre communauté !",
    "couleurPrimaire": "#1e40af",
    "couleurSecondaire": "#7c3aed",
    "tagsZone": ["Centre-ville", "Quartier Nord", "Quartier Sud", "Toute la commune"]
  }
}
```

#### `PUT /api/communaute/customization` — Modifier la personnalisation

Le frontend envoie :
```json
{
  "messageAccueil": "Bienvenue à tous les voisins !",
  "couleurPrimaire": "#059669",
  "couleurSecondaire": "#0891b2",
  "tagsZone": ["Centre-ville", "Quartier Nord", "Quartier Sud", "Zone Industrielle"]
}
```

> Les `tagsZone` servent de filtre dans la page des annonces. L'admin peut les personnaliser.

---

## 3. Champs manquants sur vos modèles

### 3.1 UserPayload

Votre modèle actuel :
```typescript
interface UserPayload {
  identifier?: string;   // OK
  name?: string;         // OK
  surname?: string;      // OK
  description?: string;  // OK
  groups?: string[];     // OK
  activities?: string[]; // OK
}
```

**Champs à ajouter :**

| Champ | Type | Obligatoire ? | A quoi ça sert dans le frontend |
|-------|------|---------------|--------------------------------|
| `email` | `string` | Oui à l'inscription | Affiché dans le profil et la liste admin |
| `communaute` | `string` | Oui | Chaque utilisateur appartient à UNE communauté |
| `statut` | `"actif"` ou `"desactive"` | Oui | L'admin peut désactiver un compte (jamais supprimer) |
| `role` | `"habitant"` ou `"admin"` | Oui | Le frontend cache le bouton Admin si `role !== "admin"` |
| `dateCreation` | `string` (ISO) | Oui | Affiché dans la liste admin des utilisateurs |
| `avatar` | `string` (URL) | Non | Photo de profil, affiché à côté du nom |

**Modèle complet attendu par le frontend :**
```typescript
interface UserPayload {
  identifier?: string;
  name?: string;
  surname?: string;
  description?: string;
  email?: string;
  communaute?: string;
  statut?: "actif" | "desactive";
  role?: "habitant" | "admin";
  dateCreation?: string;
  avatar?: string;
  groups?: string[];
  activities?: string[];
}
```

---

### 3.2 GroupPayload

Votre modèle actuel :
```typescript
interface GroupPayload {
  name?: string;         // OK
  description?: string;  // OK
  members?: number[];    // OK
  annonces?: number[];   // OK
}
```

**Champs à ajouter :**

| Champ | Type | Obligatoire ? | A quoi ça sert dans le frontend |
|-------|------|---------------|--------------------------------|
| `categorie` | `"Jardinage"`, `"Culture"`, `"Sport"`, `"Bricolage"` | Oui | Affiché sur chaque carte de groupe + utilisé pour filtrer |
| `niveau` | `1`, `2`, `3`, `4`, `5` | Non (calculé) | Affiché en étoiles sur chaque groupe (gamification) |
| `image` | `string` (URL) | Non | Image de couverture du groupe |

**Règle de calcul automatique du `niveau` :**
```
0-5 membres   → niveau 1
6-15 membres  → niveau 2
16-30 membres → niveau 3
31-50 membres → niveau 4
50+ membres   → niveau 5
```

> Le backend peut calculer ça automatiquement à partir de `members.length`. Le frontend ne fait que l'afficher.

**Modèle complet attendu par le frontend :**
```typescript
interface GroupPayload {
  name?: string;
  description?: string;
  categorie?: "Jardinage" | "Culture" | "Sport" | "Bricolage";
  niveau?: number;
  image?: string;
  members?: number[];
  annonces?: number[];
}
```

---

### 3.3 AnnoncePayload

Votre modèle actuel :
```typescript
interface AnnoncePayload {
  name?: string;              // OK (on utilise "titre" côté front, voir section 4)
  interested_users?: number[];// OK (pas encore utilisé côté front)
  date?: string;              // OK
  hour?: string;              // OK
  description?: string;       // OK
  location?: string;          // OK
  provider?: number;          // Problème : on a besoin du nom, pas juste l'ID (voir ci-dessous)
  state?: string;             // OK
}
```

**Champs à ajouter :**

| Champ | Type | Obligatoire ? | A quoi ça sert dans le frontend |
|-------|------|---------------|--------------------------------|
| `type` | `"Don"`, `"Prêt"`, `"Service"`, `"Atelier"` | Oui | Affiché en badge sur chaque annonce + filtre de recherche |
| `zone` | `string` | Oui | Zone géographique pour le filtrage (ex: "Centre-ville") |
| `disponibilite` | `string` | Non | Texte libre affiché (ex: "Week-ends", "À convenir") |
| `image` | `string` (URL) | Non | Photo de l'annonce, affichée en grand sur la carte |

**Problème avec `provider` :**

Actuellement, `provider` retourne juste un `number` (l'ID de l'auteur). Mais le frontend affiche ceci sur chaque carte d'annonce :

```
┌─────────────────────────────┐
│  [photo]                    │
│  Prêt de tondeuse à gazon   │
│  Centre-ville · Week-ends    │
│                              │
│  👤 Marie Dubois             │  ← On a besoin du NOM ici
└─────────────────────────────┘
```

Avec juste `provider: 4`, il faudrait faire un appel `getUser(4)` pour CHAQUE annonce de la liste. Pour 50 annonces = 50 appels supplémentaires.

**Solution proposée :** Inclure les infos de l'auteur dans la réponse :
```json
{
  "provider": 4,
  "auteur": {
    "id": 4,
    "nom": "Marie Dubois",
    "avatar": ""
  }
}
```

Ou alternativement, ajouter `provider_name` et `provider_avatar` directement.

**Modèle complet attendu par le frontend :**
```typescript
interface AnnoncePayload {
  name?: string;
  description?: string;
  type?: "Don" | "Prêt" | "Service" | "Atelier";
  zone?: string;
  disponibilite?: string;
  image?: string;
  date?: string;
  hour?: string;
  location?: string;
  provider?: number;
  auteur?: { id: number; nom: string; avatar?: string };
  state?: string;
  interested_users?: number[];
}
```

---

## 4. Mapping des noms backend ↔ frontend

Le backend et le frontend utilisent des noms différents pour les mêmes choses. Il faut qu'on se mette d'accord sur les noms finaux. Voici la correspondance actuelle :

### Annonces
| Backend (votre nom) | Frontend (notre nom) | Même chose ? |
|---------------------|---------------------|--------------|
| `name` | `titre` | Oui — on peut s'adapter à `name` |
| `location` | `zone` | Probablement oui — à confirmer |
| `provider` (number) | `auteur` (objet) | Non — on a besoin du nom, pas juste l'ID |
| `state` | — | Pas utilisé côté front pour l'instant |
| `interested_users` | — | Pas utilisé côté front pour l'instant |

### Utilisateurs
| Backend (votre nom) | Frontend (notre nom) | Même chose ? |
|---------------------|---------------------|--------------|
| `name` | `prenom` | Oui |
| `surname` | `nom` | Oui |
| `identifier` | `identifiant` | Oui |

### Groupes
| Backend (votre nom) | Frontend (notre nom) | Même chose ? |
|---------------------|---------------------|--------------|
| `name` | `nom` | Oui |
| `members` (number[]) | `membres` (nombre ou liste) | Le front affiche le **count**, vous envoyez le **tableau** → OK |

> **Proposition :** Le frontend s'adaptera aux noms du backend. Pas besoin de renommer vos champs existants. Par contre il faut bien **ajouter** les champs manquants listés en section 3.

---

## 5. Questions à trancher ensemble

### Q1 : Format des IDs
Le frontend utilise des `string` partout (`id: "1"`), votre backend utilise `number` ou `int | string`.
**On a besoin de savoir :** Les IDs seront-ils toujours des `number` ? On s'adaptera côté front.

### Q2 : URL de base de l'API
Quelle URL utiliser pour appeler vos bridges ?
- En local : `http://localhost:????/api` — quel port ?
- En prod : quelle URL ?

### Q3 : Authentification des requêtes
Comment le frontend doit-il prouver qu'il est connecté à chaque requête ?
- **Option A :** Header `Authorization: Bearer <token_jwt>` (recommandé)
- **Option B :** Cookie de session
- **Option C :** Autre ?

### Q4 : `removeMemberFromGroup()` — POST ou DELETE ?
Votre doc dit "POST (à voir si on ne fait pas plus un DELETE)". On s'adaptera, mais il faut qu'on sache.

### Q5 : Pagination
Quand on fait `GET /api/annonces` et qu'il y a 500 annonces, est-ce qu'on reçoit tout d'un coup ou est-ce paginé ?
Si paginé, quel format ?
```
GET /api/annonces?page=1&limit=20

Réponse:
{
  "data": [...],
  "total": 500,
  "page": 1,
  "totalPages": 25
}
```

### Q6 : Gestion des erreurs
Quel format pour les erreurs ? On propose :
```json
{
  "error": true,
  "message": "Utilisateur non trouvé",
  "code": 404
}
```

---

## 6. Résumé des priorités

### Priorité 1 — BLOQUANT (le site ne fonctionne pas sans)

| Quoi | Détail |
|------|--------|
| Auth login/register | Section 2.1 |
| `GET /api/annonces` (liste) | Section 2.2 |
| `GET /api/groupes` (liste) | Section 2.2 |
| `GET /api/users` (liste) | Section 2.2 |
| Champ `type` sur AnnoncePayload | Section 3.3 |
| Champ `categorie` sur GroupPayload | Section 3.2 |
| Objet `auteur` dans les annonces | Section 3.3 |
| Répondre aux questions Q1-Q3 | Section 5 |

### Priorité 2 — IMPORTANT (pages admin incomplètes)

| Quoi | Détail |
|------|--------|
| `GET /api/stats` | Section 2.3 |
| `GET /api/stats/activite` | Section 2.3 |
| Validation habitants (GET + PUT) | Section 2.5 |
| Champs User : email, communaute, statut, role, dateCreation | Section 3.1 |
| Profil utilisateur (GET + PUT) | Section 2.4 |

### Priorité 3 — SECONDAIRE (améliorations)

| Quoi | Détail |
|------|--------|
| Communautés (GET + PUT customization) | Section 2.6 |
| Champ `image` (annonces, groupes) | Section 3.2, 3.3 |
| Champ `avatar` (users) | Section 3.1 |
| Champ `niveau` (groupes) — calculé auto | Section 3.2 |
| Upload de fichiers | — |
| Pagination | Section 5, Q5 |
