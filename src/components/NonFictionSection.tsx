import React, { useState, useMemo } from 'react';
import { useJournal } from '../context/JournalContext';
import { NonFictionBook, OtherGenre, ALL_OTHER_GENRES } from '../types';
import { NonFictionCard } from './NonFictionCard';
import { NonFictionDetailModal } from './NonFictionDetailModal';
import { 
  BookOpen, 
  Search, 
  Plus, 
  SlidersHorizontal, 
  Brain, 
  Layers, 
  Lightbulb, 
  TrendingUp,
  Sparkles,
  BookCheck
} from 'lucide-react';

const GENRE_FILTERS: Array<OtherGenre | 'All'> = [
  'All',
  ...ALL_OTHER_GENRES,
];

export const NonFictionSection: React.FC = () => {
  const { 
    nonFictionBooks, 
    setIsNewNonFictionModalOpen, 
    setEditingNonFictionBook 
  } = useJournal();

  const [selectedGenreFilter, setSelectedGenreFilter] = useState<OtherGenre | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'likes' | 'title' | 'pages'>('newest');
  const [activeDetailBook, setActiveDetailBook] = useState<NonFictionBook | null>(null);

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    return nonFictionBooks
      .filter((book) => {
        // Genre match
        if (selectedGenreFilter !== 'All' && book.genre !== selectedGenreFilter) {
          return false;
        }
        // Search match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (book.title || '').toLowerCase().includes(q);
          const matchAuthor = (book.author || '').toLowerCase().includes(q);
          const matchTagline = (book.tagline || book.oneSentenceTakeaway || '').toLowerCase().includes(q);
          const matchSummary = (book.summary || '').toLowerCase().includes(q);
          const matchCat = (book.catalogNumber || '').toLowerCase().includes(q);
          const matchTakeaway = book.keyTakeaways?.some((t) => t.toLowerCase().includes(q));
          const matchTrope = (book.tropes || book.tags || []).some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchAuthor && !matchTagline && !matchSummary && !matchCat && !matchTakeaway && !matchTrope) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'pages') return (b.pages || 0) - (a.pages || 0);
        // Default newest / catalog order
        return b.catalogNumber.localeCompare(a.catalogNumber);
      });
  }, [nonFictionBooks, selectedGenreFilter, searchQuery, sortBy]);

  // Aggregate Stats
  const totalBooks = nonFictionBooks.length;
  const totalPages = nonFictionBooks.reduce((acc, b) => acc + (b.pages || 0), 0);
  const totalTakeaways = nonFictionBooks.reduce((acc, b) => acc + (b.keyTakeaways?.length || 0), 0);
  const avgRating = totalBooks ? (nonFictionBooks.reduce((acc, b) => acc + b.rating, 0) / totalBooks).toFixed(1) : '5.0';

  const handleOpenNewModal = () => {
    setEditingNonFictionBook(null);
    setIsNewNonFictionModalOpen(true);
  };

  return (
    <section id="non-fiction-research-section" className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="border-b-4 border-black pb-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-black text-white px-2 py-0.5 text-[10px] font-sans font-bold uppercase tracking-widest">
                Department of Ancillary Studies
              </span>
              <span className="text-[11px] font-sans font-bold text-[#8b0000] tracking-wider uppercase">
                Research & Literature Division
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif uppercase tracking-tight text-black">
              Research & Literature Dossiers
            </h2>
            <p className="text-xs sm:text-sm font-serif text-gray-700 mt-1 max-w-2xl">
              Companion studies and broad reading files: literary fiction, speculative worlds, memoirs, philosophy, psychology, and multidisciplinary research.
            </p>
          </div>

          {/* Quick Action to add non-fiction book */}
          <button
            id="btn-log-non-fiction"
            onClick={handleOpenNewModal}
            className="flex items-center gap-2 bg-black hover:bg-[#8b0000] text-white px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
          >
            <Plus size={15} />
            <span>Log Research Dossier</span>
          </button>
        </div>
      </div>

      {/* Field Research Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider">Field Studies</span>
            <BookOpen size={14} className="text-[#8b0000]" />
          </div>
          <span className="text-2xl font-black font-mono text-black">{totalBooks}</span>
          <span className="text-[10px] font-sans text-gray-500 block uppercase">Recorded Volumes</span>
        </div>

        <div className="bg-white p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider">Pages Analyzed</span>
            <Layers size={14} className="text-[#8b0000]" />
          </div>
          <span className="text-2xl font-black font-mono text-black">{totalPages.toLocaleString()}</span>
          <span className="text-[10px] font-sans text-gray-500 block uppercase">Dense Documentation</span>
        </div>

        <div className="bg-white p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider">Key Takeaways</span>
            <Lightbulb size={14} className="text-[#8b0000]" />
          </div>
          <span className="text-2xl font-black font-mono text-[#8b0000]">{totalTakeaways}</span>
          <span className="text-[10px] font-sans text-gray-500 block uppercase">Applied Mental Models</span>
        </div>

        <div className="bg-white p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider">Average Impact</span>
            <Brain size={14} className="text-[#8b0000]" />
          </div>
          <span className="text-2xl font-black font-mono text-black">{avgRating}/5.0</span>
          <span className="text-[10px] font-sans text-gray-500 block uppercase">Rigorous Recommendation</span>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="bg-[#fffef7] p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 space-y-4">
        {/* Search & Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[260px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, takeaway, or research concept..."
              className="w-full bg-white border border-black pl-9 pr-4 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-black px-3 py-2 text-xs font-sans font-bold focus:outline-none"
            >
              <option value="newest">Catalog Code / Newest</option>
              <option value="rating">Highest Star Rating</option>
              <option value="likes">Most Endorsed / Likes</option>
              <option value="pages">Page Count (Heaviest)</option>
              <option value="title">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="border-t border-black border-opacity-20 pt-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500 mr-1">
              Filter Branch:
            </span>
            {GENRE_FILTERS.map((genre) => {
              const isSelected = selectedGenreFilter === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenreFilter(genre)}
                  className={`px-3 py-1 text-[11px] font-sans font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black border-gray-400 hover:border-black hover:bg-gray-100'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Non-Fiction Dossiers */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <NonFictionCard
              key={book.id}
              book={book}
              onOpenDetail={(b) => setActiveDetailBook(b)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-serif text-lg text-black font-bold mb-2">
            No Research Dossiers Match the Selected Filter.
          </p>
          <p className="text-xs font-sans text-gray-600 mb-4">
            Try adjusting your search criteria or log a new field study into the archive.
          </p>
          <button
            onClick={() => {
              setSelectedGenreFilter('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[#8b0000]"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Full Detail Modal */}
      {activeDetailBook && (
        <NonFictionDetailModal
          book={activeDetailBook}
          onClose={() => setActiveDetailBook(null)}
        />
      )}
    </section>
  );
};
