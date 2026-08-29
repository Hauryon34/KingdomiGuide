import React, { useState, useRef } from 'react';
import { Camera, Sparkles, X, Check, Upload, AlertCircle, RefreshCw } from 'lucide-react';
import { analyzeKingdomImageLocally, analyzeKingdomImageWithAI } from '../utils/visionScanner';
import { calculateKingdomScore } from '../utils/scoreCalculator';
import TerrainTile from './TerrainTile';

export default function KingdomScannerModal({
  isOpen,
  onClose,
  gridSize = 5,
  playerName = '',
  onApplyGrid
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedGrid, setDetectedGrid] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result);
      setDetectedGrid(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleStartAnalysis = async () => {
    if (!imageSrc) return;
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      if (apiKey.trim()) {
        localStorage.setItem('gemini_api_key', apiKey.trim());
        const grid = await analyzeKingdomImageWithAI(imageSrc, gridSize, apiKey.trim());
        setDetectedGrid(grid);
      } else {
        // Local Canvas Colorimetry & Segmentation
        const img = new Image();
        img.src = imageSrc;
        await new Promise((resolve) => { img.onload = resolve; });
        const grid = await analyzeKingdomImageLocally(img, gridSize);
        setDetectedGrid(grid);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Impossible d'analyser l'image. Assurez-vous que le royaume est bien cadré.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (detectedGrid) {
      onApplyGrid(detectedGrid);
      onClose();
    }
  };

  const scoreData = detectedGrid ? calculateKingdomScore(detectedGrid) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 relative my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Camera size={26} />
          </div>
          <h3 className="text-xl font-black font-medieval text-amber-200">
            Scanner le Royaume ({gridSize}×{gridSize})
          </h3>
          <p className="text-xs text-slate-400">
            Prenez en photo le domaine de <strong className="text-slate-200">{playerName}</strong>
          </p>
        </div>

        {/* Hidden Camera Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Photo Upload & Preview Zone */}
        {!imageSrc ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-12 px-4 rounded-3xl border-2 border-dashed border-amber-500/40 bg-slate-950/60 hover:bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
            >
              <div className="p-4 rounded-full bg-amber-500/20 text-amber-400">
                <Camera size={32} />
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-sm font-bold text-slate-100 block">
                  Prendre une photo du dessus
                </span>
                <span className="text-[11px] text-slate-400 block">
                  ou sélectionner une photo dans la galerie
                </span>
              </div>
            </button>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-amber-300 block">💡 Conseils pour une photo parfaite :</span>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Prenez la photo bien à la verticale (du dessus).</li>
                <li>Évitez les ombres fortes et les reflets directs.</li>
                <li>Cadrez l'ensemble des dominos dans la grille.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Image Preview with alignment grid */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 max-h-60 bg-black flex items-center justify-center">
              <img
                src={imageSrc}
                alt="Aperçu royaume"
                className="max-h-60 w-full object-contain"
              />

              {/* Reticle / Grid Overlay */}
              <div className="absolute inset-0 grid pointer-events-none opacity-40 border border-amber-400"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gridTemplateRows: `repeat(${gridSize}, 1fr)`
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                  <div key={i} className="border border-amber-300/40"></div>
                ))}
              </div>
            </div>

            {/* Action Bar under image */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 flex items-center gap-1.5"
              >
                <RefreshCw size={14} />
                Reprendre
              </button>

              <button
                type="button"
                disabled={isAnalyzing}
                onClick={handleStartAnalysis}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
              >
                <Sparkles size={15} />
                <span>{isAnalyzing ? "Analyse de l'image..." : "Analyser la Grille"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Detection Result & Validation */}
        {detectedGrid && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Check size={16} />
                Royaume détecté avec succès !
              </span>
              <span className="text-sm font-black font-medieval text-amber-300">
                {scoreData?.totalScore} pts
              </span>
            </div>

            {/* Small mini-grid preview */}
            <div className="flex justify-center py-1">
              <div className="inline-block space-y-0.5">
                {detectedGrid.map((row, r) => (
                  <div key={r} className="flex gap-0.5">
                    {row.map((cell, c) => (
                      <div
                        key={c}
                        className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-black border ${
                          cell.terrain === 'chateau' ? 'bg-white text-black border-slate-300' :
                          cell.terrain === 'champs' ? 'bg-amber-400 text-black border-amber-500' :
                          cell.terrain === 'foret' ? 'bg-green-700 text-white border-green-800' :
                          cell.terrain === 'eau' ? 'bg-blue-600 text-white border-blue-700' :
                          cell.terrain === 'prairie' ? 'bg-lime-500 text-black border-lime-600' :
                          cell.terrain === 'marais' ? 'bg-purple-700 text-white border-purple-800' :
                          cell.terrain === 'mine' ? 'bg-slate-700 text-white border-slate-900' :
                          'bg-slate-900 border-slate-800'
                        }`}
                      >
                        {cell.crowns > 0 ? `${cell.crowns}👑` : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={handleApply}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Check size={16} />
              <span>Valider & Appliquer à ma Grille</span>
            </button>
          </div>
        )}

        {/* Optional Gemini API key toggle for 100% cloud precision */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="text-[10px] text-slate-500 hover:text-slate-300 underline"
          >
            {showApiKeyInput ? "Masquer les réglages IA" : "⚙️ Option : Activer l'IA Vision Cloud (Gemini)"}
          </button>

          {showApiKeyInput && (
            <div className="mt-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-left space-y-1.5 animate-fade-in">
              <label className="text-[10px] text-slate-400 block font-medium">
                Clé API Google Gemini (Optionnelle - pour IA Vision haute fidélité) :
              </label>
              <input
                type="password"
                value={apiKey}
                placeholder="AIzaSy..."
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
