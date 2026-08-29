import React from 'react';

const STEPS = [
  { id: 0, label: 'Joueurs' },
  { id: 1, label: 'Mode' },
  { id: 2, label: 'Tirage' },
  { id: 3, label: 'Scores' },
  { id: 4, label: 'Podium' },
];

export default function BreadcrumbDots({ currentStep, setStep, maxUnlockedStep = 4 }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-800 shadow-lg mx-auto w-fit">
      {STEPS.map((s) => {
        const isActive = currentStep === s.id;
        const isClickable = s.id <= maxUnlockedStep;

        return (
          <button
            key={s.id}
            type="button"
            disabled={!isClickable}
            onClick={() => setStep(s.id)}
            className={`transition-all duration-300 flex items-center justify-center ${
              isActive
                ? 'w-8 h-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 shadow-md shadow-amber-500/40 ring-1 ring-amber-300'
                : isClickable
                ? 'w-3 h-3 rounded-full bg-slate-700 hover:bg-slate-500 cursor-pointer'
                : 'w-2 h-2 rounded-full bg-slate-800/60 cursor-not-allowed opacity-40'
            }`}
            title={s.label}
          />
        );
      })}
    </div>
  );
}
