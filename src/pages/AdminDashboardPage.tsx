import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { FileText, Users, Users as GroupsIcon, TrendingUp } from 'lucide-react';
import { B_users } from '../Composables/BRIDGE_users';
import { B_groupes } from '../Composables/BRIDGE_groupe';
import { B_Annonces } from '../Composables/BRIDGE_annonces';
import { B_Evenements } from '../Composables/BRIDGE_evenements';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  total_users: number;
  total_groupes: number;
  total_annonces: number;
  total_evenements: number;
}

interface ActiviteMensuelle {
  mois: string;
  annonces: number;
  evenements: number;
}

interface RecentItem {
  label: string;
  detail: string;
  date: string;
}

// Agrège des éléments datés (annonces, événements) par mois (clé YYYY-MM).
function buildMonthlyActivity(annonces: any[], evenements: any[]): ActiviteMensuelle[] {
  const map = new Map<string, ActiviteMensuelle>();
  const add = (date: string | undefined, key: 'annonces' | 'evenements') => {
    if (!date) return;
    const mois = String(date).slice(0, 7); // YYYY-MM
    if (!map.has(mois)) map.set(mois, { mois, annonces: 0, evenements: 0 });
    map.get(mois)![key] += 1;
  };
  annonces.forEach((a) => add(a.date, 'annonces'));
  evenements.forEach((e) => add(e.date, 'evenements'));
  return [...map.values()].sort((a, b) => a.mois.localeCompare(b.mois));
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activite, setActivite] = useState<ActiviteMensuelle[]>([]);
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { getAllUsers } = B_users();
    const { getAllGroups } = B_groupes();
    const { getAllAnnonces } = B_Annonces();
    const { getAllEvenements } = B_Evenements();
    Promise.all([getAllUsers(), getAllGroups(), getAllAnnonces(), getAllEvenements()])
      .then(([users, groupes, annonces, evenements]) => {
        const usersArr: any[] = Array.isArray(users) ? users : [];
        const groupesArr: any[] = Array.isArray(groupes) ? groupes : [];
        const annoncesArr: any[] = Array.isArray(annonces) ? annonces : [];
        const evenementsArr: any[] = Array.isArray(evenements) ? evenements : [];

        setStats({
          total_users: usersArr.length,
          total_groupes: groupesArr.length,
          total_annonces: annoncesArr.length,
          total_evenements: evenementsArr.length,
        });
        setActivite(buildMonthlyActivity(annoncesArr, evenementsArr));

        // Activité récente : annonces + événements les plus récents
        const items: RecentItem[] = [
          ...annoncesArr.map((a) => ({ label: 'Annonce publiée', detail: a.name, date: a.date })),
          ...evenementsArr.map((e) => ({ label: 'Événement créé', detail: e.name, date: e.date })),
        ]
          .filter((i) => i.detail)
          .sort((a, b) => String(b.date).localeCompare(String(a.date)))
          .slice(0, 4);
        setRecent(items);
      })
      .catch(() => toast.error('Impossible de charger les statistiques.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1>Dashboard</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">
          Vue d{'\''}ensemble de l{'\''}activité de la communauté
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">Chargement...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Annonces actives"
              value={stats?.total_annonces ?? '—'}
              icon={<FileText size={24} />}
            />
            <StatCard
              title="Habitants inscrits"
              value={stats?.total_users ?? '—'}
              icon={<Users size={24} />}
            />
            <StatCard
              title="Groupes actifs"
              value={stats?.total_groupes ?? '—'}
              icon={<GroupsIcon size={24} />}
            />
            <StatCard
              title="Événements"
              value={stats?.total_evenements ?? '—'}
              icon={<TrendingUp size={24} />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h3 className="mb-6">Évolution des annonces</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activite}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="mois" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="annonces"
                      stroke="#1e40af"
                      strokeWidth={2}
                      name="Annonces"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="mb-6">Activité mensuelle</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activite}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="mois" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="evenements" fill="#3b82f6" name="Événements" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card>
            <div className="p-6">
              <h3 className="mb-4">Activité récente</h3>
              {recent.length === 0 ? (
                <p className="text-sm text-[var(--color-text-secondary)] py-3">
                  Aucune activité récente.
                </p>
              ) : (
                <div className="space-y-3">
                  {recent.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          "{item.detail}"
                        </p>
                      </div>
                      <span className="text-sm text-[var(--color-text-secondary)]">{item.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
