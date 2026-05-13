// src/components/Footer.tsx
// Pied de page — utilise useNavigate au lieu du prop onNavigate

import React from 'react';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();
  // useNavigate pour naviguer vers les pages
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-950 text-gray-300 mt-auto border-t-4 border-[var(--color-primary)]">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* À propos */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl">Lokaly</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              La plateforme qui connecte les habitants de votre quartier.
              Partagez, échangez et créez des liens avec vos voisins.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[var(--color-primary)] rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[var(--color-primary)] rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[var(--color-primary)] rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-lg mb-4 text-gray-300">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', path: '/' },
                { label: 'Annonces', path: '/annonces' },
                { label: 'Groupes', path: '/groupes' },
                { label: 'Mon Profil', path: '/profil' },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm inline-block"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-lg mb-4 text-gray-300">Informations</h4>
            <ul className="space-y-3">
              {[
                'À propos de nous',
                'Comment ça marche',
                'FAQ',
                'Blog',
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-lg mb-4 text-gray-300">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm justify-center md:justify-start">
                <MapPin size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                <span>Paris, France</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm justify-center md:justify-start">
                <Mail size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                <a href="mailto:contact@lokaly.fr" className="hover:text-white transition-colors">
                  contact@lokaly.fr
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm justify-center md:justify-start">
                <Phone size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                <a href="tel:+33123456789" className="hover:text-white transition-colors">
                  01 23 45 67 89
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barre inférieure */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span>Fait avec</span>
              <Heart size={14} className="text-red-500 fill-red-500" />
              <span>pour les communautés locales</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Confidentialité
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                CGU
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © {currentYear} Lokaly. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
