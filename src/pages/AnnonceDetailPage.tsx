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
  const [interested, setInterested] = useState(false);

  useEffect(() => {
    if (!id) return;
    chargerAnnonce();
  }, [id]);

  const chargerAnnonce = async () => {
    // on charge l'annonce d'abord
    let data = null;
    try {
      data = await B_Annonces().getAnnonces(id!);
      console.log('annonce chargée:', data);
      setAnnonce(data);
    } catch (err) {
      console.log('annonce introuvable:', err);
      setLoading(false);
      return;
    }

    // si l'annonce a un auteur on le récupère
    if (data != null && data.provider) {
      try {
        const userInfo = await B_users().getUser(data.provider);
        console.log('auteur:', userInfo);
        setAuteur(userInfo);
      } catch (err) {
        console.log('auteur pas trouvé, pas grave');
      }
    }

    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!annonce) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500">Annonce introuvable</p>
          <button
            onClick={() => navigate('/annonces')}
            className="mt-4 text-[var(--color-primary)] hover:underline"
          >
            Retour aux annonces
          </button>
        </div>
      </div>
    );
  }

  let nomAuteur = 'Membre de la communauté';
  if (auteur != null) {
    nomAuteur = auteur.name + ' ' + auteur.surname;
  }

  const handleInterest = () => {
    setInterested(true);
    alert('Merci pour votre intérêt ! Vous pouvez maintenant contacter l\'auteur via le lien ci-dessous.');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="outline"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/annonces')}
          className="mb-6"
        >
          Retour aux annonces
        </Button>

        <Card>
          <div className="overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={annonce.image}
                alt={annonce.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="flex-1">{annonce.name}</h1>
                  {annonce.type && <Badge variant="accent">{annonce.type}</Badge>}
                </div>
              </div>

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
                    <span>{annonce.disponibilite || annonce.date}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3>Description</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {annonce.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[var(--color-border)]">
                <h4 className="mb-3">Proposé par</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">
                      {nomAuteur.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{nomAuteur}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Membre de la communauté</p>
                  </div>
                </div>
              </div>

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

        {interested && (
          <Card className="mt-6">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-3">
                <MessageCircle size={24} className="text-[var(--color-primary)] flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4>Contactez l{'\''}auteur</h4>
                  <p className="text-[var(--color-text-secondary)]">
                    La messagerie se fait en dehors de la plateforme. Contactez {nomAuteur} via Line ou WhatsApp pour organiser votre échange.
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
