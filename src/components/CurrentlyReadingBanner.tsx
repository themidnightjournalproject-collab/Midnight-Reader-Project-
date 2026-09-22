import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Edit3, Camera, BookOpen, Bookmark, Sparkles } from 'lucide-react';
import { QuickImageModal } from './modals/QuickImageModal';

export const CurrentlyReadingBanner: React.FC = () => {
  const { currentlyReading, updateCurrentlyReading, setIsCurrentlyReadingModalOpen, isAdminUnlocked } = useJournal();
  const [quickImageTarget, setQuickImageTarget] = useState<'primary' | 'nonThriller' | null>(null);

  const primaryProgressPercentage = Math.min(
    100,
    Math.max(0, Math.round((currentlyReading.currentPage / (currentlyReading.totalPages || 1)) * 100))
  );

  const hasNonThriller = (currentlyReading.showNonThriller ?? true) && Boolean(currentlyReading.nonThrillerTitle);

  const nonThrillerProgressPercentage = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((currentlyReading.nonThrillerCurrentPage || 0) / (currentlyReading.nonThrillerTotalPages || 1)) * 100
      )
    )
  );

  const handleUpdateCover = (newImageUrl: string) => {
    if (quickImageTarget === 'primary') {
      updateCurrentlyReading({ coverImage: newImageUrl });
    } else if (quickImageTarget === 'nonThriller') {
      updateCurrentlyReading({ nonThrillerCoverImage: newImageUrl });
    }
    setQuickImageTarget(null);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-4 space-y-6">
      
      {/* 1. Primary Reading Banner */}
      <div className="bg-[#e8e2d8] border-2 border-black p-5 sm:p-6 relative rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* Top Header & Stamp */}
        <div className="flex flex-wrap items-center justify-between border-b border-black border-opacity-20 pb-3 mb-5 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#8b0000] rounded-full animate-pulse inline-block" />
            <h3 className="text-xs font-sans font-black uppercase tracking-widest text-[#1a1a1a]">
              Primary Book Under Investigation
            </h3>
          </div>

          {isAdminUnlocked && (
            <button
              id="btn-edit-currently-reading"
              onClick={() => setIsCurrentlyReadingModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#4a4a4a] hover:text-[#8b0000] hover:underline cursor-pointer"
              title="Update reading progress, thoughts, or parallel book"
            >
              <Edit3 size={12} />
              <span>Update Current Reads</span>
            </button>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Book Cover Photo */}
          <div className="md:col-span-3 flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="w-32 sm:w-36 h-48 bg-[#ffffff] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative rotate-[-1deg]">
                <img
                  src={currentlyReading.coverImage}
                  alt={currentlyReading.title}
                  className="w-full h-full object-cover grayscale-[15%] contrast-[110%]"
                  referrerPolicy="no-referrer"
                />

                {isAdminUnlocked && (
                  <div 
                    onClick={() => setQuickImageTarget('primary')}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 cursor-pointer text-white text-center"
                  >
                    <Camera size={20} className="mb-1 text-[#e8e2d8]" />
                    <span className="font-sans text-[10px] uppercase font-black tracking-wider">
                      Replace Cover
                    </span>
                  </div>
                )}

                <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-black text-white px-1 font-bold">
                  ACTIVE
                </span>
              </div>
            </div>

            {isAdminUnlocked && (
              <button
                type="button"
                onClick={() => setQuickImageTarget('primary')}
                className="mt-2 text-[10px] font-sans font-bold uppercase tracking-wider text-[#8b0000] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Camera size={11} />
                <span>Change Cover</span>
              </button>
            )}
          </div>

          {/* Book Info & Editorial Progress Bar */}
          <div className="md:col-span-9 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-sans font-bold text-[#8b0000] uppercase tracking-wider mb-1">
                <span>{(currentlyReading.genre || 'Thriller').toUpperCase()}</span>
                {currentlyReading.startDate && (
                  <>
                    <span>•</span>
                    <span>STARTED: {currentlyReading.startDate}</span>
                  </>
                )}
              </div>
              <h4 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] font-serif uppercase tracking-tight">
                {currentlyReading.title}
              </h4>
              <p className="font-serif italic text-base text-[#4a4a4a]">
                By {currentlyReading.author}
              </p>
            </div>

            {/* Editorial Segmented Progress Bar */}
            <div className="bg-white p-3.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
              <div className="flex flex-wrap justify-between text-xs font-sans font-bold uppercase tracking-wider text-[#1a1a1a] mb-2">
                <span>
                  Progress: Page {currentlyReading.currentPage} / {currentlyReading.totalPages}
                </span>
                <span className="text-[#8b0000]">
                  {primaryProgressPercentage}% Completed
                </span>
              </div>
              
              <div className="h-4 border border-black p-[2px] bg-white">
                <div 
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${primaryProgressPercentage}%` }}
                />
              </div>
            </div>

            {/* Current Theory / Marginalia */}
            <div className="bg-[#fffef7] border-l-4 border-[#8b0000] p-3 border border-black border-opacity-20 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)]">
              <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#8b0000] block mb-1">
                CURRENT WORKING THEORY & MARGINALIA:
              </span>
              <p className="font-serif italic text-sm sm:text-base text-[#1a1a1a] leading-snug">
                “{currentlyReading.currentTheory}”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dedicated Non-Thriller & Literature Reading Section */}
      {hasNonThriller && (
        <div className="bg-[#fcfaf2] border-2 border-black p-5 sm:p-6 relative rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-black pb-3 mb-5 gap-2">
            <div className="flex items-center gap-2">
              <Bookmark className="text-[#8b0000]" size={16} />
              <div>
                <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#8b0000] block">
                  PARALLEL LITERATURE • GENERAL READING DESK
                </span>
                <h3 className="text-base sm:text-lg font-black font-serif uppercase tracking-tight text-[#1a1a1a]">
                  CURRENT NON-THRILLER & COMPANION READ
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase font-bold border border-black bg-white px-2 py-0.5">
                OFF-DUTY DISPATCH
              </span>
              {isAdminUnlocked && (
                <button
                  onClick={() => setIsCurrentlyReadingModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-sans font-bold uppercase text-[#8b0000] hover:underline cursor-pointer ml-2"
                >
                  <Edit3 size={11} />
                  <span>Edit Non-Thriller</span>
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Non-Thriller Cover */}
            <div className="md:col-span-3 flex flex-col items-center justify-center">
              <div className="relative group">
                <div className="w-32 sm:w-36 h-48 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative rotate-[1deg]">
                  <img
                    src={currentlyReading.nonThrillerCoverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                    alt={currentlyReading.nonThrillerTitle || 'Non-Thriller Book'}
                    className="w-full h-full object-cover contrast-[105%]"
                    referrerPolicy="no-referrer"
                  />

                  {isAdminUnlocked && (
                    <div 
                      onClick={() => setQuickImageTarget('nonThriller')}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 cursor-pointer text-white text-center"
                    >
                      <Camera size={20} className="mb-1 text-white" />
                      <span className="font-sans text-[10px] uppercase font-black tracking-wider">
                        Replace Cover
                      </span>
                    </div>
                  )}

                  <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-[#8b0000] text-white px-1 font-bold">
                    COMPANION
                  </span>
                </div>
              </div>

              {isAdminUnlocked && (
                <button
                  type="button"
                  onClick={() => setQuickImageTarget('nonThriller')}
                  className="mt-2 text-[10px] font-sans font-bold uppercase tracking-wider text-black hover:text-[#8b0000] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Camera size={11} />
                  <span>Change Cover</span>
                </button>
              )}
            </div>

            {/* Non-Thriller Details & Personal Reflections */}
            <div className="md:col-span-9 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-sans font-bold text-gray-700 uppercase tracking-wider mb-1">
                  <span className="bg-[#8b0000] text-white px-1.5 py-0.5 text-[10px]">
                    {currentlyReading.nonThrillerGenre || 'LITERATURE'}
                  </span>
                  {currentlyReading.nonThrillerStartDate && (
                    <>
                      <span>•</span>
                      <span>STARTED: {currentlyReading.nonThrillerStartDate}</span>
                    </>
                  )}
                </div>
                <h4 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] font-serif uppercase tracking-tight">
                  {currentlyReading.nonThrillerTitle}
                </h4>
                <p className="font-serif italic text-base text-[#4a4a4a]">
                  By {currentlyReading.nonThrillerAuthor}
                </p>
              </div>

              {/* Progress Bar for Non-Thriller if pages provided */}
              {(currentlyReading.nonThrillerTotalPages || 0) > 0 && (
                <div className="bg-white p-3.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
                  <div className="flex flex-wrap justify-between text-xs font-sans font-bold uppercase tracking-wider text-[#1a1a1a] mb-2">
                    <span>
                      Reading Progress: Page {currentlyReading.nonThrillerCurrentPage || 0} / {currentlyReading.nonThrillerTotalPages}
                    </span>
                    <span className="text-[#8b0000]">
                      {nonThrillerProgressPercentage}% Read
                    </span>
                  </div>
                  
                  <div className="h-3 border border-black p-[1px] bg-white">
                    <div 
                      className="h-full bg-[#8b0000] transition-all duration-300"
                      style={{ width: `${nonThrillerProgressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Thoughts on this non-thriller */}
              <div className="bg-white border-l-4 border-black p-4 border border-black/20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={12} className="text-[#8b0000]" />
                  <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#1a1a1a]">
                    WHAT I'M THINKING ABOUT THIS BOOK:
                  </span>
                </div>
                <p className="font-serif text-sm sm:text-base text-[#1a1a1a] leading-relaxed italic">
                  “{currentlyReading.nonThrillerThoughts || 'Currently immersing myself in the ideas, prose, and structure of this volume alongside my thriller investigations.'}”
                </p>
                {currentlyReading.nonThrillerNotes && (
                  <div className="mt-3 pt-2 border-t border-dashed border-gray-300 text-xs font-sans text-[#4a4a4a]">
                    <span className="font-bold text-[10px] uppercase text-gray-500 mr-2">Key Observation:</span>
                    <span>{currentlyReading.nonThrillerNotes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Image Replacement Modal */}
      <QuickImageModal
        isOpen={quickImageTarget !== null}
        onClose={() => setQuickImageTarget(null)}
        targetType="currentlyReading"
        initialImage={
          quickImageTarget === 'primary' 
            ? currentlyReading.coverImage 
            : (currentlyReading.nonThrillerCoverImage || '')
        }
        onSaveImage={handleUpdateCover}
        title={
          quickImageTarget === 'primary'
            ? `Change Cover for Primary Read: ${currentlyReading.title}`
            : `Change Cover for Non-Thriller: ${currentlyReading.nonThrillerTitle || 'Book'}`
        }
      />
    </section>
  );
};

