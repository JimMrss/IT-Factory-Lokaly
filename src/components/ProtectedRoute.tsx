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
