import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import { IntelligenceStats } from '../../types';
import { BarChart2, Sparkles, Sliders } from 'lucide-react';

export const IntelligenceEditorModal: React.FC = () => {
  const { 
    intelligenceStats, 
    updateIntelligenceStats, 
    isIntelligenceEditorOpen, 
    setIsIntelligenceEditorOpen 
  } = useJournal();

  const [formStats, setFormStats] = useState<IntelligenceStats>({ ...intelligenceStats });

  if (!isIntelligenceEditorOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateIntelligenceStats(formStats);
    setIsIntelligenceEditorOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-black w-full max-w-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-6">
          <div className="flex items-center gap-2">
            <BarChart2 className="text-[#8b0000]" size={22} />
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-bold tracking-widest block">
                BUREAU OF READER INTELLIGENCE CONTROL
              </span>
              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase font-serif">
                EDIT INTELLIGENCE & ANALYTICS
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsIntelligenceEditorOpen(false)}
            className="p-1 hover:bg-[#e8e2d8] text-black font-sans font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          
          <div className="space-y-3">
            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                Bureau Top Subtitle / Header
              </label>
              <input
                type="text"
                value={formStats.bureauTitle}
                onChange={(e) => setFormStats({ ...formStats, bureauTitle: e.target.value })}
                placeholder="e.g. BUREAU OF READER METRICS & MEASURABLE ENGAGEMENT"
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
                value={formStats.headline}
                onChange={(e) => setFormStats({ ...formStats, headline: e.target.value })}
                placeholder="e.g. Measurable Reader Results & Analytics"
                className="w-full bg-white border border-black p-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                Dispatch Note / Briefing
              </label>
              <textarea
                value={formStats.dispatchNote}
                onChange={(e) => setFormStats({ ...formStats, dispatchNote: e.target.value })}
                rows={2}
                placeholder="Summary description of reader interaction and intelligence..."
                className="w-full bg-white border border-black p-2 text-xs"
                required
              />
            </div>
          </div>

          {/* Metric Overrides (Optional manual numbers or auto-calculated) */}
          <div className="border-t border-black pt-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Sliders size={13} className="text-[#8b0000]" />
              <h4 className="font-bold uppercase text-[11px] text-[#8b0000] tracking-wider">
                Audited Metrics (Override / Calibrate Totals)
              </h4>
            </div>
            <p className="text-[11px] text-[#4a4a4a] italic mb-3">
              Leave blank to automatically calculate in real-time from reader actions, or set manual audited values.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Total Endorsements (Likes)
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
                  Poll Verdicts Cast
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
                  Witness Testimonies
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
                  Accuracy Rate (%)
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
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Label</label>
                <input
                  type="text"
                  value={formStats.customHighlightLabel || ''}
                  onChange={(e) => setFormStats({ ...formStats, customHighlightLabel: e.target.value })}
                  placeholder="e.g. DETECTIVE CONFIDENCE INDEX"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Value</label>
                <input
                  type="text"
                  value={formStats.customHighlightValue || ''}
                  onChange={(e) => setFormStats({ ...formStats, customHighlightValue: e.target.value })}
                  placeholder="e.g. 94.2% High Alert"
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
                  placeholder="e.g. “To read a thriller is to enter into a contract of mutual paranoia...”"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Attribution</label>
                <input
                  type="text"
                  value={formStats.featuredQuoteAuthor || ''}
                  onChange={(e) => setFormStats({ ...formStats, featuredQuoteAuthor: e.target.value })}
                  placeholder="e.g. Chief Student Investigator"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-black">
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
