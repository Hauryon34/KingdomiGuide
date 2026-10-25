import React, { useState, useEffect } from 'react';
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
  Vibrate,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { 
  toggleSound, 
  toggleHaptic,
  playClickSound, 
  playToggleSound, 
  triggerHaptic 
} from './utils/audioHaptics';

const STORAGE_KEY = 'kingdomiguide_state_v1';

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function App() {
  const saved = loadSavedState();

  const [showSplash, setShowSplash] = useState(true);

  const [currentStep, setCurrentStep] = useState(() => saved?.currentStep ?? 0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(() => saved?.maxUnlockedStep ?? 0);

  const [selectedMeeples, setSelectedMeeples] = useState(() => saved?.selectedMeeples ?? []);
  const [playerNames, setPlayerNames] = useState(() => saved?.playerNames ?? {});
  const [gameMode, setGameMode] = useState(() => saved?.gameMode ?? 'duel');
  const [gridSize, setGridSize] = useState(() => saved?.gridSize ?? 7);
  
  const [isDynastyMode, setIsDynastyMode] = useState(() => saved?.isDynastyMode ?? false);
  const [dynastyRound, setDynastyRound] = useState(() => saved?.dynastyRound ?? 1);
  const [dynastyHistory, setDynastyHistory] = useState(() => saved?.dynastyHistory ?? []);

  const [turnOrder, setTurnOrder] = useState(() => saved?.turnOrder ?? []);
  const [playerGrids, setPlayerGrids] = useState(() => saved?.playerGrids ?? {});

  const [bonuses, setBonuses] = useState(() => saved?.bonuses ?? {
    middleEmpire: true,
    harmony: true
  });

  const [themeMode, setThemeMode] = useState(() => saved?.themeMode ?? 'auto');
  const [soundOn, setSoundOn] = useState(() => saved?.soundOn ?? true);
  const [hapticOn, setHapticOn] = useState(() => saved?.hapticOn ?? true);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const [isMobileFrame, setIsMobileFrame] = useState(() => saved?.isMobileFrame ?? true);

  useEffect(() => {
    toggleSound(soundOn);
    toggleHaptic(hapticOn);
  }, [soundOn, hapticOn]);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark =
        themeMode === 'dark' ||
        (themeMode === 'auto' && mediaQuery.matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [themeMode]);

  useEffect(() => {
    try {
      const payload = {
        currentStep,
        maxUnlockedStep,
        selectedMeeples,
        playerNames,
        gameMode,
        gridSize,
        isDynastyMode,
        dynastyRound,
        dynastyHistory,
        turnOrder,
        playerGrids,
        bonuses,
        themeMode,
        soundOn,
        hapticOn,
        isMobileFrame
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota errors
    }
  }, [
    currentStep,
    maxUnlockedStep,
    selectedMeeples,
    playerNames,
    gameMode,
    gridSize,
    isDynastyMode,
    dynastyRound,
    dynastyHistory,
    turnOrder,
    playerGrids,
    bonuses,
    themeMode,
    soundOn,
    hapticOn,
    isMobileFrame
  ]);

  const resizeOrKeepGrid = (existingGrid, targetSize) => {
    if (Array.isArray(existingGrid) && existingGrid.length === targetSize) {
      return existingGrid;
    }
    const newGrid = createEmptyGrid(targetSize);
    if (!Array.isArray(existingGrid)) return newGrid;
    const minSize = Math.min(existingGrid.length, targetSize);
    for (let r = 0; r < minSize; r++) {
      for (let c = 0; c < minSize; c++) {
        if (existingGrid[r]?.[c]) {
          let link = existingGrid[r][c].link;
          if (link === 'right' && c + 1 >= targetSize) link = null;
          if (link === 'bottom' && r + 1 >= targetSize) link = null;
          newGrid[r][c] = { ...existingGrid[r][c], link };
        }
      }
    }
    return newGrid;
  };

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
      initialGrids[id] = resizeOrKeepGrid(playerGrids[id], defaultGridSize);
    });
    setPlayerGrids(initialGrids);

    goToStep(1);
  };

  const handleResetGame = () => {
    playClickSound();
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    setConfirmReset(false);
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
        const roundCrowns = {};
        selectedMeeples.forEach(id => {
          const grid = playerGrids[id] || createEmptyGrid(gridSize);
          const scoreData = calculateKingdomScore(grid, {
            middleEmpireBonus: bonuses.middleEmpire,
            harmonyBonus: bonuses.harmony
          });
          roundScores[id] = scoreData.totalScore;
          roundCrowns[id] = scoreData.totalCrowns;
        });

        setDynastyHistory([
          ...dynastyHistory,
          { round: dynastyRound, scores: roundScores, crowns: roundCrowns }
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
    const baseBtnClass = "flex-1 py-3 px-4 rounded-2xl font-bold font-display text-sm flex items-center justify-center gap-1.5 transition-all";

    switch (currentStep) {
      case 0:
        return (
          <button
            type="button"
            disabled={!isPlayersReady}
            onClick={handleValidatePlayers}
            className={`${baseBtnClass} ${
              isPlayersReady
                ? 'bg-zinc-900 dark:bg-amber-500 text-white dark:text-zinc-950 shadow-sm hover:opacity-95 active:scale-[0.98]'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
            }`}
          >
            <span>{isPlayersReady ? 'Continuer' : '2 joueurs requis'}</span>
            {isPlayersReady && <ArrowRight size={16} />}
          </button>
        );
      case 1:
        return (
          <button
            type="button"
            onClick={() => goToStep(2)}
            className={`${baseBtnClass} bg-zinc-900 dark:bg-amber-500 text-white dark:text-zinc-950 shadow-sm hover:opacity-95 active:scale-[0.98]`}
          >
            <span>Tirage au sort</span>
            <ArrowRight size={16} />
          </button>
        );
      case 2:
        return (
          <button
            type="button"
            onClick={() => goToStep(3)}
            className={`${baseBtnClass} bg-zinc-900 dark:bg-amber-500 text-white dark:text-zinc-950 shadow-sm hover:opacity-95 active:scale-[0.98]`}
          >
            <span>Calculer les scores</span>
            <ArrowRight size={16} />
          </button>
        );
      case 3:
        return (
          <button
            type="button"
            onClick={() => goToStep(4)}
            className={`${baseBtnClass} bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/20 hover:bg-amber-400 active:scale-[0.98]`}
          >
            <span>Voir le classement</span>
            <ArrowRight size={16} />
          </button>
        );
      case 4:
        return (
          <button
            type="button"
            onClick={handleImmediateRematch}
            className={`${baseBtnClass} bg-zinc-900 dark:bg-amber-500 text-white dark:text-zinc-950 shadow-sm hover:opacity-95 active:scale-[0.98]`}
          >
            {isDynastyMode ? (
              dynastyRound < 3 ? (
                <>
                  <Swords size={15} />
                  <span>Manche {dynastyRound + 1} sur 3</span>
                </>
              ) : (
                <>
                  <Crown size={15} />
                  <span>Nouvelle Dynastie</span>
                </>
              )
            ) : (
              <>
                <Swords size={15} />
                <span>Revanche</span>
              </>
            )}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between overflow-hidden select-none transition-colors duration-200">
      {/* Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Barre flottante PC (en haut à droite) pour basculer le cadre smartphone en 1 clic */}
      <div className="hidden md:flex fixed top-4 right-4 z-40 items-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 px-3 py-1.5 rounded-2xl shadow-soft">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setIsMobileFrame(!isMobileFrame);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-amber-500 transition-colors"
          title="Basculer l'aperçu smartphone S25 Ultra"
        >
          {isMobileFrame ? <Smartphone size={14} className="text-amber-500" /> : <Monitor size={14} />}
          <span>{isMobileFrame ? 'Aperçu S25 Ultra' : 'Plein Écran'}</span>
        </button>
      </div>

      {/* Conteneur Principal */}
      <div className={`w-full flex-1 flex flex-col justify-between mx-auto h-full overflow-hidden transition-all ${
        isMobileFrame 
          ? 'md:max-w-[412px] md:my-auto md:max-h-[890px] md:rounded-[42px] md:border-[7px] md:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 md:shadow-2xl relative' 
          : 'max-w-md bg-zinc-50 dark:bg-zinc-950'
      }`}>
        {/* Header Moderne & Épuré */}
        <header className="shrink-0 w-full px-4 pt-3.5 pb-2.5 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/70 dark:border-zinc-900 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shadow-xs">
              <Crown size={16} className="fill-zinc-950" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 block leading-tight">
                KingdomiGuide
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium block">
                {isDynastyMode ? `Dynastie • Manche ${dynastyRound}/3` : 'Compagnon Kingdomino'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Bouton rapide Thème (Clair / Sombre / Auto) */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                const order = ['auto', 'light', 'dark'];
                const next = order[(order.indexOf(themeMode) + 1) % order.length];
                setThemeMode(next);
              }}
              className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all"
              title={`Thème : ${themeMode === 'auto' ? 'Auto' : themeMode === 'light' ? 'Clair' : 'Sombre'}`}
            >
              {themeMode === 'light' && <Sun size={15} className="text-amber-500" />}
              {themeMode === 'dark' && <Moon size={15} className="text-amber-400" />}
              {themeMode === 'auto' && <Laptop size={15} />}
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setConfirmReset(false);
                setIsSettingsOpen(true);
              }}
              className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all"
              title="Paramètres de l'application"
            >
              <Settings size={15} />
            </button>
          </div>
        </header>

        {/* Zone de Contenu Défilable */}
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
                    updated[id] = resizeOrKeepGrid(playerGrids[id], newSize);
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

        {/* Footer Ancré Moderne */}
        <footer className="shrink-0 w-full px-3 pt-2.5 pb-4 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl border-t border-zinc-200/70 dark:border-zinc-900 z-30">
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

      {/* Modale Paramètres Style iOS Sheet */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="font-display font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Paramètres
              </span>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Segmented Control Thème */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-1">
                  Apparence
                </span>
                <div className="grid grid-cols-3 gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-2xl border border-zinc-200/70 dark:border-zinc-800">
                  {[
                    { id: 'light', label: 'Clair', icon: Sun },
                    { id: 'dark', label: 'Sombre', icon: Moon },
                    { id: 'auto', label: 'Auto', icon: Laptop }
                  ].map(({ id, label, icon: Icon }) => {
                    const active = themeMode === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setThemeMode(id);
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          active
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon size={13} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Groupe Audio & Haptique */}
              <div className="bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 divide-y divide-zinc-200/60 dark:divide-zinc-800/70 overflow-hidden">
                {/* Son */}
                <div className="flex items-center justify-between p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">Effets sonores</span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Sons d'interface et de tuiles</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundOn}
                    onClick={handleToggleSound}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors ${
                      soundOn ? 'bg-amber-500 justify-end' : 'bg-zinc-300 dark:bg-zinc-800 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                {/* Vibrations */}
                <div className="flex items-center justify-between p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <Vibrate size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">Retours haptiques</span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Vibrations au toucher</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={hapticOn}
                    onClick={handleToggleHaptic}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors ${
                      hapticOn ? 'bg-indigo-500 justify-end' : 'bg-zinc-300 dark:bg-zinc-800 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                {/* Simulateur PC */}
                <div className="hidden md:flex items-center justify-between p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      {isMobileFrame ? <Monitor size={16} /> : <Smartphone size={16} />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">Cadre S25 Ultra</span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Format 19.5:9 sur ordinateur</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setIsMobileFrame(!isMobileFrame);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                  >
                    {isMobileFrame ? 'Actif' : 'Inactif'}
                  </button>
                </div>
              </div>

              {/* Remise à Zéro Totale */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleResetGame}
                  className={`w-full py-3 px-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    confirmReset
                      ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15'
                  }`}
                >
                  <RotateCcw size={14} />
                  <span>
                    {confirmReset
                      ? 'Confirmer la réinitialisation ?'
                      : 'Réinitialiser la partie'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
