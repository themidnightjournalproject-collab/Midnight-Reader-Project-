import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Edit3, Clock, Sparkles, Award, Bookmark, Calendar, ArrowRight } from 'lucide-react';

export const ReadingTimeline: React.FC = () => {
  const { 
    reviews, 
    setSelectedReview,
    timelineStats,
    timelineMilestones,
    setIsTimelineEditorOpen,
    isAdminUnlocked,
    setIsAdminModalOpen
  } = useJournal();

  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');

  // Group reviews by year
  const years = Array.from(new Set<number>(reviews.map((r) => Number(r.yearRead || 2025)))).sort((a, b) => b - a);

  const filteredReviews = reviews.filter((r) => {
    if (selectedYear === 'ALL') return true;
    return r.yearRead === selectedYear;
  });

  const filteredMilestones = timelineMilestones.filter((m) => {
    if (selectedYear === 'ALL') return true;
    return m.year === selectedYear;
  });

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest">
                HISTORICAL LEDGER
              </span>
              <span className="text-[#737373]">•</span>
              <span className="font-sans text-xs text-[#4a4a4a] uppercase">
                CHRONOLOGICAL READING RECORD
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight uppercase font-serif">
              THE READING JOURNEY TIMELINE
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Edit Timeline Stats Button (strictly admin-only) */}
            {isAdminUnlocked && (
              <button
                onClick={() => setIsTimelineEditorOpen(true)}
                className="flex items-center gap-1.5 bg-black hover:bg-[#8b0000] text-white px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider font-bold transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
              >
                <Edit3 size={13} />
                <span>EDIT TIMELINE & STATS</span>
              </button>
            )}

            {/* Year Filter Buttons */}
            <div className="flex items-center gap-1.5 font-sans text-xs font-bold">
              <button
                onClick={() => setSelectedYear('ALL')}
                className={`px-3 py-1 uppercase transition-colors ${
                  selectedYear === 'ALL'
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black border border-black hover:bg-[#f5f2ed]'
                }`}
              >
                All Years
              </button>
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 uppercase transition-colors ${
                    selectedYear === yr
                      ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black border border-black hover:bg-[#f5f2ed]'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="font-serif text-base text-[#4a4a4a] italic mt-2 max-w-3xl">
          {timelineStats.historicalLedgerNote || 'An archival ledger tracking the descent into fictional crime fiction over the years. Select any entry to inspect its corresponding case file.'}
        </p>
      </div>

      {/* Timeline Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[10px] font-sans font-bold uppercase text-[#737373] block mb-0.5 tracking-wider">
            ARCHIVE SPAN
          </span>
          <span className="font-serif font-bold text-sm text-[#1a1a1a] block truncate">
            {timelineStats.archiveSpan}
          </span>
        </div>

        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[10px] font-sans font-bold uppercase text-[#737373] block mb-0.5 tracking-wider">
            READING PACE
          </span>
          <span className="font-serif font-bold text-sm text-[#1a1a1a] block truncate">
            {timelineStats.readingPace}
          </span>
        </div>

        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[10px] font-sans font-bold uppercase text-[#737373] block mb-0.5 tracking-wider">
            FASTEST SOLVE
          </span>
          <span className="font-serif font-bold text-sm text-[#8b0000] block truncate">
            {timelineStats.fastestInvestigation}
          </span>
        </div>

        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[10px] font-sans font-bold uppercase text-[#737373] block mb-0.5 tracking-wider">
            LONGEST DOSSIER
          </span>
          <span className="font-serif font-bold text-sm text-[#1a1a1a] block truncate">
            {timelineStats.longestCaseFile}
          </span>
        </div>

        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[10px] font-sans font-bold uppercase text-[#737373] block mb-0.5 tracking-wider">
            {timelineStats.customTimelineStat1Label || 'COLD CASES'}
          </span>
          <span className="font-serif font-bold text-sm text-[#1a1a1a] block truncate">
            {timelineStats.customTimelineStat1Value || timelineStats.coldCasesSolved}
          </span>
        </div>

        <div className="p-3 bg-[#fdfbf7] border-2 border-[#8b0000] shadow-[3px_3px_0px_0px_rgba(139,0,0,0.3)]">
          <span className="text-[10px] font-sans font-bold uppercase text-[#8b0000] block mb-0.5 tracking-wider">
            {timelineStats.customTimelineStat2Label || 'RECORD STREAK'}
          </span>
          <span className="font-serif font-bold text-sm text-[#8b0000] block truncate">
            {timelineStats.customTimelineStat2Value || '74 Days'}
          </span>
        </div>
      </div>

      {/* Historical Milestones Banner if any match year */}
      {filteredMilestones.length > 0 && (
        <div className="mb-10 p-5 bg-[#f5f2ed] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-[#8b0000]" />
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-[#1a1a1a]">
                ARCHIVAL BREAKTHROUGHS & CHRONOLOGY MILESTONES
              </h3>
            </div>
            <span className="text-[11px] font-sans text-[#737373]">
              {filteredMilestones.length} Recorded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMilestones.map((ms) => (
              <div 
                key={ms.id} 
                className="p-3 bg-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1 relative"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#8b0000] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 uppercase">
                    {ms.date}
                  </span>
                  {ms.badgeText && (
                    <span className="text-[10px] font-sans font-bold uppercase text-[#4a4a4a] border border-black border-opacity-30 px-1">
                      {ms.badgeText}
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">
                  {ms.title}
                </h4>
                <p className="font-serif text-xs text-[#4a4a4a] leading-relaxed">
                  {ms.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Layout */}
      <div className="relative border-l-2 border-black ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10 py-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="relative group">
            {/* Timeline Node Point (Vintage Wax Seal / Red Pin) */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 bg-white border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#8b0000] group-hover:border-[#8b0000] transition-colors">
              <div className="w-2 h-2 bg-[#8b0000] group-hover:bg-white" />
            </div>

            {/* Timeline Card */}
            <div
              onClick={() => {
                setSelectedReview(review);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="border-2 border-black p-5 sm:p-6 bg-white cursor-pointer transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
            >
              <div className="flex flex-wrap items-center justify-between border-b border-black pb-2 mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs font-bold text-[#8b0000] uppercase tracking-wider">
                    CASE #{review.caseNumber}
                  </span>
                  <span className="text-[#737373]">•</span>
                  <span className="font-mono text-xs text-[#4a4a4a]">
                    {review.dateRead}
                  </span>
                </div>
                <span className="border border-black text-black font-mono text-[10px] py-0 px-1.5 uppercase font-bold">
                  {review.genre}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-3 flex justify-center sm:justify-start">
                  <img
                    src={review.coverImage}
                    alt={review.title}
                    className="w-20 h-28 object-cover border-2 border-black grayscale-[20%]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="sm:col-span-9 space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-[#1a1a1a] group-hover:text-[#8b0000] transition-colors">
                    {review.title}
                  </h3>
                  <p className="font-serif text-xs text-[#4a4a4a] italic">
                    By {review.author} • {review.pages} Pages
                  </p>
                  <p className="font-serif text-xs sm:text-sm text-[#1a1a1a] line-clamp-2 leading-relaxed">
                    {review.summary || review.reviewText.slice(0, 140) + '...'}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-sans">
                    <span className="text-[#8b0000] font-bold">
                      Rating: {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="text-[#1a1a1a] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Inspect Dossier →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

