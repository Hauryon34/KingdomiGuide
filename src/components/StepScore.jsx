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
  Crown, 
  Castle, 
  RotateCcw, 
  AlertTriangle,
  Camera,
  Info,
  Brush,
  Link2,
  Unlink
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
  bonuses,
  setBonuses
}) {
  const [activePlayerId, setActivePlayerId] = useState(selectedMeeples[0] || 'blue');
  const [selectedTerrain, setSelectedTerrain] = useState('champs');
  const [highlightedDomain, setHighlightedDomain] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [pendingLinkSource, setPendingLinkSource] = useState(null); // { r, c } for domino linking

  // Pointer drag painting state
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

  const handleGridSizeChange = (newSize) => {
    if (newSize === gridSize) return;
    playClickSound();
    setGridSize(newSize);
    const updatedGrids = {};
    selectedMeeples.forEach((id) => {
      updatedGrids[id] = createEmptyGrid(newSize);
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
      // If already linked, click toggles/unlinks
      if (cell.link) {
        unlinkCell(newGrid, r, c);
        playTileSound();
        setPlayerGrids({ ...playerGrids, [currentPlayer.id]: newGrid });
        return;
      }
      // Set source for linking
      setPendingLinkSource({ r, c });
      playClickSound();
    } else {
      const src = pendingLinkSource;
      const dr = Math.abs(src.r - r);
      const dc = Math.abs(src.c - c);

      // Must be 4-way adjacent
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
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (newGrid[r][c].terrain === 'chateau') {
          newGrid[r][c] = { terrain: 'empty', crowns: 0, link: null };
        }
      }
    }
    newGrid[center][center] = { terrain: 'chateau', crowns: 0, link: null };
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

  const formatCrowns = (count) => {
    if (count <= 1) return `${count} 👑`;
    return `${count} 👑`;
  };

  return (
    <div 
      className="space-y-4 max-w-sm sm:max-w-md mx-auto px-1 animate-fade-in select-none"
      onPointerUp={handlePointerUp}
    >
      {/* 1. Sélecteur de Joueur (Compact) */}
      <div className="bg-slate-900/90 rounded-2xl p-1.5 border border-slate-800 shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
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
                }}
                className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? `${player.border} ${player.bgLight} ring-2 ring-amber-400/80 shadow-md`
                    : 'border-slate-800/80 bg-slate-950/40 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <MeepleIcon color={player.color} size={22} showCrown={isSelected} />
                  <span className="text-xs font-bold truncate text-slate-200">
                    {player.name}
                  </span>
                </div>
                <span className="text-xs font-black text-amber-300 bg-slate-950/80 px-1.5 py-0.5 rounded-md border border-slate-800 ml-1">
                  {player.scoreData.totalScore}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Bandeau Score Total & Bouton Scanner 📷 */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-3.5 border border-slate-800 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MeepleIcon color={currentPlayer.color} size={36} />
          <div>
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>Royaume {currentPlayer.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                {gridSize}×{gridSize}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {formatPlacedCells(currentScoreData.totalPlacedCells)} • {formatCrowns(currentScoreData.totalCrowns)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsScannerOpen(true);
            }}
            className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
            title="Scanner le royaume avec l'appareil photo"
          >
            <Camera size={16} />
            <span className="text-[9px] font-black uppercase">Photo</span>
          </button>

          <div className="text-right pl-1">
            <div className="text-2xl font-black font-medieval text-amber-300 leading-none">
              {currentScoreData.totalScore} <span className="text-xs font-sans text-slate-400 font-bold">{currentScoreData.totalScore > 1 ? 'pts' : 'pt'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Contrôles de Grille (Taille 5x5/7x7 & Outils) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => handleGridSizeChange(5)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              gridSize === 5 
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            5×5
          </button>
          <button
            type="button"
            onClick={() => handleGridSizeChange(7)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              gridSize === 7 
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            7×7 Duel
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCenterCastle}
            className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-amber-300 flex items-center gap-1 transition-all"
            title="Centrer le château"
          >
            <Castle size={13} />
            <span>Centrer</span>
          </button>
          <button
            type="button"
            onClick={handleResetCurrentGrid}
            className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-all"
            title="Vider la grille"
          >
            <RotateCcw size={13} />
            <span>Vider</span>
          </button>
        </div>
      </div>

      {/* 4. Palette d'Outils avec Pinceau & Bouton de Liaison Domino 🔗 */}
      <div className="bg-slate-900/95 rounded-2xl p-3 border border-slate-800 shadow-md space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Brush size={14} className="text-amber-400" />
            <span>Pinceau de domaine</span>
          </div>

          {/* Bouton de Liaison Domino */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setPendingLinkSource(null);
              setSelectedTerrain(selectedTerrain === 'link' ? 'champs' : 'link');
            }}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
              selectedTerrain === 'link'
                ? 'bg-indigo-500 text-white shadow-md ring-2 ring-indigo-300 scale-105'
                : 'bg-slate-950 border border-slate-800 text-indigo-300 hover:bg-slate-800'
            }`}
          >
            <Link2 size={13} />
            <span>{selectedTerrain === 'link' ? 'Mode Liaison Actif' : 'Lier Domino 🔗'}</span>
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
                className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-0.5 transition-all ${
                  isSelected
                    ? 'ring-2 ring-amber-400 scale-102 shadow-md border-amber-300 ' + terrain.bgClass
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <TerrainIcon type={key} size={17} />
                <span className="text-[10px] font-bold truncate max-w-full">
                  {terrain.shortName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tip text contextuel */}
        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400/80 pt-0.5">
          <Info size={12} className="text-slate-400" />
          <span>
            {selectedTerrain === 'link'
              ? (pendingLinkSource ? 'Touchez une case adjacente pour former le domino 🔗' : 'Touchez 2 cases adjacentes pour les lier en domino (ou touchez une liaison pour la retirer)')
              : 'Cliquer sur une case pour changer les 👑'}
          </span>
        </div>
      </div>

      {/* 5. Grille Interactive */}
      <div className="flex justify-center p-2 sm:p-3 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-x-auto">
        <div className="inline-block space-y-1 sm:space-y-1.5">
          {currentGrid.map((row, r) => (
            <div key={r} className="flex gap-1 sm:gap-1.5">
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
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                w.type === 'illegal'
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 animate-pulse'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <AlertTriangle size={14} className={w.type === 'illegal' ? 'text-rose-400 flex-shrink-0' : 'text-amber-400 flex-shrink-0'} />
              <span>{w.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* 7. Points Additionnels */}
      <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-md space-y-2.5">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Points additionnels
        </span>

        <div className="grid grid-cols-2 gap-2">
          {/* Empire du Milieu */}
          <div
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
              currentScoreData.middleEmpireScore > 0
                ? 'bg-amber-500/15 border-amber-400 shadow ring-1 ring-amber-400/40'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-bold text-slate-200 flex-1 min-w-0 leading-tight">
                🏰 Empire Milieu
              </span>
              <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                currentScoreData.middleEmpireScore > 0 
                  ? 'bg-amber-400 text-slate-950 shadow-sm' 
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {currentScoreData.middleEmpireScore > 0 ? '+10 pts' : '0 pt'}
              </span>
            </div>

            <div className="mt-1.5 text-[10px] flex items-center gap-1 font-medium">
              {currentScoreData.isCastleCentered ? (
                <span className="text-emerald-400">✓ Château centré</span>
              ) : (
                <span className="text-slate-400">✗ Château non centré</span>
              )}
            </div>
          </div>

          {/* Harmonie */}
          <div
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
              currentScoreData.harmonyScore > 0
                ? 'bg-emerald-500/15 border-emerald-400 shadow ring-1 ring-emerald-400/40'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-bold text-slate-200 flex-1 min-w-0 leading-tight">
                ✨ Harmonie
              </span>
              <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                currentScoreData.harmonyScore > 0 
                  ? 'bg-emerald-400 text-slate-950 shadow-sm' 
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {currentScoreData.harmonyScore > 0 ? '+5 pts' : '0 pt'}
              </span>
            </div>

            <div className="mt-1.5 text-[10px] flex items-center gap-1 font-medium">
              {currentScoreData.isCompleteKingdom ? (
                <span className="text-emerald-400">✓ Grille pleine</span>
              ) : (
                <span className="text-slate-400">✗ {formatEmptyCells(currentScoreData.emptyCells)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 8. Liste des Domaines */}
      <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-md space-y-2.5">
        <div className="space-y-0.5 text-left">
          <span className="font-bold text-xs text-slate-200 block uppercase tracking-wider">
            Détail des Domaines ({currentScoreData.domains.length})
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Info size={11} className="text-slate-400" />
            <span>Touchez un domaine pour le surligner sur la grille</span>
          </div>
        </div>

        {currentScoreData.domains.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-2.5 text-center bg-slate-950/40 rounded-xl">
            Aucun terrain valide connecté pour l'instant.
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
                  className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isHighlighted
                      ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-300'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-lg ${terrain.bgClass}`}>
                      <TerrainIcon type={dom.terrain} size={14} />
                    </div>
                    <div className="text-xs font-bold text-slate-200">
                      {terrain.name}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <span>{dom.size}</span>
                      <span>×</span>
                      <span className="text-amber-300 font-bold">{dom.crowns} 👑</span>
                    </div>

                    <div className={`text-xs font-black min-w-[45px] text-right font-mono ${
                      dom.score > 0 ? 'text-amber-300' : 'text-slate-600'
                    }`}>
                      = {dom.score} <span className="text-[9px] font-sans text-slate-400">{dom.score > 1 ? 'pts' : 'pt'}</span>
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
