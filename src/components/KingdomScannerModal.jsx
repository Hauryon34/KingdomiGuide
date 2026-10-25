import React, { useState, useRef } from 'react';
import { Camera, Sparkles, X, Check, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';
import { analyzeKingdomImageLocally, analyzeKingdomImageWithAI } from '../utils/visionScanner';
import { calculateKingdomScore } from '../utils/scoreCalculator';

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
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem('gemini_api_key') || '');
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
        sessionStorage.setItem('gemini_api_key', apiKey.trim());
        const grid = await analyzeKingdomImageWithAI(imageSrc, gridSize, apiKey.trim());
        setDetectedGrid(grid);
      } else {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 relative my-auto max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-500">
            <Camera size={22} />
          </div>
          <h3 className="text-lg font-extrabold font-display tracking-tight text-zinc-900 dark:text-zinc-100">
            Scanner le Royaume ({gridSize}×{gridSize})
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Domaine de <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">{playerName}</strong>
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

        {/* Photo Upload Zone */}
        {!imageSrc ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-9 px-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50 hover:border-amber-500/60 flex flex-col items-center justify-center gap-2.5 text-zinc-600 dark:text-zinc-300 transition-all cursor-pointer"
            >
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <Camera size={26} />
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  Prendre une photo du dessus
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 block">
                  ou sélectionner dans la galerie
                </span>
              </div>
            </button>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/70 dark:border-zinc-800/80 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Conseils de cadrage :</span>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Placez le téléphone bien à la verticale du plateau.</li>
                <li>Alignez les bords du royaume dans le cadre carré.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Image Preview with grid overlay */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-56 bg-zinc-950 flex items-center justify-center">
              <img
                src={imageSrc}
                alt="Aperçu"
                className="max-h-56 w-full object-contain"
              />

              <div
                className="absolute inset-0 grid pointer-events-none opacity-45 border border-amber-400"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gridTemplateRows: `repeat(${gridSize}, 1fr)`
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                  <div key={i} className="border border-amber-300/40" />
                ))}
              </div>
            </div>

            {/* Action Bar under image */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center gap-1.5"
              >
                <RefreshCw size={14} />
                Reprendre
              </button>

              <button
                type="button"
                disabled={isAnalyzing}
                onClick={handleStartAnalysis}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Sparkles size={15} />
                <span>{isAnalyzing ? "Analyse..." : "Analyser la Grille"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Detection Result & Validation */}
        {detectedGrid && (
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-emerald-500/30 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Check size={15} />
                Domaines détectés
              </span>
              <span className="text-sm font-extrabold font-display tabular-nums text-zinc-900 dark:text-white">
                {scoreData?.totalScore} pts
              </span>
            </div>

            {!apiKey.trim() && (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-amber-500/10 rounded-xl px-2.5 py-1.5">
                Astuce : Touchez ensuite les cases sur votre grille pour ajouter vos couronnes 👑.
              </p>
            )}

            <div className="flex justify-center py-1">
              <div className="inline-block space-y-0.5">
                {detectedGrid.map((row, r) => (
                  <div key={r} className="flex gap-0.5">
                    {row.map((cell, c) => (
                      <div
                        key={c}
                        className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold border ${
                          cell.terrain === 'chateau' ? 'bg-white text-black border-zinc-300' :
                          cell.terrain === 'champs' ? 'bg-amber-400 text-black border-amber-500' :
                          cell.terrain === 'foret' ? 'bg-emerald-600 text-white border-emerald-700' :
                          cell.terrain === 'eau' ? 'bg-sky-500 text-white border-sky-600' :
                          cell.terrain === 'prairie' ? 'bg-lime-500 text-black border-lime-600' :
                          cell.terrain === 'marais' ? 'bg-purple-600 text-white border-purple-700' :
                          cell.terrain === 'mine' ? 'bg-zinc-700 text-white border-zinc-800' :
                          'bg-zinc-200 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800'
                        }`}
                      >
                        {cell.terrain === 'chateau' ? '🏰' : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Check size={15} />
              <span>Appliquer à ma Grille</span>
            </button>
          </div>
        )}

        {/* Optional Gemini API key */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {showApiKeyInput ? "Masquer les options avancées" : "Option : IA Vision Cloud (Gemini)"}
          </button>

          {showApiKeyInput && (
            <div className="mt-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 text-left space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  Clé API Google Gemini (Session)
                </label>
                {apiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKey('');
                      sessionStorage.removeItem('gemini_api_key');
                      localStorage.removeItem('gemini_api_key');
                    }}
                    className="text-[10px] text-rose-500 flex items-center gap-0.5 hover:underline"
                  >
                    <Trash2 size={11} /> Effacer
                  </button>
                )}
              </div>
              <input
                type="password"
                value={apiKey}
                placeholder="AIzaSy..."
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
