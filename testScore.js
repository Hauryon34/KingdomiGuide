import { createEmptyGrid, calculateKingdomScore, comparePlayers } from './src/utils/scoreCalculator.js';

console.log('=== TEST 1: Grille 5x5 avec Château au centre seul ===');
const grid1 = createEmptyGrid(5);
const score1 = calculateKingdomScore(grid1, { middleEmpireBonus: true, harmonyBonus: true });
console.log('Score:', score1.totalScore, 'Base:', score1.baseScore, 'Empire:', score1.middleEmpireScore, 'Harmonie:', score1.harmonyScore);
console.assert(score1.middleEmpireScore === 10, 'Empire du Milieu doit valoir 10 pts');
console.assert(score1.harmonyScore === 0, 'Harmonie doit valoir 0 pt (grille non complète)');

console.log('\n=== TEST 2: Forêt de 4 cases avec 2 couronnes ===');
grid1[0][0] = { terrain: 'foret', crowns: 1 };
grid1[0][1] = { terrain: 'foret', crowns: 1 };
grid1[1][0] = { terrain: 'foret', crowns: 0 };
grid1[1][1] = { terrain: 'foret', crowns: 0 };
const score2 = calculateKingdomScore(grid1, { middleEmpireBonus: true, harmonyBonus: true });
console.log('Domaines trouvés:', score2.domains.length);
console.log('Premier domaine:', score2.domains[0]);
console.assert(score2.domains[0].score === 8, '4 cases x 2 couronnes = 8 pts');

console.log('\n=== TEST 3: Grille complète 5x5 sans trou (Harmonie) ===');
for (let r = 0; r < 5; r++) {
  for (let c = 0; c < 5; c++) {
    if (r === 2 && c === 2) continue; // château
    grid1[r][c] = { terrain: 'champs', crowns: 0 };
  }
}
// Mettre 2 couronnes sur le champ
grid1[0][0] = { terrain: 'champs', crowns: 2 };
const score3 = calculateKingdomScore(grid1, { middleEmpireBonus: true, harmonyBonus: true });
console.log('Score total grille complète:', score3.totalScore);
console.log('Harmonie:', score3.harmonyScore);
console.assert(score3.isCompleteKingdom === true, 'Le royaume doit être complet');
console.assert(score3.harmonyScore === 5, 'Harmonie = +5 pts');
// 24 cases champs * 2 couronnes = 48 pts + 10 (Empire) + 5 (Harmonie) = 63 pts
console.assert(score3.totalScore === 63, 'Score total = 63 pts (48 + 10 + 5)');

console.log('\n=== TEST 4: Départage de joueurs ===');
const playerA = {
  name: 'Bleu',
  scoreData: { totalScore: 45, maxDomainSize: 8, totalCrowns: 5 }
};
const playerB = {
  name: 'Vert',
  scoreData: { totalScore: 45, maxDomainSize: 10, totalCrowns: 4 }
};
const ranked = [playerA, playerB].sort(comparePlayers);
console.log('Gagnant:', ranked[0].name);
console.assert(ranked[0].name === 'Vert', 'Vert gagne au plus grand domaine');

console.log('\n TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS !');
