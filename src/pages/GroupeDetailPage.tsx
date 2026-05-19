import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { AnnonceCard } from '../components/AnnonceCard';
import { ArrowLeft, Users, UserPlus, TrendingUp } from 'lucide-react';
import { B_groupes } from '../Composables/BRIDGE_groupe';
import { B_Annonces } from '../Composables/BRIDGE_annonces';
import { B_users } from '../Composables/BRIDGE_users';
import { toast } from 'sonner';

export function GroupeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [groupe, setGroupe] = useState<any>(null);
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (id) chargerGroupe();
  }, [id]);

  const chargerGroupe = async () => {
    // 1. on charge le groupe
    let g = null;
    try {
      g = await B_groupes().getGroup(id!);
      console.log('groupe chargé:', g);
      setGroupe(g);
    } catch (err) {
      console.log('erreur groupe:', err);
      setLoading(false);
      return;
    }

    // 2. on charge les annonces associées au groupe
    try {
      const toutesAnnonces = await B_Annonces().getAllAnnonces();
      const ids = g.annonces || [];
      const annoncesGroupe = [];
      for (let i = 0; i < toutesAnnonces.length; i++) {
        for (let j = 0; j < ids.length; j++) {
          if (toutesAnnonces[i].annonce_id === Number(ids[j])) {
            annoncesGroupe.push(toutesAnnonces[i]);
            break;
          }
        }
      }
      console.log('annonces du groupe:', annoncesGroupe);
      setAnnonces(annoncesGroupe);
    } catch (err) {
      console.log('erreur annonces groupe:', err);
    }

    // 3. on charge les users pour les noms d'auteurs
    try {
      const allUsers = await B_users().getAllUsers();
      setUsers(allUsers || []);
    } catch (err) {
      console.log('erreur users:', err);
    }

    setLoading(false);
  };

  const handleJoinLeave = async () => {
    try {
      if (isMember) {
        await B_groupes().removeMemberFromGroup(groupe.group_id, 1); // TODO: remplacer 1 par vrai user id
        toast.success('Vous avez quitté le groupe.');
      } else {
        await B_groupes().addMemberToGroup(groupe.group_id, 1); // TODO: remplacer 1 par vrai user id
        toast.success('Vous avez rejoint le groupe !');
      }
      setIsMember(!isMember);
    } catch {
      toast.error('Une erreur est survenue.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!groupe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500">Groupe introuvable</p>
          <button onClick={() => navigate('/groupes')} className="mt-4 text-[var(--color-primary)] hover:underline">
            Retour aux groupes
          </button>
        </div>
      </div>
    );
  }

  const nbMembres = groupe.members ? groupe.members.length : 0;
  const niveau = parseInt(groupe.niveau) || 1;

  const getNomAuteur = (providerId: number) => {
    let nom = 'Membre de la communauté';
    for (let i = 0; i < users.length; i++) {
      if (users[i].user_id === providerId) {
        nom = users[i].name + ' ' + users[i].surname;
        break;
      }
    }
    return nom;
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="outline"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/groupes')}
          className="mb-6"
        >
          Retour aux groupes
        </Button>

        <Card className="mb-8">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1>{groupe.name}</h1>
                  <Badge variant="level" level={niveau}>Niveau {niveau}</Badge>
                </div>
                <p className="text-[var(--color-text-secondary)]">{groupe.description}</p>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <Users size={20} />
                  <span>{nbMembres} membre{nbMembres > 1 ? 's' : ''}</span>
                </div>
              </div>

              <Button
                variant={isMember ? 'secondary' : 'primary'}
                icon={<UserPlus size={20} />}
                onClick={handleJoinLeave}
              >
                {isMember ? 'Membre ✓' : 'Rejoindre le groupe'}
              </Button>
            </div>
          </div>
        </Card>

        {annonces.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-6">Annonces du groupe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {annonces.map((a) => (
                <AnnonceCard
                  key={a.annonce_id}
                  annonce={{
                    id: String(a.annonce_id),
                    name: a.name,
                    description: a.description,
                    location: a.location,
                    disponibilite: a.disponibilite || a.date || '',
                    type: a.type || '',
                    auteur: { nom: getNomAuteur(a.provider) },
                  }}
                  onClick={() => navigate('/annonces/' + a.annonce_id)}
                  onInterested={() => toast.success('Intérêt manifesté !')}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-6">Activité récente</h2>
          <div className="space-y-4">
            <Card>
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">3 nouveaux membres ce mois</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">Le groupe continue de grandir !</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">2 ateliers organisés récemment</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">Merci à tous les participants !</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
