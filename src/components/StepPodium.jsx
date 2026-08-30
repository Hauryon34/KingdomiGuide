import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Crown, RotateCcw } from 'lucide-react';
import MeepleIcon from './MeepleIcon';
import { MEEPLES } from '../types/kingdomino';
import { calculateKingdomScore, comparePlayers } from '../utils/scoreCalculator';

export default function StepPodium({
  selectedMeeples,
  playerNames,
  playerGrids,
  bonuses,
  onResetGame
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
  const second = rankedPlayers[1];
  const third = rankedPlayers[2];
  const fourth = rankedPlayers[3];

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
    <div className="space-y-6 max-w-sm sm:max-w-md mx-auto px-1 animate-fade-in text-center pb-4">
      {/* Trophy & Winner Header */}
      <div className="space-y-2 pt-1">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-xl shadow-amber-500/30">
          <Trophy size={36} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-medieval text-amber-200">
          Victoire Royale !
        </h2>
        <p className="text-sm text-slate-300">
          <strong className="text-amber-300 font-bold">{winner?.name}</strong> remporte la partie !
        </p>
      </div>

      {/* Olympic-style 3D Visual Podium (Marches 2 - 1 - 3) */}
      <div className="pt-4 pb-2">
        <div className="flex items-end justify-center gap-2 sm:gap-3 px-2 min-h-[220px]">
          {/* Marche #2 (Argent) - Gauche */}
          {second && (
            <div className="flex-1 flex flex-col items-center">
              {/* Meeple + Couronnes badge */}
              <div className="relative mb-2 flex flex-col items-center animate-bounce-short">
                <MeepleIcon color={second.color} size={42} showCrown={false} />
                <span className="text-[11px] font-bold text-slate-200 truncate max-w-[85px] mt-1">
                  {second.name}
                </span>
                <div className="flex items-center gap-0.5 bg-slate-900/90 border border-slate-700 px-1.5 py-0.2 rounded-full mt-0.5">
                  <Crown size={10} className="text-amber-300 fill-amber-400" />
                  <span className="text-[10px] font-black text-slate-300">{second.scoreData.totalCrowns}</span>
                </div>
              </div>

              {/* Marche Argent */}
              <div className="w-full h-28 rounded-t-2xl bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 border-2 border-slate-200 shadow-xl flex flex-col items-center justify-center p-2 text-slate-950">
                <span className="text-2xl font-black font-medieval">#2</span>
                <div className="text-sm font-extrabold font-mono mt-0.5">{second.scoreData.totalScore} pts</div>
              </div>
            </div>
          )}

          {/* Marche #1 (Or) - Centre (Plus haute) */}
          {winner && (
            <div className="flex-1 flex flex-col items-center">
              {/* Meeple Vainqueur + Couronne */}
              <div className="relative mb-2 flex flex-col items-center scale-105 animate-bounce-short">
                <div className="p-1 rounded-full bg-amber-400/20 ring-2 ring-amber-400/60">
                  <MeepleIcon color={winner.color} size={50} showCrown={true} />
                </div>
                <span className="text-xs font-black text-amber-200 truncate max-w-[95px] mt-1">
                  {winner.name}
                </span>
                <div className="flex items-center gap-0.5 bg-amber-950/90 border border-amber-400 px-2 py-0.5 rounded-full mt-0.5 shadow-sm">
                  <Crown size={11} className="text-amber-300 fill-amber-400" />
                  <span className="text-[10px] font-black text-amber-200">{winner.scoreData.totalCrowns}</span>
                </div>
              </div>

              {/* Marche Or */}
              <div className="w-full h-36 rounded-t-2xl bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 border-2 border-yellow-200 shadow-2xl flex flex-col items-center justify-center p-2 text-slate-950">
                <span className="text-3xl font-black font-medieval">#1</span>
                <div className="text-base font-black font-mono mt-0.5">{winner.scoreData.totalScore} pts</div>
              </div>
            </div>
          )}

          {/* Marche #3 (Bronze) - Droite */}
          {third && (
            <div className="flex-1 flex flex-col items-center">
              {/* Meeple + Couronnes badge */}
              <div className="relative mb-2 flex flex-col items-center animate-bounce-short">
                <MeepleIcon color={third.color} size={40} showCrown={false} />
                <span className="text-[11px] font-bold text-slate-200 truncate max-w-[85px] mt-1">
                  {third.name}
                </span>
                <div className="flex items-center gap-0.5 bg-slate-900/90 border border-slate-700 px-1.5 py-0.2 rounded-full mt-0.5">
                  <Crown size={10} className="text-amber-300 fill-amber-400" />
                  <span className="text-[10px] font-black text-slate-300">{third.scoreData.totalCrowns}</span>
                </div>
              </div>

              {/* Marche Bronze */}
              <div className="w-full h-22 rounded-t-2xl bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 border-2 border-amber-600 shadow-lg flex flex-col items-center justify-center p-2 text-amber-100">
                <span className="text-xl font-black font-medieval">#3</span>
                <div className="text-xs font-bold font-mono mt-0.5">{third.scoreData.totalScore} pts</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4ème Joueur en retrait (si 4 joueurs) */}
      {fourth && (
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center">
              #4
            </span>
            <MeepleIcon color={fourth.color} size={28} showCrown={false} />
            <span className="text-xs font-bold text-slate-200">
              {fourth.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Crown size={11} className="text-amber-300 fill-amber-400" />
              <span>{fourth.scoreData.totalCrowns}</span>
            </div>
            <span className="text-xs font-black font-mono text-slate-300">
              {fourth.scoreData.totalScore} pts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
