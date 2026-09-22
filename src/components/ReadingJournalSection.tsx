import React, { useState, useMemo } from 'react';
import { useJournal } from '../context/JournalContext';
import { Genre, BookReview, NonFictionBook, OtherGenre, ALL_OTHER_GENRES } from '../types';
import { 
  PlusCircle, 
  FolderLock, 
  Edit3, 
  LayoutList, 
  LayoutGrid, 
  Heart, 
  Camera, 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  Brain,
  Layers,
  ArrowRight
} from 'lucide-react';
import { QuickImageModal } from './modals/QuickImageModal';
import { NonFictionDetailModal } from './NonFictionDetailModal';
import { NonFictionCard } from './NonFictionCard';

const THRILLER_GENRES: (Genre | 'All')[] = [
  'All',
  'Psychological Thriller',
  'Murder Mystery',
  'Domestic Thriller',
  'Locked Room Mystery',
  'Gothic Thriller',
];

type BookCategoryFilter = 'ALL' | 'THRILLER' | 'NON_FICTION';

type UnifiedJournalItem = 
  | { kind: 'thriller'; data: BookReview; id: string; title: string; author: string; sortDate: string }
  | { kind: 'non-fiction'; data: NonFictionBook; id: string; title: string; author: string; sortDate: string };

export const ReadingJournalSection: React.FC = () => {
  const { 
    reviews, 
    nonFictionBooks,
    searchQuery, 
    setSearchQuery, 
    selectedGenre, 
    setSelectedGenre, 
    setSelectedReview,
    setEditingReview,
    updateReview,
    setIsNewReviewModalOpen,
    setIsNewNonFictionModalOpen,
    setEditingNonFictionBook,
    isAdminUnlocked,
    postLikes,
    userLikedPosts,
    toggleLikePost,
    toggleLikeNonFictionBook
  } = useJournal();

  const [categoryFilter, setCategoryFilter] = useState<BookCategoryFilter>('ALL');
  const [layoutMode, setLayoutMode] = useState<'feed' | 'grid'>('feed');
  const [activeReplaceReview, setActiveReplaceReview] = useState<BookReview | null>(null);
  const [activeDetailNonFiction, setActiveDetailNonFiction] = useState<NonFictionBook | null>(null);

  const handleUpdateCardCover = (newUrl: string) => {
    if (activeReplaceReview) {
      updateReview(activeReplaceReview.id, { coverImage: newUrl });
    }
  };

  // Convert reviews and non-fiction books into unified journal items
  const unifiedItems: UnifiedJournalItem[] = useMemo(() => {
    const list: UnifiedJournalItem[] = [];

    if (categoryFilter === 'ALL' || categoryFilter === 'THRILLER') {
      reviews.forEach((r) => {
        list.push({
          kind: 'thriller',
          data: r,
          id: r.id,
          title: r.title,
          author: r.author,
          sortDate: r.dateRead || '2025'
        });
      });
    }

    if (categoryFilter === 'ALL' || categoryFilter === 'NON_FICTION') {
      nonFictionBooks.forEach((nf) => {
        list.push({
          kind: 'non-fiction',
          data: nf,
          id: nf.id,
          title: nf.title,
          author: nf.author,
          sortDate: nf.dateFinished || nf.dateStarted || '2026'
        });
      });
    }

    return list;
  }, [reviews, nonFictionBooks, categoryFilter]);

  // Filter items based on selected genre and search query
  const filteredItems = useMemo(() => {
    return unifiedItems.filter((item) => {
      // 1. Genre filter
      if (selectedGenre !== 'All') {
        if (item.kind === 'thriller') {
          if (item.data.genre !== selectedGenre) return false;
        } else {
          if (item.data.genre !== (selectedGenre as any)) return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (item.kind === 'thriller') {
          const r = item.data;
          const match = 
            r.title.toLowerCase().includes(q) ||
            r.author.toLowerCase().includes(q) ||
            r.summary.toLowerCase().includes(q) ||
            r.caseNumber.includes(q) ||
            r.genre.toLowerCase().includes(q);
          if (!match) return false;
        } else {
          const nf = item.data;
          const match = 
            nf.title.toLowerCase().includes(q) ||
            nf.author.toLowerCase().includes(q) ||
            nf.summary.toLowerCase().includes(q) ||
            nf.catalogNumber.toLowerCase().includes(q) ||
            nf.oneSentenceTakeaway.toLowerCase().includes(q) ||
            nf.genre.toLowerCase().includes(q);
          if (!match) return false;
        }
      }

      return true;
    });
  }, [unifiedItems, selectedGenre, searchQuery]);

  const totalAllBooksCount = reviews.length + nonFictionBooks.length;

  return (
    <section id="reading-journal-section" className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Section Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#8b0000] text-white text-[10px] uppercase font-bold px-2 py-0.5 tracking-widest font-sans">
                Comprehensive Archive
              </span>
              <span className="text-black opacity-30">•</span>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#4a4a4a]">
                All Reading Dispatches & Volumes
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#1a1a1a] tracking-tight font-serif">
              THE READING JOURNAL ({totalAllBooksCount})
            </h2>
            <p className="font-serif italic text-sm text-[#4a4a4a] mt-1">
              The complete reading ledger combining fiction thriller investigations and non-fiction research works.
            </p>
          </div>

          {isAdminUnlocked && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsNewReviewModalOpen(true)}
                className="flex items-center gap-1.5 bg-black hover:bg-[#8b0000] text-white px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider font-bold transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
              >
                <PlusCircle size={13} />
                <span>+ FILE THRILLER</span>
              </button>
              <button
                onClick={() => setIsNewNonFictionModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#3a3a3a] hover:bg-black text-white px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider font-bold transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
              >
                <BookOpen size={13} />
                <span>+ ADD NON-FICTION</span>
              </button>
            </div>
          )}
        </div>

        {/* Master Category Toggle: All vs Thrillers vs Non-Fiction */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-black border-opacity-15">
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('ALL');
              setSelectedGenre('All');
            }}
            className={`px-3 py-1.5 text-xs font-sans uppercase font-bold transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
              categoryFilter === 'ALL'
                ? 'bg-[#8b0000] text-white'
                : 'bg-white text-black border border-black hover:bg-[#f5f2ed]'
            }`}
          >
            All Books ({totalAllBooksCount})
          </button>

          <button
            type="button"
            onClick={() => {
              setCategoryFilter('THRILLER');
              setSelectedGenre('All');
            }}
            className={`px-3 py-1.5 text-xs font-sans uppercase font-bold transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
              categoryFilter === 'THRILLER'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black hover:bg-[#f5f2ed]'
            }`}
          >
            Thrillers & Crime ({reviews.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setCategoryFilter('NON_FICTION');
              setSelectedGenre('All');
            }}
            className={`px-3 py-1.5 text-xs font-sans uppercase font-bold transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
              categoryFilter === 'NON_FICTION'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black hover:bg-[#f5f2ed]'
            }`}
          >
            Non-Fiction & Research ({nonFictionBooks.length})
          </button>
        </div>

        {/* Genre Filter & Layout Controls Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2">
          {/* Genre tabs */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {(categoryFilter === 'NON_FICTION' 
              ? (['All', ...ALL_OTHER_GENRES] as string[])
              : categoryFilter === 'THRILLER'
                ? (THRILLER_GENRES as string[])
                : (['All', 'Psychological Thriller', 'Murder Mystery', 'Domestic Thriller', 'True Crime & Forensics', 'Psychology & Human Nature', 'Philosophy & Mindset'] as string[])
            ).map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre as any)}
                className={`text-xs font-sans uppercase font-bold px-2 py-0.5 transition-all ${
                  selectedGenre === genre
                    ? 'bg-black text-white'
                    : 'text-[#4a4a4a] hover:bg-[#e8e2d8] hover:text-black'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-black p-0.5 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <button
                type="button"
                onClick={() => setLayoutMode('feed')}
                title="Journal Dispatches View"
                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-wider transition-colors ${
                  layoutMode === 'feed'
                    ? 'bg-black text-white'
                    : 'text-[#4a4a4a] hover:bg-[#e8e2d8] hover:text-black'
                }`}
              >
                <LayoutList size={12} />
                <span className="hidden sm:inline">Dispatches</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                title="Cards Grid View"
                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-wider transition-colors ${
                  layoutMode === 'grid'
                    ? 'bg-black text-white'
                    : 'text-[#4a4a4a] hover:bg-[#e8e2d8] hover:text-black'
                }`}
              >
                <LayoutGrid size={12} />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            {/* Results count */}
            <span className="text-xs font-sans font-bold uppercase text-[#737373] tracking-wider">
              {filteredItems.length} {filteredItems.length === 1 ? 'book' : 'books'} logged
            </span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white p-10 text-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] my-6">
          <FolderLock size={32} className="mx-auto text-[#737373] mb-3" />
          <h3 className="text-xl font-bold uppercase text-[#1a1a1a] font-serif mb-1">
            NO BOOKS MATCH YOUR CRITERIA
          </h3>
          <p className="font-serif italic text-sm text-[#4a4a4a] mb-4">
            No entries found under current filters or search query "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('All');
              setCategoryFilter('ALL');
            }}
            className="text-xs font-sans uppercase font-bold text-[#8b0000] underline tracking-wider"
          >
            Reset Filters & View All
          </button>
        </div>
      )}

      {/* Main Content: Dispatches Feed or Cards Grid */}
      {layoutMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            if (item.kind === 'thriller') {
              const review = item.data;
              const likes = postLikes[review.id] ?? (review.likes || 0);
              const isLiked = !!userLikedPosts[review.id];

              return (
                <div
                  key={`thriller-${review.id}`}
                  className="bg-[#f5f2ed] p-5 sm:p-6 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all border-2 border-black relative flex flex-col justify-between group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#8b0000] text-white text-[9px] font-mono font-bold px-1 py-0.2 uppercase">
                          THRILLER
                        </span>
                        <span className="font-sans text-xs uppercase font-bold text-[#1a1a1a] tracking-wider">
                          CASE #{review.caseNumber}
                        </span>
                      </div>
                      <span className="border border-[#8b0000] text-[#8b0000] font-mono text-[10px] py-0.5 px-1.5 font-bold uppercase rotate-[-2deg]">
                        {review.status}
                      </span>
                    </div>

                    <div className="flex gap-3 items-start mb-3">
                      <div className="relative shrink-0 w-16 h-22 bg-white border border-black p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group/cover">
                        <img
                          src={review.coverImage}
                          alt={review.title}
                          className="w-full h-full object-cover grayscale-[15%] contrast-[105%]"
                          referrerPolicy="no-referrer"
                        />
                        {isAdminUnlocked && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveReplaceReview(review);
                            }}
                            title="Replace Cover Photo"
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                          >
                            <Camera size={14} />
                          </button>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 
                          onClick={() => {
                            setSelectedReview(review);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] group-hover:text-[#8b0000] cursor-pointer transition-colors leading-tight mb-1"
                        >
                          {review.title}
                        </h3>
                        <p className="font-serif text-xs text-[#4a4a4a] italic">
                          By {review.author} • {review.pages} Pages
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="font-sans text-[10px] text-[#737373] uppercase tracking-wider block font-bold">
                        CLASSIFICATION:
                      </span>
                      <span className="font-sans text-xs font-bold text-[#8b0000] uppercase block">
                        {review.genre}
                      </span>
                      {review.tropes && review.tropes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {review.tropes.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="bg-[#e8e2d8] text-[#1a1a1a] text-[9px] font-sans font-bold px-1.5 py-0.2 border border-black border-opacity-20 uppercase">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 border-t border-black pt-3">
                      <span className="font-sans text-[10px] uppercase font-bold text-[#1a1a1a] tracking-wider block mb-1">
                        EVIDENCE LOGGED:
                      </span>
                      <ul className="space-y-1 font-mono text-xs text-[#1a1a1a]">
                        {review.evidenceBullets?.slice(0, 3).map((bullet, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#8b0000] font-bold">•</span>
                            <span className="line-clamp-1">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-black flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikePost(review.id);
                        }}
                        title="Like this case file"
                        className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold border transition-colors cursor-pointer ${
                          isLiked 
                            ? 'bg-[#8b0000] text-white border-black' 
                            : 'bg-white text-[#1a1a1a] border-black hover:bg-[#ffefef]'
                        }`}
                      >
                        <Heart size={11} className={isLiked ? 'fill-white' : 'text-[#8b0000]'} />
                        <span>{likes}</span>
                      </button>

                      {isAdminUnlocked && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingReview(review);
                          }}
                          title="Edit Case File"
                          className="p-1 text-[#4a4a4a] hover:text-[#8b0000] hover:bg-white border border-transparent hover:border-black transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReview(review);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-[#1a1a1a] font-bold group-hover:text-[#8b0000] uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>OPEN DOSSIER</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              );
            } else {
              // Non-Fiction Book Card
              const book = item.data;
              return (
                <div key={`nf-${book.id}`} className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-[#1a1a1a] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider">
                      NON-FICTION
                    </span>
                  </div>
                  <NonFictionCard 
                    book={book} 
                    onOpenDetail={(b) => setActiveDetailNonFiction(b)} 
                  />
                </div>
              );
            }
          })}
        </div>
      ) : (
        /* Editorial Newspaper Articles Feed */
        <div className="space-y-8">
          {filteredItems.map((item) => {
            if (item.kind === 'thriller') {
              const review = item.data;
              return (
                <article
                  key={`thriller-feed-${review.id}`}
                  className="bg-white border-2 border-black p-6 sm:p-8 rounded-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group"
                >
                  {/* Article Top Tag */}
                  <div className="flex flex-wrap items-center justify-between border-b border-black border-opacity-20 pb-3 mb-5 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#8b0000] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 uppercase">
                        CRIMINAL CASE #{review.caseNumber}
                      </span>
                      <span className="text-black opacity-30">•</span>
                      <span className="font-sans text-xs text-[#8b0000] font-bold uppercase">
                        {review.genre}
                      </span>
                      <span className="text-black opacity-30 hidden sm:inline">•</span>
                      <span className="font-sans text-xs text-[#737373] hidden sm:inline font-bold">
                        {review.dateRead}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAdminUnlocked && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingReview(review);
                          }}
                          className="flex items-center gap-1 text-[#4a4a4a] hover:text-[#8b0000] text-[11px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 border border-black border-opacity-30 hover:border-opacity-100 transition-colors"
                          title="Edit Case File"
                        >
                          <Edit3 size={11} />
                          <span>Edit</span>
                        </button>
                      )}
                      <span className="bg-black text-white text-[10px] font-sans font-bold uppercase px-2 py-0.5 tracking-wider">
                        {review.status}
                      </span>
                    </div>
                  </div>

                  {/* Main Content Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Book Photo & Star ratings */}
                    <div className="md:col-span-3 flex flex-col items-center md:items-start">
                      <div className="relative p-1 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] group-hover:rotate-0 transition-transform">
                        <img
                          src={review.coverImage}
                          alt={review.title}
                          className="w-32 sm:w-36 h-48 object-cover grayscale-[15%]"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-black text-white px-1 font-bold">
                          EVID. #{review.caseNumber}
                        </span>
                      </div>

                      <div className="mt-3 text-center md:text-left space-y-1">
                        <div className="text-[#8b0000] font-bold text-sm tracking-wider">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <div className="font-sans text-[11px] text-[#737373] font-bold uppercase">
                          {review.pages} Pages
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Title, Quote, Review Excerpt, What I thought */}
                    <div className="md:col-span-9 space-y-4">
                      <div>
                        <h3 
                          onClick={() => setSelectedReview(review)}
                          className="text-2xl sm:text-3xl font-black text-[#1a1a1a] hover:text-[#8b0000] cursor-pointer transition-colors leading-tight font-serif uppercase tracking-tight"
                        >
                          {review.title}
                        </h3>
                        <p className="font-serif italic text-sm text-[#4a4a4a] mt-0.5">
                          By {review.author}
                        </p>
                      </div>

                      {/* Lead Quote */}
                      {review.leadQuote && (
                        <p className="font-serif text-base text-[#1a1a1a] italic border-l-3 border-[#8b0000] pl-3 py-0.5">
                          {review.leadQuote}
                        </p>
                      )}

                      {/* Summary / Excerpt */}
                      <p className="font-serif text-sm sm:text-base text-[#1a1a1a] leading-relaxed line-clamp-3">
                        {review.summary || review.reviewText.slice(0, 240) + '...'}
                      </p>

                      {/* What I Thought vs What Happened */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="bg-[#e8e2d8] p-3 border border-black border-opacity-20 text-xs">
                          <strong className="font-sans text-[10px] uppercase font-bold text-[#4a4a4a] block mb-0.5 tracking-wider">
                            WHAT I THOUGHT:
                          </strong>
                          <p className="font-serif italic text-[#1a1a1a] line-clamp-2">
                            “{review.whatIThought}”
                          </p>
                        </div>

                        <div className="bg-[#fffef7] p-3 border border-black border-opacity-20 text-xs">
                          <strong className="font-sans text-[10px] uppercase font-bold text-[#8b0000] block mb-0.5 tracking-wider">
                            FINAL VERDICT:
                          </strong>
                          <p className="font-serif text-[#1a1a1a] line-clamp-2 font-medium">
                            {review.finalVerdict}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-black border-opacity-20">
                        <div className="flex items-center gap-3 text-xs font-sans text-[#737373] font-bold uppercase">
                          <span>{review.suspects?.length || 0} Suspects Pinned</span>
                          <span>•</span>
                          <span>{review.clues?.length || 0} Clues Logged</span>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-1.5 bg-black hover:bg-[#8b0000] text-white px-4 py-2 text-xs font-sans uppercase tracking-wider font-bold transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
                        >
                          <span>OPEN CASE FILE & SUSPECT BOARD</span>
                          <span>→</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </article>
              );
            } else {
              // Non-Fiction Book Feed Article
              const book = item.data;
              return (
                <article
                  key={`nf-feed-${book.id}`}
                  className="bg-[#fdfbf7] border-2 border-black p-6 sm:p-8 rounded-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group"
                >
                  {/* Article Top Tag */}
                  <div className="flex flex-wrap items-center justify-between border-b border-black border-opacity-20 pb-3 mb-5 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#1a1a1a] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider">
                        RESEARCH LEDGER #{book.catalogNumber}
                      </span>
                      <span className="text-black opacity-30">•</span>
                      <span className="font-sans text-xs text-[#8b0000] font-bold uppercase">
                        {book.genre}
                      </span>
                      <span className="text-black opacity-30 hidden sm:inline">•</span>
                      <span className="font-sans text-xs text-[#737373] hidden sm:inline font-bold">
                        {book.dateFinished || book.dateStarted}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAdminUnlocked && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingNonFictionBook(book);
                            setIsNewNonFictionModalOpen(true);
                          }}
                          className="flex items-center gap-1 text-[#4a4a4a] hover:text-[#8b0000] text-[11px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 border border-black border-opacity-30 hover:border-opacity-100 transition-colors"
                          title="Edit Non-Fiction Entry"
                        >
                          <Edit3 size={11} />
                          <span>Edit</span>
                        </button>
                      )}
                      <span className="bg-[#8b0000] text-white text-[10px] font-sans font-bold uppercase px-2 py-0.5 tracking-wider">
                        {book.status || 'COMPLETED'}
                      </span>
                    </div>
                  </div>

                  {/* Main Content Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Book Photo & Ratings */}
                    <div className="md:col-span-3 flex flex-col items-center md:items-start">
                      <div className="relative p-1 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] group-hover:rotate-0 transition-transform">
                        <img
                          src={book.coverImage || book.coverUrl}
                          alt={book.title}
                          className="w-32 sm:w-36 h-48 object-cover contrast-[105%]"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-[#8b0000] text-white px-1 font-bold">
                          {book.catalogNumber}
                        </span>
                      </div>

                      <div className="mt-3 text-center md:text-left space-y-1">
                        <div className="text-[#8b0000] font-bold text-sm tracking-wider">
                          {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                        </div>
                        <div className="font-sans text-[11px] text-[#737373] font-bold uppercase">
                          {book.pages} Pages
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:col-span-9 space-y-4">
                      <div>
                        <h3 
                          onClick={() => setActiveDetailNonFiction(book)}
                          className="text-2xl sm:text-3xl font-black text-[#1a1a1a] hover:text-[#8b0000] cursor-pointer transition-colors leading-tight font-serif uppercase tracking-tight"
                        >
                          {book.title}
                        </h3>
                        <p className="font-serif italic text-sm text-[#4a4a4a] mt-0.5">
                          By {book.author}
                        </p>
                      </div>

                      {/* One Sentence Takeaway Banner */}
                      {book.oneSentenceTakeaway && (
                        <div className="p-3 bg-[#fffef7] border border-black border-l-4 border-l-[#8b0000] text-xs sm:text-sm">
                          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#8b0000] block mb-1">
                            CORE THESIS & TAKEAWAY:
                          </span>
                          <p className="font-serif italic text-[#1a1a1a]">
                            “{book.oneSentenceTakeaway}”
                          </p>
                        </div>
                      )}

                      {/* Summary */}
                      <p className="font-serif text-sm sm:text-base text-[#1a1a1a] leading-relaxed line-clamp-3">
                        {book.summary || book.reviewText}
                      </p>

                      {/* Mindset Scores Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-sans text-xs">
                        <div className="p-2 bg-white border border-black border-opacity-30">
                          <span className="text-[10px] font-bold uppercase text-[#737373] block">Readability</span>
                          <span className="font-bold text-[#8b0000] text-sm">{book.mindsetRatings.readability}/5</span>
                        </div>
                        <div className="p-2 bg-white border border-black border-opacity-30">
                          <span className="text-[10px] font-bold uppercase text-[#737373] block">Actionability</span>
                          <span className="font-bold text-[#8b0000] text-sm">{book.mindsetRatings.actionability}/5</span>
                        </div>
                        <div className="p-2 bg-white border border-black border-opacity-30">
                          <span className="text-[10px] font-bold uppercase text-[#737373] block">Intellect</span>
                          <span className="font-bold text-[#8b0000] text-sm">{book.mindsetRatings.intellectualImpact}/5</span>
                        </div>
                        <div className="p-2 bg-white border border-black border-opacity-30">
                          <span className="text-[10px] font-bold uppercase text-[#737373] block">Originality</span>
                          <span className="font-bold text-[#8b0000] text-sm">{book.mindsetRatings.originality}/5</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-black border-opacity-20">
                        <div className="flex items-center gap-2 text-xs font-sans text-[#737373] font-bold uppercase">
                          <span>{book.keyTakeaways?.length || 0} Key Takeaways</span>
                          <span>•</span>
                          <span>{book.favoriteQuotes?.length || (book.favoriteQuote ? 1 : 0)} Quotes</span>
                        </div>

                        <button
                          onClick={() => setActiveDetailNonFiction(book)}
                          className="inline-flex items-center gap-1.5 bg-[#8b0000] hover:bg-black text-white px-4 py-2 text-xs font-sans uppercase tracking-wider font-bold transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
                        >
                          <span>INSPECT RESEARCH NOTES & ANALYSIS</span>
                          <span>→</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </article>
              );
            }
          })}
        </div>
      )}

      {/* Non-Fiction Full Detail Inspector Modal */}
      {activeDetailNonFiction && (
        <NonFictionDetailModal
          book={activeDetailNonFiction}
          onClose={() => setActiveDetailNonFiction(null)}
        />
      )}

      {/* Quick Image Replacement Modal */}
      {activeReplaceReview && (
        <QuickImageModal
          isOpen={Boolean(activeReplaceReview)}
          onClose={() => setActiveReplaceReview(null)}
          targetType="review"
          targetReview={activeReplaceReview}
          initialImage={activeReplaceReview.coverImage}
          onSaveImage={handleUpdateCardCover}
          title={`Replace Cover Image: Case #${activeReplaceReview.caseNumber} (${activeReplaceReview.title})`}
        />
      )}
    </section>
  );
};
