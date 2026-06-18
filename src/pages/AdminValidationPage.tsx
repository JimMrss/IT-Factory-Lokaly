import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Check, X } from 'lucide-react';
import { B_users } from '../Composables/BRIDGE_users';
import { B_admin_validation } from '../Composables/Admin';
import { toast } from 'sonner';

type Statut = 'en_attente' | 'valide' | 'actif' | 'refuse' | 'desactive';

interface UserWithStatut {
  user_id?: number;
  id?: string;
  nom?: string;
  name?: string;
  surname?: string;
  identifier?: string;
  statut: Statut;
}

// L'API renvoie le nom complet dans le champ `nom`.
const getNom = (u: UserWithStatut) => (u.nom ?? `${u.name ?? ''} ${u.surname ?? ''}`).trim();

export function AdminValidationPage() {
  const [users, setUsers] = useState<UserWithStatut[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState<string>('tous');

  useEffect(() => {
    const { getAllUsers } = B_users();
    getAllUsers()
      .then((data: any[]) => {
        const mapped: UserWithStatut[] = (Array.isArray(data) ? data : [])
          .map((u) => ({ ...u, statut: (u.statut as Statut) ?? 'en_attente' }))
          // Validation = en attente, validés (pas encore connectés) et refusés.
          .filter((u) => u.statut === 'en_attente' || u.statut === 'valide' || u.statut === 'refuse');
        setUsers(mapped);
      })
      .catch(() => toast.error('Impossible de charger les utilisateurs.'))
      .finally(() => setLoading(false));
  }, []);

  const handleValidate = async (id: number | string) => {
    try {
      const { validateHabitant } = B_admin_validation();
      await validateHabitant(id);
      // Validé → "valide" : reste dans la liste jusqu'à sa 1re connexion (qui le passera à "actif").
      setUsers((prev) =>
        prev.map((u) => (getKey(u) === id ? { ...u, statut: 'valide' } : u))
      );
      toast.success('Utilisateur validé avec succès !');
    } catch {
      toast.error('Erreur lors de la validation.');
    }
  };

  const handleReject = async (id: number | string) => {
    try {
      const { refuseHabitant } = B_admin_validation();
      await refuseHabitant(id);
      setUsers((prev) =>
        prev.map((u) => (getKey(u) === id ? { ...u, statut: 'refuse' } : u))
      );
      toast.error('Demande refusée.');
    } catch {
      toast.error('Erreur lors du refus.');
    }
  };

  const getKey = (u: UserWithStatut) => u.user_id ?? u.id ?? '';

  const filteredUsers = users.filter((u) =>
    filterStatut === 'tous' || u.statut === filterStatut
  );

  return (
    <div className="space-y-8">
      <div>
        <h1>Validation des habitants</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">
          Validez ou refusez les demandes d{'\''}inscription à la communauté
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="max-w-xs">
            <Select
              label="Filtrer par statut"
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              options={[
                { value: 'tous', label: 'Tous les statuts' },
                { value: 'en_attente', label: 'En attente' },
                { value: 'valide', label: 'Validé' },
                { value: 'refuse', label: 'Refusé' },
              ]}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">Chargement...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-[var(--color-border)]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-primary)]">Nom</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-primary)]">Identifiant</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-primary)]">Statut</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-[var(--color-text-primary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-[var(--color-text-secondary)]">
                      Aucun utilisateur ne correspond à ce filtre.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={getKey(user)} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium">{getNom(user)}</p>
                      </td>
                      <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                        @{user.identifier ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                          user.statut === 'valide'
                            ? 'bg-green-100 text-green-700'
                            : user.statut === 'refuse'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.statut === 'valide' ? 'Validé' : user.statut === 'refuse' ? 'Refusé' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.statut === 'en_attente' && (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              icon={<Check size={16} />}
                              onClick={() => handleValidate(getKey(user))}
                            >
                              Valider
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              icon={<X size={16} />}
                              onClick={() => handleReject(getKey(user))}
                            >
                              Refuser
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
