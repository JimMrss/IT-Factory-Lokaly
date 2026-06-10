import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { FileText, Users, TrendingUp, Calendar } from 'lucide-react';
import { B_admin_stats } from '../Composables/Admin';
import { toast } from 'sonner';
import type { Stats, ActiviteMensuelle } from '../types';
import type { CategoryStat, GroupStat } from '../Composables/Admin';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1e40af', '#3b82f6', '#fbbf24', '#ef4444'];

export function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activite, setActivite] = useState<ActiviteMensuelle[]>([]);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [groupes, setGroupes] = useState<GroupStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { getDashboardStats, getMonthlyActivity, getStatsByCategory, getStatsByGroup } = B_admin_stats();
    Promise.all([getDashboardStats(), getMonthlyActivity(), getStatsByCategory(), getStatsByGroup()])
      .then(([s, a, c, g]) => {
        setStats(s);
        setActivite(Array.isArray(a) ? a : []);
        setCategories(Array.isArray(c) ? c : []);
        setGroupes(Array.isArray(g) ? g : []);
      })
      .catch(() => toast.error('Impossible de charger les statistiques.'))
      .finally(() => setLoading(false));
  }, []);

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
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Habitants actifs"
              value={stats?.total_users ?? '—'}
              icon={<Users size={24} />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Taux d'engagement"
              value={stats?.taux_participation != null ? `${stats.taux_participation}%` : '—'}
              icon={<TrendingUp size={24} />}
              trend={{ value: 3, isPositive: true }}
            />
            <StatCard
              title="Groupes actifs"
              value={stats?.total_groupes ?? '—'}
              icon={<Calendar size={24} />}
              trend={{ value: 15, isPositive: true }}
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
                    <p className="font-medium text-blue-900">Croissance forte</p>
                    <p className="text-sm text-blue-700 mt-1">
                      +12% d{'\''}annonces ce mois par rapport au mois dernier
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
