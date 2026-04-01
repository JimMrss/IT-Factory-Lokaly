import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Select } from '../components/Select';
import { Card } from '../components/Card';
import { ArrowLeft, Users, Send } from 'lucide-react';
import { toast } from 'sonner';

interface CreerGroupePageProps {
  onNavigate: (page: string) => void;
}

export function CreerGroupePage({ onNavigate }: CreerGroupePageProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Groupe créé avec succès ! Il commencera au Niveau 1.');
    onNavigate('groupes');
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Button
          variant="outline"
          icon={<ArrowLeft size={20} />}
          onClick={() => onNavigate('groupes')}
          className="mb-6"
        >
          Retour
        </Button>
        
        <div className="mb-8">
          <h1>Créer un groupe</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Rassemblez les habitants autour d{'\''}un centre d{'\''}intérêt commun
          </p>
        </div>
        
        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <h3>Informations du groupe</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Niveau 1 - Débutant
                  </p>
                </div>
              </div>
              
              <Input
                label="Nom du groupe"
                placeholder="Ex: Jardiniers du quartier"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                helper="Choisissez un nom clair et évocateur"
              />

              <Select
                label="Catégorie"
                placeholder="Sélectionnez une catégorie"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                required
                options={[
                  { value: 'Jardinage', label: 'Jardinage' },
                  { value: 'Culture', label: 'Culture' },
                  { value: 'Sport', label: 'Sport' },
                  { value: 'Bricolage', label: 'Bricolage' }
                ]}
              />
              
              <Textarea
                label="Description"
                placeholder="Décrivez l'objectif et les activités du groupe..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                helper="Expliquez ce qui rassemble les membres"
              />
            </div>
          </Card>
          
          {/* Information sur la gamification */}
          <Card>
            <div className="p-6 md:p-8 space-y-4">
              <h3>Système de niveaux</h3>
              <p className="text-[var(--color-text-secondary)]">
                Votre groupe commencera au Niveau 1. Il progressera automatiquement selon l{'\''}activité :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">🌱 Niveau 1-2</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Groupe débutant (0-10 membres)
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">🌿 Niveau 3</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Groupe actif (11-25 membres)
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900">🌳 Niveau 4</p>
                  <p className="text-sm text-green-700 mt-1">
                    Groupe dynamique (26-50 membres)
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="font-medium text-yellow-900">⭐ Niveau 5</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Groupe référent (50+ membres)
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => onNavigate('groupes')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Send size={20} />}
              fullWidth
            >
              Créer le groupe
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
