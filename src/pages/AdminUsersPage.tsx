import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { UserPlus, Search, Eye, EyeOff, Shield, ShieldOff, Filter } from 'lucide-react';
import { B_users } from '../Composables/BRIDGE_users';
import { B_auth } from '../Composables/BRIDGE_auth';
import { B_admin_users } from '../Composables/Admin';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

// Libellés et couleurs des statuts renvoyés par l'API
const STATUT_LABEL: Record<string, string> = {
  actif: 'Actif',
  desactive: 'Désactivé',
  en_attente: 'En attente',
  refuse: 'Refusé',
};
const STATUT_STYLE: Record<string, string> = {
  actif: 'bg-green-100 text-green-700 border-green-200',
  desactive: 'bg-slate-200 text-slate-600 border-slate-300',
  en_attente: 'bg-amber-100 text-amber-700 border-amber-200',
  refuse: 'bg-red-100 text-red-700 border-red-200',
};
// Options du filtre par statut (en_attente / refuse sont gérés dans la page Validation)
const STATUT_OPTIONS = [
  { value: 'tous', label: 'Tous les statuts' },
  { value: 'actif', label: 'Actif' },
  { value: 'desactive', label: 'Désactivé' },
];

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('tous');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', surname: '', mail: '', password: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const { getAllUsers } = B_users();
    getAllUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Impossible de charger les utilisateurs.'))
      .finally(() => setLoading(false));
  }, []);

  // L'API renvoie le nom complet dans le champ `nom` (et l'email dans `mail`).
  const getNom = (u: any) => (u.nom ?? `${u.name ?? ''} ${u.surname ?? ''}`).trim();
  const getInitials = (u: any) => {
    const parts = getNom(u).split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase();
  };
  // Statut renvoyé par l'API (actif / desactive / en_attente / refuse). 'actif' par défaut si absent.
  const getStatut = (u: any): string => u.statut ?? 'actif';
  // Empêche un admin de se désactiver lui-même.
  const isSelf = (u: any) => currentUser?.user_id != null && (u.user_id ?? u.id) === currentUser.user_id;

  const filteredUsers = users.filter((user) => {
    const statut = getStatut(user);
    // Seuls les comptes actifs / désactivés sont gérés ici ; en_attente et refuse vont dans Validation.
    if (statut !== 'actif' && statut !== 'desactive') return false;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      getNom(user).toLowerCase().includes(q) ||
      (user.identifier ?? '').toLowerCase().includes(q) ||
      (user.mail ?? '').toLowerCase().includes(q);
    const matchStatut = statutFilter === 'tous' || statut === statutFilter;
    return matchSearch && matchStatut;
  });

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.surname || !newUser.mail || !newUser.password) return;
    setCreating(true);
    try {
      const { register } = B_auth();
      await register({ name: newUser.name, surname: newUser.surname, mail: newUser.mail, password: newUser.password });
      toast.success(`Utilisateur ${newUser.name} ${newUser.surname} créé.`);
      const { getAllUsers } = B_users();
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
      setShowCreateModal(false);
      setNewUser({ name: '', surname: '', mail: '', password: '' });
    } catch {
      toast.error('Erreur lors de la création de l\'utilisateur.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (user: any) => {
    const id = user.user_id ?? user.id;
    const newStatut: 'actif' | 'desactive' = getStatut(user) === 'actif' ? 'desactive' : 'actif';
    // Sécurité : on ne peut pas se désactiver soi-même.
    if (newStatut === 'desactive' && isSelf(user)) {
      toast.error('Vous ne pouvez pas désactiver votre propre compte.');
      return;
    }
    try {
      const { toggleUserStatus } = B_admin_users();
      await toggleUserStatus(id, newStatut);
      setUsers((prev) =>
        prev.map((u) => ((u.user_id ?? u.id) === id ? { ...u, statut: newStatut } : u))
      );
      toast.success(`Utilisateur ${getNom(user)} ${newStatut === 'actif' ? 'activé' : 'désactivé'}.`);
    } catch {
      toast.error('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleToggleAdmin = async (user: any) => {
    const id = user.user_id ?? user.id;
    const isAdmin = Number(user.permissions) === 1;
    const newPermissions: 0 | 1 = isAdmin ? 0 : 1;
    try {
      const { setUserPermissions } = B_admin_users();
      await setUserPermissions(id, newPermissions);
      setUsers((prev) =>
        prev.map((u) => ((u.user_id ?? u.id) === id ? { ...u, permissions: newPermissions } : u))
      );
      toast.success(
        `${getNom(user)} ${newPermissions === 1 ? 'est maintenant administrateur' : "n'est plus administrateur"}.`
      );
    } catch {
      toast.error('Erreur lors de la mise à jour du rôle.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1>Gestion des utilisateurs</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Créez et gérez les comptes des habitants de la commune
          </p>
        </div>
        <Button
          variant="primary"
          icon={<UserPlus size={20} />}
          onClick={() => setShowCreateModal(true)}
        >
          Nouvel utilisateur
        </Button>
      </div>

      <Card>
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
            />
          </div>
          <div className="relative sm:w-56">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none">
              <Filter size={20} />
            </div>
            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all bg-white appearance-none cursor-pointer"
            >
              {STATUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">Chargement...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-center p-4 font-medium text-[var(--color-text-secondary)]">Utilisateur</th>
                  <th className="text-center p-4 font-medium text-[var(--color-text-secondary)]">Identifiant</th>
                  <th className="text-center p-4 font-medium text-[var(--color-text-secondary)]">Rôle</th>
                  <th className="text-center p-4 font-medium text-[var(--color-text-secondary)]">Statut</th>
                  <th className="text-center p-4 font-medium text-[var(--color-text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-[var(--color-text-secondary)]">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.user_id ?? user.id} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium">
                              {getInitials(user)}
                            </span>
                          </div>
                          <p className="font-medium">{getNom(user)}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-[var(--color-text-secondary)]">@{user.identifier ?? '—'}</span>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={Number(user.permissions) === 1 ? 'primary' : 'neutral'}>
                          {Number(user.permissions) === 1 ? 'Admin' : 'Utilisateur'}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border font-medium ${STATUT_STYLE[getStatut(user)] ?? STATUT_STYLE.desactive}`}>
                          {STATUT_LABEL[getStatut(user)] ?? getStatut(user)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant={Number(user.permissions) === 1 ? 'outline' : 'primary'}
                            size="sm"
                            icon={Number(user.permissions) === 1 ? <ShieldOff size={16} /> : <Shield size={16} />}
                            onClick={() => handleToggleAdmin(user)}
                          >
                            {Number(user.permissions) === 1 ? 'Retirer admin' : 'Rendre admin'}
                          </Button>
                          <Button
                            variant={getStatut(user) === 'actif' ? 'danger' : 'secondary'}
                            size="sm"
                            icon={getStatut(user) === 'actif' ? <EyeOff size={16} /> : <Eye size={16} />}
                            onClick={() => handleToggleStatus(user)}
                            disabled={isSelf(user) && getStatut(user) === 'actif'}
                          >
                            {getStatut(user) === 'actif' ? 'Désactiver' : 'Activer'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-900">
            <strong>Note :</strong> Les utilisateurs ne sont jamais supprimés définitivement.
            Utilisez le bouton "Désactiver" pour retirer l'accès d'un utilisateur.
          </p>
        </div>
      </Card>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-6">
              <h3>Créer un nouvel utilisateur</h3>
              <div className="space-y-4">
                <Input
                  label="Prénom"
                  placeholder="Ex: Marie"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
                <Input
                  label="Nom"
                  placeholder="Ex: Dubois"
                  value={newUser.surname}
                  onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="Ex: marie.dubois@email.com"
                  value={newUser.mail}
                  onChange={(e) => setNewUser({ ...newUser, mail: e.target.value })}
                  required
                />
                <Input
                  label="Mot de passe temporaire"
                  type="password"
                  placeholder="Mot de passe"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-900">
                  L'utilisateur pourra modifier son mot de passe après sa première connexion.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setShowCreateModal(false)}>
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleCreateUser}
                  disabled={!newUser.name || !newUser.surname || !newUser.mail || !newUser.password || creating}
                >
                  {creating ? 'Création...' : 'Créer l\'utilisateur'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
