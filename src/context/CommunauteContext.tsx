// src/context/CommunauteContext.tsx
// Charge les paramètres de personnalisation de la communauté au démarrage
// et les rend disponibles partout (couleurs, logo, message d'accueil).
// Même principe que AuthContext : un provider + un hook useCommunaute().

import React, { createContext, useContext, useEffect, useState } from 'react';
import { B_admin_customization, CommunauteSettings } from '../Composables/Admin/ADMIN_customization';

interface CommunauteContextType {
  settings: CommunauteSettings | null; // null tant que rien n'est chargé (ou endpoint indisponible)
  refreshSettings: () => void;         // à appeler après une sauvegarde pour resynchroniser
}

const CommunauteContext = createContext<CommunauteContextType>({
  settings: null,
  refreshSettings: () => {},
});

export function CommunauteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<CommunauteSettings | null>(null);

  const chargerSettings = () => {
    const { getCommunauteSettings } = B_admin_customization();
    getCommunauteSettings()
      .then((data) => {
        setSettings(data);
        // la couleur principale s'applique à tout le site via la variable CSS
        if (data.couleur) {
          document.documentElement.style.setProperty('--color-primary', data.couleur);
        }
      })
      // L'endpoint /communaute/settings/ n'existe pas encore côté API :
      // on garde les valeurs par défaut du site (settings reste null).
      .catch(() => {});
  };

  useEffect(() => {
    chargerSettings();
  }, []);

  return (
    <CommunauteContext.Provider value={{ settings, refreshSettings: chargerSettings }}>
      {children}
    </CommunauteContext.Provider>
  );
}

// Hook pour lire les settings depuis n'importe quel composant
export function useCommunaute() {
  return useContext(CommunauteContext);
}
