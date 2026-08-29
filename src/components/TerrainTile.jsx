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
  size = 'md' // 'sm' (for 7x7), 'md' (for 5x5)
}) {
  const terrainInfo = TERRAINS[cell.terrain] || TERRAINS.empty;
  const isCastle = cell.terrain === 'chateau';
  const isEmpty = cell.terrain === 'empty';

  // Responsive tile sizing
  const sizeClasses = size === 'sm' 
    ? 'h-10 w-10 sm:h-12 sm:w-12 text-xs' 
    : 'h-14 w-14 sm:h-16 sm:w-16 text-sm';

  return (
    <button
      type="button"
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`
        relative rounded-xl flex flex-col items-center justify-center 
        transition-all duration-150 active:scale-95 select-none
        border-2 shadow-sm
        ${sizeClasses}
        ${terrainInfo.bgClass}
        ${isSelected ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 z-10 scale-105' : ''}
        ${isHighlighted ? 'ring-2 ring-yellow-300 animate-pulse' : ''}
      `}
      title={`${terrainInfo.name} (${row + 1}, ${col + 1}) - ${cell.crowns} couronne(s)`}
    >
      {/* Empty State */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center opacity-30 text-slate-400">
          <span className="text-[10px] font-mono">{row + 1},{col + 1}</span>
        </div>
      )}

      {/* Castle State */}
      {isCastle && (
        <div className="flex flex-col items-center justify-center">
          <div className="p-1 rounded-lg bg-amber-500/20 text-slate-800">
            <Castle size={size === 'sm' ? 18 : 24} className="text-slate-800 fill-slate-800/30" />
          </div>
          <span className="text-[9px] font-extrabold tracking-tight uppercase mt-0.5 text-slate-800">
            Château
          </span>
        </div>
      )}

      {/* Terrain Normal State */}
      {!isEmpty && !isCastle && (
        <>
          {/* Main Terrain Icon */}
          <div className="opacity-80">
            <TerrainIcon 
              type={cell.terrain} 
              size={size === 'sm' ? 16 : 22} 
            />
          </div>

          {/* Crowns Display */}
          {cell.crowns > 0 && (
            <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/40 px-1 py-0.5 rounded-full border border-amber-300/40">
              <Crown 
                size={size === 'sm' ? 10 : 13} 
                className="text-amber-300 fill-amber-400 crown-glow" 
              />
              <span className="text-[10px] font-black text-amber-200 leading-none">
                {cell.crowns}
              </span>
            </div>
          )}
        </>
      )}

      {/* Quick Coordinate indicator in bottom left */}
      {!isEmpty && (
        <span className="absolute bottom-0.5 left-1 text-[8px] font-mono opacity-40">
          {row + 1},{col + 1}
        </span>
      )}
    </button>
  );
}
