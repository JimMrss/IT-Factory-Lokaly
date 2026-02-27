import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { UserPlus, Search, Trash2, Eye, EyeOff, Key } from 'lucide-react';
import { mockUtilisateurs } from '../data/mockData';
import { toast } from 'sonner';

export function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ prenom: '', nom: '', identifiant: '' });

  const filteredUsers = mockUtilisateurs.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.identifiant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    toast.success(`Utilisateur ${newUser.prenom} ${newUser.nom} créé. Mot de passe temporaire généré.`);
    setShowCreateModal(false);
    setNewUser({ prenom: '', nom: '', identifiant: '' });
  };

  const handleToggleStatus = (user: typeof mockUtilisateurs[0]) => {
    const newStatus = user.statut === 'actif' ? 'désactivé' : 'activé';
    toast.success(`Utilisateur ${user.prenom} ${user.nom} ${newStatus}.`);
  };

  const handleResetPassword = (user: typeof mockUtilisateurs[0]) => {
    toast.success(`Nouveau mot de passe généré pour ${user.prenom} ${user.nom}.`);
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
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

      {/* Barre de recherche */}
      <Card>
        <div className="p-4">
          <div className="relative">
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
        </div>
      </Card>

      {/* Liste des utilisateurs */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-4 font-medium text-[var(--color-text-secondary)]">Utilisateur</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-secondary)]">Identifiant</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-secondary)]">Date création</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-secondary)]">Statut</th>
                <th className="text-right p-4 font-medium text-[var(--color-text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.prenom.charAt(0)}{user.nom.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.prenom} {user.nom}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[var(--color-text-secondary)]">@{user.identifiant}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[var(--color-text-secondary)]">
                      {new Date(user.dateCreation).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant={user.statut === 'actif' ? 'secondary' : 'neutral'}>
                      {user.statut === 'actif' ? 'Actif' : 'Désactivé'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Key size={16} />}
                        onClick={() => handleResetPassword(user)}
                      >
                        Réinit. MDP
                      </Button>
                      <Button
                        variant={user.statut === 'actif' ? 'danger' : 'secondary'}
                        size="sm"
                        icon={user.statut === 'actif' ? <EyeOff size={16} /> : <Eye size={16} />}
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.statut === 'actif' ? 'Désactiver' : 'Activer'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Note importante */}
      <Card>
        <div className="p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-900">
            <strong>Note :</strong> Les utilisateurs ne sont jamais supprimés définitivement.
            Utilisez le bouton "Désactiver" pour retirer l'accès d'un utilisateur.
            Son compte pourra être réactivé ultérieurement si nécessaire.
          </p>
        </div>
      </Card>

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-6">
              <h3>Créer un nouvel utilisateur</h3>

              <div className="space-y-4">
                <Input
                  label="Prénom"
                  placeholder="Ex: Marie"
                  value={newUser.prenom}
                  onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                  required
                />
                <Input
                  label="Nom"
                  placeholder="Ex: Dubois"
                  value={newUser.nom}
                  onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                  required
                />
                <Input
                  label="Identifiant de connexion"
                  placeholder="Ex: marie.dubois"
                  value={newUser.identifiant}
                  onChange={(e) => setNewUser({ ...newUser, identifiant: e.target.value })}
                  required
                  helper="L'identifiant sera utilisé pour la connexion"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-900">
                  Un mot de passe temporaire sera généré automatiquement.
                  L'utilisateur devra le changer lors de sa première connexion.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowCreateModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleCreateUser}
                  disabled={!newUser.prenom || !newUser.nom || !newUser.identifiant}
                >
                  Créer l'utilisateur
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
