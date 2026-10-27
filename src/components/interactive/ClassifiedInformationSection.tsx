import React, { useState } from 'react';
import { BookReview } from '../../types';
import { useJournal } from '../../context/JournalContext';
import { 
  ShieldAlert, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  FileLock2, 
  AlertTriangle, 
  Award, 
  HelpCircle, 
  Sparkles,
  ArrowUp,
  RotateCcw,
  EyeOff
} from 'lucide-react';

interface ClassifiedInformationSectionProps {
  review: BookReview;
}

export const ClassifiedInformationSection: React.FC<ClassifiedInformationSectionProps> = ({ review }) => {
  const { 
    unlockedSpoilers, 
    unlockSpoiler, 
    lockSpoiler,
    resetClassifiedFile,
    visitorGuesses 
  } = useJournal();

  const isUnlocked = Boolean(unlockedSpoilers[review.id]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isResealing, setIsResealing] = useState(false);

  // Identify visitor guess and actual culprit
  const visitorGuessId = visitorGuesses[review.id];
  const visitorSuspect = review.suspects?.find((s) => s.id === visitorGuessId);
  const actualCulpritSuspect = review.suspects?.find((s) => s.isActualCulprit);
  
  // Culprit name fallback
  const actualCulpritName = review.spoilerCulpritReveal || actualCulpritSuspect?.name || 'The True Culprit';

  // Check if visitor solved it
  const hasGuessed = Boolean(visitorSuspect);
  const didSolve = hasGuessed && (
    (actualCulpritSuspect && visitorSuspect?.id === actualCulpritSuspect.id) ||
    (review.spoilerCulpritReveal && visitorSuspect?.name.toLowerCase().includes(review.spoilerCulpritReveal.toLowerCase()))
  );

  const handleAccessClassified = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      unlockSpoiler(review.id);
      setIsTransitioning(false);
    }, 500);
  };

  const handleResealDossier = (resetAccusation = false) => {
    setIsResealing(true);
    setTimeout(() => {
      if (resetAccusation) {
        resetClassifiedFile(review.id, true);
      } else {
        lockSpoiler(review.id);
      }
      setIsResealing(false);
    }, 400);
  };

  return (
    <section id="section-classified" className="my-10">
      {/* Step Header Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-[#8b0000] text-white font-sans text-xs font-bold uppercase px-3 py-1 tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          STEP 4 OF 4 • RESTRICTED ARCHIVE
        </span>
        <span className="font-mono text-xs uppercase font-bold text-[#8b0000] tracking-widest">
          // LEVEL-5 CLEARANCE REQUIRED
        </span>
      </div>

      {!isUnlocked ? (
        /* LOCKED / CLASSIFIED FILE VAULT */
        <div className="bg-[#1a1a1a] text-[#f5f2ed] border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(139,0,0,1)] relative overflow-hidden">
          
          {/* Subtle background caution stripes & stamp watermark */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none font-sans font-black text-8xl uppercase tracking-tighter text-white rotate-[-15deg]">
            CLASSIFIED
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-5">
            {/* Classified Stamp */}
            <div className="inline-flex items-center gap-2 border-2 border-[#8b0000] bg-[#8b0000]/20 px-4 py-1 text-[#ff8080] font-mono text-xs uppercase tracking-widest font-bold rotate-[-1deg]">
              <FileLock2 size={15} />
              <span>CLASSIFIED INFORMATION • EYES ONLY</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              WHAT ACTUALLY HAPPENED
            </h3>

            <p className="font-serif text-base sm:text-lg italic text-[#d4cfc7] leading-relaxed">
              The true mastermind, the final deception, and how all forensic threads connect in the ending of <strong className="text-white font-bold">{review.title}</strong>.
            </p>

            <div className="bg-black/60 border border-white/20 p-4 text-xs font-mono text-[#a39e93] text-left space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <AlertTriangle size={14} className="text-[#8b0000]" />
                <span>CONFIDENTIALITY PROTOCOL:</span>
              </div>
              <p className="font-serif text-xs text-[#d4cfc7]">
                Unsealing this dossier reveals the complete climax, villain monologue, and third-act twists. If you haven't logged your suspect on the <strong>Step 2 Suspect Board</strong> yet, make your accusation first!
              </p>
            </div>

            {/* Access Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleAccessClassified}
                disabled={isTransitioning}
                className="inline-flex items-center gap-3 bg-[#8b0000] hover:bg-white hover:text-black text-white px-8 py-4 text-sm font-sans font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-none active:translate-y-1 disabled:opacity-50"
              >
                <Lock size={16} />
                <span>{isTransitioning ? 'VERIFYING SECURITY CLEARANCE...' : 'ACCESS CLASSIFIED FILE'}</span>
              </button>
            </div>

            <p className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
              AUTHORIZED PERSONNEL ONLY • CASE #{review.caseNumber}
            </p>
          </div>
        </div>
      ) : (
        /* UNLOCKED / CLASSIFIED FILE DOSSIER */
        <div className="bg-[#fffef7] border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Transition / Dramatic Security Header */}
          <div className="bg-black text-white p-5 border-2 border-black space-y-3 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="font-mono text-sm uppercase font-bold tracking-widest text-[#22c55e]">
                  ACCESS GRANTED
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase text-[#a3a3a3] tracking-wider hidden sm:inline">
                  DOSSIER DECLASSIFIED
                </span>
                <button
                  type="button"
                  onClick={() => handleResealDossier(false)}
                  disabled={isResealing}
                  className="inline-flex items-center gap-1.5 bg-[#8b0000] hover:bg-white hover:text-black text-white px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider transition-colors border border-white/40 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)] hover:shadow-none"
                  title="Lock this file and hide spoilers again"
                >
                  <Lock size={12} />
                  <span>{isResealing ? 'RE-LOCKING...' : 'RE-SEAL / HIDE FILE'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <p className="font-mono text-xs sm:text-sm text-white font-bold uppercase tracking-wider">
                You have just entered a restricted section of Case File #{review.caseNumber}.
              </p>
              <p className="font-mono text-xs text-[#d4d4d4] uppercase tracking-wide">
                Everything beyond this point contains classified information.
              </p>
            </div>
          </div>

          {/* 1. What Actually Happened Narrative */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <span className="bg-[#8b0000] text-white font-sans text-xs uppercase font-bold px-2 py-0.5 tracking-wider">
                CONFIDENTIAL RESOLUTION
              </span>
              <h4 className="font-serif text-2xl font-black text-[#1a1a1a] uppercase">
                THE TRUE EVENTS EXPLAINED
              </h4>
            </div>

            <div className="bg-[#f5f2ed] border-2 border-black p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-serif text-base sm:text-lg text-[#1a1a1a] leading-relaxed">
                {review.whatActuallyHappened}
              </p>
            </div>
          </div>

          {/* 2. Third-Act Forensic Revelations & Twist Breakdown */}
          {review.spoilerEvidence && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <span className="bg-black text-white font-sans text-xs uppercase font-bold px-2 py-0.5 tracking-wider">
                  FORENSIC UNSEALING
                </span>
                <h4 className="font-serif text-xl font-bold text-[#1a1a1a] uppercase">
                  UNSEALED THIRD-ACT EVIDENCE & PLOT REVERSAL
                </h4>
              </div>

              <div className="bg-white border-2 border-black p-5 sm:p-6 font-serif text-base text-[#1a1a1a] leading-relaxed whitespace-pre-line shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {review.spoilerEvidence}
              </div>
            </div>
          )}

          {/* 3. The Confirmed Mastermind / Culprit Banner */}
          <div className="bg-[#e8e2d8] border-2 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(139,0,0,1)] flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest block mb-1">
                CONFIRMED CULPRIT / MASTERMIND:
              </span>
              <h4 className="font-serif text-2xl sm:text-3xl font-black text-[#1a1a1a] uppercase">
                {actualCulpritName}
              </h4>
              {actualCulpritSuspect?.role && (
                <p className="font-serif text-xs italic text-[#4a4a4a] mt-0.5">
                  ({actualCulpritSuspect.role})
                </p>
              )}
            </div>

            <div className="bg-black text-white px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(139,0,0,1)]">
              <CheckCircle2 size={16} className="text-[#ff8080]" />
              <span>PERMANENT RECORD FILED</span>
            </div>
          </div>

          {/* 4. SUSPECT COMPARISON & DETECTIVE SCORECARD */}
          <div className="border-4 border-black p-6 bg-[#fcfaf7] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest block">
                  INVESTIGATOR VERDICT SCORECARD
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-black text-[#1a1a1a] uppercase">
                  DID YOU SOLVE THE CASE?
                </h4>
              </div>
              
              {/* Verdict badge */}
              {hasGuessed ? (
                didSolve ? (
                  <span className="bg-[#15803d] text-white font-sans text-xs font-bold uppercase px-3 py-1.5 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Award size={15} /> SOLVED
                  </span>
                ) : (
                  <span className="bg-[#8b0000] text-white font-sans text-xs font-bold uppercase px-3 py-1.5 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <ShieldAlert size={15} /> FOOLED
                  </span>
                )
              ) : (
                <span className="bg-black text-white font-sans text-xs font-bold uppercase px-3 py-1.5 flex items-center gap-1.5">
                  <HelpCircle size={15} /> UNREGISTERED
                </span>
              )}
            </div>

            {/* Comparison Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="bg-white border-2 border-black p-3.5 space-y-1">
                <span className="text-[#737373] uppercase font-bold text-[10px] tracking-wider block">
                  YOUR STEP 2 SUSPECT CHOICE:
                </span>
                <p className="font-serif text-base font-bold text-[#1a1a1a]">
                  {visitorSuspect ? visitorSuspect.name : 'None selected on Suspect Board'}
                </p>
                {visitorSuspect && (
                  <p className="font-serif text-xs italic text-[#4a4a4a]">
                    "{visitorSuspect.role}"
                  </p>
                )}
              </div>

              <div className="bg-white border-2 border-black p-3.5 space-y-1">
                <span className="text-[#8b0000] uppercase font-bold text-[10px] tracking-wider block">
                  ACTUAL CULPRIT:
                </span>
                <p className="font-serif text-base font-bold text-[#8b0000]">
                  {actualCulpritName}
                </p>
                <p className="font-serif text-xs italic text-[#4a4a4a]">
                  {actualCulpritSuspect?.role || 'Identified in the climax'}
                </p>
              </div>
            </div>

            {/* Playful & Mysterious Evaluation */}
            <div className={`p-4 border-2 border-black ${
              hasGuessed 
                ? (didSolve ? 'bg-[#dcfce7] border-[#15803d]' : 'bg-[#fee2e2] border-[#8b0000]') 
                : 'bg-[#f5f2ed]'
            }`}>
              {hasGuessed ? (
                didSolve ? (
                  <div className="space-y-1">
                    <p className="font-sans font-bold text-xs uppercase tracking-wider text-[#15803d] flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>CASE CRACKED • MASTER DETECTIVE INTUITION</span>
                    </p>
                    <p className="font-serif text-sm text-[#14532d] leading-relaxed">
                      You suspected <strong>{visitorSuspect?.name}</strong> from the start, and you were 100% right! You saw straight through the narrative sleight-of-hand and pinned the real culprit before the curtain dropped. Excellent detective work.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-sans font-bold text-xs uppercase tracking-wider text-[#8b0000] flex items-center gap-1.5">
                      <ShieldAlert size={14} />
                      <span>THE RED HERRING CLAIMED ANOTHER VICTIM</span>
                    </p>
                    <p className="font-serif text-sm text-[#7f1d1d] leading-relaxed">
                      You put your money on <strong>{visitorSuspect?.name}</strong>, but the actual mastermind was <strong>{actualCulpritName}</strong>! Don't feel too bad—the author set that trap specifically for clever readers like you. A respectable effort in the interrogation room!
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-1">
                  <p className="font-sans font-bold text-xs uppercase tracking-wider text-[#1a1a1a]">
                    NO FORMAL SUSPECT REGISTERED
                  </p>
                  <p className="font-serif text-sm text-[#4a4a4a] leading-relaxed">
                    You dove straight into the classified dossier without registering a suspect on the <strong>Step 2 Suspect Board</strong>! On your next case, make sure to commit your accusation first so we can grade your detective instincts.
                  </p>
                  <a 
                    href="#section-suspects" 
                    className="inline-flex items-center gap-1 text-xs font-sans font-bold uppercase text-[#8b0000] hover:underline pt-1"
                  >
                    <ArrowUp size={12} /> Jump to Step 2 Suspect Board
                  </a>
                </div>
              )}
            </div>

          </div>

          {/* 5. DOSSIER ARCHIVE CONTROLS & RE-INVESTIGATION */}
          <div className="bg-[#1a1a1a] text-white p-5 border-2 border-black space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/20 pb-2">
              <span className="font-sans text-xs uppercase font-bold text-[#ff8080] tracking-widest flex items-center gap-1.5">
                <FileLock2 size={14} />
                ARCHIVE CLEARANCE CONTROLS
              </span>
              <span className="font-mono text-[11px] text-[#a3a3a3] uppercase">
                CASE #{review.caseNumber}
              </span>
            </div>

            <p className="font-serif text-xs text-[#d4d4d4] leading-relaxed">
              Finished reviewing the resolution? You can re-lock the classified section to keep the mystery hidden for future visits, or reset your case accusation to re-investigate the case from scratch.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleResealDossier(false)}
                disabled={isResealing}
                className="inline-flex items-center gap-2 bg-[#8b0000] hover:bg-white hover:text-black text-white px-4 py-2.5 text-xs font-sans font-bold uppercase tracking-wider transition-all border border-white/40 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-0.5"
              >
                <Lock size={14} />
                <span>{isResealing ? 'RE-LOCKING ARCHIVE...' : 'RE-SEAL DOSSIER (HIDE SPOILERS)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleResealDossier(true)}
                disabled={isResealing}
                className="inline-flex items-center gap-2 bg-transparent hover:bg-white hover:text-black text-white px-4 py-2.5 text-xs font-sans font-bold uppercase tracking-wider transition-all border border-white/40 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-0.5"
              >
                <RotateCcw size={14} />
                <span>RESTART CASE (RESET ACCUSATION & HIDE)</span>
              </button>
            </div>
          </div>

        </div>
      )}
    </section>
  );
};
