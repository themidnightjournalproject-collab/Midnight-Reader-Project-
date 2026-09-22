import React, { useState, useEffect } from 'react';
import { useJournal } from '../../context/JournalContext';
import { IntelligenceStats } from '../../types';
import { BarChart2, Sliders, Type, Table, Sparkles } from 'lucide-react';

export const IntelligenceEditorModal: React.FC = () => {
  const { 
    intelligenceStats, 
    updateIntelligenceStats, 
    isIntelligenceEditorOpen, 
    setIsIntelligenceEditorOpen 
  } = useJournal();

  const [formStats, setFormStats] = useState<IntelligenceStats>({ ...intelligenceStats });
  const [activeTab, setActiveTab] = useState<'titles' | 'cards' | 'table' | 'metrics'>('titles');

  useEffect(() => {
    if (isIntelligenceEditorOpen) {
      setFormStats({ ...intelligenceStats });
    }
  }, [isIntelligenceEditorOpen, intelligenceStats]);

  if (!isIntelligenceEditorOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateIntelligenceStats(formStats);
    setIsIntelligenceEditorOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-black w-full max-w-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="text-[#8b0000]" size={24} />
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-bold tracking-widest block">
                BUREAU OF READER INTELLIGENCE CONTROL
              </span>
              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase font-serif">
                EDIT MEASURABLE IMPACT & TITLES
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsIntelligenceEditorOpen(false)}
            className="p-1 hover:bg-[#e8e2d8] text-black font-sans font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-black mb-4 gap-1 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('titles')}
            className={`px-3 py-1.5 font-sans font-bold text-xs uppercase transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'titles'
                ? 'border-[#8b0000] text-[#8b0000] bg-[#f5f2ed]'
                : 'border-transparent text-[#4a4a4a] hover:text-black'
            }`}
          >
            <Type size={12} />
            Section Titles
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 font-sans font-bold text-xs uppercase transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'cards'
                ? 'border-[#8b0000] text-[#8b0000] bg-[#f5f2ed]'
                : 'border-transparent text-[#4a4a4a] hover:text-black'
            }`}
          >
            <Sparkles size={12} />
            Metric Card Titles
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 font-sans font-bold text-xs uppercase transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'table'
                ? 'border-[#8b0000] text-[#8b0000] bg-[#f5f2ed]'
                : 'border-transparent text-[#4a4a4a] hover:text-black'
            }`}
          >
            <Table size={12} />
            Table & Columns
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 font-sans font-bold text-xs uppercase transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'metrics'
                ? 'border-[#8b0000] text-[#8b0000] bg-[#f5f2ed]'
                : 'border-transparent text-[#4a4a4a] hover:text-black'
            }`}
          >
            <Sliders size={12} />
            Values & Quote
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs font-sans">
          
          {/* TAB 1: Section Titles */}
          {activeTab === 'titles' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Bureau Header / Eyebrow
                </label>
                <input
                  type="text"
                  value={formStats.bureauTitle || ''}
                  onChange={(e) => setFormStats({ ...formStats, bureauTitle: e.target.value })}
                  placeholder="BUREAU OF READER METRICS & MEASURABLE ENGAGEMENT"
                  className="w-full bg-white border border-black p-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Main Dashboard Headline
                </label>
                <input
                  type="text"
                  value={formStats.headline || ''}
                  onChange={(e) => setFormStats({ ...formStats, headline: e.target.value })}
                  placeholder="Measurable Reader Results & Analytics"
                  className="w-full bg-white border border-black p-2 text-xs font-bold font-serif"
                  required
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Dispatch Note / Briefing
                </label>
                <textarea
                  value={formStats.dispatchNote || ''}
                  onChange={(e) => setFormStats({ ...formStats, dispatchNote: e.target.value })}
                  rows={3}
                  placeholder="Summary description of reader interaction and intelligence..."
                  className="w-full bg-white border border-black p-2 text-xs"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: Metric Card Titles & Subtitles */}
          {activeTab === 'cards' && (
            <div className="space-y-4">
              <p className="text-[11px] text-[#4a4a4a] italic">
                Customize the titles and labels of the 4 measurable impact cards:
              </p>

              {/* Card 1: Endorsements */}
              <div className="p-3 bg-[#f5f2ed] border border-black space-y-2">
                <span className="font-bold text-[#8b0000] text-[10px] uppercase tracking-wider block">
                  Card 1: Endorsements / Likes
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Card Title</label>
                    <input
                      type="text"
                      value={formStats.cardLikesTitle || ''}
                      onChange={(e) => setFormStats({ ...formStats, cardLikesTitle: e.target.value })}
                      placeholder="Total Endorsements"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Card Subtitle / Description</label>
                    <input
                      type="text"
                      value={formStats.cardLikesSubtitle || ''}
                      onChange={(e) => setFormStats({ ...formStats, cardLikesSubtitle: e.target.value })}
                      placeholder="Audited reader endorsements across all thriller case files"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Polls */}
              <div className="p-3 bg-[#f5f2ed] border border-black space-y-2">
                <span className="font-bold text-[#8b0000] text-[10px] uppercase tracking-wider block">
                  Card 2: Poll Verdicts
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Card Title</label>
                    <input
                      type="text"
                      value={formStats.cardPollsTitle || ''}
                      onChange={(e) => setFormStats({ ...formStats, cardPollsTitle: e.target.value })}
                      placeholder="Poll Verdicts Cast"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Card Subtitle / Description</label>
                    <input
                      type="text"
                      value={formStats.cardPollsSubtitle || ''}
                      onChange={(e) => setFormStats({ ...formStats, cardPollsSubtitle: e.target.value })}
                      placeholder="Collective reader votes logged in suspect lineups"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Accuracy */}
              <div className="p-3 bg-[#f5f2ed] border border-black space-y-2">
                <span className="font-bold text-[#8b0000] text-[10px] uppercase tracking-wider block">
                  Card 3: Detective Accuracy Rate
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Card Title</label>
                    <input
                      type="text"
                      value={formStats.cardAccuracyTitle || ''}
                      onChange={(e) => setFormStats({ ...formStats, cardAccuracyTitle: e.target.value })}
                      placeholder="Detective Accuracy"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Card Subtitle / Description</label>
                    <input
                      type="text"
                      value={formStats.cardAccuracySubtitle || ''}
                      onChange={(e) => setFormStats({ ...formStats, cardAccuracySubtitle: e.target.value })}
                      placeholder="Correct killer predictions prior to resolution reveal"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Card 4: Witness Comments */}
              <div className="p-3 bg-[#f5f2ed] border border-black space-y-2">
                <span className="font-bold text-[#8b0000] text-[10px] uppercase tracking-wider block">
                  Card 4: Witness Testimonies
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Card Title</label>
                    <input
                      type="text"
                      value={formStats.cardCommentsTitle || ''}
                      onChange={(e) => setFormStats({ ...formStats, cardCommentsTitle: e.target.value })}
                      placeholder="Witness Testimonies"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Card Subtitle / Description</label>
                    <input
                      type="text"
                      value={formStats.cardCommentsSubtitle || ''}
                      onChange={(e) => setFormStats({ ...formStats, cardCommentsSubtitle: e.target.value })}
                      placeholder="Verified field notes and theory discussions recorded"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Table Titles & Column Headers */}
          {activeTab === 'table' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                    Table Main Heading
                  </label>
                  <input
                    type="text"
                    value={formStats.tableHeading || ''}
                    onChange={(e) => setFormStats({ ...formStats, tableHeading: e.target.value })}
                    placeholder="CASE FILE ENGAGEMENT LEDGER"
                    className="w-full bg-white border border-black p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                    Table Subtitle / Note
                  </label>
                  <input
                    type="text"
                    value={formStats.tableSubtitle || ''}
                    onChange={(e) => setFormStats({ ...formStats, tableSubtitle: e.target.value })}
                    placeholder="Audited across thriller records"
                    className="w-full bg-white border border-black p-2 text-xs"
                  />
                </div>
              </div>

              <div className="border-t border-black pt-3">
                <span className="font-bold text-[#8b0000] text-[10px] uppercase tracking-wider block mb-2">
                  Table Column Headers
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Column 1: Case File</label>
                    <input
                      type="text"
                      value={formStats.tableColCaseFile || ''}
                      onChange={(e) => setFormStats({ ...formStats, tableColCaseFile: e.target.value })}
                      placeholder="CASE FILE / DOSSIER"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Column 2: Endorsements</label>
                    <input
                      type="text"
                      value={formStats.tableColEndorsements || ''}
                      onChange={(e) => setFormStats({ ...formStats, tableColEndorsements: e.target.value })}
                      placeholder="ENDORSEMENTS"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Column 3: Poll Votes</label>
                    <input
                      type="text"
                      value={formStats.tableColPollVotes || ''}
                      onChange={(e) => setFormStats({ ...formStats, tableColPollVotes: e.target.value })}
                      placeholder="POLL VOTES"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Column 4: Testimonies / Theories</label>
                    <input
                      type="text"
                      value={formStats.tableColTheories || ''}
                      onChange={(e) => setFormStats({ ...formStats, tableColTheories: e.target.value })}
                      placeholder="TESTIMONIES"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[9px]">Column 5: Status</label>
                    <input
                      type="text"
                      value={formStats.tableColStatus || ''}
                      onChange={(e) => setFormStats({ ...formStats, tableColStatus: e.target.value })}
                      placeholder="STATUS"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Values, Quotes & Overrides */}
          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sliders size={13} className="text-[#8b0000]" />
                  <h4 className="font-bold uppercase text-[11px] text-[#8b0000] tracking-wider">
                    Audited Metrics (Manual Number Overrides)
                  </h4>
                </div>
                <p className="text-[11px] text-[#4a4a4a] italic mb-3">
                  Leave blank to automatically tally in real-time from reader clicks, or specify exact totals.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                      Likes Override
                    </label>
                    <input
                      type="number"
                      value={formStats.overrideLikes ?? ''}
                      onChange={(e) => setFormStats({ 
                        ...formStats, 
                        overrideLikes: e.target.value === '' ? null : Number(e.target.value) 
                      })}
                      placeholder="Auto"
                      className="w-full bg-white border border-black p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                      Polls Override
                    </label>
                    <input
                      type="number"
                      value={formStats.overridePollVotes ?? ''}
                      onChange={(e) => setFormStats({ 
                        ...formStats, 
                        overridePollVotes: e.target.value === '' ? null : Number(e.target.value) 
                      })}
                      placeholder="Auto"
                      className="w-full bg-white border border-black p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                      Comments Override
                    </label>
                    <input
                      type="number"
                      value={formStats.overrideComments ?? ''}
                      onChange={(e) => setFormStats({ 
                        ...formStats, 
                        overrideComments: e.target.value === '' ? null : Number(e.target.value) 
                      })}
                      placeholder="Auto"
                      className="w-full bg-white border border-black p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                      Accuracy % Override
                    </label>
                    <input
                      type="number"
                      value={formStats.overrideAccuracy ?? ''}
                      onChange={(e) => setFormStats({ 
                        ...formStats, 
                        overrideAccuracy: e.target.value === '' ? null : Number(e.target.value) 
                      })}
                      placeholder="Auto %"
                      className="w-full bg-white border border-black p-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Highlight Stat */}
              <div className="border-t border-black pt-3">
                <h4 className="font-bold uppercase text-[10px] text-[#8b0000] tracking-wider mb-2">
                  Featured Intelligence Highlight
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Highlight Label</label>
                    <input
                      type="text"
                      value={formStats.customHighlightLabel || ''}
                      onChange={(e) => setFormStats({ ...formStats, customHighlightLabel: e.target.value })}
                      placeholder="DETECTIVE CONFIDENCE INDEX"
                      className="w-full bg-white border border-black p-2 text-xs uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Highlight Value</label>
                    <input
                      type="text"
                      value={formStats.customHighlightValue || ''}
                      onChange={(e) => setFormStats({ ...formStats, customHighlightValue: e.target.value })}
                      placeholder="94.2% High Alert"
                      className="w-full bg-white border border-black p-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Quote */}
              <div className="border-t border-black pt-3">
                <h4 className="font-bold uppercase text-[10px] text-[#8b0000] tracking-wider mb-2">
                  Featured Bureau Epigraph / Quote
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Quote Text</label>
                    <input
                      type="text"
                      value={formStats.featuredQuoteText || ''}
                      onChange={(e) => setFormStats({ ...formStats, featuredQuoteText: e.target.value })}
                      placeholder="“To read a thriller is to enter into a contract of mutual paranoia...”"
                      className="w-full bg-white border border-black p-2 text-xs italic font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Attribution</label>
                    <input
                      type="text"
                      value={formStats.featuredQuoteAuthor || ''}
                      onChange={(e) => setFormStats({ ...formStats, featuredQuoteAuthor: e.target.value })}
                      placeholder="Chief Student Investigator"
                      className="w-full bg-white border border-black p-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-black mt-4">
            <button
              type="button"
              onClick={() => setIsIntelligenceEditorOpen(false)}
              className="px-4 py-2 border border-black text-[#1a1a1a] hover:bg-[#e8e2d8] font-bold uppercase text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-black hover:bg-[#8b0000] text-white font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-colors"
            >
              Save Intelligence Stats
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
