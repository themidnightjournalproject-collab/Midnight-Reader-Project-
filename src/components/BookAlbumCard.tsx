import React from 'react';
import { BookAlbum } from '../types';
import { useJournal } from '../context/JournalContext';
import { BookCoverImage } from './common/BookCoverImage';
import { FolderOpen, Edit3, Layers, BookOpen, ArrowRight } from 'lucide-react';

interface BookAlbumCardProps {
  album: BookAlbum;
  variant?: 'grid' | 'feed';
  filterKind?: 'all' | 'thriller' | 'non-fiction';
}

interface ResolvedAlbumBook {
  kind: 'thriller' | 'non-fiction';
  id: string;
  title: string;
  author: string;
  genre: string;
  coverImage: string;
  pages: number;
  rating: number;
  code: string;
}

export const BookAlbumCard: React.FC<BookAlbumCardProps> = ({
  album,
  variant = 'grid',
  filterKind = 'all',
}) => {
  const { reviews, nonFictionBooks, setViewingAlbumId, openAlbumEditor } = useJournal();

  const resolvedBooks: ResolvedAlbumBook[] = album.items
    .map((item) => {
      if (item.kind === 'thriller') {
        const rev = reviews.find((r) => r.id === item.id);
        if (!rev) return null;
        return {
          kind: 'thriller' as const,
          id: rev.id,
          title: rev.title,
          author: rev.author,
          genre: rev.genre,
          coverImage: rev.coverImage,
          pages: rev.pages || 0,
          rating: rev.rating || 5,
          code: `CASE #${rev.caseNumber}`,
        };
      } else {
        const nf = nonFictionBooks.find((b) => b.id === item.id);
        if (!nf) return null;
        return {
          kind: 'non-fiction' as const,
          id: nf.id,
          title: nf.title,
          author: nf.author,
          genre: nf.genre,
          coverImage: nf.coverImage || nf.coverUrl || '',
          pages: nf.pages || 0,
          rating: nf.rating || 5,
          code: nf.catalogNumber,
        };
      }
    })
    .filter((b): b is ResolvedAlbumBook => b !== null);

  const displayBooks =
    filterKind === 'all'
      ? resolvedBooks
      : resolvedBooks.filter((b) => b.kind === filterKind);

  const booksToShow = displayBooks.length > 0 ? displayBooks : resolvedBooks;
  const totalPages = booksToShow.reduce((sum, b) => sum + (b.pages || 0), 0);
  const avgRating = booksToShow.length
    ? (booksToShow.reduce((sum, b) => sum + (b.rating || 0), 0) / booksToShow.length).toFixed(1)
    : '—';

  const handleOpenAlbum = () => {
    setViewingAlbumId(album.id);
  };

  if (variant === 'feed') {
    return (
      <article
        onClick={handleOpenAlbum}
        className="bg-[#fffef7] border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(139,0,0,1)] transition-all cursor-pointer group relative"
      >
        {/* Top Stamp Bar */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 mb-5 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#8b0000] text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest inline-flex items-center gap-1">
              <Layers size={11} />
              <span>BOOK ALBUM</span>
            </span>
            <span className="font-mono text-xs font-bold uppercase text-[#1a1a1a]">
              {booksToShow.length} {booksToShow.length === 1 ? 'VOLUME' : 'VOLUMES'}
            </span>
            <span className="text-black/30 hidden sm:inline">•</span>
            <span className="font-sans text-xs font-bold text-[#737373] hidden sm:inline">
              {totalPages.toLocaleString()} Pages Total
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openAlbumEditor(album);
            }}
            className="flex items-center gap-1 text-[#1a1a1a] hover:bg-black hover:text-white text-[11px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 border border-black transition-colors cursor-pointer"
            title="Edit album, add/remove books, or reorder"
          >
            <Edit3 size={11} />
            <span>Edit Album</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Stacked Cover Collage */}
          <div className="md:col-span-4 flex items-center justify-center py-2">
            {booksToShow.length > 0 ? (
              <div className="flex items-end justify-center -space-x-6">
                {booksToShow.slice(0, 3).map((book, idx) => (
                  <div
                    key={`${book.kind}-${book.id}`}
                    className={`w-24 h-36 bg-white border-2 border-black p-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform ${
                      idx === 0
                        ? '-rotate-3 z-10'
                        : idx === 1
                          ? 'z-20 -translate-y-1.5'
                          : 'rotate-3 z-30'
                    }`}
                  >
                    <BookCoverImage
                      src={book.coverImage}
                      title={book.title}
                      author={book.author}
                      genre={book.genre}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-32 h-40 border-2 border-dashed border-black/40 bg-[#f5f2ed] flex flex-col items-center justify-center text-center p-3">
                <FolderOpen size={24} className="text-[#8b0000] mb-1" />
                <span className="text-[10px] font-mono uppercase text-gray-600">Empty Album</span>
              </div>
            )}
          </div>

          {/* Album Info & Reading Order List */}
          <div className="md:col-span-8 space-y-3">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tight text-[#1a1a1a] group-hover:text-[#8b0000] transition-colors">
                {album.name}
              </h3>
              {album.description && (
                <p className="font-serif italic text-sm text-[#4a4a4a] mt-1">
                  {album.description}
                </p>
              )}
            </div>

            {booksToShow.length > 0 && (
              <div className="bg-[#f5f2ed] border border-black p-3 space-y-1.5">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8b0000] block">
                  Reading Order Lineup:
                </span>
                <ol className="space-y-1">
                  {booksToShow.slice(0, 4).map((b, idx) => (
                    <li key={`${b.kind}-${b.id}`} className="flex items-center justify-between gap-2 text-xs font-serif">
                      <span className="truncate">
                        <strong className="font-mono text-[11px] text-[#8b0000] mr-1.5">
                          #{idx + 1}
                        </strong>
                        <span className="font-bold text-[#1a1a1a]">{b.title}</span>
                        <span className="text-[#555] italic"> — {b.author}</span>
                      </span>
                      <span className="font-mono text-[10px] text-gray-500 shrink-0">{b.code}</span>
                    </li>
                  ))}
                  {booksToShow.length > 4 && (
                    <li className="text-[11px] font-mono font-bold text-[#8b0000] pt-0.5">
                      + {booksToShow.length - 4} more book{booksToShow.length - 4 === 1 ? '' : 's'} inside
                    </li>
                  )}
                </ol>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-black/20">
              <span className="font-mono text-xs font-bold text-[#4a4a4a]">
                AVG RATING: <span className="text-[#8b0000]">★ {avgRating}</span>
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenAlbum();
                }}
                className="inline-flex items-center gap-1.5 bg-black hover:bg-[#8b0000] text-white px-4 py-2 text-xs font-sans uppercase tracking-wider font-bold transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
              >
                <FolderOpen size={13} />
                <span>OPEN ALBUM ({booksToShow.length})</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid Card Variant (displays cleanly alongside regular individual books in 3-col grids)
  return (
    <div
      onClick={handleOpenAlbum}
      className="bg-[#fffef7] p-5 sm:p-6 hover:shadow-[7px_7px_0px_0px_rgba(139,0,0,1)] hover:-translate-y-0.5 transition-all border-2 border-black relative flex flex-col justify-between group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
    >
      <div>
        {/* Top Album Stamp */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3.5">
          <div className="flex items-center gap-1.5">
            <span className="bg-[#8b0000] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider inline-flex items-center gap-1">
              <Layers size={10} />
              <span>ALBUM</span>
            </span>
            <span className="font-mono text-[11px] font-bold uppercase text-[#1a1a1a]">
              {booksToShow.length} {booksToShow.length === 1 ? 'BOOK' : 'BOOKS'}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openAlbumEditor(album);
            }}
            title="Edit Album / Add or Reorder Books"
            className="p-1 text-[#4a4a4a] hover:text-white hover:bg-black border border-black/30 hover:border-black transition-colors cursor-pointer"
          >
            <Edit3 size={12} />
          </button>
        </div>

        {/* Stacked Cover Fan Preview */}
        <div className="bg-[#f5f2ed] border border-black p-3 mb-3.5 flex items-center justify-center min-h-[128px]">
          {booksToShow.length > 0 ? (
            <div className="flex items-end justify-center -space-x-4">
              {booksToShow.slice(0, 3).map((book, idx) => (
                <div
                  key={`${book.kind}-${book.id}`}
                  className={`w-16 h-24 bg-white border border-black p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-105 ${
                    idx === 0
                      ? '-rotate-3 z-10'
                      : idx === 1
                        ? 'z-20 -translate-y-1'
                        : 'rotate-3 z-30'
                  }`}
                >
                  <BookCoverImage
                    src={book.coverImage}
                    title={book.title}
                    author={book.author}
                    genre={book.genre}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-2">
              <BookOpen size={22} className="text-[#8b0000] mb-1" />
              <span className="text-[10px] font-mono uppercase text-gray-500">
                No books grouped yet
              </span>
            </div>
          )}
        </div>

        {/* Album Title & Description */}
        <h3 className="font-serif text-xl font-black uppercase text-[#1a1a1a] group-hover:text-[#8b0000] transition-colors leading-tight mb-1">
          {album.name}
        </h3>
        {album.description ? (
          <p className="font-serif italic text-xs text-[#4a4a4a] line-clamp-2 mb-3">
            {album.description}
          </p>
        ) : (
          <p className="font-mono text-[10px] uppercase text-[#737373] mb-3">
            {totalPages.toLocaleString()} Pages • Avg ★ {avgRating}
          </p>
        )}

        {/* Ordered Volumes Preview */}
        {booksToShow.length > 0 && (
          <div className="border-t border-black pt-2.5 space-y-1">
            <span className="font-sans text-[9px] uppercase font-bold text-[#737373] tracking-wider block">
              READING ORDER:
            </span>
            <ul className="space-y-1 font-serif text-xs text-[#1a1a1a]">
              {booksToShow.slice(0, 3).map((b, idx) => (
                <li key={`${b.kind}-${b.id}`} className="flex items-baseline gap-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#8b0000] shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="line-clamp-1 font-semibold">{b.title}</span>
                </li>
              ))}
              {booksToShow.length > 3 && (
                <li className="text-[10px] font-mono font-bold text-[#8b0000]">
                  + {booksToShow.length - 3} more volume{booksToShow.length - 3 === 1 ? '' : 's'}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="mt-5 pt-3 border-t border-black flex items-center justify-between text-xs font-sans">
        <span className="font-mono text-[10px] font-bold uppercase text-[#4a4a4a]">
          {totalPages.toLocaleString()} P.
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenAlbum();
          }}
          className="bg-black group-hover:bg-[#8b0000] text-white font-bold uppercase tracking-wider text-[10px] px-3 py-1.5 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>OPEN ALBUM</span>
          <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
};
