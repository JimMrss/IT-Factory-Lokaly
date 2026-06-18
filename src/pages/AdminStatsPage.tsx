import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { FileText, Users, TrendingUp, Calendar } from 'lucide-react';
import { B_users } from '../Composables/BRIDGE_users';
import { B_groupes } from '../Composables/BRIDGE_groupe';
import { B_Annonces } from '../Composables/BRIDGE_annonces';
import { B_Evenements } from '../Composables/BRIDGE_evenements';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1e40af', '#3b82f6', '#fbbf24', '#ef4444'];

// Les statistiques sont CALCULÉES côté front à partir des données existantes
// (utilisateurs, groupes, annonces, événements) — pas d'endpoint /stats/ stocké.
interface StatsData { total_annonces: number; total_users: number; total_groupes: number; taux_participation: number; }
interface ActiviteMensuelle { mois: string; annonces: number; evenements: number; }
interface CategoryStat { name: string; value: number; }
interface GroupStat { name: string; annonces: number; membres: number; }

// Agrège les éléments datés par mois (clé YYYY-MM).
function buildMonthlyActivity(annonces: any[], evenements: any[]): ActiviteMensuelle[] {
  const map = new Map<string, ActiviteMensuelle>();
  const add = (date: string | undefined, key: 'annonces' | 'evenements') => {
    if (!date) return;
    const mois = String(date).slice(0, 7);
    if (!map.has(mois)) map.set(mois, { mois, annonces: 0, evenements: 0 });
    map.get(mois)![key] += 1;
  };
  annonces.forEach((a) => add(a.date, 'annonces'));
  evenements.forEach((e) => add(e.date, 'evenements'));
  return [...map.values()].sort((a, b) => a.mois.localeCompare(b.mois));
}

export function AdminStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [activite, setActivite] = useState<ActiviteMensuelle[]>([]);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [groupes, setGroupes] = useState<GroupStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { getAllUsers } = B_users();
    const { getAllGroups } = B_groupes();
    const { getAllAnnonces } = B_Annonces();
    const { getAllEvenements } = B_Evenements();
    Promise.all([getAllUsers(), getAllGroups(), getAllAnnonces(), getAllEvenements()])
      .then(([users, groupesData, annonces, evenements]) => {
        const usersArr: any[] = Array.isArray(users) ? users : [];
        const groupesArr: any[] = Array.isArray(groupesData) ? groupesData : [];
        const annoncesArr: any[] = Array.isArray(annonces) ? annonces : [];
        const evenementsArr: any[] = Array.isArray(evenements) ? evenements : [];

        // Taux de participation : part des habitants ayant publié ou manifesté un intérêt.
        const participants = new Set<number>();
        annoncesArr.forEach((a) => {
          if (a.provider != null) participants.add(a.provider);
          (Array.isArray(a.interested_users) ? a.interested_users : []).forEach((u: number) => participants.add(u));
        });
        evenementsArr.forEach((e) => { if (e.provider != null) participants.add(e.provider); });
        const taux = usersArr.length ? Math.round((participants.size / usersArr.length) * 100) : 0;

        setStats({
          total_annonces: annoncesArr.length,
          total_users: usersArr.length,
          total_groupes: groupesArr.length,
          taux_participation: taux,
        });
        setActivite(buildMonthlyActivity(annoncesArr, evenementsArr));

        // Annonces par catégorie (champ `type` : Offre / Demande / ...).
        const catMap = new Map<string, number>();
        annoncesArr.forEach((a) => {
          const key = a.type || 'Autre';
          catMap.set(key, (catMap.get(key) ?? 0) + 1);
        });
        setCategories([...catMap.entries()].map(([name, value]) => ({ name, value })));

        // Activité par groupe (annonces + membres), trié par nombre d'annonces.
        const gStats: GroupStat[] = groupesArr
          .map((g) => ({
            name: g.name,
            annonces: Array.isArray(g.annonces) ? g.annonces.length : 0,
            membres: Array.isArray(g.members) ? g.members.length : 0,
          }))
          .sort((a, b) => b.annonces - a.annonces);
        setGroupes(gStats);
      })
      .catch(() => toast.error('Impossible de charger les statistiques.'))
      .finally(() => setLoading(false));
  }, []);

  // Croissance des annonces : dernier mois vs mois précédent.
  const croissance = (() => {
    if (activite.length < 2) return null;
    const last = activite[activite.length - 1].annonces;
    const prev = activite[activite.length - 2].annonces;
    if (prev === 0) return null;
    return Math.round(((last - prev) / prev) * 100);
  })();

  return (
    <div className="space-y-8">
      <div>
        <h1>Statistiques détaillées</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">
          Analyse complète de l{'\''}activité de la plateforme
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">Chargement...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Annonces totales"
              value={stats?.total_annonces ?? '—'}
              icon={<FileText size={24} />}
              trend={croissance != null ? { value: croissance, isPositive: croissance >= 0 } : undefined}
            />
            <StatCard
              title="Habitants inscrits"
              value={stats?.total_users ?? '—'}
              icon={<Users size={24} />}
            />
            <StatCard
              title="Taux d'engagement"
              value={stats?.taux_participation != null ? `${stats.taux_participation}%` : '—'}
              icon={<TrendingUp size={24} />}
            />
            <StatCard
              title="Groupes actifs"
              value={stats?.total_groupes ?? '—'}
              icon={<Calendar size={24} />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h3 className="mb-6">Évolution mensuelle</h3>
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
                    <Line
                      type="monotone"
                      dataKey="evenements"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Événements"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="mb-6">Annonces par catégorie</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="mb-6">Activité par groupe</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="annonces" fill="#1e40af" name="Annonces" />
                    <Bar dataKey="membres" fill="#3b82f6" name="Membres" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="p-6 space-y-4">
                <h3>Insights clés</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-medium text-blue-900">Évolution des annonces</p>
                    <p className="text-sm text-blue-700 mt-1">
                      {croissance != null
                        ? `${croissance >= 0 ? '+' : ''}${croissance}% d'annonces ce mois par rapport au mois dernier`
                        : 'Pas assez de données pour comparer les mois'}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-medium text-green-900">Engagement élevé</p>
                    <p className="text-sm text-green-700 mt-1">
                      {stats?.taux_participation ?? '—'}% des habitants ont publié ou répondu à une annonce
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-medium text-yellow-900">Groupe populaire</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      {groupes[0]?.name ?? '—'} est le groupe le plus actif
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="p-6">
              <h3 className="mb-4">Résumé mensuel</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-[var(--color-border)]">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Mois</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Annonces</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Événements</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Évolution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {activite.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{item.mois}</td>
                        <td className="px-4 py-3 text-right">{item.annonces}</td>
                        <td className="px-4 py-3 text-right">{item.evenements}</td>
                        <td className="px-4 py-3 text-right">
                          {index > 0 && (
                            <span className={
                              item.annonces > activite[index - 1].annonces
                                ? 'text-green-600'
                                : 'text-red-600'
                            }>
                              {item.annonces > activite[index - 1].annonces ? '↑' : '↓'}
                              {' '}
                              {Math.abs(
                                Math.round(
                                  ((item.annonces - activite[index - 1].annonces) /
                                    activite[index - 1].annonces) * 100
                                )
                              )}%
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
