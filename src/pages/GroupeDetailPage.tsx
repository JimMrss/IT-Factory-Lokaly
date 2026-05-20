import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { AnnonceCard } from '../components/AnnonceCard';
import { ArrowLeft, Users, UserPlus, Calendar, MapPin, Plus } from 'lucide-react';
import { B_groupes } from '../Composables/BRIDGE_groupe';
import { B_Annonces } from '../Composables/BRIDGE_annonces';
import { B_users } from '../Composables/BRIDGE_users';
import { B_Evenements } from '../Composables/BRIDGE_evenements';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export function GroupeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [groupe, setGroupe] = useState<any>(null);
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [evenements, setEvenements] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [showEvtForm, setShowEvtForm] = useState(false);
  const [evtName, setEvtName] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtHour, setEvtHour] = useState('');
  const [evtDescription, setEvtDescription] = useState('');
  const [evtLocation, setEvtLocation] = useState('');
  const [evtLoading, setEvtLoading] = useState(false);

  useEffect(() => {
    if (id) chargerGroupe();
  }, [id]);

  const chargerGroupe = async () => {
    // 1. on charge le groupe
    let g = null;
    try {
      g = await B_groupes().getGroup(id!);
      setGroupe(g);
      setIsMember(Array.isArray(g.members) && user?.user_id != null && g.members.includes(user.user_id));
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

    // 4. on charge les événements du groupe
    try {
      const tousEvenements = await B_Evenements().getAllEvenements();
      const evtGroupe = tousEvenements.filter(
        (e: any) => Number(e.group_id) === Number(g.group_id)
      );
      setEvenements(evtGroupe);
    } catch (err) {
      console.log('erreur événements:', err);
    }

    setLoading(false);
  };

  const handleJoinLeave = async () => {
    if (!user?.user_id) return;
    try {
      let updated;
      if (isMember) {
        updated = await B_groupes().removeMemberFromGroup(groupe.group_id, user.user_id);
        toast.success('Vous avez quitté le groupe.');
      } else {
        updated = await B_groupes().addMemberToGroup(groupe.group_id, user.user_id);
        toast.success('Vous avez rejoint le groupe !');
      }
      setGroupe(updated);
      setIsMember(!isMember);
    } catch {
      toast.error('Une erreur est survenue.');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.user_id) return;
    setEvtLoading(true);
    try {
      const created = await B_Evenements().createEvenement({
        name: evtName,
        date: evtDate,
        hour: evtHour,
        description: evtDescription,
        location: evtLocation,
        provider: user.user_id,
        group_id: groupe.group_id,
      });
      setEvenements(prev => [...prev, created]);
      setEvtName(''); setEvtDate(''); setEvtHour(''); setEvtDescription(''); setEvtLocation('');
      setShowEvtForm(false);
      toast.success('Événement créé !');
    } catch {
      toast.error('Erreur lors de la création.');
    } finally {
      setEvtLoading(false);
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
          <div className="flex items-center justify-between mb-6">
            <h2>Événements du groupe</h2>
            {groupe.idAdmin === user?.user_id && (
              <Button variant="primary" icon={<Plus size={20} />} onClick={() => setShowEvtForm(v => !v)}>
                Créer un événement
              </Button>
            )}
          </div>

          {showEvtForm && (
            <Card className="mb-6">
              <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
                <input required placeholder="Nom de l'événement" value={evtName} onChange={e => setEvtName(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[var(--color-primary)]" />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="date" value={evtDate} onChange={e => setEvtDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[var(--color-primary)]" />
                  <input required type="time" value={evtHour} onChange={e => setEvtHour(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[var(--color-primary)]" />
                </div>
                <input required placeholder="Lieu" value={evtLocation} onChange={e => setEvtLocation(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[var(--color-primary)]" />
                <textarea required placeholder="Description" value={evtDescription} onChange={e => setEvtDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[var(--color-primary)] resize-none" />
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowEvtForm(false)}>Annuler</Button>
                  <Button type="submit" variant="primary" disabled={evtLoading}>{evtLoading ? 'Création...' : 'Créer'}</Button>
                </div>
              </form>
            </Card>
          )}

          {evenements.length === 0 ? (
            <Card>
              <div className="p-6 text-center text-[var(--color-text-secondary)]">
                Aucun événement pour ce groupe.
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {evenements.map((evt) => (
                <Card key={evt.evenement_id}>
                  <div className="p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar size={20} className="text-[var(--color-primary)]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{evt.name}</p>
                      {evt.description && (
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{evt.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-[var(--color-text-secondary)]">
                        {(evt.date || evt.hour) && (
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {evt.date}{evt.date && evt.hour ? ' à ' : ''}{evt.hour}
                          </span>
                        )}
                        {evt.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {evt.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
