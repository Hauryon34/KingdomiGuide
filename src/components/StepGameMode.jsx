import React from 'react';
import { GAME_SETUP_RULES } from '../types/kingdomino';
import { Layers, Sparkles, Target, Compass } from 'lucide-react';

export default function StepGameMode({
  playerCount,
  gameMode,
  setGameMode
}) {
  const isTwoPlayers = playerCount === 2;
  const currentSetup = GAME_SETUP_RULES[playerCount]?.[isTwoPlayers ? gameMode : 'classic'];

  return (
    <div className="space-y-6 max-w-sm sm:max-w-md mx-auto px-1 animate-fade-in">
      {/* Title Section */}
      <div className="text-center space-y-2 pt-2">
        <h2 className="text-2xl font-black font-medieval text-amber-200">
          Mode de Jeu & Règles
        </h2>
        <p className="text-xs text-slate-400">
          Configuration pour {playerCount} joueurs
        </p>
      </div>

      {/* Mode Selector (if 2 players) */}
      {isTwoPlayers ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGameMode('classic')}
              className={`p-4 rounded-3xl border-2 text-left flex flex-col justify-between transition-all ${
                gameMode === 'classic'
                  ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-lg ring-2 ring-indigo-400/50 scale-102'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="text-xs font-black flex items-center justify-between">
                  <span>Classique</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800">5×5</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">24 dominos écartés</p>
              </div>
              <div className="text-[10px] text-indigo-300 font-bold mt-3">Partie rapide</div>
            </button>

            <button
              type="button"
              onClick={() => setGameMode('duel')}
              className={`p-4 rounded-3xl border-2 text-left flex flex-col justify-between transition-all ${
                gameMode === 'duel'
                  ? 'bg-amber-950/60 border-amber-400 text-amber-100 shadow-lg ring-2 ring-amber-400/50 scale-102'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="text-xs font-black flex items-center justify-between text-amber-300">
                  <span>Grand Duel</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">7×7</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">TOUS les 48 dominos</p>
              </div>
              <div className="text-[10px] text-amber-400 font-bold mt-3">👑 Expérience totale</div>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 text-center space-y-1.5 shadow-md">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
            Mode Classique (Grille 5×5)
          </span>
          <p className="text-xs text-slate-300">
            {playerCount === 3 ? '36 dominos utilisés (12 retirés au hasard)' : 'Les 48 dominos sont en jeu'}
          </p>
        </div>
      )}

      {/* Mini-Guide Synthétique Aéré */}
      <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
          <Compass size={16} className="text-amber-400" />
          <span>Guide Express de la Manche</span>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          {/* Pioche */}
          <div className="flex items-start gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-100 mb-0.5">Préparation de la pioche</div>
              <div className="text-slate-300 leading-relaxed">{currentSetup?.description}</div>
            </div>
          </div>

          {/* Règle des meeples */}
          <div className="flex items-start gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 flex-shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-100 mb-0.5">Meeples & Actions</div>
              <div className="text-slate-300 leading-relaxed">
                {isTwoPlayers ? '2 meeples par joueur (4 actions au total par manche).' : '1 meeple par joueur.'}
              </div>
            </div>
          </div>

          {/* Conseil de pose */}
          <div className="flex items-start gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
              <Target size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-100 mb-0.5">Conseil de pose</div>
              <div className="text-slate-300 leading-relaxed">
                {isTwoPlayers && gameMode === 'duel'
                  ? 'Placez le château bien au centre (3 cases de marge) pour réussir les 49 cases du 7×7 sans blocage !'
                  : 'Connectez toujours vos terrains au château ou à un biome identique.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
