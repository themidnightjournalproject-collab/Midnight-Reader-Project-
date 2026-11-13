import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { 
  BookReview, 
  CurrentlyReading, 
  ReadingStats, 
  UserTheorySubmission, 
  Genre, 
  WitnessComment, 
  NonFictionBook, 
  HeroConfig,
  TimelineMilestone,
  TimelineStats,
  IntelligenceStats,
  AboutConfig,
  OffTheRecordConfig,
  GitHubUser,
  CurrentlyReadingBook,
  CompletingBookTarget,
  ArchiveCurrentBookParams,
  ALL_OTHER_GENRES,
  INITIAL_ARCHIVE_GENRES,
  BookAlbum,
  BookAlbumItem
} from '../types';
import { 
  INITIAL_REVIEWS, 
  INITIAL_CURRENTLY_READING, 
  INITIAL_STATS, 
  INITIAL_ADMIN_PASSCODE, 
  INITIAL_NON_FICTION_BOOKS, 
  INITIAL_HERO_CONFIG,
  INITIAL_TIMELINE_STATS,
  INITIAL_TIMELINE_MILESTONES,
  INITIAL_INTELLIGENCE_STATS,
  INITIAL_ABOUT_CONFIG,
  INITIAL_OFF_THE_RECORD_CONFIG
} from '../data/initialData';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { resolveBookCoverUrl } from '../components/common/BookCoverImage';

const sanitizeReviewsList = (list: BookReview[]): BookReview[] => {
  if (!Array.isArray(list)) return [];
  return list.map((r) => ({
    ...r,
    coverImage: resolveBookCoverUrl(r.coverImage, r.title, r.author, r.genre),
  }));
};

const sanitizeNonFictionList = (list: NonFictionBook[]): NonFictionBook[] => {
  if (!Array.isArray(list)) return [];
  return list.map((n) => {
    const clean = resolveBookCoverUrl(n.coverImage || n.coverUrl, n.title, n.author, n.genre);
    return {
      ...n,
      coverImage: clean,
      coverUrl: clean,
    };
  });
};

const sanitizeCurrentlyReading = (cr: CurrentlyReading): CurrentlyReading => {
  if (!cr) return cr;
  const cleanMain = resolveBookCoverUrl(cr.coverImage, cr.title, cr.author, cr.genre);
  const cleanNonThriller = cr.nonThrillerTitle
    ? resolveBookCoverUrl(cr.nonThrillerCoverImage, cr.nonThrillerTitle, cr.nonThrillerAuthor, cr.nonThrillerGenre)
    : cr.nonThrillerCoverImage;
  const cleanAdditional = (cr.additionalBooks || []).map((b) => ({
    ...b,
    coverImage: resolveBookCoverUrl(b.coverImage, b.title, b.author, b.genre),
  }));
  return {
    ...cr,
    coverImage: cleanMain,
    nonThrillerCoverImage: cleanNonThriller,
    additionalBooks: cleanAdditional,
  };
};

export type ActiveView = 
  | 'home' 
  | 'journal' 
  | 'reviews' 
  | 'casefiles' 
  | 'currently-reading' 
  | 'suspect-board' 
  | 'non-fiction'
  | 'timeline' 
  | 'stats' 
  | 'about' 
  | 'manage-books' 
  | 'backup-sync' 
  | 'analytics';

interface JournalContextType {
  reviews: BookReview[];
  nonFictionBooks: NonFictionBook[];
  heroConfig: HeroConfig;
  currentlyReading: CurrentlyReading;
  stats: ReadingStats;
  timelineStats: TimelineStats;
  timelineMilestones: TimelineMilestone[];
  intelligenceStats: IntelligenceStats;
  aboutConfig: AboutConfig;
  offTheRecordConfig: OffTheRecordConfig;
  selectedReview: BookReview | null;
  selectedNonFictionBook: NonFictionBook | null;
  activeView: ActiveView;
  searchQuery: string;
  selectedGenre: Genre | 'All';
  visitorGuesses: Record<string, string>; // reviewId -> suspectId
  revealedAnswers: Record<string, boolean>; // reviewId -> boolean
  unlockedClues: Record<string, boolean>; // clueId -> boolean
  unlockedSpoilers: Record<string, boolean>; // reviewId -> boolean
  userTheories: UserTheorySubmission[];
  isNewReviewModalOpen: boolean;
  isNewNonFictionModalOpen: boolean;
  isStatsEditorOpen: boolean;
  isTimelineEditorOpen: boolean;
  isIntelligenceEditorOpen: boolean;
  isCurrentlyReadingModalOpen: boolean;
  isEditHeroModalOpen: boolean;
  isEditAboutModalOpen: boolean;
  isAddFileModalOpen: boolean;
  isCompleteBookModalOpen: boolean;
  completingBookTarget: CompletingBookTarget | null;
  editingReview: BookReview | null;
  editingNonFictionBook: NonFictionBook | null;
  
  // Interactive reader engagement
  postLikes: Record<string, number>;
  userLikedPosts: Record<string, boolean>;
  readerPollVotes: Record<string, Record<string, number>>;
  userPollVotes: Record<string, string>;
  witnessComments: Record<string, WitnessComment[]>;

  // Admin / Chief Investigator Editor Clearance
  isAdminUnlocked: boolean;
  isAdminModalOpen: boolean;
  adminPasscode: string;
  setIsAdminModalOpen: (open: boolean) => void;
  unlockAdmin: (passcode: string) => Promise<boolean> | boolean;
  lockAdmin: () => void;
  setAdminPasscode: (newPasscode: string) => Promise<boolean> | void;

  // GitHub Integration & Clearance
  githubUser: GitHubUser | null;
  isGitHubConnected: boolean;
  isGitHubConfigured: boolean;
  isGitHubModalOpen: boolean;
  setIsGitHubModalOpen: (open: boolean) => void;
  connectGitHubWithOAuth: () => Promise<{ success: boolean; message?: string; needsConfig?: boolean }>;
  connectGitHubWithToken: (token: string) => Promise<{ success: boolean; message: string; user?: GitHubUser }>;
  disconnectGitHub: () => Promise<void>;
  syncToGitHub: (customToken?: string) => Promise<{ success: boolean; message: string; gistUrl?: string }>;

  // Firestore Cloud Database Sync & Health Status
  isSyncingFirestore: boolean;
  lastFirestoreSync: Date | null;
  firestoreSyncError: string | null;
  retryFirestoreSync: () => Promise<void>;
  syncWithServer: (statePayload?: any) => Promise<void>;

