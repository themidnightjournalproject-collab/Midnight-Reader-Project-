import React, { useState, useEffect } from 'react';
import { useJournal } from '../../context/JournalContext';
import { Archive, Star, CheckCircle, ShieldAlert, BookOpen, ArrowRight } from 'lucide-react';

export const CompleteAndArchiveModal: React.FC = () => {
  const {
    isCompleteBookModalOpen,
    setIsCompleteBookModalOpen,
    completingBookTarget,
    setCompletingBookTarget,
    archiveCurrentBook,
    setIsNewReviewModalOpen,
  } = useJournal();

  const [targetArchive, setTargetArchive] = useState<'case' | 'offTheRecord'>('case');
  const [rating, setRating] = useState<number>(5);
  const [readingFormat, setReadingFormat] = useState<string>('Paperback');
  const [dateFinished, setDateFinished] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [whatActuallyHappened, setWhatActuallyHappened] = useState<string>('');

  useEffect(() => {
    if (completingBookTarget && isCompleteBookModalOpen) {
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      setDateFinished(today);
      
      // Auto-detect destination based on book genre or category
      const g = completingBookTarget.genre.toLowerCase();
      if (
        g.includes('philosophy') || 
        g.includes('memoir') || 
        g.includes('psychology') || 
        g.includes('sci-fi') || 
        g.includes('science') || 
        g.includes('non-fiction') || 
        completingBookTarget.bookType === 'companion'
      ) {
        setTargetArchive('offTheRecord');
      } else {
        setTargetArchive('case');
      }

      setSummary(completingBookTarget.notes || `Finished reading ${completingBookTarget.title}. Investigation successfully resolved.`);
      setReviewText(completingBookTarget.notes || 'An intense and gripping reading experience from beginning to end.');
      setWhatActuallyHappened('');
      setRating(5);
    }
  }, [completingBookTarget, isCompleteBookModalOpen]);

  if (!isCompleteBookModalOpen || !completingBookTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    archiveCurrentBook({
      bookType: completingBookTarget.bookType,
      additionalBookId: completingBookTarget.additionalBookId,
      targetArchive,
      title: completingBookTarget.title,
      author: completingBookTarget.author,
      genre: completingBookTarget.genre,
      coverImage: completingBookTarget.coverImage,
      pages: completingBookTarget.totalPages || completingBookTarget.currentPage || 300,
      rating,
      dateFinished,
      summary,
      reviewText,
      whatIThought: completingBookTarget.notes || '',
      whatActuallyHappened,
      readingFormat,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-[#fcfaf2] border-4 border-black w-full max-w-2xl p-6 sm:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#166534] text-white flex items-center justify-center border-2 border-black">
              <CheckCircle size={22} />
            </div>
            <div>
              <span className="font-sans text-[10px] text-[#166534] uppercase font-black tracking-widest block">
                ACTIVE CASE RESOLVED • ARCHIVAL FILING
              </span>
              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase font-serif tracking-tight">
                MOVE TO THE ARCHIVE
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCompleteBookModalOpen(false);
              setCompletingBookTarget(null);
            }}
            className="p-1 hover:bg-[#e8e2d8] text-black font-sans font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Book Preview Banner */}
        <div className="bg-white border-2 border-black p-4 mb-6 flex items-center gap-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <img
            src={completingBookTarget.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'}
            alt={completingBookTarget.title}
            className="w-16 h-24 object-cover border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8b0000] bg-[#8b0000]/10 px-2 py-0.5 border border-[#8b0000]/20 inline-block">
              {completingBookTarget.genre || 'BOOK'}
            </span>
            <h4 className="font-serif font-black text-xl text-black uppercase leading-tight">
              {completingBookTarget.title}
            </h4>
            <p className="font-serif italic text-sm text-[#4a4a4a]">
              By {completingBookTarget.author}
            </p>
            <p className="text-[11px] font-mono text-gray-600">
              {completingBookTarget.totalPages || completingBookTarget.currentPage} Pages completed
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-sans text-xs">
          
          {/* Target Archive Selector */}
          <div>
            <label className="block text-[#1a1a1a] font-black uppercase text-[11px] mb-2">
              Select Destination Archive *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`p-3 border-2 border-black flex items-start gap-3 cursor-pointer transition-all ${
                  targetArchive === 'case' 
                    ? 'bg-[#8b0000] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white hover:bg-[#faf7f0]'
                }`}
              >
                <input
                  type="radio"
                  name="targetArchive"
                  value="case"
                  checked={targetArchive === 'case'}
                  onChange={() => setTargetArchive('case')}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold uppercase text-xs">
                    <ShieldAlert size={14} />
                    <span>The Crime Case Archives</span>
                  </div>
                  <p className={`text-[11px] mt-1 font-serif ${targetArchive === 'case' ? 'text-white/80' : 'text-gray-500'}`}>
                    For psychological thrillers, locked-room mysteries, and detective fiction.
                  </p>
                </div>
              </label>

              <label 
                className={`p-3 border-2 border-black flex items-start gap-3 cursor-pointer transition-all ${
                  targetArchive === 'offTheRecord' 
                    ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white hover:bg-[#faf7f0]'
                }`}
              >
                <input
                  type="radio"
                  name="targetArchive"
                  value="offTheRecord"
                  checked={targetArchive === 'offTheRecord'}
                  onChange={() => setTargetArchive('offTheRecord')}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold uppercase text-xs">
                    <BookOpen size={14} />
                    <span>Off the Record Dossiers</span>
                  </div>
                  <p className={`text-[11px] mt-1 font-serif ${targetArchive === 'offTheRecord' ? 'text-white/80' : 'text-gray-500'}`}>
                    For philosophy, memoirs, cosmic sci-fi, science, or general literature.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Rating, Date, Format */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {/* Rating */}
            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                Your Rating (1-5) *
              </label>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      size={20}
                      className={
                        star <= rating
                          ? 'fill-[#8b0000] text-[#8b0000]'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
                <span className="font-mono font-bold text-xs ml-2 text-[#8b0000]">
                  {rating}/5
                </span>
              </div>
            </div>

            {/* Date Finished */}
            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                Date Finished
              </label>
              <input
                type="text"
                value={dateFinished}
                onChange={(e) => setDateFinished(e.target.value)}
                placeholder="e.g. Feb 22, 2026"
                className="w-full bg-[#fcfaf2] border border-black p-2 text-xs font-bold"
              />
            </div>

            {/* Reading Format */}
            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                Format
              </label>
              <select
                value={readingFormat}
                onChange={(e) => setReadingFormat(e.target.value)}
                className="w-full bg-[#fcfaf2] border border-black p-2 text-xs font-bold"
              >
                <option value="Paperback">Paperback</option>
                <option value="Hardcover">Hardcover</option>
                <option value="Kindle / E-Reader">Kindle / E-Reader</option>
                <option value="Audiobook">Audiobook</option>
              </select>
            </div>
          </div>

          {/* Verdict & Takeaway */}
          <div>
            <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
              Final Review / Verdict / Personal Reflections *
            </label>
            <textarea
              rows={4}
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you think of the ending, narrative pacing, character dynamics, or key philosophical ideas?"
              className="w-full bg-white border border-black p-2 text-xs font-serif leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
              Brief Takeaway / Ledger Summary (1-2 sentences)
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. An addictive psychological thriller with a jaw-dropping twist in chapter 34."
              className="w-full bg-white border border-black p-2 text-xs"
            />
          </div>

          {targetArchive === 'case' && (
            <div>
              <label className="block text-[#8b0000] font-bold mb-1 uppercase text-[10px]">
                What Actually Happened / Culprit Outcome (Optional)
              </label>
              <textarea
                rows={2}
                value={whatActuallyHappened}
                onChange={(e) => setWhatActuallyHappened(e.target.value)}
                placeholder="Briefly log who actually committed the crime or how the twist untangled..."
                className="w-full bg-white border border-black p-2 text-xs font-serif"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between pt-4 border-t-2 border-black gap-3">
            <div className="text-[11px] text-gray-500 font-serif italic">
              Archiving will safely log this book and remove it from Current Reads.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCompleteBookModalOpen(false);
                  setCompletingBookTarget(null);
                }}
                className="px-4 py-2 text-[#4a4a4a] hover:text-black uppercase font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="bg-[#166534] hover:bg-black text-white px-6 py-2.5 uppercase font-bold text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle size={14} />
                <span>Move to Archive</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
