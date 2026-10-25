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
      className="flex items-center justify-center gap-0.5 py-2 px-2.5 bg-zinc-100/90 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 flex-shrink-0"
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
              className={`block transition-all duration-300 ${
                isActive
                  ? 'w-5 h-2 rounded-full bg-amber-500 shadow-xs'
                  : isClickable
                  ? 'w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500'
                  : 'w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 opacity-50'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
