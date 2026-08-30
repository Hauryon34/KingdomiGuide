import React from 'react';
import { MEEPLES } from '../types/kingdomino';
import MeepleIcon from './MeepleIcon';

export default function StepPlayers({
  selectedMeeples,
  setSelectedMeeples,
  playerNames,
  setPlayerNames
}) {
  const handleToggle = (meepleId) => {
    if (selectedMeeples.includes(meepleId)) {
      setSelectedMeeples(selectedMeeples.filter(id => id !== meepleId));
    } else {
      setSelectedMeeples([...selectedMeeples, meepleId]);
    }
  };

  return (
    <div className="space-y-3.5 max-w-sm mx-auto px-1 animate-fade-in text-center">
      {/* Title Section */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black font-medieval text-amber-200">
          Qui participe ?
        </h2>
        <p className="text-[11px] text-slate-400">
          Touchez les figurines des joueurs autour de la table
        </p>
      </div>

      {/* 2 Colonnes x 2 Lignes de Figurines compactes et élégantes */}
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
                  : 'border-slate-800 bg-slate-900/60 opacity-40 hover:opacity-75'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-[10px] shadow">
                  ✓
                </div>
              )}
              <MeepleIcon color={meeple.color} size={44} showCrown={isSelected} />
              <span className={`text-[11px] font-black uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                {meeple.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Champs de prénoms dynamiques compacts sous l'intitulé "Participants :" */}
      {selectedMeeples.length > 0 && (
        <div className="space-y-1.5 pt-1 animate-fade-in text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Participants ({selectedMeeples.length}) :
          </p>
          <div className="space-y-1.5">
            {selectedMeeples.map((meepleId, idx) => {
              const meeple = MEEPLES.find(m => m.id === meepleId);
              return (
                <div
                  key={meepleId}
                  className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 shadow-sm"
                >
                  <MeepleIcon color={meeple.color} size={24} showCrown={false} />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={playerNames[meepleId] || ''}
                      placeholder={`Joueur ${idx + 1} (${meeple.label})`}
                      onChange={(e) => {
                        setPlayerNames({
                          ...playerNames,
                          [meepleId]: e.target.value
                        });
                      }}
                      className="bg-transparent text-xs font-semibold text-slate-100 placeholder:text-slate-500 focus:outline-none w-full"
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
