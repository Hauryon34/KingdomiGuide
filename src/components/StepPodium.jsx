import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Crown } from 'lucide-react';
import MeepleIcon from './MeepleIcon';
import { MEEPLES } from '../types/kingdomino';
import { calculateKingdomScore, comparePlayers, arePlayersTied, computeGameHonors } from '../utils/scoreCalculator';
import { playFanfareSound } from '../utils/audioHaptics';

export default function StepPodium({
  selectedMeeples,
  playerNames,
  playerGrids,
  bonuses,
  isDynastyMode,
  dynastyRound = 1,
  dynastyHistory = []
}) {
  const isDynastyFinished = isDynastyMode && dynastyRound >= 3;

  const activePlayers = selectedMeeples.map((meepleId, index) => {
    const meeple = MEEPLES.find(m => m.id === meepleId) || MEEPLES[index];
    const grid = playerGrids[meepleId];
    const scoreData = calculateKingdomScore(grid, {
      middleEmpireBonus: bonuses.middleEmpire,
      harmonyBonus: bonuses.harmony
    });

    // Calcul cumulé si Dynasty (score et couronnes)
    let cumulativeScore = scoreData.totalScore;
    let cumulativeCrowns = scoreData.totalCrowns;
    dynastyHistory.forEach(h => {
      cumulativeScore += (h.scores?.[meepleId] || 0);
      cumulativeCrowns += (h.crowns?.[meepleId] || 0);
    });

    return {
      ...meeple,
      name: playerNames[meepleId] || meeple.label || `Joueur ${index + 1}`,
      scoreData,
      cumulativeScore,
      cumulativeCrowns
    };
  });

  // Tri par score de la manche (ou cumulé si fin de dynastie)
  const rankedPlayers = [...activePlayers].sort((a, b) => comparePlayers(a, b, isDynastyFinished));

  // Calcul des rangs avec gestion des ex-aequo officiels
  const ranks = [];
  rankedPlayers.forEach((player, idx) => {
    if (idx === 0) {
      ranks.push(1);
    } else if (arePlayersTied(player, rankedPlayers[idx - 1], isDynastyFinished)) {
      ranks.push(ranks[idx - 1]);
    } else {
      ranks.push(idx + 1);
    }
  });

  const winner = rankedPlayers[0];
  const second = rankedPlayers[1];
  const third = rankedPlayers[2];
  const fourth = rankedPlayers[3];

  const coWinners = rankedPlayers.filter((_, idx) => ranks[idx] === 1);
  const isTieAtTop = coWinners.length > 1;

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

  const getDisplayedCrowns = (player) => (
    isDynastyFinished ? player.cumulativeCrowns : player.scoreData.totalCrowns
  );

  const getDisplayedScore = (player) => (
    isDynastyFinished ? player.cumulativeScore : player.scoreData.totalScore
  );

  return (
    <div className="space-y-3.5 max-w-sm sm:max-w-md mx-auto px-1 animate-fade-in text-center pb-1">
      {/* Trophy & Winner Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30">
          <Trophy size={26} />
        </div>
        <h2 className="text-xl sm:text-2xl font-black font-medieval text-slate-900 dark:text-amber-200">
          {isDynastyFinished ? 'Couronnement Impérial !' : (isDynastyMode ? `Manche ${dynastyRound} sur 3` : 'Victoire Royale !')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          {isTieAtTop ? (
            <>
              <strong className="text-amber-600 dark:text-amber-300 font-bold">
                {coWinners.map(p => p.name).join(' & ')}
              </strong>{' '}
              partagent la victoire ex-æquo !
            </>
          ) : (
            <>
              <strong className="text-amber-600 dark:text-amber-300 font-bold">{winner?.name}</strong>{' '}
              {isDynastyFinished ? 'remporte la Dynastie !' : 'remporte la manche !'}
            </>
          )}
        </p>
      </div>

      {/* Olympic-style 3D Visual Podium */}
      <div className="pt-1 pb-0.5">
        <div className="flex items-end justify-center gap-2 sm:gap-2.5 px-1">
          {/* Marche #2 (Argent ou Or ex-aequo) */}
          {second && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-1.5 flex flex-col items-center">
                <MeepleIcon color={second.color} size={36} showCrown={ranks[1] === 1} />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[75px] mt-0.5">
                  {second.name}
                </span>
                <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 rounded-full mt-0.5 shadow-sm">
                  <Crown size={9} className="text-amber-500 dark:text-amber-300 fill-amber-400" />
                  <span className="text-[9px] font-black text-slate-700 dark:text-slate-300">{getDisplayedCrowns(second)}</span>
                </div>
              </div>

              <div className="w-full h-24 rounded-t-2xl bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 dark:from-slate-300 dark:via-slate-400 dark:to-slate-500 border-2 border-slate-100 dark:border-slate-200 shadow-xl flex flex-col items-center justify-center p-1.5 text-slate-950 flex-shrink-0">
                <span className="text-xl font-black font-medieval block leading-none">#{ranks[1]}</span>
                <div className="text-xs font-extrabold font-mono mt-0.5">
                  {getDisplayedScore(second)} pts
                </div>
              </div>
            </div>
          )}

          {/* Marche #1 (Or) */}
          {winner && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-1.5 flex flex-col items-center scale-105">
                <div className="p-0.5 rounded-full bg-amber-400/20 ring-2 ring-amber-400/60">
                  <MeepleIcon color={winner.color} size={42} showCrown={true} />
                </div>
                <span className="text-xs font-black text-amber-700 dark:text-amber-200 truncate max-w-[85px] mt-0.5">
                  {winner.name}
                </span>
                <div className="flex items-center gap-0.5 bg-amber-950/90 border border-amber-400 px-1.5 py-0.5 rounded-full mt-0.5 shadow-sm">
                  <Crown size={10} className="text-amber-300 fill-amber-400" />
                  <span className="text-[9px] font-black text-amber-200">{getDisplayedCrowns(winner)}</span>
                </div>
              </div>

              <div className="w-full h-32 rounded-t-2xl bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 border-2 border-yellow-200 shadow-2xl flex flex-col items-center justify-center p-1.5 text-slate-950 flex-shrink-0">
                <span className="text-2xl font-black font-medieval block leading-none">#{ranks[0]}</span>
                <div className="text-sm font-black font-mono mt-0.5">
                  {getDisplayedScore(winner)} pts
                </div>
              </div>
            </div>
          )}

          {/* Marche #3 (Bronze) */}
          {third && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-1.5 flex flex-col items-center">
                <MeepleIcon color={third.color} size={34} showCrown={ranks[2] === 1} />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[75px] mt-0.5">
                  {third.name}
                </span>
                <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 rounded-full mt-0.5 shadow-sm">
                  <Crown size={9} className="text-amber-500 dark:text-amber-300 fill-amber-400" />
                  <span className="text-[9px] font-black text-slate-700 dark:text-slate-300">{getDisplayedCrowns(third)}</span>
                </div>
              </div>

              <div className="w-full h-20 rounded-t-2xl bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 dark:from-amber-700 dark:via-amber-800 dark:to-amber-900 border-2 border-amber-500 dark:border-amber-600 shadow-lg flex flex-col items-center justify-center p-1.5 text-amber-50 flex-shrink-0">
                <span className="text-lg font-black font-medieval block leading-none">#{ranks[2]}</span>
                <div className="text-[11px] font-bold font-mono mt-0.5">
                  {getDisplayedScore(third)} pts
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ligne des Titres honorifiques */}
        {hasAnyHonors && (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 px-1 pt-2">
            <div className="flex flex-col items-center gap-1">
              {second && honorsMap[second.id]?.map((h, i) => (
                <div key={i} className="w-full text-[9px] font-black bg-white dark:bg-slate-900/90 text-amber-700 dark:text-amber-300 px-1 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm truncate" title={h.desc}>
                  {h.icon} {h.title}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-1">
              {winner && honorsMap[winner.id]?.map((h, i) => (
                <div key={i} className="w-full text-[9px] font-black bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-200 px-1 py-0.5 rounded-lg border border-amber-300 dark:border-amber-500/30 shadow-sm truncate" title={h.desc}>
                  {h.icon} {h.title}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-1">
              {third && honorsMap[third.id]?.map((h, i) => (
                <div key={i} className="w-full text-[9px] font-black bg-white dark:bg-slate-900/90 text-amber-700 dark:text-amber-300 px-1 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm truncate" title={h.desc}>
                  {h.icon} {h.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4ème Joueur en retrait */}
      {fourth && (
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5 text-left shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                #{ranks[3]}
              </span>
              <MeepleIcon color={fourth.color} size={24} showCrown={false} />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {fourth.name}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <Crown size={10} className="text-amber-500 dark:text-amber-300 fill-amber-400" />
                <span>{getDisplayedCrowns(fourth)}</span>
              </div>
              <span className="text-xs font-black font-mono text-slate-700 dark:text-slate-300">
                {getDisplayedScore(fourth)} pts
              </span>
            </div>
          </div>

          {honorsMap[fourth.id]?.length > 0 && (
            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-1 flex-wrap">
              {honorsMap[fourth.id].map((h, i) => (
                <span key={i} className="text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-amber-200 dark:border-slate-800 flex items-center gap-1">
                  <span>{h.icon}</span>
                  <span>{h.title} ({h.desc})</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tableau récapitulatif du Tournoi Dynastie (3 manches) */}
      {isDynastyMode && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-3 border border-indigo-300 dark:border-indigo-500/30 text-left space-y-2 shadow-sm dark:shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">
            <span>👑 Tournoi Dynastie (Manche {dynastyRound}/3)</span>
          </div>

          <div className="space-y-1 text-xs">
            {rankedPlayers.map((p) => {
              const r1 = dynastyHistory[0]?.scores?.[p.id] ?? (dynastyRound === 1 ? p.scoreData.totalScore : '-');
              const r2 = dynastyHistory[1]?.scores?.[p.id] ?? (dynastyRound === 2 ? p.scoreData.totalScore : '-');
              const r3 = dynastyHistory[2]?.scores?.[p.id] ?? (dynastyRound === 3 ? p.scoreData.totalScore : '-');

              return (
                <div key={p.id} className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <MeepleIcon color={p.color} size={18} showCrown={false} />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    <span>M1: <strong className="text-slate-800 dark:text-slate-200">{r1}</strong></span>
                    <span>M2: <strong className="text-slate-800 dark:text-slate-200">{r2}</strong></span>
                    <span>M3: <strong className="text-slate-800 dark:text-slate-200">{r3}</strong></span>
                    <span className="text-amber-600 dark:text-amber-300 font-bold ml-1">= {p.cumulativeScore} pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
