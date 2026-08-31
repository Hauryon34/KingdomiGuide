import React, { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState('center'); // 'center' -> 'expanding' -> 'fadeout'

  useEffect(() => {
    // Étape 1 : Couronne au centre
    const t1 = setTimeout(() => {
      setStage('expanding');
    }, 600);

    // Étape 2 : Expansion dorée sur tout l'écran
    const t2 = setTimeout(() => {
      setStage('fadeout');
    }, 1200);

    // Étape 3 : Fin du splash screen
    const t3 = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 transition-opacity duration-300 pointer-events-none overflow-hidden ${
        stage === 'fadeout' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Cercle doré expansif qui part du centre et remplit tout l'écran */}
      <div
        className={`absolute rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 transition-all duration-700 ease-out flex items-center justify-center ${
          stage === 'center'
            ? 'w-24 h-24 scale-100 opacity-100 shadow-2xl shadow-amber-500/50'
            : 'w-[250vmax] h-[250vmax] scale-100 opacity-100'
        }`}
      >
        {/* Couronne Royale Noire */}
        <div
          className={`transition-all duration-500 flex flex-col items-center justify-center ${
            stage === 'center' ? 'scale-100 opacity-100' : 'scale-150 opacity-0'
          }`}
        >
          <div className="p-3 rounded-2xl bg-slate-950/10 backdrop-blur-sm">
            <Crown size={48} className="text-slate-950 fill-slate-950 stroke-slate-950" />
          </div>
          <span className="font-medieval font-black text-base tracking-wider text-slate-950 mt-1">
            KingdomiGuide
          </span>
        </div>
      </div>
    </div>
  );
}
