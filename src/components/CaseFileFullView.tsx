import React, { useState } from 'react';
import { BookReview } from '../types';
import { useJournal } from '../context/JournalContext';
import { 
  ArrowLeft, 
  Edit3, 
  Heart, 
  FileText, 
  Users, 
  Search, 
  Lock, 
  CheckCircle2, 
  ArrowDown, 
  Sparkles,
  BookOpen,
  Camera
} from 'lucide-react';
import { ClueBoard } from './interactive/ClueBoard';
import { SuspectBoard } from './interactive/SuspectBoard';
import { TheoryBuilder } from './interactive/TheoryBuilder';
import { InteractiveEngagement } from './interactive/InteractiveEngagement';
import { ClassifiedInformationSection } from './interactive/ClassifiedInformationSection';
import { QuickImageModal } from './modals/QuickImageModal';

interface CaseFileFullViewProps {
  review: BookReview;
}

export const CaseFileFullView: React.FC<CaseFileFullViewProps> = ({ review }) => {
  const { 
    setSelectedReview, 
    setEditingReview, 
    updateReview,
    postLikes, 
    userLikedPosts, 
    toggleLikePost, 
    isAdminUnlocked,
    visitorGuesses,
    unlockedSpoilers
  } = useJournal();

  const [isQuickImageOpen, setIsQuickImageOpen] = useState(false);

  const likes = postLikes[review.id] ?? (review.likes || 0);
  const isLiked = !!userLikedPosts[review.id];
  const hasGuestAccusation = Boolean(visitorGuesses[review.id]);
  const isClassifiedUnlocked = Boolean(unlockedSpoilers[review.id]);

  const handleUpdateCover = (newImageUrl: string) => {
    updateReview(review.id, { coverImage: newImageUrl });
    // Also update selected review local object
    setSelectedReview({
      ...review,
      coverImage: newImageUrl
    });
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <article className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Back to archive navigation & quick action toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between border-b-2 border-black pb-3 gap-3">
        <button
          onClick={() => setSelectedReview(null)}
          className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#4a4a4a] hover:text-[#8b0000] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>← BACK TO CASE FILES / JOURNAL INDEX</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Direct Like button */}
          <button
            type="button"
            onClick={() => toggleLikePost(review.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider border transition-all ${
              isLiked 
                ? 'bg-[#8b0000] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-[#1a1a1a] border-black hover:bg-[#faf7f2]'
            }`}
          >
            <Heart size={13} className={isLiked ? 'fill-white' : 'text-[#8b0000]'} />
            <span>{likes} {likes === 1 ? 'Endorsement' : 'Endorsements'}</span>
          </button>

          {/* Edit Dossier Button - Only if admin unlocked */}
          {isAdminUnlocked && (
            <button
              onClick={() => setEditingReview(review)}
              className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-black text-white px-3.5 py-1.5 text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              <Edit3 size={13} />
              <span>EDIT THIS DOSSIER</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Case File Dossier Container */}
      <div className="bg-white border-2 border-black p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Header Blotter */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-4 mb-6 gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-[#8b0000] text-white text-[10px] uppercase font-bold px-2 py-0.5 tracking-widest font-sans">
                OFFICIAL CASE FILE #{review.caseNumber}
              </span>
              <span className="text-black opacity-30">•</span>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#4a4a4a]">
                {review.genre}
              </span>
              {review.readingFormat && (
                <>
                  <span className="text-black opacity-30">•</span>
                  <span className="bg-[#e8e2d8] text-[#1a1a1a] text-[10px] font-sans font-bold uppercase px-1.5 py-0.5 border border-black border-opacity-30">
                    {review.readingFormat}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#1a1a1a] tracking-tight font-serif">
              {review.title}
            </h1>
            <p className="font-serif text-base sm:text-lg text-[#4a4a4a] italic mt-1">
              Authored by {review.author} • Logged on {review.dateRead}
            </p>
            {(review.dateStarted || review.dateFinished) && (
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-700 mt-1.5 pt-1 border-t border-dotted border-gray-300">
                {review.dateStarted && (
                  <span>
                    <strong className="font-sans uppercase text-[10px] text-gray-500">Started:</strong> {review.dateStarted}
                  </span>
                )}
                {review.dateStarted && review.dateFinished && <span className="text-gray-300">|</span>}
                {review.dateFinished && (
                  <span>
                    <strong className="font-sans uppercase text-[10px] text-[#8b0000]">Finished:</strong> {review.dateFinished}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="bg-black text-white text-xs font-sans font-bold uppercase px-3 py-1 tracking-wider">
              {review.status}
            </span>
            <span className="font-sans text-[11px] font-bold text-[#737373] mt-1 uppercase">
              {review.pages} PAGES INVESTIGATED
            </span>
          </div>
        </div>

        {/* Lead Quote Card */}
        {review.leadQuote && (
          <div className="bg-[#e8e2d8] border-l-4 border-black p-4 sm:p-5 mb-8">
            <p className="font-serif text-lg sm:text-xl text-[#1a1a1a] italic leading-relaxed">
              “{review.leadQuote}”
            </p>
          </div>
        )}

        {/* 4-STEP INVESTIGATION PROGRESS STEPPER / QUICK JUMP */}
        <div className="mb-8 p-4 bg-[#f5f2ed] border-2 border-black">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[11px] uppercase font-bold text-[#8b0000] tracking-widest">
              INVESTIGATION SEQUENCE PROTOCOL
            </span>
            <span className="font-mono text-[10px] text-[#737373] uppercase">
              Follow Steps 1 → 4
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-sans font-bold">
            <button
              onClick={() => scrollToSection('section-evidence')}
              className="flex items-center gap-2 p-2 bg-white border border-black text-left hover:bg-[#8b0000] hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-mono">
                1
              </span>
              <span className="truncate">Evidence</span>
            </button>

            <button
              onClick={() => scrollToSection('section-suspects')}
              className={`flex items-center gap-2 p-2 border border-black text-left transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                hasGuestAccusation 
                  ? 'bg-[#e8e2d8] text-black hover:bg-black hover:text-white' 
                  : 'bg-white text-black hover:bg-[#8b0000] hover:text-white'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono ${
                hasGuestAccusation ? 'bg-[#8b0000] text-white' : 'bg-black text-white'
              }`}>
                2
              </span>
              <span className="truncate">Suspect Board</span>
            </button>

            <button
              onClick={() => scrollToSection('section-review')}
              className="flex items-center gap-2 p-2 bg-white border border-black text-left hover:bg-[#8b0000] hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-mono">
                3
              </span>
              <span className="truncate">My Review</span>
            </button>

            <button
              onClick={() => scrollToSection('section-classified')}
              className={`flex items-center gap-2 p-2 border border-black text-left transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                isClassifiedUnlocked 
                  ? 'bg-[#22c55e]/10 text-black hover:bg-[#22c55e] hover:text-white' 
                  : 'bg-[#1a1a1a] text-white hover:bg-[#8b0000]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono ${
                isClassifiedUnlocked ? 'bg-[#15803d] text-white' : 'bg-[#8b0000] text-white'
              }`}>
                4
              </span>
              <span className="truncate">What Happened</span>
            </button>
          </div>
        </div>

        {/* Book Overview & Forensic Context Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 pb-8 border-b border-black border-opacity-20">
          
          {/* Left: Book Cover Photo with evidence border */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative p-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] mb-3 group">
              <div className="relative overflow-hidden">
                <img
                  src={review.coverImage}
                  alt={review.title}
                  className="w-48 sm:w-56 h-72 object-cover grayscale-[15%] contrast-[110%]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Quick Hover / Click Replace Overlay */}
                <div 
                  onClick={() => setIsQuickImageOpen(true)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 cursor-pointer text-white text-center"
                >
                  <Camera size={24} className="mb-1 text-[#e8e2d8]" />
                  <span className="font-sans text-xs uppercase font-black tracking-wider">
                    Replace Cover Image
                  </span>
                  <span className="font-mono text-[9px] text-[#d4cfc7] mt-1">
                    Upload file or paste URL
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-black mt-1">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#1a1a1a] font-bold">
                  EVIDENCE ITEM #{review.caseNumber}-A
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickImageOpen(true)}
                  className="font-sans text-[9px] font-bold uppercase text-[#8b0000] hover:underline flex items-center gap-0.5"
                  title="Change image"
                >
                  <Camera size={10} /> Change
                </button>
              </div>
            </div>

            {/* Quick Change Cover Button */}
            <button
              type="button"
              onClick={() => setIsQuickImageOpen(true)}
              className="mb-2 bg-[#f5f2ed] hover:bg-black hover:text-white text-[#1a1a1a] border border-black px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              <Camera size={11} />
              <span>Replace Dossier Photo</span>
            </button>

            {/* Recommended for Tag */}
            {review.recommendedFor && (
              <div className="w-full bg-[#f5f2ed] border border-black p-2.5 text-center text-xs mt-2">
                <span className="font-sans text-[9px] font-bold text-[#737373] uppercase tracking-wider block mb-0.5">
                  RECOMMENDED FOR:
                </span>
                <p className="font-serif italic text-xs text-[#1a1a1a]">
                  {review.recommendedFor}
                </p>
              </div>
            )}
          </div>

          {/* Right: Premise & Forensics */}
          <div className="md:col-span-8 space-y-5">
            
            {/* Rating Scores Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#f5f2ed] p-2.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
                <span className="font-sans text-[9px] font-bold text-[#737373] uppercase tracking-wider block">
                  JOURNAL RATING
                </span>
                <div className="text-[#8b0000] font-bold text-base tracking-wider">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
              </div>

              <div className="bg-[#f5f2ed] p-2.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
                <span className="font-sans text-[9px] font-bold text-[#737373] uppercase tracking-wider block">
                  ATMOSPHERE
                </span>
                <div className="text-[#1a1a1a] font-bold text-sm font-sans">
                  {'🕯️'.repeat(review.atmosphereRating || 5)} ({review.atmosphereRating || 5}/5)
                </div>
              </div>

              <div className="bg-[#f5f2ed] p-2.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
                <span className="font-sans text-[9px] font-bold text-[#737373] uppercase tracking-wider block">
                  PACING TENSION
                </span>
                <div className="text-[#1a1a1a] font-bold text-sm font-sans">
                  {'⚡'.repeat(review.pacingRating || 5)} ({review.pacingRating || 5}/5)
                </div>
              </div>

              <div className="bg-[#f5f2ed] p-2.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
                <span className="font-sans text-[9px] font-bold text-[#737373] uppercase tracking-wider block">
                  PLOT TWISTS
                </span>
                <div className="text-[#8b0000] font-bold text-sm font-sans">
                  {review.twistsCount} Twists
                </div>
              </div>
            </div>

            {/* Tropes & Sub-Genre Tags */}
            {review.tropes && review.tropes.length > 0 && (
              <div>
                <span className="font-sans text-[10px] font-bold uppercase text-[#737373] tracking-wider block mb-1.5">
                  IDENTIFIED THRILLER TROPES:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {review.tropes.map((trope, i) => (
                    <span 
                      key={i} 
                      className="bg-[#1a1a1a] text-white text-[10px] font-sans font-bold px-2 py-0.5 uppercase tracking-wider"
                    >
                      {trope}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Premise Synopsis */}
            <div>
              <h3 className="font-sans text-xs uppercase font-bold text-[#1a1a1a] tracking-wider mb-1.5">
                SYNOPSIS OF THE CRIME / PREMISE:
              </h3>
              <p className="font-serif text-base text-[#1a1a1a] leading-relaxed">
                {review.summary}
              </p>
            </div>

            {/* Key Evidence Bullets */}
            {review.evidenceBullets && review.evidenceBullets.length > 0 && (
              <div>
                <h3 className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-wider mb-2">
                  NOTABLE FORENSIC MARKERS:
                </h3>
                <ul className="space-y-1.5 font-serif text-sm text-[#1a1a1a]">
                  {review.evidenceBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#f5f2ed] p-2.5 border border-black border-opacity-20">
                      <span className="text-[#8b0000] font-bold">▶</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

        {/* ======================================================== */}
        {/* SECTION 1: EVIDENCE (CLUE BOARD)                         */}
        {/* ======================================================== */}
        {review.clues && review.clues.length > 0 && (
          <div className="pt-2">
            <ClueBoard review={review} />
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 2: SUSPECT BOARD (WHO DID IT? & GUESS SELECTION) */}
        {/* ======================================================== */}
        {review.suspects && review.suspects.length > 0 && (
          <div className="pt-4">
            <SuspectBoard review={review} />
          </div>
        )}

        {/* Optional Interactive Theory Builder */}
        <TheoryBuilder review={review} />

        {/* ======================================================== */}
        {/* SECTION 3: MY REVIEW                                     */}
        {/* ======================================================== */}
        <section id="section-review" className="my-10 pt-4 border-t-2 border-black border-dashed">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#8b0000] text-white text-[10px] font-sans font-bold uppercase px-2 py-0.5 tracking-wider">
                  STEP 3 OF 4
                </span>
                <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest">
                  INVESTIGATOR'S CRITICAL REPORT
                </span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black uppercase text-[#1a1a1a] tracking-tight font-serif">
                MY FULL BOOK REVIEW & DISSECTION
              </h3>
            </div>

            {isAdminUnlocked && (
              <button
                onClick={() => setEditingReview(review)}
                className="text-xs font-sans font-bold uppercase text-[#8b0000] hover:underline flex items-center gap-1"
              >
                <Edit3 size={12} />
                <span>Edit review text</span>
              </button>
            )}
          </div>

          {/* Newspaper Editorial Review Body */}
          <div className="newspaper-columns text-base font-serif text-[#1a1a1a] leading-relaxed space-y-4 mb-8">
            {review.reviewText.split('\n\n').map((para, i) => (
              <p key={i} className="drop-cap">
                {para}
              </p>
            ))}
          </div>

          {/* Handwritten Margin Notes */}
          {review.marginaliaNotes && review.marginaliaNotes.length > 0 && (
            <div className="mb-8 p-4 bg-[#fffef7] border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-sans text-[10px] text-[#8b0000] uppercase tracking-widest font-bold block mb-1">
                STUDENT MARGINALIA SCRIBBLINGS:
              </span>
              <div className="space-y-1">
                {review.marginaliaNotes.map((note, idx) => (
                  <p key={idx} className="font-marginalia text-lg text-[#1a1a1a] font-bold">
                    ✏️ “{note}”
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* What I Thought Would Happen (Pre-Twist Prediction) */}
          {review.whatIThought && (
            <div className="bg-[#e8e2d8] p-5 border-2 border-black mb-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-wider block mb-1">
                MY PRE-TWIST THEORY (BEFORE THE CLIMAX):
              </span>
              <p className="font-serif text-base text-[#1a1a1a] italic leading-relaxed">
                “{review.whatIThought}”
              </p>
            </div>
          )}

          {/* Favorite Part & Final Verdict */}
          <div className="space-y-4 mb-8 pb-8 border-b border-black border-opacity-20">
            {review.favoriteMoment && (
              <div className="p-4 bg-[#f5f2ed] border border-black border-opacity-20">
                <h4 className="font-sans text-xs uppercase font-bold text-[#1a1a1a] tracking-wider mb-1">
                  FAVORITE CHILLING MOMENT:
                </h4>
                <p className="font-serif text-base text-[#1a1a1a]">
                  {review.favoriteMoment}
                </p>
              </div>
            )}

            {review.finalVerdict && (
              <div className="p-4 bg-[#fffef7] border-l-4 border-black border border-black border-opacity-20">
                <h4 className="font-sans text-xs uppercase font-bold text-[#1a1a1a] tracking-wider mb-1">
                  FINAL VERDICT:
                </h4>
                <p className="font-serif text-lg text-[#1a1a1a] font-semibold italic">
                  {review.finalVerdict}
                </p>
              </div>
            )}
          </div>

          {/* Reader Likes, Polls & Witness Testimonies */}
          <InteractiveEngagement review={review} compact={false} />

          {/* Nudge to Proceed to Step 4 */}
          <div className="mt-8 p-4 bg-[#f5f2ed] border-2 border-black flex flex-wrap items-center justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-wider block">
                READY FOR THE REVEAL?
              </span>
              <p className="font-serif text-sm text-[#1a1a1a]">
                You've examined the Evidence, locked in your Suspect, and read the Review. Time to unseal the truth.
              </p>
            </div>

            <button
              onClick={() => scrollToSection('section-classified')}
              className="flex items-center gap-2 bg-[#8b0000] hover:bg-black text-white px-5 py-2.5 text-xs font-sans uppercase font-bold tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-colors"
            >
              <span>Go to Step 4: Classified File</span>
              <ArrowDown size={13} />
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 4: WHAT ACTUALLY HAPPENED (CLASSIFIED INFO)       */}
        {/* ======================================================== */}
        <ClassifiedInformationSection review={review} />

        {/* Bottom footer button */}
        <div className="text-center pt-8 border-t border-black border-opacity-20 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setSelectedReview(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-black hover:bg-[#8b0000] text-white px-6 py-2.5 text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
          >
            <ArrowLeft size={14} />
            <span>RETURN TO ARCHIVE MASTER LIST</span>
          </button>

          {isAdminUnlocked && (
            <button
              onClick={() => setEditingReview(review)}
              className="inline-flex items-center gap-2 bg-[#8b0000] hover:bg-black text-white px-6 py-2.5 text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              <Edit3 size={14} />
              <span>EDIT THIS BOOK DOSSIER</span>
            </button>
          )}
        </div>

      </div>

      {/* Quick Image Replacement Modal */}
      <QuickImageModal
        isOpen={isQuickImageOpen}
        onClose={() => setIsQuickImageOpen(false)}
        targetType="review"
        targetReview={review}
        initialImage={review.coverImage}
        onSaveImage={handleUpdateCover}
        title={`Replace Cover Photo for Case #${review.caseNumber}: ${review.title}`}
      />
    </article>
  );
};
