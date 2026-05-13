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
