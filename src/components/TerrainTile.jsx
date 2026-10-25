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

  const sizeClasses = size === 'sm' 
    ? 'w-10 h-10 min-w-[40px] min-h-[40px] sm:w-12 sm:h-12 sm:min-w-[48px] sm:min-h-[48px] text-xs flex-shrink-0 aspect-square' 
    : 'w-14 h-14 min-w-[56px] min-h-[56px] sm:w-16 sm:h-16 sm:min-w-[64px] sm:min-h-[64px] text-sm flex-shrink-0 aspect-square';

  let roundedClasses = size === 'sm' ? 'rounded-xl' : 'rounded-2xl';
  let linkedBorders = 'border';
  let ringClasses = '';

  if (cell.link) {
    ringClasses = 'ring-2 ring-amber-400 z-10 shadow-sm';
    if (cell.link === 'right') {
      roundedClasses = size === 'sm' ? 'rounded-l-xl rounded-r-none' : 'rounded-l-2xl rounded-r-none';
      linkedBorders = 'border border-r-0 border-amber-400';
    } else if (cell.link === 'left') {
      roundedClasses = size === 'sm' ? 'rounded-r-xl rounded-l-none' : 'rounded-r-2xl rounded-l-none';
      linkedBorders = 'border border-l-0 border-amber-400';
    } else if (cell.link === 'bottom') {
      roundedClasses = size === 'sm' ? 'rounded-t-xl rounded-b-none' : 'rounded-t-2xl rounded-b-none';
      linkedBorders = 'border border-b-0 border-amber-400';
    } else if (cell.link === 'top') {
      roundedClasses = size === 'sm' ? 'rounded-b-xl rounded-t-none' : 'rounded-b-2xl rounded-t-none';
      linkedBorders = 'border border-t-0 border-amber-400';
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${terrainInfo.name} (${row + 1}, ${col + 1})${cell.crowns ? ` - ${cell.crowns} couronnes` : ''}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPointerDown?.();
          onClick?.();
        }
      }}
      onContextMenu={onContextMenu}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      className={`
        relative flex items-center justify-center 
        transition-all duration-150 select-none cursor-pointer
        touch-none
        ${sizeClasses}
        ${roundedClasses}
        ${linkedBorders}
        ${terrainInfo.bgClass}
        ${ringClasses}
        ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 z-20 scale-[1.03]' : ''}
        ${isLinkPending ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 z-20 animate-pulse scale-[1.03]' : ''}
        ${isHighlighted ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900 scale-[1.02] z-10' : ''}
        ${isIllegalConnection ? '!ring-2 !ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900 animate-pulse z-20' : ''}
      `}
      title={`${terrainInfo.name} (${row + 1}, ${col + 1}) - ${cell.crowns} 👑`}
    >
      {/* Empty State: coordonnée uniquement quand la case est vide */}
      {isEmpty && (
        <span className="text-[10px] font-medium tabular-nums opacity-40 dark:opacity-30 text-zinc-400 dark:text-zinc-500">
          {row + 1},{col + 1}
        </span>
      )}

      {/* Castle State */}
      {isCastle && (
        <div className="flex items-center justify-center text-zinc-800">
          <Castle size={size === 'sm' ? 19 : 25} className="fill-amber-400/35 text-zinc-800" />
        </div>
      )}

      {/* Normal Terrain State */}
      {!isEmpty && !isCastle && (
        <>
          <div className="opacity-95">
            <TerrainIcon 
              type={cell.terrain} 
              size={size === 'sm' ? 17 : 22} 
            />
          </div>

          {/* Crowns Display Badge */}
          {cell.crowns > 0 && (
            <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-zinc-950/75 backdrop-blur-xs px-1.5 py-0.5 rounded-full border border-white/15 shadow-xs">
              <Crown 
                size={size === 'sm' ? 9 : 11} 
                className="text-amber-300 fill-amber-400" 
              />
              <span className="text-[10px] font-bold tabular-nums text-white leading-none">
                {cell.crowns}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
