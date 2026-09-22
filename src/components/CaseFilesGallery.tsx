import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Heart, Edit3, FolderOpen, Sparkles, Camera } from 'lucide-react';
import { BookReview } from '../types';
import { QuickImageModal } from './modals/QuickImageModal';

export const CaseFilesGallery: React.FC = () => {
  const { 
    reviews, 
    setSelectedReview, 
    setEditingReview, 
    updateReview,
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
              CRIMINAL CASE FILES ARCHIVE ({reviews.length})
            </h2>
          </div>

          <span className="border border-black text-black font-mono uppercase text-xs py-0.5 px-2 font-bold rotate-[-1deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            THRILLER CASES ONLY
          </span>
        </div>

        <p className="font-serif text-base text-[#4a4a4a] italic mt-2 max-w-3xl">
          Dedicated archives of thriller and mystery investigations. Inspect suspect lineups, vote on plot twists, endorse case dossiers, or open any case below for full critical dissection.
        </p>
      </div>

      {/* Case Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => {
          const likes = postLikes[review.id] ?? (review.likes || 0);
          const isLiked = !!userLikedPosts[review.id];

          return (
            <div
              key={review.id}
              className="bg-[#f5f2ed] p-5 sm:p-6 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all border-2 border-black relative flex flex-col justify-between group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Top Folder Tab & Status */}
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
                    <span className="border border-[#8b0000] text-[#8b0000] font-mono text-[10px] py-0.5 px-1.5 font-bold uppercase rotate-[-2deg]">
                      {review.status}
                    </span>
                  </div>
                </div>

                {/* Header with thumbnail & book title */}
                <div className="flex gap-3 items-start mb-3">
                  {/* Miniature Cover with Quick Replace */}
                  <div className="relative shrink-0 w-16 h-22 bg-white border border-black p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group/cover">
                    <img
                      src={review.coverImage}
                      alt={review.title}
                      className="w-full h-full object-cover grayscale-[15%] contrast-[105%]"
                      referrerPolicy="no-referrer"
                    />
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

                {/* Classification & Tropes */}
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

                {/* Evidence Bullets */}
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

              {/* Bottom Card Actions & Quick Like */}
              <div className="mt-6 pt-3 border-t border-black flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2">
                  {/* Quick Like Button */}
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
        })}
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
