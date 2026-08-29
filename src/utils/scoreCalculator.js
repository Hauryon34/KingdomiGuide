/**
 * Algorithme de calcul de score et détection des règles Kingdomino
 */

/**
 * Crée une grille vide initialisée avec le château au centre par défaut
 * @param {number} size - 5 ou 7
 * @returns {Array<Array<{terrain: string, crowns: number}>>}
 */
export function createEmptyGrid(size = 5) {
  const grid = [];
  const center = Math.floor(size / 2);
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      if (r === center && c === center) {
        row.push({ terrain: 'chateau', crowns: 0 });
      } else {
        row.push({ terrain: 'empty', crowns: 0 });
      }
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Calcule les domaines et le score total pour une grille donnée
 * @param {Array<Array<{terrain: string, crowns: number}>>} grid
 * @param {object} options - { middleEmpireBonus: boolean, harmonyBonus: boolean }
 */
export function calculateKingdomScore(grid, options = { middleEmpireBonus: true, harmonyBonus: true }) {
  const size = grid.length;
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const domains = [];
  let castlePos = null;
  let castleCount = 0;
  let totalCrowns = 0;
  let totalPlacedCells = 0;
  let emptyCells = 0;

  // 1. Parcours de la grille pour trouver les composantes connexes (domaines)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c];

      if (cell.terrain === 'chateau') {
        castleCount++;
        castlePos = { r, c };
        totalPlacedCells++;
        continue;
      }

      if (cell.terrain === 'empty') {
        emptyCells++;
        continue;
      }

      totalPlacedCells++;
      totalCrowns += cell.crowns || 0;

      if (visited[r][c]) continue;

      // BFS pour explorer le domaine du même type de terrain
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

        // Voisins orthogonaux (Haut, Bas, Gauche, Droite)
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

  // Trier les domaines par score décroissant puis par taille
  domains.sort((a, b) => b.score - a.score || b.size - a.size);

  const baseScore = domains.reduce((sum, d) => sum + d.score, 0);
  const maxDomainSize = domains.length > 0 ? Math.max(...domains.map(d => d.size)) : 0;

  // 2. Bonus "Empire du Milieu" (+10 pts si le château est au centre)
  const centerIndex = Math.floor(size / 2);
  const isCastleCentered = castlePos && castlePos.r === centerIndex && castlePos.c === centerIndex;
  const middleEmpireScore = (options.middleEmpireBonus && isCastleCentered) ? 10 : 0;

  // 3. Bonus "Harmonie" (+5 pts si aucune case vide n'est présente dans la grille)
  const isCompleteKingdom = emptyCells === 0 && castleCount === 1;
  const harmonyScore = (options.harmonyBonus && isCompleteKingdom) ? 5 : 0;

  // 4. Règles & Avertissements de connexion
  const warnings = [];
  if (castleCount === 0) {
    warnings.push({
      type: 'error',
      text: 'Il manque le Château royal sur votre grille.'
    });
  } else if (castleCount > 1) {
    warnings.push({
      type: 'warning',
      text: `Vous avez placé ${castleCount} châteaux. Un seul est autorisé par royaume.`
    });
  }

  // Vérifier la connectivité globale du royaume (toutes les tuiles doivent être connectées au château)
  if (castlePos && totalPlacedCells > 1) {
    const connectedToCastle = Array.from({ length: size }, () => Array(size).fill(false));
    const connQueue = [[castlePos.r, castlePos.c]];
    connectedToCastle[castlePos.r][castlePos.c] = true;
    let reachableCount = 1;

    while (connQueue.length > 0) {
      const [cr, cc] = connQueue.shift();
      const neighbors = [
        [cr - 1, cc],
        [cr + 1, cc],
        [cr, cc - 1],
        [cr, cc + 1]
      ];

      for (const [nr, nc] of neighbors) {
        if (
          nr >= 0 && nr < size &&
          nc >= 0 && nc < size &&
          !connectedToCastle[nr][nc] &&
          grid[nr][nc].terrain !== 'empty'
        ) {
          connectedToCastle[nr][nc] = true;
          reachableCount++;
          connQueue.push([nr, nc]);
        }
      }
    }

    if (reachableCount < totalPlacedCells) {
      const isolatedCount = totalPlacedCells - reachableCount;
      warnings.push({
        type: 'warning',
        text: `${isolatedCount} case(s) de terrain semblent isolées et non reliées au royaume.`
      });
    }
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
    castlePos
  };
}

/**
 * Compare deux scores selon les règles officielles de départage
 * 1. Score total
 * 2. Taille du plus grand domaine
 * 3. Nombre total de couronnes
 */
export function comparePlayers(playerA, playerB) {
  if (playerB.scoreData.totalScore !== playerA.scoreData.totalScore) {
    return playerB.scoreData.totalScore - playerA.scoreData.totalScore;
  }
  if (playerB.scoreData.maxDomainSize !== playerA.scoreData.maxDomainSize) {
    return playerB.scoreData.maxDomainSize - playerA.scoreData.maxDomainSize;
  }
  return playerB.scoreData.totalCrowns - playerA.scoreData.totalCrowns;
}
