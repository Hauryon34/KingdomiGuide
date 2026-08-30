/**
 * Algorithme de calcul de score, détection stricte des règles officielles Kingdomino et trophées
 */

export function createEmptyGrid(size = 5) {
  const grid = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push({ terrain: 'empty', crowns: 0, link: null });
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Calcule les domaines et le score total pour une grille donnée.
 * RÈGLE OFFICIELLE STRICTE :
 * Chaque domino posé DOIT toucher soit le Château (joker), soit un biome IDENTIQUE déjà légalement raccordé.
 */
export function calculateKingdomScore(grid, options = { middleEmpireBonus: true, harmonyBonus: true }) {
  const size = grid.length;
  const domains = [];
  let castlePos = null;
  let castleCount = 0;
  let totalCrowns = 0;
  let totalPlacedCells = 0;
  let emptyCells = 0;
  const illegalTiles = [];

  // 1. Recenser les positions
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c].terrain === 'chateau') {
        castleCount++;
        castlePos = { r, c };
      }
      if (grid[r][c].terrain === 'empty') {
        emptyCells++;
      } else {
        totalPlacedCells++;
      }
    }
  }

  // 2. Regrouper les cellules en "Unités" (soit un Domino 1x2 lié, soit une tuile individuelle)
  const units = []; // array of array of coords [{ coords: [{r, c}, {r, c}], isCastle: false }]
  const cellToUnitMap = Array.from({ length: size }, () => Array(size).fill(null));
  let unitIndex = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c];
      if (cell.terrain === 'empty' || cellToUnitMap[r][c] !== null) continue;

      if (cell.terrain === 'chateau') {
        units.push({ id: unitIndex, coords: [{ r, c }], isCastle: true });
        cellToUnitMap[r][c] = unitIndex++;
        continue;
      }

      // Si la case est liée à un voisin
      let linkedNeighbor = null;
      if (cell.link === 'right' && c + 1 < size && grid[r][c + 1].link === 'left') {
        linkedNeighbor = { r, c: c + 1 };
      } else if (cell.link === 'bottom' && r + 1 < size && grid[r + 1][c].link === 'top') {
        linkedNeighbor = { r: r + 1, c };
      }

      if (linkedNeighbor) {
        units.push({
          id: unitIndex,
          coords: [{ r, c }, linkedNeighbor],
          isCastle: false
        });
        cellToUnitMap[r][c] = unitIndex;
        cellToUnitMap[linkedNeighbor.r][linkedNeighbor.c] = unitIndex;
        unitIndex++;
      } else {
        units.push({
          id: unitIndex,
          coords: [{ r, c }],
          isCastle: false
        });
        cellToUnitMap[r][c] = unitIndex++;
      }
    }
  }

  // 3. Propagation de la règle de connexion officielle Kingdomino depuis le Château
  const legalUnitSet = new Set();
  const castleUnit = units.find(u => u.isCastle);

  if (castleUnit) {
    legalUnitSet.add(castleUnit.id);
    let addedAny = true;

    while (addedAny) {
      addedAny = false;

      for (const unit of units) {
        if (legalUnitSet.has(unit.id)) continue;

        // Une unité est légalement posée si au moins une de ses cases touche :
        // a) Le Château (joker)
        // b) Une case d'une unité DÉJÀ LÉGALE avec le MÊME biome de terrain !
        let canConnect = false;

        for (const coord of unit.coords) {
          const currentTerrain = grid[coord.r][coord.c].terrain;
          const neighbors = [
            [coord.r - 1, coord.c],
            [coord.r + 1, coord.c],
            [coord.r, coord.c - 1],
            [coord.r, coord.c + 1]
          ];

          for (const [nr, nc] of neighbors) {
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
              const neighborUnitId = cellToUnitMap[nr][nc];
              if (neighborUnitId !== null && legalUnitSet.has(neighborUnitId)) {
                const neighborCell = grid[nr][nc];
                if (neighborCell.terrain === 'chateau' || neighborCell.terrain === currentTerrain) {
                  canConnect = true;
                  break;
                }
              }
            }
          }
          if (canConnect) break;
        }

        if (canConnect) {
          legalUnitSet.add(unit.id);
          addedAny = true;
        }
      }
    }
  }

  // 4. Identifier les tuiles illégales
  for (const unit of units) {
    if (!unit.isCastle && !legalUnitSet.has(unit.id)) {
      unit.coords.forEach(coord => illegalTiles.push(coord));
    }
  }

  // 5. Détecter les domaines de même biome UNIQUEMENT sur les tuiles légales
  const legalGridMask = Array.from({ length: size }, () => Array(size).fill(false));
  for (const unit of units) {
    if (legalUnitSet.has(unit.id) && !unit.isCastle) {
      unit.coords.forEach(coord => {
        legalGridMask[coord.r][coord.c] = true;
      });
    }
  }

  const visited = Array.from({ length: size }, () => Array(size).fill(false));

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c];

      if (cell.terrain === 'empty' || cell.terrain === 'chateau') continue;
      if (!legalGridMask[r][c]) continue; // Tuile illégale ignorée

      totalCrowns += cell.crowns || 0;

      if (visited[r][c]) continue;

      const currentTerrain = cell.terrain;
      const domainCells = [];
      let domainCrowns = 0;
      const queue = [[r, c]];
      visited[r][c] = true;

      while (queue.length > 0) {
        const [currR, currC] = queue.shift();
        const currCell = grid[currR][currC];
        domainCells.push({ r: currR, c: currC });
        domainCrowns += currCell.crowns || 0;

        const neighbors = [
          [currR - 1, currC],
          [currR + 1, currC],
          [currR, currC - 1],
          [currR, currC + 1]
        ];

        for (const [nr, nc] of neighbors) {
          if (
            nr >= 0 && nr < size &&
            nc >= 0 && nc < size &&
            !visited[nr][nc] &&
            legalGridMask[nr][nc] &&
            grid[nr][nc].terrain === currentTerrain
          ) {
            visited[nr][nc] = true;
            queue.push([nr, nc]);
          }
        }
      }

      const domainScore = domainCells.length * domainCrowns;
      domains.push({
        id: `domain-${r}-${c}`,
        terrain: currentTerrain,
        size: domainCells.length,
        crowns: domainCrowns,
        score: domainScore,
        cells: domainCells
      });
    }
  }

  domains.sort((a, b) => b.score - a.score || b.size - a.size);

  const baseScore = domains.reduce((sum, d) => sum + d.score, 0);
  const maxDomainSize = domains.length > 0 ? Math.max(...domains.map(d => d.size)) : 0;

  // Bonus "Empire du Milieu" (+10 pts si le château est au centre)
  const centerIndex = Math.floor(size / 2);
  const isCastleCentered = castlePos && castlePos.r === centerIndex && castlePos.c === centerIndex;
  const middleEmpireScore = (options.middleEmpireBonus && isCastleCentered) ? 10 : 0;

  // Bonus "Harmonie" (+5 pts si aucune case vide n'est présente dans la grille, 1 château posé et 0 tuile illégale)
  const isCompleteKingdom = emptyCells === 0 && castleCount === 1 && illegalTiles.length === 0;
  const harmonyScore = (options.harmonyBonus && isCompleteKingdom) ? 5 : 0;

  // Avertissements avec pluriels automatiques
  const warnings = [];
  if (castleCount === 0 && totalPlacedCells > 0) {
    warnings.push({
      type: 'warning',
      text: 'Placez votre Château royal pour connecter et valider votre royaume.'
    });
  } else if (castleCount > 1) {
    warnings.push({
      type: 'warning',
      text: `Vous avez placé ${castleCount} châteaux. Un seul est autorisé.`
    });
  }

  if (illegalTiles.length > 0 && castleCount > 0) {
    const plural = illegalTiles.length > 1;
    warnings.push({
      type: 'illegal',
      text: `${illegalTiles.length} case${plural ? 's' : ''} sans connexion valide au Château ou biome correspondant (0 pt).`
    });
  }

  const totalScore = baseScore + middleEmpireScore + harmonyScore;

  return {
    totalScore,
    baseScore,
    middleEmpireScore,
    isCastleCentered,
    harmonyScore,
    isCompleteKingdom,
    domains,
    totalCrowns,
    totalPlacedCells,
    emptyCells,
    maxDomainSize,
    warnings,
    illegalTiles,
    castlePos,
    castleCount
  };
}

