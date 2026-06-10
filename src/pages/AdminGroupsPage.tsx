import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Search, Users, Eye, TrendingUp, Star } from 'lucide-react';
import { B_admin_groupes } from '../Composables/Admin';
import { toast } from 'sonner';
import type { Group } from '../Composables/BRIDGE_groupe';

export function AdminGroupsPage() {
  const [groupes, setGroupes] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const { getAllGroupsAdmin } = B_admin_groupes();
    getAllGroupsAdmin()
      .then((data) => setGroupes(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Impossible de charger les groupes.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredGroupes = groupes.filter((groupe) =>
    groupe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1>Gestion des groupes</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">
          Supervisez les groupes et associations de la commune
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">Chargement...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{groupes.length}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Groupes actifs</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {groupes.reduce((acc, g) => acc + g.members.length, 0)}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Membres total</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star size={24} className="text-yellow-600 fill-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    Niveau {groupes.length > 0 ? Math.max(...groupes.map((g) => g.niveau)) : '—'}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Niveau max atteint</p>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="p-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un groupe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
                />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroupes.map((groupe) => (
              <Card key={groupe.group_id} hover>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="flex-1 min-w-0 truncate">{groupe.name}</h4>
                    <Badge variant="level" level={groupe.niveau} />
                  </div>

                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                    {groupe.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{groupe.members.length} membres</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{groupe.annonces.length} annonces</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Eye size={16} />}
                      onClick={() => navigate('/admin/groupes/' + groupe.group_id)}
                      fullWidth
                    >
                      Voir détails
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredGroupes.length === 0 && (
            <Card>
              <div className="p-8 text-center">
                <p className="text-[var(--color-text-secondary)]">
                  Aucun groupe ne correspond à votre recherche.
                </p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
