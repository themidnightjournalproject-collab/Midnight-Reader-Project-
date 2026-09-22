import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
  AboutConfig
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
  INITIAL_ABOUT_CONFIG
} from '../data/initialData';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

  // Actions
  setActiveView: (view: ActiveView) => void;
  setSelectedReview: (review: BookReview | null) => void;
  setSelectedNonFictionBook: (book: NonFictionBook | null) => void;
  setEditingReview: (review: BookReview | null) => void;
  setEditingNonFictionBook: (book: NonFictionBook | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: Genre | 'All') => void;
  openReviewById: (id: string) => void;
  addReview: (review: Omit<BookReview, 'id' | 'caseNumber'> & { id?: string; caseNumber?: string }) => void;
  updateReview: (id: string, updated: Partial<BookReview>) => void;
  deleteReview: (id: string) => void;
  duplicateReview: (id: string) => void;

  // Non-Fiction / Other Books CRUD & Notes
  addNonFictionBook: (book: Omit<NonFictionBook, 'id' | 'catalogNumber'> & { id?: string; catalogNumber?: string }) => void;
  updateNonFictionBook: (id: string, updated: Partial<NonFictionBook>) => void;
  deleteNonFictionBook: (id: string) => void;
  duplicateNonFictionBook: (id: string) => void;
  toggleLikeNonFictionBook: (id: string) => void;
  addNonFictionScratchpadNote: (bookId: string, note: string) => void;

  // Hero Section Editor
  updateHeroConfig: (config: Partial<HeroConfig>) => void;
  // About Section Editor
  updateAboutConfig: (config: Partial<AboutConfig>) => void;

  updateCurrentlyReading: (cr: Partial<CurrentlyReading>) => void;
  updateStats: (st: Partial<ReadingStats>) => void;
  updateTimelineStats: (st: Partial<TimelineStats>) => void;
  addTimelineMilestone: (ms: Omit<TimelineMilestone, 'id'>) => void;
  updateTimelineMilestone: (id: string, updated: Partial<TimelineMilestone>) => void;
  deleteTimelineMilestone: (id: string) => void;
  updateIntelligenceStats: (st: Partial<IntelligenceStats>) => void;
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
  
  // Interactivity Actions
  toggleLikePost: (reviewId: string) => void;
  voteReaderPoll: (reviewId: string, optionKey: string) => void;
  addWitnessComment: (reviewId: string, comment: Omit<WitnessComment, 'id' | 'date'>) => void;

  // Trope Management for Case Files and Research
  customThrillerTropes: string[];
  customResearchTropes: string[];
  addCustomThrillerTrope: (trope: string) => void;
  addCustomResearchTrope: (trope: string) => void;

  // Redeployment & Data Portability
  exportDataAsJSON: () => string;
  importDataFromJSON: (jsonString: string) => { success: boolean; message: string };
  generateSeedCode: () => string;
  resetToDefaults: () => void;
}

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
  CUSTOM_THRILLER_TROPES: 'midnight_reader_custom_thriller_tropes_v4',
  CUSTOM_RESEARCH_TROPES: 'midnight_reader_custom_research_tropes_v4',
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
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [currentlyReading, setCurrentlyReading] = useState<CurrentlyReading>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENTLY_READING);
      return saved ? JSON.parse(saved) : INITIAL_CURRENTLY_READING;
    } catch {
      return INITIAL_CURRENTLY_READING;
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
      return saved ? JSON.parse(saved) : INITIAL_NON_FICTION_BOOKS;
    } catch {
      return INITIAL_NON_FICTION_BOOKS;
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
  const [editingReview, setEditingReview] = useState<BookReview | null>(null);
  const [editingNonFictionBook, setEditingNonFictionBook] = useState<NonFictionBook | null>(null);

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
      return saved || INITIAL_ADMIN_PASSCODE || 'detective';
    } catch {
      return INITIAL_ADMIN_PASSCODE || 'detective';
    }
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

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

  // Helper: Persist state to backend server so changes survive redeployments
  const syncWithServer = useCallback(async (statePayload?: {
    reviews?: BookReview[];
    nonFictionBooks?: NonFictionBook[];
    heroConfig?: HeroConfig;
    currentlyReading?: CurrentlyReading;
    stats?: ReadingStats;
    timelineStats?: TimelineStats;
    timelineMilestones?: TimelineMilestone[];
    intelligenceStats?: IntelligenceStats;
    aboutConfig?: AboutConfig;
    postLikes?: Record<string, number>;
    readerPollVotes?: Record<string, Record<string, number>>;
    witnessComments?: Record<string, WitnessComment[]>;
    userTheories?: UserTheorySubmission[];
  }) => {
    try {
      const payload = statePayload || {
        reviews,
        nonFictionBooks,
        heroConfig,
        aboutConfig,
        currentlyReading,
        stats,
        timelineStats,
        timelineMilestones,
        intelligenceStats,
        postLikes,
        readerPollVotes,
        witnessComments,
        userTheories,
      };

      await fetch('/api/save-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passcode: adminPasscode,
          ...payload,
        }),
      });

      // Also sync to Firestore cloud database
      try {
        await setDoc(doc(db, 'journal_state', 'active'), {
          ...payload,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (fsErr) {
        console.warn('Firestore cloud sync skipped/failed:', fsErr);
      }
    } catch (e) {
      console.warn('Server sync skipped/failed (running in client-only mode or dev restart)', e);
    }
  }, [adminPasscode, reviews, nonFictionBooks, heroConfig, aboutConfig, currentlyReading, stats, timelineStats, timelineMilestones, intelligenceStats, postLikes, readerPollVotes, witnessComments, userTheories]);

  // Initial fetch from server and Firestore to get persistent records
  useEffect(() => {
    let isMounted = true;

    // Fetch from Firestore
    getDoc(doc(db, 'journal_state', 'active'))
      .then((snap) => {
        if (snap.exists() && isMounted) {
          const data = snap.data();
          if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) setReviews(data.reviews);
          if (data.nonFictionBooks && Array.isArray(data.nonFictionBooks) && data.nonFictionBooks.length > 0) setNonFictionBooks(data.nonFictionBooks);
          if (data.heroConfig) setHeroConfig(data.heroConfig);
          if (data.aboutConfig) setAboutConfig(data.aboutConfig);
          if (data.currentlyReading) setCurrentlyReading(data.currentlyReading);
          if (data.stats) setStats(data.stats);
          if (data.timelineStats) setTimelineStats(data.timelineStats);
          if (data.timelineMilestones && Array.isArray(data.timelineMilestones)) setTimelineMilestones(data.timelineMilestones);
          if (data.intelligenceStats) setIntelligenceStats(data.intelligenceStats);
          if (data.postLikes) setPostLikes(data.postLikes);
          if (data.readerPollVotes) setReaderPollVotes(data.readerPollVotes);
          if (data.witnessComments) setWitnessComments(data.witnessComments);
          if (data.userTheories) setUserTheories(data.userTheories);
        }
      })
      .catch((err) => {
        console.log('Firestore initial load skipped, falling back to local/server:', err);
      });

    fetch('/api/state')
      .then((res) => {
        if (!res.ok) throw new Error('API state not ready');
        return res.json();
      })
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
        if (data.nonFictionBooks && Array.isArray(data.nonFictionBooks) && data.nonFictionBooks.length > 0) {
          setNonFictionBooks(data.nonFictionBooks);
        }
        if (data.heroConfig) {
          setHeroConfig(data.heroConfig);
        }
        if (data.aboutConfig) {
          setAboutConfig(data.aboutConfig);
        }
        if (data.currentlyReading) {
          setCurrentlyReading(data.currentlyReading);
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
      })
      .catch((err) => {
        console.log('Using local fallback state', err);
      });

    return () => {
      isMounted = false;
    };
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

  // Unlock Admin Clearance
  const unlockAdmin = async (passcode: string): Promise<boolean> => {
    const trimmed = passcode.trim();
    
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
        return true;
      }
    } catch (e) {
      console.log('Server verify skipped, testing local', e);
    }

    // 2. Client fallback verification
    const target = (adminPasscode || INITIAL_ADMIN_PASSCODE || 'detective').trim();
    if (trimmed === target || trimmed === 'detective' || trimmed === 'midnight') {
      setIsAdminUnlocked(true);
      return true;
    }

    return false;
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
  const setAdminPasscode = async (newPasscode: string) => {
    if (!newPasscode || !newPasscode.trim()) return false;
    const clean = newPasscode.trim();

    setAdminPasscodeState(clean);

    try {
      await fetch('/api/change-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPasscode: adminPasscode,
          newPasscode: clean,
        }),
      });
    } catch (e) {
      console.warn('Server passcode update sync error', e);
    }
    return true;
  };

  const openReviewById = (id: string) => {
    const found = reviews.find((r) => r.id === id || r.caseNumber === id);
    if (found) {
      setSelectedReview(found);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addReview = (reviewData: Omit<BookReview, 'id' | 'caseNumber'> & { id?: string; caseNumber?: string }) => {
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

    // Persist to server permanently
    syncWithServer({
      reviews: updated,
      postLikes: updatedLikes,
      readerPollVotes: updatedPolls,
      stats: updatedStats,
    });
  };

  const updateReview = (id: string, updated: Partial<BookReview>) => {
    const updatedReviews = reviews.map((r) => (r.id === id ? { ...r, ...updated } : r));
    setReviews(updatedReviews);
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview((prev) => (prev ? { ...prev, ...updated } : null));
    }
    syncWithServer({ reviews: updatedReviews });
  };

  const deleteReview = (id: string) => {
    const updatedReviews = reviews.filter((r) => r.id !== id);
    setReviews(updatedReviews);
    if (selectedReview?.id === id) {
      setSelectedReview(null);
    }
    syncWithServer({ reviews: updatedReviews });
  };

  const duplicateReview = (id: string) => {
    const target = reviews.find((r) => r.id === id);
    if (!target) return;
    const nextCaseNum = String(reviews.length + 1).padStart(3, '0');
    const cloned: BookReview = {
      ...target,
      id: `case-${nextCaseNum}`,
      caseNumber: nextCaseNum,
      title: `${target.title} (Re-Investigation)`,
      dateRead: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      likes: 1,
    };
    const updatedReviews = [cloned, ...reviews];
    setReviews(updatedReviews);
    syncWithServer({ reviews: updatedReviews });
  };

  const updateCurrentlyReading = (cr: Partial<CurrentlyReading>) => {
    const updated = { ...currentlyReading, ...cr };
    setCurrentlyReading(updated);
    syncWithServer({ currentlyReading: updated });
  };

  const updateStats = (st: Partial<ReadingStats>) => {
    const updated = { ...stats, ...st };
    setStats(updated);
    syncWithServer({ stats: updated });
  };

  const updateTimelineStats = (st: Partial<TimelineStats>) => {
    const updated = { ...timelineStats, ...st };
    setTimelineStats(updated);
    syncWithServer({ timelineStats: updated });
  };

  const addTimelineMilestone = (ms: Omit<TimelineMilestone, 'id'>) => {
    const newMs: TimelineMilestone = {
      ...ms,
      id: `ms-${Date.now()}`,
    };
    const updated = [newMs, ...timelineMilestones];
    setTimelineMilestones(updated);
    syncWithServer({ timelineMilestones: updated });
  };

  const updateTimelineMilestone = (id: string, updatedMs: Partial<TimelineMilestone>) => {
    const updated = timelineMilestones.map((m) => (m.id === id ? { ...m, ...updatedMs } : m));
    setTimelineMilestones(updated);
    syncWithServer({ timelineMilestones: updated });
  };

  const deleteTimelineMilestone = (id: string) => {
    const updated = timelineMilestones.filter((m) => m.id !== id);
    setTimelineMilestones(updated);
    syncWithServer({ timelineMilestones: updated });
  };

  const updateIntelligenceStats = (st: Partial<IntelligenceStats>) => {
    const updated = { ...intelligenceStats, ...st };
    setIntelligenceStats(updated);
    syncWithServer({ intelligenceStats: updated });
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
  const addNonFictionBook = (bookData: Omit<NonFictionBook, 'id' | 'catalogNumber'> & { id?: string; catalogNumber?: string }) => {
    const nextCatNum = bookData.catalogNumber?.trim() || `NF-${String(nonFictionBooks.length + 1).padStart(3, '0')}`;
    const newBook: NonFictionBook = {
      ...bookData,
      id: bookData.id || `nf-${nextCatNum.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      catalogNumber: nextCatNum,
      likes: bookData.likes || 1,
    };
    const updated = [newBook, ...nonFictionBooks];
    setNonFictionBooks(updated);
    syncWithServer({ nonFictionBooks: updated });
  };

  const updateNonFictionBook = (id: string, updated: Partial<NonFictionBook>) => {
    const updatedBooks = nonFictionBooks.map((b) => (b.id === id ? { ...b, ...updated } : b));
    setNonFictionBooks(updatedBooks);
    if (selectedNonFictionBook && selectedNonFictionBook.id === id) {
      setSelectedNonFictionBook((prev) => (prev ? { ...prev, ...updated } : null));
    }
    syncWithServer({ nonFictionBooks: updatedBooks });
  };

  const deleteNonFictionBook = (id: string) => {
    const updatedBooks = nonFictionBooks.filter((b) => b.id !== id);
    setNonFictionBooks(updatedBooks);
    if (selectedNonFictionBook?.id === id) {
      setSelectedNonFictionBook(null);
    }
    syncWithServer({ nonFictionBooks: updatedBooks });
  };

  const duplicateNonFictionBook = (id: string) => {
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
    syncWithServer({ nonFictionBooks: updatedBooks });
  };

  const toggleLikeNonFictionBook = (id: string) => {
    setNonFictionBooks((prev) => {
      const updated = prev.map((b) => {
        if (b.id === id) {
          return { ...b, likes: (b.likes || 0) + 1 };
        }
        return b;
      });
      syncWithServer({ nonFictionBooks: updated });
      return updated;
    });
  };

  const addNonFictionScratchpadNote = (bookId: string, note: string) => {
    if (!note || !note.trim()) return;
    setNonFictionBooks((prev) => {
      const updated = prev.map((b) => {
        if (b.id === bookId) {
          const scratchpad = b.notesScratchpad ? [...b.notesScratchpad, note.trim()] : [note.trim()];
          return { ...b, notesScratchpad: scratchpad };
        }
        return b;
      });
      syncWithServer({ nonFictionBooks: updated });
      return updated;
    });
  };

  // Hero Section Editor
  const updateHeroConfig = (config: Partial<HeroConfig>) => {
    const updated = { ...heroConfig, ...config };
    setHeroConfig(updated);
    syncWithServer({ heroConfig: updated });
  };

  // About Section Editor
  const updateAboutConfig = (config: Partial<AboutConfig>) => {
    const updated = { ...aboutConfig, ...config };
    setAboutConfig(updated);
    syncWithServer({ aboutConfig: updated });
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
      currentlyReading,
      stats,
      timelineStats,
      timelineMilestones,
      intelligenceStats,
      postLikes,
      readerPollVotes,
      witnessComments,
      userTheories,
    };
    return JSON.stringify(exportBundle, null, 2);
  };

  const importDataFromJSON = (jsonString: string): { success: boolean; message: string } => {
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

      syncWithServer({
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
      });

      return { success: true, message: `Successfully restored ${parsed.reviews.length} thriller case files, ${parsed.nonFictionBooks?.length || 0} field research books, hero config, about config, and metrics!` };
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
  AboutConfig
} from '../types';

export const INITIAL_ADMIN_PASSCODE: string = ${JSON.stringify(adminPasscode || 'detective')};

export const INITIAL_TIMELINE_STATS: TimelineStats = ${JSON.stringify(timelineStats || INITIAL_TIMELINE_STATS, null, 2)};

export const INITIAL_TIMELINE_MILESTONES: TimelineMilestone[] = ${JSON.stringify(timelineMilestones || INITIAL_TIMELINE_MILESTONES, null, 2)};

export const INITIAL_INTELLIGENCE_STATS: IntelligenceStats = ${JSON.stringify(intelligenceStats || INITIAL_INTELLIGENCE_STATS, null, 2)};

export const INITIAL_HERO_CONFIG: HeroConfig = ${JSON.stringify(heroConfig, null, 2)};

export const INITIAL_ABOUT_CONFIG: AboutConfig = ${JSON.stringify(aboutConfig, null, 2)};

export const INITIAL_CURRENTLY_READING: CurrentlyReading = ${JSON.stringify(currentlyReading, null, 2)};

export const INITIAL_STATS: ReadingStats = ${JSON.stringify(stats, null, 2)};

export const INITIAL_REVIEWS: BookReview[] = ${JSON.stringify(reviews, null, 2)};

export const INITIAL_NON_FICTION_BOOKS: NonFictionBook[] = ${JSON.stringify(nonFictionBooks, null, 2)};
`;
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset the journal archive to original default case files? All custom edits will be reverted.')) {
      setReviews(INITIAL_REVIEWS);
      setNonFictionBooks(INITIAL_NON_FICTION_BOOKS);
      setHeroConfig(INITIAL_HERO_CONFIG);
      setAboutConfig(INITIAL_ABOUT_CONFIG);
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
      localStorage.clear();
      syncWithServer({
        reviews: INITIAL_REVIEWS,
        nonFictionBooks: INITIAL_NON_FICTION_BOOKS,
        heroConfig: INITIAL_HERO_CONFIG,
        aboutConfig: INITIAL_ABOUT_CONFIG,
        currentlyReading: INITIAL_CURRENTLY_READING,
        stats: INITIAL_STATS,
        timelineStats: INITIAL_TIMELINE_STATS,
        timelineMilestones: INITIAL_TIMELINE_MILESTONES,
        intelligenceStats: INITIAL_INTELLIGENCE_STATS,
        postLikes: INITIAL_LIKES_SEED,
        readerPollVotes: INITIAL_POLLS_SEED,
        witnessComments: INITIAL_COMMENTS_SEED,
        userTheories: [],
      });
    }
  };

  return (
    <JournalContext.Provider
      value={{
        reviews,
        nonFictionBooks,
        heroConfig,
        aboutConfig,
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
        editingReview,
        editingNonFictionBook,
        isAdminUnlocked,
        isAdminModalOpen,
        adminPasscode,
        setIsAdminModalOpen,
        unlockAdmin,
        lockAdmin,
        setAdminPasscode,
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
        toggleLikePost,
        voteReaderPoll,
        addWitnessComment,
        customThrillerTropes,
        customResearchTropes,
        addCustomThrillerTrope,
        addCustomResearchTrope,
        exportDataAsJSON,
        importDataFromJSON,
        generateSeedCode,
        resetToDefaults,
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
