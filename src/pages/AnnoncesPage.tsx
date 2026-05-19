import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select } from '../components/Select';
import { AnnonceCard } from '../components/AnnonceCard';
import { Button } from '../components/Button';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { B_Annonces } from '../Composables/BRIDGE_annonces';
import { B_users } from '../Composables/BRIDGE_users';
import { toast } from 'sonner';

const mapAnnonce = (a: any, users: any[]) => {
  const user = users.find((u) => u.user_id === a.provider);
  return {
    id: String(a.annonce_id),
    name: a.name,
    description: a.description,
    location: a.location,
    disponibilite: a.disponibilite || (a.date ? `${a.date}${a.hour ? ' ' + a.hour : ''}` : ''),
    type: a.type || a.state || '',
    auteur: { nom: user ? `${user.name} ${user.surname}` : 'Membre de la communauté' },
  };
};

export function AnnoncesPage() {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    Promise.all([B_Annonces().getAllAnnonces(), B_users().getAllUsers()])
      .then(([annoncesData, usersData]) => {
        setAnnonces(Array.isArray(annoncesData) ? annoncesData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      })
      .catch(() => setError('Impossible de charger les annonces.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredAnnonces = annonces
    .map((a) => mapAnnonce(a, users))
    .filter((annonce) => {
      const matchSearch = annonce.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        annonce.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = !typeFilter || annonce.type === typeFilter;
      return matchSearch && matchType;
    });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1>Annonces locales</h1>
            <p className="text-[var(--color-text-secondary)] mt-2">
              {filteredAnnonces.length} annonce{filteredAnnonces.length > 1 ? 's' : ''} disponible{filteredAnnonces.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={() => navigate('/annonces/nouvelle')}
          >
            Nouvelle annonce
          </Button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Rechercher une annonce..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
              />
            </div>
            <Button
              variant="outline"
              icon={<SlidersHorizontal size={20} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtres
            </Button>
          </div>
          {showFilters && (
            <div className="pt-4 border-t border-[var(--color-border)]">
              <Select
                label="Type d'annonce"
                placeholder="Tous les types"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: '', label: 'Tous les types' },
                  { value: 'Don', label: 'Don' },
                  { value: 'Prêt', label: 'Prêt' },
                  { value: 'Service', label: 'Service' },
                  { value: 'Atelier', label: 'Atelier' },
                ]}
              />
            </div>
          )}
        </div>

        {/* Liste des annonces */}
        {filteredAnnonces.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-secondary)] text-lg">
              Aucune annonce ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAnnonces.map((annonce) => (
              <AnnonceCard
                key={annonce.id}
                annonce={annonce}
                onClick={() => navigate('/annonces/' + annonce.id)}
                onInterested={() => toast.success('Intérêt manifesté ! Le contact sera partagé.')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
