import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { 
  Database, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  FileCode, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

export const BackupSyncSection: React.FC = () => {
  const { 
    reviews, 
    exportDataAsJSON, 
    importDataFromJSON, 
    generateSeedCode, 
    resetToDefaults,
    postLikes,
    readerPollVotes,
    witnessComments,
    isAdminUnlocked,
    setIsAdminModalOpen,
    setActiveView,
    adminPasscode
  } = useJournal();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'json' | 'import'>('code');
  const [showPasscode, setShowPasscode] = useState(false);

  const generatedCode = generateSeedCode();
  const exportedJSON = exportDataAsJSON();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleDownloadSeedTS = () => {
    const blob = new Blob([generatedCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'initialData.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(exportedJSON);
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 3000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([exportedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-midnight-journal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
        const result = importDataFromJSON(content);
        setImportStatus(result);
      }
    };
    reader.readAsText(file);
  };

  const handleImportTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const result = importDataFromJSON(importText);
    setImportStatus(result);
  };

  if (!isAdminUnlocked) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-[#f5f2ed] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="w-12 h-12 bg-black text-[#f5f2ed] mx-auto flex items-center justify-center border-2 border-[#8b0000]">
            <Database size={24} />
          </div>
          <span className="font-mono text-xs uppercase font-bold text-[#8b0000] tracking-widest block">
            CLASSIFIED VAULT • REDEPLOYMENT SYNC
          </span>
          <h2 className="font-serif text-3xl font-black uppercase text-[#1a1a1a]">
            CHIEF INVESTIGATOR CLEARANCE REQUIRED
          </h2>
          <p className="font-serif text-sm italic text-[#4a4a4a] max-w-md mx-auto">
            This backup and seed generation vault is reserved for the site owner to download persistent backups and generate repository seed files.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveView('home')}
              className="px-5 py-2 border-2 border-black font-sans text-xs font-bold uppercase hover:bg-white transition-colors"
            >
              Return to Front Page
            </button>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-5 py-2 bg-[#8b0000] hover:bg-black text-white font-sans text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors"
            >
              Unlock Editor Vault
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <header className="border-b-4 border-black pb-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-[#8b0000]">
          <Database size={15} />
          <span>DATA PORTABILITY & REDEPLOYMENT REPOSITORY SYNC</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#1a1a1a] tracking-tight font-serif">
          Save & Sync All Edits For Redeployment
        </h1>

        <p className="font-serif italic text-base text-[#4a4a4a] leading-relaxed">
          When you edit book files or change your Chief Investigator passcode, it is instantly active on this browser.
          Use this hub to <strong>download or copy your updated <code className="font-mono bg-white px-1 border border-black text-xs">initialData.ts</code> file</strong> so your custom reviews and updated password stay permanent across new builds, repository pushes, and redeployments!
        </p>

        {/* Live sync stats banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-sans font-bold text-[#737373] uppercase block">
              Live Case Files
            </span>
            <span className="font-mono text-xl font-bold text-[#1a1a1a]">
              {reviews.length} Files
            </span>
          </div>

          <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-sans font-bold text-[#737373] uppercase block">
              Total Endorsements
            </span>
            <span className="font-mono text-xl font-bold text-[#8b0000]">
              {Object.values(postLikes).reduce((a: number, b: number) => a + (Number(b) || 0), 0)} Likes
            </span>
          </div>

          <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-sans font-bold text-[#737373] uppercase block">
              Reader Poll Votes
            </span>
            <span className="font-mono text-xl font-bold text-[#1a1a1a]">
              {Object.values(readerPollVotes).reduce((acc: number, p) => {
                const pollObj = p as Record<string, number>;
                return acc + Object.values(pollObj).reduce((a: number, b: number) => a + (Number(b) || 0), 0);
              }, 0)} Cast
            </span>
          </div>

          <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-sans font-bold text-[#737373] uppercase block">
              Master Passcode
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-[#8b0000]">
                <span>{showPasscode ? adminPasscode : '••••••••'}</span>
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="text-[#737373] hover:text-black"
                  title={showPasscode ? 'Mask passcode' : 'Show passcode'}
                >
                  {showPasscode ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="text-[10px] underline text-[#4a4a4a] hover:text-black font-sans uppercase font-bold"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs navigation */}
      <div className="flex border-b-2 border-black gap-2">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'code'
              ? 'bg-black text-white'
              : 'bg-white text-[#1a1a1a] hover:bg-[#faf7f2] border-t-2 border-l-2 border-r-2 border-transparent'
          }`}
        >
          <FileCode size={14} />
          <span>1. Production Code Export (initialData.ts)</span>
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-2 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'json'
              ? 'bg-black text-white'
              : 'bg-white text-[#1a1a1a] hover:bg-[#faf7f2]'
          }`}
        >
          <Download size={14} />
          <span>2. Download JSON Backup</span>
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`flex items-center gap-2 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'import'
              ? 'bg-black text-white'
              : 'bg-white text-[#1a1a1a] hover:bg-[#faf7f2]'
          }`}
        >
          <Upload size={14} />
          <span>3. Restore / Import Backup</span>
        </button>
      </div>

      {/* TAB 1: TypeScript Seed Code Generator */}
      {activeTab === 'code' && (
        <div className="bg-white border-2 border-black p-6 space-y-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black border-opacity-20 pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold uppercase text-[#1a1a1a]">
                Generated Seed Code for <code className="bg-[#f5f2ed] px-1.5 py-0.5 font-mono text-sm">src/data/initialData.ts</code>
              </h3>
              <p className="font-serif italic text-xs text-[#4a4a4a] mt-0.5">
                Contains your custom passcode (<code>INITIAL_ADMIN_PASSCODE = '{adminPasscode}'</code>) and all {reviews.length} book reviews so everything survives fresh redeployments!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 bg-white hover:bg-[#faf7f2] text-[#1a1a1a] border border-black px-3.5 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                {copiedCode ? <Check size={13} className="text-green-700" /> : <Copy size={13} />}
                <span>{copiedCode ? 'COPIED!' : 'COPY CODE'}</span>
              </button>

              <button
                onClick={handleDownloadSeedTS}
                className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-black text-white px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                title="Download initialData.ts to replace in your project directory"
              >
                <Download size={14} />
                <span>DOWNLOAD initialData.ts</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-[#1a1a1a] text-[#f5f2ed] p-4 text-xs font-mono max-h-96 overflow-y-auto border border-black selection:bg-[#8b0000]">
              <code>{generatedCode}</code>
            </pre>
          </div>

          <div className="bg-[#f5f2ed] border-l-4 border-[#8b0000] p-4 text-xs font-sans space-y-1">
            <strong className="uppercase font-bold text-[#8b0000] block">How to persist permanently on redeploy:</strong>
            <p className="text-[#333]">1. Click <strong>DOWNLOAD initialData.ts</strong> (or Copy Code) above.</p>
            <p className="text-[#333]">2. Place this file in your project at <code>src/data/initialData.ts</code>.</p>
            <p className="text-[#333]">3. Run <code>npm run build</code> or commit/push to your hosting provider. Your custom passcode and all edited reviews are permanently baked into your production site!</p>
          </div>
        </div>
      )}

      {/* TAB 2: JSON Backup */}
      {activeTab === 'json' && (
        <div className="bg-white border-2 border-black p-6 space-y-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black border-opacity-20 pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold uppercase text-[#1a1a1a]">
                Download Complete Archive JSON
              </h3>
              <p className="font-serif italic text-xs text-[#4a4a4a] mt-0.5">
                Contains all {reviews.length} book reviews, detective theories, suspect ratings, witness comments, active passcode, and like tallies in a portable standard JSON format.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJSON}
                className="flex items-center gap-1.5 bg-white hover:bg-[#faf7f2] text-[#1a1a1a] border border-black px-3 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all"
              >
                {copiedJSON ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedJSON ? 'Copied!' : 'Copy JSON'}</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-black text-white px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
              >
                <Download size={14} />
                <span>DOWNLOAD .JSON FILE</span>
              </button>
            </div>
          </div>

          <pre className="bg-[#faf9f5] text-[#1a1a1a] p-4 text-xs font-mono max-h-72 overflow-y-auto border border-black border-opacity-30">
            <code>{exportedJSON}</code>
          </pre>
        </div>
      )}

      {/* TAB 3: Import / Restore */}
      {activeTab === 'import' && (
        <div className="bg-white border-2 border-black p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <h3 className="font-serif text-xl font-bold uppercase text-[#1a1a1a]">
              Restore Data from Backup
            </h3>
            <p className="font-serif italic text-xs text-[#4a4a4a] mt-0.5">
              Upload a previously exported JSON backup file or paste its content to instantly restore all case files, likes, and custom theories.
            </p>
          </div>

          {importStatus && (
            <div className={`p-4 border-2 font-sans text-xs flex items-center gap-2 ${
              importStatus.success 
                ? 'bg-[#dcfce7] border-[#166534] text-[#166534]' 
                : 'bg-[#fee2e2] border-[#8b0000] text-[#8b0000]'
            }`}>
              {importStatus.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span className="font-bold">{importStatus.message}</span>
            </div>
          )}

          {/* Option A: Upload JSON file */}
          <div className="border-2 border-dashed border-black p-6 text-center space-y-3 bg-[#faf9f5]">
            <Upload size={24} className="mx-auto text-[#4a4a4a]" />
            <div className="space-y-1">
              <span className="font-sans text-xs font-bold uppercase tracking-wider block text-[#1a1a1a]">
                Upload JSON Backup File
              </span>
              <p className="text-xs text-[#737373] font-serif">
                Select your previously downloaded <code>.json</code> file to restore
              </p>
            </div>
            <label className="inline-block cursor-pointer bg-black text-white hover:bg-[#8b0000] px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span>Choose File</span>
              <input 
                type="file" 
                accept=".json,application/json" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          </div>

          {/* Option B: Paste JSON */}
          <form onSubmit={handleImportTextSubmit} className="space-y-3">
            <label className="block font-sans text-xs font-bold uppercase text-[#1a1a1a] tracking-wider">
              Or Paste JSON Content Directly:
            </label>
            <textarea
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste raw JSON backup here..."
              className="w-full bg-[#fbf9f5] border border-black p-3 font-mono text-xs focus:outline-none focus:bg-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#8b0000] hover:bg-black text-white px-5 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
              >
                Restore From Pasted JSON
              </button>
            </div>
          </form>

          {/* Danger Zone: Reset */}
          <div className="pt-6 border-t-2 border-black border-dashed flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-sans font-bold text-xs uppercase text-[#8b0000] block">
                Reset Archive to Defaults
              </span>
              <span className="text-xs font-serif text-[#737373]">
                Revert all books and metrics back to original repository default records.
              </span>
            </div>
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000] hover:text-white font-sans text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset Archive</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
