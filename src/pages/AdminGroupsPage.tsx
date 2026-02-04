import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Search, Users, Eye, TrendingUp, Star } from 'lucide-react';
import { mockGroupes } from '../data/mockData';

interface AdminGroupsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function AdminGroupsPage({ onNavigate }: AdminGroupsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroupes = mockGroupes.filter(groupe =>
    groupe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewGroup = (groupe: typeof mockGroupes[0]) => {
    onNavigate('admin-group-detail', groupe);
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1>Gestion des groupes</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">
          Supervisez les groupes et associations de la commune
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockGroupes.length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Groupes actifs</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockGroupes.reduce((acc, g) => acc + g.membres, 0)}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">Membres total</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star size={24} className="text-yellow-600 fill-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">Niveau {Math.max(...mockGroupes.map(g => g.niveau))}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Niveau max atteint</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Barre de recherche */}
      <Card>
        <div className="p-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Rechercher un groupe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
            />
          </div>
        </div>
      </Card>

      {/* Liste des groupes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroupes.map((groupe) => (
          <Card key={groupe.id} hover>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h4 className="flex-1 min-w-0 truncate">{groupe.nom}</h4>
                <Badge variant="level" level={groupe.niveau} />
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                {groupe.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{groupe.membres} membres</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{groupe.annonces.length} annonces</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Eye size={16} />}
                  onClick={() => handleViewGroup(groupe)}
                  fullWidth
                >
                  Voir détails
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredGroupes.length === 0 && (
        <Card>
          <div className="p-8 text-center">
            <p className="text-[var(--color-text-secondary)]">
              Aucun groupe ne correspond à votre recherche.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
