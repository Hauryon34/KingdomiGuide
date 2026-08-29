export const MEEPLES = [
  {
    id: 'blue',
    label: 'Bleu',
    color: '#0284c7',
    gradient: 'from-sky-500 to-blue-700',
    border: 'border-sky-500',
    bgLight: 'bg-sky-500/20',
    text: 'text-sky-400',
    woodColor: '#1d4ed8'
  },
  {
    id: 'green',
    label: 'Vert',
    color: '#16a34a',
    gradient: 'from-emerald-500 to-green-700',
    border: 'border-emerald-500',
    bgLight: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    woodColor: '#15803d'
  },
  {
    id: 'yellow',
    label: 'Jaune',
    color: '#eab308',
    gradient: 'from-amber-400 to-yellow-600',
    border: 'border-amber-500',
    bgLight: 'bg-amber-500/20',
    text: 'text-amber-400',
    woodColor: '#b45309'
  },
  {
    id: 'pink',
    label: 'Rose',
    color: '#e11d48',
    gradient: 'from-rose-400 to-pink-600',
    border: 'border-rose-500',
    bgLight: 'bg-rose-500/20',
    text: 'text-rose-400',
    woodColor: '#be123c'
  }
];

export const TERRAINS = {
  empty: {
    id: 'empty',
    name: 'Gomme',
    shortName: 'Gomme',
    color: '#334155',
    maxCrowns: 0,
    icon: 'Eraser',
    bgClass: 'bg-slate-900/70 border-dashed border-slate-700/80',
    badgeClass: 'bg-slate-800 text-slate-400',
    description: 'Effacer la case'
  },
  chateau: {
    id: 'chateau',
    name: 'Château',
    shortName: 'Château',
    color: '#e2e8f0',
    maxCrowns: 0,
    icon: 'Castle',
    bgClass: 'terrain-chateau text-slate-900 border-slate-300 font-bold',
    badgeClass: 'bg-slate-200 text-slate-900',
    description: 'Château de départ'
  },
  champs: {
    id: 'champs',
    name: 'Blé',
    shortName: 'Blé',
    color: '#eab308',
    maxCrowns: 1,
    icon: 'Wheat',
    bgClass: 'terrain-champs text-amber-950 border-amber-300',
    badgeClass: 'bg-amber-500 text-amber-950',
    description: 'Champs de blé (max 1 👑)'
  },
  foret: {
    id: 'foret',
    name: 'Forêt',
    shortName: 'Forêt',
    color: '#15803d',
    maxCrowns: 1,
    icon: 'Trees',
    bgClass: 'terrain-foret text-emerald-950 border-emerald-400',
    badgeClass: 'bg-emerald-600 text-emerald-100',
    description: 'Forêt dense (max 1 👑)'
  },
  eau: {
    id: 'eau',
    name: 'Eau',
    shortName: 'Eau',
    color: '#2563eb',
    maxCrowns: 1,
    icon: 'Waves',
    bgClass: 'terrain-eau text-blue-950 border-blue-400',
    badgeClass: 'bg-blue-600 text-blue-100',
    description: 'Lacs & Mer (max 1 👑)'
  },
  prairie: {
    id: 'prairie',
    name: 'Prairie',
    shortName: 'Prairie',
    color: '#65a30d',
    maxCrowns: 2,
    icon: 'Sprout',
    bgClass: 'terrain-prairie text-lime-950 border-lime-400',
    badgeClass: 'bg-lime-600 text-lime-100',
    description: 'Prairies vertes (max 2 👑)'
  },
  marais: {
    id: 'marais',
    name: 'Marais',
    shortName: 'Marais',
    color: '#7e22ce',
    maxCrowns: 2,
    icon: 'Eye',
    bgClass: 'terrain-marais text-purple-100 border-purple-400',
    badgeClass: 'bg-purple-700 text-purple-100',
    description: 'Marais (max 2 👑)'
  },
  mine: {
    id: 'mine',
    name: 'Mine',
    shortName: 'Mine',
    color: '#334155',
    maxCrowns: 3,
    icon: 'Pickaxe',
    bgClass: 'terrain-mine text-slate-100 border-slate-500',
    badgeClass: 'bg-slate-700 text-amber-300',
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
      description: 'Défaussez 24 dominos. Chaque joueur a 2 meeples.'
    },
    duel: {
      discardCount: 0,
      totalTiles: 48,
      gridSize: 7,
      meeplesPerPlayer: 2,
      tilesPerTurn: 4,
      label: 'Grand Duel (7×7)',
      description: 'Tous les 48 dominos sont en jeu !'
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
