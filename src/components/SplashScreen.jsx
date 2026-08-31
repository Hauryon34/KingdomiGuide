import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState('center'); // 'center' -> 'expanding' -> 'fadeout'

  useEffect(() => {
    // Étape 1 : Couronne au centre
    const t1 = setTimeout(() => {
      setStage('expanding');
    }, 400);

    // Étape 2 : Fondu de transition vers l'app
    const t2 = setTimeout(() => {
      setStage('fadeout');
    }, 1000);

    // Étape 3 : Fin du splash screen
    const t3 = setTimeout(() => {
      onFinish();
    }, 1300);

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
      {/* Disque doré pur qui s'étend depuis le centre jusqu'à remplir tout l'écran */}
      <div
        className={`absolute rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 transition-all duration-700 ease-out flex items-center justify-center ${
          stage === 'center'
            ? 'w-24 h-24 scale-100 opacity-100 shadow-2xl shadow-amber-500/50'
            : 'w-[300vmax] h-[300vmax] scale-100 opacity-100'
        }`}
      >
        {/* Couronne Royale Pure Noire (Sans aucun blason, boîte ou flou) */}
        <svg
          viewBox="0 0 24 24"
          className={`w-14 h-14 text-slate-950 fill-slate-950 transition-all duration-500 ${
            stage === 'center' ? 'scale-100 opacity-100' : 'scale-125 opacity-0'
          }`}
        >
          <path
            d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z"
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
