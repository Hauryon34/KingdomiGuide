import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState('center');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage('expanding');
    }, 350);

    const t2 = setTimeout(() => {
      setStage('fadeout');
    }, 950);

    const t3 = setTimeout(() => {
      onFinish();
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 transition-opacity duration-300 pointer-events-none overflow-hidden ${
        stage === 'fadeout' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`absolute rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-center ${
          stage === 'center'
            ? 'w-20 h-20 scale-100 opacity-100 shadow-2xl shadow-amber-500/40'
            : 'w-[280vmax] h-[280vmax] scale-100 opacity-100'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`w-11 h-11 text-zinc-950 fill-zinc-950 transition-all duration-500 ${
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
