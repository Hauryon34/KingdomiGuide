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
    <div className="flex items-center justify-center gap-1.5 py-3.5 px-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md flex-shrink-0">
      {STEPS.map((s) => {
        const isActive = currentStep === s.id;
        const isClickable = s.id <= maxUnlockedStep;

        return (
          <button
            key={s.id}
            type="button"
            disabled={!isClickable}
            onClick={() => setStep(s.id)}
            className={`transition-all duration-200 flex items-center justify-center ${
              isActive
                ? 'w-5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 shadow-sm ring-1 ring-amber-300'
                : isClickable
                ? 'w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-slate-500 cursor-pointer'
                : 'w-1.5 h-1.5 rounded-full bg-slate-800/60 cursor-not-allowed opacity-30'
            }`}
            title={s.label}
          />
        );
      })}
    </div>
  );
}
