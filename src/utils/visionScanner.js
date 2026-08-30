/**
 * Moteur de reconnaissance visuelle pour scanner un royaume Kingdomino
 * Échantillonne la zone centrale de chaque tuile et classe par distance colorimétrique
 */

import { createEmptyGrid } from './scoreCalculator';

// Palette colorimétrique de référence des tuiles physiques de Kingdomino (RGB)
const TERRAIN_PALETTES = {
  champs: [
    { r: 235, g: 185, b: 40 },   // Jaune blé vif
    { r: 215, g: 160, b: 35 },   // Doré
    { r: 240, g: 200, b: 60 }    // Paille claire
  ],
  eau: [
    { r: 40, g: 120, b: 205 },   // Bleu lac
    { r: 25, g: 85, b: 165 },    // Bleu profond
    { r: 70, g: 155, b: 225 }    // Bleu clair
  ],
  foret: [
    { r: 25, g: 80, b: 40 },     // Vert sapin foncé
    { r: 35, g: 105, b: 50 },    // Vert forêt
    { r: 20, g: 65, b: 30 }      // Vert sombre
  ],
  prairie: [
    { r: 135, g: 195, b: 60 },   // Vert pomme / prairie clair
    { r: 155, g: 210, b: 70 },   // Vert tendre
    { r: 110, g: 175, b: 45 }    // Vert herbe
  ],
  marais: [
    { r: 115, g: 60, b: 125 },   // Pourpre marais
    { r: 95, g: 70, b: 60 },     // Brun marron terreux
    { r: 80, g: 45, b: 90 }      // Violet sombre
  ],
  mine: [
    { r: 50, g: 55, b: 65 },     // Gris charbon
    { r: 35, g: 38, b: 45 },     // Noir rocheux
    { r: 75, g: 75, b: 80 }      // Gris foncé
  ],
  chateau: [
    { r: 225, g: 230, b: 235 },  // Blanc pierre
    { r: 200, g: 205, b: 210 },  // Gris très clair
    { r: 240, g: 235, b: 225 }   // Beige clair
  ]
};

/**
 * Analyse locale de l'image
 */
export async function analyzeKingdomImageLocally(imgElement, gridSize = 5) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const size = 600;
  canvas.width = size;
  canvas.height = size;
  
  ctx.drawImage(imgElement, 0, 0, size, size);
  
  const cellSize = size / gridSize;
  const grid = createEmptyGrid(gridSize);
  
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Échantillonner la zone centrale (50% intérieur de la case pour ignorer les bords)
      const startX = Math.floor(c * cellSize + cellSize * 0.25);
      const startY = Math.floor(r * cellSize + cellSize * 0.25);
      const sampleW = Math.floor(cellSize * 0.5);
      const sampleH = Math.floor(cellSize * 0.5);
      
      const imgData = ctx.getImageData(startX, startY, sampleW, sampleH);
      const data = imgData.data;
      
      let totalR = 0, totalG = 0, totalB = 0;
      let count = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        totalR += data[i];
        totalG += data[i + 1];
        totalB += data[i + 2];
        count++;
      }
      
      const avgR = totalR / count;
      const avgG = totalG / count;
      const avgB = totalB / count;
      
      // Trouver le type de terrain le plus proche par distance minimale
      let bestTerrain = 'champs';
      let minDistance = Infinity;
      
      for (const [terrainKey, samples] of Object.entries(TERRAINS_PALETTES)) {
        for (const sample of samples) {
          // Distance euclidienne pondérée (perceptuelle)
          const dr = avgR - sample.r;
          const dg = avgG - sample.g;
          const db = avgB - sample.b;
          const dist = (dr * dr * 0.3) + (dg * dg * 0.59) + (db * db * 0.11);
          
          if (dist < minDistance) {
            minDistance = dist;
            bestTerrain = terrainKey;
          }
        }
      }
      
      grid[r][c] = { terrain: bestTerrain, crowns: 0 };
    }
  }
  
  return grid;
}

/**
 * Analyse par IA Vision Multimodale (Optionnelle)
 */
export async function analyzeKingdomImageWithAI(base64Image, gridSize = 5, apiKey = '') {
  if (!apiKey) throw new Error("Clé API manquante");

  const prompt = `Tu es un arbitre expert de Kingdomino.
Analyse cette photo de grille (${gridSize}x${gridSize}).
Identifie pour chaque case : "champs", "foret", "eau", "prairie", "marais", "mine", "chateau", "empty".
Renvoie UNIQUEMENT un JSON : { "grid": [[{"terrain": "champs", "crowns": 0}, ...]] }`;

  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: "image/jpeg", data: cleanBase64 } }
        ]
      }],
      generationConfig: { response_mime_type: "application/json" }
    })
  });

  if (!response.ok) throw new Error("Erreur API Vision");

  const result = await response.json();
  const textOutput = result.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(textOutput).grid;
}
