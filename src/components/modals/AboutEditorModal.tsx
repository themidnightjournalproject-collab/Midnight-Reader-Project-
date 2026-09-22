import React, { useState, useEffect } from 'react';
import { useJournal } from '../../context/JournalContext';
import { AboutConfig, AboutRule } from '../../types';
import { UserCheck, BookOpen, Quote, Shield, Image as ImageIcon } from 'lucide-react';

export const AboutEditorModal: React.FC = () => {
  const { 
    aboutConfig, 
    updateAboutConfig, 
    isEditAboutModalOpen, 
    setIsEditAboutModalOpen 
  } = useJournal();

  const [formConfig, setFormConfig] = useState<AboutConfig>({ ...aboutConfig });
  const [activeTab, setActiveTab] = useState<'profile' | 'bio' | 'rules' | 'note'>('profile');

  useEffect(() => {
    if (isEditAboutModalOpen) {
      setFormConfig({ ...aboutConfig });
    }
  }, [isEditAboutModalOpen, aboutConfig]);

  if (!isEditAboutModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutConfig(formConfig);
    setIsEditAboutModalOpen(false);
  };

  const handleRuleChange = (index: number, field: keyof AboutRule, value: any) => {
    const updatedRules = [...(formConfig.rules || [])];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setFormConfig({ ...formConfig, rules: updatedRules });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-black w-full max-w-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="text-[#8b0000]" size={24} />
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-bold tracking-widest block">
                ADMIN DOSSIER EDITOR
              </span>
              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase font-serif">
                EDIT ABOUT SECTION & DOSSIER
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditAboutModalOpen(false)}
            className="p-1 hover:bg-[#e8e2d8] text-black font-sans font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-black mb-4 gap-1 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 font-sans font-bold text-xs uppercase transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#8b0000] text-[#8b0000] bg-[#f5f2ed]'
                : 'border-transparent text-[#4a4a4a] hover:text-black'
            }`}
          >
            Titles & Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bio')}
            className={`px-3 py-1.5 font-sans font-bold text-xs uppercase transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'bio'
                ? 'border-[#8b0000] text-[#8b0000] bg-[#f5f2ed]'
                : 'border-transparent text-[#4a4a4a] hover:text-black'
            }`}
          >
            Bio & Manifesto
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 font-sans font-bold text-xs uppercase transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'rules'
                ? 'border-[#8b0000] text-[#8b0000] bg-[#f5f2ed]'
                : 'border-transparent text-[#4a4a4a] hover:text-black'
            }`}
          >
            Golden Rules (4)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('note')}
            className={`px-3 py-1.5 font-sans font-bold text-xs uppercase transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'note'
                ? 'border-[#8b0000] text-[#8b0000] bg-[#f5f2ed]'
                : 'border-transparent text-[#4a4a4a] hover:text-black'
            }`}
          >
            Final Note & Photo
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs font-sans">
          
          {/* TAB 1: Titles & Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                    Section Badge / Eyebrow
                  </label>
                  <input
                    type="text"
                    value={formConfig.headerBadge}
                    onChange={(e) => setFormConfig({ ...formConfig, headerBadge: e.target.value })}
                    placeholder="CORRESPONDENT PROFILE"
                    className="w-full bg-white border border-black p-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={formConfig.headerSubtitle}
                    onChange={(e) => setFormConfig({ ...formConfig, headerSubtitle: e.target.value })}
                    placeholder="THE STUDENT BEHIND THE LEDGER"
                    className="w-full bg-white border border-black p-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Section Main Headline
                </label>
                <input
                  type="text"
                  value={formConfig.pageTitle}
                  onChange={(e) => setFormConfig({ ...formConfig, pageTitle: e.target.value })}
                  placeholder="ABOUT THE CURATOR"
                  className="w-full bg-white border border-black p-2 text-xs font-bold font-serif"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-black pt-3">
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                    Classification
                  </label>
                  <input
                    type="text"
                    value={formConfig.classification}
                    onChange={(e) => setFormConfig({ ...formConfig, classification: e.target.value })}
                    placeholder="Full-Time Student"
                    className="w-full bg-white border border-black p-2 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                    Obsession
                  </label>
                  <input
                    type="text"
                    value={formConfig.obsession}
                    onChange={(e) => setFormConfig({ ...formConfig, obsession: e.target.value })}
                    placeholder="Unreliable Narrators"
                    className="w-full bg-white border border-black p-2 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Photo Caption Stamp
                </label>
                <input
                  type="text"
                  value={formConfig.photoStamp}
                  onChange={(e) => setFormConfig({ ...formConfig, photoStamp: e.target.value })}
                  placeholder="DESK AT 2:15 AM"
                  className="w-full bg-white border border-black p-2 text-xs uppercase"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: Bio & Manifesto */}
          {activeTab === 'bio' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px] text-[#8b0000]">
                  Featured Callout Quote
                </label>
                <textarea
                  value={formConfig.featuredQuote}
                  onChange={(e) => setFormConfig({ ...formConfig, featuredQuote: e.target.value })}
                  rows={2}
                  className="w-full bg-white border border-black p-2 text-xs italic font-serif"
                  required
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Biography Paragraph 1 (Introduction)
                </label>
                <textarea
                  value={formConfig.bioParagraph1}
                  onChange={(e) => setFormConfig({ ...formConfig, bioParagraph1: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-black p-2 text-xs font-serif"
                  required
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Biography Paragraph 2 (Archive Purpose)
                </label>
                <textarea
                  value={formConfig.bioParagraph2}
                  onChange={(e) => setFormConfig({ ...formConfig, bioParagraph2: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-black p-2 text-xs font-serif"
                  required
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Biography Paragraph 3 (Habits & Quirks)
                </label>
                <textarea
                  value={formConfig.bioParagraph3}
                  onChange={(e) => setFormConfig({ ...formConfig, bioParagraph3: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-black p-2 text-xs font-serif"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 3: Golden Rules */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Rules Section Heading
                </label>
                <input
                  type="text"
                  value={formConfig.rulesHeading}
                  onChange={(e) => setFormConfig({ ...formConfig, rulesHeading: e.target.value })}
                  placeholder="MY 4 GOLDEN RULES OF THRILLER INVESTIGATION"
                  className="w-full bg-white border border-black p-2 text-xs font-bold font-serif"
                  required
                />
              </div>

              <div className="space-y-3">
                {(formConfig.rules || []).map((rule, idx) => (
                  <div key={idx} className="p-3 bg-[#f5f2ed] border border-black space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#8b0000] text-[10px] uppercase tracking-wider">
                        Rule #{rule.number || idx + 1}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={rule.title}
                      onChange={(e) => handleRuleChange(idx, 'title', e.target.value)}
                      placeholder={`Rule title e.g. RULE #${idx + 1}`}
                      className="w-full bg-white border border-black p-1.5 text-xs font-bold uppercase"
                      required
                    />
                    <textarea
                      value={rule.description}
                      onChange={(e) => handleRuleChange(idx, 'description', e.target.value)}
                      placeholder="Rule description..."
                      rows={2}
                      className="w-full bg-white border border-black p-1.5 text-xs"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Final Note & Photo */}
          {activeTab === 'note' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Curator Desk Photo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formConfig.curatorPhoto}
                    onChange={(e) => setFormConfig({ ...formConfig, curatorPhoto: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-white border border-black p-2 text-xs font-mono"
                    required
                  />
                  {formConfig.curatorPhoto && (
                    <img 
                      src={formConfig.curatorPhoto} 
                      alt="Preview" 
                      className="w-10 h-10 object-cover border border-black" 
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px] text-[#8b0000]">
                  Marginalia Final Note (Note to Visitors)
                </label>
                <textarea
                  value={formConfig.finalNote}
                  onChange={(e) => setFormConfig({ ...formConfig, finalNote: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-black p-2 text-xs italic font-serif"
                  required
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-black mt-4">
            <button
              type="button"
              onClick={() => setIsEditAboutModalOpen(false)}
              className="px-4 py-2 border border-black text-[#1a1a1a] hover:bg-[#e8e2d8] font-bold uppercase text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-black hover:bg-[#8b0000] text-white font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-colors"
            >
              Save About Dossier
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
