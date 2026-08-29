import React, { useState } from 'react';
import { MEEPLES, GAME_SETUP_RULES } from '../types/kingdomino';
import MeepleIcon from './MeepleIcon';
import { 
  Users, 
  Shuffle, 
  Crown, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  BookOpen, 
  Check,
  RotateCcw
} from 'lucide-react';

export default function SetupModule({
  playerCount,
  setPlayerCount,
  selectedMeeples,
  setSelectedMeeples,
  playerNames,
  setPlayerNames,
  gameMode,
  setGameMode,
  onNavigateToScore,
  onNavigateToGuide
}) {
  const [turnOrder, setTurnOrder] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);

  // Free Meeple Picker: toggle any color
  const handleToggleMeeple = (meepleId) => {
    if (selectedMeeples.includes(meepleId)) {
      // Don't deselect if it would drop below 2
      if (selectedMeeples.length <= 2) return;
      const updated = selectedMeeples.filter(id => id !== meepleId);
      setSelectedMeeples(updated);
      setPlayerCount(updated.length);
    } else {
      if (selectedMeeples.length >= playerCount) {
        // If already at playerCount, replace the first one to allow swapping freely!
        const updated = [...selectedMeeples.slice(1), meepleId];
        setSelectedMeeples(updated);
      } else {
        const updated = [...selectedMeeples, meepleId];
        setSelectedMeeples(updated);
        setPlayerCount(updated.length);
      }
    }
    setTurnOrder(null);
  };

  // Turn count selector
  const handleSetPlayerCount = (count) => {
    setPlayerCount(count);
    if (selectedMeeples.length < count) {
      // Add missing colors
      const remaining = MEEPLES.map(m => m.id).filter(id => !selectedMeeples.includes(id));
      setSelectedMeeples([...selectedMeeples, ...remaining.slice(0, count - selectedMeeples.length)]);
    } else if (selectedMeeples.length > count) {
      setSelectedMeeples(selectedMeeples.slice(0, count));
    }
    setTurnOrder(null);
  };

  // Active players object list
  const activePlayers = selectedMeeples.map((meepleId, idx) => {
    const meeple = MEEPLES.find(m => m.id === meepleId) || MEEPLES[0];
    return {
      ...meeple,
      name: playerNames[meepleId] || `Joueur ${idx + 1}`
    };
  });

  // Animated lottery
  const handleDrawTurnOrder = () => {
    setIsShuffling(true);
    setTurnOrder(null);

    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      if (ticks > 7) {
        clearInterval(interval);
        const shuffled = [...activePlayers].sort(() => Math.random() - 0.5);
        setTurnOrder(shuffled);
        setIsShuffling(false);
      }
    }, 100);
  };

  const setupInfo = GAME_SETUP_RULES[playerCount]?.[playerCount === 2 ? gameMode : 'classic'];

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto px-1 animate-fade-in">
      {/* 1. Nombre de Joueurs */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Users size={16} className="text-amber-400" />
            Nombre de Joueurs
          </span>
          <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            {playerCount} Joueurs
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[2, 3, 4].map((count) => {
            const isSelected = playerCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => handleSetPlayerCount(count)}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col items-center gap-0.5 transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300 font-extrabold'
                    : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span className="text-base">{count}</span>
                <span className="text-[10px] uppercase opacity-75">{count === 2 ? 'Duel' : 'Joueurs'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Sélection des Couleurs (Libre & Épurée) */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles size={16} className="text-amber-400" />
            Couleurs en jeu
          </span>
          <span className="text-[11px] text-slate-400">
            {selectedMeeples.length} / {playerCount} sélectionnées
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {MEEPLES.map((meeple) => {
            const isPicked = selectedMeeples.includes(meeple.id);
            return (
              <button
                key={meeple.id}
                type="button"
                onClick={() => handleToggleMeeple(meeple.id)}
                className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all relative ${
                  isPicked
                    ? `${meeple.border} ${meeple.bgLight} scale-102 shadow-md ring-1 ${meeple.border}`
                    : 'border-slate-800 bg-slate-950/40 opacity-40 hover:opacity-70'
                }`}
              >
                {isPicked && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[9px]">
                    ✓
                  </div>
                )}
                <MeepleIcon color={meeple.color} size={32} />
                <span className="text-[11px] font-bold text-slate-200">
                  {meeple.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Noms personnalisés optionnels (ultra compact) */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <div className="grid grid-cols-2 gap-2">
            {activePlayers.map((player) => (
              <div key={player.id} className="flex items-center gap-1.5 bg-slate-950/60 px-2 py-1.5 rounded-xl border border-slate-800">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: player.color }}></div>
                <input
                  type="text"
                  value={playerNames[player.id] || ''}
                  placeholder={player.label}
                  onChange={(e) => {
                    setPlayerNames({
                      ...playerNames,
                      [player.id]: e.target.value
                    });
                  }}
                  className="bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none w-full font-medium"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Mode 2 Joueurs (si 2 joueurs) */}
      {playerCount === 2 && (
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-indigo-500/30 shadow-md space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              ⚔️ Mode 2 Joueurs
            </span>
            <button
              type="button"
              onClick={onNavigateToGuide}
              className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <BookOpen size={12} />
              Guide 7×7
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGameMode('classic')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                gameMode === 'classic'
                  ? 'bg-indigo-600/25 border-indigo-400 text-white font-bold shadow'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="text-xs flex items-center justify-between">
                <span>Classique</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 font-mono">5×5</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">24 dominos écartés</p>
            </button>

            <button
              type="button"
              onClick={() => setGameMode('duel')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                gameMode === 'duel'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow ring-1 ring-amber-400/40'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="text-xs flex items-center justify-between text-amber-300">
                <span>Grand Duel</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">7×7</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Les 48 dominos</p>
            </button>
          </div>
        </div>
      )}

      {/* 4. Tirage au Sort de l'Ordre */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md space-y-3">
        <button
          type="button"
          onClick={handleDrawTurnOrder}
          disabled={isShuffling}
          className="w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <Shuffle size={16} className={isShuffling ? 'animate-spin' : ''} />
          {isShuffling ? 'Tirage en cours...' : 'Tirer l’Ordre du 1er Tour 🎲'}
        </button>

        {turnOrder && (
          <div className="space-y-2 pt-1 animate-pop">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {turnOrder.map((player, idx) => (
                <div
                  key={player.id}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 ${
                    idx === 0
                      ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/50 shadow'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    #{idx + 1} {idx === 0 ? '👑 1er' : ''}
                  </span>
                  <MeepleIcon color={player.color} size={28} showCrown={idx === 0} />
                  <span className="text-xs font-bold text-slate-200 truncate max-w-full">
                    {player.name}
                  </span>
                </div>
              ))}
            </div>

            {playerCount === 2 && (
              <p className="text-[10px] text-slate-400 italic text-center pt-1">
                💡 Ordre de pose : J1, J2, J2, J1 (2 meeples par joueur).
              </p>
            )}
          </div>
        )}
      </div>

      {/* 5. Rappel Pioche */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-amber-400 flex-shrink-0" />
          <span>
            {setupInfo?.discardCount > 0 ? (
              <>Retirez <strong className="text-amber-300 underline">{setupInfo.discardCount} dominos</strong> de la boîte.</>
            ) : (
              <>Utilisez l’intégralité des <strong className="text-emerald-300">48 dominos</strong>.</>
            )}
          </span>
        </div>
      </div>

      {/* Direct CTA */}
      <button
        type="button"
        onClick={onNavigateToScore}
        className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all"
      >
        <span>Partie terminée ? Passer au Calcul de Score</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
