import React from 'react';
import { TERRAINS } from '../types/kingdomino';
import TerrainIcon from './TerrainIcon';
import { Crown, Castle } from 'lucide-react';

export default function TerrainTile({
  cell,
  row,
  col,
  isSelected = false,
  isHighlighted = false,
  onClick,
  onContextMenu,
  onPointerDown,
  onPointerEnter,
  size = 'md'
}) {
  const terrainInfo = TERRAINS[cell.terrain] || TERRAINS.empty;
  const isCastle = cell.terrain === 'chateau';
  const isEmpty = cell.terrain === 'empty';

  // Fix: Tailles rigides garanties avec min-width/min-height et aspect-square
  const sizeClasses = size === 'sm' 
    ? 'w-10 h-10 min-w-[40px] min-h-[40px] sm:w-12 sm:h-12 sm:min-w-[48px] sm:min-h-[48px] rounded-xl text-xs flex-shrink-0 aspect-square' 
    : 'w-14 h-14 min-w-[56px] min-h-[56px] sm:w-16 sm:h-16 sm:min-w-[64px] sm:min-h-[64px] rounded-2xl text-sm flex-shrink-0 aspect-square';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      className={`
        relative flex items-center justify-center 
        transition-all duration-100 select-none cursor-pointer
        border-2 shadow-sm touch-none
        ${sizeClasses}
        ${terrainInfo.bgClass}
        ${isSelected ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 z-10 scale-105' : ''}
        ${isHighlighted ? 'ring-2 ring-yellow-300 animate-pulse scale-102' : ''}
      `}
      title={`${terrainInfo.name} (${row + 1}, ${col + 1}) - ${cell.crowns} 👑`}
    >
      {/* Empty State */}
      {isEmpty && (
        <span className="text-[10px] font-mono opacity-25 text-slate-400">
          {row + 1},{col + 1}
        </span>
      )}

      {/* Castle State (Just the icon, clean, centered, no conflicting text) */}
      {isCastle && (
        <div className="flex items-center justify-center text-slate-900">
          <Castle size={size === 'sm' ? 20 : 28} className="fill-slate-900/30" />
        </div>
      )}

      {/* Normal Terrain State */}
      {!isEmpty && !isCastle && (
        <>
          <div className="opacity-85">
            <TerrainIcon 
              type={cell.terrain} 
              size={size === 'sm' ? 18 : 24} 
            />
          </div>

          {/* Crowns Display Badge */}
          {cell.crowns > 0 && (
            <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/50 px-1 py-0.5 rounded-full border border-amber-300/40">
              <Crown 
                size={size === 'sm' ? 10 : 12} 
                className="text-amber-300 fill-amber-400 crown-glow" 
              />
              <span className="text-[10px] font-black text-amber-200 leading-none">
                {cell.crowns}
              </span>
            </div>
          )}
        </>
      )}

      {/* Discreet coordinate indicator in bottom left on non-empty cells */}
      {!isEmpty && (
        <span className="absolute bottom-0.5 left-1 text-[8px] font-mono opacity-30 pointer-events-none">
          {row + 1},{col + 1}
        </span>
      )}
    </div>
  );
}
