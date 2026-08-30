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

  const sizeClasses = size === 'sm' 
    ? 'h-10 w-10 sm:h-12 sm:w-12 text-xs' 
    : 'h-13 w-13 sm:h-16 sm:w-16 text-sm';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      className={`
        relative rounded-xl flex items-center justify-center 
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
          <Castle size={size === 'sm' ? 22 : 28} className="fill-slate-900/30" />
        </div>
      )}

      {/* Normal Terrain State */}
      {!isEmpty && !isCastle && (
        <>
          <div className="opacity-85">
            <TerrainIcon 
              type={cell.terrain} 
              size={size === 'sm' ? 17 : 24} 
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
