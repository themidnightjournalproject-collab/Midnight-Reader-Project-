import { 
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

export const INITIAL_ADMIN_PASSCODE: string = "lol12ymn";

export const INITIAL_TIMELINE_STATS: TimelineStats = {
  "archiveSpan": "2024 – 2026 Archive",
  "readingPace": "3.2 Days per Investigation",
  "fastestInvestigation": "The Silent Patient (18 Hours)",
  "longestCaseFile": "The Outsider (620 Pages)",
  "coldCasesSolved": "14 Dossiers Closed",
  "historicalLedgerNote": "Every classified dispatch logged chronologically since the first late-night thriller mystery was opened.",
  "customTimelineStat1Label": "NIGHT OWL DISPATCHES",
  "customTimelineStat1Value": "88% Read Past Midnight",
  "customTimelineStat2Label": "READING STREAK RECORD",
  "customTimelineStat2Value": "74 Consecutive Days"
};

export const INITIAL_TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    "id": "ms-01",
    "year": 2026,
    "date": "Feb 2026",
    "title": "The 2026 Investigation Ledger Opened",
    "description": "Inauguration of the comprehensive dispatch archive with unified psychological thrillers and field research dossiers.",
    "badgeText": "Current Chapter",
    "highlightType": "breakthrough"
  },
  {
    "id": "ms-02",
    "year": 2025,
    "date": "Nov 2025",
    "title": "Case #001 Closed: The Housemaid",
    "description": "Completed Freida McFadden's dual-perspective thriller; recorded record-high engagement and shock factor.",
    "badgeText": "Milestone Solve",
    "highlightType": "breakthrough"
  },
  {
    "id": "ms-03",
    "year": 2025,
    "date": "Aug 2025",
    "title": "50th Suspect Interrogation Logged",
    "description": "Crossed 50 formal suspect accusations across domestic thrillers, locked-room puzzles, and psychological dramas.",
    "badgeText": "Archive Record",
    "highlightType": "record"
  },
  {
    "id": "ms-04",
    "year": 2024,
    "date": "Jan 2024",
    "title": "The Midnight Reader Desk Established",
    "description": "Initial creation of the crime blotter reading journal after an infamous all-nighter with Gone Girl.",
    "badgeText": "Foundational Origin",
    "highlightType": "general"
  }
];

export const INITIAL_INTELLIGENCE_STATS: IntelligenceStats = {
  "bureauTitle": "COMMUNITY CORNER • READER REACTIONS",
  "headline": "Reader Thoughts & Reactions",
  "dispatchNote": "A relaxed look at what fellow readers thought, how everyone voted on plot twists, and notes left along the margins.",
  "kpiSectionTitle": "COMMUNITY ACTIVITY & REACTIONS",
  "leaderboardTitle": "Top Engaged Thrillers Leaderboard",
  "breakdownTableTitle": "Forensic Verdict Breakdown By Case File",
  "testimoniesTitle": "Latest Reader Testimonies & Notes",
  "card1Title": "TOTAL CASE ENDORSEMENTS",
  "card1Subtitle": "Active reader upvotes logged",
  "card2Title": "INTERROGATION POLLS",
  "card2Subtitle": "Verdict choices cast by visitors",
  "card3Title": "WITNESS TESTIMONIES",
  "card3Subtitle": "Reader tips and review comments",
  "card4Title": "READER TWIST ACCURACY",
  "card4Subtitle": "Readers who solved before the reveal",
  "tableColRef": "Ref #",
  "tableColTitle": "Case Title & Author",
  "tableColGenre": "Genre",
  "tableColScore": "Score",
  "tableColEndorsements": "Endorsements",
  "tableColPollVotes": "Poll Votes",
  "tableColSolved": "Solved Early %",
  "tableColNotes": "Notes",
  "tableColActions": "Actions",
  "overrideLikes": null,
  "overridePollVotes": null,
  "overrideComments": null,
  "overrideAccuracy": null,
  "customHighlightLabel": "DETECTIVE CONFIDENCE INDEX",
  "customHighlightValue": "94.2% High Alert",
  "featuredQuoteAuthor": "Chief Student Investigator",
  "featuredQuoteText": "“To read a thriller is to willingly enter into a contract of mutual paranoia with the author.”"
};

