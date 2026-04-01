import React from 'react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { MapPin, Calendar, Heart, ArrowLeft, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface AnnonceDetailPageProps {
  annonce: any;
  onNavigate: (page: string) => void;
}

export function AnnonceDetailPage({ annonce, onNavigate }: AnnonceDetailPageProps) {
  const [interested, setInterested] = React.useState(false);
  
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
          onClick={() => onNavigate('annonces')}
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
                  <Badge variant="accent">{annonce.type}</Badge>
                </div>
              </div>
              
              {/* Informations */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <MapPin size={20} />
                  <span>{annonce.location}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <Calendar size={20} />
                  <span>{annonce.disponibilite}</span>
                </div>
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
                      {annonce.auteur.nom.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{annonce.auteur.nom}</p>
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
