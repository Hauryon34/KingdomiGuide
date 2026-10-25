import React from 'react';
import { MEEPLES } from '../types/kingdomino';
import MeepleIcon from './MeepleIcon';
import { Check } from 'lucide-react';
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
    <div className="space-y-4 max-w-sm mx-auto px-1 animate-fade-in">
      {/* Title Section */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-zinc-100">
          Qui participe ?
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Sélectionnez les couleurs des joueurs autour de la table
        </p>
      </div>

      {/* 2x2 Bento Grid de Figurines Modernes */}
      <div className="grid grid-cols-2 gap-2.5">
        {MEEPLES.map((meeple) => {
          const isSelected = selectedMeeples.includes(meeple.id);
          return (
            <button
              key={meeple.id}
              type="button"
              onClick={() => handleToggle(meeple.id)}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 relative ${
                isSelected
                  ? `bg-white dark:bg-zinc-900 ${meeple.border} ring-2 ${meeple.border}/25 shadow-card`
                  : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 opacity-65 hover:opacity-100'
              }`}
            >
              <div
                className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 scale-100'
                    : 'border border-zinc-300 dark:border-zinc-700 bg-transparent scale-90 opacity-50'
                }`}
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>

              <MeepleIcon color={meeple.color} size={44} showCrown={isSelected} />

              <span className={`text-xs font-bold tracking-tight ${
                isSelected ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'
              }`}>
                {meeple.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Champs de prénoms style iOS Grouped List */}
      {selectedMeeples.length > 0 && (
        <div className="space-y-2 pt-1 animate-fade-in text-left">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Participants
            </span>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              {selectedMeeples.length} {selectedMeeples.length > 1 ? 'joueurs' : 'joueur'}
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-soft divide-y divide-zinc-100 dark:divide-zinc-800/70 overflow-hidden">
            {selectedMeeples.map((meepleId, idx) => {
              const meeple = MEEPLES.find(m => m.id === meepleId);
              return (
                <div
                  key={meepleId}
                  className="flex items-center gap-3 px-3.5 py-2.5 focus-within:bg-zinc-50/80 dark:focus-within:bg-zinc-800/40 transition-colors"
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0 shadow-xs"
                    style={{ backgroundColor: meeple.color }}
                  />
                  <div className="flex-1 min-w-0">
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
                      className="bg-transparent text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none w-full"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 flex-shrink-0">
                    {meeple.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
