import React, { useState, useEffect } from 'react';
import { useJournal } from '../../context/JournalContext';
import { OffTheRecordConfig } from '../../types';
import { INITIAL_OFF_THE_RECORD_CONFIG } from '../../data/initialData';
import { BookOpen, Edit3, X, Save, RotateCcw, Sparkles } from 'lucide-react';

export const OffTheRecordEditorModal: React.FC = () => {
  const {
    offTheRecordConfig,
    updateOffTheRecordConfig,
    isEditOffTheRecordModalOpen,
    setIsEditOffTheRecordModalOpen,
  } = useJournal();

  const [formConfig, setFormConfig] = useState<OffTheRecordConfig>({
    ...INITIAL_OFF_THE_RECORD_CONFIG,
    ...offTheRecordConfig,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isEditOffTheRecordModalOpen) {
      setFormConfig({
        ...INITIAL_OFF_THE_RECORD_CONFIG,
        ...offTheRecordConfig,
      });
      setSavedSuccess(false);
    }
  }, [isEditOffTheRecordModalOpen, offTheRecordConfig]);

  if (!isEditOffTheRecordModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOffTheRecordConfig(formConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setIsEditOffTheRecordModalOpen(false);
      setSavedSuccess(false);
    }, 600);
  };

  const handleReset = () => {
    if (window.confirm('Reset the Off the Record title and introduction to original editorial defaults?')) {
      setFormConfig({ ...INITIAL_OFF_THE_RECORD_CONFIG });
    }
  };

  return (
    <div
      id="modal-edit-off-the-record-overlay"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs animate-in fade-in"
      onClick={() => setIsEditOffTheRecordModalOpen(false)}
    >
      <div
        id="modal-edit-off-the-record-container"
        className="bg-[#fcfaf2] border-2 border-black w-full max-w-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <BookOpen className="text-[#8b0000]" size={24} />
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-bold tracking-widest block">
                EDITORIAL DESK CONFIGURATION
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1a1a1a] uppercase font-serif tracking-tight">
                EDIT OFF THE RECORD SECTION & INTRO
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditOffTheRecordModalOpen(false)}
            className="p-1 border border-black bg-white hover:bg-[#8b0000] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="mb-6 p-4 bg-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-black text-white px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-widest">
              {formConfig.badge || 'UNREDACTED DOSSIERS'}
            </span>
            <span className="text-[10px] font-sans font-bold text-[#8b0000] tracking-wider uppercase">
              {formConfig.eyebrow || 'LITERATURE & PHILOSOPHY'}
            </span>
          </div>
          <h4 className="text-2xl font-black font-serif uppercase tracking-tight text-black mb-1">
            {formConfig.title || 'OFF THE RECORDS'}
          </h4>
          <p className="text-xs font-serif text-gray-700 italic line-clamp-3 leading-relaxed">
            "{formConfig.introduction || '...'}"
          </p>
          <div className="mt-2 pt-2 border-t border-dotted border-gray-300 text-[10px] font-mono text-gray-400 uppercase">
            Live Header Preview
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-bold uppercase text-black mb-1">
              Top Category Tag / Badge
            </label>
            <input
              type="text"
              value={formConfig.badge}
              onChange={(e) => setFormConfig({ ...formConfig, badge: e.target.value })}
              placeholder="e.g. UNREDACTED DOSSIERS • OFF THE RECORD"
              className="w-full bg-white border border-black p-2 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#8b0000]"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-bold uppercase text-black mb-1">
              Eyebrow Subtitle (Red Accent)
            </label>
            <input
              type="text"
              value={formConfig.eyebrow}
              onChange={(e) => setFormConfig({ ...formConfig, eyebrow: e.target.value })}
              placeholder="e.g. LITERATURE, PHILOSOPHY & UNCLASSIFIED READS"
              className="w-full bg-white border border-black p-2 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#8b0000]"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-bold uppercase text-black mb-1">
              Main Section Headline Title
            </label>
            <input
              type="text"
              value={formConfig.title}
              onChange={(e) => setFormConfig({ ...formConfig, title: e.target.value })}
              placeholder="e.g. OFF THE RECORDS"
              required
              className="w-full bg-white border border-black p-2 text-sm font-serif font-black uppercase text-black focus:outline-none focus:ring-1 focus:ring-[#8b0000]"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-bold uppercase text-black mb-1 flex items-center justify-between">
              <span>Section Introduction Text</span>
              <span className="text-[10px] font-mono text-gray-500 font-normal">
                {formConfig.introduction?.length || 0} characters
              </span>
            </label>
            <textarea
              rows={4}
              value={formConfig.introduction}
              onChange={(e) => setFormConfig({ ...formConfig, introduction: e.target.value })}
              placeholder="Write an intro explaining what is logged off the record..."
              required
              className="w-full bg-white border border-black p-2.5 text-xs font-serif leading-relaxed text-black focus:outline-none focus:ring-1 focus:ring-[#8b0000]"
            />
            <p className="text-[10px] font-sans text-gray-500 mt-1">
              This introduction appears at the top of the Off the Record reading shelf for all visitors.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-black mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase text-gray-600 hover:text-black border border-gray-400 hover:border-black bg-white transition-colors"
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditOffTheRecordModalOpen(false)}
                className="px-4 py-2 font-sans font-bold uppercase text-xs text-[#4a4a4a] hover:text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#8b0000] hover:bg-black text-white px-6 py-2 font-sans font-bold uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} />
                <span>{savedSuccess ? 'SAVED PERMANENTLY!' : 'SAVE & PUBLISH'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