  // Actions
  setActiveView: (view: ActiveView) => void;
  setSelectedReview: (review: BookReview | null) => void;
  setSelectedNonFictionBook: (book: NonFictionBook | null) => void;
  setEditingReview: (review: BookReview | null) => void;
  setEditingNonFictionBook: (book: NonFictionBook | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: Genre | 'All') => void;
  openReviewById: (id: string) => void;
  addReview: (review: Omit<BookReview, 'id' | 'caseNumber'> & { id?: string; caseNumber?: string }) => Promise<BookReview>;
  updateReview: (id: string, updated: Partial<BookReview>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  duplicateReview: (id: string) => Promise<BookReview | void>;

  // Non-Fiction / Other Books CRUD & Notes
  addNonFictionBook: (book: Omit<NonFictionBook, 'id' | 'catalogNumber'> & { id?: string; catalogNumber?: string }) => Promise<NonFictionBook>;
  updateNonFictionBook: (id: string, updated: Partial<NonFictionBook>) => Promise<void>;
  deleteNonFictionBook: (id: string) => Promise<void>;
  duplicateNonFictionBook: (id: string) => Promise<NonFictionBook | void>;
  toggleLikeNonFictionBook: (id: string) => Promise<void>;
  addNonFictionScratchpadNote: (bookId: string, note: string) => Promise<void>;

  // Hero Section Editor
  updateHeroConfig: (config: Partial<HeroConfig>) => Promise<void>;
  // About Section Editor
  updateAboutConfig: (config: Partial<AboutConfig>) => Promise<void>;
  // Off The Record (Library) Section Editor
  updateOffTheRecordConfig: (config: Partial<OffTheRecordConfig>) => Promise<void>;

  updateCurrentlyReading: (cr: Partial<CurrentlyReading>) => Promise<void>;
  updateStats: (st: Partial<ReadingStats>) => Promise<void>;
  updateTimelineStats: (st: Partial<TimelineStats>) => Promise<void>;
  addTimelineMilestone: (ms: Omit<TimelineMilestone, 'id'>) => Promise<void>;
  updateTimelineMilestone: (id: string, updated: Partial<TimelineMilestone>) => Promise<void>;
  deleteTimelineMilestone: (id: string) => Promise<void>;
  updateIntelligenceStats: (st: Partial<IntelligenceStats>) => Promise<void>;
  setVisitorGuess: (reviewId: string, suspectId: string) => void;
  revealAnswer: (reviewId: string) => void;
  toggleClueUnlock: (clueId: string) => void;
  unlockSpoiler: (reviewId: string) => void;
  lockSpoiler: (reviewId: string) => void;
  resetClassifiedFile: (reviewId: string, resetGuess?: boolean) => void;
  resetVisitorGuess: (reviewId: string) => void;
  submitTheory: (submission: Omit<UserTheorySubmission, 'timestamp' | 'verdictResponse'>) => UserTheorySubmission;
  setIsNewReviewModalOpen: (open: boolean) => void;
  setIsNewNonFictionModalOpen: (open: boolean) => void;
  setIsStatsEditorOpen: (open: boolean) => void;
  setIsTimelineEditorOpen: (open: boolean) => void;
  setIsIntelligenceEditorOpen: (open: boolean) => void;
  setIsCurrentlyReadingModalOpen: (open: boolean) => void;
  setIsEditHeroModalOpen: (open: boolean) => void;
  setIsEditAboutModalOpen: (open: boolean) => void;
  isEditOffTheRecordModalOpen: boolean;
  setIsEditOffTheRecordModalOpen: (open: boolean) => void;
  setIsAddFileModalOpen: (open: boolean) => void;
  setIsCompleteBookModalOpen: (open: boolean) => void;
  setCompletingBookTarget: (target: CompletingBookTarget | null) => void;
  openCompleteAndArchive: (target: CompletingBookTarget) => void;
  archiveCurrentBook: (params: ArchiveCurrentBookParams) => Promise<void>;
  addBookToCurrentReads: (book: Omit<CurrentlyReadingBook, 'id'>) => Promise<void>;
  removeBookFromCurrentReads: (id: string) => Promise<void>;
  updateAdditionalBook: (id: string, updated: Partial<CurrentlyReadingBook>) => Promise<void>;
  moveAdditionalToPrimary: (id: string) => Promise<void>;
  moveAdditionalToCompanion: (id: string) => Promise<void>;
  movePrimaryToAdditional: () => Promise<void>;
  moveCompanionToAdditional: () => Promise<void>;
  openEditAdditionalBook: (id: string) => void;
  editingAdditionalBookId: string | null;
  setEditingAdditionalBookId: (id: string | null) => void;
  
  // Interactivity Actions
  toggleLikePost: (reviewId: string) => void;
  voteReaderPoll: (reviewId: string, optionKey: string) => void;
  addWitnessComment: (reviewId: string, comment: Omit<WitnessComment, 'id' | 'date'>) => void;

  // Trope Management for Case Files and Research
  customThrillerTropes: string[];
  customResearchTropes: string[];
  addCustomThrillerTrope: (trope: string) => void;
  removeCustomThrillerTrope: (trope: string) => void;
  addCustomResearchTrope: (trope: string) => void;
  removeCustomResearchTrope: (trope: string) => void;
  removeTropeFromReview: (reviewId: string, trope: string) => Promise<void>;
  removeTropeFromNonFiction: (bookId: string, trope: string) => Promise<void>;

  // Genre Management for Off the Record and Archive
  offTheRecordGenres: string[];
  addOffTheRecordGenre: (genre: string) => Promise<void>;
  editOffTheRecordGenre: (oldGenre: string, newGenre: string) => Promise<void>;
  removeOffTheRecordGenre: (genre: string) => Promise<void>;
  resetOffTheRecordGenres: () => Promise<void>;
  archiveGenres: string[];
  addArchiveGenre: (genre: string) => Promise<void>;
  editArchiveGenre: (oldGenre: string, newGenre: string) => Promise<void>;
  removeArchiveGenre: (genre: string) => Promise<void>;
  resetArchiveGenres: () => Promise<void>;

  // Book Albums (Group existing books together in reading order inside the library)
  bookAlbums: BookAlbum[];
  allAlbumNames: string[];
  viewingAlbumId: string | null;
  setViewingAlbumId: (id: string | null) => void;
  isAlbumEditorOpen: boolean;
  setIsAlbumEditorOpen: (open: boolean) => void;
  editingAlbum: BookAlbum | null;
  setEditingAlbum: (album: BookAlbum | null) => void;
  openAlbumEditor: (album?: BookAlbum | null) => void;
  openAlbumByName: (name: string) => void;
  saveBookAlbum: (payload: {
    id?: string;
    name: string;
    description?: string;
    items: BookAlbumItem[];
  }) => Promise<BookAlbum>;
  deleteBookAlbum: (albumId: string) => Promise<void>;
  addBookToAlbum: (albumId: string, item: BookAlbumItem) => Promise<void>;
  removeBookFromAlbum: (albumId: string, item: BookAlbumItem) => Promise<void>;
  reorderAlbumItems: (albumId: string, items: BookAlbumItem[]) => Promise<void>;
  assignBookToNamedAlbum: (albumName: string | undefined, item: BookAlbumItem, preferredOrder?: number) => Promise<void>;

  // Redeployment & Data Portability
  exportDataAsJSON: () => string;
  importDataFromJSON: (jsonString: string) => Promise<{ success: boolean; message: string }>;
  generateSeedCode: () => string;
  resetToDefaults: () => Promise<void>;
}

const deriveAlbumsFromBooks = (reviewsList: BookReview[], nfList: NonFictionBook[]): BookAlbum[] => {
  const map = new Map<string, { name: string; entries: { item: BookAlbumItem; order: number }[] }>();
  reviewsList.forEach((r) => {
    const s = r.seriesName?.trim();
    if (!s) return;
    const key = s.toLowerCase();
    if (!map.has(key)) map.set(key, { name: s, entries: [] });
    map.get(key)!.entries.push({ item: { kind: 'thriller', id: r.id }, order: r.seriesOrder || 999 });
  });
  nfList.forEach((b) => {
    const s = b.seriesName?.trim();
    if (!s) return;
    const key = s.toLowerCase();
    if (!map.has(key)) map.set(key, { name: s, entries: [] });
    map.get(key)!.entries.push({ item: { kind: 'non-fiction', id: b.id }, order: b.seriesOrder || 999 });
  });
  const now = new Date().toISOString();
  return Array.from(map.values()).map((group) => ({
    id: `album-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || Date.now()}`,
    name: group.name,
    items: group.entries.sort((a, b) => a.order - b.order).map((e) => e.item),
    createdAt: now,
    updatedAt: now,
  }));
};

const computeNextAlbumsForBook = (
  albumsList: BookAlbum[],
  albumName: string | undefined,
  item: BookAlbumItem,
  preferredOrder?: number
): BookAlbum[] => {
  const clean = albumName?.trim() || '';
  const now = new Date().toISOString();

  let nextAlbums = albumsList.map((album) => {
    const matchesTarget = clean && album.name.trim().toLowerCase() === clean.toLowerCase();
    if (!matchesTarget) {
      return {
        ...album,
        items: album.items.filter((it) => !(it.kind === item.kind && it.id === item.id)),
      };
    }
    const filtered = album.items.filter((it) => !(it.kind === item.kind && it.id === item.id));
    const insertIdx =
      preferredOrder && preferredOrder > 0
        ? Math.min(filtered.length, preferredOrder - 1)
        : filtered.length;
    const updatedItems = [...filtered];
    updatedItems.splice(insertIdx, 0, item);
    return {
      ...album,
      items: updatedItems,
      updatedAt: now,
    };
  });

  if (clean && !nextAlbums.some((a) => a.name.trim().toLowerCase() === clean.toLowerCase())) {
    nextAlbums = [
      {
        id: `album-${clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'custom'}-${Date.now()}`,
        name: clean,
        description: '',
        items: [item],
        createdAt: now,
        updatedAt: now,
      },
      ...nextAlbums,
    ];
  }

  return nextAlbums;
};

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const DEFAULT_THRILLER_TROPES: string[] = [
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
  'Paranoid Protagonist',
  'Red Herring Suspect',
  'Secret Society',
  'Claustrophobic Setting',
];

export const DEFAULT_RESEARCH_TROPES: string[] = [
  'Mental Models',
  'Cognitive Biases',
  'Systems Thinking',
  'Character Study',
  'Coming-of-Age',
  'Speculative Worldbuilding',
  'Dual Timelines',
  'Deep Focus & Habits',
  'Philosophical Meditations',
  'Existential Reflections',
  'Scientific Method',
  'Interstellar Exploration',
  'Grief & Healing',
  'Social Commentary',
  'Historical Chronicle',
  'Epistolary / Letters',
  'Satire & Irony',
  'Biographical Investigation',
  'Magical Realism',
  'Creative Craft & Artistry',
  'Morality & Ethics',
  'Unreliable Memory',
];

const STORAGE_KEYS = {
  REVIEWS: 'midnight_reader_reviews_v4',
  NON_FICTION: 'midnight_reader_nf_v4',
  HERO_CONFIG: 'midnight_reader_hero_v4',
  CURRENTLY_READING: 'midnight_reader_cr_v4',
  STATS: 'midnight_reader_stats_v4',
  THEORIES: 'midnight_reader_theories_v4',
  GUESSES: 'midnight_reader_guesses_v4',
  LIKES: 'midnight_reader_likes_v4',
  USER_LIKES: 'midnight_reader_user_likes_v4',
  POLL_VOTES: 'midnight_reader_polls_v4',
  USER_POLLS: 'midnight_reader_user_polls_v4',
  COMMENTS: 'midnight_reader_comments_v4',
  ADMIN_UNLOCKED: 'midnight_reader_admin_unlocked_v4',
  ADMIN_PASSCODE: 'midnight_reader_admin_passcode_v4',
  TIMELINE_STATS: 'midnight_reader_timeline_stats_v4',
  TIMELINE_MILESTONES: 'midnight_reader_timeline_milestones_v4',
  INTELLIGENCE_STATS: 'midnight_reader_intelligence_stats_v4',
  ABOUT_CONFIG: 'midnight_reader_about_config_v4',
  OFF_THE_RECORD_CONFIG: 'midnight_reader_off_the_record_v4',
  CUSTOM_THRILLER_TROPES: 'midnight_reader_custom_thriller_tropes_v4',
  CUSTOM_RESEARCH_TROPES: 'midnight_reader_custom_research_tropes_v4',
  OFF_THE_RECORD_GENRES: 'midnight_reader_off_the_record_genres_v4',
  ARCHIVE_GENRES: 'midnight_reader_archive_genres_v4',
  BOOK_ALBUMS: 'midnight_reader_albums_v1',
};

const INITIAL_LIKES_SEED: Record<string, number> = {
  'case-014': 248,
  'case-013': 189,
  'case-012': 312,
  'case-011': 145,
  'case-010': 276,
  'case-009': 198,
  'case-008': 167,
  'case-007': 289,
  'case-006': 214,
  'case-005': 178,
  'case-004': 203,
  'case-003': 341,
  'case-002': 290,
  'case-001': 182,
};

const INITIAL_POLLS_SEED: Record<string, Record<string, number>> = {
  'case-014': { solvedBeforeTwist: 142, fooledCompletely: 64, sawItComingMidway: 29, jawDroppedEnding: 198 },
  'case-013': { solvedBeforeTwist: 88, fooledCompletely: 194, sawItComingMidway: 41, jawDroppedEnding: 156 },
  'case-012': { solvedBeforeTwist: 210, fooledCompletely: 45, sawItComingMidway: 82, jawDroppedEnding: 260 },
  'case-010': { solvedBeforeTwist: 175, fooledCompletely: 91, sawItComingMidway: 33, jawDroppedEnding: 180 },
  'case-003': { solvedBeforeTwist: 230, fooledCompletely: 115, sawItComingMidway: 44, jawDroppedEnding: 290 },
};

const INITIAL_COMMENTS_SEED: Record<string, WitnessComment[]> = {
  'case-014': [
    {
      id: 'wit-001',
      name: 'Detective Morgan (Reader)',
      date: 'Nov 05, 2025',
      content: 'I suspected Andrew the entire time! When the attic door locked, my heart dropped into my stomach. 5/5 stars.',
      verdictTag: 'Guessed It',
    },
    {
      id: 'wit-002',
      name: 'Agent Cooper',
      date: 'Nov 06, 2025',
      content: 'Nina Winchester is one of the most calculated characters in modern thriller literature. Brilliant breakdown!',
      verdictTag: 'Investigator Note',
    }
  ]
};

export const JournalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Main journal state
  const [reviews, setReviews] = useState<BookReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? sanitizeReviewsList(JSON.parse(saved)) : sanitizeReviewsList(INITIAL_REVIEWS);
    } catch {
      return sanitizeReviewsList(INITIAL_REVIEWS);
    }
  });

  const [currentlyReading, setCurrentlyReading] = useState<CurrentlyReading>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENTLY_READING);
      return saved ? sanitizeCurrentlyReading(JSON.parse(saved)) : sanitizeCurrentlyReading(INITIAL_CURRENTLY_READING);
    } catch {
      return sanitizeCurrentlyReading(INITIAL_CURRENTLY_READING);
    }
  });

  const [stats, setStats] = useState<ReadingStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [timelineStats, setTimelineStats] = useState<TimelineStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMELINE_STATS);
      return saved ? JSON.parse(saved) : INITIAL_TIMELINE_STATS;
    } catch {
      return INITIAL_TIMELINE_STATS;
    }
  });

  const [timelineMilestones, setTimelineMilestones] = useState<TimelineMilestone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMELINE_MILESTONES);
      return saved ? JSON.parse(saved) : INITIAL_TIMELINE_MILESTONES;
    } catch {
      return INITIAL_TIMELINE_MILESTONES;
    }
  });

  const [intelligenceStats, setIntelligenceStats] = useState<IntelligenceStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTELLIGENCE_STATS);
      return saved ? JSON.parse(saved) : INITIAL_INTELLIGENCE_STATS;
    } catch {
      return INITIAL_INTELLIGENCE_STATS;
    }
  });

  const [nonFictionBooks, setNonFictionBooks] = useState<NonFictionBook[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NON_FICTION);
      return saved ? sanitizeNonFictionList(JSON.parse(saved)) : sanitizeNonFictionList(INITIAL_NON_FICTION_BOOKS);
    } catch {
      return sanitizeNonFictionList(INITIAL_NON_FICTION_BOOKS);
    }
  });

  const [heroConfig, setHeroConfig] = useState<HeroConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO_CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_HERO_CONFIG;
    } catch {
      return INITIAL_HERO_CONFIG;
    }
  });

  const [aboutConfig, setAboutConfig] = useState<AboutConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ABOUT_CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_ABOUT_CONFIG;
    } catch {
      return INITIAL_ABOUT_CONFIG;
    }
  });

  const [offTheRecordConfig, setOffTheRecordConfig] = useState<OffTheRecordConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFF_THE_RECORD_CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_OFF_THE_RECORD_CONFIG;
    } catch {
      return INITIAL_OFF_THE_RECORD_CONFIG;
    }
  });

  const [selectedReview, setSelectedReview] = useState<BookReview | null>(null);
  const [selectedNonFictionBook, setSelectedNonFictionBook] = useState<NonFictionBook | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');

  // Reader interactive state
  const [visitorGuesses, setVisitorGuessesState] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GUESSES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [unlockedClues, setUnlockedClues] = useState<Record<string, boolean>>({});
  const [unlockedSpoilers, setUnlockedSpoilers] = useState<Record<string, boolean>>({});

  const [userTheories, setUserTheories] = useState<UserTheorySubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEORIES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Endorsements (Likes)
  const [postLikes, setPostLikes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKES);
      return saved ? JSON.parse(saved) : INITIAL_LIKES_SEED;
    } catch {
      return INITIAL_LIKES_SEED;
    }
  });

  const [userLikedPosts, setUserLikedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_LIKES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Reader Poll Votes
  const [readerPollVotes, setReaderPollVotes] = useState<Record<string, Record<string, number>>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POLL_VOTES);
      return saved ? JSON.parse(saved) : INITIAL_POLLS_SEED;
    } catch {
      return INITIAL_POLLS_SEED;
    }
  });

  const [userPollVotes, setUserPollVotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_POLLS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Witness Testimonies (Comments)
  const [witnessComments, setWitnessComments] = useState<Record<string, WitnessComment[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS_SEED;
    } catch {
      return INITIAL_COMMENTS_SEED;
    }
  });

  // Modals state
  const [isNewReviewModalOpen, setIsNewReviewModalOpen] = useState(false);
  const [isNewNonFictionModalOpen, setIsNewNonFictionModalOpen] = useState(false);
  const [isStatsEditorOpen, setIsStatsEditorOpen] = useState(false);
  const [isTimelineEditorOpen, setIsTimelineEditorOpen] = useState(false);
  const [isIntelligenceEditorOpen, setIsIntelligenceEditorOpen] = useState(false);
  const [isCurrentlyReadingModalOpen, setIsCurrentlyReadingModalOpen] = useState(false);
  const [isEditHeroModalOpen, setIsEditHeroModalOpen] = useState(false);
  const [isEditAboutModalOpen, setIsEditAboutModalOpen] = useState(false);
  const [isEditOffTheRecordModalOpen, setIsEditOffTheRecordModalOpen] = useState(false);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [isCompleteBookModalOpen, setIsCompleteBookModalOpen] = useState(false);
  const [completingBookTarget, setCompletingBookTarget] = useState<CompletingBookTarget | null>(null);
  const [editingReview, setEditingReview] = useState<BookReview | null>(null);
  const [editingNonFictionBook, setEditingNonFictionBook] = useState<NonFictionBook | null>(null);
  const [editingAdditionalBookId, setEditingAdditionalBookId] = useState<string | null>(null);
  const [bookAlbums, setBookAlbums] = useState<BookAlbum[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOK_ALBUMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback below
    }
    try {
      const savedRevs = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const savedNf = localStorage.getItem(STORAGE_KEYS.NON_FICTION);
      const revList = savedRevs ? JSON.parse(savedRevs) : INITIAL_REVIEWS;
      const nfList = savedNf ? JSON.parse(savedNf) : INITIAL_NON_FICTION_BOOKS;
      return deriveAlbumsFromBooks(revList, nfList);
    } catch {
      return deriveAlbumsFromBooks(INITIAL_REVIEWS, INITIAL_NON_FICTION_BOOKS);
    }
  });
  const [viewingAlbumId, setViewingAlbumId] = useState<string | null>(null);
  const [isAlbumEditorOpen, setIsAlbumEditorOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<BookAlbum | null>(null);

  // Chief Investigator / Admin Editor clearance (starts locked on every fresh tab/window open)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_UNLOCKED);
      const saved = sessionStorage.getItem(STORAGE_KEYS.ADMIN_UNLOCKED);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [adminPasscode, setAdminPasscodeState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSCODE);
      if (saved === 'detective' && INITIAL_ADMIN_PASSCODE && INITIAL_ADMIN_PASSCODE !== 'detective') {
        return INITIAL_ADMIN_PASSCODE;
      }
      return saved || INITIAL_ADMIN_PASSCODE || '';
    } catch {
      return INITIAL_ADMIN_PASSCODE || '';
    }
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // GitHub Authentication & Clearance state
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [isGitHubConfigured, setIsGitHubConfigured] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  // Custom Tropes State
  const [customThrillerTropes, setCustomThrillerTropes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_THRILLER_TROPES);
      return saved ? JSON.parse(saved) : DEFAULT_THRILLER_TROPES;
    } catch {
      return DEFAULT_THRILLER_TROPES;
    }
  });

  const [customResearchTropes, setCustomResearchTropes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_RESEARCH_TROPES);
      return saved ? JSON.parse(saved) : DEFAULT_RESEARCH_TROPES;
    } catch {
      return DEFAULT_RESEARCH_TROPES;
    }
  });

  const addCustomThrillerTrope = (trope: string) => {
    const clean = trope.trim();
    if (!clean) return;
    setCustomThrillerTropes((prev) => {
      if (prev.some((t) => t.toLowerCase() === clean.toLowerCase())) return prev;
      const next = [...prev, clean];
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_THRILLER_TROPES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const removeCustomThrillerTrope = (tropeToRemove: string) => {
    const clean = tropeToRemove.trim().toLowerCase();
    setCustomThrillerTropes((prev) => {
      const next = prev.filter((t) => t.trim().toLowerCase() !== clean);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_THRILLER_TROPES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const addCustomResearchTrope = (trope: string) => {
    const clean = trope.trim();
    if (!clean) return;
    setCustomResearchTropes((prev) => {
      if (prev.some((t) => t.toLowerCase() === clean.toLowerCase())) return prev;
      const next = [...prev, clean];
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_RESEARCH_TROPES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const removeCustomResearchTrope = (tropeToRemove: string) => {
    const clean = tropeToRemove.trim().toLowerCase();
    setCustomResearchTropes((prev) => {
      const next = prev.filter((t) => t.trim().toLowerCase() !== clean);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_RESEARCH_TROPES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const removeTropeFromReview = async (reviewId: string, tropeToRemove: string): Promise<void> => {
    const clean = tropeToRemove.trim().toLowerCase();
    let updatedReviews: BookReview[] = reviews;
    setReviews((prev) => {
      updatedReviews = prev.map((r) => {
        if (r.id === reviewId && r.tropes) {
          return {
            ...r,
            tropes: r.tropes.filter((t) => t.trim().toLowerCase() !== clean),
          };
        }
        return r;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updatedReviews));
      } catch (e) {
        console.error(e);
      }
      return updatedReviews;
    });

    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview((prev) =>
        prev
          ? {
              ...prev,
              tropes: (prev.tropes || []).filter((t) => t.trim().toLowerCase() !== clean),
            }
          : null
      );
    }

    await syncWithServer({ reviews: updatedReviews });
  };

  const removeTropeFromNonFiction = async (bookId: string, tropeToRemove: string): Promise<void> => {
    const clean = tropeToRemove.trim().toLowerCase();
    let updatedBooks: NonFictionBook[] = nonFictionBooks;
    setNonFictionBooks((prev) => {
      updatedBooks = prev.map((b) => {
        if (b.id === bookId) {
          const filterFn = (t: string) => t.trim().toLowerCase() !== clean;
          return {
            ...b,
            tropes: (b.tropes || []).filter(filterFn),
            tags: (b.tags || []).filter(filterFn),
            themes: (b.themes || []).filter(filterFn),
          };
        }
        return b;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.NON_FICTION, JSON.stringify(updatedBooks));
      } catch (e) {
        console.error(e);
      }
      return updatedBooks;
    });

    if (selectedNonFictionBook && selectedNonFictionBook.id === bookId) {
      setSelectedNonFictionBook((prev) => {
        if (!prev) return null;
        const filterFn = (t: string) => t.trim().toLowerCase() !== clean;
        return {
          ...prev,
          tropes: (prev.tropes || []).filter(filterFn),
          tags: (prev.tags || []).filter(filterFn),
          themes: (prev.themes || []).filter(filterFn),
        };
      });
    }

    await syncWithServer({ nonFictionBooks: updatedBooks });
  };

  // Genre Management: Off the Record & Archive
  const [offTheRecordGenres, setOffTheRecordGenres] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFF_THE_RECORD_GENRES);
      return saved ? JSON.parse(saved) : (ALL_OTHER_GENRES as string[]);
    } catch {
      return ALL_OTHER_GENRES as string[];
    }
  });

  const [archiveGenres, setArchiveGenres] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARCHIVE_GENRES);
      return saved ? JSON.parse(saved) : (INITIAL_ARCHIVE_GENRES as string[]);
    } catch {
      return INITIAL_ARCHIVE_GENRES as string[];
    }
  });

  // Firestore Cloud Database sync tracking state
  const [isSyncingFirestore, setIsSyncingFirestore] = useState<boolean>(false);
  const [lastFirestoreSync, setLastFirestoreSync] = useState<Date | null>(null);
  const [firestoreSyncError, setFirestoreSyncError] = useState<string | null>(null);

  const addOffTheRecordGenre = async (genre: string): Promise<void> => {
    const clean = genre.trim();
    if (!clean) return;
    let nextGenres: string[] = offTheRecordGenres;
    setOffTheRecordGenres((prev) => {
      if (prev.some((g) => g.toLowerCase() === clean.toLowerCase())) return prev;
      nextGenres = [clean, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.OFF_THE_RECORD_GENRES, JSON.stringify(nextGenres));
      } catch (e) {
        console.error(e);
      }
      return nextGenres;
    });
    await syncWithServer({ offTheRecordGenres: nextGenres } as any);
  };

  const editOffTheRecordGenre = async (oldGenre: string, newGenre: string): Promise<void> => {
    const cleanOld = oldGenre.trim();
    const cleanNew = newGenre.trim();
    if (!cleanNew || cleanOld.toLowerCase() === cleanNew.toLowerCase()) return;

    let nextGenres: string[] = offTheRecordGenres;
    setOffTheRecordGenres((prev) => {
      nextGenres = prev.map((g) => (g.toLowerCase() === cleanOld.toLowerCase() ? cleanNew : g));
      if (!nextGenres.some((g) => g.toLowerCase() === cleanNew.toLowerCase())) {
        nextGenres = [cleanNew, ...nextGenres];
      }
      try {
        localStorage.setItem(STORAGE_KEYS.OFF_THE_RECORD_GENRES, JSON.stringify(nextGenres));
      } catch (e) {
        console.error(e);
      }
      return nextGenres;
    });

    let updatedBooks = nonFictionBooks;
    if (nonFictionBooks.some((b) => b.genre?.toLowerCase() === cleanOld.toLowerCase())) {
      setNonFictionBooks((prev) => {
        updatedBooks = prev.map((b) =>
          b.genre?.toLowerCase() === cleanOld.toLowerCase() ? { ...b, genre: cleanNew as any } : b
        );
        try {
          localStorage.setItem(STORAGE_KEYS.NON_FICTION, JSON.stringify(updatedBooks));
        } catch (e) {
          console.error(e);
        }
        return updatedBooks;
      });
    }

    await syncWithServer({ offTheRecordGenres: nextGenres, nonFictionBooks: updatedBooks });
  };

  const removeOffTheRecordGenre = async (genreToRemove: string): Promise<void> => {
    const clean = genreToRemove.trim().toLowerCase();
    if (!clean) return;
    let nextGenres: string[] = offTheRecordGenres;
    setOffTheRecordGenres((prev) => {
      nextGenres = prev.filter((g) => g.toLowerCase() !== clean);
      try {
        localStorage.setItem(STORAGE_KEYS.OFF_THE_RECORD_GENRES, JSON.stringify(nextGenres));
      } catch (e) {
        console.error(e);
      }
      return nextGenres;
    });

    let updatedBooks = nonFictionBooks;
    const fallbackGenre = nextGenres[0] || 'Non-Fiction';
    if (nonFictionBooks.some((b) => b.genre?.toLowerCase() === clean)) {
      setNonFictionBooks((prev) => {
        updatedBooks = prev.map((b) =>
          b.genre?.toLowerCase() === clean ? { ...b, genre: fallbackGenre as any } : b
        );
        try {
          localStorage.setItem(STORAGE_KEYS.NON_FICTION, JSON.stringify(updatedBooks));
        } catch (e) {
          console.error(e);
        }
        return updatedBooks;
      });
    }

    await syncWithServer({ offTheRecordGenres: nextGenres, nonFictionBooks: updatedBooks });
  };

  const resetOffTheRecordGenres = async (): Promise<void> => {
    setOffTheRecordGenres(ALL_OTHER_GENRES as string[]);
    try {
      localStorage.setItem(STORAGE_KEYS.OFF_THE_RECORD_GENRES, JSON.stringify(ALL_OTHER_GENRES));
    } catch (e) {
      console.error(e);
    }
    await syncWithServer({ offTheRecordGenres: ALL_OTHER_GENRES } as any);
  };

  const addArchiveGenre = async (genre: string): Promise<void> => {
    const clean = genre.trim();
    if (!clean) return;
    let nextGenres: string[] = archiveGenres;
    setArchiveGenres((prev) => {
      if (prev.some((g) => g.toLowerCase() === clean.toLowerCase())) return prev;
      nextGenres = [clean, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.ARCHIVE_GENRES, JSON.stringify(nextGenres));
      } catch (e) {
        console.error(e);
      }
      return nextGenres;
    });
    await syncWithServer({ archiveGenres: nextGenres } as any);
  };

  const editArchiveGenre = async (oldGenre: string, newGenre: string): Promise<void> => {
    const cleanOld = oldGenre.trim();
    const cleanNew = newGenre.trim();
    if (!cleanNew || cleanOld.toLowerCase() === cleanNew.toLowerCase()) return;

    let nextGenres: string[] = archiveGenres;
    setArchiveGenres((prev) => {
      nextGenres = prev.map((g) => (g.toLowerCase() === cleanOld.toLowerCase() ? cleanNew : g));
      if (!nextGenres.some((g) => g.toLowerCase() === cleanNew.toLowerCase())) {
        nextGenres = [cleanNew, ...nextGenres];
      }
      try {
        localStorage.setItem(STORAGE_KEYS.ARCHIVE_GENRES, JSON.stringify(nextGenres));
      } catch (e) {
        console.error(e);
      }
      return nextGenres;
    });

    let updatedReviews = reviews;
    if (reviews.some((r) => r.genre?.toLowerCase() === cleanOld.toLowerCase())) {
      setReviews((prev) => {
        updatedReviews = prev.map((r) =>
          r.genre?.toLowerCase() === cleanOld.toLowerCase() ? { ...r, genre: cleanNew as any } : r
        );
        try {
          localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updatedReviews));
        } catch (e) {
          console.error(e);
        }
        return updatedReviews;
      });
    }

    await syncWithServer({ archiveGenres: nextGenres, reviews: updatedReviews });
  };

  const removeArchiveGenre = async (genreToRemove: string): Promise<void> => {
    const clean = genreToRemove.trim().toLowerCase();
    if (!clean) return;
    let nextGenres: string[] = archiveGenres;
    setArchiveGenres((prev) => {
      nextGenres = prev.filter((g) => g.toLowerCase() !== clean);
      try {
        localStorage.setItem(STORAGE_KEYS.ARCHIVE_GENRES, JSON.stringify(nextGenres));
      } catch (e) {
        console.error(e);
      }
      return nextGenres;
    });
    await syncWithServer({ archiveGenres: nextGenres } as any);
  };

  const resetArchiveGenres = async (): Promise<void> => {
    setArchiveGenres(INITIAL_ARCHIVE_GENRES as string[]);
    try {
      localStorage.setItem(STORAGE_KEYS.ARCHIVE_GENRES, JSON.stringify(INITIAL_ARCHIVE_GENRES));
    } catch (e) {
      console.error(e);
    }
    await syncWithServer({ archiveGenres: INITIAL_ARCHIVE_GENRES } as any);
  };

  // Helper: Persist state to Firestore cloud database and backend server
  const syncWithServer = useCallback(async (statePayload?: Partial<{
    reviews: BookReview[];
    nonFictionBooks: NonFictionBook[];
    heroConfig: HeroConfig;
    currentlyReading: CurrentlyReading;
    stats: ReadingStats;
    timelineStats: TimelineStats;
    timelineMilestones: TimelineMilestone[];
    intelligenceStats: IntelligenceStats;
    aboutConfig: AboutConfig;
    offTheRecordConfig: OffTheRecordConfig;
    postLikes: Record<string, number>;
    readerPollVotes: Record<string, Record<string, number>>;
    witnessComments: Record<string, WitnessComment[]>;
    userTheories: UserTheorySubmission[];
    offTheRecordGenres: string[];
    archiveGenres: string[];
    bookAlbums: BookAlbum[];
  }>): Promise<void> => {
    setIsSyncingFirestore(true);
    setFirestoreSyncError(null);

    // Merge current state with any explicitly updated slices
    const fullPayload = {
      reviews: statePayload?.reviews ?? reviews,
      nonFictionBooks: statePayload?.nonFictionBooks ?? nonFictionBooks,
      heroConfig: statePayload?.heroConfig ?? heroConfig,
      aboutConfig: statePayload?.aboutConfig ?? aboutConfig,
      offTheRecordConfig: statePayload?.offTheRecordConfig ?? offTheRecordConfig,
      currentlyReading: statePayload?.currentlyReading ?? currentlyReading,
      stats: statePayload?.stats ?? stats,
      timelineStats: statePayload?.timelineStats ?? timelineStats,
      timelineMilestones: statePayload?.timelineMilestones ?? timelineMilestones,
      intelligenceStats: statePayload?.intelligenceStats ?? intelligenceStats,
      postLikes: statePayload?.postLikes ?? postLikes,
      readerPollVotes: statePayload?.readerPollVotes ?? readerPollVotes,
      witnessComments: statePayload?.witnessComments ?? witnessComments,
      userTheories: statePayload?.userTheories ?? userTheories,
      offTheRecordGenres: statePayload?.offTheRecordGenres ?? offTheRecordGenres,
      archiveGenres: statePayload?.archiveGenres ?? archiveGenres,
      bookAlbums: statePayload?.bookAlbums ?? bookAlbums,
    };

    // Sanitize payload for Firestore (remove undefined fields which crash setDoc)
    const cleanPayload = JSON.parse(JSON.stringify({
      ...fullPayload,
      updatedAt: new Date().toISOString()
    }));

    let firestoreError: Error | null = null;

    // 1. Primary Firestore Cloud Database Write - Always attempted independently
    try {
      await setDoc(doc(db, 'journal_state', 'active'), cleanPayload, { merge: true });
      setLastFirestoreSync(new Date());
      setFirestoreSyncError(null);
    } catch (fsErr: any) {
      firestoreError = fsErr instanceof Error ? fsErr : new Error(String(fsErr));
      const formattedMsg = fsErr?.message || String(fsErr);
      setFirestoreSyncError(formattedMsg);
      console.error('Firestore cloud database sync error:', fsErr);
      try {
        handleFirestoreError(fsErr, OperationType.WRITE, 'journal_state/active');
      } catch (logErr) {
        // Formatted JSON error logged to console
      }
    }

    // 2. Backend Express Server sync (persists to local disk & initialData.ts fallback)
    try {
      await fetch('/api/save-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passcode: adminPasscode,
          ...fullPayload,
        }),
      });
    } catch (serverErr) {
      console.warn('Server disk sync skipped/failed (client-only or dev restart):', serverErr);
    } finally {
      setIsSyncingFirestore(false);
    }

    // If Firestore write failed, throw the error so callers can catch and display
    if (firestoreError) {
      throw firestoreError;
    }
  }, [
    adminPasscode,
    reviews,
    nonFictionBooks,
    heroConfig,
    aboutConfig,
    offTheRecordConfig,
    currentlyReading,
    stats,
    timelineStats,
    timelineMilestones,
    intelligenceStats,
    postLikes,
    readerPollVotes,
    witnessComments,
    userTheories,
    offTheRecordGenres,
    archiveGenres,
    bookAlbums
  ]);

  const retryFirestoreSync = useCallback(async (): Promise<void> => {
    await syncWithServer();
  }, [syncWithServer]);

  // Initial fetch from Firestore and server to get persistent records
  useEffect(() => {
    let isMounted = true;

    // Fetch from Firestore
    getDoc(doc(db, 'journal_state', 'active'))
      .then((snap) => {
        if (snap.exists() && isMounted) {
          const data = snap.data();
          if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) setReviews(sanitizeReviewsList(data.reviews));
          if (data.nonFictionBooks && Array.isArray(data.nonFictionBooks) && data.nonFictionBooks.length > 0) setNonFictionBooks(sanitizeNonFictionList(data.nonFictionBooks));
          if (data.heroConfig) setHeroConfig(data.heroConfig);
          if (data.aboutConfig) setAboutConfig(data.aboutConfig);
          if (data.offTheRecordConfig) setOffTheRecordConfig(data.offTheRecordConfig);
          if (data.currentlyReading) setCurrentlyReading(sanitizeCurrentlyReading(data.currentlyReading));
          if (data.stats) setStats(data.stats);
          if (data.timelineStats) setTimelineStats(data.timelineStats);
          if (data.timelineMilestones && Array.isArray(data.timelineMilestones)) setTimelineMilestones(data.timelineMilestones);
          if (data.intelligenceStats) setIntelligenceStats(data.intelligenceStats);
          if (data.postLikes) setPostLikes(data.postLikes);
          if (data.readerPollVotes) setReaderPollVotes(data.readerPollVotes);
          if (data.witnessComments) setWitnessComments(data.witnessComments);
          if (data.userTheories) setUserTheories(data.userTheories);
          if (data.offTheRecordGenres && Array.isArray(data.offTheRecordGenres) && data.offTheRecordGenres.length > 0) setOffTheRecordGenres(data.offTheRecordGenres);
          if (data.archiveGenres && Array.isArray(data.archiveGenres) && data.archiveGenres.length > 0) setArchiveGenres(data.archiveGenres);
          if (Array.isArray(data.bookAlbums)) {
            setBookAlbums(data.bookAlbums);
          } else {
            const revs = Array.isArray(data.reviews) && data.reviews.length > 0 ? sanitizeReviewsList(data.reviews) : INITIAL_REVIEWS;
            const nfs = Array.isArray(data.nonFictionBooks) && data.nonFictionBooks.length > 0 ? sanitizeNonFictionList(data.nonFictionBooks) : INITIAL_NON_FICTION_BOOKS;
            setBookAlbums((prev) => (prev.length > 0 ? prev : deriveAlbumsFromBooks(revs, nfs)));
          }
          setLastFirestoreSync(new Date());
          setFirestoreSyncError(null);
        }
      })
      .catch((err) => {
        console.warn('Firestore initial load error:', err);
        try {
          handleFirestoreError(err, OperationType.GET, 'journal_state/active');
        } catch {
          // Logged
        }
      });

    fetch('/api/state')
      .then((res) => {
        if (!res.ok) throw new Error('API state not ready');
        return res.json();
      })
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(sanitizeReviewsList(data.reviews));
        }
        if (data.nonFictionBooks && Array.isArray(data.nonFictionBooks) && data.nonFictionBooks.length > 0) {
          setNonFictionBooks(sanitizeNonFictionList(data.nonFictionBooks));
        }
        if (data.heroConfig) {
          setHeroConfig(data.heroConfig);
        }
        if (data.aboutConfig) {
          setAboutConfig(data.aboutConfig);
        }
        if (data.offTheRecordConfig) {
          setOffTheRecordConfig(data.offTheRecordConfig);
        }
        if (data.currentlyReading) {
          setCurrentlyReading(sanitizeCurrentlyReading(data.currentlyReading));
        }
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.timelineStats) {
          setTimelineStats(data.timelineStats);
        }
        if (data.timelineMilestones && Array.isArray(data.timelineMilestones)) {
          setTimelineMilestones(data.timelineMilestones);
        }
        if (data.intelligenceStats) {
          setIntelligenceStats(data.intelligenceStats);
        }
        if (data.offTheRecordGenres && Array.isArray(data.offTheRecordGenres) && data.offTheRecordGenres.length > 0) {
          setOffTheRecordGenres(data.offTheRecordGenres);
        }
        if (data.archiveGenres && Array.isArray(data.archiveGenres) && data.archiveGenres.length > 0) {
          setArchiveGenres(data.archiveGenres);
        }
        if (Array.isArray(data.bookAlbums)) {
          setBookAlbums(data.bookAlbums);
        } else if (data.reviews || data.nonFictionBooks) {
          const revs = Array.isArray(data.reviews) ? sanitizeReviewsList(data.reviews) : INITIAL_REVIEWS;
          const nfs = Array.isArray(data.nonFictionBooks) ? sanitizeNonFictionList(data.nonFictionBooks) : INITIAL_NON_FICTION_BOOKS;
          setBookAlbums((prev) => (prev.length > 0 ? prev : deriveAlbumsFromBooks(revs, nfs)));
        }
        if (data.postLikes) {
          setPostLikes(data.postLikes);
        }
        if (data.readerPollVotes) {
          setReaderPollVotes(data.readerPollVotes);
        }
        if (data.witnessComments) {
          setWitnessComments(data.witnessComments);
        }
        if (data.userTheories) {
          setUserTheories(data.userTheories);
        }
        if (data.githubUser) {
          setGithubUser(data.githubUser);
        }
        if (typeof data.isGitHubConfigured === 'boolean') {
          setIsGitHubConfigured(data.isGitHubConfigured);
        }
      })
      .catch((err) => {
        console.log('Using local fallback state', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for OAuth success message from popup (strictly adhering to oauth-integration guidelines)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin is from AI Studio preview or localhost
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data.provider === 'github') {
        if (event.data.user) {
          setGithubUser(event.data.user);
          setIsAdminUnlocked(true);
        } else {
          // Re-fetch status
          fetch('/api/auth/github/status')
            .then(res => res.json())
            .then(status => {
              if (status.user) {
                setGithubUser(status.user);
                setIsAdminUnlocked(true);
              }
            })
            .catch(console.error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NON_FICTION, JSON.stringify(nonFictionBooks));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [nonFictionBooks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOK_ALBUMS, JSON.stringify(bookAlbums));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [bookAlbums]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HERO_CONFIG, JSON.stringify(heroConfig));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [heroConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENTLY_READING, JSON.stringify(currentlyReading));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [currentlyReading]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMELINE_STATS, JSON.stringify(timelineStats));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [timelineStats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMELINE_MILESTONES, JSON.stringify(timelineMilestones));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [timelineMilestones]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INTELLIGENCE_STATS, JSON.stringify(intelligenceStats));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [intelligenceStats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEORIES, JSON.stringify(userTheories));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [userTheories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GUESSES, JSON.stringify(visitorGuesses));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [visitorGuesses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(postLikes));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [postLikes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_LIKES, JSON.stringify(userLikedPosts));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [userLikedPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POLL_VOTES, JSON.stringify(readerPollVotes));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [readerPollVotes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_POLLS, JSON.stringify(userPollVotes));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [userPollVotes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(witnessComments));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [witnessComments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ABOUT_CONFIG, JSON.stringify(aboutConfig));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [aboutConfig]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_UNLOCKED, JSON.stringify(isAdminUnlocked));
      localStorage.removeItem(STORAGE_KEYS.ADMIN_UNLOCKED);
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [isAdminUnlocked]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASSCODE, adminPasscode);
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [adminPasscode]);

  // Unlock Admin / Chief Investigator Clearance
  const unlockAdmin = async (passcode: string): Promise<boolean> => {
    const trimmed = passcode.trim();
    if (!trimmed) return false;
    
    // 1. Try server verification
    try {
      const res = await fetch('/api/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: trimmed }),
      });
      if (res.ok) {
        setIsAdminUnlocked(true);
        setAdminPasscodeState(trimmed);
        try {
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_UNLOCKED, 'true');
          localStorage.setItem(STORAGE_KEYS.ADMIN_PASSCODE, trimmed);
        } catch (e) {
          console.warn('Storage save error', e);
        }
        return true;
      } else {
        // Server responded and explicitly denied credentials
        return false;
      }
    } catch (e) {
      console.warn('Server verify network error, testing local fallback', e);
      // 2. Client fallback verification ONLY if server is unreachable
      const target = (adminPasscode || INITIAL_ADMIN_PASSCODE || '').trim();
      if (target && trimmed === target) {
        setIsAdminUnlocked(true);
        setAdminPasscodeState(trimmed);
        try {
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_UNLOCKED, 'true');
          localStorage.setItem(STORAGE_KEYS.ADMIN_PASSCODE, trimmed);
        } catch (err) {
          console.warn('Storage save error', err);
        }
        return true;
      }
      return false;
    }
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_UNLOCKED);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_UNLOCKED);
    } catch (e) {
      console.warn('Storage clear error', e);
    }
  };

  // Change Admin Passcode - updates server & initialData.ts permanently
  const setAdminPasscode = async (newPasscode: string): Promise<boolean> => {
    if (!newPasscode || !newPasscode.trim() || newPasscode.trim().length < 4) return false;
    const clean = newPasscode.trim();

    try {
      const res = await fetch('/api/change-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPasscode: adminPasscode,
          newPasscode: clean,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Server rejected passcode update.');
      }

      setAdminPasscodeState(clean);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_PASSCODE, clean);
      } catch (e) {
        console.warn('Storage save error', e);
      }
      return true;
    } catch (e) {
      console.warn('Server passcode update sync error', e);
      throw e;
    }
  };

  // GitHub Actions
  const connectGitHubWithOAuth = async (): Promise<{ success: boolean; message?: string; needsConfig?: boolean }> => {
    try {
      const res = await fetch('/api/auth/github/url');
      const data = await res.json();
      if (!data.configured) {
        return {
          success: false,
          message: data.message || 'GitHub OAuth Client ID is not configured in environment variables.',
          needsConfig: true,
        };
      }
      if (data.url) {
        const authWindow = window.open(data.url, 'github_oauth_popup', 'width=600,height=750,menubar=no,toolbar=no');
        if (!authWindow) {
          return {
            success: false,
            message: 'Popup was blocked by your browser. Please allow popups for this site.',
          };
        }
        return { success: true };
      }
      return { success: false, message: 'Could not generate GitHub authorization URL.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to start GitHub authorization.' };
    }
  };

  const connectGitHubWithToken = async (token: string): Promise<{ success: boolean; message: string; user?: GitHubUser }> => {
    try {
      const res = await fetch('/api/auth/github/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGithubUser(data.user);
        setIsAdminUnlocked(true);
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, message: data.message || 'Failed to verify token with GitHub.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error verifying GitHub token.' };
    }
  };

  const disconnectGitHub = async () => {
    try {
      await fetch('/api/auth/github/disconnect', { method: 'POST' });
    } catch (e) {
      console.warn('Failed to disconnect GitHub on server', e);
    }
    setGithubUser(null);
  };

  const syncToGitHub = async (customToken?: string): Promise<{ success: boolean; message: string; gistUrl?: string }> => {
    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customToken ? { token: customToken.trim() } : {})
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGithubUser(prev => prev ? {
          ...prev,
          lastGistId: data.gistId,
          lastGistUrl: data.gistUrl,
          repository: data.repository || prev.repository,
          repositoryUrl: data.repository ? `https://github.com/${data.repository}` : prev.repositoryUrl,
          lastCommitUrl: data.commitUrl || prev.lastCommitUrl,
          lastSyncedAt: data.syncedAt || new Date().toISOString()
        } : null);
        return { success: true, message: data.message, gistUrl: data.gistUrl };
      }
      return { success: false, message: data.message || 'Failed to sync to GitHub.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error connecting to GitHub.' };
    }
  };

  const openReviewById = (id: string) => {
    const found = reviews.find((r) => r.id === id || r.caseNumber === id);
    if (found) {
      setSelectedReview(found);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addReview = async (reviewData: Omit<BookReview, 'id' | 'caseNumber'> & { id?: string; caseNumber?: string }): Promise<BookReview> => {
    const nextCaseNum = reviewData.caseNumber?.trim() || String(reviews.length + 1).padStart(3, '0');
    const newRev: BookReview = {
      ...reviewData,
      id: reviewData.id || `case-${nextCaseNum.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      caseNumber: nextCaseNum,
      likes: reviewData.likes || 1,
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    
    // Seed initial likes and poll options for new review
    const updatedLikes = { ...postLikes, [newRev.id]: 1 };
    setPostLikes(updatedLikes);

    const updatedPolls = {
      ...readerPollVotes,
      [newRev.id]: {
        solvedBeforeTwist: 0,
        fooledCompletely: 1,
        sawItComingMidway: 0,
        jawDroppedEnding: 1,
      },
    };
    setReaderPollVotes(updatedPolls);

    // Update stats automatically
    const updatedStats = {
      ...stats,
      booksRead: stats.booksRead + 1,
      thrillersRead: stats.thrillersRead + (newRev.genre.includes('Thriller') || newRev.genre.includes('Mystery') ? 1 : 0),
      suspectsAccused: stats.suspectsAccused + (newRev.suspects?.length || 1),
    };
    setStats(updatedStats);

    // Update bookAlbums if seriesName was supplied
    let updatedAlbums = bookAlbums;
    if (newRev.seriesName?.trim()) {
      updatedAlbums = computeNextAlbumsForBook(
        bookAlbums,
        newRev.seriesName,
        { kind: 'thriller', id: newRev.id },
        newRev.seriesOrder
      );
      setBookAlbums(updatedAlbums);
    }

    // Persist to Firestore cloud database and server permanently
    await syncWithServer({
      reviews: updated,
      postLikes: updatedLikes,
      readerPollVotes: updatedPolls,
      stats: updatedStats,
      bookAlbums: updatedAlbums,
    });

    return newRev;
  };

  const updateReview = async (id: string, updated: Partial<BookReview>): Promise<void> => {
    const mergeReview = (r: BookReview): BookReview => {
      const next = { ...r, ...updated };
      if ('seriesName' in updated && !updated.seriesName) {
        delete next.seriesName;
        delete next.seriesOrder;
      }
      return next;
    };
    const updatedReviews = reviews.map((r) => (r.id === id ? mergeReview(r) : r));
    setReviews(updatedReviews);
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview((prev) => (prev ? mergeReview(prev) : null));
    }
    let updatedAlbums = bookAlbums;
    if ('seriesName' in updated || 'seriesOrder' in updated) {
      const targetRev = updatedReviews.find((r) => r.id === id);
      updatedAlbums = computeNextAlbumsForBook(
        bookAlbums,
        targetRev?.seriesName,
        { kind: 'thriller', id },
        targetRev?.seriesOrder
      );
      setBookAlbums(updatedAlbums);
    }
    await syncWithServer({ reviews: updatedReviews, bookAlbums: updatedAlbums });
  };

  const deleteReview = async (id: string): Promise<void> => {
    const updatedReviews = reviews.filter((r) => r.id !== id);
    const updatedAlbums = bookAlbums.map((a) => ({
      ...a,
      items: a.items.filter((it) => !(it.kind === 'thriller' && it.id === id)),
    }));
    setReviews(updatedReviews);
    setBookAlbums(updatedAlbums);
    if (selectedReview?.id === id) {
      setSelectedReview(null);
    }
    await syncWithServer({ reviews: updatedReviews, bookAlbums: updatedAlbums });
  };

  const duplicateReview = async (id: string): Promise<BookReview | void> => {
    const target = reviews.find((r) => r.id === id);
    if (!target) return;
    const nextCaseNum = String(reviews.length + 1).padStart(3, '0');
    const cloned: BookReview = {
      ...target,
      id: `case-${nextCaseNum}-${Date.now()}`,
      caseNumber: nextCaseNum,
      title: `${target.title} (Re-Investigation)`,
      dateRead: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      likes: 1,
    };
    const updatedReviews = [cloned, ...reviews];
    setReviews(updatedReviews);
    await syncWithServer({ reviews: updatedReviews });
    return cloned;
  };

  const updateCurrentlyReading = async (cr: Partial<CurrentlyReading>): Promise<void> => {
    const updated = { ...currentlyReading, ...cr };
    setCurrentlyReading(updated);
    await syncWithServer({ currentlyReading: updated });
  };

  const addBookToCurrentReads = async (book: Omit<CurrentlyReadingBook, 'id'>): Promise<void> => {
    const newBook: CurrentlyReadingBook = {
      ...book,
      id: `cr-book-${Date.now()}`,
    };
    const currentAdditional = currentlyReading.additionalBooks || [];
    const updated = {
      ...currentlyReading,
      additionalBooks: [...currentAdditional, newBook],
    };
    setCurrentlyReading(updated);
    await syncWithServer({ currentlyReading: updated });
  };

  const removeBookFromCurrentReads = async (id: string): Promise<void> => {
    const currentAdditional = currentlyReading.additionalBooks || [];
    const updated = {
      ...currentlyReading,
      additionalBooks: currentAdditional.filter((b) => b.id !== id),
    };
    setCurrentlyReading(updated);
    await syncWithServer({ currentlyReading: updated });
  };

  const updateAdditionalBook = async (id: string, updatedFields: Partial<CurrentlyReadingBook>): Promise<void> => {
    const currentAdditional = currentlyReading.additionalBooks || [];
    const updatedBooks = currentAdditional.map((b) => (b.id === id ? { ...b, ...updatedFields } : b));
    const updated = {
      ...currentlyReading,
      additionalBooks: updatedBooks,
    };
    setCurrentlyReading(updated);
    await syncWithServer({ currentlyReading: updated });
  };

  const moveAdditionalToPrimary = async (id: string): Promise<void> => {
    const currentAdditional = currentlyReading.additionalBooks || [];
    const targetBook = currentAdditional.find((b) => b.id === id);
    if (!targetBook) return;

    // Remaining additional books (excluding the target book)
    let remainingAdditional = currentAdditional.filter((b) => b.id !== id);

    // If current primary has a title, convert it into an additional book so nothing is lost
    if (currentlyReading.title && currentlyReading.title.trim().length > 0) {
      const oldPrimaryAsAdditional: CurrentlyReadingBook = {
        id: `cr-book-demoted-${Date.now()}`,
        title: currentlyReading.title,
        author: currentlyReading.author,
        genre: currentlyReading.genre,
        category: 'thriller',
        coverImage: currentlyReading.coverImage,
        currentPage: currentlyReading.currentPage || 1,
        totalPages: currentlyReading.totalPages || 300,
        startDate: currentlyReading.startDate || '',
        currentTheory: currentlyReading.currentTheory || '',
        thoughts: currentlyReading.currentTheory || '',
        suspectsNoted: currentlyReading.suspectsNoted || [],
        paranoiaLevel: currentlyReading.paranoiaLevel || 'Elevated',
      };
      remainingAdditional = [oldPrimaryAsAdditional, ...remainingAdditional];
    }

    const updated: CurrentlyReading = {
      ...currentlyReading,
      title: targetBook.title,
      author: targetBook.author,
      genre: targetBook.genre,
      coverImage: targetBook.coverImage,
      currentPage: targetBook.currentPage,
      totalPages: targetBook.totalPages,
      startDate: targetBook.startDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      currentTheory: targetBook.currentTheory || targetBook.thoughts || 'Investigation in progress.',
      suspectsNoted: targetBook.suspectsNoted || [],
      paranoiaLevel: targetBook.paranoiaLevel || 'Elevated',
      additionalBooks: remainingAdditional,
    };

    setCurrentlyReading(updated);
    await syncWithServer({ currentlyReading: updated });
  };

  const moveAdditionalToCompanion = async (id: string): Promise<void> => {
    const currentAdditional = currentlyReading.additionalBooks || [];
    const targetBook = currentAdditional.find((b) => b.id === id);
    if (!targetBook) return;

    // Remaining additional books (excluding the target book)
    let remainingAdditional = currentAdditional.filter((b) => b.id !== id);

    // If current companion has a title and showNonThriller is true, convert it into an additional book
    if (currentlyReading.nonThrillerTitle && currentlyReading.nonThrillerTitle.trim().length > 0 && (currentlyReading.showNonThriller ?? true)) {
      const oldCompanionAsAdditional: CurrentlyReadingBook = {
        id: `cr-book-companion-demoted-${Date.now()}`,
        title: currentlyReading.nonThrillerTitle,
        author: currentlyReading.nonThrillerAuthor || '',
        genre: currentlyReading.nonThrillerGenre || 'Other Literature',
        category: 'non-fiction',
        coverImage: currentlyReading.nonThrillerCoverImage || '',
        currentPage: currentlyReading.nonThrillerCurrentPage || 1,
        totalPages: currentlyReading.nonThrillerTotalPages || 300,
        startDate: currentlyReading.nonThrillerStartDate || '',
        thoughts: currentlyReading.nonThrillerThoughts || '',
        notes: currentlyReading.nonThrillerNotes || '',
      };
      remainingAdditional = [oldCompanionAsAdditional, ...remainingAdditional];
    }

    const updated: CurrentlyReading = {
      ...currentlyReading,
      showNonThriller: true,
      nonThrillerTitle: targetBook.title,
      nonThrillerAuthor: targetBook.author,
      nonThrillerGenre: targetBook.genre,
      nonThrillerCoverImage: targetBook.coverImage,
      nonThrillerCurrentPage: targetBook.currentPage,
      nonThrillerTotalPages: targetBook.totalPages,
      nonThrillerStartDate: targetBook.startDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      nonThrillerThoughts: targetBook.thoughts || targetBook.currentTheory || '',
      nonThrillerNotes: targetBook.notes || '',
      additionalBooks: remainingAdditional,
    };

    setCurrentlyReading(updated);
    await syncWithServer({ currentlyReading: updated });
  };

  const movePrimaryToAdditional = async (): Promise<void> => {
    if (!currentlyReading.title || currentlyReading.title.trim().length === 0) return;
    const oldPrimaryAsAdditional: CurrentlyReadingBook = {
      id: `cr-book-primary-moved-${Date.now()}`,
      title: currentlyReading.title,
      author: currentlyReading.author,
      genre: currentlyReading.genre,
      category: 'thriller',
      coverImage: currentlyReading.coverImage,
      currentPage: currentlyReading.currentPage || 1,
      totalPages: currentlyReading.totalPages || 300,
      startDate: currentlyReading.startDate || '',
      currentTheory: currentlyReading.currentTheory || '',
      thoughts: currentlyReading.currentTheory || '',
      suspectsNoted: currentlyReading.suspectsNoted || [],
      paranoiaLevel: currentlyReading.paranoiaLevel || 'Elevated',
    };
    const updated: CurrentlyReading = {
      ...currentlyReading,
      title: '',
      author: '',
      currentPage: 0,
      totalPages: 0,
      currentTheory: 'Desk clear. Select or promote a book to primary investigation.',
      additionalBooks: [oldPrimaryAsAdditional, ...(currentlyReading.additionalBooks || [])],
    };
    setCurrentlyReading(updated);
    await syncWithServer({ currentlyReading: updated });
  };

  const moveCompanionToAdditional = async (): Promise<void> => {
    if (!currentlyReading.nonThrillerTitle || currentlyReading.nonThrillerTitle.trim().length === 0) return;
    const oldCompanionAsAdditional: CurrentlyReadingBook = {
      id: `cr-book-comp-moved-${Date.now()}`,
      title: currentlyReading.nonThrillerTitle,
      author: currentlyReading.nonThrillerAuthor || '',
      genre: currentlyReading.nonThrillerGenre || 'Other Literature',
      category: 'non-fiction',
      coverImage: currentlyReading.nonThrillerCoverImage || '',
      currentPage: currentlyReading.nonThrillerCurrentPage || 1,
      totalPages: currentlyReading.nonThrillerTotalPages || 300,
      startDate: currentlyReading.nonThrillerStartDate || '',
      thoughts: currentlyReading.nonThrillerThoughts || '',
      notes: currentlyReading.nonThrillerNotes || '',
    };
    const updated: CurrentlyReading = {
      ...currentlyReading,
      nonThrillerTitle: '',
      nonThrillerAuthor: '',
      nonThrillerCurrentPage: 0,
      nonThrillerTotalPages: 0,
      nonThrillerThoughts: '',
      nonThrillerNotes: '',
      additionalBooks: [oldCompanionAsAdditional, ...(currentlyReading.additionalBooks || [])],
    };
    setCurrentlyReading(updated);
    await syncWithServer({ currentlyReading: updated });
  };

  const openEditAdditionalBook = (id: string) => {
    setEditingAdditionalBookId(id);
    setIsCurrentlyReadingModalOpen(true);
  };

  const openCompleteAndArchive = (target: CompletingBookTarget) => {
    setCompletingBookTarget(target);
    setIsCompleteBookModalOpen(true);
  };

  const archiveCurrentBook = async (params: ArchiveCurrentBookParams): Promise<void> => {
    const today = params.dateFinished || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const currentYear = new Date().getFullYear();

    let updatedReviews = reviews;
    let updatedNonFiction = nonFictionBooks;
    let updatedStats = stats;

    if (params.targetArchive === 'case') {
      const nextNum = String(reviews.length + 1).padStart(3, '0');
      const newReview: BookReview = {
        id: `case-${nextNum}`,
        caseNumber: nextNum,
        title: params.title.trim(),
        author: params.author.trim(),
        coverImage: params.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
        genre: (params.genre as Genre) || 'Psychological Thriller',
        dateRead: today,
        dateFinished: today,
        yearRead: currentYear,
        pages: Number(params.pages) || 300,
        rating: Number(params.rating) || 5,
        status: 'CLOSED',
        readingFormat: (params.readingFormat as any) || 'Paperback',
        leadQuote: `“Case solved upon completion of the investigation.”`,
        summary: params.summary?.trim() || `Investigation concluded and dossier filed into the central archives.`,
        reviewText: params.reviewText?.trim() || params.whatIThought?.trim() || 'Thoroughly engaging case with sharp narrative tension.',
        whatIThought: params.whatIThought?.trim() || '',
        whatActuallyHappened: params.whatActuallyHappened?.trim() || '',
        favoriteMoment: 'The climax and conclusion of the investigation.',
        finalVerdict: params.summary?.trim() || 'A thoroughly satisfying case.',
        paranoiaRating: 4,
        twistsCount: 2,
        unreliableNarratorRating: 4,
        spoilerEvidence: params.whatActuallyHappened?.trim() || 'Classified case details filed upon reading completion.',
        evidenceBullets: ['Book marked complete from the active investigation desk.'],
        marginaliaNotes: ['Filed directly from active investigation into the archives.'],
        suspects: [],
        clues: [],
        likes: 1,
        ...(params.seriesName?.trim()
          ? {
              seriesName: params.seriesName.trim(),
              seriesOrder: params.seriesOrder ? Number(params.seriesOrder) : undefined,
            }
          : {}),
      };
      updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);

      updatedStats = {
        ...stats,
        booksRead: (stats.booksRead || 0) + 1,
        thrillersRead: (stats.thrillersRead || 0) + 1,
        totalPagesRead: (stats.totalPagesRead || 0) + (Number(params.pages) || 0),
      };
      setStats(updatedStats);
    } else {
      // Off the Record
      const nextCatNum = `NF-${String(nonFictionBooks.length + 1).padStart(3, '0')}`;
      const newNonFiction: NonFictionBook = {
        id: `nf-${nextCatNum.toLowerCase()}-${Date.now()}`,
        catalogNumber: nextCatNum,
        title: params.title.trim(),
        author: params.author.trim(),
        coverImage: params.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        genre: (params.genre as any) || 'Other Literature',
        dateStarted: today,
        dateFinished: today,
        dateLogged: today,
        yearRead: currentYear,
        pages: Number(params.pages) || 300,
        rating: Number(params.rating) || 5,
        status: 'COMPLETED',
        readingFormat: (params.readingFormat as any) || 'Paperback',
        oneSentenceTakeaway: params.summary?.trim() || params.reviewText?.trim() || 'Completed reading and filed in personal research records.',
        summary: params.summary?.trim() || 'Field study concluded and added to off-the-record dossiers.',
        reviewText: params.reviewText?.trim() || '',
        personalThoughts: params.whatIThought?.trim() || params.reviewText?.trim() || '',
        keyTakeaways: ['Book marked complete and safely archived.'],
        mindsetRatings: { readability: 5, actionability: 4, intellectualImpact: 5, originality: 4 },
        likes: 1,
        ...(params.seriesName?.trim()
          ? {
              seriesName: params.seriesName.trim(),
              seriesOrder: params.seriesOrder ? Number(params.seriesOrder) : undefined,
            }
          : {}),
      };
      updatedNonFiction = [newNonFiction, ...nonFictionBooks];
      setNonFictionBooks(updatedNonFiction);

      updatedStats = {
        ...stats,
        booksRead: (stats.booksRead || 0) + 1,
        totalPagesRead: (stats.totalPagesRead || 0) + (Number(params.pages) || 0),
      };
      setStats(updatedStats);
    }

    // Remove from currently reading
    let updatedCR = { ...currentlyReading };
    if (params.bookType === 'primary') {
      if (updatedCR.additionalBooks && updatedCR.additionalBooks.length > 0) {
        const [nextPrimary, ...remaining] = updatedCR.additionalBooks;
        updatedCR = {
          ...updatedCR,
          title: nextPrimary.title,
          author: nextPrimary.author,
          coverImage: nextPrimary.coverImage,
          genre: nextPrimary.genre,
          currentPage: nextPrimary.currentPage,
          totalPages: nextPrimary.totalPages,
          startDate: nextPrimary.startDate || today,
          currentTheory: nextPrimary.currentTheory || nextPrimary.notes || 'Recently initiated investigation.',
          suspectsNoted: nextPrimary.suspectsNoted || [],
          paranoiaLevel: nextPrimary.paranoiaLevel || 'Elevated',
          additionalBooks: remaining,
        };
      } else {
        updatedCR = {
          ...updatedCR,
          title: '',
          author: '',
          currentPage: 0,
          totalPages: 0,
          currentTheory: 'Desk clear. Select or add the next volume under investigation.',
          suspectsNoted: [],
        };
      }
    } else if (params.bookType === 'companion') {
      updatedCR = {
        ...updatedCR,
        showNonThriller: false,
        nonThrillerTitle: '',
        nonThrillerAuthor: '',
        nonThrillerGenre: '',
        nonThrillerThoughts: '',
        nonThrillerNotes: '',
        nonThrillerCurrentPage: 0,
        nonThrillerTotalPages: 0,
      };
    } else if (params.bookType === 'additional' && params.additionalBookId) {
      updatedCR = {
        ...updatedCR,
        additionalBooks: (updatedCR.additionalBooks || []).filter((b) => b.id !== params.additionalBookId),
      };
    }

    setCurrentlyReading(updatedCR);
    setIsCompleteBookModalOpen(false);
    setCompletingBookTarget(null);

    let updatedAlbums = bookAlbums;
    if (params.seriesName?.trim()) {
      const createdItem: BookAlbumItem =
        params.targetArchive === 'case'
          ? { kind: 'thriller', id: updatedReviews[0].id }
          : { kind: 'non-fiction', id: updatedNonFiction[0].id };
      updatedAlbums = computeNextAlbumsForBook(
        bookAlbums,
        params.seriesName,
        createdItem,
        params.seriesOrder ? Number(params.seriesOrder) : undefined
      );
      setBookAlbums(updatedAlbums);
    }

    await syncWithServer({
      reviews: updatedReviews,
      nonFictionBooks: updatedNonFiction,
      stats: updatedStats,
      currentlyReading: updatedCR,
      bookAlbums: updatedAlbums,
    });
  };

  const updateStats = async (st: Partial<ReadingStats>): Promise<void> => {
    const updated = { ...stats, ...st };
    setStats(updated);
    await syncWithServer({ stats: updated });
  };

  const updateTimelineStats = async (st: Partial<TimelineStats>): Promise<void> => {
    const updated = { ...timelineStats, ...st };
    setTimelineStats(updated);
    await syncWithServer({ timelineStats: updated });
  };

  const addTimelineMilestone = async (ms: Omit<TimelineMilestone, 'id'>): Promise<void> => {
    const newMs: TimelineMilestone = {
      ...ms,
      id: `ms-${Date.now()}`,
    };
    const updated = [newMs, ...timelineMilestones];
    setTimelineMilestones(updated);
    await syncWithServer({ timelineMilestones: updated });
  };

  const updateTimelineMilestone = async (id: string, updatedMs: Partial<TimelineMilestone>): Promise<void> => {
    const updated = timelineMilestones.map((m) => (m.id === id ? { ...m, ...updatedMs } : m));
    setTimelineMilestones(updated);
    await syncWithServer({ timelineMilestones: updated });
  };

  const deleteTimelineMilestone = async (id: string): Promise<void> => {
    const updated = timelineMilestones.filter((m) => m.id !== id);
    setTimelineMilestones(updated);
    await syncWithServer({ timelineMilestones: updated });
  };

  const updateIntelligenceStats = async (st: Partial<IntelligenceStats>): Promise<void> => {
    const updated = { ...intelligenceStats, ...st };
    setIntelligenceStats(updated);
    await syncWithServer({ intelligenceStats: updated });
  };

  const setVisitorGuess = (reviewId: string, suspectId: string) => {
    setVisitorGuessesState((prev) => ({
      ...prev,
      [reviewId]: suspectId,
    }));
  };

  const revealAnswer = (reviewId: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [reviewId]: true,
    }));
  };

  const toggleClueUnlock = (clueId: string) => {
    setUnlockedClues((prev) => ({
      ...prev,
      [clueId]: !prev[clueId],
    }));
  };

  const unlockSpoiler = (reviewId: string) => {
    setUnlockedSpoilers((prev) => ({
      ...prev,
      [reviewId]: true,
    }));
  };

  const lockSpoiler = (reviewId: string) => {
    setUnlockedSpoilers((prev) => ({
      ...prev,
      [reviewId]: false,
    }));
  };

  const resetClassifiedFile = (reviewId: string, resetGuess = false) => {
    setUnlockedSpoilers((prev) => ({
      ...prev,
      [reviewId]: false,
    }));
    setRevealedAnswers((prev) => ({
      ...prev,
      [reviewId]: false,
    }));
    if (resetGuess) {
      setVisitorGuessesState((prev) => {
        const updated = { ...prev };
        delete updated[reviewId];
        return updated;
      });
    }
  };

  const resetVisitorGuess = (reviewId: string) => {
    setVisitorGuessesState((prev) => {
      const updated = { ...prev };
      delete updated[reviewId];
      return updated;
    });
  };

  // Interactivity handlers with server sync
  const toggleLikePost = (reviewId: string) => {
    const isLiked = !userLikedPosts[reviewId];
    setUserLikedPosts((prev) => ({
      ...prev,
      [reviewId]: isLiked,
    }));

    setPostLikes((prev) => {
      const current = prev[reviewId] || 0;
      const updatedCount = isLiked ? current + 1 : Math.max(0, current - 1);
      return { ...prev, [reviewId]: updatedCount };
    });

    // Notify backend server
    fetch('/api/public/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId }),
    }).catch((e) => console.log('Like sync note', e));
  };

  const voteReaderPoll = (reviewId: string, optionKey: string) => {
    const previousVote = userPollVotes[reviewId];
    if (previousVote === optionKey) return;

    setUserPollVotes((prev) => ({
      ...prev,
      [reviewId]: optionKey,
    }));

    setReaderPollVotes((prev) => {
      const currentBookVotes = prev[reviewId] || {
        solvedBeforeTwist: 0,
        fooledCompletely: 0,
        sawItComingMidway: 0,
        jawDroppedEnding: 0,
      };

      const updatedVotes = { ...currentBookVotes };
      if (previousVote && updatedVotes[previousVote] > 0) {
        updatedVotes[previousVote] -= 1;
      }
      updatedVotes[optionKey] = (updatedVotes[optionKey] || 0) + 1;

      return {
        ...prev,
        [reviewId]: updatedVotes,
      };
    });

    fetch('/api/public/poll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, optionKey }),
    }).catch((e) => console.log('Poll sync note', e));
  };

  const addWitnessComment = (reviewId: string, commentData: Omit<WitnessComment, 'id' | 'date'>) => {
    const newComment: WitnessComment = {
      id: `wc-${Date.now()}`,
      name: commentData.name.trim() || 'Anonymous Detective',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      content: commentData.content.trim(),
      verdictTag: commentData.verdictTag || 'Investigator Note',
    };

    setWitnessComments((prev) => ({
      ...prev,
      [reviewId]: [newComment, ...(prev[reviewId] || [])],
    }));

    fetch('/api/public/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, comment: newComment }),
    }).catch((e) => console.log('Comment sync note', e));
  };

  const submitTheory = (submission: Omit<UserTheorySubmission, 'timestamp' | 'verdictResponse'>): UserTheorySubmission => {
    const responses = [
      "THEORY FILED. Detective instincts: questionable. Confidence level: dangerously high.",
      "THEORY LOGGED. Evidence logged under Section 4-B. The chief inspector has raised an eyebrow.",
      "THEORY ARCHIVED. Note scribbled in margin: 'Could be brilliant, or could be completely unhinged.'",
      "THEORY RECORDED. We have dispatched a carrier pigeon to confirm your alibi.",
      "THEORY FILED. Congratulations, you are officially as paranoid as the author intended."
    ];
    const verdictResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const newTheory: UserTheorySubmission = {
      ...submission,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      verdictResponse,
    };

    setUserTheories((prev) => [newTheory, ...prev]);

    fetch('/api/public/theory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theory: newTheory }),
    }).catch((e) => console.log('Theory sync note', e));

    return newTheory;
  };

  // Non-Fiction / Other Books CRUD & Notes
  const addNonFictionBook = async (bookData: Omit<NonFictionBook, 'id' | 'catalogNumber'> & { id?: string; catalogNumber?: string }): Promise<NonFictionBook> => {
    const nextCatNum = bookData.catalogNumber?.trim() || `NF-${String(nonFictionBooks.length + 1).padStart(3, '0')}`;
    const newBook: NonFictionBook = {
      ...bookData,
      id: bookData.id || `nf-${nextCatNum.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      catalogNumber: nextCatNum,
      likes: bookData.likes || 1,
    };
    const updated = [newBook, ...nonFictionBooks];
    setNonFictionBooks(updated);
    let updatedAlbums = bookAlbums;
    if (newBook.seriesName?.trim()) {
      updatedAlbums = computeNextAlbumsForBook(
        bookAlbums,
        newBook.seriesName,
        { kind: 'non-fiction', id: newBook.id },
        newBook.seriesOrder
      );
      setBookAlbums(updatedAlbums);
    }
    await syncWithServer({ nonFictionBooks: updated, bookAlbums: updatedAlbums });
    return newBook;
  };

  const updateNonFictionBook = async (id: string, updated: Partial<NonFictionBook>): Promise<void> => {
    const mergeBook = (b: NonFictionBook): NonFictionBook => {
      const next = { ...b, ...updated };
      if ('seriesName' in updated && !updated.seriesName) {
        delete next.seriesName;
        delete next.seriesOrder;
      }
      return next;
    };
    const updatedBooks = nonFictionBooks.map((b) => (b.id === id ? mergeBook(b) : b));
    setNonFictionBooks(updatedBooks);
    if (selectedNonFictionBook && selectedNonFictionBook.id === id) {
      setSelectedNonFictionBook((prev) => (prev ? mergeBook(prev) : null));
    }
    let updatedAlbums = bookAlbums;
    if ('seriesName' in updated || 'seriesOrder' in updated) {
      const targetBook = updatedBooks.find((b) => b.id === id);
      updatedAlbums = computeNextAlbumsForBook(
        bookAlbums,
        targetBook?.seriesName,
        { kind: 'non-fiction', id },
        targetBook?.seriesOrder
      );
      setBookAlbums(updatedAlbums);
    }
    await syncWithServer({ nonFictionBooks: updatedBooks, bookAlbums: updatedAlbums });
  };

  const deleteNonFictionBook = async (id: string): Promise<void> => {
    const updatedBooks = nonFictionBooks.filter((b) => b.id !== id);
    const updatedAlbums = bookAlbums.map((a) => ({
      ...a,
      items: a.items.filter((it) => !(it.kind === 'non-fiction' && it.id === id)),
    }));
    setNonFictionBooks(updatedBooks);
    setBookAlbums(updatedAlbums);
    if (selectedNonFictionBook?.id === id) {
      setSelectedNonFictionBook(null);
    }
    await syncWithServer({ nonFictionBooks: updatedBooks, bookAlbums: updatedAlbums });
  };

  const duplicateNonFictionBook = async (id: string): Promise<NonFictionBook | void> => {
    const target = nonFictionBooks.find((b) => b.id === id);
    if (!target) return;
    const nextCatNum = `NF-${String(nonFictionBooks.length + 1).padStart(3, '0')}`;
    const cloned: NonFictionBook = {
      ...target,
      id: `nf-${nextCatNum.toLowerCase()}-${Date.now()}`,
      catalogNumber: nextCatNum,
      title: `${target.title} (Duplicate Dossier)`,
      dateLogged: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      likes: 1,
    };
    const updatedBooks = [cloned, ...nonFictionBooks];
    setNonFictionBooks(updatedBooks);
    await syncWithServer({ nonFictionBooks: updatedBooks });
    return cloned;
  };

  const toggleLikeNonFictionBook = async (id: string): Promise<void> => {
    let updatedList: NonFictionBook[] = [];
    setNonFictionBooks((prev) => {
      const updated = prev.map((b) => {
        if (b.id === id) {
          return { ...b, likes: (b.likes || 0) + 1 };
        }
        return b;
      });
      updatedList = updated;
      return updated;
    });
    await syncWithServer({ nonFictionBooks: updatedList });
  };

  const addNonFictionScratchpadNote = async (bookId: string, note: string): Promise<void> => {
    if (!note || !note.trim()) return;
    let updatedList: NonFictionBook[] = [];
    setNonFictionBooks((prev) => {
      const updated = prev.map((b) => {
        if (b.id === bookId) {
          const scratchpad = b.notesScratchpad ? [...b.notesScratchpad, note.trim()] : [note.trim()];
          return { ...b, notesScratchpad: scratchpad };
        }
        return b;
      });
      updatedList = updated;
      return updated;
    });
    await syncWithServer({ nonFictionBooks: updatedList });
  };

  // Hero Section Editor
  const updateHeroConfig = async (config: Partial<HeroConfig>): Promise<void> => {
    const updated = { ...heroConfig, ...config };
    setHeroConfig(updated);
    await syncWithServer({ heroConfig: updated });
  };

  // About Section Editor
  const updateAboutConfig = async (config: Partial<AboutConfig>): Promise<void> => {
    const updated = { ...aboutConfig, ...config };
    setAboutConfig(updated);
    await syncWithServer({ aboutConfig: updated });
  };

  // Off The Record Section Editor
  const updateOffTheRecordConfig = async (config: Partial<OffTheRecordConfig>): Promise<void> => {
    const updated = { ...offTheRecordConfig, ...config };
    setOffTheRecordConfig(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.OFF_THE_RECORD_CONFIG, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save error', e);
    }
    await syncWithServer({ offTheRecordConfig: updated });
  };

  // Redeployment & Data Export / Import utilities
  const exportDataAsJSON = (): string => {
    const exportBundle = {
      exportedAt: new Date().toISOString(),
      appVersion: '2.5.0',
      reviews,
      nonFictionBooks,
      heroConfig,
      aboutConfig,
      offTheRecordConfig,
      currentlyReading,
      stats,
      timelineStats,
      timelineMilestones,
      intelligenceStats,
      postLikes,
      readerPollVotes,
      witnessComments,
      userTheories,
      bookAlbums,
    };
    return JSON.stringify(exportBundle, null, 2);
  };

  const importDataFromJSON = async (jsonString: string): Promise<{ success: boolean; message: string }> => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.reviews || !Array.isArray(parsed.reviews)) {
        return { success: false, message: 'Invalid backup file: missing reviews array.' };
      }
      setReviews(parsed.reviews);
      if (parsed.nonFictionBooks && Array.isArray(parsed.nonFictionBooks)) setNonFictionBooks(parsed.nonFictionBooks);
      if (parsed.heroConfig) setHeroConfig(parsed.heroConfig);
      if (parsed.aboutConfig) setAboutConfig(parsed.aboutConfig);
      if (parsed.currentlyReading) setCurrentlyReading(parsed.currentlyReading);
      if (parsed.stats) setStats(parsed.stats);
      if (parsed.timelineStats) setTimelineStats(parsed.timelineStats);
      if (parsed.timelineMilestones && Array.isArray(parsed.timelineMilestones)) setTimelineMilestones(parsed.timelineMilestones);
      if (parsed.intelligenceStats) setIntelligenceStats(parsed.intelligenceStats);
      if (parsed.postLikes) setPostLikes(parsed.postLikes);
      if (parsed.readerPollVotes) setReaderPollVotes(parsed.readerPollVotes);
      if (parsed.witnessComments) setWitnessComments(parsed.witnessComments);
      if (parsed.userTheories) setUserTheories(parsed.userTheories);
      const nextAlbums = Array.isArray(parsed.bookAlbums)
        ? parsed.bookAlbums
        : deriveAlbumsFromBooks(parsed.reviews, parsed.nonFictionBooks || nonFictionBooks);
      setBookAlbums(nextAlbums);

      await syncWithServer({
        reviews: parsed.reviews,
        nonFictionBooks: parsed.nonFictionBooks || nonFictionBooks,
        heroConfig: parsed.heroConfig || heroConfig,
        aboutConfig: parsed.aboutConfig || aboutConfig,
        currentlyReading: parsed.currentlyReading,
        stats: parsed.stats,
        timelineStats: parsed.timelineStats || timelineStats,
        timelineMilestones: parsed.timelineMilestones || timelineMilestones,
        intelligenceStats: parsed.intelligenceStats || intelligenceStats,
        postLikes: parsed.postLikes,
        readerPollVotes: parsed.readerPollVotes,
        witnessComments: parsed.witnessComments,
        userTheories: parsed.userTheories,
        bookAlbums: nextAlbums,
      });

      return { success: true, message: `Successfully restored ${parsed.reviews.length} thriller case files, ${parsed.nonFictionBooks?.length || 0} field research books, ${nextAlbums.length} book albums, hero config, about config, and metrics!` };
    } catch (e: any) {
      return { success: false, message: `Failed to parse JSON file: ${e.message}` };
    }
  };

  const generateSeedCode = (): string => {
    return `import { 
  BookReview, 
  CurrentlyReading, 
  ReadingStats, 
  NonFictionBook, 
  HeroConfig,
  TimelineMilestone,
  TimelineStats,
  IntelligenceStats,
  AboutConfig,
  OffTheRecordConfig
} from '../types';

export const INITIAL_ADMIN_PASSCODE: string = ${JSON.stringify(adminPasscode || 'detective')};

export const INITIAL_TIMELINE_STATS: TimelineStats = ${JSON.stringify(timelineStats || INITIAL_TIMELINE_STATS, null, 2)};

export const INITIAL_TIMELINE_MILESTONES: TimelineMilestone[] = ${JSON.stringify(timelineMilestones || INITIAL_TIMELINE_MILESTONES, null, 2)};

export const INITIAL_INTELLIGENCE_STATS: IntelligenceStats = ${JSON.stringify(intelligenceStats || INITIAL_INTELLIGENCE_STATS, null, 2)};

export const INITIAL_HERO_CONFIG: HeroConfig = ${JSON.stringify(heroConfig, null, 2)};

export const INITIAL_ABOUT_CONFIG: AboutConfig = ${JSON.stringify(aboutConfig, null, 2)};

export const INITIAL_OFF_THE_RECORD_CONFIG: OffTheRecordConfig = ${JSON.stringify(offTheRecordConfig, null, 2)};

export const INITIAL_CURRENTLY_READING: CurrentlyReading = ${JSON.stringify(currentlyReading, null, 2)};

export const INITIAL_STATS: ReadingStats = ${JSON.stringify(stats, null, 2)};

export const INITIAL_REVIEWS: BookReview[] = ${JSON.stringify(reviews, null, 2)};

export const INITIAL_NON_FICTION_BOOKS: NonFictionBook[] = ${JSON.stringify(nonFictionBooks, null, 2)};
`;
  };

  const resetToDefaults = async (): Promise<void> => {
    if (window.confirm('Reset the journal archive to original default case files? All custom edits will be reverted.')) {
      setReviews(INITIAL_REVIEWS);
      setNonFictionBooks(INITIAL_NON_FICTION_BOOKS);
      setHeroConfig(INITIAL_HERO_CONFIG);
      setAboutConfig(INITIAL_ABOUT_CONFIG);
      setOffTheRecordConfig(INITIAL_OFF_THE_RECORD_CONFIG);
      setCurrentlyReading(INITIAL_CURRENTLY_READING);
      setStats(INITIAL_STATS);
      setTimelineStats(INITIAL_TIMELINE_STATS);
      setTimelineMilestones(INITIAL_TIMELINE_MILESTONES);
      setIntelligenceStats(INITIAL_INTELLIGENCE_STATS);
      setAdminPasscodeState(INITIAL_ADMIN_PASSCODE);
      setUserTheories([]);
      setVisitorGuessesState({});
      setRevealedAnswers({});
      setUnlockedClues({});
      setUnlockedSpoilers({});
      setPostLikes(INITIAL_LIKES_SEED);
      setUserLikedPosts({});
      setReaderPollVotes(INITIAL_POLLS_SEED);
      setUserPollVotes({});
      setWitnessComments(INITIAL_COMMENTS_SEED);
      const defaultAlbums = deriveAlbumsFromBooks(INITIAL_REVIEWS, INITIAL_NON_FICTION_BOOKS);
      setBookAlbums(defaultAlbums);
      localStorage.clear();
      await syncWithServer({
        reviews: INITIAL_REVIEWS,
        nonFictionBooks: INITIAL_NON_FICTION_BOOKS,
        heroConfig: INITIAL_HERO_CONFIG,
        aboutConfig: INITIAL_ABOUT_CONFIG,
        offTheRecordConfig: INITIAL_OFF_THE_RECORD_CONFIG,
        currentlyReading: INITIAL_CURRENTLY_READING,
        stats: INITIAL_STATS,
        timelineStats: INITIAL_TIMELINE_STATS,
        timelineMilestones: INITIAL_TIMELINE_MILESTONES,
        intelligenceStats: INITIAL_INTELLIGENCE_STATS,
        postLikes: INITIAL_LIKES_SEED,
        readerPollVotes: INITIAL_POLLS_SEED,
        witnessComments: INITIAL_COMMENTS_SEED,
        userTheories: [],
        bookAlbums: defaultAlbums,
      });
    }
  };

  const allAlbumNames = useMemo(() => {
    const names = new Set<string>();
    bookAlbums.forEach((a) => {
      if (a.name?.trim()) names.add(a.name.trim());
    });
    reviews.forEach((r) => {
      if (r.seriesName?.trim()) names.add(r.seriesName.trim());
    });
    nonFictionBooks.forEach((b) => {
      if (b.seriesName?.trim()) names.add(b.seriesName.trim());
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [bookAlbums, reviews, nonFictionBooks]);

  const syncBookSeriesMetadataFromAlbums = (
    albumsList: BookAlbum[],
    reviewsList: BookReview[],
    nfList: NonFictionBook[]
  ) => {
    const revMap = new Map<string, { name: string; order: number }>();
    const nfMap = new Map<string, { name: string; order: number }>();
    albumsList.forEach((album) => {
      album.items.forEach((item, idx) => {
        if (item.kind === 'thriller' && !revMap.has(item.id)) {
          revMap.set(item.id, { name: album.name, order: idx + 1 });
        } else if (item.kind === 'non-fiction' && !nfMap.has(item.id)) {
          nfMap.set(item.id, { name: album.name, order: idx + 1 });
        }
      });
    });

    const nextReviews = reviewsList.map((r) => {
      const assigned = revMap.get(r.id);
      if (assigned) {
        return { ...r, seriesName: assigned.name, seriesOrder: assigned.order };
      }
      if (r.seriesName || r.seriesOrder !== undefined) {
        const clone = { ...r };
        delete clone.seriesName;
        delete clone.seriesOrder;
        return clone;
      }
      return r;
    });

    const nextNf = nfList.map((b) => {
      const assigned = nfMap.get(b.id);
      if (assigned) {
        return { ...b, seriesName: assigned.name, seriesOrder: assigned.order };
      }
      if (b.seriesName || b.seriesOrder !== undefined) {
        const clone = { ...b };
        delete clone.seriesName;
        delete clone.seriesOrder;
        return clone;
      }
      return b;
    });

    return { nextReviews, nextNf };
  };

  const openAlbumEditor = (album: BookAlbum | null = null) => {
    setEditingAlbum(album);
    setIsAlbumEditorOpen(true);
  };

  const openAlbumByName = (name: string) => {
    const target = name.trim().toLowerCase();
    if (!target) return;
    const found = bookAlbums.find((a) => a.name.trim().toLowerCase() === target);
    if (found) {
      setViewingAlbumId(found.id);
    } else {
      openAlbumEditor(null);
    }
  };

  const saveBookAlbum = async (payload: {
    id?: string;
    name: string;
    description?: string;
    items: BookAlbumItem[];
  }): Promise<BookAlbum> => {
    const cleanName = payload.name.trim();
    const now = new Date().toISOString();
    const dedupedItems: BookAlbumItem[] = [];
    const seen = new Set<string>();
    payload.items.forEach((it) => {
      const key = `${it.kind}:${it.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        dedupedItems.push(it);
      }
    });

    const existing = payload.id ? bookAlbums.find((a) => a.id === payload.id) : null;
    const savedAlbum: BookAlbum = existing
      ? {
          ...existing,
          name: cleanName || existing.name,
          description: payload.description?.trim() || '',
          items: dedupedItems,
          updatedAt: now,
        }
      : {
          id: `album-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'custom'}-${Date.now()}`,
          name: cleanName || 'Untitled Album',
          description: payload.description?.trim() || '',
          items: dedupedItems,
          createdAt: now,
          updatedAt: now,
        };

    const nextAlbums = existing
      ? bookAlbums.map((a) => (a.id === savedAlbum.id ? savedAlbum : a))
      : [savedAlbum, ...bookAlbums];

    const { nextReviews, nextNf } = syncBookSeriesMetadataFromAlbums(nextAlbums, reviews, nonFictionBooks);
    setBookAlbums(nextAlbums);
    setReviews(nextReviews);
    setNonFictionBooks(nextNf);

    if (selectedReview) {
      const refreshed = nextReviews.find((r) => r.id === selectedReview.id);
      if (refreshed) setSelectedReview(refreshed);
    }
    if (selectedNonFictionBook) {
      const refreshed = nextNf.find((b) => b.id === selectedNonFictionBook.id);
      if (refreshed) setSelectedNonFictionBook(refreshed);
    }

    await syncWithServer({
      bookAlbums: nextAlbums,
      reviews: nextReviews,
      nonFictionBooks: nextNf,
    });

    return savedAlbum;
  };

  const deleteBookAlbum = async (albumId: string): Promise<void> => {
    const nextAlbums = bookAlbums.filter((a) => a.id !== albumId);
    const { nextReviews, nextNf } = syncBookSeriesMetadataFromAlbums(nextAlbums, reviews, nonFictionBooks);
    setBookAlbums(nextAlbums);
    setReviews(nextReviews);
    setNonFictionBooks(nextNf);

    if (viewingAlbumId === albumId) {
      setViewingAlbumId(null);
    }
    if (selectedReview) {
      const refreshed = nextReviews.find((r) => r.id === selectedReview.id);
      if (refreshed) setSelectedReview(refreshed);
    }
    if (selectedNonFictionBook) {
      const refreshed = nextNf.find((b) => b.id === selectedNonFictionBook.id);
      if (refreshed) setSelectedNonFictionBook(refreshed);
    }

    await syncWithServer({
      bookAlbums: nextAlbums,
      reviews: nextReviews,
      nonFictionBooks: nextNf,
    });
  };

  const addBookToAlbum = async (albumId: string, item: BookAlbumItem): Promise<void> => {
    const album = bookAlbums.find((a) => a.id === albumId);
    if (!album) return;
    if (album.items.some((it) => it.kind === item.kind && it.id === item.id)) return;
    await saveBookAlbum({
      id: album.id,
      name: album.name,
      description: album.description,
      items: [...album.items, item],
    });
  };

  const removeBookFromAlbum = async (albumId: string, item: BookAlbumItem): Promise<void> => {
    const album = bookAlbums.find((a) => a.id === albumId);
    if (!album) return;
    await saveBookAlbum({
      id: album.id,
      name: album.name,
      description: album.description,
      items: album.items.filter((it) => !(it.kind === item.kind && it.id === item.id)),
    });
  };

  const reorderAlbumItems = async (albumId: string, items: BookAlbumItem[]): Promise<void> => {
    const album = bookAlbums.find((a) => a.id === albumId);
    if (!album) return;
    await saveBookAlbum({
      id: album.id,
      name: album.name,
      description: album.description,
      items,
    });
  };

  const assignBookToNamedAlbum = async (
    albumName: string | undefined,
    item: BookAlbumItem,
    preferredOrder?: number
  ): Promise<void> => {
    const nextAlbums = computeNextAlbumsForBook(bookAlbums, albumName, item, preferredOrder);
    setBookAlbums(nextAlbums);
    await syncWithServer({ bookAlbums: nextAlbums });
  };

  return (
    <JournalContext.Provider
      value={{
        reviews,
        nonFictionBooks,
        heroConfig,
        aboutConfig,
        offTheRecordConfig,
        currentlyReading,
        stats,
        timelineStats,
        timelineMilestones,
        intelligenceStats,
        selectedReview,
        selectedNonFictionBook,
        activeView,
        searchQuery,
        selectedGenre,
        visitorGuesses,
        revealedAnswers,
        unlockedClues,
        unlockedSpoilers,
        userTheories,
        isNewReviewModalOpen,
        isNewNonFictionModalOpen,
        isStatsEditorOpen,
        isTimelineEditorOpen,
        isIntelligenceEditorOpen,
        isCurrentlyReadingModalOpen,
        isEditHeroModalOpen,
        isEditAboutModalOpen,
        isEditOffTheRecordModalOpen,
        setIsEditOffTheRecordModalOpen,
        editingReview,
        editingNonFictionBook,
        isAdminUnlocked,
        isAdminModalOpen,
        adminPasscode,
        setIsAdminModalOpen,
        unlockAdmin,
        lockAdmin,
        setAdminPasscode,
        githubUser,
        isGitHubConnected: !!githubUser,
        isGitHubConfigured,
        isGitHubModalOpen,
        setIsGitHubModalOpen,
        connectGitHubWithOAuth,
        connectGitHubWithToken,
        disconnectGitHub,
        syncToGitHub,
        postLikes,
        userLikedPosts,
        readerPollVotes,
        userPollVotes,
        witnessComments,
        setEditingReview,
        setEditingNonFictionBook,
        setActiveView,
        setSelectedReview,
        setSelectedNonFictionBook,
        setSearchQuery,
        setSelectedGenre,
        openReviewById,
        addReview,
        updateReview,
        deleteReview,
        duplicateReview,
        addNonFictionBook,
        updateNonFictionBook,
        deleteNonFictionBook,
        duplicateNonFictionBook,
        toggleLikeNonFictionBook,
        addNonFictionScratchpadNote,
        updateHeroConfig,
        updateAboutConfig,
        updateOffTheRecordConfig,
        updateCurrentlyReading,
        updateStats,
        updateTimelineStats,
        addTimelineMilestone,
        updateTimelineMilestone,
        deleteTimelineMilestone,
        updateIntelligenceStats,
        setVisitorGuess,
        revealAnswer,
        toggleClueUnlock,
        unlockSpoiler,
        lockSpoiler,
        resetClassifiedFile,
        resetVisitorGuess,
        submitTheory,
        setIsNewReviewModalOpen,
        setIsNewNonFictionModalOpen,
        setIsStatsEditorOpen,
        setIsTimelineEditorOpen,
        setIsIntelligenceEditorOpen,
        setIsCurrentlyReadingModalOpen,
        setIsEditHeroModalOpen,
        setIsEditAboutModalOpen,
        isAddFileModalOpen,
        setIsAddFileModalOpen,
        isCompleteBookModalOpen,
        setIsCompleteBookModalOpen,
        completingBookTarget,
        setCompletingBookTarget,
        openCompleteAndArchive,
        archiveCurrentBook,
        addBookToCurrentReads,
        removeBookFromCurrentReads,
        updateAdditionalBook,
        moveAdditionalToPrimary,
        moveAdditionalToCompanion,
        movePrimaryToAdditional,
        moveCompanionToAdditional,
        openEditAdditionalBook,
        editingAdditionalBookId,
        setEditingAdditionalBookId,
        toggleLikePost,
        voteReaderPoll,
        addWitnessComment,
        customThrillerTropes,
        customResearchTropes,
        addCustomThrillerTrope,
        removeCustomThrillerTrope,
        addCustomResearchTrope,
        removeCustomResearchTrope,
        removeTropeFromReview,
        removeTropeFromNonFiction,
        offTheRecordGenres,
        addOffTheRecordGenre,
        editOffTheRecordGenre,
        removeOffTheRecordGenre,
        resetOffTheRecordGenres,
        archiveGenres,
        addArchiveGenre,
        editArchiveGenre,
        removeArchiveGenre,
        resetArchiveGenres,
        bookAlbums,
        allAlbumNames,
        viewingAlbumId,
        setViewingAlbumId,
        isAlbumEditorOpen,
        setIsAlbumEditorOpen,
        editingAlbum,
        setEditingAlbum,
        openAlbumEditor,
        openAlbumByName,
        saveBookAlbum,
        deleteBookAlbum,
        addBookToAlbum,
        removeBookFromAlbum,
        reorderAlbumItems,
        assignBookToNamedAlbum,
        exportDataAsJSON,
        importDataFromJSON,
        generateSeedCode,
        resetToDefaults,
        isSyncingFirestore,
        lastFirestoreSync,
        firestoreSyncError,
        retryFirestoreSync,
        syncWithServer,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
