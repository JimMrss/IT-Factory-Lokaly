# Lokaly — Spécifications Backend

> Document à destination de l'équipe Back-End.
> Toutes les données sont actuellement mockées côté front. Aucun appel API n'existe encore.

---

## 1. Entités & Modèles de données

### 1.1 Annonce

```typescript
interface Annonce {
  id: string
  titre: string
  description: string
  type: "Don" | "Prêt" | "Service" | "Atelier"
  zone: string              // ex: "Centre-ville", "Quartier Nord"
  disponibilite: string     // ex: "Week-ends", "À convenir"
  image?: string            // URL
  auteur: {
    id: string
    nom: string
    avatar?: string
  }
  createdAt: string         // ISO date
}
```

### 1.2 Groupe

```typescript
interface Groupe {
  id: string
  nom: string
  description: string
  categorie: "Jardinage" | "Culture" | "Sport" | "Bricolage"
  niveau: 1 | 2 | 3 | 4 | 5  // calculé selon activité
  membres: number
  annonces: string[]           // IDs des annonces liées
  image?: string
}
```

Règle de niveau (gamification) :
| Niveau | Membres |
|--------|---------|
| 1 | 0–5 |
| 2 | 6–15 |
| 3 | 16–30 |
| 4 | 31–50 |
| 5 | 50+ |

### 1.3 Membre de groupe

```typescript
interface GroupeMembre {
  id: string
  nom: string
  role: "admin" | "membre"
  dateAdhesion: string  // ISO date
}
```

### 1.4 Utilisateur

```typescript
interface Utilisateur {
  id: string
  prenom: string
  nom: string
  identifiant: string          // username, créé par l'admin (pas d'email requis)
  email?: string
  communaute: string           // ID ou nom de la communauté
  statut: "actif" | "desactive"  // Jamais supprimé, seulement désactivé
  dateCreation: string
}
```

### 1.5 Profil utilisateur

```typescript
interface UserProfile {
  userId: string
  bio: string
  centresInteret: string[]     // ex: ["Jardinage", "Couture"]
  competences: string[]        // ex: ["Informatique de base"]
  objetsDisponibles: string[]  // ex: ["Tondeuse", "Perceuse"]
  contactExterne?: string      // URL Line/WhatsApp
}
```

### 1.6 Habitant en attente de validation

```typescript
interface HabitantEnAttente {
  id: string
  prenom: string
  nom: string
  email: string
  communaute: string
  date: string                              // date de demande
  statut: "en_attente" | "valide" | "refuse"
}
```

### 1.7 Communauté

```typescript
interface Communaute {
  id: string
  nom: string
  habitants: number
  annonces: number
  groupes: number
  customization: {
    logoUrl?: string
    messageAccueil: string
    couleurPrimaire: string    // Hex, ex: "#1e40af"
    couleurSecondaire: string
    tagsZone: string[]         // ex: ["Centre-ville", "Quartier Nord"]
  }
}
```

### 1.8 Statistiques

```typescript
interface Stats {
  annonces: number
  habitants: number
  groupes: number
  participation: number  // % d'utilisateurs actifs
}

interface ActiviteMensuelle {
  mois: string           // "Janvier", "Février", etc.
  annonces: number
  participation: number  // %
}
```

---

## 2. Authentification

- Connexion par **identifiant + mot de passe** (l'identifiant est créé par l'admin, pas l'email)
- Rôles : `habitant` | `admin`
- Session stockée côté client (JWT recommandé)
- Les habitants peuvent aussi s'inscrire eux-mêmes → validation admin requise avant activation

---

## 3. Endpoints API attendus

### Auth
```
POST /api/auth/login          body: { identifiant, motDePasse }
POST /api/auth/register       body: { prenom, nom, email, communauteId }
```

### Annonces
```
GET    /api/annonces              query: { type?, zone?, search? }
GET    /api/annonces/:id
POST   /api/annonces              body: Annonce (sans id, auteur)
PUT    /api/annonces/:id
DELETE /api/annonces/:id
```

### Groupes
```
GET    /api/groupes               query: { categorie? }
GET    /api/groupes/:id
POST   /api/groupes               body: { nom, categorie, description }
PUT    /api/groupes/:id
DELETE /api/groupes/:id

GET    /api/groupes/:id/membres
POST   /api/groupes/:id/rejoindre
DELETE /api/groupes/:id/quitter
```

### Utilisateurs (admin)
```
GET    /api/utilisateurs          query: { statut? }
POST   /api/utilisateurs          body: { prenom, nom, identifiant, communauteId }
PUT    /api/utilisateurs/:id/statut   body: { statut: "actif" | "desactive" }
```

### Validation habitants
```
GET    /api/validation            query: { statut?: "en_attente" | "valide" | "refuse" }
PUT    /api/validation/:id        body: { statut: "valide" | "refuse" }
```

### Profil
```
GET    /api/profil
PUT    /api/profil                body: UserProfile
```

### Communauté (admin)
```
GET    /api/communaute
PUT    /api/communaute/customization   body: CommunauteCustomization
```

### Statistiques
```
GET    /api/stats
GET    /api/stats/activite        query: { mois? }
```

---

## 4. Données de référence (listes fixes)

Ces valeurs sont actuellement hardcodées côté front. Le backend peut les exposer ou laisser le front les gérer :

**Types d'annonces :** Don, Prêt, Service, Atelier

**Catégories de groupes :** Jardinage, Culture, Sport, Bricolage

**Zones géographiques :** gérées dynamiquement via `communaute.customization.tagsZone`

---

## 5. Règles métier importantes

- Un utilisateur **ne peut pas être supprimé**, seulement désactivé (`statut: "desactive"`)
- Un habitant qui s'inscrit seul passe par une **validation admin** avant de pouvoir se connecter
- Le **niveau d'un groupe** est calculé automatiquement selon le nombre de membres
- Les **zones géographiques** sont configurables par l'admin de chaque communauté
- Un utilisateur est toujours rattaché à **une seule communauté**

---

## 6. Upload de fichiers

| Contexte | Format | Taille max |
|----------|--------|------------|
| Image annonce | JPG, PNG | 5 Mo |
| Logo communauté | PNG, JPG | — (200×200px recommandé) |
| Avatar utilisateur | — | Non implémenté côté front pour l'instant |
