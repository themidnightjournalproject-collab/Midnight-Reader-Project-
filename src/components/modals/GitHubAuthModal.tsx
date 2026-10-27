import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import { 
  Github, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Key, 
  ShieldCheck, 
  CloudUpload, 
  HelpCircle, 
  Check, 
  Copy, 
  LogOut, 
  RefreshCw,
  Cookie,
  Layers,
  ArrowRight
} from 'lucide-react';

export const GitHubAuthModal: React.FC = () => {
  const {
    isGitHubModalOpen,
    setIsGitHubModalOpen,
    githubUser,
    isGitHubConnected,
    isGitHubConfigured,
    connectGitHubWithOAuth,
    connectGitHubWithToken,
    disconnectGitHub,
    syncToGitHub
  } = useJournal();

  const [activeTab, setActiveTab] = useState<'connect' | 'pat' | 'diagnostics'>('connect');
  const [tokenInput, setTokenInput] = useState('');
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string; link?: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (!isGitHubModalOpen) return null;

  const currentDevCallback = "https://ais-dev-7a43o27kf6udvsfyljb4qn-408687408593.asia-east1.run.app/auth/github/callback";
  const currentSharedCallback = "https://ais-pre-7a43o27kf6udvsfyljb4qn-408687408593.asia-east1.run.app/auth/github/callback";

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleOAuthConnect = async () => {
    setStatusMsg(null);
    const result = await connectGitHubWithOAuth();
    if (!result.success) {
      if (result.needsConfig) {
        setStatusMsg({
          type: 'info',
          text: 'GitHub OAuth Client ID is not configured in environment variables. You can connect instantly below using a GitHub Personal Access Token (PAT), or configure OAuth credentials in AI Studio.'
        });
        setActiveTab('pat');
      } else {
        setStatusMsg({
          type: 'error',
          text: result.message || 'Could not launch GitHub authorization popup.'
        });
      }
    } else {
      setStatusMsg({
        type: 'info',
        text: 'GitHub authorization window opened. Complete authorization in the popup to register your clearance here.'
      });
    }
  };

  const handleTokenConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setStatusMsg({ type: 'error', text: 'Please paste your GitHub Personal Access Token.' });
      return;
    }

    setIsVerifyingToken(true);
    setStatusMsg(null);

    const result = await connectGitHubWithToken(tokenInput.trim());
    setIsVerifyingToken(false);

    if (result.success) {
      setTokenInput('');
      setStatusMsg({
        type: 'success',
        text: `Clearance verified! Connected to GitHub as @${result.user?.username}. Chief Investigator desk unlocked.`
      });
    } else {
      setStatusMsg({
        type: 'error',
        text: result.message || 'Verification failed. Please ensure the token is active.'
      });
    }
  };

  const handleSyncToGist = async () => {
    setIsSyncing(true);
    setStatusMsg(null);

    const result = await syncToGitHub();
    setIsSyncing(false);

    if (result.success) {
      setStatusMsg({
        type: 'success',
        text: 'Backup successfully generated and synced to your GitHub account!',
        link: result.gistUrl
      });
    } else {
      setStatusMsg({
        type: 'error',
        text: result.message || 'Could not sync case files to GitHub.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-xs">
      <div className="bg-[#f5f2ed] border-4 border-black w-full max-w-xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Github size={18} className="text-[#e8e2d8]" />
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#e8e2d8]">
              GITHUB CLEARANCE & REPOSITORY SYNC
            </span>
          </div>
          <button
            onClick={() => {
              setIsGitHubModalOpen(false);
              setStatusMsg(null);
            }}
            className="text-white hover:text-[#8b0000] font-mono text-base font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">

          {/* Current Status Box */}
          <div className="bg-white border-2 border-black p-4 flex flex-wrap items-center justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              {githubUser?.avatarUrl ? (
                <img 
                  src={githubUser.avatarUrl} 
                  alt={githubUser.username}
                  className="w-12 h-12 rounded border-2 border-black object-cover" 
                />
              ) : (
                <div className="w-12 h-12 bg-[#1a1a1a] text-white flex items-center justify-center border-2 border-black">
                  <Github size={24} />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base text-[#1a1a1a]">
                    {isGitHubConnected ? (githubUser?.name || `@${githubUser?.username}`) : 'Not Signed In'}
                  </span>
                  {isGitHubConnected && (
                    <span className="bg-[#dcfce7] border border-[#166534] text-[#166534] text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 flex items-center gap-1">
                      <CheckCircle2 size={11} /> CONNECTED
                    </span>
                  )}
                </div>
                <p className="font-serif text-xs italic text-[#737373]">
                  {isGitHubConnected ? (
                    <>Connected as <a href={githubUser?.profileUrl} target="_blank" rel="noreferrer" className="underline font-bold text-black">@{githubUser?.username}</a> • Chief Investigator Clearance Active</>
                  ) : (
                    'Connect GitHub to unlock Chief Investigator privileges and sync case files'
                  )}
                </p>
              </div>
            </div>

            {isGitHubConnected && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncToGist}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8b0000] hover:bg-black text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                  title="Export case files and book ledger to a private GitHub Gist"
                >
                  <CloudUpload size={13} />
                  <span>{isSyncing ? 'Syncing...' : 'Backup to GitHub'}</span>
                </button>
                <button
                  onClick={disconnectGitHub}
                  className="p-1.5 border border-black hover:bg-[#fee2e2] text-[#8b0000] transition-colors"
                  title="Disconnect GitHub account"
                >
                  <LogOut size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Status Alert Banner */}
          {statusMsg && (
            <div className={`p-3.5 border-2 text-xs font-sans flex items-start gap-2 ${
              statusMsg.type === 'success' 
                ? 'bg-[#dcfce7] border-[#166534] text-[#166534]'
                : statusMsg.type === 'error'
                ? 'bg-[#fee2e2] border-[#8b0000] text-[#8b0000]'
                : 'bg-[#eff6ff] border-[#1d4ed8] text-[#1e40af]'
            }`}>
              {statusMsg.type === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              ) : statusMsg.type === 'error' ? (
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              ) : (
                <HelpCircle size={16} className="shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold leading-relaxed">{statusMsg.text}</span>
                {statusMsg.link && (
                  <div className="pt-1">
                    <a 
                      href={statusMsg.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="underline font-bold inline-flex items-center gap-1 text-[#166534] hover:text-black"
                    >
                      <span>Open Synced Backup on GitHub</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b-2 border-black gap-1">
            <button
              onClick={() => setActiveTab('connect')}
              className={`px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'connect'
                  ? 'bg-black text-white'
                  : 'bg-white text-[#1a1a1a] hover:bg-[#faf7f2]'
              }`}
            >
              1. OAuth Sign In
            </button>
            <button
              onClick={() => setActiveTab('pat')}
              className={`px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'pat'
                  ? 'bg-black text-white'
                  : 'bg-white text-[#1a1a1a] hover:bg-[#faf7f2]'
              }`}
            >
              <Key size={12} />
              <span>2. Personal Access Token</span>
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'diagnostics'
                  ? 'bg-black text-white'
                  : 'bg-white text-[#1a1a1a] hover:bg-[#faf7f2]'
              }`}
            >
              <HelpCircle size={12} />
              <span>3. Why Didn't It Register?</span>
            </button>
          </div>

          {/* TAB 1: OAuth Sign In */}
          {activeTab === 'connect' && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-black p-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold uppercase text-[#1a1a1a]">
                    Connect via GitHub OAuth
                  </h4>
                  <p className="font-serif text-xs italic text-[#4a4a4a]">
                    Click below to open the official GitHub authorization window directly. When authorized, the popup automatically passes your clearance credentials back to this window.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleOAuthConnect}
                    className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-[#8b0000] text-white font-sans text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors"
                  >
                    <Github size={15} />
                    <span>Authorize with GitHub</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('pat')}
                    className="text-xs font-sans font-bold underline text-[#4a4a4a] hover:text-black uppercase"
                  >
                    Or connect instantly via Token →
                  </button>
                </div>

                <div className="bg-[#faf9f5] border border-black p-3 text-xs font-serif text-[#4a4a4a] space-y-1">
                  <strong className="text-black font-sans uppercase text-[11px] block">
                    Important for AI Studio Previews:
                  </strong>
                  <p>
                    Because AI Studio runs applications inside a sandboxed iframe, browsers block cross-site cookies by default. If your browser blocks popups or does not register the sign-in, use <strong>Tab 2 (Personal Access Token)</strong> for an instant 100% reliable connection!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Personal Access Token (Instant Fail-Safe) */}
          {activeTab === 'pat' && (
            <div className="space-y-4">
              <form onSubmit={handleTokenConnect} className="bg-white border-2 border-black p-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-lg font-bold uppercase text-[#1a1a1a]">
                      Connect via GitHub Personal Access Token (PAT)
                    </h4>
                    <span className="bg-[#dcfce7] text-[#166534] border border-[#166534] text-[10px] font-mono font-bold px-1.5 py-0.5">
                      100% RELIABLE IN IFRAMES
                    </span>
                  </div>
                  <p className="font-serif text-xs italic text-[#4a4a4a]">
                    Bypasses all browser third-party cookie restrictions and popup blockers in AI Studio. Your token is verified directly with the official GitHub API.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase text-[#1a1a1a] mb-1 tracking-wider">
                    Paste GitHub Personal Access Token (classic or fine-grained):
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxx"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="w-full bg-[#fbf9f5] border-2 border-black p-2.5 font-mono text-xs focus:outline-none focus:bg-white focus:border-[#8b0000]"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <a
                    href="https://github.com/settings/tokens/new?scopes=read:user,repo,gist&description=The%20Midnight%20Reader%20Clearance"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#8b0000] font-sans font-bold underline inline-flex items-center gap-1"
                  >
                    <span>Generate token on GitHub (needs "read:user" and "gist")</span>
                    <ExternalLink size={11} />
                  </a>

                  <button
                    type="submit"
                    disabled={isVerifyingToken || !tokenInput.trim()}
                    className="px-5 py-2 bg-[#8b0000] hover:bg-black text-white font-sans text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors disabled:opacity-50"
                  >
                    {isVerifyingToken ? 'Verifying...' : 'Verify & Register'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Diagnostic Guide for AI Studio */}
          {activeTab === 'diagnostics' && (
            <div className="bg-white border-2 border-black p-5 space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold uppercase text-[#1a1a1a]">
                  Why AI Studio Says You Signed In But "Doesn't Register Here"
                </h4>
                <p className="font-serif text-xs italic text-[#4a4a4a]">
                  Here are the 4 browser and platform causes that prevent GitHub sign-in tokens from registering inside Google AI Studio, and how to fix each in 30 seconds:
                </p>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {/* 1. Third Party Cookies */}
                <div className="border border-black p-3 bg-[#faf7f2] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[#8b0000]">
                    <Cookie size={14} />
                    <span>Cause 1: Third-Party Cookies Blocked by Browser</span>
                  </div>
                  <p className="text-[#333] leading-relaxed">
                    AI Studio hosts preview apps on sandboxed Cloud Run subdomains. Because the app runs inside an <code>&lt;iframe&gt;</code>, Chrome, Safari, and Brave treat the GitHub callback cookie as third-party and reject it.
                  </p>
                  <p className="font-bold text-[#111]">
                    Fix: In your browser URL bar, click the Eye / Cookie icon (or Site Settings) and toggle <strong>"Allow third-party cookies"</strong> for this tab.
                  </p>
                </div>

                {/* 2. Pop-up & Redirect Blocker */}
                <div className="border border-black p-3 bg-[#faf7f2] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[#8b0000]">
                    <Layers size={14} />
                    <span>Cause 2: Popup Cross-Origin Opener Severed</span>
                  </div>
                  <p className="text-[#333] leading-relaxed">
                    When GitHub redirects back after authorization, GitHub's headers tell the browser to sever <code>window.opener</code>. The popup finishes and closes, but the callback message never reaches AI Studio.
                  </p>
                  <p className="font-bold text-[#111]">
                    Fix: Use <strong>Tab 2 (Personal Access Token)</strong> above to bypass popups entirely, or click the padlock icon in the address bar and set Pop-ups to "Allow".
                  </p>
                </div>

                {/* 3. GitHub OAuth App Callback URL configuration */}
                <div className="border border-black p-3 bg-[#faf7f2] space-y-2">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[#8b0000]">
                    <ShieldCheck size={14} />
                    <span>Cause 3: OAuth App Callback URL Mismatch</span>
                  </div>
                  <p className="text-[#333]">
                    If using custom GitHub OAuth credentials, your OAuth App at <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer" className="underline font-bold">github.com/settings/developers</a> must have these exact callback URLs:
                  </p>
                  <div className="space-y-1 font-mono text-[11px] bg-white p-2 border border-black">
                    <div className="flex items-center justify-between">
                      <span className="truncate pr-2">{currentDevCallback}</span>
                      <button
                        onClick={() => handleCopy(currentDevCallback, 'dev')}
                        className="text-[10px] uppercase font-bold text-[#8b0000] underline"
                      >
                        {copiedUrl === 'dev' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] bg-white p-2 border border-black">
                    <div className="flex items-center justify-between">
                      <span className="truncate pr-2">{currentSharedCallback}</span>
                      <button
                        onClick={() => handleCopy(currentSharedCallback, 'pre')}
                        className="text-[10px] uppercase font-bold text-[#8b0000] underline"
                      >
                        {copiedUrl === 'pre' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Organization Access Restrictions */}
                <div className="border border-black p-3 bg-[#faf7f2] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[#8b0000]">
                    <CheckCircle2 size={14} />
                    <span>Cause 4: GitHub Organization Access Restrictions</span>
                  </div>
                  <p className="text-[#333] leading-relaxed">
                    If your GitHub account is a member of an organization with Third-Party App restrictions, GitHub shows "Authorized" on your user profile but withholds repository and account access from the app.
                  </p>
                  <p className="font-bold text-[#111]">
                    Fix: Visit <a href="https://github.com/settings/applications" target="_blank" rel="noreferrer" className="underline">github.com/settings/applications</a>, click the application, and click <strong>"Grant"</strong> next to your organization.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Close button */}
          <div className="pt-2 border-t-2 border-black flex justify-end">
            <button
              onClick={() => setIsGitHubModalOpen(false)}
              className="px-5 py-2 border-2 border-black font-sans text-xs font-bold uppercase hover:bg-white transition-colors"
            >
              Close Window
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
