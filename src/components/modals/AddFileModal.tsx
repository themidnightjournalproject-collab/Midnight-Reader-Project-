import React from 'react';
import { useJournal } from '../../context/JournalContext';
import { FolderPlus, BookOpen, Bookmark, ShieldAlert, Sparkles, PlusCircle } from 'lucide-react';

export const AddFileModal: React.FC = () => {
  const { 
    isAddFileModalOpen, 
    setIsAddFileModalOpen, 
    setIsNewReviewModalOpen, 
    setIsNewNonFictionModalOpen, 
    setIsCurrentlyReadingModalOpen 
  } = useJournal();

  if (!isAddFileModalOpen) return null;

  const handleOpenCase = () => {
    setIsAddFileModalOpen(false);
    setIsNewReviewModalOpen(true);
  };

  const handleOpenOffTheRecord = () => {
    setIsAddFileModalOpen(false);
    setIsNewNonFictionModalOpen(true);
  };

  const handleOpenCurrentRead = () => {
    setIsAddFileModalOpen(false);
    setIsCurrentlyReadingModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-[#fcfaf2] border-4 border-black w-full max-w-xl p-6 sm:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8b0000] text-white flex items-center justify-center border-2 border-black">
              <FolderPlus size={20} />
            </div>
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-black tracking-widest block">
                CHIEF INVESTIGATOR • FILING BUREAU
              </span>
              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase font-serif tracking-tight">
                ADD A NEW FILE TO THE JOURNAL
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsAddFileModalOpen(false)}
            className="p-1.5 hover:bg-[#e8e2d8] text-black font-sans font-bold text-lg cursor-pointer border border-transparent hover:border-black"
          >
            ✕
          </button>
        </div>

        <p className="font-serif italic text-sm text-[#4a4a4a] mb-6">
          Select what classification of book record you want to file today:
        </p>

        {/* 3 Filing Options */}
        <div className="space-y-4 font-sans">
          
          {/* Option 1: Crime Case File (Thriller Archive) */}
          <button
            type="button"
            onClick={handleOpenCase}
            className="w-full text-left bg-white hover:bg-[#fffdf5] border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all group cursor-pointer block"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-black text-white group-hover:bg-[#8b0000] transition-colors shrink-0 mt-0.5">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif font-black text-lg text-black group-hover:text-[#8b0000] uppercase">
                      1. New Crime Case File
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-[#8b0000] text-white px-1.5 py-0.5 font-bold">
                      ARCHIVE
                    </span>
                  </div>
                  <p className="text-xs text-[#555] font-serif leading-relaxed">
                    File a completed psychological thriller, detective case review, suspect interrogation dossier, clue evidence, and classified spoilers.
                  </p>
                </div>
              </div>
              <PlusCircle size={18} className="text-[#8b0000] shrink-0 mt-1" />
            </div>
          </button>

          {/* Option 2: Off the Record Dossier */}
          <button
            type="button"
            onClick={handleOpenOffTheRecord}
            className="w-full text-left bg-white hover:bg-[#fffdf5] border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all group cursor-pointer block"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#2c2724] text-[#fcfaf2] group-hover:bg-[#8b0000] transition-colors shrink-0 mt-0.5">
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif font-black text-lg text-black group-hover:text-[#8b0000] uppercase">
                      2. Off the Record Dossier
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-black text-white px-1.5 py-0.5 font-bold">
                      OFF-DUTY
                    </span>
                  </div>
                  <p className="text-xs text-[#555] font-serif leading-relaxed">
                    Log an unclassified volume read outside crime fiction: philosophy, deep memoirs, speculative sci-fi, science, or psychology with mental takeaways.
                  </p>
                </div>
              </div>
              <PlusCircle size={18} className="text-[#8b0000] shrink-0 mt-1" />
            </div>
          </button>

          {/* Option 3: Add to Current Reads */}
          <button
            type="button"
            onClick={handleOpenCurrentRead}
            className="w-full text-left bg-[#f2ede4] hover:bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all group cursor-pointer block"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#8b0000] text-white group-hover:bg-black transition-colors shrink-0 mt-0.5">
                  <Bookmark size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif font-black text-lg text-black group-hover:text-[#8b0000] uppercase">
                      3. New Current Read
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-[#166534] text-white px-1.5 py-0.5 font-bold">
                      ACTIVE DESK
                    </span>
                  </div>
                  <p className="text-xs text-[#555] font-serif leading-relaxed">
                    Place a new book on your active reading desk. Track daily page count, working suspect theories, and move it straight to the archive once finished!
                  </p>
                </div>
              </div>
              <PlusCircle size={18} className="text-[#8b0000] shrink-0 mt-1" />
            </div>
          </button>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-black flex justify-end">
          <button
            type="button"
            onClick={() => setIsAddFileModalOpen(false)}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#4a4a4a] hover:text-black cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
