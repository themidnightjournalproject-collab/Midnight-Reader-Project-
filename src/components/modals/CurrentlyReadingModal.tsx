import React, { useState, useEffect } from 'react';
import { useJournal } from '../../context/JournalContext';
import { CurrentlyReading } from '../../types';
import { BookOpen, Sparkles, Bookmark } from 'lucide-react';
import { ImageUploader } from '../common/ImageUploader';

const GENRE_SUGGESTIONS = [
  'Psychological Thriller',
  'Murder Mystery',
  'Domestic Thriller',
  'Sci-Fi & Speculative Fiction',
  'Literary Fiction',
  'Philosophy & Mindset',
  'Memoir & Biography',
  'Psychology & Human Nature',
  'History & Social Studies',
  'Classics & Literature',
  'True Crime & Forensics',
  'Science & Technology'
];

export const CurrentlyReadingModal: React.FC = () => {
  const { currentlyReading, updateCurrentlyReading, isCurrentlyReadingModalOpen, setIsCurrentlyReadingModalOpen } = useJournal();

  const [form, setForm] = useState<CurrentlyReading>({ ...currentlyReading });
  const [suspectInput, setSuspectInput] = useState<string>(currentlyReading.suspectsNoted?.join(', ') || '');
  const [activeTab, setActiveTab] = useState<'primary' | 'nonThriller'>('primary');

  useEffect(() => {
    if (isCurrentlyReadingModalOpen) {
      setForm({
        ...currentlyReading,
        showNonThriller: currentlyReading.showNonThriller ?? true,
      });
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
      <div className="bg-white border-2 border-black w-full max-w-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[#8b0000]" size={20} />
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-bold tracking-widest block">
                CURRENT READING DESK
              </span>
              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase font-serif">
                UPDATE CURRENT READS
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsCurrentlyReadingModalOpen(false)}
            className="p-1 hover:bg-[#e8e2d8] text-black font-sans font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-black mb-5 gap-2 font-sans text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('primary')}
            className={`px-4 py-2 font-bold uppercase transition-colors border-t border-l border-r border-black cursor-pointer ${
              activeTab === 'primary'
                ? 'bg-black text-white'
                : 'bg-[#f5f2ed] text-[#4a4a4a] hover:bg-white'
            }`}
          >
            Primary Current Read
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nonThriller')}
            className={`px-4 py-2 font-bold uppercase transition-colors border-t border-l border-r border-black flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'nonThriller'
                ? 'bg-[#8b0000] text-white'
                : 'bg-[#f5f2ed] text-[#4a4a4a] hover:bg-white'
            }`}
          >
            <Bookmark size={13} />
            <span>Non-Thriller / Parallel Read</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          
          {/* TAB 1: Primary Current Read */}
          {activeTab === 'primary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-white border border-black p-2 text-xs font-bold"
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
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Genre / Category</label>
                  <input
                    type="text"
                    list="primary-genre-list"
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    placeholder="Select or enter genre..."
                    className="w-full bg-white border border-black p-2 text-xs"
                  />
                  <datalist id="primary-genre-list">
                    {GENRE_SUGGESTIONS.map((g) => (
                      <option key={g} value={g} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Date Started</label>
                  <input
                    type="text"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    placeholder="e.g. Feb 12, 2026"
                    className="w-full bg-white border border-black p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Current Page</label>
                  <input
                    type="number"
                    value={form.currentPage}
                    onChange={(e) => setForm({ ...form, currentPage: Number(e.target.value) })}
                    className="w-full bg-white border border-black p-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Total Pages</label>
                  <input
                    type="number"
                    value={form.totalPages}
                    onChange={(e) => setForm({ ...form, totalPages: Number(e.target.value) })}
                    className="w-full bg-white border border-black p-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  label="Primary Book Cover Photo"
                  value={form.coverImage}
                  onChange={(newUrl) => setForm({ ...form, coverImage: newUrl })}
                />
              </div>

              <div>
                <label className="block text-[#8b0000] font-bold mb-1 uppercase text-[10px]">
                  Working Theory / Observations
                </label>
                <textarea
                  rows={3}
                  value={form.currentTheory}
                  onChange={(e) => setForm({ ...form, currentTheory: e.target.value })}
                  placeholder="What are your active deductions or thoughts as you read?"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Key Suspects or Characters Noted (Optional, comma-separated)
                </label>
                <input
                  type="text"
                  value={suspectInput}
                  onChange={(e) => setSuspectInput(e.target.value)}
                  placeholder="The Narrator, The Spouse, The Landlord"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Non-Thriller / Parallel Reading Section */}
          {activeTab === 'nonThriller' && (
            <div className="space-y-4">
              <div className="bg-[#f5f2ed] p-3 border border-black flex items-center justify-between">
                <div>
                  <span className="font-bold text-[10px] uppercase text-[#8b0000] block">
                    Parallel Non-Thriller Reading Desk
                  </span>
                  <p className="text-[11px] text-[#4a4a4a]">
                    Talk about non-thrillers you are currently reading (sci-fi, memoirs, philosophy, general fiction, essays, or science).
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                  <input
                    type="checkbox"
                    checked={form.showNonThriller ?? true}
                    onChange={(e) => setForm({ ...form, showNonThriller: e.target.checked })}
                    className="accent-[#8b0000] w-4 h-4 cursor-pointer"
                  />
                  <span>Display on Desk</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Non-Thriller Title *</label>
                  <input
                    type="text"
                    value={form.nonThrillerTitle || ''}
                    onChange={(e) => setForm({ ...form, nonThrillerTitle: e.target.value })}
                    placeholder="e.g. Dark Matter, Starlight, Man's Search for Meaning"
                    className="w-full bg-white border border-black p-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Author *</label>
                  <input
                    type="text"
                    value={form.nonThrillerAuthor || ''}
                    onChange={(e) => setForm({ ...form, nonThrillerAuthor: e.target.value })}
                    placeholder="e.g. Blake Crouch"
                    className="w-full bg-white border border-black p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Genre / Category</label>
                  <input
                    type="text"
                    list="non-thriller-genre-list"
                    value={form.nonThrillerGenre || ''}
                    onChange={(e) => setForm({ ...form, nonThrillerGenre: e.target.value })}
                    placeholder="e.g. Sci-Fi & Speculative, Memoir, Philosophy..."
                    className="w-full bg-white border border-black p-2 text-xs"
                  />
                  <datalist id="non-thriller-genre-list">
                    {GENRE_SUGGESTIONS.map((g) => (
                      <option key={g} value={g} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Date Started</label>
                  <input
                    type="text"
                    value={form.nonThrillerStartDate || ''}
                    onChange={(e) => setForm({ ...form, nonThrillerStartDate: e.target.value })}
                    placeholder="e.g. Feb 18, 2026"
                    className="w-full bg-white border border-black p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Current Page</label>
                  <input
                    type="number"
                    value={form.nonThrillerCurrentPage ?? 0}
                    onChange={(e) => setForm({ ...form, nonThrillerCurrentPage: Number(e.target.value) })}
                    className="w-full bg-white border border-black p-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Total Pages</label>
                  <input
                    type="number"
                    value={form.nonThrillerTotalPages ?? 0}
                    onChange={(e) => setForm({ ...form, nonThrillerTotalPages: Number(e.target.value) })}
                    className="w-full bg-white border border-black p-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  label="Non-Thriller Book Cover Photo"
                  value={form.nonThrillerCoverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                  onChange={(newUrl) => setForm({ ...form, nonThrillerCoverImage: newUrl })}
                />
              </div>

              <div>
                <label className="block text-[#8b0000] font-bold mb-1 uppercase text-[10px]">
                  What I'm Thinking About This Non-Thriller (Curator's Notes & Reflections) *
                </label>
                <textarea
                  rows={4}
                  value={form.nonThrillerThoughts || ''}
                  onChange={(e) => setForm({ ...form, nonThrillerThoughts: e.target.value })}
                  placeholder="Share your thoughts on themes, writing style, concepts, emotional resonance, or how it contrasts with your mystery reads..."
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Key Takeaway or Observation (Optional)
                </label>
                <textarea
                  rows={2}
                  value={form.nonThrillerNotes || ''}
                  onChange={(e) => setForm({ ...form, nonThrillerNotes: e.target.value })}
                  placeholder="Any memorable insight, quote, or reading context..."
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-black">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'primary' ? 'nonThriller' : 'primary')}
                className="text-[11px] font-bold text-[#8b0000] hover:underline"
              >
                Switch to {activeTab === 'primary' ? 'Non-Thriller Reading' : 'Primary Read'} →
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCurrentlyReadingModalOpen(false)}
                className="px-4 py-2 text-[#4a4a4a] hover:text-black uppercase font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-black hover:bg-[#8b0000] text-white px-6 py-2 uppercase font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-colors cursor-pointer"
              >
                SAVE CURRENT READS
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

