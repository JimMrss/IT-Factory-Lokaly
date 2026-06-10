import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { FileText, Users, Users as GroupsIcon, TrendingUp } from 'lucide-react';
import { B_admin_stats } from '../Composables/Admin';
import { toast } from 'sonner';
import type { Stats, ActiviteMensuelle } from '../types';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activite, setActivite] = useState<ActiviteMensuelle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { getDashboardStats, getMonthlyActivity } = B_admin_stats();
    Promise.all([getDashboardStats(), getMonthlyActivity()])
      .then(([s, a]) => {
        setStats(s);
        setActivite(Array.isArray(a) ? a : []);
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
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Habitants inscrits"
              value={stats?.total_users ?? '—'}
              icon={<Users size={24} />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Groupes actifs"
              value={stats?.total_groupes ?? '—'}
              icon={<GroupsIcon size={24} />}
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Taux de participation"
              value={stats?.taux_participation != null ? `${stats.taux_participation}%` : '—'}
              icon={<TrendingUp size={24} />}
              trend={{ value: 3, isPositive: true }}
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
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
                  <div>
                    <p className="font-medium">Nouvelle annonce publiée</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      "Prêt de tondeuse à gazon" par Marie Dubois
                    </p>
                  </div>
                  <span className="text-sm text-[var(--color-text-secondary)]">Il y a 2h</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
                  <div>
                    <p className="font-medium">Nouveau membre validé</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Marc Durand a rejoint la communauté
                    </p>
                  </div>
                  <span className="text-sm text-[var(--color-text-secondary)]">Il y a 5h</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Nouveau groupe créé</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      "Repair Café" par Sophie Martin
                    </p>
                  </div>
                  <span className="text-sm text-[var(--color-text-secondary)]">Hier</span>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
