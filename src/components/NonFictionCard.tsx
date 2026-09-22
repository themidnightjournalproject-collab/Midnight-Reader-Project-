import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { NonFictionBook } from '../types';
import { 
  Heart, 
  BookOpen, 
  Calendar, 
  Edit3, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Check
} from 'lucide-react';

interface NonFictionCardProps {
  book: NonFictionBook;
  onOpenDetail: (book: NonFictionBook) => void;
}

export const NonFictionCard: React.FC<NonFictionCardProps> = ({ book, onOpenDetail }) => {
  const { 
    setEditingNonFictionBook, 
    setIsNewNonFictionModalOpen, 
    toggleLikeNonFictionBook,
    addNonFictionScratchpadNote,
    isAdminUnlocked
  } = useJournal();

  const [isQuickNoteOpen, setIsQuickNoteOpen] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [justAddedNote, setJustAddedNote] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNonFictionBook(book);
    setIsNewNonFictionModalOpen(true);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeNonFictionBook(book.id);
  };

  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    addNonFictionScratchpadNote(book.id, quickNote.trim());
    setQuickNote('');
    setJustAddedNote(true);
    setTimeout(() => {
      setJustAddedNote(false);
      setIsQuickNoteOpen(false);
    }, 1200);
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    return (
      <span className="text-[#8b0000] font-mono font-bold tracking-tight text-xs">
        {'★'.repeat(full)}
        {half ? '½' : ''}
        {'☆'.repeat(Math.max(0, 5 - Math.ceil(rating)))}
      </span>
    );
  };

  return (
    <article 
      id={`nf-card-${book.id}`}
      className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(139,0,0,1)] transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Top Header Stamp */}
        <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest">
              {book.catalogNumber}
            </span>
            <span className="text-[10px] font-sans font-bold uppercase text-[#8b0000] tracking-wider">
              {book.genre}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isAdminUnlocked && (
              <button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-black border border-transparent hover:border-black transition-colors"
                title="Edit dossier"
              >
                <Edit3 size={13} />
              </button>
            )}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 bg-[#fcfaf2] border border-black hover:bg-red-50 transition-colors"
              title="Endorse / Like this book"
            >
              <Heart size={12} className="text-[#8b0000] fill-[#8b0000]" />
              <span>{book.likes || 1}</span>
            </button>
          </div>
        </div>

        {/* Content Layout: Cover + Main Meta */}
        <div className="grid grid-cols-12 gap-4 mb-3">
          {/* Cover */}
          <div className="col-span-4 sm:col-span-3">
            <div 
              onClick={() => onOpenDetail(book)}
              className="aspect-[2/3] bg-black border border-black overflow-hidden relative cursor-pointer group/img"
            >
              <img
                src={book.coverImage || book.coverUrl}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-115 group-hover/img:grayscale-0 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold font-sans uppercase tracking-wider">
                Examine
              </div>
            </div>
            <div className="text-center mt-1">
              <span className="text-[9px] font-mono text-gray-500 block uppercase">
                {book.pages} Pages
              </span>
            </div>
          </div>

          {/* Book Info */}
          <div className="col-span-8 sm:col-span-9 flex flex-col justify-start">
            <div className="flex items-center gap-2 mb-1">
              {renderStars(book.rating)}
              <span className="text-[10px] font-sans font-bold text-gray-700">
                {book.rating}/5
              </span>
            </div>

            <h3 
              onClick={() => onOpenDetail(book)}
              className="font-serif font-black text-base sm:text-lg text-black uppercase tracking-tight leading-snug hover:text-[#8b0000] cursor-pointer transition-colors line-clamp-2"
            >
              {book.title}
            </h3>

            <p className="font-mono text-[11px] text-gray-600 font-semibold mb-2">
              By {book.author}
            </p>

            <p className="font-serif italic text-xs text-gray-800 line-clamp-2 mb-2 leading-relaxed">
              “{book.tagline || book.oneSentenceTakeaway}”
            </p>

            {/* Tropes on Card */}
            {((book.tropes && book.tropes.length > 0) || (book.tags && book.tags.length > 0)) && (
              <div className="flex flex-wrap gap-1 mb-2">
                {(book.tropes || book.tags || []).slice(0, 2).map((t, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.2 bg-[#fcfaf2] border border-black text-[9px] font-sans font-bold uppercase text-black"
                  >
                    #{t}
                  </span>
                ))}
                {(book.tropes || book.tags || []).length > 2 && (
                  <span className="text-[9px] font-mono text-gray-500 self-center">
                    +{(book.tropes || book.tags || []).length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Reading Timeline (Dates) */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-sans text-gray-600 mt-auto pt-1 border-t border-dotted border-gray-300">
              {book.dateStarted && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 font-bold uppercase">Started:</span>
                  <span className="font-mono">{book.dateStarted}</span>
                </div>
              )}
              {book.dateFinished && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 font-bold uppercase">Finished:</span>
                  <span className="font-mono text-[#8b0000] font-bold">{book.dateFinished}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mindset Scores Mini-Badge Bar */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-[#fcfaf2] border border-black text-center font-mono text-[10px] mb-3">
          <div>
            <span className="text-[8px] text-gray-500 block uppercase">Readability</span>
            <span className="font-bold text-black">{book.mindsetRatings?.readability || 5}/5</span>
          </div>
          <div>
            <span className="text-[8px] text-gray-500 block uppercase">Utility</span>
            <span className="font-bold text-[#8b0000]">{book.mindsetRatings?.actionability || 4}/5</span>
          </div>
          <div>
            <span className="text-[8px] text-gray-500 block uppercase">Impact</span>
            <span className="font-bold text-black">{book.mindsetRatings?.intellectualImpact || 5}/5</span>
          </div>
          <div>
            <span className="text-[8px] text-gray-500 block uppercase">Originality</span>
            <span className="font-bold text-black">{book.mindsetRatings?.originality || 4}/5</span>
          </div>
        </div>

        {/* Key Takeaway snippet */}
        {book.keyTakeaways && book.keyTakeaways.length > 0 && (
          <div className="bg-[#fffef7] p-2.5 border border-dashed border-gray-400 mb-3 text-xs">
            <span className="font-sans font-bold uppercase text-[9px] text-[#8b0000] block mb-1">
              Top Research Takeaway:
            </span>
            <p className="font-serif text-gray-800 text-xs leading-snug line-clamp-2">
              • {book.keyTakeaways[0]}
            </p>
          </div>
        )}

        {/* Quick Scratchpad Note Section */}
        {isQuickNoteOpen ? (
          <form onSubmit={handleSaveQuickNote} className="mb-3 p-2 bg-[#f5f1e8] border border-black">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold uppercase text-black">Add Quick Memo:</span>
              <button 
                type="button" 
                onClick={() => setIsQuickNoteOpen(false)}
                className="text-[10px] text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Record your takeaway or observation..."
              className="w-full bg-white border border-black p-1.5 text-xs mb-1.5 focus:outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-1">
              <button
                type="submit"
                className="px-2.5 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#8b0000]"
              >
                {justAddedNote ? 'Saved!' : 'Save Memo'}
              </button>
            </div>
          </form>
        ) : null}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-black flex items-center justify-between gap-2">
        <button
          onClick={() => setIsQuickNoteOpen(!isQuickNoteOpen)}
          className="flex items-center gap-1 text-[10px] font-sans font-bold uppercase text-gray-600 hover:text-black transition-colors cursor-pointer"
        >
          <Plus size={11} className="text-[#8b0000]" />
          <span>Memo ({book.notesScratchpad?.length || 0})</span>
        </button>

        <button
          onClick={() => onOpenDetail(book)}
          className="flex items-center gap-1 bg-black hover:bg-[#8b0000] text-white px-3.5 py-1.5 text-[11px] font-sans font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
        >
          <span>Examine Dossier</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </article>
  );
};
