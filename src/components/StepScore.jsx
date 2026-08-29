import React, { useState } from 'react';
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
  Sparkles
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
  const [selectedCrowns, setSelectedCrowns] = useState(1);
  const [highlightedDomain, setHighlightedDomain] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

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

  const handleCellClick = (r, c) => {
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
      if (cell.terrain === selectedTerrain) {
        const maxCr = TERRAINS[selectedTerrain].maxCrowns;
        const nextCrowns = (cell.crowns + 1) > maxCr ? 0 : cell.crowns + 1;
        newGrid[r][c] = { terrain: selectedTerrain, crowns: nextCrowns };
      } else {
        const maxCr = TERRAINS[selectedTerrain].maxCrowns;
        const crownsToApply = Math.min(selectedCrowns, maxCr);
        newGrid[r][c] = { terrain: selectedTerrain, crowns: crownsToApply };
      }
    }

    setPlayerGrids({
      ...playerGrids,
      [currentPlayer.id]: newGrid
    });
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

  return (
    <div className="space-y-4 max-w-sm sm:max-w-md mx-auto px-1 animate-fade-in">
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

      {/* 4. Palette d'Outils Compacte */}
      <div className="bg-slate-900/95 rounded-2xl p-2.5 border border-slate-800 shadow-md space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-slate-300">Pinceau terrain :</span>
          <span className="text-amber-400/90 text-[10px]">
            Clic case = change les 👑
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {Object.entries(TERRAINS).map(([key, terrain]) => {
            const isSelected = selectedTerrain === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedTerrain(key);
                  if (key === 'champs' || key === 'foret' || key === 'eau') {
                    if (selectedCrowns > 1) setSelectedCrowns(1);
                  } else if (key === 'prairie' || key === 'marais') {
                    if (selectedCrowns > 2) setSelectedCrowns(2);
                  }
                }}
                className={`py-1.5 px-1 rounded-xl border flex flex-col items-center gap-0.5 transition-all ${
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

        {!['empty', 'chateau'].includes(selectedTerrain) && (
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Crown size={12} className="text-amber-400 fill-amber-400" />
              Couronnes par défaut :
            </span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3].map((num) => {
                const maxAllowed = TERRAINS[selectedTerrain]?.maxCrowns ?? 3;
                const isDisabled = num > maxAllowed;
                const isPicked = selectedCrowns === num;

                return (
                  <button
                    key={num}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setSelectedCrowns(num)}
                    className={`w-7 h-6 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-0.5 ${
                      isPicked
                        ? 'bg-amber-400 text-slate-950 shadow ring-1 ring-yellow-300'
                        : isDisabled
                        ? 'bg-slate-950 text-slate-700 cursor-not-allowed opacity-30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{num}</span>
                    {num > 0 && <Crown size={9} className={isPicked ? 'fill-slate-950' : 'fill-amber-400 text-amber-400'} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
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

                return (
                  <TerrainTile
                    key={`${r}-${c}`}
                    cell={cell}
                    row={r}
                    col={c}
                    size={gridSize === 7 ? 'sm' : 'md'}
                    isHighlighted={isDomainHighlighted}
                    onClick={() => handleCellClick(r, c)}
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

      {/* 7. Bonus Officiels */}
      <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-md space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Bonus de Règles</span>
          <span className="text-slate-400 font-normal text-[10px]">
            Toucher pour activer/désactiver
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Empire du Milieu */}
          <button
            type="button"
            onClick={() => setBonuses(prev => ({ ...prev, middleEmpire: !prev.middleEmpire }))}
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
              currentScoreData.middleEmpireScore > 0
                ? 'bg-amber-500/15 border-amber-400 shadow ring-1 ring-amber-400/40'
                : bonuses.middleEmpire
                ? 'bg-slate-950/60 border-slate-800'
                : 'bg-slate-950/20 border-slate-900 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                🏰 Empire Milieu
              </span>
              <span className="text-xs font-black text-amber-300 font-mono">
                +{currentScoreData.middleEmpireScore}
              </span>
            </div>

            <div className="mt-1.5 text-[10px] flex items-center gap-1 font-medium">
              {currentScoreData.isCastleCentered ? (
                <span className="text-emerald-400">✓ Château centré (+10)</span>
              ) : (
                <span className="text-slate-400">✗ Non centré (+0)</span>
              )}
            </div>
          </button>

          {/* Harmonie */}
          <button
            type="button"
            onClick={() => setBonuses(prev => ({ ...prev, harmony: !prev.harmony }))}
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
              currentScoreData.harmonyScore > 0
                ? 'bg-emerald-500/15 border-emerald-400 shadow ring-1 ring-emerald-400/40'
                : bonuses.harmony
                ? 'bg-slate-950/60 border-slate-800'
                : 'bg-slate-950/20 border-slate-900 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                ✨ Harmonie
              </span>
              <span className="text-xs font-black text-emerald-300 font-mono">
                +{currentScoreData.harmonyScore}
              </span>
            </div>

            <div className="mt-1.5 text-[10px] flex items-center gap-1 font-medium">
              {currentScoreData.isCompleteKingdom ? (
                <span className="text-emerald-400">✓ Grille pleine (+5)</span>
              ) : (
                <span className="text-slate-400">✗ {currentScoreData.emptyCells} vide(s)</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* 8. Liste des Domaines */}
      <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-md space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200">
            Détail des Domaines ({currentScoreData.domains.length})
          </span>
          <span className="text-[10px] text-amber-400">
            Touchez pour surligner
          </span>
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
