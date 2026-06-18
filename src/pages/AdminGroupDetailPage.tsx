import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ArrowLeft, Users, Calendar, Heart, UserMinus } from 'lucide-react';
import { B_groupes } from '../Composables/BRIDGE_groupe';
import { B_users } from '../Composables/BRIDGE_users';
import { B_Annonces } from '../Composables/BRIDGE_annonces';
import { toast } from 'sonner';
import type { Group } from '../Composables/BRIDGE_groupe';

// Format réel de l'API : l'utilisateur a un champ `nom` (et `user_id`).
interface GroupMember {
  user_id: number;
  nom?: string;
  identifier?: string;
}
interface GroupInterested extends GroupMember {
  annonce_id: number;
  annonce_name: string;
}

const getNom = (u: { nom?: string }) => u.nom ?? '—';
const getInitials = (u: { nom?: string }) => {
  const parts = (u.nom ?? '').split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase();
};

export function AdminGroupDetailPage() {
  const [groupe, setGroupe] = useState<Group | null>(null);
  const [membres, setMembres] = useState<GroupMember[]>([]);
  const [interesses, setInteresses] = useState<GroupInterested[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'membres' | 'interesses'>('membres');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const { getGroup } = B_groupes();
    const { getAllUsers } = B_users();
    const { getAllAnnonces } = B_Annonces();
    Promise.all([getGroup(id), getAllUsers(), getAllAnnonces()])
      .then(([g, users, annonces]) => {
        setGroupe(g);
        const usersArr: any[] = Array.isArray(users) ? users : [];
        const userById = new Map<number, any>(usersArr.map((u) => [u.user_id, u]));

        // Membres : IDs présents dans groupe.members, résolus via /users/
        const memberIds: number[] = Array.isArray(g.members) ? g.members : [];
        setMembres(
          memberIds.map((uid) => userById.get(uid)).filter(Boolean) as GroupMember[]
        );

        // Intéressés : utilisateurs des interested_users des annonces du groupe
        const annoncesArr: any[] = Array.isArray(annonces) ? annonces : [];
        const groupAnnonceIds: number[] = Array.isArray(g.annonces) ? g.annonces : [];
        const interestedList: GroupInterested[] = [];
        annoncesArr
          .filter((a) => groupAnnonceIds.includes(a.annonce_id))
          .forEach((a) => {
            (a.interested_users ?? []).forEach((uid: number) => {
              const u = userById.get(uid);
              if (u) interestedList.push({ ...u, annonce_id: a.annonce_id, annonce_name: a.name });
            });
          });
        setInteresses(interestedList);
      })
      .catch(() => toast.error('Impossible de charger les données du groupe.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRemoveMember = async (membre: GroupMember) => {
    if (!id) return;
    try {
      const { removeMemberFromGroup } = B_groupes();
      await removeMemberFromGroup(id, membre.user_id);
      setMembres((prev) => prev.filter((m) => m.user_id !== membre.user_id));
      toast.success(`${getNom(membre)} a été retiré du groupe.`);
    } catch {
      toast.error('Erreur lors du retrait du membre.');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--color-text-secondary)]">Chargement...</div>;
  }

  if (!groupe) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">Groupe introuvable</p>
        <button
          onClick={() => navigate('/admin/groupes')}
          className="mt-4 text-[var(--color-primary)] hover:underline"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="outline"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/admin/groupes')}
          className="mb-4"
        >
          Retour aux groupes
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="min-w-0">{groupe.name}</h1>
              <Badge variant="level" level={Number(groupe.niveau) || 1} />
            </div>
            <p className="text-[var(--color-text-secondary)] mt-2">{groupe.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{membres.length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Membres</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{groupe.annonces.length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Annonces actives</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{interesses.length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Personnes intéressées</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="border-b border-[var(--color-border)]">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('membres')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'membres'
                ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              Membres ({membres.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('interesses')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'interesses'
                ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart size={18} />
              Intéressés ({interesses.length})
            </div>
          </button>
        </div>
      </div>

      {activeTab === 'membres' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left p-4 font-medium text-[var(--color-text-secondary)]">Membre</th>
                  <th className="text-left p-4 font-medium text-[var(--color-text-secondary)]">Identifiant</th>
                  <th className="text-right p-4 font-medium text-[var(--color-text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {membres.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-[var(--color-text-secondary)]">
                      Aucun membre dans ce groupe.
                    </td>
                  </tr>
                ) : (
                  membres.map((membre) => (
                    <tr key={membre.user_id} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {getInitials(membre)}
                            </span>
                          </div>
                          <span className="font-medium">{getNom(membre)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[var(--color-text-secondary)]">
                        @{membre.identifier ?? '—'}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<UserMinus size={16} />}
                            onClick={() => handleRemoveMember(membre)}
                          >
                            Retirer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'interesses' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left p-4 font-medium text-[var(--color-text-secondary)]">Personne</th>
                  <th className="text-left p-4 font-medium text-[var(--color-text-secondary)]">Identifiant</th>
                  <th className="text-left p-4 font-medium text-[var(--color-text-secondary)]">Annonce concernée</th>
                </tr>
              </thead>
              <tbody>
                {interesses.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-[var(--color-text-secondary)]">
                      Aucune personne intéressée pour le moment.
                    </td>
                  </tr>
                ) : (
                  interesses.map((interesse, idx) => (
                    <tr key={`${interesse.user_id}-${interesse.annonce_id}-${idx}`} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {getInitials(interesse)}
                            </span>
                          </div>
                          <span className="font-medium">{getNom(interesse)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[var(--color-text-secondary)]">
                        @{interesse.identifier ?? '—'}
                      </td>
                      <td className="p-4 text-[var(--color-text-secondary)]">
                        {interesse.annonce_name}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
