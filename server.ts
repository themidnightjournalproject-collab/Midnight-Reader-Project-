import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Default initial dataset fallback
import { 
  INITIAL_REVIEWS, 
  INITIAL_CURRENTLY_READING, 
  INITIAL_STATS, 
  INITIAL_ADMIN_PASSCODE,
  INITIAL_NON_FICTION_BOOKS,
  INITIAL_HERO_CONFIG,
  INITIAL_TIMELINE_STATS,
  INITIAL_TIMELINE_MILESTONES,
  INITIAL_INTELLIGENCE_STATS
} from './src/data/initialData.ts';

const DEFAULT_ABOUT_CONFIG = {
  headerSubtitle: "THE STUDENT BEHIND THE LEDGER",
  headerBadge: "CORRESPONDENT PROFILE",
  pageTitle: "ABOUT THE CURATOR",
  curatorPhoto: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
  photoStamp: "DESK AT 2:15 AM",
  classification: "Full-Time Student & Chronic Reader",
  obsession: "Unreliable Narrators, Deep Ideas & Good Twists",
  featuredQuote: "I started reading thrillers because I wanted to know what happened. I continued reading them because apparently I enjoy distrusting fictional strangers.",
  bioParagraph1: "Welcome to The Midnight Reader. Between university deadlines, lectures, and caffeinated late-night cram sessions, this journal serves as my evidence room. Every book filed here is treated as an active case: forensic character breakdowns, timeline reconstructions, and unfiltered marginalia.",
  bioParagraph2: "While psychological thrillers and locked-room mysteries remain my primary obsession, 'The Library' houses everything else that commands my attention—from cosmic science fiction and memoirs to cognitive psychology and philosophy. Reading is both an investigative pursuit and a sanctuary.",
  bioParagraph3: "Readers are welcome to vote on plot twists, submit suspect theories, or browse the case file dossiers. Just remember the fundamental rule: never trust a narrator who insists they are telling the whole truth.",
  rulesHeading: "MY 4 GOLDEN RULES OF READING INVESTIGATION",
  rules: [
    {
      number: 1,
      title: "RULE #1: TRUST NO NARRATOR",
      description: "If the narrator repeatedly emphasizes their own innocence, sanity, or sobriety in chapter one, they did it."
    },
    {
      number: 2,
      title: "RULE #2: THE INCONSPICUOUS GARDENER RULE",
      description: "Characters mentioned casually on page 42 who vanish until chapter 28 are never just innocent bystanders."
    },
    {
      number: 3,
      title: "RULE #3: THE ATTIC DEADBOLT CONSTANT",
      description: "If a door in a Victorian estate is locked from the outside, do not wait for the climax to ask why."
    },
    {
      number: 4,
      title: "RULE #4: MULTI-GENRE CURIOSITY",
      description: "A sharp mind reads across genres. Step outside the crime scene into philosophy, sci-fi, and essays to keep your deductions agile."
    }
  ],
  finalNote: "Filed from dorm room desk with three cold mugs of green tea."
};

const PORT = process.env.RENDER && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'journal_store.json');
const INITIAL_DATA_TS = path.join(process.cwd(), 'src', 'data', 'initialData.ts');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create data dir', e);
  }
}

interface DatabaseSchema {
  adminPasscode: string;
  reviews: any[];
  nonFictionBooks: any[];
  heroConfig: any;
  currentlyReading: any;
  stats: any;
  timelineStats?: any;
  timelineMilestones?: any[];
  intelligenceStats?: any;
  aboutConfig?: any;
  postLikes: Record<string, number>;
  readerPollVotes: Record<string, Record<string, number>>;
  witnessComments: Record<string, any[]>;
  userTheories: any[];
}

