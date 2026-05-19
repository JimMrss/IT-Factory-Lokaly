import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { GroupeCard } from '../components/GroupeCard';
import { Plus } from 'lucide-react';
import { B_groupes } from '../Composables/BRIDGE_groupe';

const mapGroupe = (g: any) => ({
  id: String(g.group_id),
  name: g.name,
  description: g.description,
  categorie: g.category || '',
  niveau: parseInt(g.niveau) || 1,
  members: Array.isArray(g.members) ? g.members.length : 0,
});

export function GroupesPage() {
  const navigate = useNavigate();
  const [groupes, setGroupes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    B_groupes().getAllGroups()
      .then((data) => setGroupes(Array.isArray(data) ? data : []))
      .catch(() => setError('Impossible de charger les groupes.'))
      .finally(() => setLoading(false));
  }, []);

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

        {groupes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-secondary)] text-lg">Aucun groupe pour l'instant.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupes.map(mapGroupe).map((groupe) => (
              <GroupeCard
                key={groupe.id}
                groupe={groupe}
                onClick={() => navigate('/groupes/' + groupe.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
