import React, { useState } from 'react';
import { BookReview, UserTheorySubmission } from '../../types';
import { useJournal } from '../../context/JournalContext';
import { Send, History, Check } from 'lucide-react';

interface TheoryBuilderProps {
  review: BookReview;
}

export const TheoryBuilder: React.FC<TheoryBuilderProps> = ({ review }) => {
  const { userTheories, submitTheory } = useJournal();

  const [suspectName, setSuspectName] = useState<string>(
    review.suspects?.[0]?.name || 'The Unnamed Accomplice'
  );
  const [reason, setReason] = useState<string>('');
  const [keyClue, setKeyClue] = useState<string>(
    review.clues?.[0]?.title || 'The missing weapon'
  );
  const [latestSubmission, setLatestSubmission] = useState<UserTheorySubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter user's past theories for this review
  const reviewTheories = userTheories.filter((t) => t.reviewId === review.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const result = submitTheory({
        reviewId: review.id,
        suspectName,
        reason,
        keyClue,
      });
      setLatestSubmission(result);
      setReason('');
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="my-8 bg-[#f5f2ed] border-2 border-black p-5 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 mb-6 gap-2">
        <div>
          <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest block mb-1">
            VISITOR INVESTIGATION BUREAU
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1a1a1a] uppercase font-serif">
            FILE YOUR OWN THEORY
          </h3>
        </div>
        <span className="bg-black text-white text-xs font-sans font-bold uppercase px-2 py-0.5 tracking-wider">
          DEPOSITION LOG
        </span>
      </div>

      <p className="font-serif text-sm sm:text-base text-[#4a4a4a] italic mb-6">
        Have your own deduction before reaching the classified final act? Register your formal case deposition below for the permanent record.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#e8e2d8] p-5 sm:p-6 border-2 border-black mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Culprit Dropdown */}
          <div>
            <label className="block font-sans text-xs uppercase font-bold text-[#1a1a1a] mb-1.5 tracking-wider">
              I THINK THE CULPRIT IS:
            </label>
            <select
              value={suspectName}
              onChange={(e) => setSuspectName(e.target.value)}
              className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-sans text-[#1a1a1a] font-bold focus:outline-none"
            >
              {review.suspects?.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.role})
                </option>
              ))}
              <option value="Someone Not Yet Introduced">Someone Not Yet Introduced</option>
              <option value="The Narrator Themselves">The Narrator Themselves</option>
              <option value="A Collective Conspiracy">A Collective Conspiracy</option>
            </select>
          </div>

          {/* Key Clue Dropdown */}
          <div>
            <label className="block font-sans text-xs uppercase font-bold text-[#1a1a1a] mb-1.5 tracking-wider">
              THE MOST CRITICAL CLUE WAS:
            </label>
            <select
              value={keyClue}
              onChange={(e) => setKeyClue(e.target.value)}
              className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-sans text-[#1a1a1a] font-bold focus:outline-none"
            >
              {review.clues?.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
              <option value="A casual remark in Chapter 1">A casual remark in Chapter 1</option>
              <option value="The suspicious timeline discrepancy">The suspicious timeline discrepancy</option>
              <option value="The locked door paradox">The locked door paradox</option>
            </select>
          </div>
        </div>

        {/* Reason Text Area */}
        <div>
          <label className="block font-sans text-xs uppercase font-bold text-[#1a1a1a] mb-1.5 tracking-wider">
            BECAUSE (REASONING & EVIDENCE):
          </label>
          <textarea
            required
            rows={3}
            placeholder="Explain why their alibi makes no sense or where the motive lies..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-white border-2 border-black p-3 text-xs font-serif text-[#1a1a1a] focus:outline-none placeholder:text-[#737373]"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !reason.trim()}
            className="flex items-center gap-2 bg-black hover:bg-[#8b0000] text-white px-6 py-2.5 text-xs font-sans uppercase tracking-wider font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all disabled:opacity-50"
          >
            <Send size={13} />
            <span>{isSubmitting ? 'FILING DEPOSITION...' : 'SUBMIT THEORY'}</span>
          </button>
        </div>
      </form>

      {/* Immediate Response Box if submitted */}
      {latestSubmission && (
        <div className="p-4 border-2 border-[#8b0000] bg-white mb-6 shadow-[3px_3px_0px_0px_rgba(139,0,0,0.5)]">
          <div className="flex items-center gap-2 text-xs font-sans text-[#8b0000] font-bold uppercase mb-1 tracking-wider">
            <Check size={14} />
            <span>OFFICIAL DESPATCH NOTICE • {latestSubmission.timestamp}</span>
          </div>
          <p className="font-serif text-base text-[#1a1a1a] font-bold leading-relaxed">
            &gt; {latestSubmission.verdictResponse}
          </p>
          <p className="font-serif text-sm text-[#4a4a4a] mt-2 italic">
            You reasoned that <strong className="font-bold text-[#1a1a1a]">{latestSubmission.suspectName}</strong> is guilty because: "{latestSubmission.reason}"
          </p>
        </div>
      )}

      {/* Archive of Previous User Theories */}
      {reviewTheories.length > 0 && (
        <div className="border-t border-black border-opacity-20 pt-4">
          <h5 className="font-sans text-xs uppercase font-bold text-[#4a4a4a] mb-3 flex items-center gap-1.5 tracking-wider">
            <History size={13} />
            FILED THEORIES FOR THIS CASE ({reviewTheories.length}):
          </h5>

          <div className="space-y-2.5">
            {reviewTheories.map((t, idx) => (
              <div key={idx} className="bg-white p-3 border border-black text-xs font-sans shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-center text-[#737373] mb-1">
                  <span className="font-bold text-[#1a1a1a] uppercase tracking-wider">ACCUSATION: {t.suspectName}</span>
                  <span className="text-[10px]">{t.timestamp}</span>
                </div>
                <p className="font-serif text-sm text-[#4a4a4a] italic">“{t.reason}”</p>
                <div className="text-[10px] text-[#8b0000] mt-1 font-bold uppercase tracking-wider">
                  Key Clue Cited: {t.keyClue}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

