import React from 'react';
import { 
  Wheat, 
  Trees, 
  Waves, 
  Sprout, 
  Eye, 
  Pickaxe, 
  Castle, 
  Eraser, 
  Crown,
  Grid
} from 'lucide-react';

export default function TerrainIcon({ type, size = 20, className = '' }) {
  switch (type) {
    case 'champs':
      return <Wheat size={size} className={className} />;
    case 'foret':
      return <Trees size={size} className={className} />;
    case 'eau':
      return <Waves size={size} className={className} />;
    case 'prairie':
      return <Sprout size={size} className={className} />;
    case 'marais':
      return <Eye size={size} className={className} />;
    case 'mine':
      return <Pickaxe size={size} className={className} />;
    case 'chateau':
      return <Castle size={size} className={className} />;
    case 'crown':
      return <Crown size={size} className={`text-amber-400 fill-amber-400 drop-shadow ${className}`} />;
    case 'empty':
    default:
      return <Eraser size={size} className={className} />;
  }
}
