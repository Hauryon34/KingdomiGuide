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
    <nav
      aria-label="Progression des étapes"
      className="flex items-center justify-center gap-0.5 py-2 px-2.5 bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md flex-shrink-0"
    >
      {STEPS.map((s) => {
        const isActive = currentStep === s.id;
        const isClickable = s.id <= maxUnlockedStep;

        return (
          <button
            key={s.id}
            type="button"
            disabled={!isClickable}
            aria-label={`Étape ${s.id + 1} : ${s.label}`}
            aria-current={isActive ? 'step' : undefined}
            onClick={() => setStep(s.id)}
            className={`p-1.5 flex items-center justify-center transition-all ${
              isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
            }`}
            title={s.label}
          >
            <span
              className={`block transition-all duration-200 ${
                isActive
                  ? 'w-5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-sm ring-1 ring-amber-400'
                  : isClickable
                  ? 'w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
                  : 'w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800/70 opacity-50'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