export function comparePlayers(playerA, playerB) {
  if (playerB.scoreData.totalScore !== playerA.scoreData.totalScore) {
    return playerB.scoreData.totalScore - playerA.scoreData.totalScore;
  }
  if (playerB.scoreData.maxDomainSize !== playerA.scoreData.maxDomainSize) {
    return playerB.scoreData.maxDomainSize - playerA.scoreData.maxDomainSize;
  }
  return playerB.scoreData.totalCrowns - playerA.scoreData.totalCrowns;
}

export function computeGameHonors(players) {
  const honors = {};

  // 1. Monarque Doré
  const sortedByCrowns = [...players].sort((a, b) => b.scoreData.totalCrowns - a.scoreData.totalCrowns);
  if (sortedByCrowns[0] && sortedByCrowns[0].scoreData.totalCrowns > 0) {
    const winnerId = sortedByCrowns[0].id;
    const crowns = sortedByCrowns[0].scoreData.totalCrowns;
    if (!honors[winnerId]) honors[winnerId] = [];
    honors[winnerId].push({
      icon: '👑',
      title: 'Monarque Doré',
      desc: `${crowns} couronne${crowns > 1 ? 's' : ''}`
    });
  }

  // 2. Seigneur des Forêts
  let bestForest = { size: 0, player: null };
  players.forEach(p => {
    const forestDomains = p.scoreData.domains.filter(d => d.terrain === 'foret');
    const maxSize = forestDomains.length > 0 ? Math.max(...forestDomains.map(d => d.size)) : 0;
    if (maxSize > bestForest.size) {
      bestForest = { size: maxSize, player: p };
    }
  });
  if (bestForest.player && bestForest.size >= 3) {
    const winnerId = bestForest.player.id;
    if (!honors[winnerId]) honors[winnerId] = [];
    honors[winnerId].push({
      icon: '🌲',
      title: 'Seigneur des Forêts',
      desc: `Forêt de ${bestForest.size} cases`
    });
  }

  // 3. Maître des Moissons (Blé)
  let bestChamps = { size: 0, player: null };
  players.forEach(p => {
    const champsDomains = p.scoreData.domains.filter(d => d.terrain === 'champs');
    const maxSize = champsDomains.length > 0 ? Math.max(...champsDomains.map(d => d.size)) : 0;
    if (maxSize > bestChamps.size) {
      bestChamps = { size: maxSize, player: p };
    }
  });
  if (bestChamps.player && bestChamps.size >= 3) {
    const winnerId = bestChamps.player.id;
    if (!honors[winnerId]) honors[winnerId] = [];
    honors[winnerId].push({
      icon: '🌾',
      title: 'Maître des Moissons',
      desc: `Champs de ${bestChamps.size} cases`
    });
  }

  // 4. Géomètre Royal (Château centré + grille pleine)
  const perfectBuilders = players.filter(p => p.scoreData.isCastleCentered && p.scoreData.isCompleteKingdom);
  if (perfectBuilders.length > 0) {
    const winnerId = perfectBuilders[0].id;
    if (!honors[winnerId]) honors[winnerId] = [];
    honors[winnerId].push({
      icon: '🎯',
      title: 'Géomètre Royal',
      desc: 'Domaine centré et complet'
    });
  }

  return honors;
}
