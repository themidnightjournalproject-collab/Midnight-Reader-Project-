export type Genre = 
  | 'Psychological Thriller'
  | 'Murder Mystery'
  | 'Domestic Thriller'
  | 'Locked Room Mystery'
  | 'Legal Thriller'
  | 'Cozy Mystery'
  | 'Crime & Police Procedural'
  | 'Gothic Thriller';

export type OtherGenre = 
  | 'Non-Fiction'
  | 'Memoir & Biography'
  | 'Psychology & Behaviour'
  | 'Science & Technology'
  | 'Philosophy & Essays'
  | 'Self-Improvement & Habits'
  | 'History & Geopolitics'
  | 'Literary & Classic Fiction'
  | 'Sci-Fi & Speculative'
  | 'Fantasy & Magical Realism'
  | 'Historical Fiction'
  | 'Dystopian & Post-Apocalyptic'
  | 'Contemporary & Romance'
  | 'Investigative Journalism'
  | 'Poetry, Plays & Art'
  | 'Creativity & Craft'
  | 'Other Literature';

export const ALL_OTHER_GENRES: OtherGenre[] = [
  'Psychology & Behaviour',
  'Literary & Classic Fiction',
  'Sci-Fi & Speculative',
  'Memoir & Biography',
  'Philosophy & Essays',
  'Fantasy & Magical Realism',
  'Historical Fiction',
  'Science & Technology',
  'Self-Improvement & Habits',
  'History & Geopolitics',
  'Dystopian & Post-Apocalyptic',
  'Contemporary & Romance',
  'Investigative Journalism',
  'Poetry, Plays & Art',
  'Creativity & Craft',
  'Non-Fiction',
  'Other Literature',
];

export type CaseStatus = 'CLOSED' | 'UNDER INVESTIGATION' | 'COLD CASE' | 'HIGH CONFIDENCE GUESS';

export interface Suspect {
  id: string;
  name: string;
  role: string; // e.g. "The Housekeeper", "The Wealthy Husband", "The Neighbor"
  motive: string;
  opportunity: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM';
  alibi: string;
  suspicionLevel: number; // 1 to 5
  clues: string[];
  isActualCulprit?: boolean;
  revealNotes?: string;
  avatarIcon?: string;
}

export interface ClueItem {
  id: string;
  title: string;
  summary: string;
  detailedAnalysis: string;
  pageDiscovered?: string | number;
  importance: 'CRUCIAL' | 'DECEPTIVE (RED HERRING)' | 'CONFIRMED EVIDENCE' | 'ANOMALOUS';
  unlocked?: boolean;
}

export interface WitnessComment {
  id: string;
  name: string;
  date: string;
  content: string;
  verdictTag?: 'Guessed It' | 'Blown Away' | 'Red Herring Victim' | 'Total Shock' | 'Investigator Note';
}

export interface BookReview {
  id: string;
  caseNumber: string; // e.g. "014"
  title: string;
  author: string;
  coverImage: string;
  genre: Genre;
  dateRead: string; // e.g. "Nov 04, 2025"
  dateStarted?: string; // e.g. "Oct 28, 2025"
  dateFinished?: string; // e.g. "Nov 04, 2025"
  yearRead: number;
  pages: number;
  rating: number; // 1 to 5
  status: CaseStatus;
  leadQuote: string;
  summary: string;
  reviewText: string;
  whatIThought: string;
  whatActuallyHappened: string;
  favoriteMoment: string;
  finalVerdict: string;
  paranoiaRating: number; // 1 to 5 (e.g. coffee cups or magnifying glasses)
  twistsCount: number;
  unreliableNarratorRating: number; // 1 to 5
  spoilerEvidence: string;
  spoilerCulpritReveal?: string;
  marginaliaNotes?: string[];
  evidenceBullets: string[];
  suspects: Suspect[];
  clues: ClueItem[];
  correctGuess?: boolean;
  // Extended Proper Review Fields
  tropes?: string[]; // e.g. ["Unreliable Narrator", "Dual Timeline", "Isolated Setting"]
  atmosphereRating?: number; // 1 to 5
  pacingRating?: number; // 1 to 5
  twistExecutionRating?: number; // 1 to 5
  recommendedFor?: string; // e.g. "Fans of Gillian Flynn & Riley Sager"
  readingFormat?: 'Hardcover' | 'Paperback' | 'Audiobook' | 'E-Reader';
  // Measurable results & visitor engagement
  likes?: number;
  readerPollVotes?: {
    solvedBeforeTwist?: number;
    fooledCompletely?: number;
    sawItComingMidway?: number;
    jawDroppedEnding?: number;
  };
  witnessComments?: WitnessComment[];
}

export interface MindsetRatings {
  readability: number; // 1 to 5
  actionability: number; // 1 to 5
  intellectualImpact: number; // 1 to 5
  originality: number; // 1 to 5
}

