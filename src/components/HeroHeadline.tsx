import React from 'react';
import { useJournal } from '../context/JournalContext';
import { FolderLock, Edit3 } from 'lucide-react';

export const HeroHeadline: React.FC = () => {
  const { 
    setActiveView, 
    setSelectedReview, 
    reviews, 
    stats, 
    heroConfig, 
    setIsEditHeroModalOpen,
    setIsStatsEditorOpen,
    isAdminUnlocked
  } = useJournal();

  const handleEnterArchive = () => {
    setActiveView('journal');
    const journalElem = document.getElementById('reading-journal-section');
    if (journalElem) {
      journalElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenFeaturedCase = () => {
    if (reviews.length > 0) {
      setSelectedReview(reviews[0]);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Front-page Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b-2 border-black pb-8">
        
        {/* Left / Main Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black border-opacity-20 lg:pr-8 pb-6 lg:pb-0">
          <div>
            {/* Small Archive stamp & category */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="bg-black text-white text-[10px] px-2 py-0.5 uppercase tracking-widest font-sans font-bold">
                  {heroConfig.leadCategory || 'Lead Story • Case Dispatch'}
                </span>
                <span className="text-[11px] font-sans font-bold text-[#8b0000] tracking-wider uppercase">
                  {heroConfig.dossierCode || 'Dossier #2026-B'}
                </span>
              </div>
              {isAdminUnlocked && (
                <button
                  id="btn-trigger-edit-hero"
                  onClick={() => setIsEditHeroModalOpen(true)}
                  title="Edit the front-page dispatch text & headline"
                  className="flex items-center gap-1 text-[10px] uppercase font-sans font-bold text-gray-500 hover:text-black border border-dashed border-gray-400 hover:border-black px-2 py-0.5 transition-colors bg-white"
                >
                  <Edit3 size={11} className="text-[#8b0000]" />
                  <span>Edit Dispatch</span>
                </button>
              )}
            </div>

            {/* Large Newspaper Headline */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#1a1a1a] leading-tight mb-4 font-serif" style={{ letterSpacing: '-1.5px' }}>
              {heroConfig.headline || '“ANOTHER BOOK. ANOTHER SUSPECT.”'}
            </h2>

            {/* Student Intro Paragraph with drop-cap */}
            <p className="drop-cap font-serif text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-4">
              {heroConfig.introParagraph1}
            </p>

            <p className="font-serif text-sm sm:text-base text-[#4a4a4a] leading-relaxed mb-6">
              {heroConfig.introParagraph2}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black border-opacity-20">
            <button
              id="btn-enter-archive"
              onClick={handleEnterArchive}
              className="flex items-center gap-2 bg-black hover:bg-[#8b0000] text-white px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
            >
              <span>ENTER THE ARCHIVE</span>
              <span>→</span>
            </button>

            <button
              id="btn-open-featured"
              onClick={handleOpenFeaturedCase}
              className="flex items-center gap-2 bg-white hover:bg-[#e8e2d8] text-black border border-black px-4 py-2.5 text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
            >
              <FolderLock size={14} className="text-[#8b0000]" />
              <span>EXAMINE CASE #{reviews[0]?.caseNumber || '014'}</span>
            </button>

            <button
              id="btn-goto-nonfiction"
              onClick={() => setActiveView('non-fiction')}
              className="flex items-center gap-1.5 bg-[#f5f1e8] hover:bg-[#eae3d2] text-black border border-black px-3.5 py-2.5 text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>THE LIBRARY & BEYOND</span>
            </button>
          </div>
        </div>

        {/* Right / Sidebar Column (4 cols) - Vital Statistics & Blotter */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          {/* Vital Statistics Box */}
          <div className="bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
              <h3 className="bg-black text-white text-[10px] px-2 py-0.5 uppercase tracking-widest font-sans font-bold">
                Vital Statistics
              </h3>
              <div className="flex items-center gap-2">
                {isAdminUnlocked && (
                  <button
                    id="btn-edit-vital-stats"
                    onClick={() => setIsStatsEditorOpen(true)}
                    title="Edit Vital Reading Statistics"
                    className="flex items-center gap-1 text-[10px] uppercase font-sans font-bold text-gray-600 hover:text-[#8b0000] border border-dashed border-gray-400 hover:border-black px-1.5 py-0.5 transition-colors bg-white cursor-pointer"
                  >
                    <Edit3 size={10} className="text-[#8b0000]" />
                    <span>Edit Stats</span>
                  </button>
                )}
                <span className="text-[10px] font-sans font-bold text-[#8b0000] uppercase tracking-wider">
                  Live Audit
                </span>
              </div>
            </div>

            <div className="space-y-3 font-sans text-xs pt-1">
              <div className="flex justify-between items-center border-b border-dotted border-black pb-1.5">
                <span className="uppercase text-[#4a4a4a] text-[11px] font-bold">Thrillers Read</span>
                <span className="font-bold text-sm text-[#1a1a1a]">{stats.thrillersRead}</span>
              </div>
              <div className="flex justify-between items-center border-b border-dotted border-black pb-1.5">
                <span className="uppercase text-[#4a4a4a] text-[11px] font-bold">Suspects Accused</span>
                <span className="font-bold text-sm text-[#1a1a1a]">{stats.suspectsAccused}</span>
              </div>
              <div className="flex justify-between items-center border-b border-dotted border-black pb-1.5">
                <span className="uppercase text-[#4a4a4a] text-[11px] font-bold">Correct Guesses</span>
                <span className="font-bold text-sm text-[#1a1a1a]">{stats.correctGuesses}</span>
              </div>
              <div className="flex justify-between items-center border-b border-dotted border-black pb-1.5">
                <span className="uppercase text-[#4a4a4a] text-[11px] font-bold">Paranoia Level</span>
                <span className="font-bold text-sm text-[#8b0000]">{stats.unnecessaryParanoia}%</span>
              </div>
            </div>
          </div>

          {/* Student Margin Note */}
          <div className="pinned-note p-4 rounded-sm rotate-1 text-[#1a1a1a] border border-black bg-[#fffef7] relative group">
            <span className="font-sans text-[9px] text-[#737373] uppercase tracking-widest block font-bold mb-1">
              DESK MARGINALIA:
            </span>
            <p className="font-marginalia text-lg text-[#1a1a1a] leading-snug font-bold">
              “{heroConfig.marginaliaQuote}”
            </p>
            {heroConfig.marginaliaAuthor && (
              <span className="block text-right font-mono text-[10px] text-gray-500 mt-2 italic">
                — {heroConfig.marginaliaAuthor}
              </span>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};


