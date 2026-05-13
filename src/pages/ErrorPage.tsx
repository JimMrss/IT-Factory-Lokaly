import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';

export function ErrorPage() {
  // useRouteError() donne l'erreur qui a causé l'affichage de cette page
  const error = useRouteError();
  const navigate = useNavigate();

  // On détermine le message à afficher selon le type d'erreur
  let titre = 'Erreur inattendue';
  let message = 'Quelque chose s\'est mal passé.';

  if (isRouteErrorResponse(error)) {
    // Erreur HTTP standard (404, 403, 500...)
    if (error.status === 404) {
      titre = 'Page introuvable';
      message = 'Cette page n\'existe pas ou a été déplacée.';
    } else if (error.status === 403) {
      titre = 'Accès refusé';
      message = 'Vous n\'avez pas la permission d\'accéder à cette page.';
    } else {
      titre = `Erreur ${error.status}`;
      message = error.statusText || message;
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Code erreur */}
        <p className="text-6xl font-bold text-[var(--color-primary)] mb-4">
          {isRouteErrorResponse(error) ? error.status : '500'}
        </p>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {titre}
        </h1>

        <p className="text-gray-500 mb-8">
          {message}
        </p>

        <div className="flex gap-3 justify-center">
          {/* Retour en arrière */}
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Retour
          </button>

          {/* Retour à l'accueil */}
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
          >
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}
