// src/layouts/PublicLayout.tsx
// Ce composant est le "cadre" des pages publiques
// Il affiche le Header en haut, le contenu de la page au milieu, le Footer en bas
// <Outlet /> est un composant de react-router-dom qui dit "affiche la page ici"

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function PublicLayout() {
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
    </div>
  );
}
