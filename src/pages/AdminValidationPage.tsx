import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Check, X } from 'lucide-react';
import { mockHabitantsEnAttente } from '../data/mockData';
import { toast } from 'sonner';

export function AdminValidationPage() {
  const [habitants, setHabitants] = useState(mockHabitantsEnAttente);
  const [filterStatut, setFilterStatut] = useState('en_attente');
  
  const handleValidate = (id: string) => {
    setHabitants(habitants.map(h => 
      h.id === id ? { ...h, statut: 'valide' } : h
    ));
    toast.success('Habitant validé avec succès !');
  };
  
  const handleReject = (id: string) => {
    setHabitants(habitants.map(h => 
      h.id === id ? { ...h, statut: 'refuse' } : h
    ));
    toast.error('Demande refusée.');
  };
  
  const filteredHabitants = habitants.filter(h => 
    filterStatut === 'tous' || h.statut === filterStatut
  );
  
  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1>Validation des habitants</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">
          Validez ou refusez les demandes d{'\''}inscription à la communauté
        </p>
      </div>
      
      {/* Filtres */}
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
                { value: 'refuse', label: 'Refusé' }
              ]}
            />
          </div>
        </div>
      </Card>
      
      {/* Tableau des habitants */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-primary)]">
                  Nom
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-primary)]">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-primary)]">
                  Communauté
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-primary)]">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-primary)]">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-[var(--color-text-primary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredHabitants.map((habitant) => (
                <tr key={habitant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{habitant.prenom} {habitant.nom}</p>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                    {habitant.email}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                    {habitant.communaute}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                    {new Date(habitant.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                      habitant.statut === 'valide'
                        ? 'bg-green-100 text-green-700'
                        : habitant.statut === 'refuse'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {habitant.statut === 'valide' ? 'Validé' : 
                       habitant.statut === 'refuse' ? 'Refusé' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {habitant.statut === 'en_attente' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={<Check size={16} />}
                          onClick={() => handleValidate(habitant.id)}
                        >
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={<X size={16} />}
                          onClick={() => handleReject(habitant.id)}
                        >
                          Refuser
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredHabitants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-secondary)]">
                Aucun habitant ne correspond à ce filtre.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
