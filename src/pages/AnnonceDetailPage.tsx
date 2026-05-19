// src/pages/AnnonceDetailPage.tsx
// Page de détail d'une annonce
// useParams récupère l'ID depuis l'URL (ex: /annonces/3 → id = "3")
// On cherche ensuite l'annonce correspondante dans mockData

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { MapPin, Calendar, Heart, ArrowLeft, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { B_Annonces } from '../Composables/BRIDGE_annonces';
import { B_users } from '../Composables/BRIDGE_users';

export function AnnonceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [annonce, setAnnonce] = useState<any>(null);
  const [auteur, setAuteur] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interested, setInterested] = useState(false);

  useEffect(() => {
    if (!id) return;
    B_Annonces().getAnnonces(id)
      .then((data) => {
        setAnnonce(data);
        if (data?.provider) {
          B_users().getUser(data.provider).then(setAuteur).catch(() => {});
        }
      })
      .catch(() => setError('Annonce introuvable.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !annonce) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500">Annonce introuvable</p>
          <button onClick={() => navigate('/annonces')} className="mt-4 text-[var(--color-primary)] hover:underline">
            Retour aux annonces
          </button>
        </div>
      </div>
    );
  }

  const handleInterest = () => {
    setInterested(true);
    alert('Merci pour votre intérêt ! Vous pouvez maintenant contacter l\'auteur via le lien ci-dessous.');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour */}
        <Button
          variant="outline"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/annonces')}
          className="mb-6"
        >
          Retour aux annonces
        </Button>

        {/* Carte principale */}
        <Card>
          <div className="overflow-hidden">
            {/* Image (obligatoire selon CDC) */}
            <div className="aspect-[16/9] overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={annonce.image}
                alt={annonce.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenu */}
            <div className="p-6 md:p-8 space-y-6">
              {/* En-tête */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="flex-1">{annonce.name}</h1>
                  {annonce.type && <Badge variant="accent">{annonce.type}</Badge>}
                </div>
              </div>

              {/* Informations */}
              <div className="flex flex-wrap gap-4">
                {annonce.location && (
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <MapPin size={20} />
                    <span>{annonce.location}</span>
                  </div>
                )}
                {(annonce.disponibilite || annonce.date) && (
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Calendar size={20} />
                    <span>{annonce.disponibilite || `${annonce.date}${annonce.hour ? ` à ${annonce.hour}` : ''}`}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3>Description</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {annonce.description}
                </p>
              </div>

              {/* Auteur */}
              <div className="pt-6 border-t border-[var(--color-border)]">
                <h4 className="mb-3">Proposé par</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">
                      {auteur ? auteur.name.charAt(0).toUpperCase() : 'M'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {auteur ? `${auteur.name} ${auteur.surname}` : 'Membre de la communauté'}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Membre de la communauté</p>
                  </div>
                </div>
              </div>

              {/* Bouton d'intérêt */}
              <div className="pt-6 border-t border-[var(--color-border)]">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Heart size={20} />}
                  onClick={handleInterest}
                  disabled={interested}
                >
                  {interested ? 'Intérêt manifesté ✓' : 'Je suis intéressé·e'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Encadré contact */}
        {interested && (
          <Card className="mt-6">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-3">
                <MessageCircle size={24} className="text-[var(--color-primary)] flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4>Contactez l{'\''}auteur</h4>
                  <p className="text-[var(--color-text-secondary)]">
                    La messagerie se fait en dehors de la plateforme. Contactez {annonce.auteur.nom} via Line ou WhatsApp pour organiser votre échange.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => window.open('https://line.me/', '_blank')}
                    className="mt-3"
                  >
                    Contacter via Line
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
