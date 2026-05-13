import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { User, Save, Edit2, Plus, X } from 'lucide-react';
import { mockUserProfile } from '../data/mockData';
import { toast } from 'sonner';

export function ProfilPage() {
  // useNavigate retourne une fonction navigate() pour changer de page
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(mockUserProfile.bio);
  const [contactExterne, setContactExterne] = useState(mockUserProfile.contactExterne);
  const [objetsDisponibles, setObjetsDisponibles] = useState(mockUserProfile.objetsDisponibles);
  const [nouvelObjet, setNouvelObjet] = useState('');

  const handleAddObjet = () => {
    const trimmed = nouvelObjet.trim();
    if (trimmed && !objetsDisponibles.includes(trimmed)) {
      setObjetsDisponibles([...objetsDisponibles, trimmed]);
      setNouvelObjet('');
    }
  };

  const handleRemoveObjet = (objet: string) => {
    setObjetsDisponibles(objetsDisponibles.filter(o => o !== objet));
  };
  
  const handleSave = () => {
    toast.success('Profil enregistré avec succès !');
    setIsEditing(false);
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1>Mon profil</h1>
          <Button
            variant={isEditing ? 'secondary' : 'outline'}
            icon={isEditing ? <Save size={20} /> : <Edit2 size={20} />}
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? 'Enregistrer' : 'Modifier'}
          </Button>
        </div>
        
        {/* Carte principale */}
        <Card className="mb-6">
          <div className="p-6 md:p-8 space-y-6">
            {/* Avatar et nom */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
              <div>
                <h2>{mockUserProfile.nom}</h2>
                <p className="text-[var(--color-text-secondary)]">@{mockUserProfile.identifier}</p>
              </div>
            </div>
            
            {/* Bio */}
            <div>
              <Textarea
                label="Présentation"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing}
                rows={4}
                helper="Parlez-vous à la communauté"
              />
            </div>
          </div>
        </Card>
        
        {/* Centres d'intérêt */}
        <Card className="mb-6">
          <div className="p-6 md:p-8 space-y-4">
            <h3>Centres d{'\''}intérêt</h3>
            <div className="flex flex-wrap gap-2">
              {mockUserProfile.centresInteret.map((interet, index) => (
                <Badge key={index} variant="primary">
                  {interet}
                </Badge>
              ))}
              {isEditing && (
                <Badge variant="neutral">
                  + Ajouter
                </Badge>
              )}
            </div>
          </div>
        </Card>
        
        {/* Compétences */}
        <Card className="mb-6">
          <div className="p-6 md:p-8 space-y-4">
            <h3>Compétences proposées</h3>
            <div className="flex flex-wrap gap-2">
              {mockUserProfile.competences.map((competence, index) => (
                <Badge key={index} variant="secondary">
                  {competence}
                </Badge>
              ))}
              {isEditing && (
                <Badge variant="neutral">
                  + Ajouter
                </Badge>
              )}
            </div>
          </div>
        </Card>
        
        {/* Objets disponibles */}
        <Card className="mb-6">
          <div className="p-6 md:p-8 space-y-4">
            <h3>Objets disponibles</h3>
            <ul className="space-y-2">
              {objetsDisponibles.map((objet, index) => (
                <li key={index} className="flex items-center justify-between gap-2 text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full flex-shrink-0"></span>
                    {objet}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveObjet(objet)}
                      className="p-0.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {isEditing && (
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={nouvelObjet}
                  onChange={(e) => setNouvelObjet(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjet())}
                  placeholder="Ex: Vélo, Échelle..."
                  className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-all"
                />
                <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={handleAddObjet}>
                  Ajouter
                </Button>
              </div>
            )}
          </div>
        </Card>
        
        {/* Contact externe */}
        <Card>
          <div className="p-6 md:p-8 space-y-4">
            <h3>Contact externe</h3>
            <Input
              label="Lien Line / WhatsApp"
              placeholder="https://line.me/ti/p/votre-nom"
              value={contactExterne}
              onChange={(e) => setContactExterne(e.target.value)}
              disabled={!isEditing}
              helper="Ce lien sera partagé uniquement avec les personnes intéressées par vos annonces"
            />
          </div>
        </Card>
        
        {isEditing && (
          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleSave}
            >
              Enregistrer les modifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
