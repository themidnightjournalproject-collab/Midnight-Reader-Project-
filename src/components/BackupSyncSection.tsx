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
  EyeOff,
  Github,
  ExternalLink,
  CloudUpload,
  HelpCircle,
  LogOut,
  Cookie,
  Layers
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
    adminPasscode,
    githubUser,
    isGitHubConnected,
    isGitHubConfigured,
    connectGitHubWithOAuth,
    connectGitHubWithToken,
    disconnectGitHub,
    syncToGitHub,
    setIsGitHubModalOpen
  } = useJournal();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'json' | 'import' | 'github'>('github');
  const [showPasscode, setShowPasscode] = useState(false);
  const [githubTokenInput, setGithubTokenInput] = useState('');
  const [isVerifyingGhToken, setIsVerifyingGhToken] = useState(false);
  const [isSyncingGh, setIsSyncingGh] = useState(false);
  const [ghStatusMsg, setGhStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string; link?: string } | null>(null);
  const [copiedCallback, setCopiedCallback] = useState<string | null>(null);

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
      <div className="flex border-b-2 border-black gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('github')}
          className={`flex items-center gap-2 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'github'
              ? 'bg-black text-white'
              : 'bg-white text-[#1a1a1a] hover:bg-[#faf7f2]'
          }`}
        >
          <Github size={14} className={isGitHubConnected ? 'text-green-400' : 'text-[#8b0000]'} />
          <span>GitHub Cloud Sync & Clearance {isGitHubConnected ? `(@${githubUser?.username})` : ''}</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'code'
              ? 'bg-black text-white'
              : 'bg-white text-[#1a1a1a] hover:bg-[#faf7f2]'
          }`}
        >
          <FileCode size={14} />
          <span>Code Export (initialData.ts)</span>
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
          <span>Download JSON</span>
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
          <span>Restore Backup</span>
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

      {/* TAB 4: GitHub Cloud Sync & Clearance */}
      {activeTab === 'github' && (
        <div className="bg-white border-2 border-black p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black border-opacity-20 pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold uppercase text-[#1a1a1a] flex items-center gap-2">
                <Github size={20} />
                <span>GitHub Cloud Sync & Chief Investigator Clearance</span>
              </h3>
              <p className="font-serif italic text-xs text-[#4a4a4a] mt-0.5">
                Link your GitHub identity to authenticate editorial permissions and back up your case files directly to GitHub.
              </p>
            </div>

            {isGitHubConnected && (
              <button
                onClick={async () => {
                  await disconnectGitHub();
                  setGhStatusMsg({ type: 'info', text: 'GitHub account disconnected.' });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000] hover:text-white text-xs font-sans font-bold uppercase transition-colors"
              >
                <LogOut size={13} />
                <span>Disconnect</span>
              </button>
            )}
          </div>

          {/* Status Message */}
          {ghStatusMsg && (
            <div className={`p-4 border-2 text-xs font-sans flex items-start gap-2 ${
              ghStatusMsg.type === 'success'
                ? 'bg-[#dcfce7] border-[#166534] text-[#166534]'
                : ghStatusMsg.type === 'error'
                ? 'bg-[#fee2e2] border-[#8b0000] text-[#8b0000]'
                : 'bg-[#eff6ff] border-[#1d4ed8] text-[#1e40af]'
            }`}>
              {ghStatusMsg.type === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              ) : ghStatusMsg.type === 'error' ? (
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              ) : (
                <HelpCircle size={16} className="shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold leading-relaxed">{ghStatusMsg.text}</span>
                {ghStatusMsg.link && (
                  <div>
                    <a
                      href={ghStatusMsg.link}
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-bold inline-flex items-center gap-1 hover:text-black"
                    >
                      <span>Open Synced Backup on GitHub</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connection Overview Card */}
          <div className="bg-[#faf9f5] border-2 border-black p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {githubUser?.avatarUrl ? (
                <img
                  src={githubUser.avatarUrl}
                  alt={githubUser.username}
                  className="w-14 h-14 rounded border-2 border-black object-cover"
                />
              ) : (
                <div className="w-14 h-14 bg-black text-white flex items-center justify-center border-2 border-black">
                  <Github size={28} />
                </div>
              )}
              <div>
                <span className="text-[10px] font-sans font-bold text-[#737373] uppercase tracking-wider block">
                  Identity Status
                </span>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-black text-lg text-[#1a1a1a]">
                    {isGitHubConnected ? (githubUser?.name || `@${githubUser?.username}`) : 'No GitHub Account Linked'}
                  </h4>
                  {isGitHubConnected ? (
                    <span className="bg-[#dcfce7] border border-[#166534] text-[#166534] text-[10px] font-mono font-bold px-2 py-0.5 flex items-center gap-1">
                      <CheckCircle2 size={11} /> VERIFIED
                    </span>
                  ) : (
                    <span className="bg-[#fee2e2] border border-[#8b0000] text-[#8b0000] text-[10px] font-mono font-bold px-2 py-0.5">
                      NOT REGISTERED
                    </span>
                  )}
                </div>
                {isGitHubConnected ? (
                  <p className="font-serif text-xs italic text-[#4a4a4a] mt-0.5">
                    Logged in as <a href={githubUser?.profileUrl} target="_blank" rel="noreferrer" className="underline font-bold text-black">@{githubUser?.username}</a> • Full editorial clearance granted
                  </p>
                ) : (
                  <p className="font-serif text-xs italic text-[#4a4a4a] mt-0.5">
                    Connect using OAuth popup or Personal Access Token below to register your identity.
                  </p>
                )}
              </div>
            </div>

            {isGitHubConnected ? (
              <button
                onClick={async () => {
                  setIsSyncingGh(true);
                  setGhStatusMsg(null);
                  const res = await syncToGitHub();
                  setIsSyncingGh(false);
                  if (res.success) {
                    setGhStatusMsg({
                      type: 'success',
                      text: 'Case files, non-fiction dossiers, and stats successfully backed up to your GitHub account!',
                      link: res.gistUrl
                    });
                  } else {
                    setGhStatusMsg({
                      type: 'error',
                      text: res.message || 'Failed to sync to GitHub.'
                    });
                  }
                }}
                disabled={isSyncingGh}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#8b0000] hover:bg-black text-white font-sans text-xs font-bold uppercase tracking-wider transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
              >
                <CloudUpload size={15} />
                <span>{isSyncingGh ? 'Backing Up...' : 'Backup Archive to GitHub'}</span>
              </button>
            ) : (
              <button
                onClick={async () => {
                  setGhStatusMsg(null);
                  const res = await connectGitHubWithOAuth();
                  if (!res.success) {
                    if (res.needsConfig) {
                      setGhStatusMsg({
                        type: 'info',
                        text: 'OAuth Client ID not set in environment variables. You can connect instantly below using a Personal Access Token (PAT).'
                      });
                    } else {
                      setGhStatusMsg({
                        type: 'error',
                        text: res.message || 'Could not launch GitHub OAuth popup.'
                      });
                    }
                  } else {
                    setGhStatusMsg({
                      type: 'info',
                      text: 'Authorization window opened. Complete the sign-in on GitHub to register your account.'
                    });
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-[#8b0000] text-white font-sans text-xs font-bold uppercase tracking-wider transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <Github size={15} />
                <span>Launch GitHub OAuth Sign In</span>
              </button>
            )}
          </div>

          {/* Option 2: Instant Token Connect (100% Reliable in iframes) */}
          <div className="border-2 border-black p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-black border-opacity-20 pb-2">
              <div>
                <h4 className="font-serif text-base font-bold uppercase text-[#1a1a1a] flex items-center gap-2">
                  <Key size={16} />
                  <span>Instant Connect via Personal Access Token (PAT)</span>
                </h4>
                <p className="font-serif text-xs italic text-[#4a4a4a]">
                  If the AI Studio preview browser window is blocking third-party cookies or OAuth popups, paste a GitHub token here to register your account instantly.
                </p>
              </div>
              <span className="bg-[#dcfce7] text-[#166534] border border-[#166534] text-[10px] font-mono font-bold px-2 py-0.5 shrink-0">
                100% IFRAME COMPATIBLE
              </span>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!githubTokenInput.trim()) return;
                setIsVerifyingGhToken(true);
                setGhStatusMsg(null);
                const res = await connectGitHubWithToken(githubTokenInput.trim());
                setIsVerifyingGhToken(false);
                if (res.success) {
                  setGithubTokenInput('');
                  setGhStatusMsg({
                    type: 'success',
                    text: `Clearance granted! Registered as @${res.user?.username}. Chief Investigator desk unlocked.`
                  });
                } else {
                  setGhStatusMsg({
                    type: 'error',
                    text: res.message || 'Verification failed. Please check token permissions.'
                  });
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-sans font-bold uppercase text-[#1a1a1a] mb-1">
                  GitHub Personal Access Token (classic or fine-grained):
                </label>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxx"
                  value={githubTokenInput}
                  onChange={(e) => setGithubTokenInput(e.target.value)}
                  className="w-full bg-[#fbf9f5] border-2 border-black p-2.5 font-mono text-xs focus:outline-none focus:bg-white focus:border-[#8b0000]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <a
                  href="https://github.com/settings/tokens/new?scopes=read:user,repo,gist&description=The%20Midnight%20Reader%20Clearance"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#8b0000] font-sans font-bold underline inline-flex items-center gap-1 hover:text-black"
                >
                  <span>Create token on GitHub (needs "read:user" and "gist" scopes)</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  type="submit"
                  disabled={isVerifyingGhToken || !githubTokenInput.trim()}
                  className="px-5 py-2 bg-[#8b0000] hover:bg-black text-white font-sans text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors disabled:opacity-50"
                >
                  {isVerifyingGhToken ? 'Verifying...' : 'Verify & Register GitHub Account'}
                </button>
              </div>
            </form>
          </div>

          {/* Diagnostic & Troubleshooting Guide */}
          <div className="border-2 border-black p-5 space-y-4 bg-[#faf7f2]">
            <div className="border-b border-black border-opacity-20 pb-2">
              <h4 className="font-serif text-base font-bold uppercase text-[#1a1a1a] flex items-center gap-2">
                <HelpCircle size={16} className="text-[#8b0000]" />
                <span>Why Does AI Studio Sign-In "Not Register Here"? (Diagnostic Guide)</span>
              </h4>
              <p className="font-serif text-xs italic text-[#4a4a4a]">
                When signing into GitHub inside Google AI Studio, browsers often block the session handshake. Here is how to fix each common issue:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
              {/* Card 1: Third Party Cookies */}
              <div className="bg-white border border-black p-3.5 space-y-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[#8b0000]">
                  <Cookie size={14} />
                  <span>1. Third-Party Cookies Blocked</span>
                </div>
                <p className="text-[#444] leading-relaxed text-[11px]">
                  AI Studio embeds previews in an iframe on Cloud Run. Modern browsers (Chrome, Safari, Brave) block third-party cookies inside iframes by default, preventing the callback token from saving.
                </p>
                <div className="bg-[#f5f2ed] p-2 border border-black border-opacity-20 text-[11px] font-bold">
                  Fix: Click the Eye / Cookie icon in your browser URL bar & select <strong>"Allow third-party cookies"</strong>.
                </div>
              </div>

              {/* Card 2: Popup Cross-Origin Opener */}
              <div className="bg-white border border-black p-3.5 space-y-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[#8b0000]">
                  <Layers size={14} />
                  <span>2. Popup Opener Severed</span>
                </div>
                <p className="text-[#444] leading-relaxed text-[11px]">
                  Cross-Origin Opener Policies (COOP) cause the browser to sever communication between the GitHub popup and the AI Studio tab. The popup closes, but the token never arrives.
                </p>
                <div className="bg-[#f5f2ed] p-2 border border-black border-opacity-20 text-[11px] font-bold">
                  Fix: Use the <strong>Personal Access Token (PAT)</strong> form above to register without popups.
                </div>
              </div>

              {/* Card 3: OAuth App Callback URLs */}
              <div className="bg-white border border-black p-3.5 space-y-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] md:col-span-2">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[#8b0000]">
                  <ShieldCheck size={14} />
                  <span>3. GitHub OAuth App Callback URLs Configuration</span>
                </div>
                <p className="text-[#444] text-[11px]">
                  If using your own GitHub OAuth App at <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer" className="underline font-bold text-black">github.com/settings/developers</a>, enter these exact callback URLs:
                </p>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between bg-[#f5f2ed] p-2 border border-black">
                    <span className="truncate pr-2">Development: https://ais-dev-7a43o27kf6udvsfyljb4qn-408687408593.asia-east1.run.app/auth/github/callback</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("https://ais-dev-7a43o27kf6udvsfyljb4qn-408687408593.asia-east1.run.app/auth/github/callback");
                        setCopiedCallback('dev');
                        setTimeout(() => setCopiedCallback(null), 2500);
                      }}
                      className="text-[10px] uppercase font-bold text-[#8b0000] underline font-sans shrink-0 ml-2"
                    >
                      {copiedCallback === 'dev' ? 'Copied' : 'Copy URL'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-[#f5f2ed] p-2 border border-black">
                    <span className="truncate pr-2">Shared App: https://ais-pre-7a43o27kf6udvsfyljb4qn-408687408593.asia-east1.run.app/auth/github/callback</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("https://ais-pre-7a43o27kf6udvsfyljb4qn-408687408593.asia-east1.run.app/auth/github/callback");
                        setCopiedCallback('pre');
                        setTimeout(() => setCopiedCallback(null), 2500);
                      }}
                      className="text-[10px] uppercase font-bold text-[#8b0000] underline font-sans shrink-0 ml-2"
                    >
                      {copiedCallback === 'pre' ? 'Copied' : 'Copy URL'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
