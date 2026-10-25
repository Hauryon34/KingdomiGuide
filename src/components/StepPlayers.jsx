import React from 'react';
import { MEEPLES } from '../types/kingdomino';
import MeepleIcon from './MeepleIcon';
import { playClickSound, triggerHaptic } from '../utils/audioHaptics';

export default function StepPlayers({
  selectedMeeples,
  setSelectedMeeples,
  playerNames,
  setPlayerNames
}) {
  const handleToggle = (meepleId) => {
    playClickSound();
    triggerHaptic(20);
    if (selectedMeeples.includes(meepleId)) {
      setSelectedMeeples(selectedMeeples.filter(id => id !== meepleId));
    } else {
      setSelectedMeeples([...selectedMeeples, meepleId]);
    }
  };

  return (
    <div className="space-y-3.5 max-w-sm mx-auto px-1 animate-fade-in text-center">
      {/* Title Section */}
      <div className="space-y-0.5">
        <h2 className="text-xl font-black font-medieval text-slate-900 dark:text-amber-200">
          Qui participe ?
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Touchez les figurines des joueurs autour de la table
        </p>
      </div>

      {/* 2 Colonnes x 2 Lignes de Figurines */}
      <div className="grid grid-cols-2 gap-2.5">
        {MEEPLES.map((meeple) => {
          const isSelected = selectedMeeples.includes(meeple.id);
          return (
            <button
              key={meeple.id}
              type="button"
              onClick={() => handleToggle(meeple.id)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 relative ${
                isSelected
                  ? `${meeple.border} ${meeple.bgLight} scale-102 shadow-md ring-2 ${meeple.border}`
                  : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 opacity-60 dark:opacity-45 hover:opacity-90'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center font-black text-[10px] shadow">
                  ✓
                </div>
              )}
              <MeepleIcon color={meeple.color} size={44} showCrown={isSelected} />
              <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                {meeple.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Champs de prénoms dynamiques sous l'intitulé "Participants :" */}
      {selectedMeeples.length > 0 && (
        <div className="space-y-1.5 pt-1 animate-fade-in text-left">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Participants ({selectedMeeples.length}) :
          </p>
          <div className="space-y-1.5">
            {selectedMeeples.map((meepleId, idx) => {
              const meeple = MEEPLES.find(m => m.id === meepleId);
              return (
                <div
                  key={meepleId}
                  className="flex items-center gap-2.5 bg-white dark:bg-slate-900/90 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-amber-400"
                >
                  <MeepleIcon color={meeple.color} size={24} showCrown={false} />
                  <div className="flex-1">
                    <input
                      type="text"
                      maxLength={18}
                      enterKeyHint="done"
                      value={playerNames[meepleId] || ''}
                      placeholder={`Joueur ${idx + 1} (${meeple.label})`}
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 150);
                      }}
                      onChange={(e) => {
                        setPlayerNames({
                          ...playerNames,
                          [meepleId]: e.target.value
                        });
                      }}
                      className="bg-transparent text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none w-full"
                    />
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
