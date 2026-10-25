import React, { useState, useRef } from 'react';
import { TERRAINS, MEEPLES } from '../types/kingdomino';
import { 
  calculateKingdomScore, 
  createEmptyGrid 
} from '../utils/scoreCalculator';
import TerrainTile from './TerrainTile';
import TerrainIcon from './TerrainIcon';
import MeepleIcon from './MeepleIcon';
import KingdomScannerModal from './KingdomScannerModal';
import { 
  Castle, 
  RotateCcw, 
  AlertTriangle,
  Camera,
  Info,
  Brush,
  Link2
} from 'lucide-react';
import { 
  playTileSound, 
  playCrownSound, 
  playClickSound 
} from '../utils/audioHaptics';

export default function StepScore({
  selectedMeeples,
  playerNames,
  playerGrids,
  setPlayerGrids,
  gridSize,
  setGridSize,
  bonuses
}) {
  const [activePlayerId, setActivePlayerId] = useState(selectedMeeples[0] || 'blue');
  const [selectedTerrain, setSelectedTerrain] = useState('champs');
  const [highlightedDomain, setHighlightedDomain] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [pendingLinkSource, setPendingLinkSource] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const initialTouchCellHadSameTerrainRef = useRef(false);
  const lastPaintedCoordRef = useRef(null);

  const activePlayers = selectedMeeples.map((meepleId, index) => {
    const meeple = MEEPLES.find(m => m.id === meepleId) || MEEPLES[index];
    const grid = playerGrids[meepleId] || createEmptyGrid(gridSize);
    const scoreData = calculateKingdomScore(grid, {
      middleEmpireBonus: bonuses.middleEmpire,
      harmonyBonus: bonuses.harmony
    });

    return {
      ...meeple,
      name: playerNames[meepleId] || meeple.label || `J${index + 1}`,
      grid,
      scoreData
    };
  });

  const currentPlayer = activePlayers.find(p => p.id === activePlayerId) || activePlayers[0];
  const currentGrid = playerGrids[currentPlayer.id] || createEmptyGrid(gridSize);
  const currentScoreData = calculateKingdomScore(currentGrid, {
    middleEmpireBonus: bonuses.middleEmpire,
    harmonyBonus: bonuses.harmony
  });

  const resizeExistingGrid = (oldGrid, newSize) => {
    const newGrid = createEmptyGrid(newSize);
    if (!Array.isArray(oldGrid)) return newGrid;
    const minSize = Math.min(oldGrid.length, newSize);
    for (let r = 0; r < minSize; r++) {
      for (let c = 0; c < minSize; c++) {
        const cell = oldGrid[r]?.[c];
        if (cell) {
          let link = cell.link;
          if (link === 'right' && c + 1 >= newSize) link = null;
          if (link === 'bottom' && r + 1 >= newSize) link = null;
          newGrid[r][c] = { ...cell, link };
        }
      }
    }
    return newGrid;
  };

  const handleGridSizeChange = (newSize) => {
    if (newSize === gridSize) return;
    playClickSound();
    setGridSize(newSize);
    const updatedGrids = {};
    selectedMeeples.forEach((id) => {
      updatedGrids[id] = resizeExistingGrid(playerGrids[id], newSize);
    });
    setPlayerGrids(updatedGrids);
    setHighlightedDomain(null);
    setPendingLinkSource(null);
  };

  const unlinkCell = (newGrid, r, c) => {
    const cell = newGrid[r][c];
    if (!cell.link) return;

    if (cell.link === 'right' && c + 1 < gridSize) {
      newGrid[r][c + 1].link = null;
    } else if (cell.link === 'left' && c - 1 >= 0) {
      newGrid[r][c - 1].link = null;
    } else if (cell.link === 'bottom' && r + 1 < gridSize) {
      newGrid[r + 1][c].link = null;
    } else if (cell.link === 'top' && r - 1 >= 0) {
      newGrid[r - 1][c].link = null;
    }
    cell.link = null;
  };

  const handleLinkModeClick = (r, c) => {
    const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));
    const cell = newGrid[r][c];

    if (cell.terrain === 'empty' || cell.terrain === 'chateau') {
      setPendingLinkSource(null);
      return;
    }

    if (!pendingLinkSource) {
      if (cell.link) {
        unlinkCell(newGrid, r, c);
        playTileSound();
        setPlayerGrids({ ...playerGrids, [currentPlayer.id]: newGrid });
        return;
      }
      setPendingLinkSource({ r, c });
      playClickSound();
    } else {
      const src = pendingLinkSource;
      const dr = Math.abs(src.r - r);
      const dc = Math.abs(src.c - c);

      if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
        unlinkCell(newGrid, src.r, src.c);
        unlinkCell(newGrid, r, c);

        if (r === src.r && c === src.c + 1) {
          newGrid[src.r][src.c].link = 'right';
          newGrid[r][c].link = 'left';
        } else if (r === src.r && c === src.c - 1) {
          newGrid[src.r][src.c].link = 'left';
          newGrid[r][c].link = 'right';
        } else if (r === src.r + 1 && c === src.c) {
          newGrid[src.r][src.c].link = 'bottom';
          newGrid[r][c].link = 'top';
        } else if (r === src.r - 1 && c === src.c) {
          newGrid[src.r][src.c].link = 'top';
          newGrid[r][c].link = 'bottom';
        }

        playCrownSound();
        setPlayerGrids({ ...playerGrids, [currentPlayer.id]: newGrid });
      }
      setPendingLinkSource(null);
    }
  };

  const paintCell = (r, c, cycleCrownsIfSame = false) => {
    const cell = currentGrid[r][c];
    const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));

    if (selectedTerrain === 'empty') {
      unlinkCell(newGrid, r, c);
      newGrid[r][c] = { terrain: 'empty', crowns: 0, link: null };
      playTileSound();
    } else if (selectedTerrain === 'chateau') {
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (newGrid[row][col].terrain === 'chateau') {
            newGrid[row][col] = { terrain: 'empty', crowns: 0, link: null };
          }
        }
      }
      unlinkCell(newGrid, r, c);
      newGrid[r][c] = { terrain: 'chateau', crowns: 0, link: null };
      playTileSound();
    } else {
      if (cycleCrownsIfSame && cell.terrain === selectedTerrain) {
        const maxCr = TERRAINS[selectedTerrain].maxCrowns;
        const nextCrowns = (cell.crowns + 1) > maxCr ? 0 : cell.crowns + 1;
        newGrid[r][c] = { ...cell, terrain: selectedTerrain, crowns: nextCrowns };
        playCrownSound();
      } else {
        const crownsToSet = (cell.terrain === selectedTerrain) ? cell.crowns : 0;
        newGrid[r][c] = { ...cell, terrain: selectedTerrain, crowns: crownsToSet };
        playTileSound();
      }
    }

    setPlayerGrids({
      ...playerGrids,
      [currentPlayer.id]: newGrid
    });
  };

  const handlePointerDown = (r, c) => {
    setConfirmClear(false);
    if (selectedTerrain === 'link') {
      handleLinkModeClick(r, c);
      return;
    }

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    lastPaintedCoordRef.current = `${r}-${c}`;
    
    const cell = currentGrid[r][c];
    initialTouchCellHadSameTerrainRef.current = (cell.terrain === selectedTerrain);

    if (cell.terrain !== selectedTerrain) {
      paintCell(r, c, false);
    }
  };

  const handlePointerEnter = (r, c) => {
    if (selectedTerrain === 'link') return;
    if (!isPointerDownRef.current) return;
    const coordKey = `${r}-${c}`;
    if (lastPaintedCoordRef.current === coordKey) return;

    hasDraggedRef.current = true;
    lastPaintedCoordRef.current = coordKey;
    paintCell(r, c, false);
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const handleCellClick = (r, c) => {
    if (selectedTerrain === 'link') return;
    if (!hasDraggedRef.current && initialTouchCellHadSameTerrainRef.current) {
      paintCell(r, c, true);
    }
    hasDraggedRef.current = false;
  };

  const handleResetCurrentGrid = () => {
    playClickSound();
    if (currentScoreData.totalPlacedCells > 0 && !confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    setConfirmClear(false);
    setPlayerGrids({
      ...playerGrids,
      [currentPlayer.id]: createEmptyGrid(gridSize)
    });
    setHighlightedDomain(null);
    setPendingLinkSource(null);
  };

  const handleCenterCastle = () => {
    playClickSound();
    const center = Math.floor(gridSize / 2);
    const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));
    const centerPreviousCell = { ...newGrid[center][center], link: null };
    let oldCastlePos = null;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (newGrid[r][c].terrain === 'chateau') {
          oldCastlePos = { r, c };
          unlinkCell(newGrid, r, c);
          newGrid[r][c] = { terrain: 'empty', crowns: 0, link: null };
        }
      }
    }

    unlinkCell(newGrid, center, center);
    newGrid[center][center] = { terrain: 'chateau', crowns: 0, link: null };

    if (oldCastlePos && (oldCastlePos.r !== center || oldCastlePos.c !== center) && centerPreviousCell.terrain !== 'empty') {
      newGrid[oldCastlePos.r][oldCastlePos.c] = centerPreviousCell;
    }

    setPlayerGrids({
      ...playerGrids,
      [currentPlayer.id]: newGrid
    });
  };

  const handleApplyScannedGrid = (scannedGrid) => {
    setPlayerGrids({
      ...playerGrids,
      [currentPlayer.id]: scannedGrid
    });
  };

  const formatEmptyCells = (count) => {
    if (count === 0) return 'Grille pleine';
    if (count === 1) return '1 case vide';
    return `${count} cases vides`;
  };

  const formatPlacedCells = (count) => {
    if (count <= 1) return `${count} case`;
    return `${count} cases`;
  };

  return (
    <div 
      className="space-y-3.5 max-w-sm sm:max-w-md mx-auto px-1 animate-fade-in select-none"
      onPointerUp={handlePointerUp}
    >
      {/* 1. Segmented Control de Sélection du Joueur */}
      <div className="bg-zinc-200/70 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          {activePlayers.map((player) => {
            const isSelected = player.id === currentPlayer.id;
            return (
              <button
                key={player.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setActivePlayerId(player.id);
                  setHighlightedDomain(null);
                  setPendingLinkSource(null);
                  setConfirmClear(false);
                }}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="text-xs font-bold truncate">
                    {player.name}
                  </span>
                </div>
                <span className={`text-xs font-extrabold tabular-nums px-1.5 py-0.5 rounded-md ml-1 ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'text-zinc-400 dark:text-zinc-500'
                }`}>
                  {player.scoreData.totalScore}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Carte Bento Résumé du Score & Bouton Photo */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3.5 border border-zinc-200/80 dark:border-zinc-800/80 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MeepleIcon color={currentPlayer.color} size={38} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {currentPlayer.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold">
                {gridSize}×{gridSize}
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {formatPlacedCells(currentScoreData.totalPlacedCells)} • {currentScoreData.totalCrowns} 👑
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsScannerOpen(true);
            }}
            className="px-2.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="Scanner le royaume avec l'appareil photo"
          >
            <Camera size={15} className="text-amber-500" />
            <span>Scanner</span>
          </button>

          <div className="text-right">
            <div className="text-2xl font-extrabold font-display tabular-nums text-zinc-900 dark:text-white leading-none">
              {currentScoreData.totalScore}
              <span className="text-xs font-sans text-zinc-400 dark:text-zinc-500 font-semibold ml-0.5">
                {currentScoreData.totalScore > 1 ? 'pts' : 'pt'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Contrôles de Grille (Segmented Control 5x5 / 7x7 & Actions) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleGridSizeChange(5)}
            className={`px-3 py-1 rounded-lg transition-all ${
              gridSize === 5 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-bold' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            5×5
          </button>
          <button
            type="button"
            onClick={() => handleGridSizeChange(7)}
            className={`px-3 py-1 rounded-lg transition-all ${
              gridSize === 7 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-bold' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            7×7
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCenterCastle}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all shadow-xs"
            title="Centrer le château"
          >
            <Castle size={13} className="text-amber-500" />
            <span>Centrer</span>
          </button>
          <button
            type="button"
            onClick={handleResetCurrentGrid}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              confirmClear
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400'
            }`}
            title="Vider la grille"
          >
            <RotateCcw size={13} />
            <span>{confirmClear ? 'Confirmer ?' : 'Vider'}</span>
          </button>
        </div>
      </div>

      {/* 4. Palette d'Outils Moderne */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 border border-zinc-200/80 dark:border-zinc-800/80 shadow-soft space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <Brush size={13} className="text-amber-500" />
            <span>Pinceau de domaine</span>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setPendingLinkSource(null);
              setSelectedTerrain(selectedTerrain === 'link' ? 'champs' : 'link');
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all ${
              selectedTerrain === 'link'
                ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Link2 size={12} />
            <span>{selectedTerrain === 'link' ? 'Liaison active' : 'Lier Domino'}</span>
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {Object.entries(TERRAINS).map(([key, terrain]) => {
            const isSelected = selectedTerrain === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  playClickSound();
                  setPendingLinkSource(null);
                  setSelectedTerrain(key);
                }}
                className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  isSelected
                    ? 'ring-2 ring-zinc-900 dark:ring-white scale-[1.02] shadow-xs ' + terrain.bgClass
                    : 'bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200/70 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-300 opacity-75 hover:opacity-100'
                }`}
              >
                <TerrainIcon type={key} size={16} />
                <span className="text-[10px] font-semibold truncate max-w-full">
                  {terrain.shortName}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 pt-0.5">
          <Info size={12} className="flex-shrink-0" />
          <span>
            {selectedTerrain === 'link'
              ? (pendingLinkSource ? 'Touchez une case adjacente pour lier le domino' : 'Touchez 2 cases adjacentes pour les lier en domino')
              : 'Touchez une case déjà peinte pour ajouter des 👑'}
          </span>
        </div>
      </div>

      {/* 5. Grille Interactive */}
      <div className="flex justify-center p-3 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-card overflow-x-auto">
        <div className="inline-block space-y-1.5">
          {currentGrid.map((row, r) => (
            <div key={r} className="flex gap-1.5">
              {row.map((cell, c) => {
                const isDomainHighlighted = highlightedDomain?.cells.some(
                  coord => coord.r === r && coord.c === c
                );
                const isIllegal = currentScoreData.illegalTiles?.some(
                  coord => coord.r === r && coord.c === c
                );
                const isPending = pendingLinkSource && pendingLinkSource.r === r && pendingLinkSource.c === c;

                return (
                  <TerrainTile
                    key={`${r}-${c}`}
                    cell={cell}
                    row={r}
                    col={c}
                    size={gridSize === 7 ? 'sm' : 'md'}
                    isHighlighted={isDomainHighlighted}
                    isIllegalConnection={isIllegal}
                    isLinkPending={isPending}
                    onClick={() => handleCellClick(r, c)}
                    onPointerDown={() => handlePointerDown(r, c)}
                    onPointerEnter={() => handlePointerEnter(r, c)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      playTileSound();
                      const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));
                      unlinkCell(newGrid, r, c);
                      newGrid[r][c] = { terrain: 'empty', crowns: 0, link: null };
                      setPlayerGrids({
                        ...playerGrids,
                        [currentPlayer.id]: newGrid
                      });
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Alertes de Règles Intelligentes */}
      {currentScoreData.warnings.length > 0 && (
        <div className="space-y-1.5">
          {currentScoreData.warnings.map((w, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs ${
                w.type === 'illegal'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
              }`}
            >
              <AlertTriangle size={15} className={w.type === 'illegal' ? 'text-rose-500 flex-shrink-0' : 'text-amber-500 flex-shrink-0'} />
              <span className="leading-snug">{w.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* 7. Points Additionnels */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 border border-zinc-200/80 dark:border-zinc-800/80 shadow-soft space-y-2.5">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
          Points additionnels
        </span>

        <div className="grid grid-cols-2 gap-2">
          {/* Empire du Milieu */}
          <div
            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
              currentScoreData.middleEmpireScore > 0
                ? 'bg-amber-500/8 dark:bg-amber-500/10 border-amber-500/40'
                : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200/70 dark:border-zinc-800/80'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex-1 min-w-0 leading-tight">
                Empire du Milieu
              </span>
              <span className={`text-[10px] font-bold tabular-nums px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                currentScoreData.middleEmpireScore > 0 
                  ? 'bg-amber-500 text-zinc-950' 
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {currentScoreData.middleEmpireScore > 0 ? '+10 pts' : '0 pt'}
              </span>
            </div>

            <div className="mt-1.5 text-[11px] font-medium">
              {currentScoreData.isCastleCentered ? (
                <span className="text-emerald-600 dark:text-emerald-400">✓ Château centré</span>
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500">Château non centré</span>
              )}
            </div>
          </div>

          {/* Harmonie */}
          <div
            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
              currentScoreData.harmonyScore > 0
                ? 'bg-emerald-500/8 dark:bg-emerald-500/10 border-emerald-500/40'
                : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200/70 dark:border-zinc-800/80'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex-1 min-w-0 leading-tight">
                Harmonie
              </span>
              <span className={`text-[10px] font-bold tabular-nums px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                currentScoreData.harmonyScore > 0 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {currentScoreData.harmonyScore > 0 ? '+5 pts' : '0 pt'}
              </span>
            </div>

            <div className="mt-1.5 text-[11px] font-medium">
              {currentScoreData.isCompleteKingdom ? (
                <span className="text-emerald-600 dark:text-emerald-400">✓ Grille pleine</span>
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500">{formatEmptyCells(currentScoreData.emptyCells)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 8. Détail des Domaines */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 border border-zinc-200/80 dark:border-zinc-800/80 shadow-soft space-y-2.5">
        <div className="space-y-0.5 text-left">
          <span className="font-semibold text-[11px] text-zinc-500 dark:text-zinc-400 block uppercase tracking-wider">
            Détail des Domaines ({currentScoreData.domains.length})
          </span>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
            <Info size={11} />
            <span>Touchez un domaine pour le mettre en évidence</span>
          </div>
        </div>

        {currentScoreData.domains.length === 0 ? (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 p-3 text-center bg-zinc-50 dark:bg-zinc-950/40 rounded-xl">
            Aucun terrain connecté pour le moment.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {currentScoreData.domains.map((dom) => {
              const terrain = TERRAINS[dom.terrain] || TERRAINS.empty;
              const isHighlighted = highlightedDomain?.id === dom.id;

              return (
                <button
                  key={dom.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setHighlightedDomain(isHighlighted ? null : dom);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isHighlighted
                      ? 'bg-amber-500/10 border-amber-500/60'
                      : 'bg-zinc-50/80 dark:bg-zinc-950/50 border-zinc-200/70 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${terrain.bgClass}`}>
                      <TerrainIcon type={dom.terrain} size={14} />
                    </div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {terrain.name}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 tabular-nums">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <span>{dom.size}</span>
                      <span>×</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">{dom.crowns} 👑</span>
                    </div>

                    <div className={`text-xs font-extrabold min-w-[48px] text-right ${
                      dom.score > 0 ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600'
                    }`}>
                      {dom.score} <span className="text-[10px] font-normal text-zinc-400">{dom.score > 1 ? 'pts' : 'pt'}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Scanner Photo */}
      <KingdomScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        gridSize={gridSize}
        playerName={currentPlayer.name}
        onApplyGrid={handleApplyScannedGrid}
      />
    </div>
  );
}
