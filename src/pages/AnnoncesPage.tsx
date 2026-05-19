import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select } from '../components/Select';
import { AnnonceCard } from '../components/AnnonceCard';
import { Button } from '../components/Button';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { B_Annonces } from '../Composables/BRIDGE_annonces';
import { B_users } from '../Composables/BRIDGE_users';
import { toast } from 'sonner';

export function AnnoncesPage() {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // charge les annonces puis les users séparément
    B_Annonces().getAllAnnonces()
      .then(data => {
        setAnnonces(data);
        console.log('annonces ok', data);
      })
      .catch(err => {
        console.log('erreur annonces', err);
        setError('Erreur lors du chargement des annonces');
      });

    B_users().getAllUsers()
      .then(data => {
        setUsers(data);
      })
      .catch(err => {
        console.log('erreur users', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // construit la liste filtrée
  const getAnnoncesFiltrées = () => {
    const resultat = [];
    for (let i = 0; i < annonces.length; i++) {
      const a = annonces[i];
      const matchSearch = a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === '' || a.type === typeFilter;

      if (matchSearch && matchType) {
        // cherche l'auteur
        let nomAuteur = 'Membre de la communauté';
        for (let j = 0; j < users.length; j++) {
          if (users[j].user_id === a.provider) {
            nomAuteur = users[j].name + ' ' + users[j].surname;
            break;
          }
        }
        resultat.push({
          id: String(a.annonce_id),
          name: a.name,
          description: a.description,
          location: a.location,
          disponibilite: a.disponibilite || a.date || '',
          type: a.type || '',
          auteur: { nom: nomAuteur },
        });
      }
    }
    return resultat;
  };

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

  const annoncesFiltrées = getAnnoncesFiltrées();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1>Annonces locales</h1>
            <p className="text-[var(--color-text-secondary)] mt-2">
              {annoncesFiltrées.length} annonce{annoncesFiltrées.length > 1 ? 's' : ''} disponible{annoncesFiltrées.length > 1 ? 's' : ''}
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

        {/* recherche + filtres */}
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

        {annoncesFiltrées.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-secondary)] text-lg">Aucune annonce trouvée.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {annoncesFiltrées.map((annonce) => (
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
