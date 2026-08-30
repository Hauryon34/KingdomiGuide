/**
 * Algorithme de calcul de score et détection des règles Kingdomino
 */

/**
 * Crée une grille vide initialisée à 100% sans château par défaut
 * @param {number} size - 5 ou 7
 * @returns {Array<Array<{terrain: string, crowns: number}>>}
 */
export function createEmptyGrid(size = 5) {
  const grid = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push({ terrain: 'empty', crowns: 0 });
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

  // Bonus "Harmonie" (+5 pts si aucune case vide n'est présente dans la grille et 1 château posé)
  const isCompleteKingdom = emptyCells === 0 && castleCount === 1;
  const harmonyScore = (options.harmonyBonus && isCompleteKingdom) ? 5 : 0;

  // Avertissements
  const warnings = [];
  if (castleCount === 0 && totalPlacedCells > 0) {
    warnings.push({
      type: 'warning',
      text: 'Pensez à placer votre Château royal sur la grille.'
    });
  } else if (castleCount > 1) {
    warnings.push({
      type: 'warning',
      text: `Vous avez placé ${castleCount} châteaux. Un seul est autorisé.`
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
    castlePos,
    castleCount
  };
}

/**
 * Compare deux joueurs selon les règles officielles de départage :
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
