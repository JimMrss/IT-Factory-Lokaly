// src/layouts/AdminLayout.tsx
// Ce composant est le "cadre" des pages admin
// Il affiche la sidebar à gauche et le contenu de la page à droite

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AdminSidebar } from '../components/AdminSidebar';

export function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Notifications toast */}
      <Toaster position="top-right" richColors />

      {/* Sidebar admin à gauche */}
      <AdminSidebar />

      {/* Contenu de la page admin à droite */}
      <main className="flex-1 lg:ml-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* react-router affiche ici la bonne page admin */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
