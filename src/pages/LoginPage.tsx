// src/pages/LoginPage.tsx
// Page de connexion et d'inscription
// Utilise useAuth() pour connecter l'utilisateur
// Utilise useNavigate() pour rediriger après connexion

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Users, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { B_auth } from '../Composables/BRIDGE_auth';
import { B_users } from '../Composables/BRIDGE_users';

// Plus besoin de props — on utilise le contexte et le router directement
export function LoginPage() {
  // useNavigate permet de changer de page en changeant l'URL
  const navigate = useNavigate();

  // useAuth donne accès à la fonction login de notre AuthContext
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await B_auth().login({ name: loginUsername, password: loginPassword });
      // La réponse de /auth/login/ ne contient ni `permissions` ni `statut`.
      // On récupère le profil complet depuis la liste des utilisateurs.
      let me: any = null;
      try {
        const all = await B_users().getAllUsers();
        me = (Array.isArray(all) ? all : []).find((u: any) =>
          (user.user_id != null && u.user_id === user.user_id) ||
          u.identifier === loginUsername
        );
      } catch { /* profil indisponible : on continue avec les infos du login */ }

      // Statuts qui interdisent la connexion.
      const statut: string | undefined = me?.statut;
      const blocked: Record<string, string> = {
        desactive: 'Votre compte est désactivé. Contactez un administrateur.',
        en_attente: 'Votre compte est en attente de validation par un administrateur.',
        refuse: 'Votre compte a été refusé. Contactez un administrateur.',
      };
      if (statut && blocked[statut]) {
        setError(blocked[statut]);
        setIsLoading(false);
        return;
      }
      // Un compte "valide" peut se connecter : le backend le bascule lui-même en "actif".

      const permissions = me?.permissions ?? user.permissions;
      login({ user_id: user.user_id, name: user.username ?? user.identifier, email: user.mail ?? user.email, password: loginPassword, permissions });
      navigate('/');
    } catch {
      setError('Identifiants incorrects');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!registerUsername || !registerEmail || !registerPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (registerPassword.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const user = await B_auth().register({ name: registerUsername, mail: registerEmail, password: registerPassword });
      // Un nouvel inscrit n'est jamais admin (permissions: 0 côté backend).
      login({ user_id: user.user_id, name: user.username ?? user.identifier, email: user.mail ?? user.email, password: registerPassword, permissions: user.permissions ?? 0 });
      navigate('/');
    } catch {
      setError("Erreur lors de l'inscription. Réessayez.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Partie gauche - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] relative overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white opacity-5 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white opacity-5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white opacity-5 rounded-full"></div>

        {/* Contenu */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-4xl font-bold text-[var(--color-primary)]">L</span>
            </div>
            <span className="text-4xl font-bold">Lokaly</span>
          </div>

          {/* Titre */}
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Bienvenue dans votre<br />communauté locale
          </h1>

          <p className="text-xl text-white opacity-90 mb-12 leading-relaxed">
            Rejoignez vos voisins, partagez, échangez et créez des liens durables au sein de votre quartier.
          </p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white opacity-20 rounded-xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Communauté active</h3>
                <p className="text-white opacity-80">Rejoignez des groupes et participez</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white opacity-20 rounded-xl flex items-center justify-center">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Entraide locale</h3>
                <p className="text-white opacity-80">Donnez, prêtez, rendez service</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white opacity-20 rounded-xl flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Échanges simplifiés</h3>
                <p className="text-white opacity-80">Communiquez facilement avec vos voisins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partie droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">L</span>
            </div>
            <span className="text-2xl font-bold text-[var(--color-primary)]">Lokaly</span>
          </div>

          {/* Titre */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h2>
            <p className="text-gray-500">
              {isLogin
                ? 'Connectez-vous pour accéder à votre communauté'
                : 'Rejoignez la communauté Lokaly'}
            </p>
          </div>

          {/* Onglets */}
          <div className="flex bg-gray-200 rounded-xl p-1 mb-8">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {isLogin ? (
            /* Formulaire de connexion */
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Entrez votre nom d'utilisateur"
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-opacity-10 outline-none transition-all text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    className="w-full pl-12 pr-12 py-4 bg-white rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-opacity-10 outline-none transition-all text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <span className="text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-sm text-[var(--color-primary)] hover:underline font-medium">
                  Mot de passe oublié ?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Hint */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                </p>
              </div>
            </form>
          ) : (
            /* Formulaire d'inscription */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    placeholder="Choisissez un nom d'utilisateur"
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-opacity-10 outline-none transition-all text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-opacity-10 outline-none transition-all text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-white rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-opacity-10 outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-white rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-opacity-10 outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-sm text-gray-600">
                  J'accepte les{' '}
                  <a href="#" className="text-[var(--color-primary)] hover:underline">conditions d'utilisation</a>
                  {' '}et la{' '}
                  <a href="#" className="text-[var(--color-primary)] hover:underline">politique de confidentialité</a>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-8">
            © 2024 Lokaly. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
