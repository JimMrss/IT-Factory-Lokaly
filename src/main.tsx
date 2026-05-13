// src/main.tsx
// Point d'entrée de l'application React
// On configure ici les "providers" qui entourent toute l'app

import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./router";
import "./styles/globals.css";

// createRoot monte l'application React dans la div #root du HTML
createRoot(document.getElementById("root")!).render(
  // AuthProvider rend les infos de connexion disponibles partout
  <AuthProvider>
    {/* RouterProvider active le système de routing de react-router-dom */}
    <RouterProvider router={router} />
  </AuthProvider>
);
  