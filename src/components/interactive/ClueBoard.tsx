import React, { useState } from 'react';
import { BookReview, ClueItem } from '../../types';
import { useJournal } from '../../context/JournalContext';
import { Unlock, Lock, Search, Info, ArrowDown, Sparkles } from 'lucide-react';

interface ClueBoardProps {
  review: BookReview;
}

export const ClueBoard: React.FC<ClueBoardProps> = ({ review }) => {
  const { unlockedClues, toggleClueUnlock } = useJournal();
  const [selectedClueId, setSelectedClueId] = useState<string | null>(
    review.clues && review.clues.length > 0 ? review.clues[0].id : null
  );

  const activeClue = review.clues?.find((c) => c.id === selectedClueId) || review.clues?.[0];

  const getImportanceBadge = (importance: ClueItem['importance']) => {
    switch (importance) {
      case 'CRUCIAL':
        return 'bg-[#8b0000] text-white';
      case 'DECEPTIVE (RED HERRING)':
        return 'bg-black text-white';
      case 'CONFIRMED EVIDENCE':
        return 'bg-[#1a1a1a] text-white';
      default:
        return 'bg-[#e8e2d8] text-[#4a4a4a] border border-black border-opacity-30';
    }
  };

  if (!review.clues || review.clues.length === 0) {
    return null;
  }

  return (
    <div id="section-evidence" className="my-8 bg-[#f5f2ed] border-2 border-black p-5 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#8b0000] text-white text-[10px] font-sans font-bold uppercase px-2 py-0.5 tracking-wider">
              STEP 1 OF 4
            </span>
            <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest">
              CRIME SCENE & FORENSIC EVIDENCE
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1a1a1a] uppercase font-serif">
            EVIDENCE & FORENSIC CLUE BOARD
          </h3>
        </div>
        <span className="bg-black text-white text-xs font-sans font-bold uppercase px-2.5 py-1 tracking-wider">
          PRIMARY DISCOVERY
        </span>
      </div>

      <p className="font-serif text-sm sm:text-base text-[#4a4a4a] italic mb-6">
        Begin your investigation here! Click any pinned evidence item below to inspect forensic notes, timestamp logs, and discovered significance before examining the suspects.
      </p>

      {/* Interactive Clue Corkboard / Pinboard Area */}
      <div className="relative bg-[#e8e2d8] p-6 border-2 border-black mb-6 overflow-hidden">
        {/* Subtle Decorative Grid lines */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* SVG Decorative Red Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <line x1="20%" y1="30%" x2="50%" y2="70%" stroke="#8b0000" strokeWidth="1.5" strokeDasharray="5,5" />
          <line x1="50%" y1="70%" x2="80%" y2="35%" stroke="#8b0000" strokeWidth="1.5" strokeDasharray="5,5" />
          <line x1="20%" y1="30%" x2="80%" y2="35%" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="3,3" />
        </svg>

        {/* Pinned Clue Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {review.clues.map((clue, index) => {
            const isSelected = selectedClueId === clue.id;
            const isUnlocked = Boolean(unlockedClues[clue.id]);

            return (
              <div
                key={clue.id}
                onClick={() => {
                  setSelectedClueId(clue.id);
                  if (!unlockedClues[clue.id]) {
                    toggleClueUnlock(clue.id);
                  }
                }}
                className={`p-4 cursor-pointer transition-all border-2 border-black ${
                  isSelected
                    ? 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                    : 'bg-[#faf8f2] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:bg-white'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-2 border-b border-black border-opacity-20 pb-1.5 pt-1">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                    EVIDENCE #{String(index + 1).padStart(2, '0')}
                  </span>
                  {clue.pageDiscovered && (
                    <span className="font-sans text-[10px] text-[#4a4a4a] font-bold uppercase">
                      Pg. {clue.pageDiscovered}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-[#1a1a1a] mb-2 leading-snug font-serif uppercase">
                  {clue.title}
                </h4>

                <p className="font-serif text-xs text-[#1a1a1a] mb-3">
                  {clue.summary}
                </p>

                {/* Status Indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-black border-opacity-10 text-[11px] font-sans">
                  <span className={`px-1.5 py-0.5 text-[9px] uppercase font-bold ${getImportanceBadge(clue.importance)}`}>
                    {clue.importance}
                  </span>

                  <span className="text-[#8b0000] flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider">
                    {isUnlocked ? (
                      <>
                        <Unlock size={11} /> Inspected
                      </>
                    ) : (
                      <>
                        <Lock size={11} /> Click to Inspect
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clue Detailed Examination Dossier */}
      {activeClue && (
        <div className="bg-white p-5 sm:p-6 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap items-center justify-between border-b border-black pb-2 mb-3 gap-2">
            <div>
              <span className="font-sans text-xs text-[#8b0000] uppercase font-bold tracking-wider">
                FORENSIC LAB ANALYSIS NOTEBOOK
              </span>
              <h4 className="text-xl font-black text-[#1a1a1a] font-serif uppercase">
                {activeClue.title}
              </h4>
            </div>

            <span className={`px-2 py-0.5 text-xs uppercase font-sans font-bold ${getImportanceBadge(activeClue.importance)}`}>
              {activeClue.importance}
            </span>
          </div>

          <div className="space-y-3 font-serif">
            <div className="bg-[#f5f2ed] p-3.5 border border-black border-opacity-20">
              <h5 className="font-sans text-xs uppercase font-bold text-[#1a1a1a] mb-1 flex items-center gap-1.5 tracking-wider">
                <Search size={13} className="text-[#8b0000]" />
                FORENSIC LAB SUMMARY:
              </h5>
              <p className="text-sm text-[#1a1a1a] leading-relaxed">
                {activeClue.summary}
              </p>
            </div>

            <div className="bg-[#fffef7] p-3.5 border-l-4 border-black border border-black border-opacity-20">
              <h5 className="font-sans text-xs uppercase font-bold text-[#8b0000] mb-1 flex items-center gap-1.5 tracking-wider">
                <Info size={13} />
                DETECTIVE'S CRITICAL ANALYSIS:
              </h5>
              <p className="text-sm text-[#1a1a1a] leading-relaxed italic">
                {activeClue.detailedAnalysis}
              </p>
            </div>
          </div>

          {/* Quick jump to Step 2 */}
          <div className="mt-5 pt-3 border-t border-black border-opacity-20 flex justify-end">
            <a
              href="#section-suspects"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase text-[#8b0000] hover:underline"
            >
              <span>Done examining evidence? Proceed to Step 2: Suspect Board</span>
              <ArrowDown size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