function loadDatabase(): DatabaseSchema {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        adminPasscode: parsed.adminPasscode || INITIAL_ADMIN_PASSCODE || 'detective',
        reviews: parsed.reviews || INITIAL_REVIEWS,
        nonFictionBooks: parsed.nonFictionBooks || INITIAL_NON_FICTION_BOOKS,
        heroConfig: parsed.heroConfig || INITIAL_HERO_CONFIG,
        currentlyReading: parsed.currentlyReading || INITIAL_CURRENTLY_READING,
        stats: parsed.stats || INITIAL_STATS,
        timelineStats: parsed.timelineStats || INITIAL_TIMELINE_STATS,
        timelineMilestones: parsed.timelineMilestones || INITIAL_TIMELINE_MILESTONES,
        intelligenceStats: parsed.intelligenceStats || INITIAL_INTELLIGENCE_STATS,
        aboutConfig: parsed.aboutConfig || DEFAULT_ABOUT_CONFIG,
        postLikes: parsed.postLikes || {},
        readerPollVotes: parsed.readerPollVotes || {},
        witnessComments: parsed.witnessComments || {},
        userTheories: parsed.userTheories || [],
      };
    } catch (err) {
      console.error('Error reading database file, using fallback', err);
    }
  }

  // Initial setup if file doesn't exist
  const initialDb: DatabaseSchema = {
    adminPasscode: INITIAL_ADMIN_PASSCODE || 'detective',
    reviews: INITIAL_REVIEWS,
    nonFictionBooks: INITIAL_NON_FICTION_BOOKS,
    heroConfig: INITIAL_HERO_CONFIG,
    currentlyReading: INITIAL_CURRENTLY_READING,
    stats: INITIAL_STATS,
    timelineStats: INITIAL_TIMELINE_STATS,
    timelineMilestones: INITIAL_TIMELINE_MILESTONES,
    intelligenceStats: INITIAL_INTELLIGENCE_STATS,
    aboutConfig: DEFAULT_ABOUT_CONFIG,
    postLikes: {
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
    },
    readerPollVotes: {
      'case-014': { option_a: 142, option_b: 64, option_c: 29 },
      'case-013': { option_a: 88, option_b: 194, option_c: 41 },
      'case-012': { option_a: 210, option_b: 45, option_c: 82 },
      'case-010': { option_a: 175, option_b: 91, option_c: 33 },
      'case-003': { option_a: 230, option_b: 115, option_c: 44 },
    },
    witnessComments: {
      'case-014': [
        {
          id: 'wit-001',
          witnessName: 'Detective Morgan (Reader)',
          badge: 'VERIFIED WITNESS',
          comment: 'I suspected Andrew the entire time! When the attic door locked, my heart dropped into my stomach. 5/5 stars.',
          timestamp: 'Nov 05, 2025 at 01:22 AM',
          likes: 42,
        },
        {
          id: 'wit-002',
          witnessName: 'Agent Cooper',
          badge: 'FORENSIC OBSERVER',
          comment: 'Nina Winchester is one of the most calculated characters in modern thriller literature. Brilliant breakdown!',
          timestamp: 'Nov 06, 2025 at 04:15 PM',
          likes: 19,
        }
      ]
    },
    userTheories: [],
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file', err);
  }

  // Also sync to initialData.ts if writable so code redeployments keep all changes permanently in git/build!
  try {
    if (fs.existsSync(INITIAL_DATA_TS)) {
      const tsContent = `import { 
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

export const INITIAL_ADMIN_PASSCODE: string = ${JSON.stringify(db.adminPasscode || 'detective')};

export const INITIAL_TIMELINE_STATS: TimelineStats = ${JSON.stringify(db.timelineStats || INITIAL_TIMELINE_STATS, null, 2)};

export const INITIAL_TIMELINE_MILESTONES: TimelineMilestone[] = ${JSON.stringify(db.timelineMilestones || INITIAL_TIMELINE_MILESTONES, null, 2)};

export const INITIAL_INTELLIGENCE_STATS: IntelligenceStats = ${JSON.stringify(db.intelligenceStats || INITIAL_INTELLIGENCE_STATS, null, 2)};

export const INITIAL_HERO_CONFIG: HeroConfig = ${JSON.stringify(db.heroConfig || INITIAL_HERO_CONFIG, null, 2)};

export const INITIAL_CURRENTLY_READING: CurrentlyReading = ${JSON.stringify(db.currentlyReading, null, 2)};

export const INITIAL_STATS: ReadingStats = ${JSON.stringify(db.stats, null, 2)};

export const INITIAL_REVIEWS: BookReview[] = ${JSON.stringify(db.reviews, null, 2)};

export const INITIAL_NON_FICTION_BOOKS: NonFictionBook[] = ${JSON.stringify(db.nonFictionBooks || INITIAL_NON_FICTION_BOOKS, null, 2)};

export const INITIAL_ABOUT_CONFIG: AboutConfig = ${JSON.stringify(db.aboutConfig || DEFAULT_ABOUT_CONFIG, null, 2)};
`;
      fs.writeFileSync(INITIAL_DATA_TS, tsContent, 'utf-8');
    }
  } catch (err) {
    console.warn('Could not sync to initialData.ts (possibly production bundle)', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '15mb' }));

  // ==========================================
  // API ROUTES
  // ==========================================

  // 1. Get Journal State (Public - password is NEVER exposed)
  app.get('/api/state', (req, res) => {
    res.json({
      reviews: db.reviews,
      nonFictionBooks: db.nonFictionBooks,
      heroConfig: db.heroConfig,
      currentlyReading: db.currentlyReading,
      stats: db.stats,
      timelineStats: db.timelineStats,
      timelineMilestones: db.timelineMilestones,
      intelligenceStats: db.intelligenceStats,
      aboutConfig: db.aboutConfig,
      postLikes: db.postLikes,
      readerPollVotes: db.readerPollVotes,
      witnessComments: db.witnessComments,
      userTheories: db.userTheories,
      isPasswordProtected: true,
    });
  });

  // 2. Verify Passcode (Secure - validates on server)
  app.post('/api/verify-passcode', (req, res) => {
    const { passcode } = req.body;
    if (!passcode || typeof passcode !== 'string') {
      return res.status(400).json({ success: false, message: 'Passcode required' });
    }

    if (passcode.trim() === db.adminPasscode.trim()) {
      return res.json({ success: true, message: 'Clearance verified' });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  });

  // 3. Change Passcode (Secure - updates on server and writes to initialData.ts)
  app.post('/api/change-passcode', (req, res) => {
    const { currentPasscode, newPasscode } = req.body;

    if (!newPasscode || typeof newPasscode !== 'string' || newPasscode.trim().length < 4) {
      return res.status(400).json({ success: false, message: 'New passcode must be at least 4 characters.' });
    }

    // Check current passcode if provided, or allow if matched
    if (currentPasscode && currentPasscode.trim() !== db.adminPasscode.trim()) {
      return res.status(401).json({ success: false, message: 'Current passcode is incorrect.' });
    }

    db.adminPasscode = newPasscode.trim();
    saveDatabase(db);

    console.log('Admin passcode updated successfully and synced to disk & initialData.ts');
    return res.json({ success: true, message: 'Passcode updated and permanently saved.' });
  });

  // 4. Save entire state (Admin authorized - permanently syncs all edits)
  app.post('/api/save-state', (req, res) => {
    const { 
      passcode, 
      reviews, 
      nonFictionBooks,
      heroConfig,
      currentlyReading, 
      stats, 
      timelineStats,
      timelineMilestones,
      intelligenceStats,
      aboutConfig,
      postLikes, 
      readerPollVotes, 
      witnessComments, 
      userTheories 
    } = req.body;

    // Verify passcode if provided
    if (passcode && passcode.trim() !== db.adminPasscode.trim()) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid passcode' });
    }

    if (reviews && Array.isArray(reviews)) db.reviews = reviews;
    if (nonFictionBooks && Array.isArray(nonFictionBooks)) db.nonFictionBooks = nonFictionBooks;
    if (heroConfig) db.heroConfig = heroConfig;
    if (currentlyReading) db.currentlyReading = currentlyReading;
    if (stats) db.stats = stats;
    if (timelineStats) db.timelineStats = timelineStats;
    if (timelineMilestones && Array.isArray(timelineMilestones)) db.timelineMilestones = timelineMilestones;
    if (intelligenceStats) db.intelligenceStats = intelligenceStats;
    if (aboutConfig) db.aboutConfig = aboutConfig;
    if (postLikes) db.postLikes = postLikes;
    if (readerPollVotes) db.readerPollVotes = readerPollVotes;
    if (witnessComments) db.witnessComments = witnessComments;
    if (userTheories) db.userTheories = userTheories;

    saveDatabase(db);
    return res.json({ success: true, message: 'State permanently saved across redeployments.' });
  });

  // 5. Public reader like endpoint
  app.post('/api/public/like', (req, res) => {
    const { reviewId } = req.body;
    if (!reviewId) return res.status(400).json({ error: 'Missing reviewId' });

    db.postLikes[reviewId] = (db.postLikes[reviewId] || 0) + 1;
    saveDatabase(db);
    res.json({ success: true, likes: db.postLikes[reviewId] });
  });

  // 6. Public reader poll vote endpoint
  app.post('/api/public/poll', (req, res) => {
    const { reviewId, optionKey } = req.body;
    if (!reviewId || !optionKey) return res.status(400).json({ error: 'Missing reviewId or optionKey' });

    if (!db.readerPollVotes[reviewId]) {
      db.readerPollVotes[reviewId] = { option_a: 0, option_b: 0, option_c: 0 };
    }
    db.readerPollVotes[reviewId][optionKey] = (db.readerPollVotes[reviewId][optionKey] || 0) + 1;
    saveDatabase(db);
    res.json({ success: true, poll: db.readerPollVotes[reviewId] });
  });

  // 7. Public reader comment endpoint
  app.post('/api/public/comment', (req, res) => {
    const { reviewId, comment } = req.body;
    if (!reviewId || !comment) return res.status(400).json({ error: 'Missing reviewId or comment' });

    if (!db.witnessComments[reviewId]) {
      db.witnessComments[reviewId] = [];
    }
    db.witnessComments[reviewId].unshift(comment);
    saveDatabase(db);
    res.json({ success: true, comments: db.witnessComments[reviewId] });
  });

  // 8. Public reader theory endpoint
  app.post('/api/public/theory', (req, res) => {
    const { theory } = req.body;
    if (!theory) return res.status(400).json({ error: 'Missing theory' });

    db.userTheories.unshift(theory);
    saveDatabase(db);
    res.json({ success: true, theories: db.userTheories });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Midnight Reader server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error on port ' + PORT, err);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
