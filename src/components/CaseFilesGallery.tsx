import React, { useState, useMemo } from 'react';
import { useJournal } from '../context/JournalContext';
import { Heart, Edit3, FolderOpen, Sparkles, Camera, Layers, Plus } from 'lucide-react';
import { BookReview } from '../types';
import { QuickImageModal } from './modals/QuickImageModal';
import { CaseStatusBadge } from './common/CaseStatusBadge';
import { BookCoverImage } from './common/BookCoverImage';
import { BookAlbumCard } from './BookAlbumCard';

export const CaseFilesGallery: React.FC = () => {
  const { 
    reviews, 
    bookAlbums,
    setSelectedReview, 
    setEditingReview, 
    updateReview,
    openAlbumEditor,
    openAlbumByName,
    postLikes, 
    userLikedPosts, 
    toggleLikePost, 
    isAdminUnlocked 
  } = useJournal();

  const [activeReplaceReview, setActiveReplaceReview] = useState<BookReview | null>(null);

  const handleUpdateCardCover = (newUrl: string) => {
    if (activeReplaceReview) {
      updateReview(activeReplaceReview.id, { coverImage: newUrl });
    }
  };

  const { caseAlbums, standaloneReviews } = useMemo(() => {
    const thrillerAlbums = bookAlbums.filter((album) =>
      album.items.some((it) => it.kind === 'thriller')
    );
    const groupedIds = new Set<string>();
    thrillerAlbums.forEach((album) => {
      album.items.forEach((it) => {
        if (it.kind === 'thriller') groupedIds.add(it.id);
      });
    });
    const standalone = reviews.filter((r) => !groupedIds.has(r.id));
    return { caseAlbums: thrillerAlbums, standaloneReviews: standalone };
  }, [reviews, bookAlbums]);

  const renderCaseCard = (review: BookReview) => {
    const likes = postLikes[review.id] ?? (review.likes || 0);
    const isLiked = !!userLikedPosts[review.id];

    return (
      <div
        key={review.id}
        className="bg-[#f5f2ed] p-5 sm:p-6 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all border-2 border-black relative flex flex-col justify-between group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div>
          <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
            <span className="font-sans text-xs uppercase font-bold text-[#1a1a1a] tracking-wider">
              CASE FILE #{review.caseNumber}
            </span>
            <div className="flex items-center gap-1.5">
              {review.readingFormat && (
                <span className="text-[10px] font-sans font-bold uppercase bg-white px-1.5 py-0.5 border border-black border-opacity-30">
                  {review.readingFormat}
                </span>
              )}
              <CaseStatusBadge item={review} size="sm" showProgressDetails />
            </div>
          </div>

          <div className="flex gap-3 items-start mb-3">
            <div className="relative shrink-0 w-16 h-22 bg-white border border-black p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group/cover">
              <BookCoverImage
                src={review.coverImage}
                title={review.title}
                author={review.author}
                genre={review.genre}
                alt={review.title}
                className="w-full h-full object-cover grayscale-[15%] contrast-[105%]"
              />
              {isAdminUnlocked && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveReplaceReview(review);
                  }}
                  title="Replace Cover Photo"
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <Camera size={14} />
                </button>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {review.seriesName && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAlbumByName(review.seriesName!);
                  }}
                  title="Open this book album"
                  className="inline-flex items-center gap-1 mb-1 px-1.5 py-0.5 bg-white hover:bg-black hover:text-white border border-black text-[9px] font-mono font-bold uppercase tracking-wider text-[#1a1a1a] transition-colors cursor-pointer"
                >
                  <Layers size={10} className="text-[#8b0000]" />
                  <span>
                    {review.seriesName}
                    {review.seriesOrder ? ` · Book ${review.seriesOrder}` : ''}
                  </span>
                </button>
              )}
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
              {(!review.evidenceBullets || review.evidenceBullets.length === 0) && (
                <>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#8b0000] font-bold">•</span>
                    <span>unreliable narrator statement</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#8b0000] font-bold">•</span>
                    <span>contradictory timeline alibi</span>
                  </li>
                </>
              )}
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
              className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold border transition-colors ${
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
                  setActiveReplaceReview(review);
                }}
                title="Quick Change Cover Image"
                className="p-1 text-[#4a4a4a] hover:text-[#8b0000] hover:bg-white border border-transparent hover:border-black transition-colors"
              >
                <Camera size={13} />
              </button>
            )}

            {isAdminUnlocked && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingReview(review);
                }}
                title="Edit Case File"
                className="p-1 text-[#4a4a4a] hover:text-[#8b0000] hover:bg-white border border-transparent hover:border-black transition-colors"
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
            className="text-[#1a1a1a] font-bold group-hover:text-[#8b0000] uppercase tracking-wider flex items-center gap-1 hover:underline"
          >
            <span>OPEN FILE</span>
            <span>→</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="border-b-2 border-black pb-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest">
                CLASSIFIED ARCHIVES
              </span>
              <span className="text-[#737373]">•</span>
              <span className="font-sans text-xs text-[#4a4a4a] uppercase">
                CRIMINAL EVIDENCE DOSSIERS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight uppercase font-serif">
              CASE FILES ARCHIVE ({reviews.length})
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openAlbumEditor(null)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-sans font-bold uppercase tracking-wider bg-[#8b0000] hover:bg-black text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Album</span>
            </button>
          </div>
        </div>

        <p className="font-serif text-base text-[#4a4a4a] italic mt-2 max-w-3xl">
          Dedicated case file archives across all genres, investigations, and literary dissections. Inspect evidence lineups, reader testimonies, or open any album or case below for full critical marginalia.
        </p>
      </div>

      {/* Case Folders & Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseAlbums.map((album) => (
          <BookAlbumCard
            key={`case-album-${album.id}`}
            album={album}
            variant="grid"
            filterKind="thriller"
          />
        ))}
        {standaloneReviews.map((review) => renderCaseCard(review))}
      </div>

      {/* Quick Image Replacement Modal for Card */}
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
