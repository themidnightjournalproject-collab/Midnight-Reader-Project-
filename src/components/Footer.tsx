import React from 'react';
import { useJournal } from '../context/JournalContext';
import { RotateCcw, KeyRound, Lock, Unlock, BarChart2, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    resetToDefaults, 
    setActiveView, 
    setSelectedReview, 
    isAdminUnlocked, 
    setIsAdminModalOpen,
    lockAdmin 
  } = useJournal();

  return (
    <footer className="w-full border-t-2 border-black mt-16 bg-[#f5f2ed] pt-10 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Newspaper Colophon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-black text-xs font-sans">
          
          {/* Masthead Colophon */}
          <div className="md:col-span-5 space-y-2">
            <h4 className="font-serif text-2xl font-black text-[#1a1a1a] uppercase tracking-wider">
              THE MIDNIGHT READER
            </h4>
            <p className="font-serif text-sm text-[#4a4a4a] italic">
              A private, non-commercial reading log dedicated to unraveling fictional crimes, locked-room paradoxes, and the delightful deceit of unreliable narrators.
            </p>
            <p className="text-[#737373] text-[11px] pt-1 font-mono">
              Printed on archival rag paper. All alibis remain uncorroborated until further notice.
            </p>
          </div>

          {/* Quick Sections Navigation */}
          <div className="md:col-span-4 space-y-2">
            <span className="font-bold text-[#1a1a1a] uppercase tracking-widest block mb-2 text-xs">
              DISPATCH DIRECTORY
            </span>
            <div className="grid grid-cols-2 gap-2 text-[#4a4a4a] text-xs">
              <button 
                onClick={() => { setSelectedReview(null); setActiveView('journal'); }}
                className="text-left hover:text-[#8b0000] hover:underline uppercase"
              >
                • Case Files / Journal
              </button>
              <button 
                onClick={() => { setSelectedReview(null); setActiveView('non-fiction'); }}
                className="text-left hover:text-[#8b0000] hover:underline uppercase"
              >
                • Research & Literature
              </button>
              <button 
                onClick={() => { setSelectedReview(null); setActiveView('currently-reading'); }}
                className="text-left hover:text-[#8b0000] hover:underline uppercase"
              >
                • Current Case
              </button>
              <button 
                onClick={() => { setSelectedReview(null); setActiveView('suspect-board'); }}
                className="text-left hover:text-[#8b0000] hover:underline uppercase"
              >
                • Suspect Board
              </button>
              <button 
                onClick={() => { setSelectedReview(null); setActiveView('timeline'); }}
                className="text-left hover:text-[#8b0000] hover:underline uppercase"
              >
                • Timeline
              </button>
              <button 
                onClick={() => { setSelectedReview(null); setActiveView('analytics'); }}
                className="text-left hover:text-[#8b0000] hover:underline uppercase flex items-center gap-1 font-bold text-[#8b0000]"
              >
                • Reader Intel
              </button>
              <button 
                onClick={() => { setSelectedReview(null); setActiveView('stats'); }}
                className="text-left hover:text-[#8b0000] hover:underline uppercase"
              >
                • Stats
              </button>
              <button 
                onClick={() => { setSelectedReview(null); setActiveView('about'); }}
                className="text-left hover:text-[#8b0000] hover:underline uppercase"
              >
                • About
              </button>
            </div>
          </div>

          {/* Archive Maintenance & Security Desk */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-bold text-[#1a1a1a] uppercase tracking-widest block mb-2 text-xs">
              EDITORIAL SECURITY
            </span>
            <p className="text-[#4a4a4a] text-[11px]">
              {isAdminUnlocked ? (
                <span className="text-[#8b0000] font-bold">
                  Chief Investigator Clearance Active. Full editing permissions enabled.
                </span>
              ) : (
                <span>
                  Public visitor mode active. Case reviews & endorsements are open to explore.
                </span>
              )}
            </p>
            
            <div className="pt-2 flex flex-col gap-2">
              {isAdminUnlocked ? (
                <>
                  <button
                    onClick={() => setIsAdminModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#1a1a1a] hover:text-[#8b0000] font-mono font-bold"
                  >
                    <ShieldCheck size={13} className="text-[#8b0000]" />
                    <span>Chief Investigator Settings</span>
                  </button>
                  <button
                    onClick={resetToDefaults}
                    className="inline-flex items-center gap-1 text-[11px] text-[#737373] hover:text-[#8b0000] underline font-mono"
                  >
                    <RotateCcw size={12} />
                    <span>Reset To Default Records</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#4a4a4a] hover:text-[#8b0000] underline font-mono"
                >
                  <KeyRound size={12} />
                  <span>Chief Investigator Login</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-wrap items-center justify-between text-[11px] font-sans text-[#737373] gap-2">
          <span className="uppercase tracking-wider">
            © {new Date().getFullYear()} THE MIDNIGHT READER • CASE ARCHIVE DEPT.
          </span>
          <span className="italic font-serif text-xs text-[#4a4a4a]">
            “Sleep is temporary. Plot twists are forever.”
          </span>
        </div>

      </div>
    </footer>
  );
};
