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

  const rankedPlayers = [...activePlayers].sort((a, b) => comparePlayers(a, b, isDynastyFinished));

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

    const end = Date.now() + 2.2 * 1000;
    const colors = ['#F59E0B', '#0EA5E9', '#10B981', '#F43F5E'];

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

  const getDisplayedCrowns = (player) => (
    isDynastyFinished ? player.cumulativeCrowns : player.scoreData.totalCrowns
  );

  const getDisplayedScore = (player) => (
    isDynastyFinished ? player.cumulativeScore : player.scoreData.totalScore
  );

  return (
    <div className="space-y-4 max-w-sm sm:max-w-md mx-auto px-1 animate-fade-in text-center pb-1">
      {/* Winner Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/25">
          <Trophy size={22} />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-zinc-100">
          {isDynastyFinished ? 'Classement Final' : (isDynastyMode ? `Manche ${dynastyRound} sur 3` : 'Résultats de la Partie')}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {isTieAtTop ? (
            <>
              <strong className="text-zinc-900 dark:text-white font-bold">
                {coWinners.map(p => p.name).join(' & ')}
              </strong>{' '}
              partagent la première place ex-æquo
            </>
          ) : (
            <>
              <strong className="text-zinc-900 dark:text-white font-bold">{winner?.name}</strong>{' '}
              {isDynastyFinished ? 'remporte la Dynastie' : 'remporte la victoire'}
            </>
          )}
        </p>
      </div>

      {/* Modern Bento Podium */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200/80 dark:border-zinc-800/80 shadow-card space-y-3">
        <div className="flex items-end justify-center gap-2.5 pt-2">
          {/* Marche #2 */}
          {second && (
            <div className="flex-1 flex flex-col items-center">
              <div className="mb-2 flex flex-col items-center">
                <MeepleIcon color={second.color} size={34} showCrown={ranks[1] === 1} />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[76px] mt-1">
                  {second.name}
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 flex items-center gap-0.5">
                  {getDisplayedCrowns(second)} <Crown size={9} className="text-amber-500 fill-amber-400" />
                </span>
              </div>

              <div className="w-full h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-700 flex flex-col items-center justify-center p-2 text-zinc-900 dark:text-zinc-100">
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-400">#{ranks[1]}</span>
                <div className="text-sm font-extrabold font-display tabular-nums mt-0.5">
                  {getDisplayedScore(second)} <span className="text-[10px] font-normal">pts</span>
                </div>
              </div>
            </div>
          )}

          {/* Marche #1 */}
          {winner && (
            <div className="flex-1 flex flex-col items-center">
              <div className="mb-2 flex flex-col items-center">
                <MeepleIcon color={winner.color} size={42} showCrown={true} />
                <span className="text-xs font-extrabold text-zinc-900 dark:text-white truncate max-w-[86px] mt-1">
                  {winner.name}
                </span>
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                  {getDisplayedCrowns(winner)} <Crown size={10} className="text-amber-500 fill-amber-400" />
                </span>
              </div>

              <div className="w-full h-32 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 text-zinc-950 shadow-md shadow-amber-500/15 flex flex-col items-center justify-center p-2">
                <span className="text-xs font-bold opacity-75">#{ranks[0]}</span>
                <div className="text-base font-extrabold font-display tabular-nums mt-0.5">
                  {getDisplayedScore(winner)} <span className="text-[11px] font-semibold">pts</span>
                </div>
              </div>
            </div>
          )}

          {/* Marche #3 */}
          {third && (
            <div className="flex-1 flex flex-col items-center">
              <div className="mb-2 flex flex-col items-center">
                <MeepleIcon color={third.color} size={32} showCrown={ranks[2] === 1} />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[76px] mt-1">
                  {third.name}
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 flex items-center gap-0.5">
                  {getDisplayedCrowns(third)} <Crown size={9} className="text-amber-500 fill-amber-400" />
                </span>
              </div>

              <div className="w-full h-20 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/25 flex flex-col items-center justify-center p-2 text-amber-900 dark:text-amber-200">
                <span className="text-xs font-bold opacity-70">#{ranks[2]}</span>
                <div className="text-xs font-extrabold font-display tabular-nums mt-0.5">
                  {getDisplayedScore(third)} <span className="text-[10px] font-normal">pts</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Distinctions sous les marches */}
        {hasAnyHonors && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="flex flex-col items-center gap-1">
              {second && honorsMap[second.id]?.map((h, i) => (
                <div key={i} className="w-full text-[10px] font-semibold bg-zinc-50 dark:bg-zinc-950/70 text-zinc-700 dark:text-zinc-300 px-1.5 py-1 rounded-lg border border-zinc-200/70 dark:border-zinc-800 truncate" title={h.desc}>
                  {h.icon} {h.title}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-1">
              {winner && honorsMap[winner.id]?.map((h, i) => (
                <div key={i} className="w-full text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-1.5 py-1 rounded-lg border border-amber-500/20 truncate" title={h.desc}>
                  {h.icon} {h.title}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-1">
              {third && honorsMap[third.id]?.map((h, i) => (
                <div key={i} className="w-full text-[10px] font-semibold bg-zinc-50 dark:bg-zinc-950/70 text-zinc-700 dark:text-zinc-300 px-1.5 py-1 rounded-lg border border-zinc-200/70 dark:border-zinc-800 truncate" title={h.desc}>
                  {h.icon} {h.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4ème Joueur */}
      {fourth && (
        <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 text-left shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold text-xs flex items-center justify-center flex-shrink-0">
                #{ranks[3]}
              </span>
              <MeepleIcon color={fourth.color} size={24} showCrown={false} />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {fourth.name}
              </span>
            </div>

            <div className="flex items-center gap-3 tabular-nums">
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <span>{getDisplayedCrowns(fourth)}</span>
                <Crown size={11} className="text-amber-500 fill-amber-400" />
              </div>
              <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
                {getDisplayedScore(fourth)} pts
              </span>
            </div>
          </div>

          {honorsMap[fourth.id]?.length > 0 && (
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-1.5 flex-wrap">
              {honorsMap[fourth.id].map((h, i) => (
                <span key={i} className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-200/70 dark:border-zinc-800">
                  {h.icon} {h.title} ({h.desc})
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tableau récapitulatif du Tournoi Dynastie */}
      {isDynastyMode && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3.5 border border-zinc-200/80 dark:border-zinc-800/80 text-left space-y-2.5 shadow-soft">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <span>Tournoi Dynastie • Manche {dynastyRound}/3</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
            {rankedPlayers.map((p) => {
              const r1 = dynastyHistory[0]?.scores?.[p.id] ?? (dynastyRound === 1 ? p.scoreData.totalScore : '—');
              const r2 = dynastyHistory[1]?.scores?.[p.id] ?? (dynastyRound === 2 ? p.scoreData.totalScore : '—');
              const r3 = dynastyHistory[2]?.scores?.[p.id] ?? (dynastyRound === 3 ? p.scoreData.totalScore : '—');

              return (
                <div key={p.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3 tabular-nums text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span>M1 <strong className="text-zinc-800 dark:text-zinc-200">{r1}</strong></span>
                    <span>M2 <strong className="text-zinc-800 dark:text-zinc-200">{r2}</strong></span>
                    <span>M3 <strong className="text-zinc-800 dark:text-zinc-200">{r3}</strong></span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold min-w-[46px] text-right">
                      {p.cumulativeScore} pts
                    </span>
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
