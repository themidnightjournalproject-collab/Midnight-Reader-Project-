import React, { useState, useMemo } from 'react';
import { useJournal } from '../../context/JournalContext';
import { BookAlbumItem, BookReview, NonFictionBook } from '../../types';
import { BookCoverImage } from '../common/BookCoverImage';
import {
  X,
  Layers,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  Plus,
  BookOpen,
  ArrowRight,
  Search,
  AlertCircle,
} from 'lucide-react';

interface ResolvedBookEntry {
  item: BookAlbumItem;
  title: string;
  author: string;
  genre: string;
  coverImage: string;
  pages: number;
  rating: number;
  code: string;
  summary: string;
  reviewData?: BookReview;
  nfData?: NonFictionBook;
}

export const AlbumDetailModal: React.FC = () => {
  const {
    bookAlbums,
    viewingAlbumId,
    setViewingAlbumId,
    reviews,
    nonFictionBooks,
    setSelectedReview,
    setSelectedNonFictionBook,
    openAlbumEditor,
    deleteBookAlbum,
    addBookToAlbum,
    removeBookFromAlbum,
    reorderAlbumItems,
  } = useJournal();

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const [busyError, setBusyError] = useState<string | null>(null);

  const album = useMemo(
    () => bookAlbums.find((a) => a.id === viewingAlbumId) || null,
    [bookAlbums, viewingAlbumId]
  );

  const resolvedEntries: ResolvedBookEntry[] = useMemo(() => {
    if (!album) return [];
    return album.items
      .map((item): ResolvedBookEntry | null => {
        if (item.kind === 'thriller') {
          const rev = reviews.find((r) => r.id === item.id);
          if (!rev) return null;
          return {
            item,
            title: rev.title,
            author: rev.author,
            genre: rev.genre,
            coverImage: rev.coverImage,
            pages: rev.pages || 0,
            rating: rev.rating || 5,
            code: `CASE #${rev.caseNumber}`,
            summary: rev.summary || rev.leadQuote || '',
            reviewData: rev,
          };
        } else {
          const nf = nonFictionBooks.find((b) => b.id === item.id);
          if (!nf) return null;
          return {
            item,
            title: nf.title,
            author: nf.author,
            genre: nf.genre,
            coverImage: nf.coverImage || nf.coverUrl || '',
            pages: nf.pages || 0,
            rating: nf.rating || 5,
            code: nf.catalogNumber,
            summary: nf.oneSentenceTakeaway || nf.summary || '',
            nfData: nf,
          };
        }
      })
      .filter((entry): entry is ResolvedBookEntry => entry !== null);
  }, [album, reviews, nonFictionBooks]);

  const availableBooksToAdd = useMemo(() => {
    if (!album) return [];
    const existingKeys = new Set(album.items.map((it) => `${it.kind}:${it.id}`));
    const q = addSearch.trim().toLowerCase();

    const pool: {
      item: BookAlbumItem;
      title: string;
      author: string;
      genre: string;
      coverImage: string;
      code: string;
    }[] = [
      ...reviews.map((r) => ({
        item: { kind: 'thriller' as const, id: r.id },
        title: r.title,
        author: r.author,
        genre: r.genre,
        coverImage: r.coverImage,
        code: `CASE #${r.caseNumber}`,
      })),
      ...nonFictionBooks.map((b) => ({
        item: { kind: 'non-fiction' as const, id: b.id },
        title: b.title,
        author: b.author,
        genre: b.genre,
        coverImage: b.coverImage || b.coverUrl || '',
        code: b.catalogNumber,
      })),
    ];

    return pool.filter((b) => {
      if (existingKeys.has(`${b.item.kind}:${b.item.id}`)) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q)
      );
    });
  }, [album, reviews, nonFictionBooks, addSearch]);

  if (!viewingAlbumId || !album) return null;

  const totalPages = resolvedEntries.reduce((sum, e) => sum + e.pages, 0);
  const avgRating = resolvedEntries.length
    ? (resolvedEntries.reduce((sum, e) => sum + e.rating, 0) / resolvedEntries.length).toFixed(1)
    : '—';

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= resolvedEntries.length) return;
    const nextItems = resolvedEntries.map((e) => e.item);
    const [moved] = nextItems.splice(index, 1);
    nextItems.splice(targetIdx, 0, moved);
    setBusyError(null);
    try {
      await reorderAlbumItems(album.id, nextItems);
    } catch (err: any) {
      setBusyError(err?.message || 'Could not save reading order.');
    }
  };

  const handleRemove = async (item: BookAlbumItem) => {
    setBusyError(null);
    try {
      await removeBookFromAlbum(album.id, item);
    } catch (err: any) {
      setBusyError(err?.message || 'Could not remove book from album.');
    }
  };

  const handleQuickAdd = async (item: BookAlbumItem) => {
    setBusyError(null);
    try {
      await addBookToAlbum(album.id, item);
    } catch (err: any) {
      setBusyError(err?.message || 'Could not add book to album.');
    }
  };

  const handleDeleteAlbum = async () => {
    if (
      window.confirm(
        `Delete album "${album.name}"? The books inside will remain safely in your library as individual books.`
      )
    ) {
      setBusyError(null);
      try {
        await deleteBookAlbum(album.id);
      } catch (err: any) {
        setBusyError(err?.message || 'Failed to delete album.');
      }
    }
  };

  const handleOpenBook = (entry: ResolvedBookEntry) => {
    setViewingAlbumId(null);
    if (entry.reviewData) {
      setSelectedReview(entry.reviewData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (entry.nfData) {
      setSelectedNonFictionBook(entry.nfData);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={() => setViewingAlbumId(null)}
    >
      <div
        className="bg-[#fcfaf2] border-4 border-black w-full max-w-4xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-black pb-4 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-[#8b0000] text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest inline-flex items-center gap-1">
                <Layers size={11} />
                <span>BOOK ALBUM</span>
              </span>
              <span className="font-mono text-xs font-bold text-[#4a4a4a] uppercase">
                {resolvedEntries.length} {resolvedEntries.length === 1 ? 'Volume' : 'Volumes'} •{' '}
                {totalPages.toLocaleString()} Pages • ★ {avgRating}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif uppercase tracking-tight text-[#1a1a1a]">
              {album.name}
            </h2>
            {album.description && (
              <p className="font-serif italic text-sm text-[#4a4a4a] mt-1 max-w-2xl">
                {album.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddDrawerOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8b0000] hover:bg-black text-white text-[11px] font-sans font-bold uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>{isAddDrawerOpen ? 'Done Adding' : '+ Add Books'}</span>
            </button>
            <button
              type="button"
              onClick={() => openAlbumEditor(album)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-black hover:text-white text-[#1a1a1a] text-[11px] font-sans font-bold uppercase tracking-wider border border-black transition-colors cursor-pointer"
            >
              <Edit3 size={12} />
              <span>Rename / Bulk Edit</span>
            </button>
            <button
              type="button"
              onClick={handleDeleteAlbum}
              title="Delete this album"
              className="p-1.5 bg-white hover:bg-red-50 text-gray-600 hover:text-[#8b0000] border border-black transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewingAlbumId(null)}
              className="p-1.5 bg-white hover:bg-[#8b0000] hover:text-white text-black border border-black transition-colors cursor-pointer"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {busyError && (
          <div className="mb-4 bg-[#8b0000]/10 border-2 border-[#8b0000] p-3 text-xs text-[#8b0000] flex items-center justify-between font-sans">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{busyError}</span>
            </div>
            <button
              type="button"
              onClick={() => setBusyError(null)}
              className="font-bold underline uppercase text-[10px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Quick Inline Add Existing Books Drawer */}
        {isAddDrawerOpen && (
          <div className="mb-6 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="font-sans text-xs font-black uppercase tracking-wider text-[#8b0000]">
                Add Existing Library Books to “{album.name}”
              </span>
              <div className="relative w-full sm:w-64">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={addSearch}
                  onChange={(e) => setAddSearch(e.target.value)}
                  placeholder="Search title, author, code..."
                  className="w-full bg-[#fcfaf2] border border-black pl-8 pr-3 py-1.5 text-xs font-sans focus:outline-none"
                />
              </div>
            </div>

            {availableBooksToAdd.length === 0 ? (
              <p className="text-xs font-serif italic text-gray-600 py-2">
                {addSearch
                  ? 'No matching unadded books found.'
                  : 'Every book in your library is already included in this album.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {availableBooksToAdd.map((b) => (
                  <button
                    key={`${b.item.kind}-${b.item.id}`}
                    type="button"
                    onClick={() => handleQuickAdd(b.item)}
                    className="flex items-center gap-2.5 p-2 bg-[#fcfaf2] hover:bg-[#f5f2ed] border border-black text-left transition-colors cursor-pointer group"
                  >
                    <div className="w-9 h-13 shrink-0 border border-black overflow-hidden bg-black">
                      <BookCoverImage
                        src={b.coverImage}
                        title={b.title}
                        author={b.author}
                        genre={b.genre}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[9px] font-bold uppercase text-[#8b0000] block">
                        {b.code} • {b.genre}
                      </span>
                      <span className="font-serif font-bold text-xs text-[#1a1a1a] line-clamp-1 block">
                        {b.title}
                      </span>
                      <span className="font-serif italic text-[11px] text-[#4a4a4a] line-clamp-1 block">
                        {b.author}
                      </span>
                    </div>
                    <span className="bg-black group-hover:bg-[#8b0000] text-white text-[10px] font-sans font-bold uppercase px-2 py-1 shrink-0">
                      + Add
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ordered Books Inside This Album */}
        {resolvedEntries.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-black p-10 text-center">
            <BookOpen size={30} className="mx-auto text-[#8b0000] mb-2" />
            <h3 className="font-serif font-black text-lg uppercase text-[#1a1a1a] mb-1">
              This Album Has No Books Yet
            </h3>
            <p className="font-serif italic text-sm text-[#4a4a4a] mb-4">
              Select existing books from your library to group them here in reading order.
            </p>
            <button
              type="button"
              onClick={() => setIsAddDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#8b0000] hover:bg-black text-white px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Existing Books</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-sans font-bold uppercase tracking-wider text-[#4a4a4a]">
              <span>Reading Order Sequence (Use arrows to rearrange)</span>
              <span>Click any book to open dossier</span>
            </div>

            {resolvedEntries.map((entry, idx) => (
              <div
                key={`${entry.item.kind}-${entry.item.id}`}
                className="bg-white border-2 border-black p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Reading Order Badge */}
                  <div className="flex flex-col items-center shrink-0">
                    <span className="bg-black text-white font-mono font-black text-xs px-2 py-1 min-w-[36px] text-center">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-0.5 mt-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, -1)}
                        title="Move earlier in reading order"
                        className="p-1 border border-black/40 hover:border-black hover:bg-[#f5f2ed] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowUp size={11} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === resolvedEntries.length - 1}
                        onClick={() => handleMove(idx, 1)}
                        title="Move later in reading order"
                        className="p-1 border border-black/40 hover:border-black hover:bg-[#f5f2ed] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Cover */}
                  <div
                    onClick={() => handleOpenBook(entry)}
                    className="w-16 h-24 shrink-0 border border-black bg-black overflow-hidden cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <BookCoverImage
                      src={entry.coverImage}
                      title={entry.title}
                      author={entry.author}
                      genre={entry.genre}
                      alt={entry.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Book Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase text-white ${
                          entry.item.kind === 'thriller' ? 'bg-[#8b0000]' : 'bg-black'
                        }`}
                      >
                        {entry.code}
                      </span>
                      <span className="text-[10px] font-sans font-bold uppercase text-[#737373]">
                        {entry.genre}
                      </span>
                    </div>

                    <h3
                      onClick={() => handleOpenBook(entry)}
                      className="font-serif font-black text-lg text-[#1a1a1a] hover:text-[#8b0000] cursor-pointer leading-tight"
                    >
                      {entry.title}
                    </h3>
                    <p className="font-serif italic text-xs text-[#4a4a4a] mt-0.5">
                      By {entry.author} • {entry.pages} Pages •{' '}
                      <span className="text-[#8b0000] font-bold not-italic">
                        {'★'.repeat(entry.rating)}
                        {'☆'.repeat(Math.max(0, 5 - entry.rating))}
                      </span>
                    </p>
                    {entry.summary && (
                      <p className="font-serif text-xs text-[#555] line-clamp-2 mt-1.5">
                        {entry.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-black/15">
                  <button
                    type="button"
                    onClick={() => handleOpenBook(entry)}
                    className="flex items-center gap-1 bg-black hover:bg-[#8b0000] text-white px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>Open Book</span>
                    <ArrowRight size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(entry.item)}
                    className="flex items-center gap-1 text-[10px] font-sans font-bold uppercase text-gray-500 hover:text-[#8b0000] px-2 py-1 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove this book from the album"
                  >
                    <Trash2 size={11} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
