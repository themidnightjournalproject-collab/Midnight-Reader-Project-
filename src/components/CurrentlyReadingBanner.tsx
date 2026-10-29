import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Edit3, Camera, BookOpen, Bookmark, Sparkles, PlusCircle, CheckCircle, Trash2 } from 'lucide-react';
import { QuickImageModal } from './modals/QuickImageModal';

export const CurrentlyReadingBanner: React.FC = () => {
  const { 
    currentlyReading, 
    updateCurrentlyReading, 
    setIsCurrentlyReadingModalOpen, 
    openCompleteAndArchive,
    removeBookFromCurrentReads,
    isAdminUnlocked 
  } = useJournal();
  
  const [quickImageTarget, setQuickImageTarget] = useState<'primary' | 'nonThriller' | string | null>(null);

  const hasPrimary = Boolean(currentlyReading.title && currentlyReading.title.trim().length > 0);

  const primaryProgressPercentage = Math.min(
    100,
    Math.max(0, Math.round((currentlyReading.currentPage / (currentlyReading.totalPages || 1)) * 100))
  );

  const hasNonThriller = (currentlyReading.showNonThriller ?? true) && Boolean(currentlyReading.nonThrillerTitle && currentlyReading.nonThrillerTitle.trim().length > 0);

  const nonThrillerProgressPercentage = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((currentlyReading.nonThrillerCurrentPage || 0) / (currentlyReading.nonThrillerTotalPages || 1)) * 100
      )
    )
  );

  const additionalBooks = currentlyReading.additionalBooks || [];

  const handleUpdateCover = (newImageUrl: string) => {
    if (quickImageTarget === 'primary') {
      updateCurrentlyReading({ coverImage: newImageUrl });
    } else if (quickImageTarget === 'nonThriller') {
      updateCurrentlyReading({ nonThrillerCoverImage: newImageUrl });
    } else if (typeof quickImageTarget === 'string') {
      // It's an additional book ID
      const updatedList = additionalBooks.map((b) => (b.id === quickImageTarget ? { ...b, coverImage: newImageUrl } : b));
      updateCurrentlyReading({ additionalBooks: updatedList });
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
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-add-currently-reading"
                onClick={() => setIsCurrentlyReadingModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider bg-black hover:bg-[#8b0000] text-white px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
                title="Add another book to current reads"
              >
                <PlusCircle size={13} />
                <span>+ Add to Current Reads</span>
              </button>

              {hasPrimary && (
                <button
                  type="button"
                  onClick={() => {
                    openCompleteAndArchive({
                      bookType: 'primary',
                      title: currentlyReading.title,
                      author: currentlyReading.author,
                      genre: currentlyReading.genre,
                      coverImage: currentlyReading.coverImage,
                      totalPages: currentlyReading.totalPages,
                      currentPage: currentlyReading.currentPage,
                      notes: currentlyReading.currentTheory,
                      startDate: currentlyReading.startDate,
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider bg-[#166534] hover:bg-black text-white px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
                  title="Mark finished and move to Archive"
                >
                  <CheckCircle size={13} />
                  <span>Move to Archive</span>
                </button>
              )}

              <button
                id="btn-edit-currently-reading"
                onClick={() => setIsCurrentlyReadingModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#4a4a4a] hover:text-[#8b0000] hover:underline cursor-pointer"
                title="Update reading progress, thoughts, or parallel book"
              >
                <Edit3 size={12} />
                <span>Update Progress</span>
              </button>
            </div>
          )}
        </div>

        {hasPrimary ? (
          /* Content Layout */
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
        ) : (
          <div className="py-8 text-center space-y-3">
            <p className="font-serif italic text-base text-[#555]">
              No active primary read currently assigned to this desk.
            </p>
            {isAdminUnlocked && (
              <button
                onClick={() => setIsCurrentlyReadingModalOpen(true)}
                className="bg-black text-white hover:bg-[#8b0000] px-4 py-2 text-xs font-bold uppercase transition-colors"
              >
                + Assign Book to Current Reads
              </button>
            )}
          </div>
        )}
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      openCompleteAndArchive({
                        bookType: 'companion',
                        title: currentlyReading.nonThrillerTitle || '',
                        author: currentlyReading.nonThrillerAuthor || '',
                        genre: currentlyReading.nonThrillerGenre || 'Other Literature',
                        coverImage: currentlyReading.nonThrillerCoverImage || '',
                        totalPages: currentlyReading.nonThrillerTotalPages || currentlyReading.nonThrillerCurrentPage || 0,
                        currentPage: currentlyReading.nonThrillerCurrentPage || 0,
                        notes: currentlyReading.nonThrillerThoughts || currentlyReading.nonThrillerNotes || '',
                        startDate: currentlyReading.nonThrillerStartDate,
                      });
                    }}
                    className="flex items-center gap-1 text-xs font-sans font-bold uppercase bg-[#166534] hover:bg-black text-white px-2.5 py-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
                    title="Mark complete and move to Archive"
                  >
                    <CheckCircle size={12} />
                    <span>Move to Archive</span>
                  </button>
                  <button
                    onClick={() => setIsCurrentlyReadingModalOpen(true)}
                    className="flex items-center gap-1 text-[11px] font-sans font-bold uppercase text-[#8b0000] hover:underline cursor-pointer ml-1"
                  >
                    <Edit3 size={11} />
                    <span>Edit</span>
                  </button>
                </div>
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

      {/* 3. Additional Ongoing Books on the Reading Desk */}
      {additionalBooks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full" />
              <h3 className="text-xs font-sans font-black uppercase tracking-widest text-[#1a1a1a]">
                Parallel Reading Dossiers ({additionalBooks.length})
              </h3>
            </div>
            {isAdminUnlocked && (
              <button
                onClick={() => setIsCurrentlyReadingModalOpen(true)}
                className="text-xs font-sans font-bold uppercase text-[#8b0000] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle size={12} />
                <span>+ Add Another</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalBooks.map((b) => {
              const pct = Math.min(100, Math.round(((b.currentPage || 0) / (b.totalPages || 1)) * 100));
              return (
                <div 
                  key={b.id} 
                  className="bg-[#fcfaf2] border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative group shrink-0">
                      <img
                        src={b.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'}
                        alt={b.title}
                        className="w-20 h-28 object-cover border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        referrerPolicy="no-referrer"
                      />
                      {isAdminUnlocked && (
                        <div
                          onClick={() => setQuickImageTarget(b.id)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 cursor-pointer text-white text-center text-[9px] font-sans uppercase font-bold"
                        >
                          <Camera size={14} className="mb-0.5" />
                          <span>Cover</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 overflow-hidden flex-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold text-[#8b0000] uppercase">
                        <span>{b.genre || 'BOOK'}</span>
                        {b.startDate && <span>• {b.startDate}</span>}
                      </div>
                      <h4 className="font-serif font-black text-lg text-black uppercase leading-tight truncate">
                        {b.title}
                      </h4>
                      <p className="font-serif italic text-xs text-[#4a4a4a]">
                        By {b.author}
                      </p>

                      <div className="pt-2">
                        <div className="flex justify-between text-[10px] font-sans font-bold uppercase mb-1">
                          <span>Page {b.currentPage} / {b.totalPages}</span>
                          <span className="text-[#8b0000]">{pct}%</span>
                        </div>
                        <div className="h-2 border border-black p-[1px] bg-white">
                          <div 
                            className="h-full bg-black"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {(b.currentTheory || b.thoughts || b.notes) && (
                    <div className="bg-[#fffef7] border-l-2 border-[#8b0000] p-2 text-xs font-serif italic text-gray-800">
                      “{b.currentTheory || b.thoughts || b.notes}”
                    </div>
                  )}

                  {isAdminUnlocked && (
                    <div className="flex items-center justify-between pt-2 border-t border-black/20 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          openCompleteAndArchive({
                            bookType: 'additional',
                            additionalBookId: b.id,
                            title: b.title,
                            author: b.author,
                            genre: b.genre,
                            coverImage: b.coverImage,
                            totalPages: b.totalPages,
                            currentPage: b.currentPage,
                            notes: b.currentTheory || b.thoughts || b.notes || '',
                            startDate: b.startDate,
                          });
                        }}
                        className="bg-[#166534] hover:bg-black text-white px-2.5 py-1 font-sans font-bold uppercase text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Mark complete and move to Archive"
                      >
                        <CheckCircle size={12} />
                        <span>Move to Archive</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeBookFromCurrentReads(b.id)}
                        className="text-gray-400 hover:text-red-700 p-1 cursor-pointer"
                        title="Remove from desk"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
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
            : quickImageTarget === 'nonThriller'
            ? (currentlyReading.nonThrillerCoverImage || '')
            : (additionalBooks.find((b) => b.id === quickImageTarget)?.coverImage || '')
        }
        onSaveImage={handleUpdateCover}
        title="Change Book Cover Photo"
      />
    </section>
  );
};
