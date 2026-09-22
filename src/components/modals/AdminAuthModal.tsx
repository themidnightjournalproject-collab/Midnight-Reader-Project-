import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import { KeyRound, ShieldAlert, CheckCircle2, Lock, Unlock, Key, ArrowRight, Download, FileCode, Check, Eye, EyeOff } from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const { 
    isAdminUnlocked, 
    unlockAdmin, 
    lockAdmin, 
    isAdminModalOpen, 
    setIsAdminModalOpen,
    adminPasscode,
    setAdminPasscode,
    setActiveView,
    generateSeedCode
  } = useJournal();

  const [inputPasscode, setInputPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isChangingPasscode, setIsChangingPasscode] = useState(false);
  const [currentPasscodeConfirm, setCurrentPasscodeConfirm] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showActivePasscode, setShowActivePasscode] = useState(false);
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminModalOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPasscode.trim()) {
      setErrorMsg('Please enter the Chief Investigator passcode.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const success = await unlockAdmin(inputPasscode.trim());
      if (success) {
        setErrorMsg('');
        setSuccessMsg('Chief Investigator credentials verified. Full editorial clearance granted.');
        setTimeout(() => {
          setIsAdminModalOpen(false);
          setSuccessMsg('');
          setInputPasscode('');
          setIsSubmitting(false);
        }, 800);
      } else {
        setErrorMsg('Access Denied: Invalid Chief Investigator passcode.');
        setIsSubmitting(false);
      }
    } catch {
      setErrorMsg('Authentication error. Please retry.');
      setIsSubmitting(false);
    }
  };

  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim() || newPasscode.trim().length < 4) {
      setErrorMsg('New passcode must be at least 4 characters.');
      return;
    }
    if (newPasscode.trim() !== confirmPasscode.trim()) {
      setErrorMsg('Passcodes do not match. Please verify your typing.');
      return;
    }

    const updatedCode = newPasscode.trim();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await setAdminPasscode(updatedCode);
      setIsChangingPasscode(false);
      setNewPasscode('');
      setConfirmPasscode('');
      setCurrentPasscodeConfirm('');
      setErrorMsg('');
      setSuccessMsg('Passcode successfully changed and permanently saved across redeployments!');
      setIsSubmitting(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
      setErrorMsg('Failed to update passcode on server.');
      setIsSubmitting(false);
    }
  };

  const handleDownloadUpdatedSeed = () => {
    const code = generateSeedCode();
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'initialData.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySeed = () => {
    navigator.clipboard.writeText(generateSeedCode());
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-xs">
      <div className="bg-[#f5f2ed] border-4 border-black w-full max-w-lg shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-[#e8e2d8]" />
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#e8e2d8]">
              RESTRICTED ARCHIVES • CHIEF INVESTIGATOR DESK
            </span>
          </div>
          <button
            onClick={() => {
              setIsAdminModalOpen(false);
              setErrorMsg('');
              setSuccessMsg('');
              setIsChangingPasscode(false);
            }}
            className="text-white hover:text-[#8b0000] font-mono text-base font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Badge */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold uppercase text-[#1a1a1a]">
                EDITORIAL CLEARANCE
              </h3>
              <p className="font-serif text-xs italic text-[#4a4a4a]">
                Controls editing permissions across all book reviews and dossier files.
              </p>
            </div>
            {isAdminUnlocked ? (
              <span className="bg-[#8b0000] text-white font-mono text-[10px] uppercase font-bold px-2 py-1 flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Unlock size={11} /> UNLOCKED
              </span>
            ) : (
              <span className="bg-black text-white font-mono text-[10px] uppercase font-bold px-2 py-1 flex items-center gap-1">
                <Lock size={11} /> LOCKED
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="bg-[#fee2e2] border-2 border-[#8b0000] p-3 text-xs text-[#8b0000] font-sans font-bold flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-[#dcfce7] border-2 border-[#166534] p-3 text-xs text-[#166534] font-sans font-bold flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form when locked */}
          {!isAdminUnlocked ? (
            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-bold uppercase text-[#1a1a1a] mb-1 tracking-wider">
                  ENTER CHIEF INVESTIGATOR PASSCODE:
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter confidential passcode..."
                    value={inputPasscode}
                    onChange={(e) => {
                      setInputPasscode(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full bg-white border-2 border-black p-2.5 pr-10 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#8b0000]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-black p-1"
                    title={showLoginPassword ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="bg-[#fff9eb] border border-black p-3 text-[11px] font-serif text-[#1a1a1a] space-y-1">
                <strong>Protected Visitor Access:</strong>
                <p className="italic text-[#4a4a4a]">
                  Public visitors to your site can read case reviews, cast poll votes, submit suspect theories, and like articles, but cannot edit or delete any files.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="px-4 py-2 border-2 border-black font-sans text-xs font-bold uppercase hover:bg-[#e8e2d8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#8b0000] text-white font-sans text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Unlock Editor Privileges'}
                </button>
              </div>
            </form>
          ) : (
            /* Controls when already unlocked */
            <div className="space-y-4">
              <div className="bg-white border-2 border-black p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#8b0000] uppercase">
                    <CheckCircle2 size={15} />
                    <span>EDITOR PRIVILEGES ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs bg-[#f5f2ed] border border-black px-2 py-0.5">
                    <span>Key:</span>
                    <strong>{showActivePasscode ? adminPasscode : '••••••••'}</strong>
                    <button
                      type="button"
                      onClick={() => setShowActivePasscode(!showActivePasscode)}
                      className="ml-1 text-[#737373] hover:text-black"
                      title={showActivePasscode ? 'Mask passcode' : 'Reveal passcode'}
                    >
                      {showActivePasscode ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </div>
                </div>
                <p className="text-xs font-serif text-[#4a4a4a]">
                  All edits you make on the website are automatically saved to disk and sync with your backend server, so your reviews and custom password persist through redeployments!
                </p>
              </div>

              {isChangingPasscode ? (
                <form onSubmit={handleUpdatePasscode} className="bg-white border-2 border-black p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-black border-opacity-20 pb-2">
                    <span className="font-serif font-bold text-sm uppercase text-[#1a1a1a]">
                      Change Master Passcode
                    </span>
                    <span className="font-mono text-[10px] text-[#8b0000]">min 4 chars</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-bold uppercase text-[#1a1a1a] mb-1">
                      New Passcode:
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPasscode ? 'text' : 'password'}
                        placeholder="Enter new secret passcode..."
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        className="w-full bg-[#fbf9f5] border border-black p-2 pr-8 font-mono text-xs focus:outline-none focus:bg-white"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPasscode(!showNewPasscode)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#737373] hover:text-black"
                      >
                        {showNewPasscode ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-bold uppercase text-[#1a1a1a] mb-1">
                      Confirm New Passcode:
                    </label>
                    <input
                      type={showNewPasscode ? 'text' : 'password'}
                      placeholder="Re-type new passcode..."
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      className="w-full bg-[#fbf9f5] border border-black p-2 font-mono text-xs focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="bg-[#fff8ea] border border-black p-2.5 text-[11px] font-serif text-[#1a1a1a]">
                    <strong>Redeployment Persistence:</strong> Your new passcode is saved on the server immediately and written to the project database so it stays active across redeployments.
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPasscode(false);
                        setErrorMsg('');
                      }}
                      className="px-3 py-1 text-xs border border-black hover:bg-[#f5f2ed]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-1.5 bg-[#8b0000] text-white text-xs font-bold uppercase hover:bg-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save & Persist Passcode'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-white border-2 border-black p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs font-sans uppercase text-[#1a1a1a] block">
                        Passcode Security
                      </span>
                      <span className="text-[11px] text-[#737373] font-serif italic flex items-center gap-1.5">
                        Active Secret: <span className="font-mono font-bold text-black">{showActivePasscode ? adminPasscode : '••••••••'}</span>
                        <button
                          type="button"
                          onClick={() => setShowActivePasscode(!showActivePasscode)}
                          className="text-[#737373] hover:text-black underline text-[10px]"
                        >
                          {showActivePasscode ? 'Hide' : 'Show'}
                        </button>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPasscode(true);
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="px-3 py-1 text-xs bg-black hover:bg-[#8b0000] text-white font-bold uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors"
                    >
                      <Key size={12} />
                      <span>Change Passcode</span>
                    </button>
                  </div>

                  {/* Redeployment Persistence Helper Box */}
                  <div className="border-t border-black border-opacity-20 pt-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8b0000] uppercase font-sans">
                      <FileCode size={13} />
                      <span>Redeployment & Backup Center</span>
                    </div>
                    <p className="text-[11px] font-serif text-[#4a4a4a]">
                      All current book reviews, witness comments, likes, and passcode are active and autosaved. You can also download a manual code seed:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleDownloadUpdatedSeed}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#faf7f2] border border-black text-[11px] font-bold font-sans uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        title="Download initialData.ts with your active passcode and book edits"
                      >
                        <Download size={12} />
                        <span>Download initialData.ts</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopySeed}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#faf7f2] border border-black text-[11px] font-bold font-sans uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                      >
                        {copiedSeed ? <Check size={12} /> : <FileCode size={12} />}
                        <span>{copiedSeed ? 'Copied Code!' : 'Copy Code'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAdminModalOpen(false);
                          setActiveView('backup-sync');
                        }}
                        className="flex items-center gap-1 text-[11px] text-[#8b0000] hover:underline font-bold font-sans ml-auto"
                      >
                        <span>Open Backup Vault</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-black flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    lockAdmin();
                    setIsAdminModalOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-black text-white font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#8b0000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors"
                >
                  <Lock size={13} />
                  <span>Lock Desk (Visitor Mode)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="px-4 py-2 border border-black font-sans text-xs font-bold uppercase hover:bg-white"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
