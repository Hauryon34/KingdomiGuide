import React, { useState, useEffect } from 'react';
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

  const activePlayers = selectedMeeples.map((meepleId, idx) => {
    const meeple = MEEPLES.find(m => m.id === meepleId) || MEEPLES[0];
    return {
      ...meeple,
      name: playerNames[meepleId] || meeple.label || `Joueur ${idx + 1}`
    };
  });

  const runShuffleAnimation = () => {
    setIsShuffling(true);
    playDiceSound();

    let counter = 0;
    const interval = setInterval(() => {
      setShuffleIndex(prev => (prev + 1) % activePlayers.length);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
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
  }, []);

  const isTwoPlayers = playerCount === 2 && turnOrder.length === 2;
  const isFourPlayers = playerCount === 4 && turnOrder.length === 4;

  return (
    <div className="space-y-4 max-w-sm mx-auto px-1 animate-fade-in text-center my-auto">
      {/* Title Section & Reshuffle Button */}
      <div className="flex items-center justify-between px-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-500/30">
          <Crown size={13} className="fill-amber-400" />
          Ordre du 1er Tour
        </div>

        <button
          type="button"
          disabled={isShuffling}
          onClick={runShuffleAnimation}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-300 hover:bg-slate-800 active:scale-95 transition-all shadow-sm ${
            isShuffling ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Relancer le tirage au sort"
        >
          <Dices size={14} className={isShuffling ? 'animate-spin' : ''} />
          <span>{isShuffling ? 'Tirage...' : 'Relancer'}</span>
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-black font-medieval text-amber-200">
          Tirage au Sort
        </h2>
        <p className="text-[11px] text-slate-400">
          {isShuffling ? 'Mélange des Rois en cours...' : 'Voici l’ordre de choix des dominos pour la manche'}
        </p>
      </div>

      {/* Main Draw Results Box */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
        {/* Shuffling Loading State */}
        {isShuffling ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 animate-pulse">
            <div className="p-4 rounded-3xl bg-amber-500/20 ring-4 ring-amber-400/50 shadow-2xl relative">
              <Sparkles size={24} className="text-amber-300 absolute -top-2 -right-2 animate-bounce" />
              <MeepleIcon
                color={activePlayers[shuffleIndex % activePlayers.length].color}
                size={52}
                showCrown={true}
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-sm font-black font-medieval text-amber-300 block">
                Mélange des Rois...
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                Attribution aléatoire
              </span>
            </div>
          </div>
        ) : (
          /* Final Results State */
          <div className="space-y-3 animate-fade-in">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Ordre de jeu des Rois
            </p>

            {/* 4 Players Layout: 2x2 Grid */}
            {isFourPlayers ? (
              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                {turnOrder.map((player, idx) => (
                  <div
                    key={player.id}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      idx === 0
                        ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/60 shadow-lg scale-102'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      idx === 0 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                    }`}>
                      #{idx + 1} {idx === 0 ? '👑' : ''}
                    </span>
                    <MeepleIcon color={player.color} size={40} showCrown={idx === 0} />
                    <span className="text-xs font-bold text-slate-100 truncate max-w-full">
                      {player.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              /* 2 to 3 Players Layout: 1 Row with Arrows */
              <div className="flex items-center justify-center gap-2 flex-wrap pt-0.5">
                {turnOrder.map((player, idx) => (
                  <React.Fragment key={player.id}>
                    <div className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 min-w-[76px] transition-all ${
                      idx === 0
                        ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/60 shadow-lg scale-105'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                    >
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        idx === 0 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                      }`}>
                        #{idx + 1} {idx === 0 ? '👑' : ''}
                      </span>
                      <MeepleIcon color={player.color} size={36} showCrown={idx === 0} />
                      <span className="text-xs font-bold text-slate-100 truncate max-w-[70px]">
                        {player.name}
                      </span>
                    </div>

                    {idx < turnOrder.length - 1 && (
                      <ChevronRight size={18} className="text-amber-400/70 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2-Players Special Sequence Flow */}
        {!isShuffling && isTwoPlayers && (
          <div className="pt-3 border-t border-slate-800/90 space-y-2 text-left animate-fade-in">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wide text-center">
              Séquence des 4 choix (2 meeples / joueur)
            </p>

            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center gap-0.5">
                <span className="text-[8.5px] font-bold text-slate-400">1er Choix</span>
                <MeepleIcon color={turnOrder[0]?.color || '#0284c7'} size={20} showCrown={false} />
                <span className="text-[9.5px] font-bold text-slate-200 truncate max-w-full">{turnOrder[0]?.name}</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center gap-0.5">
                <span className="text-[8.5px] font-bold text-slate-400">2e Choix</span>
                <MeepleIcon color={turnOrder[1]?.color || '#16a34a'} size={20} showCrown={false} />
                <span className="text-[9.5px] font-bold text-slate-200 truncate max-w-full">{turnOrder[1]?.name}</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center gap-0.5">
                <span className="text-[8.5px] font-bold text-slate-400">3e Choix</span>
                <MeepleIcon color={turnOrder[1]?.color || '#16a34a'} size={20} showCrown={false} />
                <span className="text-[9.5px] font-bold text-slate-200 truncate max-w-full">{turnOrder[1]?.name}</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center gap-0.5">
                <span className="text-[8.5px] font-bold text-slate-400">4e Choix</span>
                <MeepleIcon color={turnOrder[0]?.color || '#0284c7'} size={20} showCrown={false} />
                <span className="text-[9.5px] font-bold text-slate-200 truncate max-w-full">{turnOrder[0]?.name}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
