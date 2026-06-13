import React from 'react';
import { Repeat } from 'lucide-react';

interface RepeatGroupProps {
  groupId: string;
  isPausedHere: boolean;
  children: React.ReactNode;
}

/**
 * Frames a run of consecutive 'repeated' prayer blocks so the formulas that
 * are recited many times (refuge, bodhichitta, Vajrasattva, mandala offering,
 * guru yoga) stand out clearly. The auto-scroll logic finds these wrappers
 * through the data-repeat-id attribute and pauses gently on them.
 */
const RepeatGroup: React.FC<RepeatGroupProps> = ({ groupId, isPausedHere, children }) => {
  return (
    <div
      data-repeat-id={groupId}
      className={`relative mt-8 mb-2 rounded-2xl border px-2 pt-9 pb-5 md:px-6 bg-monk-saffron/[0.06] dark:bg-monk-saffron/[0.05] transition-all duration-700 ${
        isPausedHere
          ? 'border-monk-saffron/80 shadow-[0_0_28px_rgba(232,158,39,0.30)]'
          : 'border-monk-saffron/30 dark:border-monk-saffron/25'
      }`}
    >
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[11px] font-sans font-semibold uppercase tracking-[0.18em] shadow-sm transition-colors duration-500 bg-parchment dark:bg-parchment-dark ${
            isPausedHere
              ? 'border-monk-saffron text-monk-red dark:text-monk-saffron animate-pulse'
              : 'border-monk-saffron/40 text-monk-red/80 dark:text-monk-saffron/80'
          }`}
        >
          <Repeat size={12} strokeWidth={2.5} />
          Repeat
        </span>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default RepeatGroup;
