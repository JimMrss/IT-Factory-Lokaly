import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Select } from '../components/Select';
import { Card } from '../components/Card';
import { ArrowLeft, Sparkles, Eye, Send, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { B_Annonces } from '../Composables/BRIDGE_annonces';

export function NouvelleAnnoncePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [zone, setZone] = useState('');
  const [disponibilite, setDisponibilite] = useState('');
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAiGenerate = () => {
    if (aiKeywords) {
      setAiSuggestion(
        'Je propose ' + aiKeywords + ". Disponible pour la communauté. N'hésitez pas à me contacter pour plus d'informations !"
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // vérification rapide avant d'envoyer
    if (!name || !type || !description || !zone || !disponibilite) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (description.length < 20) {
      alert('La description doit faire au moins 20 caractères.');
      return;
    }

    setIsSubmitting(true);

    let res = null;
    try {
      res = await B_Annonces().createAnnonce({
        name,
        description,
        location: zone,
        type,
        disponibilite,
        state: 'disponible',
      });
      console.log('annonce créée:', res);
      toast.success('Annonce publiée avec succès !');
      navigate('/annonces');
    } catch (err) {
      console.log('erreur création annonce:', err);
      toast.error('Erreur lors de la publication. Réessayez.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="outline"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/')}
          className="mb-6"
        >
          Retour
        </Button>

        <div className="mb-8">
          <h1>Créer une annonce</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Partagez avec votre communauté ce que vous souhaitez donner, prêter ou proposer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <div className="p-6 md:p-8 space-y-6">
              <h3>Informations de base</h3>

              <Input
                label="Titre de l'annonce"
                placeholder="Ex: Prêt de tondeuse à gazon"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                helper="Soyez clair et précis"
              />

              <Select
                label="Type d'annonce"
                placeholder="Sélectionnez un type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                options={[
                  { value: 'Don', label: 'Don' },
                  { value: 'Prêt', label: 'Prêt' },
                  { value: 'Service', label: 'Service' },
                  { value: 'Atelier', label: 'Atelier' }
                ]}
              />

              <Textarea
                label="Description"
                placeholder="Décrivez votre annonce en détail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                helper="Minimum 20 caractères"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Zone"
                  placeholder="Sélectionnez une zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  required
                  options={[
                    { value: 'Centre-ville', label: 'Centre-ville' },
                    { value: 'Quartier Nord', label: 'Quartier Nord' },
                    { value: 'Quartier Sud', label: 'Quartier Sud' },
                    { value: 'Toute la commune', label: 'Toute la commune' }
                  ]}
                />

                <Input
                  label="Disponibilité"
                  placeholder="Ex: Week-ends, 14h-16h"
                  value={disponibilite}
                  onChange={(e) => setDisponibilite(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm">Image (optionnel)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-[var(--color-border)]">
                    <img src={imagePreview} alt="Aperçu" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                  >
                    <Upload size={24} className="mx-auto text-[var(--color-text-light)] mb-2" />
                    <p className="text-[var(--color-text-secondary)]">Cliquez pour ajouter une image</p>
                    <p className="text-sm text-[var(--color-text-light)] mt-1">JPG, PNG - Max 5 Mo</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Assistance IA */}
          <Card>
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={24} className="text-[var(--color-accent)]" />
                <h3>Assistance à la rédaction</h3>
              </div>
              <p className="text-[var(--color-text-secondary)]">
                Besoin d{'\''}aide pour rédiger votre annonce ? Entrez quelques mots-clés et on vous proposera un texte.
              </p>

              <Input
                placeholder="Ex: pommes / donner / samedi"
                value={aiKeywords}
                onChange={(e) => setAiKeywords(e.target.value)}
              />

              <Button type="button" variant="outline" icon={<Sparkles size={20} />} onClick={handleAiGenerate}>
                Générer une suggestion
              </Button>

              {aiSuggestion && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-blue-900">Suggestion :</p>
                  <p className="text-[var(--color-text-secondary)]">{aiSuggestion}</p>
                  <Button type="button" size="sm" variant="primary" onClick={() => setDescription(aiSuggestion)}>
                    Utiliser cette suggestion
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="button" variant="outline" icon={<Eye size={20} />} fullWidth onClick={() => setShowPreview(true)}>
              Prévisualiser
            </Button>
            <Button type="submit" variant="primary" icon={<Send size={20} />} fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Publication...' : 'Publier l\'annonce'}
            </Button>
          </div>
        </form>

        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                <h3 className="text-lg font-bold">Aperçu de l'annonce</h3>
                <button onClick={() => setShowPreview(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {imagePreview && <img src={imagePreview} alt="Aperçu" className="w-full h-48 object-cover rounded-xl" />}
                <div className="flex items-center gap-2">
                  {type && <span className="px-3 py-1 text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full">{type}</span>}
                  {zone && <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">{zone}</span>}
                </div>
                <h2 className="text-xl font-bold">{name || 'Titre de l\'annonce'}</h2>
                <p className="text-[var(--color-text-secondary)]">{description || 'Description...'}</p>
                {disponibilite && <p className="text-sm text-[var(--color-text-secondary)]"><span className="font-medium">Disponibilité :</span> {disponibilite}</p>}
              </div>
              <div className="p-6 pt-0">
                <Button variant="outline" fullWidth onClick={() => setShowPreview(false)}>Fermer</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
