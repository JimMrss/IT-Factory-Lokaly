import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { GroupeCard } from '../components/GroupeCard';
import { Plus } from 'lucide-react';
import { mockGroupes } from '../data/mockData';

export function GroupesPage() {
  // useNavigate retourne une fonction navigate() pour changer de page
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1>Groupes communautaires</h1>
            <p className="text-[var(--color-text-secondary)] mt-2">
              Rejoignez des groupes qui partagent vos centres d{'\''}intérêt
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={() => navigate('/groupes/creer')}
          >
            Créer un groupe
          </Button>
        </div>

        {/* Grille de groupes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockGroupes.map((groupe) => (
            <GroupeCard
              key={groupe.id}
              groupe={groupe}
              onClick={() => navigate('/groupes/' + groupe.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
