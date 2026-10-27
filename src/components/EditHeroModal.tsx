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

  const [activeTab, setActiveTab] = useState<'branding' | 'sections' | 'dispatch'>('branding');
  const [formData, setFormData] = useState<any>(heroConfig);

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
        className="bg-[#fcfaf2] border-2 border-black max-w-3xl w-full p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Edit3 size={18} className="text-[#8b0000]" />
            <h2 className="text-xl font-black font-serif uppercase tracking-tight text-black">
              Site Brand, Titles & Section Configurator
            </h2>
          </div>
          <button 
            id="btn-close-edit-hero"
            onClick={() => setIsEditHeroModalOpen(false)}
            className="p-1 border border-black bg-white hover:bg-[#8b0000] hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-2 border-black mb-5 bg-[#f0eae1]">
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider border-r border-black transition-colors ${
              activeTab === 'branding' ? 'bg-[#fcfaf2] text-[#8b0000] border-b-2 border-b-[#fcfaf2] -mb-[2px]' : 'text-gray-700 hover:text-black'
            }`}
          >
            1. Site & Masthead Branding
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider border-r border-black transition-colors ${
              activeTab === 'sections' ? 'bg-[#fcfaf2] text-[#8b0000] border-b-2 border-b-[#fcfaf2] -mb-[2px]' : 'text-gray-700 hover:text-black'
            }`}
          >
            2. Section Titles & Navigation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dispatch')}
            className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'dispatch' ? 'bg-[#fcfaf2] text-[#8b0000] border-b-2 border-b-[#fcfaf2] -mb-[2px]' : 'text-gray-700 hover:text-black'
            }`}
          >
            3. Front-Page Dispatch & Quote
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {/* TAB 1: SITE & MASTHEAD BRANDING */}
          {activeTab === 'branding' && (
            <div className="space-y-4 bg-white p-4 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <label className="block font-bold uppercase tracking-wider text-black mb-1">
                  Main Newspaper Title
                </label>
                <input
                  type="text"
                  value={formData.siteTitle || ''}
                  onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                  placeholder="e.g. The Midnight Reader"
                  className="w-full bg-[#fcfaf2] border border-black p-2 font-serif text-lg font-black focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-black mb-1">
                  Masthead Subtitle & Tagline
                </label>
                <input
                  type="text"
                  value={formData.siteTagline || ''}
                  onChange={(e) => setFormData({ ...formData, siteTagline: e.target.value })}
                  placeholder="e.g. 'A student's reading journal — mostly suspicious people, unreliable narrators, and terrible decisions.'"
                  className="w-full bg-[#fcfaf2] border border-black p-2 font-serif text-xs italic focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-black mb-1">
                    Top Newspaper Volume Stamp
                  </label>
                  <input
                    type="text"
                    value={formData.newspaperVolume || ''}
                    onChange={(e) => setFormData({ ...formData, newspaperVolume: e.target.value })}
                    placeholder="e.g. Vol. XXIV — No. 114"
                    className="w-full bg-[#fcfaf2] border border-black p-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-black mb-1">
                    Top Secret Desk Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.classifiedTag || ''}
                    onChange={(e) => setFormData({ ...formData, classifiedTag: e.target.value })}
                    placeholder="e.g. Classified: Case Archive"
                    className="w-full bg-[#fcfaf2] border border-black p-2 font-mono text-xs text-[#8b0000] font-bold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <p className="text-[10px] text-gray-500 mt-1 italic">
                    (Clicking this in visitor mode secretly prompts for your editor passcode).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECTION TITLES & NAVIGATION */}
          {activeTab === 'sections' && (
            <div className="space-y-4 bg-white p-4 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[11px] font-serif italic text-gray-700 pb-2 border-b border-gray-200">
                Rename the section links and headings across the entire newspaper to match your style:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-black mb-1">
                    Main Archives Tab Label
                  </label>
                  <input
                    type="text"
                    value={formData.archivesSectionTitle || ''}
                    onChange={(e) => setFormData({ ...formData, archivesSectionTitle: e.target.value })}
                    placeholder="e.g. The Archives"
                    className="w-full bg-[#fcfaf2] border border-black p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-black mb-1">
                    Current Case / Reading Tab Label
                  </label>
                  <input
                    type="text"
                    value={formData.currentReadsTitle || ''}
                    onChange={(e) => setFormData({ ...formData, currentReadsTitle: e.target.value })}
                    placeholder="e.g. Currently Reading"
                    className="w-full bg-[#fcfaf2] border border-black p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-black mb-1">
                    Suspect Board Tab Label
                  </label>
                  <input
                    type="text"
                    value={formData.suspectBoardTitle || ''}
                    onChange={(e) => setFormData({ ...formData, suspectBoardTitle: e.target.value })}
                    placeholder="e.g. Suspect Board"
                    className="w-full bg-[#fcfaf2] border border-black p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-black mb-1">
                    Reading Timeline Tab Label
                  </label>
                  <input
                    type="text"
                    value={formData.timelineTitle || ''}
                    onChange={(e) => setFormData({ ...formData, timelineTitle: e.target.value })}
                    placeholder="e.g. Timeline"
                    className="w-full bg-[#fcfaf2] border border-black p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-black mb-1">
                    Vital Statistics Tab Label
                  </label>
                  <input
                    type="text"
                    value={formData.statsTitle || ''}
                    onChange={(e) => setFormData({ ...formData, statsTitle: e.target.value })}
                    placeholder="e.g. Stats"
                    className="w-full bg-[#fcfaf2] border border-black p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-black mb-1">
                    Curator Profile / About Tab Label
                  </label>
                  <input
                    type="text"
                    value={formData.aboutTitle || ''}
                    onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                    placeholder="e.g. About"
                    className="w-full bg-[#fcfaf2] border border-black p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FRONT-PAGE DISPATCH & QUOTE */}
          {activeTab === 'dispatch' && (
            <div className="space-y-4 bg-white p-4 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {/* Top badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-black mb-1">
                    Story Badge / Category
                  </label>
                  <input
                    type="text"
                    value={formData.leadCategory || formData.leadBadge || ''}
                    onChange={(e) => setFormData({ ...formData, leadCategory: e.target.value, leadBadge: e.target.value })}
                    placeholder="e.g. Lead Story • Case Dispatch"
                    className="w-full bg-[#fcfaf2] border border-black p-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-black mb-1">
                    Dossier Code / Sub-stamp
                  </label>
                  <input
                    type="text"
                    value={formData.dossierCode || formData.dossierTag || ''}
                    onChange={(e) => setFormData({ ...formData, dossierCode: e.target.value, dossierTag: e.target.value })}
                    placeholder="e.g. Dossier #2026-B"
                    className="w-full bg-[#fcfaf2] border border-black p-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-black"
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
                  value={formData.headline || ''}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. “ANOTHER BOOK. ANOTHER SUSPECT.”"
                  className="w-full bg-[#fcfaf2] border border-black p-2 font-serif text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black"
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
                  value={formData.introParagraph1 || formData.bioParagraph1 || ''}
                  onChange={(e) => setFormData({ ...formData, introParagraph1: e.target.value, bioParagraph1: e.target.value })}
                  className="w-full bg-[#fcfaf2] border border-black p-2 font-serif text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-black"
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
                  value={formData.introParagraph2 || formData.bioParagraph2 || ''}
                  onChange={(e) => setFormData({ ...formData, introParagraph2: e.target.value, bioParagraph2: e.target.value })}
                  className="w-full bg-[#fcfaf2] border border-black p-2 font-serif text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-black"
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
                    value={formData.marginaliaQuote || formData.quoteAttribution || ''}
                    onChange={(e) => setFormData({ ...formData, marginaliaQuote: e.target.value })}
                    className="w-full bg-white border border-black p-2 font-marginalia text-sm focus:outline-none focus:ring-1 focus:ring-black"
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
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-black">
            <button
              type="button"
              id="btn-reset-hero-defaults"
              onClick={handleReset}
              className="flex items-center gap-1 text-gray-600 hover:text-black font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                id="btn-cancel-edit-hero"
                onClick={() => setIsEditHeroModalOpen(false)}
                className="px-4 py-2 border border-black bg-white hover:bg-gray-100 font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-save-edit-hero"
                className="flex items-center gap-2 px-5 py-2 border border-black bg-black hover:bg-[#8b0000] text-white font-bold uppercase tracking-widest text-[11px] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
              >
                <Save size={14} />
                <span>Save All Titles & Branding</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
