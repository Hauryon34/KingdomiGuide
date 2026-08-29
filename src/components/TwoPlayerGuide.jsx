import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Target, 
  HelpCircle, 
  Compass, 
  Layers, 
  CheckCircle2, 
  ArrowLeft,
  Calculator,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import MeepleIcon from './MeepleIcon';

export default function TwoPlayerGuide({ onBackToSetup, onGoToScore }) {
  const [activeTab, setActiveTab] = useState('7x7_strategy');

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToSetup}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft size={14} />
          Retour
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            👑 Guide 2 Joueurs
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={16} className="text-amber-400" />
            Mode Mythique
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-medieval text-amber-200">
            Le Grand Duel (7×7)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Découvrez comment jouer avec les 48 dominos et réussir la grille parfaite de 49 cases.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('7x7_strategy')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === '7x7_strategy'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target size={16} />
          <span>Comment réussir le 7×7</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rules_2p')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'rules_2p'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers size={16} />
          <span>Règles Spécifiques 2J</span>
        </button>
      </div>

      {/* Content Tab 1: Strategy for 7x7 */}
      {activeTab === '7x7_strategy' && (
        <div className="space-y-4">
          {/* Math reminder */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 font-black text-lg">
              49
            </div>
            <div className="text-xs text-slate-200">
              <span className="font-bold text-amber-300">L'équation parfaite :</span> 1 Château (1 case) + 24 Dominos posés (24 × 2 = 48 cases) = <strong className="text-white underline">Exactement 49 cases (7×7)</strong> sans aucune case vide !
            </div>
          </div>

          {/* 4 Golden Rules to succeed */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wide">
              <Compass size={16} className="text-amber-400" />
              4 Conseils d'or pour réussir votre 7×7 :
            </h3>

            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <div className="w-6 h-6 rounded-lg bg-amber-400/20 flex items-center justify-center text-xs">1</div>
                Centrez impérativement votre Château
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                Au départ, placez votre château au centre mental de votre future grille (laissez 3 cases d'espace potentiel de chaque côté). Cela vous garantit non seulement le bonus <strong className="text-amber-300">Empire du Milieu (+10 pts)</strong>, mais évite surtout d'atteindre un bord trop vite.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <div className="w-6 h-6 rounded-lg bg-amber-400/20 flex items-center justify-center text-xs">2</div>
                Diversifiez les 4 côtés du Château
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                Le château est votre meilleur joker : n'importe quel terrain peut s'y connecter. Utilisez ses 4 faces pour amorcer <strong className="text-amber-300">4 biomes différents</strong> (ex. Forêt au Nord, Blé au Sud, Eau à l'Est, Marais à l'Ouest). Vous aurez toujours une porte d'entrée pour vos futurs tirages.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <div className="w-6 h-6 rounded-lg bg-amber-400/20 flex items-center justify-center text-xs">3</div>
                Construisez de manière "Compacte"
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                Ne faites pas de "tentacules" ou de longues lignes droites vers l'extérieur. Remplissez en carré progressif (3×3 puis 5×5 puis 7×7) pour limiter les angles morts et ne jamais créer de recoins impossibles à boucher.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <div className="w-6 h-6 rounded-lg bg-amber-400/20 flex items-center justify-center text-xs">4</div>
                Surveillez le tirage adverse
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                À 2 joueurs, vous prenez 2 dominos par manche. Choisissez judicieusement vos dominos pour vous placer sur la rangée suivante tout en bloquant les couronnes dont votre adversaire a cruellement besoin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Tab 2: 2 Players Rules details */}
      {activeTab === 'rules_2p' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <ShieldCheck size={18} />
              Déroulement d'un tour à 2 joueurs
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="p-1 rounded bg-amber-400/20 text-amber-300 font-bold">1</div>
                <div>
                  <strong className="text-white">Révélez toujours 4 dominos :</strong> Rangez-les dans l'ordre croissant des numéros au dos des tuiles.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="p-1 rounded bg-amber-400/20 text-amber-300 font-bold">2</div>
                <div>
                  <strong className="text-white">2 Meeples par joueur (4 au total) :</strong> Chaque joueur sélectionne 2 dominos par manche.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="p-1 rounded bg-amber-400/20 text-amber-300 font-bold">3</div>
                <div>
                  <strong className="text-white">Ordre de pose :</strong> Le premier joueur place son 1er meeple, le second joueur place ses 2 meeples consécutifs, puis le premier joueur place son second meeple.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="p-1 rounded bg-amber-400/20 text-amber-300 font-bold">4</div>
                <div>
                  <strong className="text-white">Résolution du tour :</strong> Les joueurs récupèrent et posent leurs dominos dans l'ordre de la ligne de dominos (du plus petit numéro au plus grand) tout en choisissant un domino sur la nouvelle ligne de 4 dominos.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGoToScore}
          className="w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-green-500 transition-all"
        >
          <Calculator size={18} />
          <span>Lancer le Calculateur de Score</span>
        </button>
      </div>
    </div>
  );
}
