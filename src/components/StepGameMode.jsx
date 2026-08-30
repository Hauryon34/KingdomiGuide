import React from 'react';
import { GAME_SETUP_RULES } from '../types/kingdomino';
import { Layers, Sparkles, Target, Compass, Crown, Trophy, Swords } from 'lucide-react';
import { playClickSound } from '../utils/audioHaptics';

export default function StepGameMode({
  playerCount,
  gameMode,
  setGameMode,
  bonuses,
  setBonuses,
  isDynastyMode,
  setIsDynastyMode
}) {
  const isTwoPlayers = playerCount === 2;
  const currentSetup = GAME_SETUP_RULES[playerCount]?.[isTwoPlayers ? gameMode : 'classic'];

  return (
    <div className="space-y-4 max-w-sm sm:max-w-md mx-auto px-1 animate-fade-in">
      {/* Title Section */}
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-black font-medieval text-amber-200">
          Mode de Jeu & Variantes
        </h2>
        <p className="text-[11px] text-slate-400">
          Configuration pour {playerCount} participants
        </p>
      </div>

      {/* Mode Selector (if 2 players) */}
      {isTwoPlayers ? (
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setGameMode('classic');
            }}
            className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
              gameMode === 'classic'
                ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-md ring-2 ring-indigo-400/50 scale-102'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            <div>
              <div className="text-xs font-black flex items-center justify-between">
                <span>Classique</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800">5×5</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">24 dominos écartés</p>
            </div>
            <div className="text-[10px] text-indigo-300 font-bold mt-2">Partie rapide</div>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setGameMode('duel');
            }}
            className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
              gameMode === 'duel'
                ? 'bg-amber-950/60 border-amber-400 text-amber-100 shadow-md ring-2 ring-amber-400/50 scale-102'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            <div>
              <div className="text-xs font-black flex items-center justify-between text-amber-300">
                <span>Grand Duel</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">7×7</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">TOUS les 48 dominos</p>
            </div>
            <div className="text-[10px] text-amber-400 font-bold mt-2">👑 Expérience totale</div>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-center space-y-0.5 shadow-sm">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
            Mode Classique (Grille 5×5)
          </span>
          <p className="text-[11px] text-slate-300">
            {playerCount === 3 ? '36 dominos utilisés (12 retirés au hasard)' : 'Les 48 dominos sont en jeu'}
          </p>
        </div>
      )}

      {/* Variantes Officielles Toggles (Pilules 100% sur 1 seule ligne) */}
      <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-md space-y-2">
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block px-1">
          Variantes Officielles
        </span>

        <div className="space-y-1.5">
          {/* Empire du Milieu */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setBonuses({ ...bonuses, middleEmpire: !bonuses.middleEmpire });
            }}
            className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
              bonuses.middleEmpire
                ? 'bg-amber-500/15 border-amber-400/80 text-amber-200'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0 pr-1">
              <span className="text-base flex-shrink-0">🏰</span>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">Empire du Milieu</span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  +10 pts si le château royal est au centre
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
              bonuses.middleEmpire ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              {bonuses.middleEmpire ? 'ACTIF (+10)' : 'DÉSACTIVÉ'}
            </span>
          </button>

          {/* Harmonie */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setBonuses({ ...bonuses, harmony: !bonuses.harmony });
            }}
            className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
              bonuses.harmony
                ? 'bg-emerald-500/15 border-emerald-400/80 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0 pr-1">
              <span className="text-base flex-shrink-0">✨</span>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">Harmonie</span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  +5 pts si la grille est 100% pleine sans case vide
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
              bonuses.harmony ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              {bonuses.harmony ? 'ACTIF (+5)' : 'DÉSACTIVÉ'}
            </span>
          </button>

          {/* Dynastie (3 manches) */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (setIsDynastyMode) setIsDynastyMode(!isDynastyMode);
            }}
            className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
              isDynastyMode
                ? 'bg-indigo-500/15 border-indigo-400/80 text-indigo-200'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0 pr-1">
              <span className="text-base flex-shrink-0">👑</span>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">Mode Dynastie</span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  Tournoi en 3 manches consécutives cumulées
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
              isDynastyMode ? 'bg-indigo-400 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              {isDynastyMode ? '3 MANCHES' : '1 MANCHE'}
            </span>
          </button>
        </div>
      </div>

      {/* Mini-Guide Synthétique Aéré avec Mode Dynastie expliqué */}
      <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 shadow-md space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
          <Compass size={14} className="text-amber-400" />
          <span>Guide Express de la Manche</span>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          {/* Explication du Mode Dynastie si actif */}
          {isDynastyMode && (
            <div className="flex items-start gap-2 bg-indigo-950/70 p-2.5 rounded-xl border border-indigo-800/80 animate-fade-in">
              <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300 flex-shrink-0">
                <Trophy size={15} />
              </div>
              <div>
                <div className="font-bold text-indigo-200 text-[11px]">Règle de la Dynastie</div>
                <div className="text-indigo-300/90 text-[10px] leading-relaxed">
                  Jouez 3 manches à la suite. Utilisez le bouton <em>« Revanche ⚔️ »</em> après chaque manche pour conserver les joueurs : le champion final est celui qui cumule le plus grand total de points après les 3 manches !
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
            <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 flex-shrink-0">
              <Layers size={15} />
            </div>
            <div>
              <div className="font-bold text-slate-100 text-[11px]">Pioche</div>
              <div className="text-slate-300 text-[10px] leading-relaxed">{currentSetup?.description}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
            <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 flex-shrink-0">
              <Sparkles size={15} />
            </div>
            <div>
              <div className="font-bold text-slate-100 text-[11px]">Meeples & Actions</div>
              <div className="text-slate-300 text-[10px] leading-relaxed">
                {isTwoPlayers ? '2 meeples par joueur (4 choix au total par manche).' : '1 meeple par joueur.'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
            <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0">
              <Target size={15} />
            </div>
            <div>
              <div className="font-bold text-slate-100 text-[11px]">Connexion légale</div>
              <div className="text-slate-300 text-[10px] leading-relaxed">
                Chaque domino posé doit toucher le château ou un biome identique.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
