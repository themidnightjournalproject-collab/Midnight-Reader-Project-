import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Search, PlusCircle, Lock, Unlock, KeyRound, FolderLock, Database, BarChart2 } from 'lucide-react';

export const Masthead: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    searchQuery, 
    setSearchQuery, 
    setIsNewReviewModalOpen,
    setIsNewNonFictionModalOpen,
    setIsEditHeroModalOpen,
    setSelectedReview,
    setSelectedNonFictionBook,
    reviews,
    nonFictionBooks,
    isAdminUnlocked,
    setIsAdminModalOpen,
    lockAdmin
  } = useJournal();

  const [showSearch, setShowSearch] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleNavClick = (view: typeof activeView) => {
    setSelectedReview(null);
    if (setSelectedNonFictionBook) setSelectedNonFictionBook(null);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full max-w-6xl mx-auto px-4 pt-4 pb-2 relative">
      
      {/* Top Banner Bar - Editorial Newspaper Info & Editor Clearance status */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-sans uppercase tracking-[0.2em] font-bold text-[#1a1a1a] border-b-2 border-black pb-2 mb-3 gap-2">
        <div className="flex items-center gap-3 sm:gap-6">
          <span>Vol. XXIV — No. 114</span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span>{currentDate}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden md:inline text-[#8b0000]">Classified: Case Archive</span>
          <span className="hidden md:inline opacity-40">•</span>
          
          {/* Chief Investigator / Editor Access toggle */}
          {isAdminUnlocked ? (
            <div className="flex items-center gap-2">
              <span className="bg-[#8b0000] text-white px-2 py-0.5 text-[10px] font-mono font-bold flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <Unlock size={10} /> EDITOR ACTIVE
              </span>
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="text-[#1a1a1a] hover:text-[#8b0000] underline text-[10px] lowercase font-mono"
              >
                (desk options)
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1 text-[#4a4a4a] hover:text-[#8b0000] px-1.5 py-0.5 border border-black border-opacity-30 hover:border-opacity-100 transition-colors text-[10px] bg-white"
              title="Chief Investigator / Owner Login to edit or add reviews"
            >
              <KeyRound size={11} className="text-[#8b0000]" />
              <span>Editor Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Mode Floating Ribbon if unlocked */}
      {isAdminUnlocked && (
        <div className="bg-[#1a1a1a] text-[#f5f2ed] border-2 border-black px-4 py-2 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-sans shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold uppercase tracking-wider text-[11px] text-white">
              CHIEF INVESTIGATOR OFFICE ACTIVE
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsNewReviewModalOpen(true)}
              className="flex items-center gap-1 bg-[#8b0000] hover:bg-white hover:text-black text-white px-2.5 py-1 text-[11px] font-bold uppercase transition-colors"
            >
              <PlusCircle size={12} />
              <span>+ File Case</span>
            </button>
            <button
              onClick={() => setIsNewNonFictionModalOpen(true)}
              className="flex items-center gap-1 bg-[#3a3a3a] hover:bg-white hover:text-black text-white px-2.5 py-1 text-[11px] font-bold uppercase transition-colors"
            >
              <PlusCircle size={12} />
              <span>+ Log Research Dossier</span>
            </button>
            <button
              onClick={() => setIsEditHeroModalOpen(true)}
              className="flex items-center gap-1 bg-[#222] hover:bg-white hover:text-black text-white px-2.5 py-1 text-[11px] font-bold uppercase transition-colors"
            >
              <span>Edit Dispatch</span>
            </button>
            <button
              onClick={() => handleNavClick('manage-books')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase border border-white border-opacity-30 hover:bg-white hover:text-black transition-colors ${
                activeView === 'manage-books' ? 'bg-white text-black' : 'text-white'
              }`}
            >
              <FolderLock size={12} />
              <span>Manage Archive</span>
            </button>
            <button
              onClick={() => handleNavClick('backup-sync')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase border border-white border-opacity-30 hover:bg-white hover:text-black transition-colors ${
                activeView === 'backup-sync' ? 'bg-white text-black' : 'text-white'
              }`}
            >
              <Database size={12} />
              <span>Backup & Seed Code</span>
            </button>
            <button
              onClick={lockAdmin}
              className="flex items-center gap-1 text-[#d4cfc7] hover:text-white px-2 py-1 text-[10px] font-mono underline ml-1"
              title="Lock desk and return to public visitor mode"
            >
              <Lock size={11} />
              <span>Lock Desk</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Newspaper Masthead Title */}
      <div className="text-center py-2 sm:py-4 border-b-2 border-black">
        <h1 
          onClick={() => handleNavClick('home')}
          className="text-5xl sm:text-7xl md:text-8xl font-black uppercase text-[#1a1a1a] cursor-pointer hover:opacity-90 transition-opacity select-none font-serif tracking-tighter"
          style={{ letterSpacing: '-2px' }}
        >
          The Midnight Reader
        </h1>
        
        <p className="font-serif italic text-sm sm:text-base text-[#1a1a1a] opacity-80 mt-1 max-w-2xl mx-auto">
          'A student's reading journal — mostly suspicious people, unreliable narrators, and terrible decisions.'
        </p>
      </div>

      {/* Navigation & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-black pb-3 pt-3 mb-4 gap-2">
        {/* Navigation Items */}
        <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-5 md:gap-6 font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">
          <button
            id="nav-home"
            onClick={() => handleNavClick('home')}
            className={`transition-all hover:underline ${
              activeView === 'home' 
                ? 'underline decoration-2 text-[#8b0000]' 
                : 'hover:text-[#8b0000]'
            }`}
          >
            Home
          </button>
          <button
            id="nav-journal"
            onClick={() => handleNavClick('journal')}
            className={`transition-all hover:underline ${
              activeView === 'journal' 
                ? 'underline decoration-2 text-[#8b0000]' 
                : 'hover:text-[#8b0000]'
            }`}
          >
            Reading Journal ({reviews.length + nonFictionBooks.length})
          </button>
          <button
            id="nav-casefiles"
            onClick={() => handleNavClick('casefiles')}
            className={`transition-all hover:underline ${
              activeView === 'casefiles' || activeView === 'reviews'
                ? 'underline decoration-2 text-[#8b0000]' 
                : 'hover:text-[#8b0000]'
            }`}
          >
            Case Files ({reviews.length})
          </button>
          <button
            id="nav-non-fiction"
            onClick={() => handleNavClick('non-fiction')}
            className={`transition-all hover:underline flex items-center gap-1 ${
              activeView === 'non-fiction' 
                ? 'underline decoration-2 text-[#8b0000]' 
                : 'hover:text-[#8b0000]'
            }`}
          >
            <span>Non-Fiction ({nonFictionBooks.length})</span>
          </button>
          <button
            id="nav-currently-reading"
            onClick={() => handleNavClick('currently-reading')}
            className={`transition-all hover:underline ${
              activeView === 'currently-reading' 
                ? 'underline decoration-2 text-[#8b0000]' 
                : 'hover:text-[#8b0000]'
            }`}
          >
            Currently Reading
          </button>
          <button
            id="nav-suspect-board"
            onClick={() => handleNavClick('suspect-board')}
            className={`transition-all hover:underline ${
              activeView === 'suspect-board' 
                ? 'underline decoration-2 text-[#8b0000]' 
                : 'hover:text-[#8b0000]'
            }`}
          >
            Suspect Board
          </button>
          <button
            id="nav-timeline"
            onClick={() => handleNavClick('timeline')}
            className={`transition-all hover:underline ${
              activeView === 'timeline' 
                ? 'underline decoration-2 text-[#8b0000]' 
                : 'hover:text-[#8b0000]'
            }`}
          >
            Timeline
          </button>
          <button
            id="nav-analytics"
            onClick={() => handleNavClick('analytics')}
            className={`transition-all hover:underline flex items-center gap-1 ${
              activeView === 'analytics' 
                ? 'underline decoration-2 text-[#8b0000]' 
                : 'hover:text-[#8b0000]'
            }`}
          >
            <BarChart2 size={13} className="text-[#8b0000]" />
            <span>Reader Intelligence</span>
          </button>
          <button
            id="nav-stats"
            onClick={() => handleNavClick('stats')}
            className={`transition-all hover:underline ${
              activeView === 'stats' 
                ? 'underline decoration-2 text-[#8b0000]' 
                : 'hover:text-[#8b0000]'
            }`}
          >
            Stats
          </button>
          <button
            id="nav-about"
            onClick={() => handleNavClick('about')}
            className={`transition-all hover:underline ${
              activeView === 'about' 
                ? 'underline decoration-2 text-[#8b0000]' 
                : 'hover:text-[#8b0000]'
            }`}
          >
            About
          </button>
        </nav>

        {/* Right action controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search Toggle */}
          <div className="relative flex items-center">
            {showSearch ? (
              <div className="flex items-center bg-[#ffffff] border border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Search size={13} className="text-black mr-1.5" />
                <input
                  type="text"
                  placeholder="Search case files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs font-mono focus:outline-none w-32 sm:w-40 text-[#1a1a1a]"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="text-xs text-black hover:text-[#8b0000] ml-1 font-mono font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                id="btn-search-toggle"
                onClick={() => setShowSearch(true)}
                className="p-1.5 hover:bg-[#e8e2d8] text-[#1a1a1a] rounded transition-colors"
                title="Search archive"
              >
                <Search size={15} />
              </button>
            )}
          </div>

          {/* New Review Entry Button - ONLY shown if admin unlocked */}
          {isAdminUnlocked && (
            <button
              id="btn-file-case"
              onClick={() => setIsNewReviewModalOpen(true)}
              className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#8b0000] text-white px-3 py-1 text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
              title="Add a new book review and suspect dossier"
            >
              <PlusCircle size={13} />
              <span className="hidden sm:inline">File Case</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
