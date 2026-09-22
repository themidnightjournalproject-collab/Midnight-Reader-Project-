import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import { ReadingStats } from '../../types';
import { BarChart3 } from 'lucide-react';

export const StatsEditorModal: React.FC = () => {
  const { stats, updateStats, isStatsEditorOpen, setIsStatsEditorOpen } = useJournal();

  const [formStats, setFormStats] = useState<ReadingStats>({ ...stats });

  if (!isStatsEditorOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStats(formStats);
    setIsStatsEditorOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-black w-full max-w-xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-[#8b0000]" size={20} />
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-bold tracking-widest block">
                ANNUAL AUDIT
              </span>
              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase font-serif">
                EDIT READING STATISTICS
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsStatsEditorOpen(false)}
            className="p-1 hover:bg-[#e8e2d8] text-black font-sans font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Books Read</label>
              <input
                type="number"
                value={formStats.booksRead}
                onChange={(e) => setFormStats({ ...formStats, booksRead: Number(e.target.value) })}
                className="w-full bg-white border border-black p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Thrillers Read</label>
              <input
                type="number"
                value={formStats.thrillersRead}
                onChange={(e) => setFormStats({ ...formStats, thrillersRead: Number(e.target.value) })}
                className="w-full bg-white border border-black p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Suspects Accused</label>
              <input
                type="number"
                value={formStats.suspectsAccused}
                onChange={(e) => setFormStats({ ...formStats, suspectsAccused: Number(e.target.value) })}
                className="w-full bg-white border border-black p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Correct Guesses</label>
              <input
                type="number"
                value={formStats.correctGuesses}
                onChange={(e) => setFormStats({ ...formStats, correctGuesses: Number(e.target.value) })}
                className="w-full bg-white border border-black p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Cups of Tea / Coffee</label>
              <input
                type="number"
                value={formStats.cupsOfTeaDrank}
                onChange={(e) => setFormStats({ ...formStats, cupsOfTeaDrank: Number(e.target.value) })}
                className="w-full bg-white border border-black p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Severe Plot Twists</label>
              <input
                type="number"
                value={formStats.plotTwistsExperienced}
                onChange={(e) => setFormStats({ ...formStats, plotTwistsExperienced: Number(e.target.value) })}
                className="w-full bg-white border border-black p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Favorite Book of the Year</label>
            <input
              type="text"
              value={formStats.favoriteBook}
              onChange={(e) => setFormStats({ ...formStats, favoriteBook: e.target.value })}
              className="w-full bg-white border border-black p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Longest Book Read</label>
            <input
              type="text"
              value={formStats.longestBook}
              onChange={(e) => setFormStats({ ...formStats, longestBook: e.target.value })}
              className="w-full bg-white border border-black p-2 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black">
            <button
              type="button"
              onClick={() => setIsStatsEditorOpen(false)}
              className="px-4 py-2 text-[#4a4a4a] uppercase font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black hover:bg-[#8b0000] text-white px-6 py-2 uppercase font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-colors"
            >
              SAVE METRICS
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

