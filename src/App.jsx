import React, { useState } from 'react';
import StepPlayers from './components/StepPlayers';
import StepGameMode from './components/StepGameMode';
import StepTurnOrder from './components/StepTurnOrder';
import StepScore from './components/StepScore';
import StepPodium from './components/StepPodium';
import BreadcrumbDots from './components/BreadcrumbDots';
import SplashScreen from './components/SplashScreen';
import { createEmptyGrid, calculateKingdomScore } from './utils/scoreCalculator';
import { 
  Crown, 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Swords, 
  Settings, 
  X,
  Vibrate
} from 'lucide-react';
import { 
  toggleSound, 
  toggleHaptic,
  playClickSound, 
  playToggleSound, 
  triggerHaptic 
} from './utils/audioHaptics';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Funnel Step: 0 (Players) -> 1 (Mode) -> 2 (TurnOrder) -> 3 (Score) -> 4 (Podium)
  const [currentStep, setCurrentStep] = useState(0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);

  // Game Settings State
  const [selectedMeeples, setSelectedMeeples] = useState([]);
  const [playerNames, setPlayerNames] = useState({});
  const [gameMode, setGameMode] = useState('duel'); // 'duel' (7x7) or 'classic' (5x5)
  const [gridSize, setGridSize] = useState(7);
  
  // Dynasty Tournament State
  const [isDynastyMode, setIsDynastyMode] = useState(false);
  const [dynastyRound, setDynastyRound] = useState(1);
  const [dynastyHistory, setDynastyHistory] = useState([]);

  // Persisted Turn Order
  const [turnOrder, setTurnOrder] = useState([]);

  // Shared Grids State
  const [playerGrids, setPlayerGrids] = useState({});

  // Bonus Rules State
  const [bonuses, setBonuses] = useState({
    middleEmpire: true,
    harmony: true
  });

  // Sound & Haptics State (ON par défaut)
  const [soundOn, setSoundOn] = useState(true);
  const [hapticOn, setHapticOn] = useState(true);

  // Settings Menu Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Desktop Simulator Toggle (Calibré S25 Ultra 19.5:9)
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  const goToStep = (step) => {
    playClickSound();
    setCurrentStep(step);
    if (step > maxUnlockedStep) {
      setMaxUnlockedStep(step);
    }
  };

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    toggleSound(nextState);
    playToggleSound(nextState);
  };

  const handleToggleHaptic = () => {
    const nextState = !hapticOn;
    setHapticOn(nextState);
    toggleHaptic(nextState);
    playToggleSound(nextState);
    if (nextState) triggerHaptic(30);
  };

  const handleSetSelectedMeeples = (newMeeples) => {
    setSelectedMeeples(newMeeples);
    setTurnOrder([]);
  };

  const handleValidatePlayers = () => {
    playClickSound();
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
    playClickSound();
    setSelectedMeeples([]);
    setPlayerNames({});
    setPlayerGrids({});
    setTurnOrder([]);
    setDynastyRound(1);
    setDynastyHistory([]);
    setCurrentStep(0);
    setMaxUnlockedStep(0);
    setIsSettingsOpen(false);
  };

  const handleImmediateRematch = () => {
    playClickSound();

    if (isDynastyMode) {
      if (dynastyRound < 3) {
        const roundScores = {};
        selectedMeeples.forEach(id => {
          const grid = playerGrids[id] || createEmptyGrid(gridSize);
          const scoreData = calculateKingdomScore(grid, {
            middleEmpireBonus: bonuses.middleEmpire,
            harmonyBonus: bonuses.harmony
          });
          roundScores[id] = scoreData.totalScore;
        });

        setDynastyHistory([
          ...dynastyHistory,
          { round: dynastyRound, scores: roundScores }
        ]);
        setDynastyRound(dynastyRound + 1);

        const emptyGrids = {};
        selectedMeeples.forEach(id => {
          emptyGrids[id] = createEmptyGrid(gridSize);
        });
        setPlayerGrids(emptyGrids);
        setTurnOrder([]);
        setCurrentStep(2);
        setMaxUnlockedStep(2);
        return;
      } else {
        setDynastyRound(1);
        setDynastyHistory([]);
        const emptyGrids = {};
        selectedMeeples.forEach(id => {
          emptyGrids[id] = createEmptyGrid(gridSize);
        });
        setPlayerGrids(emptyGrids);
        setTurnOrder([]);
        setCurrentStep(2);
        setMaxUnlockedStep(2);
        return;
      }
    }

    const emptyGrids = {};
    selectedMeeples.forEach(id => {
      emptyGrids[id] = createEmptyGrid(gridSize);
    });
    setPlayerGrids(emptyGrids);
    setTurnOrder([]);
    setCurrentStep(2);
    setMaxUnlockedStep(2);
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
            className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 transition-all ${
              isPlayersReady
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            <span>{isPlayersReady ? 'Valider' : '2 joueurs min.'}</span>
            {isPlayersReady && <ArrowRight size={16} />}
          </button>
        );
      case 1:
        return (
          <button
            type="button"
            onClick={() => goToStep(2)}
            className="flex-1 py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            <span>Continuer</span>
            <ArrowRight size={16} />
          </button>
        );
      case 2:
        return (
          <button
            type="button"
            onClick={() => goToStep(3)}
            className="flex-1 py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            <span>Scores</span>
            <ArrowRight size={16} />
          </button>
        );
      case 3:
        return (
          <button
            type="button"
            onClick={() => goToStep(4)}
            className="flex-1 py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            <span>Podium</span>
            <ArrowRight size={16} />
          </button>
        );
      case 4:
        return (
          <button
            type="button"
            onClick={handleImmediateRematch}
            className="flex-1 py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            {isDynastyMode ? (
              dynastyRound < 3 ? (
                <>
                  <Swords size={16} />
                  <span>Manche {dynastyRound + 1}/3 ⚔️</span>
                </>
              ) : (
                <>
                  <Crown size={16} />
                  <span>Nouvelle Dynastie 👑</span>
                </>
              )
            ) : (
              <>
                <Swords size={16} />
                <span>Revanche ⚔️</span>
              </>
            )}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[130px]"></div>
        <div className="absolute -bottom-40 right-10 w-[500px] h-[400px] bg-indigo-600/10 rounded-full blur-[130px]"></div>
      </div>

      {/* Desktop / Mobile Frame Container */}
      <div className={`w-full flex-1 flex flex-col justify-between mx-auto h-full overflow-hidden ${
        isMobileFrame 
          ? 'max-w-[412px] my-auto max-h-[890px] rounded-[40px] border-8 border-slate-800 bg-slate-950 shadow-2xl relative' 
          : 'max-w-md'
      }`}>
        {/* Header Fixe en Haut */}
        <header className="shrink-0 w-full px-4 pt-3.5 pb-2 flex items-center justify-between z-30">
          <div 
            onClick={() => goToStep(0)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-md">
              <Crown size={17} className="fill-slate-950" />
            </div>
            <div>
              <span className="font-medieval font-black text-sm sm:text-base tracking-wide text-amber-200 block leading-tight">
                KingdomiGuide
              </span>
              <span className="text-[8px] text-slate-400 font-medium tracking-wider uppercase block">
                {isDynastyMode ? `Dynastie (Manche ${dynastyRound}/3)` : 'Compagnon Kingdomino'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsSettingsOpen(true);
              }}
              className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-all shadow-sm"
              title="Paramètres de l'application"
            >
              <Settings size={15} />
            </button>
          </div>
        </header>

        {/* Zone de Contenu Défilable avec Alignement Haut Amplement Aéré */}
        <main className="flex-1 overflow-y-auto overscroll-contain px-3 pt-5 pb-5 flex flex-col justify-start z-10">
          <div className="w-full space-y-3">
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
                bonuses={bonuses}
                setBonuses={setBonuses}
                isDynastyMode={isDynastyMode}
                setIsDynastyMode={setIsDynastyMode}
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
                isDynastyMode={isDynastyMode}
                dynastyRound={dynastyRound}
                dynastyHistory={dynastyHistory}
                onNextRound={handleImmediateRematch}
                onResetGame={handleResetGame}
              />
            )}
          </div>
        </main>

        {/* Footer 100% Fixé au Bas de l'Écran */}
        <footer className="shrink-0 w-full px-3 pt-2 pb-4 bg-slate-950/95 backdrop-blur-md border-t border-slate-900/90 z-30">
          <div className="flex items-center gap-2.5 max-w-sm mx-auto w-full">
            <BreadcrumbDots
              currentStep={currentStep}
              setStep={goToStep}
              maxUnlockedStep={maxUnlockedStep}
            />

            {renderActionButton()}
          </div>
        </footer>
      </div>

      {/* Settings Menu Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-amber-400" />
                <span className="font-medieval font-bold text-base text-amber-200">
                  Paramètres
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Son */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-300">
                    {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">Effets Sonores</span>
                    <span className="text-[10px] text-slate-400 block">Pose de tuile, couronnes, fanfare</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-all ${
                    soundOn ? 'bg-amber-400 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md"></div>
                </button>
              </div>

              {/* Vibrations Haptiques */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-300">
                    <Vibrate size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">Retours Haptiques</span>
                    <span className="text-[10px] text-slate-400 block">Vibrations tactiles au toucher</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleHaptic}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-all ${
                    hapticOn ? 'bg-indigo-400 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md"></div>
                </button>
              </div>

              {/* Desktop Simulator Toggle */}
              <div className="hidden md:flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300">
                    {isMobileFrame ? <Monitor size={16} /> : <Smartphone size={16} />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">Simulateur S25 Ultra</span>
                    <span className="text-[10px] text-slate-400 block">Cadre smartphone 19.5:9 sur PC</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setIsMobileFrame(!isMobileFrame);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700"
                >
                  {isMobileFrame ? 'Plein écran' : 'Vue S25 Ultra'}
                </button>
              </div>

              {/* Remise à Zéro Totale */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleResetGame}
                  className="w-full py-3 px-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw size={15} />
                  <span>Réinitialiser & Nouvelle Partie</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
