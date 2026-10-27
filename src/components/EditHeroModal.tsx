import React, { useState, useEffect } from 'react';
import { useJournal } from '../context/JournalContext';
import { X, Save, Edit3, RotateCcw } from 'lucide-react';
import { INITIAL_HERO_CONFIG } from '../data/initialData';

export const EditHeroModal: React.FC = () => {
  const { 
    isEditHeroModalOpen, 
    setIsEditHeroModalOpen, 
    heroConfig, 
    updateHeroConfig 
  } = useJournal();

  const [formData, setFormData] = useState(heroConfig);

  useEffect(() => {
    if (heroConfig) {
      setFormData(heroConfig);
    }
  }, [heroConfig, isEditHeroModalOpen]);

  if (!isEditHeroModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroConfig(formData);
    setIsEditHeroModalOpen(false);
  };

  const handleReset = () => {
    setFormData(INITIAL_HERO_CONFIG);
  };

  return (
    <div 
      id="modal-edit-hero-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in"
      onClick={() => setIsEditHeroModalOpen(false)}
    >
      <div 
        id="modal-edit-hero-container"
        className="bg-[#fcfaf2] border-2 border-black max-w-2xl w-full p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Edit3 size={18} className="text-[#8b0000]" />
            <h2 className="text-xl font-black font-serif uppercase tracking-tight text-black">
              Edit Front-Page Dispatch & Hero Section
            </h2>
          </div>
          <button 
            id="btn-close-edit-hero"
            onClick={() => setIsEditHeroModalOpen(false)}
            className="p-1 border border-black bg-white hover:bg-[#8b0000] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {/* Top badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-black mb-1">
                Story Badge / Category
              </label>
              <input
                type="text"
                value={formData.leadCategory}
                onChange={(e) => setFormData({ ...formData, leadCategory: e.target.value })}
                placeholder="e.g. Lead Story • Case Dispatch"
                className="w-full bg-white border border-black p-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-black mb-1">
                Dossier Code / Sub-stamp
              </label>
              <input
                type="text"
                value={formData.dossierCode}
                onChange={(e) => setFormData({ ...formData, dossierCode: e.target.value })}
                placeholder="e.g. Dossier #2026-B"
                className="w-full bg-white border border-black p-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
          </div>

          {/* Main Headline */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-black mb-1">
              Front-Page Headline (Uppercase)
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g. “ANOTHER BOOK. ANOTHER SUSPECT.”"
              className="w-full bg-white border border-black p-2 font-serif text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>

          {/* Paragraph 1 */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-black mb-1">
              Lead Statement / First Paragraph
            </label>
            <textarea
              rows={3}
              value={formData.introParagraph1}
              onChange={(e) => setFormData({ ...formData, introParagraph1: e.target.value })}
              className="w-full bg-white border border-black p-2 font-serif text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>

          {/* Paragraph 2 */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-black mb-1">
              Editorial Note / Second Paragraph
            </label>
            <textarea
              rows={3}
              value={formData.introParagraph2}
              onChange={(e) => setFormData({ ...formData, introParagraph2: e.target.value })}
              className="w-full bg-white border border-black p-2 font-serif text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>

          {/* Marginalia Note */}
          <div className="p-3 bg-[#fffef7] border border-black space-y-2">
            <span className="block font-bold uppercase text-[10px] tracking-wider text-[#8b0000]">
              Desk Marginalia Pinned Note
            </span>
            <div>
              <label className="block font-semibold text-[11px] text-gray-700 mb-1">
                Quote Content:
              </label>
              <textarea
                rows={2}
                value={formData.marginaliaQuote}
                onChange={(e) => setFormData({ ...formData, marginaliaQuote: e.target.value })}
                className="w-full bg-white border border-black p-2 font-marginalia text-sm focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[11px] text-gray-700 mb-1">
                Author / Stamp:
              </label>
              <input
                type="text"
                value={formData.marginaliaAuthor || ''}
                onChange={(e) => setFormData({ ...formData, marginaliaAuthor: e.target.value })}
                placeholder="e.g. Midnight Reader / Student Note"
                className="w-full bg-white border border-black p-1.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-black">
            <button
              type="button"
              id="btn-reset-hero-defaults"
              onClick={handleReset}
              className="flex items-center gap-1 text-gray-600 hover:text-black font-bold uppercase tracking-wider text-[11px] transition-colors"
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                id="btn-cancel-edit-hero"
                onClick={() => setIsEditHeroModalOpen(false)}
                className="px-4 py-2 border border-black bg-white hover:bg-gray-100 font-bold uppercase tracking-wider text-[11px] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-save-edit-hero"
                className="flex items-center gap-2 px-5 py-2 border border-black bg-black hover:bg-[#8b0000] text-white font-bold uppercase tracking-widest text-[11px] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
