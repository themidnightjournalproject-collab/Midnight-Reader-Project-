import React, { useState, useEffect } from 'react';

// Map of canonical book titles, variations, and common typo spellings to verified local public covers
export const KNOWN_LOCAL_COVERS: Record<string, string> = {
  // Case #004: The Housemaid Is Watching
  'the housemaid is watching': '/covers/the-housemaid-is-watching.jpg',
  'housemaid is watching': '/covers/the-housemaid-is-watching.jpg',

  // Case #003: The Housemaid's Secret (including 'housmaid' typo in case archive)
  "the housemaid's secret": '/covers/the-housmaid-s-secret.jpg',
  'the housemaids secret': '/covers/the-housmaid-s-secret.jpg',
  "the housmaid's secret": '/covers/the-housmaid-s-secret.jpg',
  'the housmaids secret': '/covers/the-housmaid-s-secret.jpg',
  "housemaid's secret": '/covers/the-housmaid-s-secret.jpg',
  'housemaids secret': '/covers/the-housmaid-s-secret.jpg',
  "housmaid's secret": '/covers/the-housmaid-s-secret.jpg',
  'housmaids secret': '/covers/the-housmaid-s-secret.jpg',

  // Case #001: The Housemaid
  'the housemaid': '/covers/the-housemaid.jpg',
  'housemaid': '/covers/the-housemaid.jpg',

  // Case #002: The Silent Patient
  'the silent patient': '/covers/silent-patient.jpg',
  'silent patient': '/covers/silent-patient.jpg',

  // Case #005: The Last Word
  'the last word': '/covers/the-last-word.jpg',
  'last word': '/covers/the-last-word.jpg',

  // Case #006: Listen For The Lie
  'listen for the lie': '/covers/listen-for-the-lie.jpg',
  'listen to the lie': '/covers/listen-for-the-lie.jpg',

  // Non-fiction / Library & Milestone Covers
  '13 reasons why': '/covers/13-reasons-why.jpg',
  'thirteen reasons why': '/covers/13-reasons-why.jpg',
  'tuesdays with morrie': '/covers/tuesdays-with-morrie.jpg',
  'dark matter': '/covers/dark-matter.jpg',
  'project hail mary': '/covers/project-hail-mary.jpg',
  'gray after dark': '/covers/gray-after-dark.jpg',
  'grey after dark': '/covers/gray-after-dark.jpg',
};

/**
 * Finds a matching local cover path for a book title if available.
 * Uses exact match first, then longest matching key descending to prevent substring collisions.
 */
export function getLocalCoverForTitle(title?: string): string | null {
  if (!title) return null;
  const normalized = title.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');

  // 1. Exact match check
  for (const [key, path] of Object.entries(KNOWN_LOCAL_COVERS)) {
    const normKey = key.replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');
    if (normalized === normKey) {
      return path;
    }
  }

  // 2. Longest-key match to prevent "the housemaid" colliding with "the housemaid is watching"
  const sortedEntries = Object.entries(KNOWN_LOCAL_COVERS).sort((a, b) => b[0].length - a[0].length);
  for (const [key, path] of sortedEntries) {
    const normKey = key.replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');
    if (normalized.includes(normKey) || (normKey.length > 8 && normKey.includes(normalized))) {
      return path;
    }
  }

  return null;
}

/**
 * Generates an elegant noir / crime dossier SVG canvas as a bulletproof fallback data URI
 */
