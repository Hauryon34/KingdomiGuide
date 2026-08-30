import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Crown } from 'lucide-react';
import MeepleIcon from './MeepleIcon';
import { MEEPLES } from '../types/kingdomino';
import { calculateKingdomScore, comparePlayers, computeGameHonors } from '../utils/scoreCalculator';
import { playFanfareSound } from '../utils/audioHaptics';

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
  const second = rankedPlayers[1];
  const third = rankedPlayers[2];
  const fourth = rankedPlayers[3];

  const honorsMap = computeGameHonors(rankedPlayers);
  const hasAnyHonors = Object.keys(honorsMap).length > 0;

  useEffect(() => {
    playFanfareSound();

    const end = Date.now() + 2.5 * 1000;
    const colors = ['#EAB308', '#38BDF8', '#4ADE80', '#FB7185'];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 6,
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
    <div className="space-y-3.5 max-w-sm sm:max-w-md mx-auto px-1 animate-fade-in text-center pb-1">
      {/* Trophy & Winner Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30">
          <Trophy size={26} />
        </div>
        <h2 className="text-xl sm:text-2xl font-black font-medieval text-amber-200">
          Victoire Royale !
        </h2>
        <p className="text-xs text-slate-300">
          <strong className="text-amber-300 font-bold">{winner?.name}</strong> remporte la partie !
        </p>
      </div>

      {/* Olympic-style 3D Visual Podium (Marches fixes et immuables) */}
      <div className="pt-1 pb-0.5">
        {/* Ligne des 3 Marches strictement alignées par le bas */}
        <div className="flex items-end justify-center gap-2 sm:gap-2.5 px-1">
          {/* Marche #2 (Argent) - Gauche */}
          {second && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-1.5 flex flex-col items-center">
                <MeepleIcon color={second.color} size={36} showCrown={false} />
                <span className="text-[10px] font-bold text-slate-200 truncate max-w-[75px] mt-0.5">
                  {second.name}
                </span>
                <div className="flex items-center gap-0.5 bg-slate-900/90 border border-slate-700 px-1.5 py-0.2 rounded-full mt-0.5">
                  <Crown size={9} className="text-amber-300 fill-amber-400" />
                  <span className="text-[9px] font-black text-slate-300">{second.scoreData.totalCrowns}</span>
                </div>
              </div>

              {/* Marche Argent */}
              <div className="w-full h-24 rounded-t-2xl bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 border-2 border-slate-200 shadow-xl flex flex-col items-center justify-center p-1.5 text-slate-950 flex-shrink-0">
                <span className="text-xl font-black font-medieval block leading-none">#2</span>
                <div className="text-xs font-extrabold font-mono mt-0.5">
                  {second.scoreData.totalScore} {second.scoreData.totalScore > 1 ? 'pts' : 'pt'}
                </div>
              </div>
            </div>
          )}

          {/* Marche #1 (Or) - Centre */}
          {winner && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-1.5 flex flex-col items-center scale-105">
                <div className="p-0.5 rounded-full bg-amber-400/20 ring-2 ring-amber-400/60">
                  <MeepleIcon color={winner.color} size={42} showCrown={true} />
                </div>
                <span className="text-[11px] font-black text-amber-200 truncate max-w-[85px] mt-0.5">
                  {winner.name}
                </span>
                <div className="flex items-center gap-0.5 bg-amber-950/90 border border-amber-400 px-1.5 py-0.5 rounded-full mt-0.5 shadow-sm">
                  <Crown size={10} className="text-amber-300 fill-amber-400" />
                  <span className="text-[9px] font-black text-amber-200">{winner.scoreData.totalCrowns}</span>
                </div>
              </div>

              {/* Marche Or */}
              <div className="w-full h-32 rounded-t-2xl bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 border-2 border-yellow-200 shadow-2xl flex flex-col items-center justify-center p-1.5 text-slate-950 flex-shrink-0">
                <span className="text-2xl font-black font-medieval block leading-none">#1</span>
                <div className="text-sm font-black font-mono mt-0.5">
                  {winner.scoreData.totalScore} {winner.scoreData.totalScore > 1 ? 'pts' : 'pt'}
                </div>
              </div>
            </div>
          )}

          {/* Marche #3 (Bronze) - Droite */}
          {third && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-1.5 flex flex-col items-center">
                <MeepleIcon color={third.color} size={34} showCrown={false} />
                <span className="text-[10px] font-bold text-slate-200 truncate max-w-[75px] mt-0.5">
                  {third.name}
                </span>
                <div className="flex items-center gap-0.5 bg-slate-900/90 border border-slate-700 px-1.5 py-0.2 rounded-full mt-0.5">
                  <Crown size={9} className="text-amber-300 fill-amber-400" />
                  <span className="text-[9px] font-black text-slate-300">{third.scoreData.totalCrowns}</span>
                </div>
              </div>

              {/* Marche Bronze */}
              <div className="w-full h-18 rounded-t-2xl bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 border-2 border-amber-600 shadow-lg flex flex-col items-center justify-center p-1.5 text-amber-100 flex-shrink-0">
                <span className="text-lg font-black font-medieval block leading-none">#3</span>
                <div className="text-[11px] font-bold font-mono mt-0.5">
                  {third.scoreData.totalScore} {third.scoreData.totalScore > 1 ? 'pts' : 'pt'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ligne des Titres honorifiques placée PROPREMENT sous la ligne du podium */}
        {hasAnyHonors && (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 px-1 pt-2">
            {/* Titres du 2ème joueur */}
            <div className="flex flex-col items-center gap-1">
              {second && honorsMap[second.id]?.map((h, i) => (
                <div key={i} className="w-full text-[8.5px] font-black bg-slate-900/90 text-amber-300 px-1 py-0.5 rounded-lg border border-slate-800 shadow-sm truncate" title={h.desc}>
                  {h.icon} {h.title}
                </div>
              ))}
            </div>

            {/* Titres du Vainqueur */}
            <div className="flex flex-col items-center gap-1">
              {winner && honorsMap[winner.id]?.map((h, i) => (
                <div key={i} className="w-full text-[8.5px] font-black bg-amber-500/15 text-amber-200 px-1 py-0.5 rounded-lg border border-amber-500/30 shadow-sm truncate" title={h.desc}>
                  {h.icon} {h.title}
                </div>
              ))}
            </div>

            {/* Titres du 3ème joueur */}
            <div className="flex flex-col items-center gap-1">
              {third && honorsMap[third.id]?.map((h, i) => (
                <div key={i} className="w-full text-[8.5px] font-black bg-slate-900/90 text-amber-300 px-1 py-0.5 rounded-lg border border-slate-800 shadow-sm truncate" title={h.desc}>
                  {h.icon} {h.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4ème Joueur en retrait (Titres dans la continuité inférieure de sa carte) */}
      {fourth && (
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-left shadow-sm">
          {/* Ligne principale du 4ème */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                #4
              </span>
              <MeepleIcon color={fourth.color} size={24} showCrown={false} />
              <span className="text-xs font-bold text-slate-200">
                {fourth.name}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Crown size={10} className="text-amber-300 fill-amber-400" />
                <span>{fourth.scoreData.totalCrowns}</span>
              </div>
              <span className="text-xs font-black font-mono text-slate-300">
                {fourth.scoreData.totalScore} {fourth.scoreData.totalScore > 1 ? 'pts' : 'pt'}
              </span>
            </div>
          </div>

          {/* Titres dans la continuité inférieure de la carte */}
          {honorsMap[fourth.id]?.length > 0 && (
            <div className="pt-1.5 border-t border-slate-800/80 flex items-center gap-1 flex-wrap">
              {honorsMap[fourth.id].map((h, i) => (
                <span key={i} className="text-[8.5px] font-bold text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                  <span>{h.icon}</span>
                  <span>{h.title} ({h.desc})</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
