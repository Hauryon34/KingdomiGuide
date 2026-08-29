import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import MeepleIcon from './MeepleIcon';
import { MEEPLES } from '../types/kingdomino';
import { calculateKingdomScore, comparePlayers } from '../utils/scoreCalculator';

export default function StepPodium({
  selectedMeeples,
  playerNames,
  playerGrids,
  bonuses
}) {
  const activePlayers = selectedMeeples.map((meepleId, index) => {
    const meeple = MEEPLES.find(m => m.id === meepleId) || MEEPLES[index];
    const grid = playerGrids[meepleId];
    const scoreData = calculateKingdomScore(grid, {
      middleEmpireBonus: bonuses.middleEmpire,
      harmonyBonus: bonuses.harmony
    });

    return {
      ...meeple,
      name: playerNames[meepleId] || meeple.label || `Joueur ${index + 1}`,
      scoreData
    };
  });

  const rankedPlayers = [...activePlayers].sort(comparePlayers);
  const winner = rankedPlayers[0];

  useEffect(() => {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#EAB308', '#38BDF8', '#4ADE80', '#FB7185'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="space-y-4 max-w-sm mx-auto px-1 animate-fade-in text-center">
      {/* Trophy Header */}
      <div className="space-y-1.5 pt-1">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-xl shadow-amber-500/30">
          <Trophy size={32} />
        </div>
        <h2 className="text-xl sm:text-2xl font-black font-medieval text-amber-200">
          Victoire Royale !
        </h2>
        <p className="text-xs text-slate-300">
          Félicitations à <strong className="text-amber-300">{winner?.name}</strong> pour son royaume !
        </p>
      </div>

      {/* Podium Cards List */}
      <div className="space-y-2">
        {rankedPlayers.map((player, index) => {
          const isFirst = index === 0;
          const isSecond = index === 1;
          const isThird = index === 2;

          return (
            <div
              key={player.id}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                isFirst
                  ? 'bg-gradient-to-r from-amber-500/25 via-yellow-500/10 to-slate-900 border-amber-400 shadow-xl ring-2 ring-amber-400/50 scale-102'
                  : isSecond
                  ? 'bg-slate-900/90 border-slate-700 shadow-md'
                  : isThird
                  ? 'bg-slate-900/70 border-slate-800 shadow'
                  : 'bg-slate-950/60 border-slate-900 opacity-70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Rank Badge */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shadow ${
                    isFirst
                      ? 'bg-amber-400 text-slate-950 ring-1 ring-yellow-300'
                      : isSecond
                      ? 'bg-slate-300 text-slate-900'
                      : isThird
                      ? 'bg-amber-800 text-amber-100'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{index + 1}
                </div>

                {/* Meeple & Name */}
                <div className="flex items-center gap-2 text-left">
                  <MeepleIcon color={player.color} size={30} showCrown={isFirst} />
                  <div>
                    <div className="font-bold text-xs text-slate-100 flex items-center gap-1">
                      {player.name}
                      {isFirst && (
                        <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                          Vainqueur
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>Max : <strong className="text-slate-300">{player.scoreData.maxDomainSize} cases</strong></span>
                      <span>•</span>
                      <span><strong className="text-amber-300">{player.scoreData.totalCrowns} 👑</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-xl font-black font-medieval text-amber-300 leading-none">
                  {player.scoreData.totalScore}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                  pts
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tie-breaker info */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 text-left">
        💡 <strong className="text-slate-300">Règle officielle de départage :</strong> En cas d'égalité, le joueur ayant le <strong className="text-slate-300">plus grand domaine</strong> l'emporte. En cas de nouvelle égalité, le <strong className="text-slate-300">total de couronnes</strong> fait la différence.
      </div>
    </div>
  );
}
