import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { User, Save, Edit2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { B_users } from '../Composables/BRIDGE_users';

export function ProfilPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profil, setProfil] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [contactExterne, setContactExterne] = useState('');
  const [objetsDisponibles, setObjetsDisponibles] = useState<string[]>([]);
  const [nouvelObjet, setNouvelObjet] = useState('');
  const [centresInteret, setCentresInteret] = useState<string[]>([]);
  const [nouvelInteret, setNouvelInteret] = useState('');
  const [competences, setCompetences] = useState<string[]>([]);
  const [nouvelleCompetence, setNouvelleCompetence] = useState('');

  useEffect(() => {
    if (user?.user_id) chargerProfil();
  }, [user?.user_id]);

  const chargerProfil = async () => {
    try {
      const data = await B_users().getUser(user!.user_id!);
      setProfil(data);
      setBio(data.bio || '');
      setContactExterne(data.contactExterne || '');
      setObjetsDisponibles(data.objetsDisponibles || []);
      setCentresInteret(data.centresInteret || []);
      setCompetences(data.competences || []);
    } catch {
      toast.error('Impossible de charger le profil.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddInteret = () => {
    const trimmed = nouvelInteret.trim();
    if (trimmed && !centresInteret.includes(trimmed)) {
      setCentresInteret([...centresInteret, trimmed]);
      setNouvelInteret('');
    }
  };

  const handleAddCompetence = () => {
    const trimmed = nouvelleCompetence.trim();
    if (trimmed && !competences.includes(trimmed)) {
      setCompetences([...competences, trimmed]);
      setNouvelleCompetence('');
    }
  };

  const handleSave = async () => {
    if (!user?.user_id) return;
    setSaving(true);
    try {
      await B_users().updateUser(user.user_id, {
        bio,
        contactExterne,
        objetsDisponibles,
        centresInteret,
        competences,
      });
      // la réponse du PATCH renvoie l'objet AVANT modification : on garde nos valeurs locales
      setProfil({ ...profil, bio, contactExterne, objetsDisponibles, centresInteret, competences });
      toast.success('Profil enregistré avec succès !');
      setIsEditing(false);
    } catch {
      toast.error('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setBio(profil?.bio || '');
    setContactExterne(profil?.contactExterne || '');
    setObjetsDisponibles(profil?.objetsDisponibles || []);
    setCentresInteret(profil?.centresInteret || []);
    setCompetences(profil?.competences || []);
    setIsEditing(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profil) return (
    <div className="min-h-screen flex items-center justify-center text-[var(--color-text-secondary)]">
      Profil introuvable.
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1>Mon profil</h1>
          <Button
            variant={isEditing ? 'secondary' : 'outline'}
            icon={isEditing ? <Save size={20} /> : <Edit2 size={20} />}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={saving}
          >
            {isEditing ? (saving ? 'Enregistrement...' : 'Enregistrer') : 'Modifier'}
          </Button>
        </div>

        <Card className="mb-6">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
              <div>
                <h2>{profil.nom}</h2>
                <p className="text-[var(--color-text-secondary)]">@{profil.identifier}</p>
              </div>
            </div>
            <Textarea
              label="Présentation"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
              rows={4}
              helper="Parlez-vous à la communauté"
            />
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6 md:p-8 space-y-4">
            <h3>Centres d{'\''}intérêt</h3>
            <div className="flex flex-wrap gap-2">
              {centresInteret.map((interet, index) => (
                <span key={index} className="inline-flex items-center gap-1">
                  <Badge variant="primary">{interet}</Badge>
                  {isEditing && (
                    <button
                      onClick={() => setCentresInteret(centresInteret.filter((_, i) => i !== index))}
                      className="ml-[-6px] p-0.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
              {centresInteret.length === 0 && (
                <p className="text-sm text-[var(--color-text-secondary)]">Aucun centre d'intérêt renseigné.</p>
              )}
            </div>
            {isEditing && (
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={nouvelInteret}
                  onChange={(e) => setNouvelInteret(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInteret())}
                  placeholder="Ex: Jardinage, Sport..."
                  className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-all"
                />
                <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={handleAddInteret}>
                  Ajouter
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6 md:p-8 space-y-4">
            <h3>Compétences proposées</h3>
            <div className="flex flex-wrap gap-2">
              {competences.map((competence, index) => (
                <span key={index} className="inline-flex items-center gap-1">
                  <Badge variant="secondary">{competence}</Badge>
                  {isEditing && (
                    <button
                      onClick={() => setCompetences(competences.filter((_, i) => i !== index))}
                      className="ml-[-6px] p-0.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
              {competences.length === 0 && (
                <p className="text-sm text-[var(--color-text-secondary)]">Aucune compétence renseignée.</p>
              )}
            </div>
            {isEditing && (
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={nouvelleCompetence}
                  onChange={(e) => setNouvelleCompetence(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompetence())}
                  placeholder="Ex: Menuiserie, Piano..."
                  className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-all"
                />
                <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={handleAddCompetence}>
                  Ajouter
                </Button>
              </div>
            )}
          </div>
        </Card>

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
              {objetsDisponibles.length === 0 && (
                <p className="text-sm text-[var(--color-text-secondary)]">Aucun objet renseigné.</p>
              )}
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
            <Button variant="outline" fullWidth onClick={handleCancel}>
              Annuler
            </Button>
            <Button variant="primary" fullWidth onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
