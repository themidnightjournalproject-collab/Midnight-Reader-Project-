import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import { BookReview, Genre, Suspect, ClueItem } from '../../types';
import { 
  Plus, 
  Trash2, 
  FolderPlus, 
  BookOpen, 
  UserCheck, 
  ShieldAlert, 
  Sparkles,
  FileText,
  ListOrdered,
  CheckCircle2,
  Tag,
  BarChart3
} from 'lucide-react';
import { ImageUploader } from '../common/ImageUploader';

const COMMON_TROPES = [
  'Unreliable Narrator',
  'Dual Timelines',
  'Isolated Island / Cabin',
  'Locked Room',
  'Amnesia / Missing Memories',
  'Dark Academia',
  'Domestic Gaslighting',
  'Small Town Secrets',
  'Multiple POVs',
  'Cold Case Reopened',
  'Cat-and-Mouse Game',
  'Rich Family Secrets',
  'Found Journal / Lost Audio',
  'Twist in the Epilogue',
];

export const NewReviewModal: React.FC = () => {
  const { isNewReviewModalOpen, setIsNewReviewModalOpen, addReview, reviews, customThrillerTropes, addCustomThrillerTrope } = useJournal();

  const [activeTab, setActiveTab] = useState<'basic' | 'review' | 'evidence' | 'suspects' | 'spoilers'>('basic');

  // Case File Identification & Basic Info
  const defaultCaseNum = String(reviews.length + 1).padStart(3, '0');
  const [caseNumber, setCaseNumber] = useState(defaultCaseNum);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80');
  const [genre, setGenre] = useState<Genre>('Psychological Thriller');
  const [dateRead, setDateRead] = useState(() => new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
  const [dateStarted, setDateStarted] = useState('');
  const [dateFinished, setDateFinished] = useState('');
  const [yearRead, setYearRead] = useState<number>(new Date().getFullYear());
  const [pages, setPages] = useState<number>(320);
  const [rating, setRating] = useState<number>(5);
  const [status, setStatus] = useState<string>('CLOSED');
  const [readingFormat, setReadingFormat] = useState<'Paperback' | 'Hardcover' | 'Audiobook' | 'E-Reader'>('Paperback');
  const [correctGuess, setCorrectGuess] = useState<boolean>(true);

  // Editorial Review
  const [leadQuote, setLeadQuote] = useState('');
  const [summary, setSummary] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [whatIThought, setWhatIThought] = useState('');
  const [whatActuallyHappened, setWhatActuallyHappened] = useState('');
  const [favoriteMoment, setFavoriteMoment] = useState('');
  const [finalVerdict, setFinalVerdict] = useState('');
  const [recommendedFor, setRecommendedFor] = useState('Fans of Gillian Flynn, Freida McFadden & Lucy Foley');
  const [selectedTropes, setSelectedTropes] = useState<string[]>(['Unreliable Narrator', 'Multiple POVs']);
  const [customTropeInput, setCustomTropeInput] = useState('');

  // Forensic Deep Dive Ratings (All Metrics)
  const [atmosphereRating, setAtmosphereRating] = useState<number>(5);
  const [pacingRating, setPacingRating] = useState<number>(5);
  const [twistRating, setTwistRating] = useState<number>(5);
  const [paranoiaRating, setParanoiaRating] = useState<number>(5);
  const [unreliableRating, setUnreliableRating] = useState<number>(5);
  const [twistsCount, setTwistsCount] = useState<number>(3);

  // Evidence Bullets & Sticky Marginalia
  const [evidenceBullets, setEvidenceBullets] = useState<string[]>([
    'Inconsistent crime scene timeline reported by primary witness',
    'Discrepancies in the locked room floorplan'
  ]);
  const [marginaliaNotes, setMarginaliaNotes] = useState<string[]>([
    'Check the dates on the correspondence—some do not line up!'
  ]);
  const [newEvidenceInput, setNewEvidenceInput] = useState('');
  const [newMarginaliaInput, setNewMarginaliaInput] = useState('');

  // Suspects builder
  const [suspects, setSuspects] = useState<Suspect[]>([
    {
      id: 's-new-1',
      name: 'Primary Suspect',
      role: 'The Suspicious Partner / Neighbor',
      motive: 'Greed, hidden debts, or secret history',
      opportunity: 'HIGH',
      alibi: 'Claims to have been asleep upstairs during the incident',
      suspicionLevel: 4,
      clues: ['Contradictory timeline statement during interrogation'],
      isActualCulprit: false,
      revealNotes: ''
    }
  ]);

  // Clues builder
  const [clues, setClues] = useState<ClueItem[]>([
    {
      id: 'c-new-1',
      title: 'The Missing Key / Hidden Letter',
      summary: 'A crucial item was found relocated or secured under false pretenses.',
      detailedAnalysis: 'Analysis of why this clue blew open the investigator’s working theory.',
      pageDiscovered: 64,
      importance: 'CRUCIAL'
    }
  ]);

  // Spoilers & Evidence
  const [spoilerEvidence, setSpoilerEvidence] = useState('');
  const [spoilerCulpritReveal, setSpoilerCulpritReveal] = useState('');

  if (!isNewReviewModalOpen) return null;

  const toggleTrope = (trope: string) => {
    if (selectedTropes.includes(trope)) {
      setSelectedTropes(selectedTropes.filter((t) => t !== trope));
    } else {
      setSelectedTropes([...selectedTropes, trope]);
    }
  };

  const handleAddCustomTrope = () => {
    const clean = customTropeInput.trim();
    if (clean) {
      if (!selectedTropes.includes(clean)) {
        setSelectedTropes([...selectedTropes, clean]);
      }
      addCustomThrillerTrope(clean);
      setCustomTropeInput('');
    }
  };

  // Evidence Bullets Management
  const handleAddEvidenceBullet = () => {
    if (newEvidenceInput.trim()) {
      setEvidenceBullets([...evidenceBullets, newEvidenceInput.trim()]);
      setNewEvidenceInput('');
    }
  };

  const handleRemoveEvidenceBullet = (index: number) => {
    setEvidenceBullets(evidenceBullets.filter((_, i) => i !== index));
  };

  const handleUpdateEvidenceBullet = (index: number, val: string) => {
    const updated = [...evidenceBullets];
    updated[index] = val;
    setEvidenceBullets(updated);
  };

  // Marginalia Notes Management
  const handleAddMarginalia = () => {
    if (newMarginaliaInput.trim()) {
      setMarginaliaNotes([...marginaliaNotes, newMarginaliaInput.trim()]);
      setNewMarginaliaInput('');
    }
  };

  const handleRemoveMarginalia = (index: number) => {
    setMarginaliaNotes(marginaliaNotes.filter((_, i) => i !== index));
  };

  const handleUpdateMarginalia = (index: number, val: string) => {
    const updated = [...marginaliaNotes];
    updated[index] = val;
    setMarginaliaNotes(updated);
  };

  // Suspects Management
  const handleAddSuspect = () => {
    setSuspects([
      ...suspects,
      {
        id: `s-new-${Date.now()}`,
        name: 'New Suspect',
        role: 'Role / Occupation',
        motive: 'Alleged motive or secret',
        opportunity: 'MEDIUM',
        alibi: 'Stated whereabouts during the incident',
        suspicionLevel: 3,
        clues: ['Initial interrogator observation'],
        isActualCulprit: false,
        revealNotes: ''
      }
    ]);
  };

  const handleRemoveSuspect = (idx: number) => {
    setSuspects(suspects.filter((_, i) => i !== idx));
  };

  // Clues Management
  const handleAddClue = () => {
    setClues([
      ...clues,
      {
        id: `c-new-${Date.now()}`,
        title: 'New Discovered Clue',
        summary: 'Description of the item or testimony.',
        detailedAnalysis: 'Forensic evaluation and implications.',
        pageDiscovered: pages ? Math.floor(pages / 2) : 150,
        importance: 'CONFIRMED EVIDENCE'
      }
    ]);
  };

  const handleRemoveClue = (idx: number) => {
    setClues(clues.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      alert('Please provide at least a Book Title and Author.');
      return;
    }

    const cleanCaseNum = caseNumber.trim() || defaultCaseNum;

    addReview({
      caseNumber: cleanCaseNum,
      title: title.trim(),
      author: author.trim(),
      coverImage: coverImage.trim(),
      genre,
      dateRead: dateRead.trim(),
      dateStarted: dateStarted.trim(),
      dateFinished: dateFinished.trim(),
      yearRead: Number(yearRead) || new Date().getFullYear(),
      pages: Number(pages) || 300,
      rating: Number(rating) || 5,
      status: status as any,
      readingFormat,
      correctGuess,
      leadQuote: leadQuote.trim() || `“A thrilling dissection of truth and deception.”`,
      summary: summary.trim(),
      reviewText: reviewText.trim(),
      whatIThought: whatIThought.trim(),
      whatActuallyHappened: whatActuallyHappened.trim(),
      favoriteMoment: favoriteMoment.trim(),
      finalVerdict: finalVerdict.trim() || `A compelling investigation into human darkness.`,
      recommendedFor: recommendedFor.trim(),
      tropes: selectedTropes,
      atmosphereRating: Number(atmosphereRating),
      pacingRating: Number(pacingRating),
      twistExecutionRating: Number(twistRating),
      paranoiaRating: Number(paranoiaRating),
      unreliableNarratorRating: Number(unreliableRating),
      twistsCount: Number(twistsCount),
      evidenceBullets: evidenceBullets.filter(b => b.trim() !== ''),
      marginaliaNotes: marginaliaNotes.filter(m => m.trim() !== ''),
      suspects: suspects.filter(s => s.name.trim() !== ''),
      clues: clues.filter(c => c.title.trim() !== ''),
      spoilerEvidence: spoilerEvidence.trim(),
      spoilerCulpritReveal: spoilerCulpritReveal.trim(),
      likes: 1,
    });

    setIsNewReviewModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border-4 border-black w-full max-w-4xl max-h-[94vh] overflow-y-auto p-4 sm:p-7 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] my-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <FolderPlus size={20} />
            </div>
            <div>
              <span className="font-sans text-[10px] sm:text-[11px] text-[#8b0000] uppercase font-bold tracking-widest block">
                CLASSIFIED DOSSIER LOGGING PROTOCOL
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1a1a1a] uppercase font-serif leading-tight">
                Log New Case File #{caseNumber}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNewReviewModalOpen(false)}
            className="p-1.5 hover:bg-[#8b0000] hover:text-white text-black font-sans font-bold text-base border-2 border-black transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-black gap-1 mb-5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`flex items-center gap-1.5 px-3 py-2 font-sans font-bold uppercase tracking-wider transition-all whitespace-nowrap border-t-2 border-x-2 border-black ${
              activeTab === 'basic'
                ? 'bg-black text-white -mb-[2px] pb-[10px]'
                : 'bg-[#f5f2ed] text-[#1a1a1a] hover:bg-[#e8e2d8]'
            }`}
          >
            <FileText size={13} />
            <span>1. File Identity & Meta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-1.5 px-3 py-2 font-sans font-bold uppercase tracking-wider transition-all whitespace-nowrap border-t-2 border-x-2 border-black ${
              activeTab === 'review'
                ? 'bg-black text-white -mb-[2px] pb-[10px]'
                : 'bg-[#f5f2ed] text-[#1a1a1a] hover:bg-[#e8e2d8]'
            }`}
          >
            <BookOpen size={13} />
            <span>2. Editorial & Ratings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center gap-1.5 px-3 py-2 font-sans font-bold uppercase tracking-wider transition-all whitespace-nowrap border-t-2 border-x-2 border-black ${
              activeTab === 'evidence'
                ? 'bg-black text-white -mb-[2px] pb-[10px]'
                : 'bg-[#f5f2ed] text-[#1a1a1a] hover:bg-[#e8e2d8]'
            }`}
          >
            <ListOrdered size={13} />
            <span>3. Evidence & Sticky Notes ({evidenceBullets.length + marginaliaNotes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suspects')}
            className={`flex items-center gap-1.5 px-3 py-2 font-sans font-bold uppercase tracking-wider transition-all whitespace-nowrap border-t-2 border-x-2 border-black ${
              activeTab === 'suspects'
                ? 'bg-black text-white -mb-[2px] pb-[10px]'
                : 'bg-[#f5f2ed] text-[#1a1a1a] hover:bg-[#e8e2d8]'
            }`}
          >
            <UserCheck size={13} />
            <span>4. Suspects & Clues ({suspects.length + clues.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('spoilers')}
            className={`flex items-center gap-1.5 px-3 py-2 font-sans font-bold uppercase tracking-wider transition-all whitespace-nowrap border-t-2 border-x-2 border-black ${
              activeTab === 'spoilers'
                ? 'bg-[#8b0000] text-white -mb-[2px] pb-[10px]'
                : 'bg-[#f5f2ed] text-[#8b0000] hover:bg-[#ffefef]'
            }`}
          >
            <ShieldAlert size={13} />
            <span>5. Classified Spoilers</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
          
          {/* TAB 1: FILE IDENTITY & METADATA */}
          {activeTab === 'basic' && (
            <div className="bg-[#faf9f5] p-5 border-2 border-black space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <div>
                  <h4 className="font-bold text-[#1a1a1a] uppercase tracking-wider text-xs">
                    Case File Identification & Book Specs
                  </h4>
                  <p className="font-serif italic text-xs text-[#4a4a4a] mt-0.5">
                    Customize which case file this is (e.g. Case #014, #001, #099), book details, and cover image.
                  </p>
                </div>
              </div>

              {/* Case Number Override */}
              <div className="bg-white border-2 border-[#8b0000] p-3 space-y-1">
                <label className="block text-[#8b0000] font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Tag size={13} />
                  Which Case File Number is this? (Case Code / Index) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm bg-[#8b0000] text-white px-2.5 py-1.5">
                    CASE #
                  </span>
                  <input
                    type="text"
                    required
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="e.g. 014, 001, 042, X-09"
                    className="flex-1 bg-[#fff8f8] border border-[#8b0000] p-2 text-sm font-mono font-bold text-[#8b0000] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Silent Patient"
                    className="w-full bg-white border border-black p-2 text-xs font-serif font-bold text-[#1a1a1a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Author *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Alex Michaelides"
                    className="w-full bg-white border border-black p-2 text-xs font-serif text-[#1a1a1a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as Genre)}
                    className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none"
                  >
                    <option value="Psychological Thriller">Psychological Thriller</option>
                    <option value="Murder Mystery">Murder Mystery</option>
                    <option value="Domestic Thriller">Domestic Thriller</option>
                    <option value="Locked Room Mystery">Locked Room Mystery</option>
                    <option value="Gothic Thriller">Gothic Thriller</option>
                    <option value="Legal Thriller">Legal Thriller</option>
                    <option value="Crime & Police Procedural">Crime & Police Procedural</option>
                    <option value="Cozy Mystery">Cozy Mystery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Investigation Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white border border-black p-2 text-xs font-bold text-[#1a1a1a] focus:outline-none"
                  >
                    <option value="CLOSED">CLOSED (Case Solved)</option>
                    <option value="UNDER INVESTIGATION">UNDER INVESTIGATION (Active Reading)</option>
                    <option value="COLD CASE">COLD CASE (Unsolved Mystery)</option>
                    <option value="HIGH CONFIDENCE GUESS">HIGH CONFIDENCE GUESS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Reading Format</label>
                  <select
                    value={readingFormat}
                    onChange={(e) => setReadingFormat(e.target.value as any)}
                    className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none"
                  >
                    <option value="Paperback">Paperback</option>
                    <option value="Hardcover">Hardcover</option>
                    <option value="Audiobook">Audiobook</option>
                    <option value="E-Reader">E-Reader (Kindle / Kobo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Page Count</label>
                  <input
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                    className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Date Started</label>
                  <input
                    type="text"
                    value={dateStarted}
                    onChange={(e) => setDateStarted(e.target.value)}
                    placeholder="e.g. Oct 12, 2025"
                    className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Date Finished</label>
                  <input
                    type="text"
                    value={dateFinished}
                    onChange={(e) => setDateFinished(e.target.value)}
                    placeholder="e.g. Oct 20, 2025"
                    className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Investigation Date Logged</label>
                  <input
                    type="text"
                    value={dateRead}
                    onChange={(e) => setDateRead(e.target.value)}
                    className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">Year Read</label>
                  <input
                    type="number"
                    value={yearRead}
                    onChange={(e) => setYearRead(Number(e.target.value))}
                    className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                    Did the Detective (You) Guess the Culprit / Twist Correctly?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCorrectGuess(true)}
                      className={`p-2.5 border-2 text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                        correctGuess
                          ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-[#1a1a1a] border-black hover:bg-[#f5f2ed]'
                      }`}
                    >
                      <CheckCircle2 size={14} className={correctGuess ? 'text-green-400' : 'text-[#737373]'} />
                      <span>YES — GUESSED BEFORE THE TWIST</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCorrectGuess(false)}
                      className={`p-2.5 border-2 text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                        !correctGuess
                          ? 'bg-[#8b0000] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-[#1a1a1a] border-black hover:bg-[#f5f2ed]'
                      }`}
                    >
                      <ShieldAlert size={14} className={!correctGuess ? 'text-yellow-300' : 'text-[#737373]'} />
                      <span>NO — FOOLED BY RED HERRINGS</span>
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <ImageUploader
                    label="Book Cover Dossier Photo (Upload file, paste direct URL, or pick noir preset)"
                    value={coverImage}
                    onChange={(newUrl) => setCoverImage(newUrl)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                    Overall Detective Rating (Star Rating)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-white border border-black p-2.5 text-xs font-bold text-[#8b0000] focus:outline-none"
                  >
                    <option value={5}>★★★★★ 5.0 / 5.0 (Masterclass - Mandatory Mystery Reading)</option>
                    <option value={4.5}>★★★★½ 4.5 / 5.0 (Outstanding Suspense & Execution)</option>
                    <option value={4}>★★★★☆ 4.0 / 5.0 (Highly Suspicious & Gripping)</option>
                    <option value={3.5}>★★★½☆ 3.5 / 5.0 (Above Average Thrills)</option>
                    <option value={3}>★★★☆☆ 3.0 / 5.0 (Solid Mystery, Average Twists)</option>
                    <option value={2}>★★☆☆☆ 2.0 / 5.0 (Predictable Plot)</option>
                    <option value={1}>★☆☆☆☆ 1.0 / 5.0 (Total Red Herring - Disappointing)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('review')}
                  className="bg-black hover:bg-[#8b0000] text-white px-5 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors"
                >
                  Next: Editorial Review & Ratings →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PROPER EDITORIAL REVIEW & RATINGS */}
          {activeTab === 'review' && (
            <div className="bg-[#faf9f5] p-5 border-2 border-black space-y-5">
              <div className="border-b border-black pb-2">
                <h4 className="font-bold text-[#1a1a1a] uppercase tracking-wider text-xs">
                  Full Editorial Review & Quantitative Metrics
                </h4>
                <p className="font-serif italic text-xs text-[#4a4a4a] mt-0.5">
                  Write your full critical dissection, favorite moments, verdict, tropes, and forensic score sliders.
                </p>
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Lead Pull Quote / Memorable Excerpt
                </label>
                <input
                  type="text"
                  value={leadQuote}
                  onChange={(e) => setLeadQuote(e.target.value)}
                  placeholder="e.g. “Sometimes the quietest house on the block holds the darkest secrets.”"
                  className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none font-serif italic"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Case Synopsis / Premise Summary
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief 2-3 sentence overview of the plot and core premise..."
                  className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none font-serif"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Full Critical Review (Multi-Paragraph Editorial Breakdown) *
                </label>
                <textarea
                  rows={7}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your comprehensive analysis of the book, characters, writing style, pacing, and tone..."
                  className="w-full bg-white border border-black p-3 text-xs font-serif text-[#1a1a1a] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Theory vs Reality Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-black p-3 space-y-1">
                  <label className="block text-[#4a4a4a] font-bold uppercase text-[10px]">
                    What I Thought Would Happen (Pre-Twist Hypothesis)
                  </label>
                  <textarea
                    rows={3}
                    value={whatIThought}
                    onChange={(e) => setWhatIThought(e.target.value)}
                    placeholder="Your early theory midway through the book..."
                    className="w-full bg-[#faf9f5] border border-black border-opacity-30 p-2 text-xs text-[#1a1a1a] focus:outline-none font-serif italic"
                  />
                </div>

                <div className="bg-white border border-black p-3 space-y-1">
                  <label className="block text-[#8b0000] font-bold uppercase text-[10px]">
                    What Actually Happened (The Ending Shocker)
                  </label>
                  <textarea
                    rows={3}
                    value={whatActuallyHappened}
                    onChange={(e) => setWhatActuallyHappened(e.target.value)}
                    placeholder="The true twist reveal and how it subverted expectations..."
                    className="w-full bg-[#faf9f5] border border-black border-opacity-30 p-2 text-xs text-[#1a1a1a] focus:outline-none font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                    Favorite / Most Chilling Scene
                  </label>
                  <input
                    type="text"
                    value={favoriteMoment}
                    onChange={(e) => setFavoriteMoment(e.target.value)}
                    placeholder="e.g. The late-night attic door revelation"
                    className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none font-serif"
                  />
                </div>

                <div>
                  <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                    Final Verdict (One-Sentence Summary)
                  </label>
                  <input
                    type="text"
                    value={finalVerdict}
                    onChange={(e) => setFinalVerdict(e.target.value)}
                    placeholder="e.g. A relentless, paranoid masterpiece of unreliable narration."
                    className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1a1a1a] font-bold mb-1 uppercase text-[10px]">
                  Recommended For (Target Audience)
                </label>
                <input
                  type="text"
                  value={recommendedFor}
                  onChange={(e) => setRecommendedFor(e.target.value)}
                  placeholder="e.g. Fans of Gillian Flynn, Freida McFadden & Lucy Foley"
                  className="w-full bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none"
                />
              </div>

              {/* Tropes & Custom Tags */}
              <div className="space-y-2 bg-white p-3 border border-black">
                <label className="block text-[#1a1a1a] font-bold uppercase text-[10px]">
                  Key Thriller Tropes & Elements:
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Array.from(new Set([...COMMON_TROPES, ...(customThrillerTropes || []), ...selectedTropes])).map((trope) => {
                    const isSelected = selectedTropes.includes(trope);
                    return (
                      <button
                        key={trope}
                        type="button"
                        onClick={() => toggleTrope(trope)}
                        className={`px-2.5 py-1 text-[11px] font-sans font-bold border transition-all ${
                          isSelected
                            ? 'bg-[#8b0000] text-white border-black'
                            : 'bg-[#faf9f5] text-[#1a1a1a] border-black border-opacity-30 hover:border-black'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{trope}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Trope Tag */}
                <div className="flex gap-2 pt-2 border-t border-black border-opacity-10">
                  <input
                    type="text"
                    value={customTropeInput}
                    onChange={(e) => setCustomTropeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTrope();
                      }
                    }}
                    placeholder="Add custom trope tag (e.g. Unreliable Doctor, Epistolary Format)..."
                    className="flex-1 bg-[#faf9f5] border border-black p-1.5 text-xs text-[#1a1a1a] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTrope}
                    className="bg-black text-white px-3 py-1 text-xs font-bold uppercase hover:bg-[#8b0000] transition-colors"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>

              {/* Forensic Category Ratings (All 6 Metrics) */}
              <div className="bg-white border border-black p-4 space-y-3">
                <h5 className="font-bold uppercase text-[11px] text-[#1a1a1a] border-b border-black border-opacity-20 pb-1 flex items-center justify-between">
                  <span>Forensic Category Ratings (1 to 5)</span>
                  <span className="text-[10px] text-[#737373] font-mono">Real-time Radar & Graph values</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#737373] uppercase mb-1">
                      Atmosphere & Dread: <strong className="text-[#1a1a1a]">{atmosphereRating}/5</strong>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={atmosphereRating}
                      onChange={(e) => setAtmosphereRating(Number(e.target.value))}
                      className="w-full accent-[#8b0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#737373] uppercase mb-1">
                      Pacing & Tension: <strong className="text-[#1a1a1a]">{pacingRating}/5</strong>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={pacingRating}
                      onChange={(e) => setPacingRating(Number(e.target.value))}
                      className="w-full accent-[#8b0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#737373] uppercase mb-1">
                      Twist Execution: <strong className="text-[#1a1a1a]">{twistRating}/5</strong>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={twistRating}
                      onChange={(e) => setTwistRating(Number(e.target.value))}
                      className="w-full accent-[#8b0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#737373] uppercase mb-1">
                      Paranoia Rating: <strong className="text-[#1a1a1a]">{paranoiaRating}/5</strong>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={paranoiaRating}
                      onChange={(e) => setParanoiaRating(Number(e.target.value))}
                      className="w-full accent-[#8b0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#737373] uppercase mb-1">
                      Unreliable Narrator Score: <strong className="text-[#1a1a1a]">{unreliableRating}/5</strong>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={unreliableRating}
                      onChange={(e) => setUnreliableRating(Number(e.target.value))}
                      className="w-full accent-[#8b0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#737373] uppercase mb-1">
                      Total Plot Twists: <strong className="text-[#1a1a1a]">{twistsCount} Twists</strong>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={twistsCount}
                      onChange={(e) => setTwistsCount(Number(e.target.value))}
                      className="w-full accent-[#8b0000]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('basic')}
                  className="bg-white border border-black text-[#1a1a1a] px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#f5f2ed]"
                >
                  ← Back to File Identity
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('evidence')}
                  className="bg-black hover:bg-[#8b0000] text-white px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors"
                >
                  Next: Evidence & Sticky Notes →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE BULLETS & STICKY MARGINALIA */}
          {activeTab === 'evidence' && (
            <div className="bg-[#faf9f5] p-5 border-2 border-black space-y-6">
              
              {/* Evidence Bullets Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-black pb-1">
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] uppercase tracking-wider text-xs">
                      Key Physical & Forensic Evidence Bullets ({evidenceBullets.length})
                    </h4>
                    <p className="font-serif italic text-xs text-[#4a4a4a]">
                      These bullet points appear in the Evidence Checklist section of the case file.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {evidenceBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2 border border-black">
                      <span className="font-mono text-[10px] font-bold bg-black text-white px-1.5 py-0.5">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => handleUpdateEvidenceBullet(idx, e.target.value)}
                        className="flex-1 bg-[#faf9f5] border border-black border-opacity-30 p-1.5 text-xs text-[#1a1a1a] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidenceBullet(idx)}
                        className="text-[#8b0000] hover:text-black p-1"
                        title="Remove Bullet"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newEvidenceInput}
                      onChange={(e) => setNewEvidenceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEvidenceBullet();
                        }
                      }}
                      placeholder="Add new physical evidence item (e.g. Locked cellar key found in garden)..."
                      className="flex-1 bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddEvidenceBullet}
                      className="bg-black hover:bg-[#8b0000] text-white px-4 py-2 text-xs font-bold uppercase transition-colors"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Marginalia Sticky Scribbles Section */}
              <div className="space-y-3 pt-4 border-t border-black border-opacity-20">
                <div className="flex items-center justify-between border-b border-black pb-1">
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] uppercase tracking-wider text-xs">
                      Handwritten Student Marginalia & Sticky Scribbles ({marginaliaNotes.length})
                    </h4>
                    <p className="font-serif italic text-xs text-[#4a4a4a]">
                      Yellow sticky tape notes taped onto the case file folder for authentic reader thoughts.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {marginaliaNotes.map((note, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#fffde7] p-2 border-2 border-yellow-700">
                      <span className="font-mono text-[10px] font-bold bg-yellow-800 text-white px-1.5 py-0.5">
                        NOTE #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => handleUpdateMarginalia(idx, e.target.value)}
                        className="flex-1 bg-white border border-yellow-800 p-1.5 text-xs font-serif italic text-[#1a1a1a] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMarginalia(idx)}
                        className="text-[#8b0000] hover:text-black p-1"
                        title="Remove Sticky Note"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newMarginaliaInput}
                      onChange={(e) => setNewMarginaliaInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMarginalia();
                        }
                      }}
                      placeholder="Add handwritten sticky note (e.g. Check Chapter 12 timestamp again!)..."
                      className="flex-1 bg-white border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none font-serif italic"
                    />
                    <button
                      type="button"
                      onClick={handleAddMarginalia}
                      className="bg-black hover:bg-[#8b0000] text-white px-4 py-2 text-xs font-bold uppercase transition-colors"
                    >
                      + Add Sticky Note
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('review')}
                  className="bg-white border border-black text-[#1a1a1a] px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#f5f2ed]"
                >
                  ← Back to Review
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('suspects')}
                  className="bg-black hover:bg-[#8b0000] text-white px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors"
                >
                  Next: Suspects & Clues Lineup →
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE SUSPECT LINEUP & CLUES */}
          {activeTab === 'suspects' && (
            <div className="bg-[#faf9f5] p-5 border-2 border-black space-y-6">
              
              {/* Suspects Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-black pb-1">
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] uppercase tracking-wider text-xs">
                      Interactive Suspect Lineup ({suspects.length})
                    </h4>
                    <p className="font-serif italic text-xs text-[#4a4a4a]">
                      Modify suspects, motives, opportunity, alibis, and flag the true culprit.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSuspect}
                    className="bg-black hover:bg-[#8b0000] text-white text-[11px] font-bold px-2.5 py-1 flex items-center gap-1 uppercase transition-colors"
                  >
                    <Plus size={12} /> + Add Suspect
                  </button>
                </div>

                <div className="space-y-3">
                  {suspects.map((suspect, idx) => (
                    <div key={suspect.id} className="bg-white p-4 border-2 border-black space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold bg-black text-white px-1.5 py-0.5">
                            SUSPECT #{idx + 1}
                          </span>
                          <label className="flex items-center gap-1 text-[11px] font-bold text-[#8b0000] cursor-pointer bg-[#fff0f0] border border-[#8b0000] px-2 py-0.5">
                            <input
                              type="checkbox"
                              checked={Boolean(suspect.isActualCulprit)}
                              onChange={(e) => {
                                const updated = [...suspects];
                                updated[idx].isActualCulprit = e.target.checked;
                                setSuspects(updated);
                              }}
                              className="accent-[#8b0000]"
                            />
                            <span>Is Actual Culprit (Guilty)</span>
                          </label>
                        </div>

                        {suspects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSuspect(idx)}
                            className="text-[#8b0000] hover:text-black text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#737373]">Suspect Name</label>
                          <input
                            type="text"
                            value={suspect.name}
                            onChange={(e) => {
                              const updated = [...suspects];
                              updated[idx].name = e.target.value;
                              setSuspects(updated);
                            }}
                            className="w-full bg-[#faf9f5] border border-black p-1.5 text-xs font-bold text-[#1a1a1a]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#737373]">Role / Identity</label>
                          <input
                            type="text"
                            value={suspect.role}
                            onChange={(e) => {
                              const updated = [...suspects];
                              updated[idx].role = e.target.value;
                              setSuspects(updated);
                            }}
                            className="w-full bg-[#faf9f5] border border-black p-1.5 text-xs text-[#1a1a1a]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#737373]">Suspicion Level</label>
                          <select
                            value={suspect.suspicionLevel}
                            onChange={(e) => {
                              const updated = [...suspects];
                              updated[idx].suspicionLevel = Number(e.target.value);
                              setSuspects(updated);
                            }}
                            className="w-full bg-[#faf9f5] border border-black p-1.5 text-xs text-[#1a1a1a] font-bold"
                          >
                            <option value={5}>5/5 - Prime Suspect</option>
                            <option value={4}>4/5 - Highly Suspicious</option>
                            <option value={3}>3/5 - Moderate Opportunity</option>
                            <option value={2}>2/5 - Shaky Alibi</option>
                            <option value={1}>1/5 - Low Suspicion</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#737373]">Opportunity Level</label>
                          <select
                            value={suspect.opportunity || 'MEDIUM'}
                            onChange={(e) => {
                              const updated = [...suspects];
                              updated[idx].opportunity = e.target.value as any;
                              setSuspects(updated);
                            }}
                            className="w-full bg-[#faf9f5] border border-black p-1.5 text-xs text-[#1a1a1a]"
                          >
                            <option value="MAXIMUM">MAXIMUM OPPORTUNITY</option>
                            <option value="HIGH">HIGH</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="LOW">LOW</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#737373]">Alleged Motive</label>
                          <input
                            type="text"
                            value={suspect.motive}
                            onChange={(e) => {
                              const updated = [...suspects];
                              updated[idx].motive = e.target.value;
                              setSuspects(updated);
                            }}
                            className="w-full bg-[#faf9f5] border border-black p-1.5 text-xs text-[#1a1a1a]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#737373]">Stated Alibi</label>
                          <input
                            type="text"
                            value={suspect.alibi}
                            onChange={(e) => {
                              const updated = [...suspects];
                              updated[idx].alibi = e.target.value;
                              setSuspects(updated);
                            }}
                            className="w-full bg-[#faf9f5] border border-black p-1.5 text-xs text-[#1a1a1a]"
                          />
                        </div>
                      </div>

                      {suspect.isActualCulprit && (
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#8b0000]">
                            Culprit Reveal / Confession Notes
                          </label>
                          <input
                            type="text"
                            value={suspect.revealNotes || ''}
                            onChange={(e) => {
                              const updated = [...suspects];
                              updated[idx].revealNotes = e.target.value;
                              setSuspects(updated);
                            }}
                            placeholder="Explanation of how they carried out the crime..."
                            className="w-full bg-[#fff5f5] border border-[#8b0000] p-1.5 text-xs text-[#8b0000] font-serif"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Clues Section */}
              <div className="space-y-4 pt-4 border-t border-black border-opacity-20">
                <div className="flex items-center justify-between border-b border-black pb-1">
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] uppercase tracking-wider text-xs">
                      Key Clues & Red Herrings Lineup ({clues.length})
                    </h4>
                    <p className="font-serif italic text-xs text-[#4a4a4a]">
                      Interactive clue cards with page discovery markers and forensic breakdowns.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddClue}
                    className="bg-black hover:bg-[#8b0000] text-white text-[11px] font-bold px-2.5 py-1 flex items-center gap-1 uppercase transition-colors"
                  >
                    <Plus size={12} /> + Add Clue
                  </button>
                </div>

                <div className="space-y-3">
                  {clues.map((clue, idx) => (
                    <div key={clue.id} className="bg-white p-3 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold bg-[#e8e2d8] text-[#1a1a1a] px-1.5 py-0.5">
                          CLUE ITEM #{idx + 1}
                        </span>
                        {clues.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveClue(idx)}
                            className="text-[#8b0000] hover:text-black text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#737373]">Clue Title</label>
                          <input
                            type="text"
                            value={clue.title}
                            onChange={(e) => {
                              const updated = [...clues];
                              updated[idx].title = e.target.value;
                              setClues(updated);
                            }}
                            placeholder="e.g. The Missing Clock Key"
                            className="w-full bg-[#faf9f5] border border-black p-1.5 text-xs font-bold text-[#1a1a1a]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#737373]">Evidence Classification</label>
                          <select
                            value={clue.importance}
                            onChange={(e) => {
                              const updated = [...clues];
                              updated[idx].importance = e.target.value as any;
                              setClues(updated);
                            }}
                            className="w-full bg-[#faf9f5] border border-black p-1.5 text-xs text-[#1a1a1a] font-bold"
                          >
                            <option value="CRUCIAL">CRUCIAL EVIDENCE</option>
                            <option value="DECEPTIVE (RED HERRING)">DECEPTIVE (RED HERRING)</option>
                            <option value="CONFIRMED EVIDENCE">CONFIRMED EVIDENCE</option>
                            <option value="ANOMALOUS">ANOMALOUS</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#737373]">Page / Chapter Discovered</label>
                          <input
                            type="text"
                            value={clue.pageDiscovered || ''}
                            onChange={(e) => {
                              const updated = [...clues];
                              updated[idx].pageDiscovered = e.target.value;
                              setClues(updated);
                            }}
                            placeholder="e.g. Page 142 or Chapter 9"
                            className="w-full bg-[#faf9f5] border border-black p-1.5 text-xs text-[#1a1a1a]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#737373]">Summary & Clue Overview</label>
                        <input
                          type="text"
                          value={clue.summary}
                          onChange={(e) => {
                            const updated = [...clues];
                            updated[idx].summary = e.target.value;
                            setClues(updated);
                          }}
                          className="w-full bg-[#faf9f5] border border-black p-1.5 text-xs text-[#1a1a1a]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#737373]">Detailed Forensic Analysis</label>
                        <textarea
                          rows={2}
                          value={clue.detailedAnalysis}
                          onChange={(e) => {
                            const updated = [...clues];
                            updated[idx].detailedAnalysis = e.target.value;
                            setClues(updated);
                          }}
                          className="w-full bg-[#faf9f5] border border-black p-1.5 text-xs text-[#1a1a1a] font-serif"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('evidence')}
                  className="bg-white border border-black text-[#1a1a1a] px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#f5f2ed]"
                >
                  ← Back to Evidence
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('spoilers')}
                  className="bg-black hover:bg-[#8b0000] text-white px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors"
                >
                  Next: Classified Spoilers →
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: CLASSIFIED SPOILERS */}
          {activeTab === 'spoilers' && (
            <div className="bg-[#fff8f8] p-5 border-2 border-[#8b0000] space-y-4">
              <div className="flex items-center gap-2 text-[#8b0000] border-b border-[#8b0000] pb-2">
                <ShieldAlert size={18} />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-xs">
                    Classified Spoiler Evidence Chamber
                  </h4>
                  <p className="font-serif italic text-xs text-[#4a4a4a] mt-0.5">
                    This section remains sealed behind an interactive <strong>"CLASSIFIED DOSSIER"</strong> stamp on the live website.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[#8b0000] font-bold mb-1 uppercase text-[10px]">
                  Full Classified Forensic Spoiler Breakdown
                </label>
                <textarea
                  rows={4}
                  value={spoilerEvidence}
                  onChange={(e) => setSpoilerEvidence(e.target.value)}
                  placeholder="Explain the entire twist mechanics, timeline deceptions, and hidden clues..."
                  className="w-full bg-white border border-black p-3 text-xs font-serif text-[#1a1a1a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8b0000] font-bold mb-1 uppercase text-[10px]">
                  True Culprit Confession & Motive Revelation
                </label>
                <textarea
                  rows={3}
                  value={spoilerCulpritReveal}
                  onChange={(e) => setSpoilerCulpritReveal(e.target.value)}
                  placeholder="State the exact killer/perpetrator and their true unmasked motivation..."
                  className="w-full bg-white border border-black p-3 text-xs font-serif text-[#1a1a1a] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('suspects')}
                  className="bg-white border border-black text-[#1a1a1a] px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#f5f2ed]"
                >
                  ← Back to Suspects
                </button>

                <button
                  type="submit"
                  className="bg-[#8b0000] hover:bg-black text-white px-6 py-2.5 text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                >
                  CREATE & ARCHIVE CASE DOSSIER
                </button>
              </div>
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="flex flex-wrap items-center justify-end border-t-2 border-black pt-4 gap-3">
            <button
              type="button"
              onClick={() => setIsNewReviewModalOpen(false)}
              className="px-4 py-2 border-2 border-black text-xs font-sans font-bold uppercase hover:bg-[#faf7f2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#8b0000] hover:bg-black text-white px-6 py-2.5 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              LOG & SAVE NEW CASE FILE
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