export function generateDossierCoverSvg(title = 'Case File', author = 'The Midnight Reader', genre = 'Mystery'): string {
  const safeTitle = (title || 'Case File').replace(/[<>&"']/g, '');
  const safeAuthor = (author || 'Classified').replace(/[<>&"']/g, '');
  const safeGenre = (genre || 'Evidence Dossier').replace(/[<>&"']/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141414"/>
        <stop offset="50%" stop-color="#1f1d1b"/>
        <stop offset="100%" stop-color="#0d0d0d"/>
      </linearGradient>
      <pattern id="grain" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#ffffff" fill-opacity="0.04"/>
        <circle cx="12" cy="14" r="1" fill="#ffffff" fill-opacity="0.03"/>
        <circle cx="18" cy="6" r="0.8" fill="#ffffff" fill-opacity="0.03"/>
      </pattern>
    </defs>
    <!-- Background -->
    <rect width="400" height="600" fill="url(#bgGrad)"/>
    <rect width="400" height="600" fill="url(#grain)"/>
    
    <!-- Outer Noir Border -->
    <rect x="18" y="18" width="364" height="564" fill="none" stroke="#e8e2d8" stroke-width="2" stroke-opacity="0.4"/>
    <rect x="24" y="24" width="352" height="552" fill="none" stroke="#8b0000" stroke-width="1.5" stroke-opacity="0.75"/>
    
    <!-- Header Stamp Badge -->
    <rect x="36" y="44" width="328" height="28" fill="#8b0000"/>
    <text x="200" y="63" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="3">
      ★ CLASSIFIED DOSSIER ARCHIVE ★
    </text>
    
    <!-- Top Genre Tag -->
    <text x="200" y="110" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#c49a45" text-anchor="middle" letter-spacing="2">
      ${safeGenre.toUpperCase()}
    </text>
    <line x1="80" y1="125" x2="320" y2="125" stroke="#e8e2d8" stroke-opacity="0.25" stroke-width="1"/>

    <!-- Central Fingerprint / Crime Emblem -->
    <g transform="translate(160, 160) scale(0.8)" opacity="0.15" stroke="#ffffff" stroke-width="2" fill="none">
      <circle cx="50" cy="50" r="45"/>
      <circle cx="50" cy="50" r="35"/>
      <circle cx="50" cy="50" r="25"/>
      <circle cx="50" cy="50" r="15"/>
      <circle cx="50" cy="50" r="5"/>
    </g>

    <!-- Book Title (wrapped) -->
    <g>
      <text x="200" y="270" font-family="Georgia, serif" font-size="24" font-weight="bold" fill="#f5f2ed" text-anchor="middle">
        ${safeTitle.length > 24 ? safeTitle.substring(0, 22) + '...' : safeTitle}
      </text>
    </g>

    <line x1="120" y1="310" x2="280" y2="310" stroke="#8b0000" stroke-width="2"/>

    <!-- Author Name -->
    <text x="200" y="345" font-family="Georgia, serif" font-size="13" font-style="italic" fill="#d1ccc0" text-anchor="middle">
      by ${safeAuthor}
    </text>

    <!-- Red Evidence Tape Stamp -->
    <g transform="rotate(-6 200 460)">
      <rect x="75" y="435" width="250" height="34" fill="#faf7f0" stroke="#8b0000" stroke-width="2"/>
      <text x="200" y="457" font-family="Courier, monospace" font-size="13" font-weight="900" fill="#8b0000" text-anchor="middle" letter-spacing="2">
        EVIDENCE FILE #VERIFIED
      </text>
    </g>

    <!-- Bottom Archive Ledger -->
    <text x="200" y="545" font-family="Courier, monospace" font-size="9" fill="#8a857a" text-anchor="middle" letter-spacing="1">
      THE MIDNIGHT READER • SPECIAL COLLECTIONS
    </text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Returns an immediate reliable URL for a given coverImage input and title.
 * For any known book in the catalog, always prioritizes verified local assets.
 */
export function resolveBookCoverUrl(inputUrl?: string | null, title?: string, author?: string, genre?: string): string {
  const localMatch = getLocalCoverForTitle(title);

  // If we have a verified local high-res cover for this book, always prioritize it
  // over external links, expired search urls, or stale base64 strings
  if (localMatch) {
    return localMatch;
  }

  // If no local match was found (e.g. user-created novel):
  if (inputUrl && typeof inputUrl === 'string' && inputUrl.trim().length > 0) {
    const trimmed = inputUrl.trim();
    // Normalize relative paths
    if (trimmed.startsWith('covers/')) {
      return '/' + trimmed;
    }
    // Avoid returning known broken search engine query URLs
    if (trimmed.includes('imgs.search.brave.com')) {
      return generateDossierCoverSvg(title, author, genre);
    }
    return trimmed;
  }

  // Default to synthesized SVG cover
  return generateDossierCoverSvg(title, author, genre);
}

interface BookCoverImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  title?: string;
  author?: string;
  genre?: string;
  className?: string;
  alt?: string;
}

export const BookCoverImage: React.FC<BookCoverImageProps> = ({
  src,
  title = '',
  author = '',
  genre = '',
  className = '',
  alt = 'Book Cover',
  ...rest
}) => {
  const initialResolved = resolveBookCoverUrl(src, title, author, genre);
  const [currentSrc, setCurrentSrc] = useState<string>(initialResolved);
  const [hasTriedLocal, setHasTriedLocal] = useState<boolean>(false);
  const [hasTriedSvg, setHasTriedSvg] = useState<boolean>(false);

  useEffect(() => {
    const nextUrl = resolveBookCoverUrl(src, title, author, genre);
    setCurrentSrc(nextUrl);
    setHasTriedLocal(false);
    setHasTriedSvg(false);
  }, [src, title, author, genre]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgEl = e.currentTarget;

    // Stage 1: Try local cover file if not yet attempted
    if (!hasTriedLocal) {
      const local = getLocalCoverForTitle(title);
      if (local && local !== currentSrc) {
        setHasTriedLocal(true);
        setCurrentSrc(local);
        imgEl.src = local;
        return;
      }
    }

    // Stage 2: Bulletproof SVG fallback guaranteed to render on any device/offline
    if (!hasTriedSvg) {
      setHasTriedSvg(true);
      const svg = generateDossierCoverSvg(title, author, genre);
      setCurrentSrc(svg);
      imgEl.src = svg;
      imgEl.onerror = null; // Prevent recursion
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt || title || 'Book Cover'}
      onError={handleError}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      {...rest}
    />
  );
};
