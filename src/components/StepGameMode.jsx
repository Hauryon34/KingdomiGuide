import React from 'react';
import { GAME_SETUP_RULES } from '../types/kingdomino';
import { Layers, Sparkles, Target, Compass, Trophy, Castle } from 'lucide-react';
import { playClickSound, playToggleSound } from '../utils/audioHaptics';

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
        <h2 className="text-xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-zinc-100">
          Mode & Variantes
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
              gameMode === 'classic'
                ? 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900/10 dark:ring-white/10 shadow-card'
                : 'bg-white/60 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Classique</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  5×5
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                24 dominos en jeu
              </p>
            </div>
            <div className="text-[11px] text-zinc-600 dark:text-zinc-300 font-semibold mt-2.5">
              Format rapide
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setGameMode('duel');
            }}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
              gameMode === 'duel'
                ? 'bg-white dark:bg-zinc-900 border-amber-500 ring-2 ring-amber-500/20 shadow-card'
                : 'bg-white/60 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Grand Duel</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  7×7
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                Les 48 dominos
              </p>
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-2.5">
              Expérience complète
            </div>
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between shadow-soft">
          <div>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
              Mode Classique
            </span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {playerCount === 3 ? '36 dominos utilisés (12 écartés)' : 'Les 48 dominos sont en jeu'}
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            Grille 5×5
          </span>
        </div>
      )}

      {/* Variantes Officielles (Style iOS Settings Switch List) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block px-1">
          Variantes Officielles
        </span>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-soft divide-y divide-zinc-100 dark:divide-zinc-800/70 overflow-hidden">
          {/* Empire du Milieu */}
          <div
            onClick={() => {
              const nextVal = !bonuses.middleEmpire;
              playToggleSound(nextVal);
              setBonuses({ ...bonuses, middleEmpire: nextVal });
            }}
            className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <Castle size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    Empire du Milieu
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 whitespace-nowrap flex-shrink-0">
                    +10 pts
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block leading-snug mt-0.5">
                  Si le château est au centre du domaine
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={bonuses.middleEmpire}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 flex-shrink-0 ${
                bonuses.middleEmpire ? 'bg-amber-500 justify-end' : 'bg-zinc-200 dark:bg-zinc-800 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs transition-transform" />
            </button>
          </div>

          {/* Harmonie */}
          <div
            onClick={() => {
              const nextVal = !bonuses.harmony;
              playToggleSound(nextVal);
              setBonuses({ ...bonuses, harmony: nextVal });
            }}
            className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    Harmonie
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 whitespace-nowrap flex-shrink-0">
                    +5 pts
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block leading-snug mt-0.5">
                  Si la grille est complète sans case vide
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={bonuses.harmony}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 flex-shrink-0 ${
                bonuses.harmony ? 'bg-emerald-500 justify-end' : 'bg-zinc-200 dark:bg-zinc-800 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs transition-transform" />
            </button>
          </div>

          {/* Mode Dynastie */}
          <div
            onClick={() => {
              const nextVal = !isDynastyMode;
              playToggleSound(nextVal);
              if (setIsDynastyMode) setIsDynastyMode(nextVal);
            }}
            className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                <Trophy size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    Mode Dynastie
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 whitespace-nowrap flex-shrink-0">
                    3 manches
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block leading-snug mt-0.5">
                  Tournoi en 3 manches aux scores cumulés
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isDynastyMode}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 flex-shrink-0 ${
                isDynastyMode ? 'bg-indigo-500 justify-end' : 'bg-zinc-200 dark:bg-zinc-800 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Mini-Guide Express */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3.5 border border-zinc-200/80 dark:border-zinc-800/80 shadow-soft space-y-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          <Compass size={13} className="text-amber-500" />
          <span>Rappels de mise en place</span>
        </div>

        <div className="space-y-2 text-xs">
          {isDynastyMode && (
            <div className="flex items-start gap-2.5 bg-indigo-500/8 dark:bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20 animate-fade-in">
              <Trophy size={15} className="text-indigo-500 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-zinc-900 dark:text-white font-semibold">Tournoi Dynastie :</strong> Enchaînez 3 manches. Le total cumulé des 3 manches couronne le vainqueur final.
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 text-[11px] text-zinc-600 dark:text-zinc-300">
            <Layers size={14} className="text-amber-500 flex-shrink-0" />
            <span><strong className="text-zinc-900 dark:text-zinc-100">Pioche :</strong> {currentSetup?.description}</span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-zinc-600 dark:text-zinc-300">
            <Target size={14} className="text-emerald-500 flex-shrink-0" />
            <span><strong className="text-zinc-900 dark:text-zinc-100">Pose :</strong> Connexion obligatoire au château ou à un terrain identique.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
