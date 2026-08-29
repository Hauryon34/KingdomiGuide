import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Crown, Sparkles, X, Award, RotateCcw } from 'lucide-react';
import MeepleIcon from './MeepleIcon';

export default function PodiumModal({ isOpen, onClose, rankedPlayers, onResetGame }) {
  useEffect(() => {
    if (isOpen && rankedPlayers.length > 0) {
      // Fire celebratory royal confetti
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#EAB308', '#38BDF8', '#4ADE80', '#FB7185'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen, rankedPlayers]);

  if (!isOpen || rankedPlayers.length === 0) return null;

  const winner = rankedPlayers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-xl shadow-amber-500/30 mb-2">
            <Trophy size={36} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-medieval text-amber-200">
            Victoire Royale !
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Félicitations à <strong className="text-amber-300">{winner?.name}</strong> pour avoir bâti le plus grand royaume !
          </p>
        </div>

        {/* Podium List */}
        <div className="space-y-3">
          {rankedPlayers.map((player, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <div
                key={player.id}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  isFirst
                    ? 'bg-gradient-to-r from-amber-500/25 via-yellow-500/10 to-slate-900 border-amber-400 shadow-xl ring-2 ring-amber-400/50 scale-102'
                    : isSecond
                    ? 'bg-slate-800/80 border-slate-600 shadow-md'
                    : isThird
                    ? 'bg-slate-900/80 border-amber-800/60 shadow'
                    : 'bg-slate-950/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow ${
                      isFirst
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-yellow-300'
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
                  <div className="flex items-center gap-2.5">
                    <MeepleIcon color={player.color} size={36} />
                    <div>
                      <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        {player.name}
                        {isFirst && (
                          <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            Vainqueur
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Max Domaine : <strong className="text-slate-200">{player.scoreData.maxDomainSize} cases</strong></span>
                        <span>•</span>
                        <span>Couronnes : <strong className="text-slate-200">{player.scoreData.totalCrowns} 👑</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-extrabold font-medieval text-amber-300">
                    {player.scoreData.totalScore}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Points
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tie-breaker Rule Reminder */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
          💡 <strong className="text-slate-300">Règle officielle de départage :</strong> En cas d'égalité, le joueur ayant le <strong className="text-slate-300">plus grand domaine</strong> gagne. En cas de nouvelle égalité, c'est le <strong className="text-slate-300">nombre total de couronnes</strong> qui l'emporte.
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 border border-slate-700 font-bold text-xs text-slate-200 hover:bg-slate-700 transition-all"
          >
            Fermer & Réviser
          </button>
          <button
            type="button"
            onClick={onResetGame}
            className="py-3 px-4 rounded-xl bg-amber-500 font-bold text-xs text-slate-950 hover:bg-amber-400 transition-all flex items-center gap-1.5"
          >
            <RotateCcw size={15} />
            Nouvelle Partie
          </button>
        </div>
      </div>
    </div>
  );
}
