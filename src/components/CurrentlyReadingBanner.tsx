import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Edit3, Camera } from 'lucide-react';
import { QuickImageModal } from './modals/QuickImageModal';

export const CurrentlyReadingBanner: React.FC = () => {
  const { currentlyReading, updateCurrentlyReading, setIsCurrentlyReadingModalOpen, isAdminUnlocked } = useJournal();
  const [isQuickImageOpen, setIsQuickImageOpen] = useState(false);

  const progressPercentage = Math.min(
    100,
    Math.max(0, Math.round((currentlyReading.currentPage / (currentlyReading.totalPages || 1)) * 100))
  );

  const handleUpdateCover = (newImageUrl: string) => {
    updateCurrentlyReading({ coverImage: newImageUrl });
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-4">
      <div className="bg-[#e8e2d8] border border-black border-opacity-30 p-5 sm:p-6 relative rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]">
        
        {/* Top Header & Stamp */}
        <div className="flex flex-wrap items-center justify-between border-b border-black border-opacity-20 pb-3 mb-5 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#8b0000] rounded-full animate-pulse inline-block" />
            <h3 className="text-xs font-sans font-black uppercase tracking-widest text-[#1a1a1a]">
              Current Case Under Investigation
            </h3>
          </div>

          {isAdminUnlocked && (
            <button
              id="btn-edit-currently-reading"
              onClick={() => setIsCurrentlyReadingModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#4a4a4a] hover:text-[#8b0000] hover:underline"
              title="Update reading progress or theory"
            >
              <Edit3 size={12} />
              <span>Update Progress</span>
            </button>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Book Cover Photo / Evidence */}
          <div className="md:col-span-3 flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="w-32 sm:w-36 h-48 bg-[#ffffff] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative rotate-[-1deg]">
                <img
                  src={currentlyReading.coverImage}
                  alt={currentlyReading.title}
                  className="w-full h-full object-cover grayscale-[20%] contrast-[110%]"
                  referrerPolicy="no-referrer"
                />

                {/* Quick Replace Hover Overlay - only for unlocked admin */}
                {isAdminUnlocked && (
                  <div 
                    onClick={() => setIsQuickImageOpen(true)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 cursor-pointer text-white text-center"
                  >
                    <Camera size={20} className="mb-1 text-[#e8e2d8]" />
                    <span className="font-sans text-[10px] uppercase font-black tracking-wider">
                      Replace Cover
                    </span>
                  </div>
                )}

                <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-black text-white px-1 font-bold">
                  CASE #{currentlyReading.id || 'ACTIVE'}
                </span>
              </div>
            </div>

            {/* Change cover button - only for unlocked admin */}
            {isAdminUnlocked && (
              <button
                type="button"
                onClick={() => setIsQuickImageOpen(true)}
                className="mt-2 text-[10px] font-sans font-bold uppercase tracking-wider text-[#8b0000] hover:underline flex items-center gap-1"
              >
                <Camera size={11} />
                <span>Change Cover Image</span>
              </button>
            )}
          </div>

          {/* Book Info & Editorial Progress Bar */}
          <div className="md:col-span-9 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-sans font-bold text-[#8b0000] uppercase tracking-wider mb-1">
                <span>{currentlyReading.genre.toUpperCase()}</span>
                <span>•</span>
                <span>STARTED: {currentlyReading.startDate}</span>
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
                  {progressPercentage}% Completed
                </span>
              </div>
              
              <div className="h-4 border border-black p-[2px] bg-white">
                <div 
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Current Theory / Marginalia */}
            <div className="bg-[#fffef7] border-l-4 border-[#8b0000] p-3 border border-black border-opacity-20">
              <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#8b0000] block mb-1">
                CURRENT WORKING THEORY:
              </span>
              <p className="font-serif italic text-base text-[#1a1a1a] leading-snug">
                “{currentlyReading.currentTheory}”
              </p>
            </div>

            {/* Suspects under observation chips */}
            {currentlyReading.suspectsNoted && currentlyReading.suspectsNoted.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-sans">
                <span className="text-[#737373] uppercase font-bold text-[10px] tracking-wider">Under Surveillance:</span>
                {currentlyReading.suspectsNoted.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-black px-2 py-0.5 text-[#1a1a1a] font-bold text-[11px]"
                  >
                    • {s}
                  </span>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Quick Image Replacement Modal for Currently Reading */}
      <QuickImageModal
        isOpen={isQuickImageOpen}
        onClose={() => setIsQuickImageOpen(false)}
        targetType="currentlyReading"
        initialImage={currentlyReading.coverImage}
        onSaveImage={handleUpdateCover}
        title={`Change Cover Image for Active Case: ${currentlyReading.title}`}
      />
    </section>
  );
};

