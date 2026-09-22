import React from 'react';
import { useJournal } from '../context/JournalContext';
import { 
  Heart, 
  MessageSquare, 
  HelpCircle, 
  TrendingUp, 
  Award, 
  Flame, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Sparkles,
  BarChart2
} from 'lucide-react';

export const ReaderAnalyticsDashboard: React.FC = () => {
  const { 
    reviews, 
    postLikes, 
    readerPollVotes, 
    witnessComments, 
    setSelectedReview,
    setEditingReview,
    intelligenceStats,
    setIsIntelligenceEditorOpen,
    isAdminUnlocked,
    setIsAdminModalOpen
  } = useJournal();

  // Aggregate metrics
  const totalLikes = Object.values(postLikes).reduce((acc: number, count: number) => acc + (Number(count) || 0), 0);
  
  let totalPollVotes = 0;
  let totalSolvedEarly = 0;
  let totalFooled = 0;
  let totalJawDropped = 0;

  Object.values(readerPollVotes).forEach((p) => {
    const poll = (p || {}) as Record<string, number>;
    const early = Number(poll.solvedBeforeTwist) || 0;
    const midway = Number(poll.sawItComingMidway) || 0;
    const fooled = Number(poll.fooledCompletely) || 0;
    const jaw = Number(poll.jawDroppedEnding) || 0;
    totalPollVotes += (early + midway + fooled + jaw);
    totalSolvedEarly += (early + midway);
    totalFooled += fooled;
    totalJawDropped += jaw;
  });

  const totalComments = Object.values(witnessComments).reduce((acc: number, comms) => acc + (Array.isArray(comms) ? comms.length : 0), 0);

  const readerDeductionAccuracy = totalPollVotes > 0 
    ? Math.round((totalSolvedEarly / totalPollVotes) * 100) 
    : 0;

  const displayLikes = intelligenceStats.overrideLikes ?? totalLikes;
  const displayPollVotes = intelligenceStats.overridePollVotes ?? totalPollVotes;
  const displayComments = intelligenceStats.overrideComments ?? totalComments;
  const displayAccuracy = intelligenceStats.overrideAccuracy ?? readerDeductionAccuracy;

  // Calculate engagement score for each review (Likes * 2 + Poll Votes * 1.5 + Comments * 3)
  const rankedReviews = [...reviews].map((r) => {
    const likes = postLikes[r.id] ?? (r.likes || 0);
    const poll = (readerPollVotes[r.id] || {}) as Record<string, number>;
    const votes = Object.values(poll).reduce((a: number, b: number) => a + (Number(b) || 0), 0);
    const comms = (witnessComments[r.id] || r.witnessComments || []).length;
    const score = (likes * 2) + (votes * 1.5) + (comms * 3);
    return {
      review: r,
      likes,
      votes,
      comms,
      score,
      poll,
    };
  }).sort((a, b) => b.score - a.score);

  // Flatten all recent witness comments
  const allComments: Array<{ reviewTitle: string; caseNumber: string; comment: any }> = [];
  reviews.forEach((r) => {
    const comms = witnessComments[r.id] || r.witnessComments || [];
    comms.forEach((c) => {
      allComments.push({
        reviewTitle: r.title,
        caseNumber: r.caseNumber,
        comment: c,
      });
    });
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <header className="border-b-4 border-black pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-[#8b0000]">
            <BarChart2 size={15} />
            <span>{intelligenceStats.bureauTitle || 'BUREAU OF READER METRICS & MEASURABLE ENGAGEMENT'}</span>
          </div>

          {isAdminUnlocked ? (
            <button
              onClick={() => setIsIntelligenceEditorOpen(true)}
              className="flex items-center gap-1.5 bg-black hover:bg-[#8b0000] text-white px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider font-bold transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              <Edit3 size={13} />
              <span>EDIT INTELLIGENCE & METRICS</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1.5 border border-black hover:bg-[#e8e2d8] text-black px-3 py-1.5 text-xs font-sans uppercase tracking-wider font-bold transition-colors bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <Edit3 size={13} />
              <span>ADMIN EDIT METRICS</span>
            </button>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#1a1a1a] tracking-tight font-serif">
          {intelligenceStats.headline || 'Measurable Reader Results & Analytics'}
        </h1>

        <p className="font-serif italic text-base text-[#4a4a4a] leading-relaxed max-w-3xl">
          {intelligenceStats.dispatchNote || 'Real-time measurement of reader interaction, post endorsements, interrogation poll verdicts, and witness testimonies across your entire reading journal.'}
        </p>

        {/* Featured Custom Highlight & Epigraph if present */}
        {(intelligenceStats.customHighlightLabel || intelligenceStats.featuredQuoteText) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {intelligenceStats.customHighlightLabel && (
              <div className="p-3 bg-[#f5f2ed] border border-black flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#737373] block">
                    {intelligenceStats.customHighlightLabel}
                  </span>
                  <span className="font-serif font-bold text-lg text-[#1a1a1a]">
                    {intelligenceStats.customHighlightValue}
                  </span>
                </div>
                <Sparkles size={18} className="text-[#8b0000]" />
              </div>
            )}
            {intelligenceStats.featuredQuoteText && (
              <div className="p-3 bg-[#fffef7] border border-black border-l-4 border-l-[#8b0000]">
                <p className="font-serif italic text-xs text-[#1a1a1a]">
                  {intelligenceStats.featuredQuoteText}
                </p>
                {intelligenceStats.featuredQuoteAuthor && (
                  <span className="font-sans text-[10px] uppercase font-bold text-[#737373] block mt-1">
                    — {intelligenceStats.featuredQuoteAuthor}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4 Big KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          
          <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1">
            <div className="flex items-center justify-between text-[#8b0000]">
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                TOTAL CASE ENDORSEMENTS
              </span>
              <Heart size={16} className="fill-[#8b0000]" />
            </div>
            <div className="font-mono text-3xl font-black text-[#1a1a1a]">
              {displayLikes}
            </div>
            <p className="text-[11px] font-serif italic text-[#737373]">
              Active reader upvotes logged
            </p>
          </div>

          <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1">
            <div className="flex items-center justify-between text-[#8b0000]">
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                INTERROGATION POLLS
              </span>
              <HelpCircle size={16} className="text-[#8b0000]" />
            </div>
            <div className="font-mono text-3xl font-black text-[#1a1a1a]">
              {displayPollVotes} Votes
            </div>
            <p className="text-[11px] font-serif italic text-[#737373]">
              Verdict choices cast by visitors
            </p>
          </div>

          <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1">
            <div className="flex items-center justify-between text-[#8b0000]">
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                WITNESS TESTIMONIES
              </span>
              <MessageSquare size={16} className="text-[#8b0000]" />
            </div>
            <div className="font-mono text-3xl font-black text-[#8b0000]">
              {displayComments} Notes
            </div>
            <p className="text-[11px] font-serif italic text-[#737373]">
              Reader tips and review comments
            </p>
          </div>

          <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1">
            <div className="flex items-center justify-between text-[#8b0000]">
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                READER TWIST ACCURACY
              </span>
              <TrendingUp size={16} className="text-[#8b0000]" />
            </div>
            <div className="font-mono text-3xl font-black text-[#1a1a1a]">
              {displayAccuracy}%
            </div>
            <p className="text-[11px] font-serif italic text-[#737373]">
              Readers who solved before the reveal
            </p>
          </div>

        </div>
      </header>

      {/* Top 3 Most Engaged Case Files Leaderboard */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-black pb-2">
          <Flame size={18} className="text-[#8b0000]" />
          <h2 className="font-serif text-2xl font-black uppercase text-[#1a1a1a] tracking-tight">
            Top Engaged Thrillers Leaderboard
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rankedReviews.slice(0, 3).map((item, index) => {
            const r = item.review;
            const medals = ['🥇 #1 MOST DISCUSSED', '🥈 #2 RUNNER UP', '🥉 #3 CONTENDER'];

            return (
              <div 
                key={r.id} 
                className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-black text-white text-[10px] font-sans font-bold uppercase px-2 py-0.5 tracking-wider">
                      {medals[index]}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#8b0000]">
                      CASE #{r.caseNumber}
                    </span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <img
                      src={r.coverImage}
                      alt={r.title}
                      className="w-14 h-20 object-cover border border-black flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h3 
                        onClick={() => {
                          setSelectedReview(r);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="font-serif text-lg font-black uppercase text-[#1a1a1a] hover:text-[#8b0000] cursor-pointer truncate"
                      >
                        {r.title}
                      </h3>
                      <p className="font-serif italic text-xs text-[#4a4a4a]">by {r.author}</p>
                      <p className="text-[#8b0000] text-xs font-bold mt-1">
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </p>
                    </div>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-3 gap-2 bg-[#faf9f5] border border-black border-opacity-20 p-2 text-center text-xs">
                    <div>
                      <span className="text-[9px] font-sans text-[#737373] uppercase font-bold block">Likes</span>
                      <strong className="font-mono text-[#8b0000]">{item.likes}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-sans text-[#737373] uppercase font-bold block">Poll Votes</span>
                      <strong className="font-mono text-[#1a1a1a]">{item.votes}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-sans text-[#737373] uppercase font-bold block">Comments</span>
                      <strong className="font-mono text-[#1a1a1a]">{item.comms}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-black border-opacity-15 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedReview(r);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-sans font-bold uppercase text-[#1a1a1a] hover:text-[#8b0000] flex items-center gap-1"
                  >
                    <Eye size={12} />
                    <span>View Dossier</span>
                  </button>

                  <button
                    onClick={() => setEditingReview(r)}
                    className="text-xs font-sans font-bold uppercase text-[#8b0000] hover:text-black flex items-center gap-1"
                  >
                    <Edit3 size={12} />
                    <span>Edit Review</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comprehensive Measurable Results Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-[#8b0000]" />
            <h2 className="font-serif text-2xl font-black uppercase text-[#1a1a1a] tracking-tight">
              Forensic Verdict Breakdown By Case File
            </h2>
          </div>
          <span className="font-sans text-xs font-bold text-[#737373] uppercase">
            {reviews.length} Active Records
          </span>
        </div>

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-black text-white uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="p-3">Ref #</th>
                <th className="p-3">Case Title & Author</th>
                <th className="p-3">Genre</th>
                <th className="p-3 text-center">Score</th>
                <th className="p-3 text-center">Endorsements</th>
                <th className="p-3 text-center">Poll Votes</th>
                <th className="p-3 text-center">Solved Early %</th>
                <th className="p-3 text-center">Notes</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black divide-opacity-10">
              {rankedReviews.map(({ review: r, likes, votes, comms, poll }) => {
                const pollObj = (poll || {}) as Record<string, number>;
                const solved = (Number(pollObj.solvedBeforeTwist) || 0) + (Number(pollObj.sawItComingMidway) || 0);
                const solvedPercent = votes > 0 ? Math.round((solved / votes) * 100) : 0;

                return (
                  <tr key={r.id} className="hover:bg-[#faf7f2] transition-colors">
                    <td className="p-3 font-mono font-bold text-[#8b0000]">
                      #{r.caseNumber}
                    </td>
                    <td className="p-3">
                      <strong 
                        onClick={() => setSelectedReview(r)}
                        className="font-serif text-sm font-bold uppercase text-[#1a1a1a] hover:text-[#8b0000] cursor-pointer block"
                      >
                        {r.title}
                      </strong>
                      <span className="font-serif italic text-xs text-[#737373]">
                        {r.author}
                      </span>
                    </td>
                    <td className="p-3 uppercase font-bold text-[#4a4a4a]">
                      {r.genre}
                    </td>
                    <td className="p-3 text-center font-bold text-[#8b0000]">
                      ★ {r.rating}.0
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-[#8b0000]">
                      <span className="flex items-center justify-center gap-1">
                        <Heart size={12} className="fill-[#8b0000]" />
                        <span>{likes}</span>
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold">
                      {votes}
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-[#e8e2d8] px-2 py-0.5 font-mono font-bold text-[#1a1a1a] text-[11px] border border-black border-opacity-30">
                        {solvedPercent}%
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono text-[#737373] font-bold">
                      {comms}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingReview(r)}
                          className="bg-black hover:bg-[#8b0000] text-white px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-wider transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setSelectedReview(r)}
                          className="border border-black hover:bg-[#faf7f2] px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-wider transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Latest Witness Testimonies Stream */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-black pb-2">
          <MessageSquare size={18} className="text-[#8b0000]" />
          <h2 className="font-serif text-2xl font-black uppercase text-[#1a1a1a] tracking-tight">
            Latest Reader Testimonies & Notes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allComments.slice(0, 6).map((item, i) => (
            <div key={i} className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="flex items-center justify-between border-b border-black border-opacity-15 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-xs text-[#1a1a1a]">
                    {item.comment.name}
                  </span>
                  <span className="bg-[#e8e2d8] text-[9px] font-sans font-bold uppercase px-1.5 py-0.2 border border-black border-opacity-30">
                    {item.comment.verdictTag}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#737373]">
                  {item.comment.date}
                </span>
              </div>

              <p className="font-serif italic text-xs text-[#333] leading-relaxed">
                “{item.comment.content}”
              </p>

              <div className="pt-1 text-[10px] font-sans font-bold text-[#8b0000] uppercase tracking-wider">
                Re: {item.reviewTitle} (Case #{item.caseNumber})
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
