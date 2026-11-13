import React, { useState, useMemo } from 'react';
import { useJournal } from '../context/JournalContext';
import { NonFictionBook, OtherGenre, ALL_OTHER_GENRES } from '../types';
import { NonFictionCard } from './NonFictionCard';
import { BookAlbumCard } from './BookAlbumCard';
import { NonFictionDetailModal } from './NonFictionDetailModal';
import { QuickImageModal } from './modals/QuickImageModal';
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
  BookCheck,
  Edit3,
  Camera,
  X,
  Tag,
  RotateCcw
} from 'lucide-react';

export const NonFictionSection: React.FC = () => {
  const { 
    nonFictionBooks, 
    setIsNewNonFictionModalOpen, 
    setEditingNonFictionBook,
    updateNonFictionBook,
    offTheRecordConfig,
    setIsEditOffTheRecordModalOpen,
    isAdminUnlocked,
    offTheRecordGenres,
    addOffTheRecordGenre,
    editOffTheRecordGenre,
    removeOffTheRecordGenre,
    resetOffTheRecordGenres,
    bookAlbums,
    openAlbumEditor,
  } = useJournal();

  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'likes' | 'title' | 'pages'>('newest');
  const [activeDetailBook, setActiveDetailBook] = useState<NonFictionBook | null>(null);
  const [activeReplaceBook, setActiveReplaceBook] = useState<NonFictionBook | null>(null);
  const [isAddingGenre, setIsAddingGenre] = useState(false);
  const [newGenreInput, setNewGenreInput] = useState('');
  const [editingGenreName, setEditingGenreName] = useState<string | null>(null);
  const [editGenreInput, setEditGenreInput] = useState<string>('');

  const handleAddGenre = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newGenreInput.trim();
    if (!clean) return;
    addOffTheRecordGenre(clean);
    setSelectedGenreFilter(clean);
    setNewGenreInput('');
    setIsAddingGenre(false);
  };

  const handleStartEditGenre = (genre: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGenreName(genre);
    setEditGenreInput(genre);
  };

  const handleSaveEditGenre = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingGenreName) return;
    const clean = editGenreInput.trim();
    if (!clean) return;
    editOffTheRecordGenre(editingGenreName, clean);
    if (selectedGenreFilter.toLowerCase() === editingGenreName.toLowerCase()) {
      setSelectedGenreFilter(clean);
    }
    setEditingGenreName(null);
    setEditGenreInput('');
  };

  const handleRemoveGenre = (genreToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Remove genre "${genreToRemove}" from Off the Record?`)) {
      removeOffTheRecordGenre(genreToRemove);
      if (selectedGenreFilter.toLowerCase() === genreToRemove.toLowerCase()) {
        setSelectedGenreFilter('All');
      }
    }
  };

  const handleUpdateCardCover = (newUrl: string) => {
    if (activeReplaceBook) {
      updateNonFictionBook(activeReplaceBook.id, { 
        coverImage: newUrl,
        coverUrl: newUrl 
      });
    }
  };

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

  const { visibleNfAlbums, ungroupedNfBooks } = useMemo(() => {
    const filteredIds = new Set(filteredBooks.map((b) => b.id));
    const q = searchQuery.trim().toLowerCase();

    const matchedAlbums = bookAlbums.filter((album) => {
      const hasMatchingBook = album.items.some(
        (it) => it.kind === 'non-fiction' && filteredIds.has(it.id)
      );
      if (hasMatchingBook) return true;
      if (
        q &&
        selectedGenreFilter === 'All' &&
        album.items.some((it) => it.kind === 'non-fiction') &&
        (album.name.toLowerCase().includes(q) || (album.description || '').toLowerCase().includes(q))
      ) {
        return true;
      }
      return false;
    });

    const groupedIds = new Set<string>();
    matchedAlbums.forEach((album) => {
      album.items.forEach((it) => {
        if (it.kind === 'non-fiction') groupedIds.add(it.id);
      });
    });

    const ungrouped = filteredBooks.filter((b) => !groupedIds.has(b.id));
    return { visibleNfAlbums: matchedAlbums, ungroupedNfBooks: ungrouped };
  }, [bookAlbums, filteredBooks, searchQuery, selectedGenreFilter]);

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
                {offTheRecordConfig.badge}
              </span>
              <span className="text-[11px] font-sans font-bold text-[#8b0000] tracking-wider uppercase">
                {offTheRecordConfig.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif uppercase tracking-tight text-black">
              {offTheRecordConfig.title}
            </h2>
            <p className="text-xs sm:text-sm font-serif text-gray-700 mt-1 max-w-2xl leading-relaxed">
              {offTheRecordConfig.introduction}
            </p>
          </div>

          {/* Quick Action to edit section or add book - only for unlocked admin */}
          {isAdminUnlocked && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-edit-off-the-record"
                onClick={() => setIsEditOffTheRecordModalOpen(true)}
                className="flex items-center gap-1.5 bg-white hover:bg-[#e8e2d8] text-black border border-black px-4 py-2.5 text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
                title="Edit section title, badge, and introduction"
              >
                <Edit3 size={14} className="text-[#8b0000]" />
                <span>Edit Section & Intro</span>
              </button>
              <button
                id="btn-log-non-fiction"
                onClick={handleOpenNewModal}
                className="flex items-center gap-2 bg-black hover:bg-[#8b0000] text-white px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
              >
                <Plus size={15} />
                <span>Add to Off the Record</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compact Reading Record Statistics Bar (Sleeker & Smaller) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-gray-500 mb-0.5">
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Books Read</span>
            <BookOpen size={13} className="text-[#8b0000]" />
          </div>
          <span className="text-xl font-black font-mono text-black">{totalBooks}</span>
          <span className="text-[9px] font-sans text-gray-500 block uppercase">Catalog Entries</span>
        </div>

        <div className="bg-white p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-gray-500 mb-0.5">
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Pages Read</span>
            <Layers size={13} className="text-[#8b0000]" />
          </div>
          <span className="text-xl font-black font-mono text-black">{totalPages.toLocaleString()}</span>
          <span className="text-[9px] font-sans text-gray-500 block uppercase">Total Pagecount</span>
        </div>

        <div className="bg-white p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-gray-500 mb-0.5">
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Key Takeaways</span>
            <Lightbulb size={13} className="text-[#8b0000]" />
          </div>
          <span className="text-xl font-black font-mono text-[#8b0000]">{totalTakeaways}</span>
          <span className="text-[9px] font-sans text-gray-500 block uppercase">Noted Insights</span>
        </div>

        <div className="bg-white p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-gray-500 mb-0.5">
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Average Rating</span>
            <Brain size={13} className="text-[#8b0000]" />
          </div>
          <span className="text-xl font-black font-mono text-black">{avgRating}/5.0</span>
          <span className="text-[9px] font-sans text-gray-500 block uppercase">Overall Impression</span>
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

          {/* Sort dropdown & Create Album */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openAlbumEditor(null)}
              className="flex items-center gap-1 px-3 py-2 text-xs font-sans font-bold uppercase tracking-wider bg-[#8b0000] hover:bg-black text-white border border-black transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>Create Album</span>
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">Sort By:</span>
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
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500 mr-1 flex items-center gap-1">
              <Tag size={11} className="text-[#8b0000]" />
              <span>Filter Branch:</span>
            </span>

            {/* 'All' Button */}
            <button
              type="button"
              onClick={() => setSelectedGenreFilter('All')}
              className={`px-3 py-1 text-[11px] font-sans font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                selectedGenreFilter === 'All'
                  ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black border-gray-400 hover:border-black hover:bg-gray-100'
              }`}
            >
              All
            </button>

            {/* Dynamic Genre Chips with Edit and Remove Buttons */}
            {offTheRecordGenres.map((genre) => {
              const isSelected = selectedGenreFilter.toLowerCase() === genre.toLowerCase();
              const isEditingThis = editingGenreName === genre;

              if (isEditingThis) {
                return (
                  <form
                    key={genre}
                    onSubmit={handleSaveEditGenre}
                    className="inline-flex items-center gap-1 bg-white border-2 border-[#8b0000] p-0.5 shadow-[2px_2px_0px_0px_rgba(139,0,0,0.4)]"
                  >
                    <input
                      type="text"
                      autoFocus
                      value={editGenreInput}
                      onChange={(e) => setEditGenreInput(e.target.value)}
                      className="px-2 py-0.5 text-xs font-sans border border-gray-300 focus:outline-none focus:border-black w-28 sm:w-36"
                    />
                    <button
                      type="submit"
                      className="px-2 py-0.5 bg-[#8b0000] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-black cursor-pointer"
                      title="Save genre changes"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGenreName(null);
                        setEditGenreInput('');
                      }}
                      className="px-1.5 py-0.5 text-gray-500 hover:text-black text-xs font-bold cursor-pointer"
                      title="Cancel"
                    >
                      ✕
                    </button>
                  </form>
                );
              }

              return (
                <div
                  key={genre}
                  className={`group inline-flex items-center text-[11px] font-sans font-bold uppercase tracking-wider border transition-all ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black border-gray-400 hover:border-black hover:bg-gray-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedGenreFilter(genre)}
                    className="px-2.5 py-1 cursor-pointer focus:outline-none"
                  >
                    {genre}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleStartEditGenre(genre, e)}
                    title={`Rename "${genre}" genre`}
                    className={`px-1.5 py-1 text-xs cursor-pointer border-l transition-colors ${
                      isSelected
                        ? 'border-neutral-700 text-neutral-400 hover:text-amber-300 hover:bg-neutral-900'
                        : 'border-gray-200 text-gray-400 hover:text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    <Edit3 size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveGenre(genre, e)}
                    title={`Remove "${genre}" genre from Off the Record`}
                    className={`px-1.5 py-1 text-xs cursor-pointer border-l transition-colors ${
                      isSelected
                        ? 'border-neutral-700 text-neutral-400 hover:text-red-300 hover:bg-neutral-900'
                        : 'border-gray-200 text-gray-400 hover:text-[#8b0000] hover:bg-red-50'
                    }`}
                  >
                    <X size={11} />
                  </button>
                </div>
              );
            })}

            {/* Add Genre Trigger or Inline Form */}
            {!isAddingGenre ? (
              <button
                type="button"
                id="btn-add-off-the-record-genre"
                onClick={() => setIsAddingGenre(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-sans font-bold uppercase tracking-wider bg-[#faf7f2] hover:bg-[#8b0000] hover:text-white text-[#8b0000] border border-dashed border-[#8b0000] transition-colors cursor-pointer shadow-[1px_1px_0px_0px_rgba(139,0,0,0.3)] hover:shadow-none"
                title="Add a custom genre to Off the Record"
              >
                <Plus size={12} />
                <span>+ Add Genre</span>
              </button>
            ) : (
              <form onSubmit={handleAddGenre} className="inline-flex items-center gap-1.5 bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <input
                  type="text"
                  autoFocus
                  value={newGenreInput}
                  onChange={(e) => setNewGenreInput(e.target.value)}
                  placeholder="New genre (e.g. Graphic Memoir)..."
                  className="px-2 py-0.5 text-xs font-sans border border-gray-300 focus:outline-none focus:border-black w-40 sm:w-48"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-[#8b0000] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingGenre(false);
                    setNewGenreInput('');
                  }}
                  className="px-1.5 py-0.5 text-gray-500 hover:text-black text-xs font-bold cursor-pointer"
                  title="Cancel"
                >
                  ✕
                </button>
              </form>
            )}

            {/* Reset Genres to Defaults */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset Off the Record genres back to original defaults?')) {
                  resetOffTheRecordGenres();
                  setSelectedGenreFilter('All');
                }
              }}
              className="inline-flex items-center gap-1 text-[10px] font-sans text-gray-400 hover:text-black uppercase tracking-wider ml-1 py-1 px-1.5 hover:underline cursor-pointer"
              title="Reset genres to default list"
            >
              <RotateCcw size={10} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Albums alongside Non-Fiction / Off the Record Dossiers */}
      {visibleNfAlbums.length > 0 || ungroupedNfBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleNfAlbums.map((album) => (
            <BookAlbumCard
              key={`nf-album-${album.id}`}
              album={album}
              variant="grid"
              filterKind="non-fiction"
            />
          ))}
          {ungroupedNfBooks.map((book) => (
            <NonFictionCard
              key={book.id}
              book={book}
              onOpenDetail={(b) => setActiveDetailBook(b)}
              onReplaceCover={(b) => setActiveReplaceBook(b)}
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
          onSelectBook={(b) => setActiveDetailBook(b)}
        />
      )}

      {/* Cover Image Replacement Modal */}
      <QuickImageModal
        isOpen={!!activeReplaceBook}
        onClose={() => setActiveReplaceBook(null)}
        targetType="custom"
        initialImage={activeReplaceBook?.coverImage || activeReplaceBook?.coverUrl || ''}
        onSaveImage={handleUpdateCardCover}
        title={activeReplaceBook ? `Replace Cover Photo: ${activeReplaceBook.title}` : 'Replace Cover Photo'}
      />
    </section>
  );
};