export const INITIAL_HERO_CONFIG: HeroConfig = {
  "headline": "“ANOTHER BOOK. ANOTHER SUSPECT.”",
  "dossierTag": "Dossier #2026-B",
  "leadBadge": "Lead Story • Case Dispatch",
  "bioParagraph1": "Welcome to my private archive. I am a student who began reading thrillers under the innocent premise of wanting to know what happened next. I continued reading them because, apparently, I enjoy distrusting fictional strangers in locked rooms at 2:00 AM while ignoring my homework.",
  "bioParagraph2": "This space functions as my personal reading journal crossed with a vintage police blotter. Here, every domestic dispute is a potential felony, every housekeeper has an ulterior motive, and every charming husband is guilty until proven deceased.",
  "primaryButtonText": "ENTER THE ARCHIVE",
  "secondaryButtonText": "EXAMINE CASE DOSSIER",
  "quoteAttribution": "Chief Student Investigator"
};

export const INITIAL_CURRENTLY_READING: CurrentlyReading = {
  "title": "The Last Word",
  "author": "Taylor Adams",
  "coverImage": "/covers/the-last-word.jpg",
  "genre": "Psychological Thriller",
  "currentPage": 51,
  "totalPages": 337,
  "startDate": "Feb 12, 2026",
  "currentTheory": "H.G. Kane is way too invested in Emma’s review. Either there’s something personal behind his reaction, or he’s hiding something much bigger.",
  "suspectsNoted": [
    "H.G. Kane (Author)",
    "Deek (Neighbour)",
    "Jules Phelps (Homeowner)",
    "Emma Carpenter (Reviewer)"
  ],
  "paranoiaLevel": "Extremely High (Suspicious of everyone’s coffee order)",
  "showNonThriller": true,
  "nonThrillerTitle": "Dark Matter",
  "nonThrillerAuthor": "Blake Crouch",
  "nonThrillerGenre": "Sci-Fi & Speculative Fiction",
  "nonThrillerCoverImage": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
  "nonThrillerCurrentPage": 184,
  "nonThrillerTotalPages": 398,
  "nonThrillerStartDate": "Feb 18, 2026",
  "nonThrillerThoughts": "Reading this alongside my crime dispatches. The concept of infinite alternative lives based on microscopic decisions is gripping. Crouch creates genuine existential anxiety without any detective tropes.",
  "nonThrillerNotes": "Explores regret, ambition, and identity through quantum mechanics. Highly recommended for when thriller suspects get overwhelming."
};

export const INITIAL_STATS: ReadingStats = {
  "year": 2026,
  "booksRead": 20,
  "thrillersRead": 17,
  "favoriteBook": "Dark Matter by Blake Crouch",
  "averageRating": 4.4,
  "longestBook": "The Outsider by Stephen King",
  "longestBookPages": 620,
  "suspectsAccused": 50,
  "correctGuesses": 8,
  "unnecessaryParanoia": 100,
  "cupsOfTeaDrank": 142,
  "plotTwistsExperienced": 38,
  "totalPagesRead": 6420,
  "readingStreakDays": 74,
  "favoriteTrope": "Locked-Room Mystery & Unreliable Narrator",
  "fastestSolve": "The Silent Patient (Guessed culprit on p. 82)",
  "customStat1Label": "MIDNIGHT SLEEP DEFICIT",
  "customStat1Value": "38 Late-Night Hours",
  "customStat2Label": "RED HERRINGS FOOLED",
  "customStat2Value": "29 Deceptions"
};

