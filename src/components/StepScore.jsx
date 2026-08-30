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
  Info
} from 'lucide-react';

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
    setGridSize(newSize);
    const updatedGrids = {};
    selectedMeeples.forEach((id) => {
      updatedGrids[id] = createEmptyGrid(newSize);
    });
    setPlayerGrids(updatedGrids);
    setHighlightedDomain(null);
  };

  // Helper to paint a cell with current brush
  const paintCell = (r, c, cycleCrownsIfSame = false) => {
    const cell = currentGrid[r][c];
    const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));

    if (selectedTerrain === 'empty') {
      newGrid[r][c] = { terrain: 'empty', crowns: 0 };
    } else if (selectedTerrain === 'chateau') {
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (newGrid[row][col].terrain === 'chateau') {
            newGrid[row][col] = { terrain: 'empty', crowns: 0 };
          }
        }
      }
      newGrid[r][c] = { terrain: 'chateau', crowns: 0 };
    } else {
      if (cycleCrownsIfSame && cell.terrain === selectedTerrain) {
        const maxCr = TERRAINS[selectedTerrain].maxCrowns;
        const nextCrowns = (cell.crowns + 1) > maxCr ? 0 : cell.crowns + 1;
        newGrid[r][c] = { terrain: selectedTerrain, crowns: nextCrowns };
      } else {
        // Place terrain with 0 crowns by default (or keep existing crowns if same)
        const crownsToSet = (cell.terrain === selectedTerrain) ? cell.crowns : 0;
        newGrid[r][c] = { terrain: selectedTerrain, crowns: crownsToSet };
      }
    }

    setPlayerGrids({
      ...playerGrids,
      [currentPlayer.id]: newGrid
    });
  };

  // Drag painting pointer events: paints immediately on first touch!
  const handlePointerDown = (r, c) => {
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    lastPaintedCoordRef.current = `${r}-${c}`;
    
    const cell = currentGrid[r][c];
    initialTouchCellHadSameTerrainRef.current = (cell.terrain === selectedTerrain);

    // If cell has different terrain, paint it immediately on pointer down!
    if (cell.terrain !== selectedTerrain) {
      paintCell(r, c, false);
    }
  };

  const handlePointerEnter = (r, c) => {
    if (!isPointerDownRef.current) return;
    const coordKey = `${r}-${c}`;
    if (lastPaintedCoordRef.current === coordKey) return;

    hasDraggedRef.current = true;
    lastPaintedCoordRef.current = coordKey;
    paintCell(r, c, false); // Drag paint mode
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const handleCellClick = (r, c) => {
    // If it was a single tap without dragging and the cell already had the same terrain, cycle crowns!
    if (!hasDraggedRef.current && initialTouchCellHadSameTerrainRef.current) {
      paintCell(r, c, true);
    }
    hasDraggedRef.current = false;
  };

  const handleResetCurrentGrid = () => {
    setPlayerGrids({
      ...playerGrids,
      [currentPlayer.id]: createEmptyGrid(gridSize)
    });
    setHighlightedDomain(null);
  };

  const handleCenterCastle = () => {
    const center = Math.floor(gridSize / 2);
    const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (newGrid[r][c].terrain === 'chateau') {
          newGrid[r][c] = { terrain: 'empty', crowns: 0 };
        }
      }
    }
    newGrid[center][center] = { terrain: 'chateau', crowns: 0 };
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
                  setActivePlayerId(player.id);
                  setHighlightedDomain(null);
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
              {currentScoreData.totalPlacedCells} cases • {currentScoreData.totalCrowns} 👑
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton Scanner Photo */}
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
            title="Scanner le royaume avec l'appareil photo"
          >
            <Camera size={16} />
            <span className="text-[9px] font-black uppercase">Photo</span>
          </button>

          <div className="text-right pl-1">
            <div className="text-2xl font-black font-medieval text-amber-300 leading-none">
              {currentScoreData.totalScore} <span className="text-xs font-sans text-slate-400 font-bold">pts</span>
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

      {/* 4. Palette d'Outils (Gomme, Château, 6 Terrains) */}
      <div className="bg-slate-900/95 rounded-2xl p-2.5 border border-slate-800 shadow-md space-y-2">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {Object.entries(TERRAINS).map(([key, terrain]) => {
            const isSelected = selectedTerrain === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedTerrain(key)}
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

        {/* Tip text en gris léger avec icône info */}
        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400/80 pt-0.5">
          <Info size={12} className="text-slate-400" />
          <span>Cliquer sur une case pour changer les 👑 • Glisser pour peindre</span>
        </div>
      </div>

      {/* 5. Grille Interactive (Tactile & Glisser de doigt instantané) */}
      <div className="flex justify-center p-2 sm:p-3 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-x-auto">
        <div className="inline-block space-y-1 sm:space-y-1.5">
          {currentGrid.map((row, r) => (
            <div key={r} className="flex gap-1 sm:gap-1.5">
              {row.map((cell, c) => {
                const isDomainHighlighted = highlightedDomain?.cells.some(
                  coord => coord.r === r && coord.c === c
                );

                return (
                  <TerrainTile
                    key={`${r}-${c}`}
                    cell={cell}
                    row={r}
                    col={c}
                    size={gridSize === 7 ? 'sm' : 'md'}
                    isHighlighted={isDomainHighlighted}
                    onClick={() => handleCellClick(r, c)}
                    onPointerDown={() => handlePointerDown(r, c)}
                    onPointerEnter={() => handlePointerEnter(r, c)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));
                      newGrid[r][c] = { terrain: 'empty', crowns: 0 };
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

      {/* 6. Alertes de Règles */}
      {currentScoreData.warnings.length > 0 && (
        <div className="space-y-1.5">
          {currentScoreData.warnings.map((w, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300"
            >
              <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
              <span>{w.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* 7. Bonus Officiels (Statuts épurés) */}
      <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-md space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Empire du Milieu */}
          <div
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
              currentScoreData.middleEmpireScore > 0
                ? 'bg-amber-500/15 border-amber-400 shadow ring-1 ring-amber-400/40'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                🏰 Empire Milieu
              </span>
              <span className="text-xs font-black text-amber-300 font-mono">
                +10 pts
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
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
              currentScoreData.harmonyScore > 0
                ? 'bg-emerald-500/15 border-emerald-400 shadow ring-1 ring-emerald-400/40'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                ✨ Harmonie
              </span>
              <span className="text-xs font-black text-emerald-300 font-mono">
                +5 pts
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
      <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-md space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200">
            Détail des Domaines ({currentScoreData.domains.length})
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Info size={11} className="text-slate-400" />
            <span>Touchez un domaine pour le surligner</span>
          </div>
        </div>

        {currentScoreData.domains.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-2.5 text-center bg-slate-950/40 rounded-xl">
            Aucun terrain posé pour l'instant.
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
                      = {dom.score} <span className="text-[9px] font-sans text-slate-400">pts</span>
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
