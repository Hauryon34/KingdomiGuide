export const MEEPLES = [
  {
    id: 'blue',
    label: 'Bleu',
    color: '#0EA5E9',
    gradient: 'from-sky-400 to-sky-600',
    border: 'border-sky-500',
    bgLight: 'bg-sky-500/10 dark:bg-sky-500/15',
    text: 'text-sky-600 dark:text-sky-400',
    woodColor: '#0284C7'
  },
  {
    id: 'green',
    label: 'Vert',
    color: '#10B981',
    gradient: 'from-emerald-400 to-emerald-600',
    border: 'border-emerald-500',
    bgLight: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    woodColor: '#059669'
  },
  {
    id: 'yellow',
    label: 'Jaune',
    color: '#F59E0B',
    gradient: 'from-amber-400 to-amber-500',
    border: 'border-amber-500',
    bgLight: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    woodColor: '#D97706'
  },
  {
    id: 'pink',
    label: 'Rose',
    color: '#F43F5E',
    gradient: 'from-rose-400 to-rose-600',
    border: 'border-rose-500',
    bgLight: 'bg-rose-500/10 dark:bg-rose-500/15',
    text: 'text-rose-600 dark:text-rose-400',
    woodColor: '#E11D48'
  }
];

export const TERRAINS = {
  empty: {
    id: 'empty',
    name: 'Gomme',
    shortName: 'Gomme',
    color: '#71717A',
    maxCrowns: 0,
    icon: 'Eraser',
    bgClass: 'bg-zinc-100/90 dark:bg-zinc-900/60 border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400',
    badgeClass: 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
    description: 'Effacer la case'
  },
  chateau: {
    id: 'chateau',
    name: 'Château',
    shortName: 'Château',
    color: '#F4F4F5',
    maxCrowns: 0,
    icon: 'Castle',
    bgClass: 'terrain-chateau text-zinc-900 border-amber-400/90 dark:border-zinc-300 font-semibold',
    badgeClass: 'bg-zinc-200 text-zinc-900',
    description: 'Château de départ'
  },
  champs: {
    id: 'champs',
    name: 'Blé',
    shortName: 'Blé',
    color: '#F59E0B',
    maxCrowns: 1,
    icon: 'Wheat',
    bgClass: 'terrain-champs text-amber-950 border-amber-400/80',
    badgeClass: 'bg-amber-500 text-amber-950',
    description: 'Champs de blé (max 1 👑)'
  },
  foret: {
    id: 'foret',
    name: 'Forêt',
    shortName: 'Forêt',
    color: '#10B981',
    maxCrowns: 1,
    icon: 'Trees',
    bgClass: 'terrain-foret text-white border-emerald-500/80',
    badgeClass: 'bg-emerald-600 text-white',
    description: 'Forêt dense (max 1 👑)'
  },
  eau: {
    id: 'eau',
    name: 'Eau',
    shortName: 'Eau',
    color: '#0EA5E9',
    maxCrowns: 1,
    icon: 'Waves',
    bgClass: 'terrain-eau text-white border-sky-400/80',
    badgeClass: 'bg-sky-600 text-white',
    description: 'Lacs & Mer (max 1 👑)'
  },
  prairie: {
    id: 'prairie',
    name: 'Prairie',
    shortName: 'Prairie',
    color: '#84CC16',
    maxCrowns: 2,
    icon: 'Sprout',
    bgClass: 'terrain-prairie text-lime-950 border-lime-500/80',
    badgeClass: 'bg-lime-600 text-white',
    description: 'Prairies vertes (max 2 👑)'
  },
  marais: {
    id: 'marais',
    name: 'Marais',
    shortName: 'Marais',
    color: '#9333EA',
    maxCrowns: 2,
    icon: 'Eye',
    bgClass: 'terrain-marais text-white border-purple-400/80',
    badgeClass: 'bg-purple-600 text-white',
    description: 'Marais (max 2 👑)'
  },
  mine: {
    id: 'mine',
    name: 'Mine',
    shortName: 'Mine',
    color: '#3F3F46',
    maxCrowns: 3,
    icon: 'Pickaxe',
    bgClass: 'terrain-mine text-zinc-100 border-zinc-500/80',
    badgeClass: 'bg-zinc-700 text-amber-300',
    description: 'Mines d’or (max 3 👑)'
  }
};

export const GAME_SETUP_RULES = {
  2: {
    classic: {
      discardCount: 24,
      totalTiles: 24,
      gridSize: 5,
      meeplesPerPlayer: 2,
      tilesPerTurn: 4,
      label: 'Classique (5×5)',
      description: 'Défaussez 24 dominos. Chaque joueur a 2 pions.'
    },
    duel: {
      discardCount: 0,
      totalTiles: 48,
      gridSize: 7,
      meeplesPerPlayer: 2,
      tilesPerTurn: 4,
      label: 'Grand Duel (7×7)',
      description: 'Tous les 48 dominos sont en jeu.'
    }
  },
  3: {
    classic: {
      discardCount: 12,
      totalTiles: 36,
      gridSize: 5,
      meeplesPerPlayer: 1,
      tilesPerTurn: 3,
      label: '3 Joueurs (5×5)',
      description: 'Défaussez 12 dominos au hasard.'
    }
  },
  4: {
    classic: {
      discardCount: 0,
      totalTiles: 48,
      gridSize: 5,
      meeplesPerPlayer: 1,
      tilesPerTurn: 4,
      label: '4 Joueurs (5×5)',
      description: 'Tous les 48 dominos sont utilisés.'
    }
  }
};
