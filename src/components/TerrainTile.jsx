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
  isIllegalConnection = false,
  isLinkPending = false,
  onClick,
  onContextMenu,
  onPointerDown,
  onPointerEnter,
  size = 'md'
}) {
  const terrainInfo = TERRAINS[cell.terrain] || TERRAINS.empty;
  const isCastle = cell.terrain === 'chateau';
  const isEmpty = cell.terrain === 'empty';

  // Tailles rigides garanties avec min-width/min-height et aspect-square
  const sizeClasses = size === 'sm' 
    ? 'w-10 h-10 min-w-[40px] min-h-[40px] sm:w-12 sm:h-12 sm:min-w-[48px] sm:min-h-[48px] text-xs flex-shrink-0 aspect-square' 
    : 'w-14 h-14 min-w-[56px] min-h-[56px] sm:w-16 sm:h-16 sm:min-w-[64px] sm:min-h-[64px] text-sm flex-shrink-0 aspect-square';

  // Gestion du contour doré englobant le domino lié (sans rivets)
  let roundedClasses = size === 'sm' ? 'rounded-xl' : 'rounded-2xl';
  let linkedBorders = 'border-2';
  let ringClasses = '';

  if (cell.link) {
    ringClasses = 'ring-2 ring-amber-400/90 z-10 shadow-md';
    if (cell.link === 'right') {
      roundedClasses = size === 'sm' ? 'rounded-l-xl rounded-r-none' : 'rounded-l-2xl rounded-r-none';
      linkedBorders = 'border-2 border-r-0 border-amber-400/90';
    } else if (cell.link === 'left') {
      roundedClasses = size === 'sm' ? 'rounded-r-xl rounded-l-none' : 'rounded-r-2xl rounded-l-none';
      linkedBorders = 'border-2 border-l-0 border-amber-400/90';
    } else if (cell.link === 'bottom') {
      roundedClasses = size === 'sm' ? 'rounded-t-xl rounded-b-none' : 'rounded-t-2xl rounded-b-none';
      linkedBorders = 'border-2 border-b-0 border-amber-400/90';
    } else if (cell.link === 'top') {
      roundedClasses = size === 'sm' ? 'rounded-b-xl rounded-t-none' : 'rounded-b-2xl rounded-t-none';
      linkedBorders = 'border-2 border-t-0 border-amber-400/90';
    }
  }

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
        shadow-sm touch-none
        ${sizeClasses}
        ${roundedClasses}
        ${linkedBorders}
        ${terrainInfo.bgClass}
        ${ringClasses}
        ${isSelected ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 z-20 scale-105' : ''}
        ${isLinkPending ? 'ring-4 ring-indigo-400 ring-offset-2 ring-offset-slate-900 z-20 animate-bounce scale-105' : ''}
        ${isHighlighted ? 'ring-2 ring-yellow-300 animate-pulse scale-102 z-10' : ''}
        ${isIllegalConnection ? '!ring-2 !ring-rose-500 ring-offset-1 ring-offset-slate-900 animate-pulse z-20' : ''}
      `}
      title={`${terrainInfo.name} (${row + 1}, ${col + 1}) - ${cell.crowns} 👑`}
    >
      {/* Empty State: coordonnée visible UNIQUEMENT quand la case est vide */}
      {isEmpty && (
        <span className="text-[10px] font-mono opacity-25 text-slate-400">
          {row + 1},{col + 1}
        </span>
      )}

      {/* Castle State */}
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
    </div>
  );
}
