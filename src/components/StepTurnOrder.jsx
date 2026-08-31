import React, { useEffect } from 'react';
import { MEEPLES } from '../types/kingdomino';
import MeepleIcon from './MeepleIcon';
import { Crown, ChevronRight, Dices } from 'lucide-react';
import { playDiceSound } from '../utils/audioHaptics';

export default function StepTurnOrder({
  selectedMeeples,
  playerNames,
  playerCount,
  turnOrder,
  setTurnOrder
}) {
  const activePlayers = selectedMeeples.map((meepleId, idx) => {
    const meeple = MEEPLES.find(m => m.id === meepleId) || MEEPLES[0];
    return {
      ...meeple,
      name: playerNames[meepleId] || meeple.label || `Joueur ${idx + 1}`
    };
  });

  const shuffleOrder = () => {
    playDiceSound();
    const shuffled = [...activePlayers].sort(() => Math.random() - 0.5);
    setTurnOrder(shuffled);
  };

  useEffect(() => {
    if (!turnOrder || turnOrder.length !== selectedMeeples.length) {
      const shuffled = [...activePlayers].sort(() => Math.random() - 0.5);
      setTurnOrder(shuffled);
    }
  }, []);

  const isTwoPlayers = playerCount === 2 && turnOrder.length === 2;
  const isFourPlayers = playerCount === 4 && turnOrder.length === 4;

  return (
    <div className="space-y-3 max-w-sm mx-auto px-1 animate-fade-in text-center">
      {/* Title Section & Reshuffle Button */}
      <div className="flex items-center justify-between px-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-500/30">
          <Crown size={13} className="fill-amber-400" />
          Ordre du 1er Tour
        </div>

        <button
          type="button"
          onClick={shuffleOrder}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold text-amber-300 hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
          title="Relancer le tirage au sort"
        >
          <Dices size={13} />
          <span>Relancer</span>
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-black font-medieval text-amber-200">
          Tirage au Sort
        </h2>
      </div>

      {/* Main Draw Results Box */}
      <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 shadow-lg space-y-3">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Ordre de jeu des Rois
          </p>

          {/* 4 Players Layout: 2x2 Grid */}
          {isFourPlayers ? (
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {turnOrder.map((player, idx) => (
                <div
                  key={player.id}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    idx === 0
                      ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/60 shadow-md scale-102'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                    idx === 0 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                  }`}>
                    #{idx + 1} {idx === 0 ? '👑' : ''}
                  </span>
                  <MeepleIcon color={player.color} size={36} showCrown={idx === 0} />
                  <span className="text-xs font-bold text-slate-100 truncate max-w-full">
                    {player.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* 2 to 3 Players Layout: 1 Row with Arrows */
            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-0.5">
              {turnOrder.map((player, idx) => (
                <React.Fragment key={player.id}>
                  <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 min-w-[70px] transition-all ${
                    idx === 0
                      ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/60 shadow-md scale-105'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                  >
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                      idx === 0 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                    }`}>
                      #{idx + 1} {idx === 0 ? '👑' : ''}
                    </span>
                    <MeepleIcon color={player.color} size={32} showCrown={idx === 0} />
                    <span className="text-xs font-bold text-slate-100 truncate max-w-[65px]">
                      {player.name}
                    </span>
                  </div>

                  {idx < turnOrder.length - 1 && (
                    <ChevronRight size={16} className="text-amber-400/70 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* 2-Players Special Sequence Flow */}
        {isTwoPlayers && (
          <div className="pt-2.5 border-t border-slate-800/90 space-y-1.5 text-left">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wide text-center">
              Séquence des 4 choix (2 meeples / joueur)
            </p>

            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center gap-0.5">
                <span className="text-[8px] font-bold text-slate-400">1er Choix</span>
                <MeepleIcon color={turnOrder[0]?.color || '#0284c7'} size={18} showCrown={false} />
                <span className="text-[9px] font-bold text-slate-200 truncate max-w-full">{turnOrder[0]?.name}</span>
              </div>

              <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center gap-0.5">
                <span className="text-[8px] font-bold text-slate-400">2e Choix</span>
                <MeepleIcon color={turnOrder[1]?.color || '#16a34a'} size={18} showCrown={false} />
                <span className="text-[9px] font-bold text-slate-200 truncate max-w-full">{turnOrder[1]?.name}</span>
              </div>

              <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center gap-0.5">
                <span className="text-[8px] font-bold text-slate-400">3e Choix</span>
                <MeepleIcon color={turnOrder[1]?.color || '#16a34a'} size={18} showCrown={false} />
                <span className="text-[9px] font-bold text-slate-200 truncate max-w-full">{turnOrder[1]?.name}</span>
              </div>

              <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center gap-0.5">
                <span className="text-[8px] font-bold text-slate-400">4e Choix</span>
                <MeepleIcon color={turnOrder[0]?.color || '#0284c7'} size={18} showCrown={false} />
                <span className="text-[9px] font-bold text-slate-200 truncate max-w-full">{turnOrder[0]?.name}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
