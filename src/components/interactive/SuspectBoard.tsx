import React, { useState } from 'react';
import { BookReview, Suspect } from '../../types';
import { useJournal } from '../../context/JournalContext';
import { UserCheck, ShieldAlert, CheckCircle2, UserX, ArrowDown, HelpCircle } from 'lucide-react';

interface SuspectBoardProps {
  review: BookReview;
}

export const SuspectBoard: React.FC<SuspectBoardProps> = ({ review }) => {
  const { 
    visitorGuesses, 
    setVisitorGuess, 
    resetVisitorGuess,
    unlockedSpoilers 
  } = useJournal();

  const [activeSuspectId, setActiveSuspectId] = useState<string | null>(
    review.suspects && review.suspects.length > 0 ? review.suspects[0].id : null
  );
  const [selectedGuessId, setSelectedGuessId] = useState<string>(
    visitorGuesses[review.id] || (review.suspects?.[0]?.id || '')
  );

  const activeSuspect = review.suspects?.find((s) => s.id === activeSuspectId) || review.suspects?.[0];
  const isClassifiedUnlocked = Boolean(unlockedSpoilers[review.id]);
  const currentGuess = visitorGuesses[review.id];
  const accusedSuspect = review.suspects?.find((s) => s.id === currentGuess);

  const handleSubmitGuess = () => {
    if (!selectedGuessId) return;
    setVisitorGuess(review.id, selectedGuessId);
  };

  const handleSelectDirectSuspect = (suspectId: string) => {
    setSelectedGuessId(suspectId);
    setVisitorGuess(review.id, suspectId);
  };

  const getOpportunityBadgeColor = (opportunity: Suspect['opportunity']) => {
    switch (opportunity) {
      case 'MAXIMUM':
        return 'bg-[#8b0000] text-white';
      case 'HIGH':
        return 'bg-black text-white';
      case 'MEDIUM':
        return 'bg-[#e8e2d8] text-black border border-black';
      default:
        return 'bg-[#f5f2ed] text-[#4a4a4a] border border-black border-opacity-30';
    }
  };

  if (!review.suspects || review.suspects.length === 0) {
    return null;
  }

  return (
    <div id="section-suspects" className="my-8 bg-[#f5f2ed] border-2 border-black p-5 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#8b0000] text-white text-[10px] font-sans font-bold uppercase px-2 py-0.5 tracking-wider">
              STEP 2 OF 4
            </span>
            <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest">
              LINEUP & WITNESS INTERROGATION
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1a1a1a] uppercase font-serif">
            THE SUSPECT BOARD: WHO DID IT?
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-black text-white text-xs font-sans font-bold uppercase px-2.5 py-1 tracking-wider">
            {currentGuess ? 'ACCUSATION FILED' : 'MAKE YOUR GUESS'}
          </span>
        </div>
      </div>

      <p className="font-serif text-sm sm:text-base text-[#4a4a4a] italic mb-6">
        Examine the motives, stated alibis, and opportunity levels of the suspects below. Select your prime suspect to lock in your accusation before reading the review!
      </p>

      {/* Suspects Cards Grid / Pinned Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {review.suspects.map((suspect, index) => {
          const isSelected = activeSuspectId === suspect.id;
          const isMyGuess = currentGuess === suspect.id;
          const isTrueCulprit = suspect.isActualCulprit;

          return (
            <div
              key={suspect.id}
              onClick={() => setActiveSuspectId(suspect.id)}
              className={`p-4 cursor-pointer transition-all border-2 border-black ${
                isSelected
                  ? 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                  : 'bg-[#faf8f2] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:bg-white'
              }`}
            >
              {/* Header with Suspect number */}
              <div className="flex justify-between items-start mb-2 border-b border-black border-opacity-20 pb-1.5 pt-1">
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                  SUSPECT #{String(index + 1).padStart(2, '0')}
                </span>
                {isMyGuess && (
                  <span className="font-sans text-[9px] bg-[#8b0000] text-white px-2 py-0.5 uppercase tracking-wider font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    ★ MY PRIME SUSPECT
                  </span>
                )}
              </div>

              {/* Suspect Name & Role */}
              <h4 className="text-lg font-bold text-[#1a1a1a] font-serif uppercase mb-0.5">
                {suspect.name}
              </h4>
              <p className="font-serif text-xs text-[#737373] italic mb-3">
                {suspect.role}
              </p>

              {/* Opportunity & Suspicion */}
              <div className="space-y-1.5 text-xs font-sans border-t border-black border-opacity-10 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#737373] font-bold uppercase text-[10px]">Opportunity:</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider ${getOpportunityBadgeColor(suspect.opportunity)}`}>
                    {suspect.opportunity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#737373] font-bold uppercase text-[10px]">Suspicion:</span>
                  <span className="text-[#8b0000] font-bold tracking-widest">
                    {'★'.repeat(suspect.suspicionLevel)}{'☆'.repeat(5 - suspect.suspicionLevel)}
                  </span>
                </div>
              </div>

              {/* Quick Select Button on card */}
              <div className="mt-3 pt-2 border-t border-black border-opacity-20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDirectSuspect(suspect.id);
                  }}
                  className={`w-full py-1 text-[11px] font-sans font-bold uppercase tracking-wider transition-colors text-center ${
                    isMyGuess
                      ? 'bg-black text-white'
                      : 'bg-white border border-black hover:bg-[#8b0000] hover:text-white text-[#1a1a1a]'
                  }`}
                >
                  {isMyGuess ? '✓ Accused as Culprit' : 'Accuse This Suspect'}
                </button>
              </div>

              {/* Revealed status stamp only if classified is unsealed */}
              {isClassifiedUnlocked && (
                <div className="mt-2 pt-1.5 border-t border-dashed border-black text-center">
                  {isTrueCulprit ? (
                    <span className="bg-[#8b0000] text-white text-[10px] font-sans font-bold uppercase px-2 py-0.5 tracking-wider">
                      TRUE CULPRIT
                    </span>
                  ) : (
                    <span className="bg-[#1a1a1a] text-white text-[10px] font-sans font-bold uppercase px-2 py-0.5 tracking-wider">
                      EXONERATED
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Suspect Detailed Dossier */}
      {activeSuspect && (
        <div className="bg-white p-5 sm:p-6 border-2 border-black mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap items-center justify-between border-b border-black pb-2 mb-4 gap-2">
            <div>
              <span className="font-sans text-xs text-[#8b0000] uppercase font-bold tracking-wider">
                INTERROGATION DOSSIER: {activeSuspect.name}
              </span>
              <h4 className="text-xl font-black text-[#1a1a1a] font-serif uppercase">
                {activeSuspect.role}
              </h4>
            </div>

            <button
              onClick={() => handleSelectDirectSuspect(activeSuspect.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none ${
                currentGuess === activeSuspect.id
                  ? 'bg-[#8b0000] text-white'
                  : 'bg-white text-black border border-black hover:bg-[#e8e2d8]'
              }`}
            >
              <UserCheck size={13} />
              <span>
                {currentGuess === activeSuspect.id
                  ? 'Locked In as Prime Suspect'
                  : 'Lock In as My Suspect'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-serif">
            <div>
              <h5 className="font-sans text-xs uppercase font-bold text-[#1a1a1a] mb-1 tracking-wider">
                Alleged Motive:
              </h5>
              <p className="text-[#1a1a1a] mb-4 bg-[#f5f2ed] p-2.5 border border-black border-opacity-20">
                {activeSuspect.motive || 'Under surveillance; concealed motive suspected.'}
              </p>

              <h5 className="font-sans text-xs uppercase font-bold text-[#1a1a1a] mb-1 tracking-wider">
                Stated Alibi:
              </h5>
              <p className="text-[#4a4a4a] italic bg-[#f5f2ed] p-2.5 border border-black border-opacity-20">
                "{activeSuspect.alibi || 'Unverified during critical timestamp.'}"
              </p>
            </div>

            <div>
              <h5 className="font-sans text-xs uppercase font-bold text-[#1a1a1a] mb-1 tracking-wider">
                Observed Clues & Suspicious Activity:
              </h5>
              <ul className="space-y-1.5 text-sm font-serif text-[#1a1a1a]">
                {activeSuspect.clues.map((clue, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#f5f2ed] p-2 border border-black border-opacity-20">
                    <span className="text-[#8b0000] font-bold font-sans">▶</span>
                    <span>{clue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Lock In Accusation Callout */}
      <div className="bg-[#e8e2d8] p-5 sm:p-6 border-2 border-black">
        <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-2 flex items-center gap-1.5">
          <UserCheck size={14} className="text-[#8b0000]" />
          <span>YOUR PRIMARY ACCUSATION (STEP 2 OF 4)</span>
        </h4>

        {!currentGuess ? (
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedGuessId}
              onChange={(e) => setSelectedGuessId(e.target.value)}
              className="bg-white border-2 border-black px-3 py-2 text-xs font-sans text-[#1a1a1a] font-bold focus:outline-none flex-1 max-w-xs"
            >
              {review.suspects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>

            <button
              onClick={handleSubmitGuess}
              className="bg-[#8b0000] hover:bg-black text-white px-5 py-2 text-xs font-sans uppercase tracking-wider font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-colors"
            >
              LOCK IN MY SUSPECT
            </button>
          </div>
        ) : (
          <div className="bg-white p-4 border-2 border-black flex flex-wrap items-center justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <p className="font-sans text-xs text-[#8b0000] font-bold uppercase tracking-wider">
                “Accusation officially registered in the journal log.”
              </p>
              <p className="font-serif text-sm text-[#1a1a1a] mt-0.5">
                You have formally accused <strong className="font-bold text-[#8b0000]">{accusedSuspect?.name}</strong> ({accusedSuspect?.role}).
              </p>
              <p className="font-serif text-xs text-[#737373] italic mt-1">
                Now proceed to Step 3 below to read the critical review. You'll find out if you solved the case in Step 4: Classified Information!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => resetVisitorGuess(review.id)}
                className="bg-transparent hover:bg-black hover:text-white text-[#4a4a4a] border border-black px-3 py-2 text-xs font-sans uppercase tracking-wider font-bold transition-colors"
                title="Clear current accusation to pick a different suspect"
              >
                Change Accusation
              </button>
              <a
                href="#section-review"
                className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-black text-white px-4 py-2 text-xs font-sans uppercase tracking-wider font-bold transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
              >
                <span>Proceed to Step 3: My Review</span>
                <ArrowDown size={13} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
