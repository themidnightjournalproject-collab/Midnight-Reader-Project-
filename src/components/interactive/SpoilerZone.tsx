import React from 'react';
import { BookReview } from '../../types';
import { useJournal } from '../../context/JournalContext';
import { AlertTriangle, Lock, Unlock, CheckCircle2, RotateCcw } from 'lucide-react';

interface SpoilerZoneProps {
  review: BookReview;
}

export const SpoilerZone: React.FC<SpoilerZoneProps> = ({ review }) => {
  const { unlockedSpoilers, unlockSpoiler, lockSpoiler } = useJournal();
  const isUnlocked = Boolean(unlockedSpoilers[review.id]);

  return (
    <div className="my-8">
      {!isUnlocked ? (
        <div className="bg-[#8b0000] text-white p-6 sm:p-8 text-center relative rotate-[0.5deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
          {/* Top Exclamation Badge */}
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#8b0000] rounded-full flex items-center justify-center border-2 border-[#f5f2ed] text-white font-bold font-mono text-sm shadow">
            !
          </div>

          <span className="uppercase font-sans font-bold text-xs sm:text-sm tracking-[0.2em] block mb-2">
            ⚠ Spoiler Zone
          </span>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-2">
            EVIDENCE CLASSIFIED BY THE ARCHIVE
          </h3>

          <p className="font-serif italic text-sm text-white/90 max-w-xl mx-auto mb-6">
            The section below reveals the identity of the true culprit, the final plot inversion, and critical third-act evidence.
          </p>

          <button
            onClick={() => unlockSpoiler(review.id)}
            className="border-2 border-white bg-transparent hover:bg-white hover:text-[#8b0000] text-white px-6 py-2.5 text-xs font-sans font-bold tracking-widest uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Reveal the Evidence
          </button>
        </div>
      ) : (
        <div className="border-2 border-black bg-white p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
          {/* Classified Stamp & Re-lock control */}
          <div className="flex flex-wrap justify-between items-center bg-[#f5f2ed] p-3 border border-black gap-2">
            <span className="font-sans text-xs text-[#1a1a1a] font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 size={15} className="text-[#8b0000]" /> ACCESS GRANTED • EVIDENCE UNSEALED
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => lockSpoiler(review.id)}
                className="inline-flex items-center gap-1 bg-[#8b0000] hover:bg-black text-white px-2.5 py-1 text-[11px] font-sans font-bold uppercase tracking-wider transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                title="Hide spoilers and re-lock file"
              >
                <Lock size={12} />
                <span>Re-Seal Spoilers</span>
              </button>
              <span className="bg-[#8b0000] text-white text-[10px] font-sans font-bold uppercase px-2 py-0.5 tracking-wider">
                CASE CLOSED
              </span>
            </div>
          </div>

          {/* Spoiler Breakdown Content */}
          <div className="font-serif text-sm sm:text-base text-[#1a1a1a] leading-relaxed whitespace-pre-line bg-[#fffef7] p-5 border border-black border-opacity-20">
            {review.spoilerEvidence}
          </div>

          {review.spoilerCulpritReveal && (
            <div className="p-4 bg-[#e8e2d8] border-l-4 border-[#8b0000] text-xs font-sans">
              <strong className="text-[#8b0000] block mb-1 uppercase font-bold tracking-wider">CONFIRMED CULPRIT:</strong>
              <p className="text-[#1a1a1a] font-serif text-base font-bold">
                {review.spoilerCulpritReveal}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

