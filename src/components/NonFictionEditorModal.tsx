import React, { useState, useEffect, useRef } from 'react';
import { useJournal, DEFAULT_RESEARCH_TROPES } from '../context/JournalContext';
import { NonFictionBook, OtherGenre, ALL_OTHER_GENRES, MindsetRatings } from '../types';
import { X, Save, Plus, Trash2, Calendar, BookOpen, Sparkles, Tag, Check, Undo2 } from 'lucide-react';
import { ImageUploader } from './common/ImageUploader';

const GENRE_OPTIONS = ALL_OTHER_GENRES;

export const NonFictionEditorModal: React.FC = () => {
  const {
    isNewNonFictionModalOpen,
    setIsNewNonFictionModalOpen,
    editingNonFictionBook,
    setEditingNonFictionBook,
    addNonFictionBook,
    updateNonFictionBook,
    customResearchTropes,
    addCustomResearchTrope,
  } = useJournal();

  const isEditing = Boolean(editingNonFictionBook);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const initialFormState: Omit<NonFictionBook, 'id'> = {
    catalogNumber: '',
    title: '',
    author: '',
    genre: 'Psychology & Behaviour',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    rating: 5,
    pages: 300,
    yearRead: new Date().getFullYear(),
    dateStarted: '',
    dateFinished: '',
    dateLogged: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    oneSentenceTakeaway: '',
    tagline: '',
    summary: '',
    reviewText: '',
    fullReview: '',
    favoriteQuote: '',
    favoriteQuotes: [''],
    mindsetRatings: {
      readability: 5,
      actionability: 4,
      intellectualImpact: 5,
      originality: 4,
    },
    keyTakeaways: [''],
    actionItems: [''],
    tags: ['Mental Models', 'Character Study'],
    themes: ['Mental Models', 'Character Study'],
    tropes: ['Mental Models', 'Character Study'],
    notesScratchpad: [],
    likes: 1,
  };

  const [formData, setFormData] = useState<Omit<NonFictionBook, 'id'>>(initialFormState);
  const [customTropeInput, setCustomTropeInput] = useState('');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Sync state when modal opens or editing item changes
  useEffect(() => {
    if (editingNonFictionBook) {
      setFormData({
        catalogNumber: editingNonFictionBook.catalogNumber || '',
        title: editingNonFictionBook.title || '',
        author: editingNonFictionBook.author || '',
        genre: editingNonFictionBook.genre || 'Psychology & Behaviour',
        coverImage: editingNonFictionBook.coverImage || editingNonFictionBook.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        coverUrl: editingNonFictionBook.coverImage || editingNonFictionBook.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        rating: editingNonFictionBook.rating || 5,
        pages: editingNonFictionBook.pages || 300,
        yearRead: editingNonFictionBook.yearRead || new Date().getFullYear(),
        dateStarted: editingNonFictionBook.dateStarted || '',
        dateFinished: editingNonFictionBook.dateFinished || '',
        dateLogged: editingNonFictionBook.dateLogged || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        oneSentenceTakeaway: editingNonFictionBook.oneSentenceTakeaway || editingNonFictionBook.tagline || '',
        tagline: editingNonFictionBook.oneSentenceTakeaway || editingNonFictionBook.tagline || '',
        summary: editingNonFictionBook.summary || '',
        reviewText: editingNonFictionBook.reviewText || editingNonFictionBook.fullReview || '',
        fullReview: editingNonFictionBook.reviewText || editingNonFictionBook.fullReview || '',
        favoriteQuote: editingNonFictionBook.favoriteQuote || '',
        mindsetRatings: editingNonFictionBook.mindsetRatings || {
          readability: 5,
          actionability: 4,
          intellectualImpact: 5,
          originality: 4,
        },
        keyTakeaways: editingNonFictionBook.keyTakeaways?.length ? [...editingNonFictionBook.keyTakeaways] : [''],
        actionItems: editingNonFictionBook.actionItems?.length ? [...editingNonFictionBook.actionItems] : [''],
        favoriteQuotes: editingNonFictionBook.favoriteQuotes?.length ? [...editingNonFictionBook.favoriteQuotes] : (editingNonFictionBook.favoriteQuote ? [editingNonFictionBook.favoriteQuote] : ['']),
        tags: editingNonFictionBook.tropes?.length ? [...editingNonFictionBook.tropes] : (editingNonFictionBook.tags?.length ? [...editingNonFictionBook.tags] : ['Mental Models']),
        themes: editingNonFictionBook.tropes?.length ? [...editingNonFictionBook.tropes] : (editingNonFictionBook.tags?.length ? [...editingNonFictionBook.tags] : ['Mental Models']),
        tropes: editingNonFictionBook.tropes?.length ? [...editingNonFictionBook.tropes] : (editingNonFictionBook.tags?.length ? [...editingNonFictionBook.tags] : ['Mental Models']),
        notesScratchpad: editingNonFictionBook.notesScratchpad ? [...editingNonFictionBook.notesScratchpad] : [],
        likes: editingNonFictionBook.likes || 1,
      });
    } else {
      setFormData(initialFormState);
    }
    setCustomTropeInput('');
    setSaveNotice(null);
  }, [editingNonFictionBook, isNewNonFictionModalOpen]);

  // Keep a ref to latest formData so backdrop click can save even during state transitions
  const latestFormRef = useRef(formData);
  useEffect(() => {
    latestFormRef.current = formData;
  }, [formData]);

  if (!isNewNonFictionModalOpen) return null;

  // Persist present changes function (called either on backdrop click, save button, or enter)
  const savePresentChanges = (closeModal = true) => {
    const currentData = latestFormRef.current;
    const cleanTakeaways = (currentData.keyTakeaways || []).filter((t) => t.trim().length > 0);
    const cleanActionItems = (currentData.actionItems || []).filter((t) => t.trim().length > 0);
    const cleanQuotes = (currentData.favoriteQuotes || []).filter((t) => t.trim().length > 0);
    const cleanTropes = (currentData.tropes || []).filter((t) => t.trim().length > 0);

    const hasAnyContent = Boolean(
      currentData.title.trim() ||
      currentData.author.trim() ||
      currentData.summary.trim() ||
      currentData.tagline.trim() ||
      currentData.oneSentenceTakeaway.trim() ||
      cleanTakeaways.length > 0 ||
      cleanQuotes.length > 0 ||
      isEditing
    );

    // If it's a new modal and the user hasn't typed anything, don't create a blank phantom entry
    if (!isEditing && !hasAnyContent) {
      if (closeModal) {
        setIsNewNonFictionModalOpen(false);
        setEditingNonFictionBook(null);
      }
      return;
    }

    const finalTitle = currentData.title.trim() || (isEditing ? editingNonFictionBook?.title : '') || 'Untitled Research Dossier';
    const finalAuthor = currentData.author.trim() || (isEditing ? editingNonFictionBook?.author : '') || 'Unknown Investigator / Author';

    const payload: Omit<NonFictionBook, 'id'> = {
      ...currentData,
      title: finalTitle,
      author: finalAuthor,
      coverImage: currentData.coverImage || currentData.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      coverUrl: currentData.coverImage || currentData.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      oneSentenceTakeaway: currentData.oneSentenceTakeaway || currentData.tagline || 'Essential reading insights and field notes.',
      tagline: currentData.oneSentenceTakeaway || currentData.tagline || 'Essential reading insights and field notes.',
      reviewText: currentData.reviewText || currentData.fullReview || 'Detailed critical research notes logged in archive.',
      fullReview: currentData.reviewText || currentData.fullReview || 'Detailed critical research notes logged in archive.',
      favoriteQuote: cleanQuotes[0] || currentData.favoriteQuote || '',
      keyTakeaways: cleanTakeaways.length ? cleanTakeaways : ['Key core concept logged.'],
      actionItems: cleanActionItems.length ? cleanActionItems : ['Applied into daily workflow.'],
      favoriteQuotes: cleanQuotes.length ? cleanQuotes : [],
      tropes: cleanTropes.length ? cleanTropes : ['Character Study'],
      tags: cleanTropes.length ? cleanTropes : ['Character Study'],
      themes: cleanTropes.length ? cleanTropes : ['Character Study'],
    };

    if (isEditing && editingNonFictionBook) {
      updateNonFictionBook(editingNonFictionBook.id, payload);
    } else {
      addNonFictionBook(payload);
    }

    if (closeModal) {
      setIsNewNonFictionModalOpen(false);
      setEditingNonFictionBook(null);
    } else {
      setSaveNotice('Present changes saved to archive.');
      setTimeout(() => setSaveNotice(null), 2500);
    }
  };

  // Close explicitly discarding changes
  const handleDiscardAndClose = () => {
    setIsNewNonFictionModalOpen(false);
    setEditingNonFictionBook(null);
  };

  // When clicking backdrop outside modal, save present changes automatically!
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      savePresentChanges(true);
    }
  };

  const handleRatingChange = (field: keyof MindsetRatings, val: number) => {
    setFormData((prev) => ({
      ...prev,
      mindsetRatings: {
        ...prev.mindsetRatings,
        [field]: Math.max(1, Math.min(5, val)),
      },
    }));
  };

  const handleArrayItemChange = (
    field: 'keyTakeaways' | 'actionItems' | 'favoriteQuotes',
    index: number,
    value: string
  ) => {
    const arr = [...(formData[field] || [])];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const handleAddArrayItem = (field: 'keyTakeaways' | 'actionItems' | 'favoriteQuotes') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const handleRemoveArrayItem = (field: 'keyTakeaways' | 'actionItems' | 'favoriteQuotes', index: number) => {
    const arr = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: arr.length ? arr : [''] });
  };

  // Trope pills handling
  const toggleTrope = (trope: string) => {
    const current = formData.tropes || [];
    let updated: string[];
    if (current.includes(trope)) {
      updated = current.filter((t) => t !== trope);
    } else {
      updated = [...current, trope];
    }
    setFormData((prev) => ({
      ...prev,
      tropes: updated,
      tags: updated,
      themes: updated,
    }));
  };

  const handleAddCustomTrope = () => {
    const clean = customTropeInput.trim();
    if (!clean) return;

    const current = formData.tropes || [];
    const updated = current.includes(clean) ? current : [...current, clean];

    setFormData((prev) => ({
      ...prev,
      tropes: updated,
      tags: updated,
      themes: updated,
    }));

    addCustomResearchTrope(clean);
    setCustomTropeInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePresentChanges(true);
  };

  // Compile all available research tropes (defaults + user custom + any already in current book)
  const availableTropes = Array.from(
    new Set([
      ...DEFAULT_RESEARCH_TROPES,
      ...(customResearchTropes || []),
      ...(formData.tropes || []),
    ])
  );

  return (
    <div
      id="modal-non-fiction-editor-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        ref={containerRef}
        id="modal-non-fiction-editor-container"
        className="bg-[#fcfaf2] border-2 border-black max-w-3xl w-full p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-[#8b0000]" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black font-serif uppercase tracking-tight text-black">
                  {isEditing ? `Edit Library Dossier: ${formData.catalogNumber || 'Volume Entry'}` : 'Log New Book to Library'}
                </h2>
                <span className="bg-[#8b0000] text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-widest font-bold">
                  Auto-Saves on Exit
                </span>
              </div>
              <p className="text-[11px] font-sans text-gray-600 uppercase tracking-wider">
                All-Genre Literature: Fiction, Sci-Fi/Fantasy, Non-Fiction, Philosophy, Memoirs & Multidisciplinary Studies
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-close-nf-editor"
              onClick={() => savePresentChanges(true)}
              title="Save present changes and close"
              className="px-2.5 py-1 border border-black bg-black text-white hover:bg-[#8b0000] font-sans text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Check size={12} />
              <span>Save & Close</span>
            </button>
            <button
              onClick={handleDiscardAndClose}
              title="Discard changes"
              className="p-1 border border-black bg-white hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {saveNotice && (
          <div className="mb-4 p-2 bg-emerald-100 border border-emerald-600 text-emerald-900 text-xs font-mono font-bold flex items-center justify-between">
            <span>✓ {saveNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-sans text-xs">
          {/* Section 1: Catalog & Essential Metadata */}
          <div className="p-4 bg-white border border-black space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5">
              <Sparkles size={14} className="text-[#8b0000]" />
              <span className="font-bold uppercase tracking-widest text-[11px] text-black">
                1. Entry & Identification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Catalog Code (e.g. NF-001)
                </label>
                <input
                  type="text"
                  value={formData.catalogNumber}
                  onChange={(e) => setFormData({ ...formData, catalogNumber: e.target.value })}
                  placeholder="Auto-generated if empty"
                  className="w-full bg-[#fcfaf2] border border-black p-2 font-mono text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Thinking, Fast and Slow or Project Hail Mary"
                  className="w-full bg-[#fcfaf2] border border-black p-2 font-serif text-sm font-bold focus:ring-1 focus:ring-black"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Daniel Kahneman"
                  className="w-full bg-[#fcfaf2] border border-black p-2 text-xs focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Primary Genre / Category *
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value as OtherGenre })}
                  className="w-full bg-[#fcfaf2] border border-black p-2 text-xs focus:ring-1 focus:ring-black"
                >
                  {GENRE_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Star Rating (1 - 5) *
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full bg-[#fcfaf2] border border-black p-2 text-xs font-bold focus:ring-1 focus:ring-black"
                >
                  <option value={5}>★★★★★ (5/5 Masterpiece)</option>
                  <option value={4.5}>★★★★½ (4.5/5 Essential)</option>
                  <option value={4}>★★★★☆ (4/5 Recommended)</option>
                  <option value={3.5}>★★★½☆ (3.5/5 Solid)</option>
                  <option value={3}>★★★☆☆ (3/5 Decent)</option>
                  <option value={2}>★★☆☆☆ (2/5 Flawed)</option>
                  <option value={1}>★☆☆☆☆ (1/5 Skip)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Page Count
                </label>
                <input
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: Number(e.target.value) })}
                  placeholder="e.g. 418"
                  className="w-full bg-[#fcfaf2] border border-black p-2 text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Year Read / Cataloged
                </label>
                <input
                  type="number"
                  value={formData.yearRead}
                  onChange={(e) => setFormData({ ...formData, yearRead: Number(e.target.value) })}
                  placeholder={String(new Date().getFullYear())}
                  className="w-full bg-[#fcfaf2] border border-black p-2 text-xs focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Standardized Image Uploader (Same as Case Files with Curated Presets) */}
            <div className="pt-2 border-t border-gray-200">
              <ImageUploader
                currentImage={formData.coverImage || formData.coverUrl || ''}
                onImageChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url, coverUrl: url }))}
                label="Cover Artwork / Forensic Plate"
                presetCategory="research"
              />
            </div>
          </div>

          {/* Section 2: Reading Dates (Date Started, Finished, Logged) */}
          <div className="p-4 bg-white border border-black space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5">
              <Calendar size={14} className="text-[#8b0000]" />
              <span className="font-bold uppercase tracking-widest text-[11px] text-black">
                2. Reading Timeline & Study Period
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Date Started
                </label>
                <input
                  type="text"
                  value={formData.dateStarted || ''}
                  onChange={(e) => setFormData({ ...formData, dateStarted: e.target.value })}
                  placeholder="e.g. Oct 12, 2025"
                  className="w-full bg-[#fcfaf2] border border-black p-2 text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Date Finished
                </label>
                <input
                  type="text"
                  value={formData.dateFinished || ''}
                  onChange={(e) => setFormData({ ...formData, dateFinished: e.target.value })}
                  placeholder="e.g. Oct 28, 2025"
                  className="w-full bg-[#fcfaf2] border border-black p-2 text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Date Logged in Archive
                </label>
                <input
                  type="text"
                  value={formData.dateLogged}
                  onChange={(e) => setFormData({ ...formData, dateLogged: e.target.value })}
                  placeholder="e.g. Oct 29, 2025"
                  className="w-full bg-[#fcfaf2] border border-black p-2 text-xs focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Tropes, Concepts & Literary Devices */}
          <div className="p-4 bg-white border border-black space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-[#8b0000]" />
                <span className="font-bold uppercase tracking-widest text-[11px] text-black">
                  3. Tropes, Key Concepts & Thematic Elements
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-500">
                {(formData.tropes || []).length} Selected
              </span>
            </div>

            <p className="font-serif italic text-xs text-gray-600">
              Select or create research, literary, and thematic tropes (e.g. Systems Thinking, Dual Timelines, Character Study, Speculative Worldbuilding).
            </p>

            {/* Trope Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {availableTropes.map((trope) => {
                const isSelected = (formData.tropes || []).includes(trope);
                return (
                  <button
                    key={trope}
                    type="button"
                    onClick={() => toggleTrope(trope)}
                    className={`px-2.5 py-1 text-[11px] font-sans font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#8b0000] text-white border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-[#faf9f5] text-[#1a1a1a] border-black border-opacity-30 hover:border-black'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{trope}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Trope Tag */}
            <div className="flex gap-2 pt-2 border-t border-black border-opacity-10">
              <input
                type="text"
                value={customTropeInput}
                onChange={(e) => setCustomTropeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTrope();
                  }
                }}
                placeholder="Add custom trope / theme (e.g. Unreliable Memory, Epistolary Letters, Coming-of-Age)..."
                className="flex-1 bg-[#faf9f5] border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomTrope}
                className="px-4 py-2 bg-black hover:bg-[#8b0000] text-white font-bold uppercase text-[10px] tracking-wider transition-colors cursor-pointer"
              >
                Add Trope
              </button>
            </div>
          </div>

          {/* Section 4: Mindset & Cognitive Impact Matrix */}
          <div className="p-4 bg-[#fffef7] border border-black space-y-3">
            <span className="block font-bold uppercase tracking-widest text-[11px] text-[#8b0000]">
              4. Cognitive & Mindset Impact Metrics (Score 1 - 5)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold uppercase text-[9px] text-gray-700 mb-1">
                  Readability: {formData.mindsetRatings.readability}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.mindsetRatings.readability}
                  onChange={(e) => handleRatingChange('readability', Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[9px] text-gray-700 mb-1">
                  Actionability: {formData.mindsetRatings.actionability}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.mindsetRatings.actionability}
                  onChange={(e) => handleRatingChange('actionability', Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[9px] text-gray-700 mb-1">
                  Intellectual Impact: {formData.mindsetRatings.intellectualImpact}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.mindsetRatings.intellectualImpact}
                  onChange={(e) => handleRatingChange('intellectualImpact', Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[9px] text-gray-700 mb-1">
                  Originality: {formData.mindsetRatings.originality}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.mindsetRatings.originality}
                  onChange={(e) => handleRatingChange('originality', Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Tagline, Summary & Review Content */}
          <div className="p-4 bg-white border border-black space-y-3">
            <span className="block font-bold uppercase tracking-widest text-[11px] text-black">
              5. Synthesis, Executive Summary & Detailed Review
            </span>

            <div>
              <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                One-Sentence Research Thesis / Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value, oneSentenceTakeaway: e.target.value })}
                placeholder="e.g. A groundbreaking exploration into cognitive heuristics and deliberate thinking."
                className="w-full bg-[#fcfaf2] border border-black p-2 font-serif text-xs font-semibold focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                Executive Overview / Synopsis
              </label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="High-level briefing of the book's core premise..."
                className="w-full bg-[#fcfaf2] border border-black p-2 font-serif text-xs leading-relaxed focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                Full Field Evaluation & Deep Reading Notes
              </label>
              <textarea
                rows={4}
                value={formData.fullReview}
                onChange={(e) => setFormData({ ...formData, fullReview: e.target.value, reviewText: e.target.value })}
                placeholder="Comprehensive analysis, critique, structural breakdown, and personal reflection..."
                className="w-full bg-[#fcfaf2] border border-black p-2 font-serif text-xs leading-relaxed focus:ring-1 focus:ring-black"
                required
              />
            </div>
          </div>

          {/* Section 6: Key Takeaways & Action Items (Interactive Lists) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Key Takeaways */}
            <div className="p-3 bg-white border border-black space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-widest text-[10px] text-black">
                  Core Takeaways ({formData.keyTakeaways.length})
                </span>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem('keyTakeaways')}
                  className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#8b0000] hover:underline cursor-pointer"
                >
                  <Plus size={12} /> Add Takeaway
                </button>
              </div>

              {formData.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={takeaway}
                    onChange={(e) => handleArrayItemChange('keyTakeaways', idx, e.target.value)}
                    placeholder={`Takeaway #${idx + 1}`}
                    className="flex-1 bg-[#fcfaf2] border border-black p-1.5 text-xs focus:ring-1 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('keyTakeaways', idx)}
                    className="p-1 text-gray-400 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Items */}
            <div className="p-3 bg-white border border-black space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-widest text-[10px] text-black">
                  Actionable Applications ({formData.actionItems.length})
                </span>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem('actionItems')}
                  className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#8b0000] hover:underline cursor-pointer"
                >
                  <Plus size={12} /> Add Action
                </button>
              </div>

              {formData.actionItems.map((action, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={action}
                    onChange={(e) => handleArrayItemChange('actionItems', idx, e.target.value)}
                    placeholder={`Action Item #${idx + 1}`}
                    className="flex-1 bg-[#fcfaf2] border border-black p-1.5 text-xs focus:ring-1 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('actionItems', idx)}
                    className="p-1 text-gray-400 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Highlighted Quotes */}
          <div className="p-3 bg-white border border-black space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-widest text-[10px] text-black">
                Highlighted Quotes & Excerpts ({formData.favoriteQuotes.length})
              </span>
              <button
                type="button"
                onClick={() => handleAddArrayItem('favoriteQuotes')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#8b0000] hover:underline cursor-pointer"
              >
                <Plus size={12} /> Add Quote
              </button>
            </div>

            {formData.favoriteQuotes.map((quote, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={quote}
                  onChange={(e) => handleArrayItemChange('favoriteQuotes', idx, e.target.value)}
                  placeholder={`“Quote #${idx + 1}...”`}
                  className="flex-1 bg-[#fffef7] border border-black p-1.5 font-marginalia text-xs focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('favoriteQuotes', idx)}
                  className="p-1 text-gray-400 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Actions & Auto-Save Notice */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-black">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-gray-600">
                Tip: Clicking anywhere outside this window automatically saves your progress.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-discard-nf-modal"
                onClick={handleDiscardAndClose}
                className="flex items-center gap-1 px-3 py-2 border border-gray-400 bg-white hover:bg-gray-100 text-gray-700 font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer"
              >
                <Undo2 size={13} />
                <span>Discard</span>
              </button>
              <button
                type="button"
                onClick={() => savePresentChanges(false)}
                className="px-4 py-2 border border-black bg-[#fcfaf2] hover:bg-amber-100 text-black font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer"
              >
                Save Progress
              </button>
              <button
                type="submit"
                id="btn-save-nf-modal"
                className="flex items-center gap-2 px-6 py-2 border border-black bg-black hover:bg-[#8b0000] text-white font-bold uppercase tracking-widest text-[11px] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
              >
                <Save size={14} />
                <span>{isEditing ? 'Save Changes & Close' : 'File into Archive & Close'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
