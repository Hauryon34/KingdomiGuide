import React, { useState, useEffect, useRef } from 'react';
import { MEEPLES } from '../types/kingdomino';
import MeepleIcon from './MeepleIcon';
import { Crown, ChevronRight, Dices, Sparkles } from 'lucide-react';
import { playDiceSound, playCrownSound } from '../utils/audioHaptics';

export default function StepTurnOrder({
  selectedMeeples,
  playerNames,
  playerCount,
  turnOrder,
  setTurnOrder
}) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const intervalRef = useRef(null);

  const activePlayers = selectedMeeples.map((meepleId, idx) => {
    const meeple = MEEPLES.find(m => m.id === meepleId) || MEEPLES[0];
    return {
      ...meeple,
      name: playerNames[meepleId] || meeple.label || `Joueur ${idx + 1}`
    };
  });

  const runShuffleAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsShuffling(true);
    playDiceSound();

    let counter = 0;
    intervalRef.current = setInterval(() => {
      setShuffleIndex(prev => (prev + 1) % Math.max(1, activePlayers.length));
      counter++;
      if (counter > 12) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        const shuffled = [...activePlayers].sort(() => Math.random() - 0.5);
        setTurnOrder(shuffled);
        setIsShuffling(false);
        playCrownSound();
      }
    }, 90);
  };

  useEffect(() => {
    if (!turnOrder || turnOrder.length !== selectedMeeples.length) {
      runShuffleAnimation();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const isTwoPlayers = playerCount === 2 && turnOrder.length === 2;
  const isFourPlayers = playerCount === 4 && turnOrder.length === 4;

  return (
    <div className="space-y-4 max-w-sm mx-auto px-1 animate-fade-in text-center">
      {/* Header Row */}
      <div className="flex items-center justify-between px-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold tracking-tight">
          <Crown size={12} className="fill-current" />
          <span>1er Tour</span>
        </div>

        <button
          type="button"
          disabled={isShuffling}
          onClick={runShuffleAnimation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-xs ${
            isShuffling ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Relancer le tirage au sort"
        >
          <Dices size={14} className={isShuffling ? 'animate-spin text-amber-500' : 'text-amber-500'} />
          <span>{isShuffling ? 'Tirage...' : 'Relancer'}</span>
        </button>
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-zinc-100">
          Ordre de Jeu
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {isShuffling ? 'Tirage aléatoire en cours...' : 'Ordre officiel de choix des dominos'}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-200/80 dark:border-zinc-800/80 shadow-card space-y-4 relative overflow-hidden">
        {isShuffling ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 animate-pulse">
            <div className="p-4 rounded-3xl bg-amber-500/10 ring-2 ring-amber-500/30 relative">
              <Sparkles size={20} className="text-amber-500 absolute -top-1.5 -right-1.5 animate-bounce" />
              <MeepleIcon
                color={activePlayers[shuffleIndex % Math.max(1, activePlayers.length)]?.color || '#0EA5E9'}
                size={50}
                showCrown={true}
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100 block">
                Mélange des joueurs...
              </span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 block">
                Attribution aléatoire
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {isFourPlayers ? (
              <div className="grid grid-cols-2 gap-2.5">
                {turnOrder.map((player, idx) => (
                  <div
                    key={player.id}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      idx === 0
                        ? 'bg-amber-500/8 dark:bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                        : 'bg-zinc-50/80 dark:bg-zinc-950/50 border-zinc-200/70 dark:border-zinc-800/80'
                    }`}
                  >
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      idx === 0
                        ? 'bg-amber-500 text-zinc-950'
                        : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {idx === 0 ? '1er • Roi' : `${idx + 1}e`}
                    </span>
                    <MeepleIcon color={player.color} size={38} showCrown={idx === 0} />
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-full">
                      {player.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {turnOrder.map((player, idx) => (
                  <React.Fragment key={player.id}>
                    <div
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 min-w-[82px] transition-all ${
                        idx === 0
                          ? 'bg-amber-500/8 dark:bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30 shadow-xs'
                          : 'bg-zinc-50/80 dark:bg-zinc-950/50 border-zinc-200/70 dark:border-zinc-800/80'
                      }`}
                    >
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        idx === 0
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {idx === 0 ? '1er' : `${idx + 1}e`}
                      </span>
                      <MeepleIcon color={player.color} size={36} showCrown={idx === 0} />
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[72px]">
                        {player.name}
                      </span>
                    </div>

                    {idx < turnOrder.length - 1 && (
                      <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2-Players Sequence Timeline */}
        {!isShuffling && isTwoPlayers && (
          <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2.5 text-left animate-fade-in">
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 text-center">
              Placement des 4 pions (2 par joueur)
            </p>

            <div className="grid grid-cols-4 gap-1.5 text-center">
              {[turnOrder[0], turnOrder[1], turnOrder[1], turnOrder[0]].map((p, i) => (
                <div
                  key={i}
                  className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 flex flex-col items-center gap-1"
                >
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                    #{i + 1}
                  </span>
                  <MeepleIcon color={p?.color || '#0EA5E9'} size={20} showCrown={false} />
                  <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-200 truncate max-w-full">
                    {p?.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
