import React, { useState, useEffect } from 'react';
import { useJournal } from '../../context/JournalContext';
import { CurrentlyReading, CurrentlyReadingBook } from '../../types';
import { BookOpen, Sparkles, Bookmark, PlusCircle, CheckCircle, Trash2, ArrowRight } from 'lucide-react';
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
  const { 
    currentlyReading, 
    updateCurrentlyReading, 
    addBookToCurrentReads,
    removeBookFromCurrentReads,
    openCompleteAndArchive,
    isCurrentlyReadingModalOpen, 
    setIsCurrentlyReadingModalOpen 
  } = useJournal();

  const [form, setForm] = useState<CurrentlyReading>({ ...currentlyReading });
  const [suspectInput, setSuspectInput] = useState<string>(currentlyReading.suspectsNoted?.join(', ') || '');
  const [activeTab, setActiveTab] = useState<'primary' | 'nonThriller' | 'addBook' | 'manage'>('primary');

  // State for adding a brand new book to Current Reads
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookGenre, setNewBookGenre] = useState('Psychological Thriller');
  const [newBookCover, setNewBookCover] = useState('https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80');
  const [newBookCurrentPage, setNewBookCurrentPage] = useState(1);
  const [newBookTotalPages, setNewBookTotalPages] = useState(320);
  const [newBookStartDate, setNewBookStartDate] = useState(new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
  const [newBookTheory, setNewBookTheory] = useState('');
  const [newBookCategory, setNewBookCategory] = useState<'thriller' | 'non-fiction' | 'other'>('thriller');

  useEffect(() => {
    if (isCurrentlyReadingModalOpen) {
      setForm({
        ...currentlyReading,
        showNonThriller: currentlyReading.showNonThriller ?? true,
        additionalBooks: currentlyReading.additionalBooks || [],
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

  const handleAddNewBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookAuthor.trim()) return;

    addBookToCurrentReads({
      title: newBookTitle.trim(),
      author: newBookAuthor.trim(),
      genre: newBookGenre,
      category: newBookCategory,
      coverImage: newBookCover,
      currentPage: Number(newBookCurrentPage) || 1,
      totalPages: Number(newBookTotalPages) || 300,
      startDate: newBookStartDate,
      currentTheory: newBookTheory.trim(),
      thoughts: newBookTheory.trim(),
    });

    // Reset new book form
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookTheory('');
    setNewBookCurrentPage(1);
    setActiveTab('manage');
  };

  const additionalCount = form.additionalBooks?.length || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white border-2 border-black w-full max-w-3xl p-6 sm:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[#8b0000]" size={22} />
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-bold tracking-widest block">
                CURRENT READING BUREAU • DESK CONTROLS
              </span>
              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase font-serif">
                MANAGE CURRENT READS
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
        <div className="flex border-b border-black mb-5 gap-1.5 font-sans text-xs overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('primary')}
            className={`px-3 py-2 font-bold uppercase transition-colors border-t border-l border-r border-black cursor-pointer whitespace-nowrap ${
              activeTab === 'primary'
                ? 'bg-black text-white'
                : 'bg-[#f5f2ed] text-[#4a4a4a] hover:bg-white'
            }`}
          >
            Primary Investigation
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('nonThriller')}
            className={`px-3 py-2 font-bold uppercase transition-colors border-t border-l border-r border-black flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'nonThriller'
                ? 'bg-[#8b0000] text-white'
                : 'bg-[#f5f2ed] text-[#4a4a4a] hover:bg-white'
            }`}
          >
            <Bookmark size={12} />
            <span>Companion Read</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addBook')}
            className={`px-3 py-2 font-bold uppercase transition-colors border-t border-l border-r border-black flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'addBook'
                ? 'bg-[#166534] text-white'
                : 'bg-[#e9f2eb] text-[#166534] hover:bg-white border-green-700'
            }`}
          >
            <PlusCircle size={13} />
            <span>+ Add Another Book</span>
          </button>

          {additionalCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className={`px-3 py-2 font-bold uppercase transition-colors border-t border-l border-r border-black cursor-pointer whitespace-nowrap ${
                activeTab === 'manage'
                  ? 'bg-[#222] text-white'
                  : 'bg-[#f5f2ed] text-[#4a4a4a] hover:bg-white'
              }`}
            >
              Additional Books ({additionalCount})
            </button>
          )}
        </div>

        {/* TAB 1: Primary Current Read */}
        {activeTab === 'primary' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            
            {/* Quick Archive Banner for Primary Read */}
            {form.title && (
              <div className="bg-[#eef8f1] border-2 border-[#166534] p-3 flex flex-wrap items-center justify-between gap-2 shadow-[2px_2px_0px_0px_rgba(22,101,52,1)]">
                <div>
                  <span className="font-bold text-[#166534] uppercase text-[11px] block">
                    Finished reading this book?
                  </span>
                  <p className="text-[11px] text-gray-700 font-serif">
                    Move "{form.title}" directly to the Archive and clear it from active reading.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    openCompleteAndArchive({
                      bookType: 'primary',
                      title: form.title,
                      author: form.author,
                      genre: form.genre,
                      coverImage: form.coverImage,
                      totalPages: form.totalPages,
                      currentPage: form.currentPage,
                      notes: form.currentTheory,
                      startDate: form.startDate,
                    });
                  }}
                  className="bg-[#166534] hover:bg-black text-white px-3 py-1.5 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={14} />
                  <span>Move to Archive</span>
                </button>
              </div>
            )}

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
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Current Page *</label>
                <input
                  type="number"
                  required
                  value={form.currentPage}
                  onChange={(e) => setForm({ ...form, currentPage: Number(e.target.value) })}
                  className="w-full bg-white border border-black p-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Total Pages *</label>
                <input
                  type="number"
                  required
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
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                Current Working Theory & Suspect Observations *
              </label>
              <textarea
                rows={3}
                required
                value={form.currentTheory}
                onChange={(e) => setForm({ ...form, currentTheory: e.target.value })}
                className="w-full bg-white border border-black p-2 text-xs font-serif"
              />
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-black gap-3">
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
                Save Primary Read
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Non-Thriller Companion Read */}
        {activeTab === 'nonThriller' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            
            {/* Quick Archive Banner for Companion Read */}
            {form.nonThrillerTitle && (
              <div className="bg-[#eef8f1] border-2 border-[#166534] p-3 flex flex-wrap items-center justify-between gap-2 shadow-[2px_2px_0px_0px_rgba(22,101,52,1)]">
                <div>
                  <span className="font-bold text-[#166534] uppercase text-[11px] block">
                    Finished this companion read?
                  </span>
                  <p className="text-[11px] text-gray-700 font-serif">
                    Move "{form.nonThrillerTitle}" to Off the Record or the Archive ledger.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    openCompleteAndArchive({
                      bookType: 'companion',
                      title: form.nonThrillerTitle || '',
                      author: form.nonThrillerAuthor || '',
                      genre: form.nonThrillerGenre || 'Other Literature',
                      coverImage: form.nonThrillerCoverImage || '',
                      totalPages: form.nonThrillerTotalPages || form.nonThrillerCurrentPage || 0,
                      currentPage: form.nonThrillerCurrentPage || 0,
                      notes: form.nonThrillerThoughts || form.nonThrillerNotes || '',
                      startDate: form.nonThrillerStartDate,
                    });
                  }}
                  className="bg-[#166534] hover:bg-black text-white px-3 py-1.5 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={14} />
                  <span>Move to Archive</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 pb-2 border-b border-black/20">
              <input
                type="checkbox"
                id="showNonThrillerCheckbox"
                checked={form.showNonThriller ?? true}
                onChange={(e) => setForm({ ...form, showNonThriller: e.target.checked })}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="showNonThrillerCheckbox" className="font-bold uppercase text-[11px] cursor-pointer">
                Display Companion / Non-Thriller Read on Homepage Banner
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Book Title *</label>
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
                  list="companion-genre-list"
                  value={form.nonThrillerGenre || ''}
                  onChange={(e) => setForm({ ...form, nonThrillerGenre: e.target.value })}
                  placeholder="e.g. Sci-Fi & Speculative, Memoir, Philosophy..."
                  className="w-full bg-white border border-black p-2 text-xs"
                />
                <datalist id="companion-genre-list">
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
                label="Companion Book Cover Photo"
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
                placeholder="Share your thoughts on themes, writing style, concepts, emotional resonance..."
                className="w-full bg-white border border-black p-2 text-xs font-serif"
              />
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-black gap-3">
              <button
                type="button"
                onClick={() => setIsCurrentlyReadingModalOpen(false)}
                className="px-4 py-2 text-[#4a4a4a] hover:text-black uppercase font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#8b0000] hover:bg-black text-white px-6 py-2 uppercase font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-colors cursor-pointer"
              >
                Save Companion Read
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Add Another Book to Current Reads */}
        {activeTab === 'addBook' && (
          <form onSubmit={handleAddNewBookSubmit} className="space-y-4 text-xs font-sans">
            <div className="bg-[#f0f7f2] border border-[#166534] p-3">
              <span className="font-bold text-[#166534] uppercase text-[11px] block">
                Add an additional ongoing volume to your Current Reads
              </span>
              <p className="text-[11px] text-[#2c3e2e] font-serif">
                Track multiple books at once. Each book appears in your active reading desk with its own progress bar and direct option to move to the archive upon completion.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Book Title *</label>
                <input
                  type="text"
                  required
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  placeholder="e.g. The Only One Left, Project Hail Mary"
                  className="w-full bg-white border border-black p-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Author *</label>
                <input
                  type="text"
                  required
                  value={newBookAuthor}
                  onChange={(e) => setNewBookAuthor(e.target.value)}
                  placeholder="e.g. Riley Sager, Andy Weir"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Genre / Category</label>
                <input
                  type="text"
                  list="add-genre-list"
                  value={newBookGenre}
                  onChange={(e) => setNewBookGenre(e.target.value)}
                  className="w-full bg-white border border-black p-2 text-xs"
                />
                <datalist id="add-genre-list">
                  {GENRE_SUGGESTIONS.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Date Started</label>
                <input
                  type="text"
                  value={newBookStartDate}
                  onChange={(e) => setNewBookStartDate(e.target.value)}
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Current Page</label>
                <input
                  type="number"
                  value={newBookCurrentPage}
                  onChange={(e) => setNewBookCurrentPage(Number(e.target.value))}
                  className="w-full bg-white border border-black p-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Total Pages *</label>
                <input
                  type="number"
                  required
                  value={newBookTotalPages}
                  onChange={(e) => setNewBookTotalPages(Number(e.target.value))}
                  className="w-full bg-white border border-black p-2 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <ImageUploader
                label="Book Cover Photo"
                value={newBookCover}
                onChange={(newUrl) => setNewBookCover(newUrl)}
              />
            </div>

            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                Initial Theories, Thoughts, or Observations
              </label>
              <textarea
                rows={3}
                value={newBookTheory}
                onChange={(e) => setNewBookTheory(e.target.value)}
                placeholder="What are your early suspicions or expectations?"
                className="w-full bg-white border border-black p-2 text-xs font-serif"
              />
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-black gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('primary')}
                className="px-4 py-2 text-[#4a4a4a] hover:text-black uppercase font-bold text-xs cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-[#166534] hover:bg-black text-white px-6 py-2 uppercase font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>Add Book to Current Reads</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: Manage Additional Books */}
        {activeTab === 'manage' && (
          <div className="space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold uppercase text-[11px] text-gray-700">
                Additional Books Under Active Investigation ({additionalCount})
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('addBook')}
                className="text-[11px] font-bold text-[#166534] hover:underline flex items-center gap-1"
              >
                <PlusCircle size={12} />
                <span>Add Another Book</span>
              </button>
            </div>

            {(!form.additionalBooks || form.additionalBooks.length === 0) ? (
              <p className="font-serif italic text-gray-500 py-6 text-center">
                No additional books currently added. Click "+ Add Another Book" above to track another volume!
              </p>
            ) : (
              <div className="space-y-3">
                {form.additionalBooks.map((b) => {
                  const pct = Math.min(100, Math.round(((b.currentPage || 0) / (b.totalPages || 1)) * 100));
                  return (
                    <div key={b.id} className="bg-[#fcfaf2] border-2 border-black p-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-12 h-18 object-cover border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-[9px] font-mono uppercase bg-[#8b0000] text-white px-1.5 py-0.5 font-bold">
                            {b.genre || 'BOOK'}
                          </span>
                          <h4 className="font-serif font-black text-sm sm:text-base text-black uppercase mt-0.5">
                            {b.title}
                          </h4>
                          <p className="font-serif italic text-xs text-gray-600">
                            By {b.author}
                          </p>
                          <p className="text-[11px] font-mono text-gray-700 mt-1">
                            Page {b.currentPage} of {b.totalPages} ({pct}%)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
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
                          className="bg-[#166534] hover:bg-black text-white px-3 py-1.5 text-xs font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          title="Mark complete and file in Archive"
                        >
                          <CheckCircle size={13} />
                          <span>Complete & Archive</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeBookFromCurrentReads(b.id)}
                          className="p-1.5 text-gray-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-300 transition-colors cursor-pointer"
                          title="Remove from Current Reads"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-black">
              <button
                type="button"
                onClick={() => setIsCurrentlyReadingModalOpen(false)}
                className="bg-black text-white px-5 py-2 uppercase font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
