// src/pages/GroupeDetailPage.tsx
// Page de détail d'un groupe
// Même principe que AnnonceDetailPage : useParams + find dans mockData

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { AnnonceCard } from '../components/AnnonceCard';
import { ArrowLeft, Users, UserPlus, TrendingUp } from 'lucide-react';
import { mockAnnonces, mockGroupes } from '../data/mockData';
import { toast } from 'sonner';

// Plus de props groupe et onNavigate
export function GroupeDetailPage() {
  // useParams lit l'ID depuis l'URL (/groupes/2 → id = "2")
  const { id } = useParams();
  const navigate = useNavigate();

  const [isMember, setIsMember] = React.useState(false);

  // On cherche le groupe dans mockData
  const groupe = mockGroupes.find(g => g.id === id);

  // Si le groupe n'existe pas, on affiche un message d'erreur
  if (!groupe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500">Groupe introuvable</p>
          <button
            onClick={() => navigate('/groupes')}
            className="mt-4 text-[var(--color-primary)] hover:underline"
          >
            Retour aux groupes
          </button>
        </div>
      </div>
    );
  }

  // Les annonces liées à ce groupe
  const groupeAnnonces = mockAnnonces.filter((a) => groupe.annonces?.includes(a.id));

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour */}
        <Button
          variant="outline"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/groupes')}
          className="mb-6"
        >
          Retour aux groupes
        </Button>
        
        {/* En-tête du groupe */}
        <Card className="mb-8">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1>{groupe.name}</h1>
                  <Badge variant="level" level={groupe.niveau}>
                    Niveau {groupe.niveau}
                  </Badge>
                </div>
                <p className="text-[var(--color-text-secondary)]">
                  {groupe.description}
                </p>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <Users size={20} />
                  <span>{groupe.members} membre{groupe.members > 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <Button
                variant={isMember ? 'secondary' : 'primary'}
                icon={<UserPlus size={20} />}
                onClick={() => setIsMember(!isMember)}
              >
                {isMember ? 'Membre ✓' : 'Rejoindre le groupe'}
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Annonces liées */}
        {groupeAnnonces.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-6">Annonces du groupe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupeAnnonces.map((annonce) => (
                <AnnonceCard
                  key={annonce.id}
                  annonce={annonce}
                  onClick={() => navigate('/annonces/' + annonce.id)}
                  onInterested={() => toast.success('Intérêt manifesté ! Le contact sera partagé.')}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Activité récente */}
        <section>
          <h2 className="mb-6">Activité récente</h2>
          <div className="space-y-4">
            <Card>
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">3 nouveaux membres ce mois</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Le groupe continue de grandir !
                  </p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">2 ateliers organisés récemment</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Merci à tous les participants !
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
