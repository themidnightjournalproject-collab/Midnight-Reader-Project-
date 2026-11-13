import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { NonFictionBook } from '../types';
import { QuickImageModal } from './modals/QuickImageModal';
import { BookCoverImage } from './common/BookCoverImage';
import { 
  X, 
  Calendar, 
  BookOpen, 
  Heart, 
  Edit3, 
  Share2, 
  CheckSquare, 
  Square, 
  Send, 
  Quote, 
  Brain, 
  Layers, 
  Lightbulb, 
  Compass, 
  Clock,
  Trash2,
  Copy,
  Camera,
  MessageSquareQuote,
  Feather,
  Sparkles
} from 'lucide-react';

interface NonFictionDetailModalProps {
  book: NonFictionBook | null;
  onClose: () => void;
  onSelectBook?: (book: NonFictionBook) => void;
}

export const NonFictionDetailModal: React.FC<NonFictionDetailModalProps> = ({ book, onClose, onSelectBook }) => {
  const { 
    reviews,
    nonFictionBooks,
    setSelectedReview,
    setSelectedNonFictionBook,
    setEditingNonFictionBook, 
    setIsNewNonFictionModalOpen, 
    deleteNonFictionBook, 
    updateNonFictionBook,
    openAlbumByName,
    removeTropeFromNonFiction,
    toggleLikeNonFictionBook,
    addNonFictionScratchpadNote,
    isAdminUnlocked
  } = useJournal();

  const [scratchpadInput, setScratchpadInput] = useState('');
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});
  const [copiedQuoteIdx, setCopiedQuoteIdx] = useState<number | null>(null);
  const [isQuickImageOpen, setIsQuickImageOpen] = useState(false);

  const liveBook = book ? (nonFictionBooks.find((b) => b.id === book.id) || book) : null;

  if (!liveBook) return null;

  const seriesKey = liveBook.seriesName?.trim().toLowerCase() || '';
  const seriesVolumes = seriesKey
    ? [
        ...reviews
          .filter((r) => r.seriesName?.trim().toLowerCase() === seriesKey)
          .map((r) => ({
            kind: 'thriller' as const,
            id: r.id,
            title: r.title,
            coverImage: r.coverImage,
            author: r.author,
            genre: r.genre,
            seriesOrder: r.seriesOrder || 999,
            code: `CASE #${r.caseNumber}`,
            data: r,
          })),
        ...nonFictionBooks
          .filter((b) => b.seriesName?.trim().toLowerCase() === seriesKey)
          .map((b) => ({
            kind: 'non-fiction' as const,
            id: b.id,
            title: b.title,
            coverImage: b.coverImage || b.coverUrl || '',
            author: b.author,
            genre: b.genre,
            seriesOrder: b.seriesOrder || 999,
            code: b.catalogNumber,
            data: b,
          })),
      ].sort((a, b) => a.seriesOrder - b.seriesOrder)
    : [];

  const handleUpdateCover = (newUrl: string) => {
    updateNonFictionBook(liveBook.id, {
      coverImage: newUrl,
      coverUrl: newUrl
    });
  };

  const handleEdit = () => {
    setEditingNonFictionBook(liveBook);
    setIsNewNonFictionModalOpen(true);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete dossier [${liveBook.catalogNumber}] ${liveBook.title}?`)) {
      deleteNonFictionBook(liveBook.id);
      onClose();
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scratchpadInput.trim()) return;
    addNonFictionScratchpadNote(liveBook.id, scratchpadInput.trim());
    setScratchpadInput('');
  };

  const toggleActionItem = (idx: number) => {
    setCompletedActions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyQuote = (quote: string, idx: number) => {
    navigator.clipboard.writeText(quote);
    setCopiedQuoteIdx(idx);
    setTimeout(() => setCopiedQuoteIdx(null), 2000);
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    return (
      <span className="text-[#8b0000] font-mono font-bold tracking-tight">
        {'★'.repeat(full)}
        {half ? '½' : ''}
        {'☆'.repeat(Math.max(0, 5 - Math.ceil(rating)))}
        <span className="text-black font-sans text-xs ml-1">({rating}/5)</span>
      </span>
    );
  };

  return (
    <div
      id="modal-non-fiction-detail-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-non-fiction-detail-container"
        className="bg-[#fcfaf2] border-2 border-black max-w-4xl w-full p-6 sm:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative my-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-4 mb-6 gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="bg-black text-white px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-widest">
              {liveBook.catalogNumber}
            </span>
            <span className="bg-[#8b0000] text-white px-2 py-0.5 text-[10px] font-sans font-bold uppercase tracking-wider">
              {liveBook.genre}
            </span>
            {liveBook.seriesName && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAlbumByName(liveBook.seriesName!);
                }}
                className="inline-flex items-center gap-1 bg-white hover:bg-black hover:text-white border border-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                title="Open this book album"
              >
                <Layers size={11} className="text-[#8b0000]" />
                <span>
                  {liveBook.seriesName}
                  {liveBook.seriesOrder ? ` · BOOK ${liveBook.seriesOrder}` : ''}
                </span>
              </button>
            )}
            <span className="text-[11px] font-sans font-semibold text-gray-600 uppercase">
              Field Research File
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLikeNonFictionBook(liveBook.id)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white border border-black text-xs font-bold uppercase hover:bg-red-50 transition-colors cursor-pointer"
              title="Endorse / Recommend this book"
            >
              <Heart size={14} className="text-[#8b0000] fill-[#8b0000]" />
              <span>{liveBook.likes || 1}</span>
            </button>

            {isAdminUnlocked && (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-black text-xs font-bold uppercase hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Edit all dossier data"
                >
                  <Edit3 size={13} />
                  <span>Edit Dossier</span>
                </button>

                <button
                  onClick={handleDelete}
                  className="p-1.5 bg-white border border-black text-xs text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete dossier"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 bg-white border border-black hover:bg-[#8b0000] hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Hero Section of the Book */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b-2 border-black pb-6 mb-6">
          {/* Cover Image */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="w-full max-w-[220px] aspect-[2/3] bg-black border-2 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative group">
              <BookCoverImage
                src={liveBook.coverImage || liveBook.coverUrl}
                title={liveBook.title}
                author={liveBook.author}
                genre={liveBook.genre}
                alt={liveBook.title}
                className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute top-2 left-2 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5">
                {liveBook.pages} PAGES
              </div>

              {/* Cover Replacement button - unlocked admin */}
              {isAdminUnlocked && (
                <button
                  type="button"
                  onClick={() => setIsQuickImageOpen(true)}
                  className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 cursor-pointer text-white text-center z-10"
                >
                  <Camera size={22} className="mb-1 text-[#e8e2d8]" />
                  <span className="font-sans text-[11px] uppercase font-bold tracking-wider">
                    Replace Cover Photo
                  </span>
                  <span className="font-mono text-[9px] text-gray-300 mt-0.5">
                    Click to upload
                  </span>
                </button>
              )}
            </div>

            {/* Reading Timeline Box */}
            <div className="w-full max-w-[220px] mt-4 p-3 bg-white border border-black text-[11px] font-sans space-y-1.5">
              <div className="font-bold uppercase text-[9px] text-[#8b0000] tracking-wider border-b border-gray-200 pb-1">
                Reading Timeline
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="font-medium">Started:</span>
                <span className="font-mono font-semibold">{liveBook.dateStarted || '—'}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="font-medium">Completed:</span>
                <span className="font-mono font-semibold text-[#8b0000]">{liveBook.dateFinished || '—'}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500 pt-1 border-t border-dotted border-gray-200">
                <span>Logged:</span>
                <span className="font-mono text-[10px]">{liveBook.dateLogged || 'Archive Entry'}</span>
              </div>
            </div>
          </div>

          {/* Core Info & Thesis */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase text-gray-500">By {liveBook.author}</span>
                <span className="text-gray-300">•</span>
                {renderStars(liveBook.rating)}
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-black uppercase tracking-tight text-black leading-tight mb-3">
                {liveBook.title}
              </h1>

              <p className="font-serif italic text-base text-[#8b0000] font-medium mb-4 leading-snug border-l-2 border-[#8b0000] pl-3 py-0.5">
                “{liveBook.tagline || liveBook.oneSentenceTakeaway}”
              </p>

              <div className="bg-white p-4 border border-black mb-4">
                <span className="block font-sans text-[10px] font-bold uppercase tracking-widest text-black mb-1.5">
                  Executive Briefing:
                </span>
                <p className="font-serif text-sm text-gray-800 leading-relaxed">
                  {liveBook.summary}
                </p>
              </div>

              {/* Tropes & Key Concepts */}
              {((liveBook.tropes && liveBook.tropes.length > 0) || (liveBook.tags && liveBook.tags.length > 0)) && (
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8b0000] mr-1">
                    Tropes & Key Concepts:
                  </span>
                  {(liveBook.tropes || liveBook.tags || []).map((trope, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 bg-[#faf9f5] text-black text-[10px] font-sans font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] inline-flex items-center gap-1.5"
                    >
                      <span>{trope}</span>
                      {isAdminUnlocked && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Remove trope "${trope}" from this book?`)) {
                              removeTropeFromNonFiction(liveBook.id, trope);
                            }
                          }}
                          title={`Remove "${trope}" from this book`}
                          className="text-gray-400 hover:text-red-700 font-bold text-xs cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Compact Book Pulse / Score Ribbon */}
            <div className="bg-[#faf9f5] px-3.5 py-2.5 border border-black">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-[#8b0000]">
                  Reader Experience Scores
                </span>
                <span className="font-mono text-[9px] text-gray-500 uppercase">
                  Field Benchmark
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center font-sans">
                <div className="py-1 px-1.5 bg-white border border-black/40">
                  <span className="block text-[8px] uppercase font-bold text-gray-500">Pacing</span>
                  <span className="text-xs font-mono font-bold text-black">{liveBook.mindsetRatings?.readability || 5}/5</span>
                </div>
                <div className="py-1 px-1.5 bg-white border border-black/40">
                  <span className="block text-[8px] uppercase font-bold text-gray-500">Takeaway</span>
                  <span className="text-xs font-mono font-bold text-black">{liveBook.mindsetRatings?.actionability || 4}/5</span>
                </div>
                <div className="py-1 px-1.5 bg-white border border-black/40">
                  <span className="block text-[8px] uppercase font-bold text-gray-500">Depth</span>
                  <span className="text-xs font-mono font-bold text-[#8b0000]">{liveBook.mindsetRatings?.intellectualImpact || 5}/5</span>
                </div>
                <div className="py-1 px-1.5 bg-white border border-black/40">
                  <span className="block text-[8px] uppercase font-bold text-gray-500">Originality</span>
                  <span className="text-xs font-mono font-bold text-black">{liveBook.mindsetRatings?.originality || 4}/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volumes in This Series Cross-Navigation */}
        {liveBook.seriesName && seriesVolumes.length > 0 && (
          <div className="mb-6 p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Layers size={15} className="text-[#8b0000]" />
                <span className="font-sans text-[11px] uppercase font-bold text-black tracking-widest">
                  Books in Album: {liveBook.seriesName} ({seriesVolumes.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAlbumByName(liveBook.seriesName!);
                }}
                className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8b0000] hover:underline cursor-pointer"
              >
                Open / Reorder Album →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {seriesVolumes.map((vol) => {
                const isCurrent = vol.kind === 'non-fiction' && vol.id === liveBook.id;
                return (
                  <button
                    key={`${vol.kind}-${vol.id}`}
                    type="button"
                    onClick={() => {
                      if (isCurrent) return;
                      if (vol.kind === 'non-fiction') {
                        if (onSelectBook) {
                          onSelectBook(vol.data);
                        } else {
                          setSelectedNonFictionBook(vol.data);
                        }
                      } else {
                        onClose();
                        setSelectedReview(vol.data);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`flex items-center gap-2 p-2 border text-left transition-all ${
                      isCurrent
                        ? 'bg-black text-white border-black cursor-default'
                        : 'bg-[#fcfaf2] text-black border-black hover:bg-[#f5f2ed] cursor-pointer'
                    }`}
                  >
                    <div className="w-9 h-13 shrink-0 border border-black/30 overflow-hidden bg-black">
                      <BookCoverImage
                        src={vol.coverImage}
                        title={vol.title}
                        author={vol.author}
                        genre={vol.genre}
                        alt={vol.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-[9px] font-mono font-bold uppercase block ${
                          isCurrent ? 'text-[#fbbf24]' : 'text-[#8b0000]'
                        }`}
                      >
                        {vol.seriesOrder < 999 ? `BOOK ${vol.seriesOrder}` : 'SERIES'} • {vol.code}
                      </span>
                      <span className="font-serif font-bold text-xs leading-tight line-clamp-2 block">
                        {vol.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Review & Forensic Literary Analysis */}
        <div className="mb-6">
          <div className="flex items-center gap-2 border-b border-black pb-2 mb-3">
            <Layers size={16} className="text-[#8b0000]" />
            <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-black flex items-center gap-2">
              <span>Dissecting the Narrative • The Forensic Autopsy</span>
            </h3>
          </div>
          <div className="p-5 bg-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-serif text-sm sm:text-base text-gray-900 leading-relaxed whitespace-pre-line">
              {liveBook.reviewText || liveBook.fullReview}
            </p>
          </div>
        </div>

        {/* Interactive Double Column: Key Takeaways & Actionable Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Key Takeaways */}
          <div className="bg-white p-5 border-2 border-black">
            <div className="flex items-center gap-2 border-b border-black pb-2 mb-3">
              <Lightbulb size={16} className="text-[#8b0000]" />
              <h4 className="font-sans font-bold uppercase text-xs tracking-wider text-black">
                Core Principles & Takeaways ({liveBook.keyTakeaways?.length || 0})
              </h4>
            </div>
            <ul className="space-y-2.5 font-sans text-xs">
              {(liveBook.keyTakeaways || []).map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-800">
                  <span className="font-mono font-bold text-[#8b0000] mt-0.5">{String(idx + 1).padStart(2, '0')}.</span>
                  <span className="leading-snug">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Applications Checklist (Interactive!) */}
          <div className="bg-[#f5f1e8] p-5 border-2 border-black">
            <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
              <div className="flex items-center gap-2">
                <CheckSquare size={16} className="text-[#8b0000]" />
                <h4 className="font-sans font-bold uppercase text-xs tracking-wider text-black">
                  Interactive Action Checklist
                </h4>
              </div>
              <span className="text-[10px] font-sans font-bold uppercase text-gray-500">
                Click to Test
              </span>
            </div>
            <div className="space-y-2 font-sans text-xs">
              {(liveBook.actionItems || []).map((action, idx) => {
                const isChecked = Boolean(completedActions[idx]);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleActionItem(idx)}
                    className={`flex items-start gap-2.5 p-2 border border-black cursor-pointer transition-all ${
                      isChecked ? 'bg-black text-white line-through opacity-80' : 'bg-white text-black hover:bg-amber-50'
                    }`}
                  >
                    <span className="mt-0.5">
                      {isChecked ? <CheckSquare size={14} className="text-white" /> : <Square size={14} />}
                    </span>
                    <span className="leading-snug select-none">{action}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Highlighted Quotes */}
        {((liveBook.favoriteQuotes && liveBook.favoriteQuotes.length > 0) || liveBook.favoriteQuote) && (
          <div className="mb-6 bg-[#fffef7] p-5 border-2 border-black">
            <div className="flex items-center gap-2 border-b border-black pb-2 mb-3">
              <Quote size={16} className="text-[#8b0000]" />
              <h4 className="font-serif font-bold uppercase text-sm tracking-wider text-black">
                Highlighted Passages & Verbatim Transcripts
              </h4>
            </div>
            <div className="space-y-3">
              {(liveBook.favoriteQuotes?.length ? liveBook.favoriteQuotes : [liveBook.favoriteQuote || '']).map((quote, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 p-3 bg-white border border-black">
                  <p className="font-marginalia text-base sm:text-lg text-black font-bold leading-snug">
                    “{quote}”
                  </p>
                  <button
                    onClick={() => handleCopyQuote(quote, idx)}
                    className="p-1 text-gray-400 hover:text-black transition-colors"
                    title="Copy Quote"
                  >
                    {copiedQuoteIdx === idx ? (
                      <span className="text-[10px] font-mono text-[#8b0000] font-bold">COPIED</span>
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real-time Research Scratchpad (Interactive Notes) */}
        <div className="bg-white p-5 border-2 border-black">
          <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-[#8b0000]" />
              <h4 className="font-sans font-bold uppercase text-xs tracking-wider text-black">
                Field Scratchpad & Working Hypotheses
              </h4>
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              {liveBook.notesScratchpad?.length || 0} Logged Notes
            </span>
          </div>

          {/* Existing scratchpad notes */}
          {liveBook.notesScratchpad && liveBook.notesScratchpad.length > 0 ? (
            <div className="space-y-2 mb-4">
              {liveBook.notesScratchpad.map((note, idx) => (
                <div key={idx} className="p-2.5 bg-[#fcfaf2] border-l-2 border-black text-xs font-mono text-gray-800">
                  <span className="text-[9px] text-[#8b0000] font-bold block uppercase tracking-wider mb-0.5">
                    Field Memo #{idx + 1}:
                  </span>
                  {note}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-sans text-gray-500 italic mb-3">
              No scratchpad notes logged yet. Use the prompt below to record practical experiments, cross-book references, or reader thoughts.
            </p>
          )}

          {/* New scratchpad input form */}
          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              value={scratchpadInput}
              onChange={(e) => setScratchpadInput(e.target.value)}
              placeholder="Add observation, research note or applied result..."
              className="flex-1 bg-[#fcfaf2] border border-black p-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-black hover:bg-[#8b0000] text-white px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Send size={13} />
              <span>Log Note</span>
            </button>
          </form>
        </div>

        {/* Quick Image Replacement Modal */}
        <QuickImageModal
          isOpen={isQuickImageOpen}
          onClose={() => setIsQuickImageOpen(false)}
          targetType="custom"
          initialImage={liveBook.coverImage || liveBook.coverUrl || ''}
          onSaveImage={handleUpdateCover}
          title={`Replace Cover Photo for [${liveBook.catalogNumber}]: ${liveBook.title}`}
        />
      </div>
    </div>
  );
};