export const INITIAL_REVIEWS: BookReview[] = [
  {
    "caseNumber": "002",
    "title": "The Silent Patient",
    "author": "Alex Michaelides",
    "coverImage": "/covers/silent-patient.jpg",
    "genre": "Psychological Thriller",
    "dateRead": "Aug 4, 2026",
    "dateStarted": "Aug 12, 2025",
    "dateFinished": "Aug 17, 2025",
    "yearRead": 2025,
    "pages": 359,
    "rating": 4,
    "status": "CLOSED",
    "readingFormat": "Paperback",
    "correctGuess": true,
    "leadQuote": "“Silence is a form of communication.”",
    "summary": "Alicia Berenson, a famous painter, is accused of murdering her husband Gabriel and then stops speaking entirely. Years later, psychotherapist Theo Faber becomes obsessed with discovering why she refuses to talk — only to uncover a connection between himself and Alicia that changes everything.",
    "reviewText": "I absolutely LOVE this book, like everyone else in the thriller community, what an amazing read. The Silent Patient is built around the mystery of Alicia’s silence, but its real strength is how it makes the reader question Theo while simultaneously trusting him. It makes for a perfectly suspenseful read while making me think through every interaction again and again. His investigation into Alicia felt so convincing because we experience everything through his perspective, making his personal obsession so easy to overlook.\n\nI love the use of Alicia’s diary, gradually revealing pieces of her life before Gabriel’s death, it gave so much essence to Alicia as a character even without her actually ever communicating. The biggest trick is the timeline: Theo makes the reader believe his personal story is happening alongside Alicia’s treatment, when his story actually takes place years earlier.\n\nIts beautifully revealed using Alicia’s final diary entry exposing the truth and turning the entire narrative on its head. What an amazing experience this book was its almost admirable how brilliantly it was created. It was truly mind boggling throughout and kept me entertained but the ending could've done better, it all felt a bit anti climatic and too easy to digest I just wanted something more.",
    "whatIThought": "I had instantly felt that there was something wrong with Theo, so I was mainly watching for how the story would reveal his connection to Alicia.",
    "whatActuallyHappened": "Theo was the masked man who confronted Alicia and Gabriel, and his actions led to Gabriel’s death. Years later, Alicia recognises him as her therapist and secretly documents the truth. (Which was insane)",
    "favoriteMoment": "In between when it all seems to become painfully obvious but then we're in for so much more as the book progresses",
    "finalVerdict": "A masterpiece with the best story writing concepts all deliciously combined into one delightful experience",
    "recommendedFor": "Fans of Alex Michaelides, Freida McFadden, Ruth Ware, Lucy Foley, and Lisa Jewell",
    "tropes": [
      "Unreliable Narrator",
      "Multiple POVs",
      "Psychological Manipulation",
      "Cat-and-Mouse Game",
      "Obsession & Jealousy",
      "Dual Timelines"
    ],
    "atmosphereRating": 5,
    "pacingRating": 5,
    "twistExecutionRating": 5,
    "paranoiaRating": 5,
    "unreliableNarratorRating": 5,
    "twistsCount": 3,
    "evidenceBullets": [
      "Alicia’s diary — Hidden entries reveal what happened before Gabriel’s murder and expose Theo’s connection to the crime.",
      "The Missing Gun — Gabriel is shot, but the circumstances surrounding the weapon and Alicia’s silence leave questions about what really happened that night.",
      "Gabriel’s murder scene — The physical evidence points toward Alicia, but key details surrounding the night of the murder don’t completely add up."
    ],
    "marginaliaNotes": [
      "Something about Theo feels WAY too personal…",
      "Everyone keeps looking at Alicia. Maybe we should be watching someone else"
    ],
    "suspects": [
      {
        "id": "s-new-1",
        "name": "Alicia Berenson",
        "role": "Painter and Gabriel’s wife",
        "motive": "Anger or betrayal within her marriage",
        "opportunity": "MAXIMUM",
        "alibi": "No explanation — she stops speaking after Gabriel’s death.",
        "suspicionLevel": 4,
        "clues": [
          "Contradictory timeline statement during interrogation"
        ],
        "isActualCulprit": false,
        "revealNotes": ""
      },
      {
        "id": "s-new-1789801240721",
        "name": "Theo Faber",
        "role": "Psychotherapist treating Alicia",
        "motive": "Jealousy and revenge after discovering his wife's secret",
        "opportunity": "MAXIMUM",
        "alibi": "Presents himself as Alicia’s therapist, concealing his previous connection to the murder.",
        "suspicionLevel": 5,
        "clues": [
          "Initial interrogator observation"
        ],
        "isActualCulprit": true,
        "revealNotes": "Theo discovered Kathy’s affair with Gabriel and became obsessed with confronting them. He disguised himself with a mask, followed Gabriel and Alicia, and confronted them at their home. He restrained Gabriel and threatened him with a gun, demanding that he confess to the affair. When Gabriel refused, Theo left him with Alicia, creating the situation that ultimately led to Gabriel’s death."
      },
      {
        "id": "s-new-1789801363600",
        "name": "Kathy Faber",
        "role": "Theo’s wife",
        "motive": "Her secret creates a direct connection between the characters.",
        "opportunity": "MEDIUM",
        "alibi": "Theo's obliviousness",
        "suspicionLevel": 3,
        "clues": [
          "Initial interrogator observation"
        ],
        "isActualCulprit": false,
        "revealNotes": ""
      }
    ],
    "clues": [
      {
        "id": "c-new-1",
        "title": "Gabriel’s Autopsy Report",
        "summary": "The report establishes that Gabriel died from a gunshot wound.",
        "detailedAnalysis": "The medical evidence confirms the manner of death and becomes part of the investigation into Alicia’s involvement.",
        "pageDiscovered": 64,
        "importance": "CRUCIAL"
      },
      {
        "id": "c-new-1789801571493",
        "title": "Alicia’s Paintings",
        "summary": "Alicia’s paintings contain disturbing imagery connected to her state of mind.",
        "detailedAnalysis": "They provide visual clues about Alicia’s trauma and experiences without directly explaining the murder.",
        "pageDiscovered": 179,
        "importance": "ANOMALOUS"
      },
      {
        "id": "c-new-1789801609651",
        "title": "Theo’s Records",
        "summary": "Theo’s collected notes and case information appear to document his search for the truth.",
        "detailedAnalysis": "They initially make Theo appear like an investigator from outside the crime, hiding how personally connected he actually is.",
        "pageDiscovered": 179,
        "importance": "DECEPTIVE (RED HERRING)"
      }
    ],
    "spoilerEvidence": "Theo Faber is the masked man who confronted Alicia and Gabriel on the night of the murder. After discovering Kathy’s affair with Gabriel, Theo became obsessed with revenge. He broke into their home, restrained Gabriel and forced him to face what he had done. Theo then left Alicia with Gabriel, expecting Gabriel to be killed. Alicia later recognized Theo when he became her therapist and secretly recorded the truth in her diary.",
    "spoilerCulpritReveal": "Theo’s motive was revenge. He wanted Gabriel to suffer for having an affair with Kathy, but his plan ultimately led to Gabriel’s death and Alicia’s silence. When Alicia realized who Theo was, she documented the truth, eventually exposing him.",
    "likes": 1,
    "id": "case-002-1789801824370",
    "readerPollVotes": {
      "solvedBeforeTwist": 0,
      "fooledCompletely": 0,
      "sawItComingMidway": 0,
      "jawDroppedEnding": 0
    }
  },
  {
    "id": "case-014",
    "caseNumber": "001",
    "title": "The Housemaid",
    "author": "Freida McFadden",
    "coverImage": "https://imgs.search.brave.com/Wy7CV-9Cw3aIMDYtE5525byLLeXxeS29XANx3P6mzHM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2E4LzZl/L2I2L2E4NmViNjdk/NzU3ZTU1YjU2NGZk/YzBjYzUzMzk4MmRi/LmpwZw",
    "genre": "Psychological Thriller",
    "dateRead": "June 30, 2026",
    "yearRead": 2026,
    "pages": 336,
    "rating": 5,
    "status": "CLOSED",
    "leadQuote": "“Every day I clean the Winchesters’ beautiful house. I pick up their daughter from school. I cook delicious meals for the whole family. But when I try the door to my tiny attic bedroom, it only locks from the outside.”",
    "summary": "A desperate ex-con lands a live-in maid position with a wealthy, manic family on Long Island, only to discover the attic door locks from the exterior and the pristine husband might not be the saint he appears to be.",
    "reviewText": "I had actually borrowed this book from one of my friends not really willing to commit to the series, but HOLY I have learnt to absolutely love Freida McFadden with this read. This was definitely not an academic read in any way it was mostly just to satisfy my guilty pleasures. The author from the books I've read and knowing how notorious she is for writing popcorn reads this was a perfect combination of her fast paced story telling and simple writing. I could not physically put this book down once I started as you read there is always something to look forward to and to be completely honest that is truly the best things about her books, it didn't feel like I reading. Every chapter i finished somehow made a home in my head and stayed there because I was always making theories. This book, I hold dear to my heart because it gave me the inspiration to create this website so I hope everyone reading also decides to interact and tell me your housemaid theories!",
    "whatIThought": "I was 100% convinced Nina Winchester was an unhinged, sadistic socialite terrorizing her sweet golden-retriever husband Andrew and framing poor innocent Millie.",
    "whatActuallyHappened": "Nina was trapped in a systematic, psychological prison orchestrated by Andrew, who was a serial abuser. Nina intentionally hired Millie—an ex-felon convicted of manslaughter—as a recruited weapon of self-defense.",
    "favoriteMoment": "The sudden perspective shift at the exact midpoint where we see Nina’s actual internal diary entries. The sheer whiplash almost gave me a concussion.",
    "finalVerdict": "An addictive masterclass in psychological manipulation and unreliable domestic dynamics. Do not start this if you have early morning commitments.",
    "paranoiaRating": 5,
    "twistsCount": 3,
    "unreliableNarratorRating": 5,
    "marginaliaNotes": [
      "Note to self: Never accept a live-in job with an attic room."
    ],
    "evidenceBullets": [
      "Attic room door locks exclusively from the hallway",
      "Sudden manic episodes of Nina Winchester over peanut butter",
      "Andrew’s immaculate tailoring and perpetual victim complex",
      "Millie’s sealed parole records and quiet combat instincts"
    ],
    "correctGuess": false,
    "suspects": [
      {
        "id": "s-1",
        "name": "Nina Winchester",
        "role": "The Erratic Wife",
        "motive": "Jealousy, unstable mental state, desperate obsession with controlling the household",
        "opportunity": "MAXIMUM",
        "alibi": "Constantly wandering the estate or causing scenes in town",
        "suspicionLevel": 5,
        "clues": [
          "Scattered trash across pristine kitchen floor intentionally",
          "Warned Millie in a hushed whisper when Andrew was in the driveway"
        ],
        "isActualCulprit": false,
        "revealNotes": "She was not the monster; she was setting a trap for the true monster to save her daughter."
      },
      {
        "id": "s-2",
        "name": "Andrew Winchester",
        "role": "The \"Perfect\" Wealthy Husband",
        "motive": "Pathological control, psychopathic obsession with punishing perceived imperfections in women",
        "opportunity": "MAXIMUM",
        "alibi": "Claims to be working late at the firm while mourning his ruined marriage",
        "suspicionLevel": 2,
        "clues": [
          "Locks the attic door with a heavy brass deadbolt",
          "Enzo the gardener kept signing emergency warnings to Millie about him"
        ],
        "isActualCulprit": true,
        "revealNotes": "The ultimate architect of terror who locked his previous wives and Nina in the attic."
      },
      {
        "id": "s-3",
        "name": "Enzo the Gardener",
        "role": "The Italian Groundskeeper",
        "motive": "Unknown; lingers in the rose bushes observing everything",
        "opportunity": "MEDIUM",
        "alibi": "Working outside in all weather conditions",
        "suspicionLevel": 3,
        "clues": [
          "Told Millie in broken English: \"She is not the danger. Leave now.\"",
          "Refuses to enter the house under any circumstance"
        ],
        "isActualCulprit": false,
        "revealNotes": "Enzo knew Andrew’s true history and was trying to save innocent workers."
      }
    ],
    "clues": [
      {
        "id": "c-1",
        "title": "The Brass Exterior Deadbolt",
        "summary": "A heavy keyed cylinder mounted on the hallway side of the attic door.",
        "detailedAnalysis": "Standard domestic doors do not require exterior padlock bolts unless the intended purpose is involuntary confinement. Millie initially dismissed this as antique architectural quirk—a fatal miscalculation.",
        "pageDiscovered": 42,
        "importance": "CRUCIAL"
      },
      {
        "id": "c-2",
        "title": "The Peanut Butter Smear",
        "summary": "Nina screamed hysterically at Millie for buying chunky instead of creamy.",
        "detailedAnalysis": "On first reading, this paints Nina as an abusive perfectionist. In reality, Nina was provoking a public argument so Andrew wouldn’t suspect she was secretly signaling Millie.",
        "pageDiscovered": 88,
        "importance": "DECEPTIVE (RED HERRING)"
      },
      {
        "id": "c-3",
        "title": "Enzo’s Whispered Warning",
        "summary": "“Pericolo. Bad man in casa.”",
        "detailedAnalysis": "Enzo witnessed the previous housekeeper being dragged away in the middle of the night. He left garden shears deliberately near the service door.",
        "pageDiscovered": 114,
        "importance": "CONFIRMED EVIDENCE"
      }
    ],
    "spoilerEvidence": "CLASSIFIED ARCHIVE SUMMARY:\nThe climax occurs when Andrew traps Millie inside the soundproofed attic, intending to starve and break her as he did with Nina. However, Nina had deliberately vetted Millie's criminal background, knowing Millie killed a prior abusive partner in self-defense. Millie turns the tables, locking Andrew in his own torture chamber and administering poetic justice. Nina and Millie form an unspoken sisterhood of retribution, and Millie moves on to her next cleaning assignment... with a very specific clientele.",
    "readingFormat": "Paperback",
    "recommendedFor": "Fans of gripping domestic mystery & psychological suspense",
    "tropes": [
      "Unreliable Narrator",
      "Domestic Gaslighting",
      "Multiple POVs",
      "Locked Room"
    ],
    "atmosphereRating": 5,
    "pacingRating": 5,
    "twistExecutionRating": 5,
    "spoilerCulpritReveal": "",
    "dateStarted": "",
    "dateFinished": "",
    "likes": 1,
    "readerPollVotes": {
      "solvedBeforeTwist": 0,
      "fooledCompletely": 0,
      "sawItComingMidway": 0,
      "jawDroppedEnding": 0
    }
  }
];

