import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { AnnonceCard } from '../components/AnnonceCard';
import { GroupeCard } from '../components/GroupeCard';
import { Plus, ArrowRight } from 'lucide-react';
import { mockAnnonces, mockGroupes, mockStats } from '../data/mockData';
import { toast } from 'sonner';

export function HomePage() {
  // useNavigate retourne une fonction navigate() pour changer de page
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Bienvenue dans votre communauté
            </h1>
            <p className="text-lg text-white opacity-90 mb-8">
              Lokaly facilite l'entraide et les échanges entre voisins.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant="white"
                icon={<Plus size={18} />}
                onClick={() => navigate('/annonces/nouvelle')}
              >
                Nouvelle annonce
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/annonces')}
                className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
              >
                Voir les annonces
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-8 pt-6 border-t border-white/20 justify-center">
              <div>
                <p className="text-2xl font-bold text-white">{mockStats.habitants}</p>
                <p className="text-white text-sm opacity-70">Habitants</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{mockStats.annonces}</p>
                <p className="text-white text-sm opacity-70">Annonces</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{mockStats.groupes}</p>
                <p className="text-white text-sm opacity-70">Groupes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Annonces récentes */}
      <section className="py-16 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[var(--color-primary)] font-medium text-sm uppercase tracking-wider">
                Découvrir
              </span>
              <h2 className="text-3xl font-bold mt-1">Annonces récentes</h2>
            </div>
            <Button
              variant="outline"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/annonces')}
              className="hidden sm:flex"
            >
              Voir toutes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockAnnonces.slice(0, 4).map((annonce) => (
              <AnnonceCard
                key={annonce.id}
                annonce={annonce}
                onClick={() => navigate('/annonces/' + annonce.id)}
                onInterested={() => toast.success('Intérêt manifesté ! Le contact sera partagé.')}
              />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button
              variant="outline"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/annonces')}
            >
              Voir toutes les annonces
            </Button>
          </div>
        </div>
      </section>

      {/* Groupes actifs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[var(--color-secondary)] font-medium text-sm uppercase tracking-wider">
                Communauté
              </span>
              <h2 className="text-3xl font-bold mt-1">Groupes actifs</h2>
            </div>
            <Button
              variant="outline"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/groupes')}
              className="hidden sm:flex"
            >
              Voir tous
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockGroupes.slice(0, 3).map((groupe) => (
              <GroupeCard
                key={groupe.id}
                groupe={groupe}
                onClick={() => navigate('/groupes/' + groupe.id)}
              />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button
              variant="outline"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/groupes')}
            >
              Voir tous les groupes
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