export interface NonFictionBook {
  id: string;
  catalogNumber: string; // e.g. "NF-001"
  title: string;
  author: string;
  coverImage: string;
  coverUrl?: string; // alias
  genre: OtherGenre;
  dateStarted: string; // e.g. "Jan 12, 2026"
  dateFinished: string; // e.g. "Jan 28, 2026"
  dateLogged?: string;
  yearRead: number;
  pages: number;
  rating: number; // 1 to 5
  status?: 'COMPLETED' | 'IN PROGRESS' | 'REFERENCE & RE-READING' | 'ABANDONED';
  readingFormat?: 'Hardcover' | 'Paperback' | 'Audiobook' | 'E-Reader';
  oneSentenceTakeaway: string;
  tagline?: string; // alias
  summary: string;
  reviewText: string;
  fullReview?: string; // alias
  favoriteQuote?: string;
  favoriteQuotes?: string[];
  quoteContext?: string;
  keyTakeaways: string[];
  actionItems?: string[];
  mindsetRatings: MindsetRatings;
  tropes?: string[]; // e.g. ["Mental Models", "Dual Timelines", "Character Study"]
  tags?: string[];
  themes?: string[]; // alias
  readerReflections?: string;
  recommendedTo?: string;
  likes?: number;
  notesScratchpad?: string[];
}

export interface HeroConfig {
  headline: string; // "“ANOTHER BOOK. ANOTHER SUSPECT.”"
  dossierTag: string; // "Dossier #2026-B"
  leadBadge: string; // "Lead Story • Case Dispatch"
  bioParagraph1: string;
  bioParagraph2: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  quoteAttribution?: string;
}

export interface CurrentlyReading {
  title: string;
  author: string;
  coverImage: string;
  genre: string;
  currentPage: number;
  totalPages: number;
  startDate: string;
  currentTheory: string;
  suspectsNoted?: string[];
  paranoiaLevel?: string;
  // Non-thriller parallel read:
  showNonThriller?: boolean;
  nonThrillerTitle?: string;
  nonThrillerAuthor?: string;
  nonThrillerGenre?: string;
  nonThrillerCoverImage?: string;
  nonThrillerCurrentPage?: number;
  nonThrillerTotalPages?: number;
  nonThrillerStartDate?: string;
  nonThrillerThoughts?: string;
  nonThrillerNotes?: string;
}

export interface ReadingStats {
  year: number;
  booksRead: number;
  thrillersRead: number;
  favoriteBook: string;
  averageRating: number;
  longestBook: string;
  longestBookPages: number;
  suspectsAccused: number;
  correctGuesses: number;
  unnecessaryParanoia: number; // 100%
  cupsOfTeaDrank: number;
  plotTwistsExperienced: number;
  // Extended editable fields
  totalPagesRead?: number;
  readingStreakDays?: number;
  favoriteTrope?: string;
  fastestSolve?: string;
  customStat1Label?: string;
  customStat1Value?: string;
  customStat2Label?: string;
  customStat2Value?: string;
}

export interface TimelineMilestone {
  id: string;
  year: number;
  date: string;
  title: string;
  description: string;
  badgeText?: string;
  highlightType?: 'breakthrough' | 'record' | 'cold-case' | 'general';
}

export interface TimelineStats {
  archiveSpan: string;
  readingPace: string;
  fastestInvestigation: string;
  longestCaseFile: string;
  coldCasesSolved: string;
  historicalLedgerNote: string;
  customTimelineStat1Label?: string;
  customTimelineStat1Value?: string;
  customTimelineStat2Label?: string;
  customTimelineStat2Value?: string;
}

export interface IntelligenceStats {
  bureauTitle: string;
  headline: string;
  dispatchNote: string;
  kpiSectionTitle?: string;
  leaderboardTitle?: string;
  breakdownTableTitle?: string;
  testimoniesTitle?: string;
  card1Title?: string;
  card1Subtitle?: string;
  card2Title?: string;
  card2Subtitle?: string;
  card3Title?: string;
  card3Subtitle?: string;
  card4Title?: string;
  card4Subtitle?: string;
  tableColRef?: string;
  tableColTitle?: string;
  tableColGenre?: string;
  tableColScore?: string;
  tableColEndorsements?: string;
  tableColPollVotes?: string;
  tableColSolved?: string;
  tableColNotes?: string;
  tableColActions?: string;
  overrideLikes?: number | null;
  overridePollVotes?: number | null;
  overrideComments?: number | null;
  overrideAccuracy?: number | null;
  customHighlightLabel?: string;
  customHighlightValue?: string;
  featuredQuoteAuthor?: string;
  featuredQuoteText?: string;
}

export interface AboutRule {
  number: number;
  title: string;
  description: string;
}

export interface AboutConfig {
  headerSubtitle: string;
  headerBadge: string;
  pageTitle: string;
  curatorPhoto: string;
  photoStamp: string;
  classification: string;
  obsession: string;
  featuredQuote: string;
  bioParagraph1: string;
  bioParagraph2: string;
  bioParagraph3: string;
  rulesHeading: string;
  rules: AboutRule[];
  finalNote: string;
}

export interface UserTheorySubmission {
  reviewId: string;
  suspectName: string;
  reason: string;
  keyClue: string;
  timestamp: string;
  verdictResponse: string;
}
