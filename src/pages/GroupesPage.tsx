import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { GroupeCard } from '../components/GroupeCard';
import { Plus } from 'lucide-react';
import { B_groupes } from '../Composables/BRIDGE_groupe';

export function GroupesPage() {
  const navigate = useNavigate();
  const [groupes, setGroupes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    chargerGroupes();
  }, []);

  const chargerGroupes = async () => {
    let res = null;
    try {
      res = await B_groupes().getAllGroups();
      console.log('groupes récupérés:', res);
    } catch (e) {
      console.log('erreur chargement groupes:', e);
      setErreur('Impossible de charger les groupes');
      setLoading(false);
      return;
    }

    if (!res) {
      setLoading(false);
      return;
    }

    setGroupes(res);
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Chargement...</p>
    </div>
  );

  if (erreur) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{erreur}</p>
    </div>
  );

  // on formate les données pour GroupeCard
  const groupesAffiches = [];
  for (let i = 0; i < groupes.length; i++) {
    const g = groupes[i];
    let nbMembres = 0;
    if (g.members) {
      nbMembres = g.members.length;
    }
    groupesAffiches.push({
      id: String(g.group_id),
      name: g.name,
      description: g.description,
      categorie: g.category || '',
      niveau: parseInt(g.niveau) || 1,
      members: nbMembres,
    });
  }

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

        {groupesAffiches.length === 0 ? (
          <p className="text-center text-[var(--color-text-secondary)] py-16">Aucun groupe pour l'instant.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupesAffiches.map((g) => (
              <GroupeCard
                key={g.id}
                groupe={g}
                onClick={() => navigate('/groupes/' + g.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
