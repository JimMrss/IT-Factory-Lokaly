// src/components/AdminRoute.tsx
// Ce composant protège les pages réservées aux administrateurs.
// À utiliser à l'intérieur d'un ProtectedRoute (qui gère déjà le login).
// Si l'utilisateur n'est pas admin (permissions !== 1) → on le redirige vers l'accueil.

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useAuth();

  // Pendant la vérification du localStorage, on attend
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-xl mb-4 animate-pulse">
            <span className="text-3xl font-bold bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">L</span>
          </div>
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas admin → retour à l'accueil
  // (permissions : 0 = utilisateur, 1 = admin ; tolérant si l'API renvoie une chaîne)
  if (!user || Number(user.permissions) !== 1) {
    return <Navigate to="/" replace />;
  }

  // Utilisateur admin → on affiche le contenu
  return <>{children}</>;
}
