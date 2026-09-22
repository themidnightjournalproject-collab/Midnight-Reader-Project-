import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import { TimelineStats, TimelineMilestone } from '../../types';
import { Clock, Plus, Trash2, Edit2, Check, Sparkles } from 'lucide-react';

export const TimelineEditorModal: React.FC = () => {
  const { 
    timelineStats, 
    updateTimelineStats, 
    timelineMilestones, 
    addTimelineMilestone, 
    updateTimelineMilestone, 
    deleteTimelineMilestone, 
    isTimelineEditorOpen, 
    setIsTimelineEditorOpen 
  } = useJournal();

  const [formStats, setFormStats] = useState<TimelineStats>({ ...timelineStats });
  const [activeTab, setActiveTab] = useState<'stats' | 'milestones'>('stats');

  // New Milestone Form state
  const [newMilestone, setNewMilestone] = useState<Omit<TimelineMilestone, 'id'>>({
    year: new Date().getFullYear(),
    date: 'Feb 2026',
    title: '',
    description: '',
    badgeText: 'Milestone',
    highlightType: 'general'
  });
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  // Inline editing of a milestone
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editMilestoneData, setEditMilestoneData] = useState<Partial<TimelineMilestone>>({});

  if (!isTimelineEditorOpen) return null;

  const handleSubmitStats = (e: React.FormEvent) => {
    e.preventDefault();
    updateTimelineStats(formStats);
    setIsTimelineEditorOpen(false);
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.title.trim()) return;
    addTimelineMilestone(newMilestone);
    setNewMilestone({
      year: new Date().getFullYear(),
      date: 'Feb 2026',
      title: '',
      description: '',
      badgeText: 'Milestone',
      highlightType: 'general'
    });
    setShowAddMilestone(false);
  };

  const handleStartEditMilestone = (ms: TimelineMilestone) => {
    setEditingMilestoneId(ms.id);
    setEditMilestoneData({ ...ms });
  };

  const handleSaveEditMilestone = (id: string) => {
    updateTimelineMilestone(id, editMilestoneData);
    setEditingMilestoneId(null);
    setEditMilestoneData({});
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-black w-full max-w-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="text-[#8b0000]" size={22} />
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-bold tracking-widest block">
                CHRONOLOGICAL LEDGER CONTROL
              </span>
              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase font-serif">
                EDIT TIMELINE STATS & MILESTONES
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsTimelineEditorOpen(false)}
            className="p-1 hover:bg-[#e8e2d8] text-black font-sans font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center border-b border-black mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 text-xs font-sans uppercase font-bold transition-colors ${
              activeTab === 'stats'
                ? 'bg-black text-white'
                : 'text-[#4a4a4a] hover:bg-[#f5f2ed] hover:text-black'
            }`}
          >
            Timeline Metrics & Header
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('milestones')}
            className={`px-4 py-2 text-xs font-sans uppercase font-bold transition-colors ${
              activeTab === 'milestones'
                ? 'bg-black text-white'
                : 'text-[#4a4a4a] hover:bg-[#f5f2ed] hover:text-black'
            }`}
          >
            Historical Milestones ({timelineMilestones.length})
          </button>
        </div>

        {activeTab === 'stats' ? (
          /* Stats Form */
          <form onSubmit={handleSubmitStats} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Archive Span
                </label>
                <input
                  type="text"
                  value={formStats.archiveSpan}
                  onChange={(e) => setFormStats({ ...formStats, archiveSpan: e.target.value })}
                  placeholder="e.g. 2024 – 2026 Archive"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Average Reading Pace
                </label>
                <input
                  type="text"
                  value={formStats.readingPace}
                  onChange={(e) => setFormStats({ ...formStats, readingPace: e.target.value })}
                  placeholder="e.g. 3.2 Days per Investigation"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Fastest Investigation
                </label>
                <input
                  type="text"
                  value={formStats.fastestInvestigation}
                  onChange={(e) => setFormStats({ ...formStats, fastestInvestigation: e.target.value })}
                  placeholder="e.g. The Silent Patient (18 Hours)"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Longest Case File
                </label>
                <input
                  type="text"
                  value={formStats.longestCaseFile}
                  onChange={(e) => setFormStats({ ...formStats, longestCaseFile: e.target.value })}
                  placeholder="e.g. I Am Pilgrim (620 Pages)"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Cold Cases Solved / Dossiers
                </label>
                <input
                  type="text"
                  value={formStats.coldCasesSolved}
                  onChange={(e) => setFormStats({ ...formStats, coldCasesSolved: e.target.value })}
                  placeholder="e.g. 14 Dossiers Closed"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Historical Ledger Note
                </label>
                <input
                  type="text"
                  value={formStats.historicalLedgerNote}
                  onChange={(e) => setFormStats({ ...formStats, historicalLedgerNote: e.target.value })}
                  placeholder="Chronological description of reading records"
                  className="w-full bg-white border border-black p-2 text-xs"
                />
              </div>
            </div>

            {/* Custom Stat 1 */}
            <div className="border-t border-black pt-3">
              <h4 className="font-bold uppercase text-[10px] text-[#8b0000] tracking-wider mb-2">
                Custom Timeline Stat #1
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Label</label>
                  <input
                    type="text"
                    value={formStats.customTimelineStat1Label || ''}
                    onChange={(e) => setFormStats({ ...formStats, customTimelineStat1Label: e.target.value })}
                    placeholder="e.g. NIGHT OWL DISPATCHES"
                    className="w-full bg-white border border-black p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Value</label>
                  <input
                    type="text"
                    value={formStats.customTimelineStat1Value || ''}
                    onChange={(e) => setFormStats({ ...formStats, customTimelineStat1Value: e.target.value })}
                    placeholder="e.g. 88% Read Past Midnight"
                    className="w-full bg-white border border-black p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Custom Stat 2 */}
            <div className="border-t border-black pt-3">
              <h4 className="font-bold uppercase text-[10px] text-[#8b0000] tracking-wider mb-2">
                Custom Timeline Stat #2
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Label</label>
                  <input
                    type="text"
                    value={formStats.customTimelineStat2Label || ''}
                    onChange={(e) => setFormStats({ ...formStats, customTimelineStat2Label: e.target.value })}
                    placeholder="e.g. READING STREAK RECORD"
                    className="w-full bg-white border border-black p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Value</label>
                  <input
                    type="text"
                    value={formStats.customTimelineStat2Value || ''}
                    onChange={(e) => setFormStats({ ...formStats, customTimelineStat2Value: e.target.value })}
                    placeholder="e.g. 74 Consecutive Days"
                    className="w-full bg-white border border-black p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-black">
              <button
                type="button"
                onClick={() => setIsTimelineEditorOpen(false)}
                className="px-4 py-2 border border-black text-[#1a1a1a] hover:bg-[#e8e2d8] font-bold uppercase text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-black hover:bg-[#8b0000] text-white font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-colors"
              >
                Save Timeline Stats
              </button>
            </div>
          </form>
        ) : (
          /* Milestones Management */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-[#4a4a4a] italic">
                Manage historical events and breakthrough solves in your reading chronology.
              </span>
              <button
                type="button"
                onClick={() => setShowAddMilestone(!showAddMilestone)}
                className="flex items-center gap-1 bg-[#8b0000] text-white px-3 py-1 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Plus size={13} />
                <span>{showAddMilestone ? 'Close Form' : 'Add Milestone'}</span>
              </button>
            </div>

            {/* Add Milestone Form */}
            {showAddMilestone && (
              <form onSubmit={handleCreateMilestone} className="p-4 border-2 border-black bg-[#f5f2ed] space-y-3 text-xs">
                <h4 className="font-bold uppercase text-[#8b0000] text-[11px]">
                  NEW HISTORICAL MILESTONE
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Year</label>
                    <input
                      type="number"
                      value={newMilestone.year}
                      onChange={(e) => setNewMilestone({ ...newMilestone, year: Number(e.target.value) })}
                      className="w-full bg-white border border-black p-1.5 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Date Tag</label>
                    <input
                      type="text"
                      value={newMilestone.date}
                      onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                      placeholder="e.g. Feb 2026"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Title</label>
                  <input
                    type="text"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    placeholder="Milestone title"
                    className="w-full bg-white border border-black p-1.5 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Description</label>
                  <textarea
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                    rows={2}
                    placeholder="Details about this breakthrough or milestone..."
                    className="w-full bg-white border border-black p-1.5 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={newMilestone.badgeText || ''}
                      onChange={(e) => setNewMilestone({ ...newMilestone, badgeText: e.target.value })}
                      placeholder="e.g. Breakthrough Solve"
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Type</label>
                    <select
                      value={newMilestone.highlightType}
                      onChange={(e) => setNewMilestone({ ...newMilestone, highlightType: e.target.value as any })}
                      className="w-full bg-white border border-black p-1.5 text-xs"
                    >
                      <option value="breakthrough">Breakthrough</option>
                      <option value="record">Record</option>
                      <option value="cold-case">Cold Case</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMilestone(false)}
                    className="px-3 py-1 border border-black bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-black text-white font-bold"
                  >
                    Add Milestone
                  </button>
                </div>
              </form>
            )}

            {/* Existing Milestones List */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {timelineMilestones.map((ms) => {
                const isEditing = editingMilestoneId === ms.id;

                if (isEditing) {
                  return (
                    <div key={ms.id} className="p-3 border-2 border-[#8b0000] bg-white space-y-2 text-xs">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          value={editMilestoneData.year || ms.year}
                          onChange={(e) => setEditMilestoneData({ ...editMilestoneData, year: Number(e.target.value) })}
                          className="border border-black p-1 text-xs"
                        />
                        <input
                          type="text"
                          value={editMilestoneData.date || ms.date}
                          onChange={(e) => setEditMilestoneData({ ...editMilestoneData, date: e.target.value })}
                          className="border border-black p-1 text-xs"
                        />
                        <input
                          type="text"
                          value={editMilestoneData.badgeText || ms.badgeText || ''}
                          onChange={(e) => setEditMilestoneData({ ...editMilestoneData, badgeText: e.target.value })}
                          placeholder="Badge"
                          className="border border-black p-1 text-xs"
                        />
                      </div>
                      <input
                        type="text"
                        value={editMilestoneData.title || ms.title}
                        onChange={(e) => setEditMilestoneData({ ...editMilestoneData, title: e.target.value })}
                        className="w-full border border-black p-1 text-xs font-bold"
                      />
                      <textarea
                        value={editMilestoneData.description || ms.description}
                        onChange={(e) => setEditMilestoneData({ ...editMilestoneData, description: e.target.value })}
                        rows={2}
                        className="w-full border border-black p-1 text-xs"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingMilestoneId(null)}
                          className="px-2 py-1 text-xs border border-black"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEditMilestone(ms.id)}
                          className="px-3 py-1 text-xs bg-[#8b0000] text-white font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={ms.id}
                    className="flex items-start justify-between p-3 border border-black bg-[#fdfbf7] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#8b0000] text-white text-[10px] font-bold px-1.5 py-0.2">
                          {ms.date} ({ms.year})
                        </span>
                        {ms.badgeText && (
                          <span className="border border-black text-[10px] font-mono px-1">
                            {ms.badgeText}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">
                        {ms.title}
                      </h4>
                      <p className="font-serif text-xs text-[#4a4a4a]">
                        {ms.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => handleStartEditMilestone(ms)}
                        className="p-1 hover:bg-[#e8e2d8] text-black"
                        title="Edit milestone"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete milestone "${ms.title}"?`)) {
                            deleteTimelineMilestone(ms.id);
                          }
                        }}
                        className="p-1 hover:bg-red-100 text-red-700"
                        title="Delete milestone"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
