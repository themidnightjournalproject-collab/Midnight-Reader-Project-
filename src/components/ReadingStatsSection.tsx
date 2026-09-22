import React from 'react';
import { useJournal } from '../context/JournalContext';
import { Edit3 } from 'lucide-react';

export const ReadingStatsSection: React.FC = () => {
  const { stats, setIsStatsEditorOpen, isAdminUnlocked } = useJournal();

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="border-b-2 border-black pb-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest">
                CRIME METRICS • STATISTICAL AUDIT
              </span>
              <span className="text-[#737373]">•</span>
              <span className="font-sans text-xs text-[#4a4a4a] uppercase">
                ANNUAL READING ANALYSIS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight uppercase font-serif">
              {stats.year} YEAR IN BOOKS
            </h2>
          </div>

          {isAdminUnlocked && (
            <button
              onClick={() => setIsStatsEditorOpen(true)}
              className="flex items-center gap-1.5 bg-black hover:bg-[#8b0000] text-white px-4 py-2 text-xs font-sans uppercase tracking-wider font-bold transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              <Edit3 size={14} />
              <span>EDIT METRICS</span>
            </button>
          )}
        </div>

        <p className="font-serif text-base text-[#4a4a4a] italic mt-2 max-w-3xl">
          An empirical breakdown of fictional crimes investigated, erroneous assumptions made, and sleep lost over locked room paradoxes.
        </p>
      </div>

      {/* Humorous Front Page Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Books Read */}
        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
            TOTAL VOLUMES INVESTIGATED
          </span>
          <div className="font-serif text-4xl sm:text-5xl font-black text-[#1a1a1a]">
            {stats.booksRead}
          </div>
          <p className="font-serif text-xs text-[#4a4a4a] italic mt-2">
            Includes {stats.thrillersRead} psychological thrillers & locked-room mysteries.
          </p>
        </div>

        {/* Suspects Accused */}
        <div className="p-6 border-2 border-[#8b0000] bg-white shadow-[4px_4px_0px_0px_rgba(139,0,0,0.3)] relative">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#8b0000] block mb-1">
            SUSPECTS ACCUSED
          </span>
          <div className="font-serif text-4xl sm:text-5xl font-black text-[#8b0000]">
            {stats.suspectsAccused}
          </div>
          <p className="font-serif text-xs text-[#4a4a4a] italic mt-2">
            Virtually every spouse, gardener, and friendly postal worker encountered.
          </p>
        </div>

        {/* Correct Deductions */}
        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
            CORRECT GUESSES
          </span>
          <div className="font-serif text-4xl sm:text-5xl font-black text-[#1a1a1a] flex items-baseline gap-2">
            <span>{stats.correctGuesses}</span>
            <span className="text-sm font-sans font-bold text-[#8b0000]">({Math.round((stats.correctGuesses / (stats.suspectsAccused || 1)) * 100)}% accuracy)</span>
          </div>
          <p className="font-serif text-xs text-[#4a4a4a] italic mt-2">
            Constantly outsmarted by authors with trust issues.
          </p>
        </div>

        {/* Paranoia Rating */}
        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
            UNNECESSARY PARANOIA
          </span>
          <div className="font-serif text-4xl sm:text-5xl font-black text-[#1a1a1a]">
            {stats.unnecessaryParanoia}%
          </div>
          <p className="font-serif text-xs text-[#4a4a4a] italic mt-2">
            Still checking closet door handles twice before studying.
          </p>
        </div>

        {/* Cups of Coffee/Tea */}
        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
            CAFFEINE RATIONS CONSUMED
          </span>
          <div className="font-serif text-4xl sm:text-5xl font-black text-[#1a1a1a]">
            {stats.cupsOfTeaDrank}
          </div>
          <p className="font-serif text-xs text-[#4a4a4a] italic mt-2">
            Steeped exclusively during late-night chapters starting at 1:00 AM.
          </p>
        </div>

        {/* Plot Twists Survived */}
        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
            SEVERE PLOT TWISTS
          </span>
          <div className="font-serif text-4xl sm:text-5xl font-black text-[#8b0000]">
            {stats.plotTwistsExperienced}
          </div>
          <p className="font-serif text-xs text-[#4a4a4a] italic mt-2">
            Moments causing book to be dropped directly onto forehead.
          </p>
        </div>

      </div>

      {/* Editorial Highlights Banner */}
      <div className="p-6 border-2 border-black bg-[#f5f2ed] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
          <div>
            <span className="text-[#737373] uppercase font-bold block mb-1">FAVORITE READ:</span>
            <span className="font-serif text-xl font-bold text-[#1a1a1a] block">{stats.favoriteBook}</span>
          </div>
          <div>
            <span className="text-[#737373] uppercase font-bold block mb-1">LONGEST VOLUME:</span>
            <span className="font-serif text-xl font-bold text-[#1a1a1a] block">{stats.longestBook} ({stats.longestBookPages} pages)</span>
          </div>
          <div>
            <span className="text-[#737373] uppercase font-bold block mb-1">AVERAGE JOURNAL SCORE:</span>
            <span className="font-serif text-xl font-bold text-[#8b0000] block">★ {stats.averageRating} / 5.0</span>
          </div>
        </div>
      </div>
    </section>
  );
};

