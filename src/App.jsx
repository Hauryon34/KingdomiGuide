import React, { useState } from 'react';
import StepPlayers from './components/StepPlayers';
import StepGameMode from './components/StepGameMode';
import StepTurnOrder from './components/StepTurnOrder';
import StepScore from './components/StepScore';
import StepPodium from './components/StepPodium';
import BreadcrumbDots from './components/BreadcrumbDots';
import { createEmptyGrid } from './utils/scoreCalculator';
import { Crown, Smartphone, Monitor, RotateCcw, ArrowRight } from 'lucide-react';

export default function App() {
  // Funnel Step: 0 (Players) -> 1 (Mode) -> 2 (TurnOrder) -> 3 (Score) -> 4 (Podium)
  const [currentStep, setCurrentStep] = useState(0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);

  // Game Settings State
  const [selectedMeeples, setSelectedMeeples] = useState([]);
  const [playerNames, setPlayerNames] = useState({});
  const [gameMode, setGameMode] = useState('duel'); // 'duel' (7x7) or 'classic' (5x5)
  const [gridSize, setGridSize] = useState(7);

  // Persisted Turn Order
  const [turnOrder, setTurnOrder] = useState([]);

  // Shared Grids State
  const [playerGrids, setPlayerGrids] = useState({});

  // Bonus Rules State
  const [bonuses, setBonuses] = useState({
    middleEmpire: true,
    harmony: true
  });

  // Desktop Simulator Toggle
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  const goToStep = (step) => {
    setCurrentStep(step);
    if (step > maxUnlockedStep) {
      setMaxUnlockedStep(step);
    }
  };

  const handleSetSelectedMeeples = (newMeeples) => {
    setSelectedMeeples(newMeeples);
    setTurnOrder([]);
  };

  const handleValidatePlayers = () => {
    const defaultGridSize = (selectedMeeples.length === 2 && gameMode === 'duel') ? 7 : 5;
    setGridSize(defaultGridSize);

    const initialGrids = {};
    selectedMeeples.forEach(id => {
      initialGrids[id] = playerGrids[id] || createEmptyGrid(defaultGridSize);
    });
    setPlayerGrids(initialGrids);

    goToStep(1);
  };

  const handleResetGame = () => {
    setSelectedMeeples([]);
    setPlayerNames({});
    setPlayerGrids({});
    setTurnOrder([]);
    setCurrentStep(0);
    setMaxUnlockedStep(0);
  };

  const isPlayersReady = selectedMeeples.length >= 2;

  const renderActionButton = () => {
    switch (currentStep) {
      case 0:
        return (
          <button
            type="button"
            disabled={!isPlayersReady}
            onClick={handleValidatePlayers}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 transition-all ${
              isPlayersReady
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            <span>{isPlayersReady ? 'Valider' : '2 joueurs min.'}</span>
            {isPlayersReady && <ArrowRight size={17} />}
          </button>
        );
      case 1:
        return (
          <button
            type="button"
            onClick={() => goToStep(2)}
            className="flex-1 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            <span>Continuer</span>
            <ArrowRight size={17} />
          </button>
        );
      case 2:
        return (
          <button
            type="button"
            onClick={() => goToStep(3)}
            className="flex-1 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            <span>Scores</span>
            <ArrowRight size={17} />
          </button>
        );
      case 3:
        return (
          <button
            type="button"
            onClick={() => goToStep(4)}
            className="flex-1 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            <span>Podium</span>
            <ArrowRight size={17} />
          </button>
        );
      case 4:
        return (
          <button
            type="button"
            onClick={handleResetGame}
            className="flex-1 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            <RotateCcw size={16} />
            <span>Rejouer</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between antialiased relative">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[130px]"></div>
        <div className="absolute -bottom-40 right-10 w-[500px] h-[400px] bg-indigo-600/10 rounded-full blur-[130px]"></div>
      </div>

      {/* Clean Mobile-First Header (Non-sticky) */}
      <header className="w-full max-w-md mx-auto px-4 pt-3 pb-1 flex items-center justify-between z-30">
        <div 
          onClick={() => goToStep(0)}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-md">
            <Crown size={18} className="fill-slate-950" />
          </div>
          <div>
            <span className="font-medieval font-black text-base tracking-wide text-amber-200 block leading-tight">
              KingdomiGuide
            </span>
            <span className="text-[9px] text-slate-400 font-medium tracking-wider uppercase block">
              Compagnon Kingdomino
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition-all"
            title="Basculer la vue simulateur smartphone"
          >
            {isMobileFrame ? <Monitor size={13} /> : <Smartphone size={13} />}
            <span>{isMobileFrame ? 'Plein Écran' : 'Vue Mobile'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetGame}
            className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-all"
            title="Réinitialiser"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* Main Content Area (Natural flex column with content expanding and footer at bottom) */}
      <main className={`w-full flex-1 flex flex-col justify-start mx-auto py-2 px-3 z-10 ${
        isMobileFrame ? 'max-w-md my-2 rounded-3xl border-4 border-slate-800 bg-slate-950 shadow-2xl overflow-hidden min-h-[820px]' : 'max-w-md'
      }`}>
        <div className="w-full flex-1 flex flex-col justify-between space-y-4">
          {/* Écrans du Tunnel UX */}
          <div className="w-full space-y-4 flex-1">
            {currentStep === 0 && (
              <StepPlayers
                selectedMeeples={selectedMeeples}
                setSelectedMeeples={handleSetSelectedMeeples}
                playerNames={playerNames}
                setPlayerNames={setPlayerNames}
              />
            )}

            {currentStep === 1 && (
              <StepGameMode
                playerCount={selectedMeeples.length}
                gameMode={gameMode}
                setGameMode={(mode) => {
                  setGameMode(mode);
                  const newSize = (selectedMeeples.length === 2 && mode === 'duel') ? 7 : 5;
                  setGridSize(newSize);
                  const updated = {};
                  selectedMeeples.forEach(id => {
                    updated[id] = createEmptyGrid(newSize);
                  });
                  setPlayerGrids(updated);
                }}
              />
            )}

            {currentStep === 2 && (
              <StepTurnOrder
                selectedMeeples={selectedMeeples}
                playerNames={playerNames}
                playerCount={selectedMeeples.length}
                turnOrder={turnOrder}
                setTurnOrder={setTurnOrder}
              />
            )}

            {currentStep === 3 && (
              <StepScore
                selectedMeeples={selectedMeeples}
                playerNames={playerNames}
                playerGrids={playerGrids}
                setPlayerGrids={setPlayerGrids}
                gridSize={gridSize}
                setGridSize={setGridSize}
                bonuses={bonuses}
                setBonuses={setBonuses}
              />
            )}

            {currentStep === 4 && (
              <StepPodium
                selectedMeeples={selectedMeeples}
                playerNames={playerNames}
                playerGrids={playerGrids}
                bonuses={bonuses}
                onResetGame={handleResetGame}
              />
            )}
          </div>

          {/* Bottom Row: Fil d'Ariane & Bouton d'action sur la MÊME LIGNE */}
          <div className="mt-auto pt-3 pb-4 max-w-sm mx-auto w-full">
            <div className="flex items-center gap-2.5 w-full">
              <BreadcrumbDots
                currentStep={currentStep}
                setStep={goToStep}
                maxUnlockedStep={maxUnlockedStep}
              />

              {renderActionButton()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