export const INITIAL_NON_FICTION_BOOKS: NonFictionBook[] = [
  {
    "catalogNumber": "NF-002",
    "title": "Dark Matter",
    "author": "Blake Crouch",
    "genre": "Sci-Fi & Speculative",
    "coverImage": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    "rating": 5,
    "pages": 398,
    "yearRead": 2025,
    "dateStarted": "Nov 11, 2025",
    "dateFinished": "Nov 23, 2025",
    "dateLogged": "Sep 19, 2026",
    "oneSentenceTakeaway": "A fast-moving exploration of how different choices can create completely different versions of a life and what makes one of them worth fighting for.",
    "tagline": "A fast-moving exploration of how different choices can create completely different versions of a life and what makes one of them worth fighting for.",
    "summary": "This book is mind numbingly perfect, I'm in no way a sci-fi reader but this book was so well written, it had such a great, unique plot and is probably my most memorable read. Jason Dessen is abducted and wakes up in a reality where his life has completely changed. His wife and son are gone, while an alternate version of Jason has become a brilliant physicist and achieved something impossible. Jason must navigate alternate realities to find his way back to the family and life he remembers.",
    "reviewText": "Dark Matter takes a huge sci-fi concept and makes it surprisingly personal. The multiverse isn't just used as a way to create increasingly complicated worlds; it becomes a way of exploring regret, ambition, identity, and the choices that shape a person's life.\n\nThe science is definitely a major part of the appeal, but the emotional side is what gives the story weight. Jason's desperation to get back to Daniela and Charlie keeps the story grounded even when the plot becomes increasingly impossible.\n\nI also liked how the book plays with the idea of meeting versions of yourself who made completely different decisions. It turns the familiar “what if I had chosen differently?” question into an actual reality. The pacing is extremely quick, with Crouch constantly throwing another problem or revelation into the story, which makes it very easy to keep reading.\n\nWhat stayed with me most is the question underneath all the science: if there are countless versions of your life, how do you decide which one is actually yours?",
    "fullReview": "Dark Matter takes a huge sci-fi concept and makes it surprisingly personal. The multiverse isn't just used as a way to create increasingly complicated worlds; it becomes a way of exploring regret, ambition, identity, and the choices that shape a person's life.\n\nThe science is definitely a major part of the appeal, but the emotional side is what gives the story weight. Jason's desperation to get back to Daniela and Charlie keeps the story grounded even when the plot becomes increasingly impossible.\n\nI also liked how the book plays with the idea of meeting versions of yourself who made completely different decisions. It turns the familiar “what if I had chosen differently?” question into an actual reality. The pacing is extremely quick, with Crouch constantly throwing another problem or revelation into the story, which makes it very easy to keep reading.\n\nWhat stayed with me most is the question underneath all the science: if there are countless versions of your life, how do you decide which one is actually yours?",
    "favoriteQuote": "“Are you happy with your life?”",
    "favoriteQuotes": [
      "“Are you happy with your life?”"
    ],
    "mindsetRatings": {
      "readability": 4,
      "actionability": 4,
      "intellectualImpact": 5,
      "originality": 5
    },
    "keyTakeaways": [
      "Your choices don't just change your circumstances; they shape who you become.",
      "An imagined alternative life can look perfect from a distance without actually being better."
    ],
    "actionItems": [
      "Pay attention to the choices you are making now instead of constantly comparing them to hypothetical alternatives.",
      "Don't confuse achievement with fulfilment."
    ],
    "tags": [
      "Mental Models",
      "Multiverse Theory",
      "Morality & Ethics",
      "Existential Reflections",
      "Systems Thinking",
      "Alternate Universes",
      "Identity & Self"
    ],
    "themes": [
      "Mental Models",
      "Multiverse Theory",
      "Morality & Ethics",
      "Existential Reflections",
      "Systems Thinking",
      "Alternate Universes",
      "Identity & Self"
    ],
    "tropes": [
      "Mental Models",
      "Multiverse Theory",
      "Morality & Ethics",
      "Existential Reflections",
      "Systems Thinking",
      "Alternate Universes",
      "Identity & Self"
    ],
    "notesScratchpad": [
      "Someone has found a way to manipulate alternate realities, and Jason’s abduction is connected to the existence of another version of himself. Key Questions: Who caused Jason’s abduction? Why does another Jason exist? Can Jason return home? Emerging Hypothesis: The real question is whether Jason’s original life is worth fighting for.",
      "The real question is whether Jason’s original life is worth fighting for."
    ],
    "likes": 1,
    "coverUrl": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    "id": "nf-nf-002-1789808286142"
  },
  {
    "id": "nf-004",
    "catalogNumber": "NF-004",
    "title": "Project Hail Mary",
    "author": "Andy Weir",
    "coverImage": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "genre": "Sci-Fi & Speculative",
    "dateStarted": "Jan 22, 2026",
    "dateFinished": "Jan 27, 2026",
    "dateLogged": "Jan 27, 2026",
    "yearRead": 2026,
    "pages": 496,
    "rating": 5,
    "status": "COMPLETED",
    "readingFormat": "Audiobook",
    "oneSentenceTakeaway": "A thrilling tale of scientific problem-solving, interstellar resilience, and an unexpected cosmic friendship.",
    "summary": "Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity from a star-dimming microorganism. As his memories slowly return, he must use science, humor, and an alien ally named Rocky to survive.",
    "reviewText": "I HAD to read this book after watching the movie because what a masterpiece that movie is. The emotional rollercoaster I went through watching is unmatched, I don't think any thing else will get such a explosive reaction out of me.While the book was different to the movie it absolutely did not disappoint. It was so witty and humorious I didn't feel like I was reading sci-fi at all. While not a murder mystery, this has all the investigative thrills of a locked-room paradox set in deep space. Ryland Grace figuring out interstellar physics from first principles is pure joy. Ray Porter's narration in the audiobook is an absolute 10/10.",
    "favoriteQuote": "“Human beings have a remarkable ability to accept the abnormal and make it normal.”",
    "quoteContext": "Chapter 11: Astrophage Experiments",
    "keyTakeaways": [
      "Scientific methodology and empirical iteration can solve seemingly insurmountable crises.",
      "Cooperation across radical differences yields solutions no individual could achieve alone.",
      "Optimism and humor are survival tools, not mere emotional luxuries."
    ],
    "actionItems": [
      "Approach complex coding and analytical problems through scientific first principles.",
      "Break intimidating technical challenges into small, testable hypotheses."
    ],
    "mindsetRatings": {
      "readability": 5,
      "actionability": 3,
      "intellectualImpact": 4,
      "originality": 5
    },
    "tags": [
      "Sci-Fi",
      "Science",
      "Space Exploration",
      "Friendship",
      "Problem Solving"
    ],
    "readerReflections": "Rocky is one of the best characters in all of modern fiction. Fist my bump! Amaze!",
    "recommendedTo": "Fans of *The Martian*, interstellar science fiction, and smart, heartwarming problem-solving.",
    "likes": 389,
    "notesScratchpad": [
      "Amaze! Amaze! Amaze!"
    ],
    "coverUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "tagline": "A thrilling tale of scientific problem-solving, interstellar resilience, and an unexpected cosmic friendship.",
    "fullReview": "I HAD to read this book after watching the movie because what a masterpiece that movie is. The emotional rollercoaster I went through watching is unmatched, I don't think any thing else will get such a explosive reaction out of me.While the book was different to the movie it absolutely did not disappoint. It was so witty and humorious I didn't feel like I was reading sci-fi at all. While not a murder mystery, this has all the investigative thrills of a locked-room paradox set in deep space. Ryland Grace figuring out interstellar physics from first principles is pure joy. Ray Porter's narration in the audiobook is an absolute 10/10.",
    "favoriteQuotes": [
      "“Human beings have a remarkable ability to accept the abnormal and make it normal.”"
    ],
    "themes": [
      "Sci-Fi",
      "Science",
      "Space Exploration",
      "Friendship",
      "Problem Solving"
    ],
    "tropes": [
      "Sci-Fi",
      "Science",
      "Space Exploration",
      "Friendship",
      "Problem Solving"
    ]
  }
];

export const INITIAL_ABOUT_CONFIG: AboutConfig = {
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

