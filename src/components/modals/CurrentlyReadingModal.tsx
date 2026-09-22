import React, { useState, useEffect } from 'react';
import { useJournal } from '../../context/JournalContext';
import { CurrentlyReading } from '../../types';
import { BookOpen } from 'lucide-react';
import { ImageUploader } from '../common/ImageUploader';

export const CurrentlyReadingModal: React.FC = () => {
  const { currentlyReading, updateCurrentlyReading, isCurrentlyReadingModalOpen, setIsCurrentlyReadingModalOpen } = useJournal();

  const [form, setForm] = useState<CurrentlyReading>({ ...currentlyReading });
  const [suspectInput, setSuspectInput] = useState<string>(currentlyReading.suspectsNoted?.join(', ') || '');

  useEffect(() => {
    if (isCurrentlyReadingModalOpen) {
      setForm({ ...currentlyReading });
      setSuspectInput(currentlyReading.suspectsNoted?.join(', ') || '');
    }
  }, [isCurrentlyReadingModalOpen, currentlyReading]);

  if (!isCurrentlyReadingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSuspects = suspectInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    updateCurrentlyReading({
      ...form,
      suspectsNoted: parsedSuspects,
    });
    setIsCurrentlyReadingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-black w-full max-w-xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[#8b0000]" size={20} />
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-bold tracking-widest block">
                ACTIVE SURVEILLANCE
              </span>
              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase font-serif">
                UPDATE CURRENT CASE
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsCurrentlyReadingModalOpen(false)}
            className="p-1 hover:bg-[#e8e2d8] text-black font-sans font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Book Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-white border border-black p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Author *</label>
              <input
                type="text"
                required
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full bg-white border border-black p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Current Page</label>
              <input
                type="number"
                value={form.currentPage}
                onChange={(e) => setForm({ ...form, currentPage: Number(e.target.value) })}
                className="w-full bg-white border border-black p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Total Pages</label>
              <input
                type="number"
                value={form.totalPages}
                onChange={(e) => setForm({ ...form, totalPages: Number(e.target.value) })}
                className="w-full bg-white border border-black p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              label="Currently Reading Book Cover Photo"
              value={form.coverImage}
              onChange={(newUrl) => setForm({ ...form, coverImage: newUrl })}
            />
          </div>

          <div>
            <label className="block text-[#8b0000] font-bold mb-1 uppercase text-[10px]">Current Working Theory</label>
            <textarea
              rows={3}
              value={form.currentTheory}
              onChange={(e) => setForm({ ...form, currentTheory: e.target.value })}
              placeholder="What do you think is actually going on?"
              className="w-full bg-white border border-black p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Suspects Under Observation (comma-separated)</label>
            <input
              type="text"
              value={suspectInput}
              onChange={(e) => setSuspectInput(e.target.value)}
              placeholder="The Butler, The Physician, The Next Door Neighbor"
              className="w-full bg-white border border-black p-2 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black">
            <button
              type="button"
              onClick={() => setIsCurrentlyReadingModalOpen(false)}
              className="px-4 py-2 text-[#4a4a4a] uppercase font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black hover:bg-[#8b0000] text-white px-6 py-2 uppercase font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-colors"
            >
              UPDATE CASE PROGRESS
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

