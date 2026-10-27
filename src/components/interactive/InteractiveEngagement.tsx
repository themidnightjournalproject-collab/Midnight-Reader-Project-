import React, { useState } from 'react';
import { BookReview } from '../../types';
import { useJournal } from '../../context/JournalContext';
import { Heart, MessageSquare, CheckCircle2, HelpCircle, Send, Sparkles } from 'lucide-react';

interface InteractiveEngagementProps {
  review: BookReview;
  compact?: boolean;
}

export const InteractiveEngagement: React.FC<InteractiveEngagementProps> = ({ review, compact = false }) => {
  const { 
    postLikes, 
    userLikedPosts, 
    toggleLikePost, 
    readerPollVotes, 
    userPollVotes, 
    voteReaderPoll, 
    witnessComments, 
    addWitnessComment 
  } = useJournal();

  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentTag, setCommentTag] = useState<'Guessed It' | 'Blown Away' | 'Red Herring Victim' | 'Total Shock' | 'Investigator Note'>('Guessed It');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [justCommented, setJustCommented] = useState(false);

  const likesCount = postLikes[review.id] ?? (review.likes || 0);
  const isLiked = !!userLikedPosts[review.id];

  const currentPoll = readerPollVotes[review.id] || {
    solvedBeforeTwist: 4,
    fooledCompletely: 18,
    sawItComingMidway: 8,
    jawDroppedEnding: 24,
  };

  const userVote = userPollVotes[review.id];
  const comments = witnessComments[review.id] || review.witnessComments || [];

  const totalVotes = 
    (currentPoll.solvedBeforeTwist || 0) + 
    (currentPoll.fooledCompletely || 0) + 
    (currentPoll.sawItComingMidway || 0) + 
    (currentPoll.jawDroppedEnding || 0);

  const getPercent = (count: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addWitnessComment(review.id, {
      name: commentName.trim() || 'Anonymous Detective',
      content: commentText.trim(),
      verdictTag: commentTag,
    });

    setCommentText('');
    setCommentName('');
    setJustCommented(true);
    setTimeout(() => setJustCommented(false), 3000);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 pt-3 border-t border-black border-opacity-15">
        {/* Compact Like Stamp */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleLikePost(review.id);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-bold uppercase tracking-wider border transition-all ${
            isLiked
              ? 'bg-[#8b0000] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-white text-[#1a1a1a] border-black border-opacity-30 hover:border-opacity-100 hover:bg-[#faf7f2]'
          }`}
          title="Endorse this Review / Case File"
        >
          <Heart size={12} className={isLiked ? 'fill-white' : 'text-[#8b0000]'} />
          <span>{likesCount} {likesCount === 1 ? 'Endorsement' : 'Endorsements'}</span>
        </button>

        {/* Compact comments count indicator */}
        <span className="flex items-center gap-1 text-[11px] font-sans font-bold text-[#737373] uppercase">
          <MessageSquare size={12} />
          <span>{comments.length} {comments.length === 1 ? 'Testimony' : 'Testimonies'}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#faf7f2] border-2 border-black p-5 sm:p-7 space-y-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] my-8">
      
      {/* Header banner */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 gap-3">
        <div>
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#8b0000] block">
            INTERACTIVE JURY & READER VERDICTS
          </span>
          <h4 className="font-serif text-xl sm:text-2xl font-black uppercase text-[#1a1a1a] tracking-tight">
            Reader Engagement & Interrogation Poll
          </h4>
        </div>

        {/* Big Endorsement / Like Button */}
        <button
          type="button"
          onClick={() => toggleLikePost(review.id)}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider border-2 border-black transition-all ${
            isLiked
              ? 'bg-[#8b0000] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-white text-[#1a1a1a] hover:bg-[#8b0000] hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none'
          }`}
        >
          <Heart size={15} className={isLiked ? 'fill-white text-white' : 'text-[#8b0000]'} />
          <span>{isLiked ? 'VERDICT ENDORSED' : 'ENDORSE THIS REVIEW'}</span>
          <span className="bg-black text-white px-1.5 py-0.5 text-[10px] font-mono">
            {likesCount}
          </span>
        </button>
      </div>

      {/* 2-Column Interactivity: Left = Poll, Right = Witness Testimonies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Reader Poll */}
        <div className="lg:col-span-6 bg-white border border-black p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-black border-opacity-20 pb-2">
            <div className="flex items-center gap-1.5">
              <HelpCircle size={14} className="text-[#8b0000]" />
              <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
                Reader Poll: Did You Crack The Twist?
              </h5>
            </div>
            <span className="font-mono text-[10px] text-[#737373] uppercase font-bold">
              {totalVotes} Votes Cast
            </span>
          </div>

          <p className="font-serif italic text-xs text-[#4a4a4a]">
            Cast your forensic verdict on how this thriller played out against your deductive reasoning:
          </p>

          <div className="space-y-2.5">
            {/* Option 1 */}
            <button
              type="button"
              onClick={() => voteReaderPoll(review.id, 'solvedBeforeTwist')}
              className={`w-full text-left p-2.5 border transition-all ${
                userVote === 'solvedBeforeTwist'
                  ? 'border-[#8b0000] bg-[#fff5f5]'
                  : 'border-black border-opacity-20 hover:border-black bg-[#faf9f5]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-sans font-bold uppercase mb-1">
                <span className="flex items-center gap-1.5 text-[#1a1a1a]">
                  {userVote === 'solvedBeforeTwist' && <CheckCircle2 size={12} className="text-[#8b0000]" />}
                  <span>Deduce it early (Before Chapter 30)</span>
                </span>
                <span className="font-mono text-[11px] text-[#8b0000]">
                  {getPercent(currentPoll.solvedBeforeTwist || 0)}% ({currentPoll.solvedBeforeTwist || 0})
                </span>
              </div>
              <div className="w-full bg-[#e8e2d8] h-2 border border-black border-opacity-30">
                <div 
                  className="bg-[#8b0000] h-full transition-all duration-500" 
                  style={{ width: `${getPercent(currentPoll.solvedBeforeTwist || 0)}%` }}
                />
              </div>
            </button>

            {/* Option 2 */}
            <button
              type="button"
              onClick={() => voteReaderPoll(review.id, 'sawItComingMidway')}
              className={`w-full text-left p-2.5 border transition-all ${
                userVote === 'sawItComingMidway'
                  ? 'border-[#8b0000] bg-[#fff5f5]'
                  : 'border-black border-opacity-20 hover:border-black bg-[#faf9f5]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-sans font-bold uppercase mb-1">
                <span className="flex items-center gap-1.5 text-[#1a1a1a]">
                  {userVote === 'sawItComingMidway' && <CheckCircle2 size={12} className="text-[#8b0000]" />}
                  <span>Suspected correctly around the midpoint</span>
                </span>
                <span className="font-mono text-[11px] text-[#8b0000]">
                  {getPercent(currentPoll.sawItComingMidway || 0)}% ({currentPoll.sawItComingMidway || 0})
                </span>
              </div>
              <div className="w-full bg-[#e8e2d8] h-2 border border-black border-opacity-30">
                <div 
                  className="bg-black h-full transition-all duration-500" 
                  style={{ width: `${getPercent(currentPoll.sawItComingMidway || 0)}%` }}
                />
              </div>
            </button>

            {/* Option 3 */}
            <button
              type="button"
              onClick={() => voteReaderPoll(review.id, 'fooledCompletely')}
              className={`w-full text-left p-2.5 border transition-all ${
                userVote === 'fooledCompletely'
                  ? 'border-[#8b0000] bg-[#fff5f5]'
                  : 'border-black border-opacity-20 hover:border-black bg-[#faf9f5]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-sans font-bold uppercase mb-1">
                <span className="flex items-center gap-1.5 text-[#1a1a1a]">
                  {userVote === 'fooledCompletely' && <CheckCircle2 size={12} className="text-[#8b0000]" />}
                  <span>Fell for every single red herring</span>
                </span>
                <span className="font-mono text-[11px] text-[#8b0000]">
                  {getPercent(currentPoll.fooledCompletely || 0)}% ({currentPoll.fooledCompletely || 0})
                </span>
              </div>
              <div className="w-full bg-[#e8e2d8] h-2 border border-black border-opacity-30">
                <div 
                  className="bg-[#4a4a4a] h-full transition-all duration-500" 
                  style={{ width: `${getPercent(currentPoll.fooledCompletely || 0)}%` }}
                />
              </div>
            </button>

            {/* Option 4 */}
            <button
              type="button"
              onClick={() => voteReaderPoll(review.id, 'jawDroppedEnding')}
              className={`w-full text-left p-2.5 border transition-all ${
                userVote === 'jawDroppedEnding'
                  ? 'border-[#8b0000] bg-[#fff5f5]'
                  : 'border-black border-opacity-20 hover:border-black bg-[#faf9f5]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-sans font-bold uppercase mb-1">
                <span className="flex items-center gap-1.5 text-[#1a1a1a]">
                  {userVote === 'jawDroppedEnding' && <CheckCircle2 size={12} className="text-[#8b0000]" />}
                  <span>Jaw on the floor at the final page</span>
                </span>
                <span className="font-mono text-[11px] text-[#8b0000]">
                  {getPercent(currentPoll.jawDroppedEnding || 0)}% ({currentPoll.jawDroppedEnding || 0})
                </span>
              </div>
              <div className="w-full bg-[#e8e2d8] h-2 border border-black border-opacity-30">
                <div 
                  className="bg-[#8b0000] h-full transition-all duration-500 opacity-80" 
                  style={{ width: `${getPercent(currentPoll.jawDroppedEnding || 0)}%` }}
                />
              </div>
            </button>
          </div>

          <p className="text-[11px] font-sans text-[#737373] text-center italic">
            {userVote ? '✓ Your verdict is recorded in the reader bureau.' : 'Click any option to cast your vote.'}
          </p>
        </div>

        {/* Right Column: Witness Testimonies & Comments */}
        <div className="lg:col-span-6 bg-white border border-black p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-black border-opacity-20 pb-2">
            <div className="flex items-center gap-1.5">
              <MessageSquare size={14} className="text-[#8b0000]" />
              <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
                Witness Testimonies ({comments.length})
              </h5>
            </div>

            <button
              type="button"
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="text-[11px] font-sans font-bold uppercase text-[#8b0000] hover:underline"
            >
              {showCommentForm ? 'Close Form' : '+ Leave Testimony'}
            </button>
          </div>

          {/* Comment Submission Form */}
          {showCommentForm && (
            <form onSubmit={handleCommentSubmit} className="bg-[#f5f2ed] border border-black p-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-sans font-bold uppercase text-[#4a4a4a] mb-0.5">
                    Your Detective Alias:
                  </label>
                  <input
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="e.g. Detective Dupin"
                    className="w-full bg-white border border-black px-2 py-1 text-xs font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-bold uppercase text-[#4a4a4a] mb-0.5">
                    Verdict Badge:
                  </label>
                  <select
                    value={commentTag}
                    onChange={(e) => setCommentTag(e.target.value as any)}
                    className="w-full bg-white border border-black px-2 py-1 text-xs font-sans"
                  >
                    <option value="Guessed It">Guessed It</option>
                    <option value="Blown Away">Blown Away</option>
                    <option value="Red Herring Victim">Red Herring Victim</option>
                    <option value="Total Shock">Total Shock</option>
                    <option value="Investigator Note">Investigator Note</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-sans font-bold uppercase text-[#4a4a4a] mb-0.5">
                  Your Testimony / Reader Reaction:
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on the plot twists, pacing, or theories..."
                  rows={2}
                  className="w-full bg-white border border-black p-2 text-xs font-serif"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-sans text-[#737373] italic">
                  Keep spoilers tagged or subtle!
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-black hover:bg-[#8b0000] text-white px-3 py-1 text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Send size={11} />
                  <span>Submit Note</span>
                </button>
              </div>
            </form>
          )}

          {justCommented && (
            <div className="bg-[#e6f4ea] border border-black p-2 text-xs font-sans font-bold text-[#137333] flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>Testimony filed successfully in the case archive!</span>
            </div>
          )}

          {/* Testimonies list */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="font-serif italic text-xs text-[#737373] text-center py-4">
                No witness testimonies recorded for this case file yet. Be the first to leave an investigator note!
              </p>
            ) : (
              comments.map((comm) => (
                <div key={comm.id} className="border-b border-black border-opacity-10 pb-2.5 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-sans font-bold text-xs text-[#1a1a1a]">
                      {comm.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {comm.verdictTag && (
                        <span className="bg-[#e8e2d8] text-[#1a1a1a] text-[9px] font-sans font-bold px-1.5 py-0.5 border border-black border-opacity-30 uppercase tracking-wider">
                          {comm.verdictTag}
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-[#737373]">
                        {comm.date}
                      </span>
                    </div>
                  </div>
                  <p className="font-serif text-xs text-[#333333] italic leading-relaxed">
                    “{comm.content}”
                  </p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
