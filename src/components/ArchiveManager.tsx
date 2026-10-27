import React, { useState, useMemo } from 'react';
import { useJournal } from '../context/JournalContext';
import { Genre, CaseStatus, BookReview } from '../types';
import { 
  FolderLock, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  PlusCircle, 
  BookOpen, 
  Heart, 
  SlidersHorizontal,
  ArrowUpDown,
  Download
} from 'lucide-react';

const GENRES: (Genre | 'All')[] = [
  'All',
  'Psychological Thriller',
  'Murder Mystery',
  'Domestic Thriller',
  'Locked Room Mystery',
  'Legal Thriller',
  'Gothic Thriller',
  'Crime & Police Procedural',
];

const STATUSES: (CaseStatus | 'All')[] = [
  'All',
  'CLOSED',
  'UNDER INVESTIGATION',
  'COLD CASE',
  'HIGH CONFIDENCE GUESS',
];

export const ArchiveManager: React.FC = () => {
  const { 
    reviews, 
    setEditingReview, 
    setSelectedReview, 
    deleteReview, 
    duplicateReview,
    setIsNewReviewModalOpen,
    setActiveView,
    postLikes,
    witnessComments,
    isAdminUnlocked,
    setIsAdminModalOpen
  } = useJournal();

  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'case-desc' | 'case-asc' | 'rating-desc' | 'pages-desc' | 'likes-desc' | 'title'>('case-desc');

  const filteredAndSorted = useMemo(() => {
    return reviews
      .filter((r) => {
        const matchesSearch = 
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.author.toLowerCase().includes(search.toLowerCase()) ||
          r.caseNumber.includes(search);
        const matchesGenre = selectedGenre === 'All' || r.genre === selectedGenre;
        const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
        return matchesSearch && matchesGenre && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'case-desc') return parseInt(b.caseNumber) - parseInt(a.caseNumber);
        if (sortBy === 'case-asc') return parseInt(a.caseNumber) - parseInt(b.caseNumber);
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        if (sortBy === 'pages-desc') return b.pages - a.pages;
        if (sortBy === 'likes-desc') {
          const likesA = postLikes[a.id] ?? a.likes ?? 0;
          const likesB = postLikes[b.id] ?? b.likes ?? 0;
          return likesB - likesA;
        }
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [reviews, search, selectedGenre, selectedStatus, sortBy, postLikes]);

  const totalPages = reviews.reduce((acc, r) => acc + (r.pages || 0), 0);
  const totalSuspects = reviews.reduce((acc, r) => acc + (r.suspects?.length || 0), 0);
  const totalLikes = Object.values(postLikes).reduce((acc: number, l: number) => acc + (Number(l) || 0), 0);

  const handleDelete = (review: BookReview) => {
    if (window.confirm(`Are you sure you want to permanently delete Case #${review.caseNumber}: "${review.title}" from your archive?`)) {
      deleteReview(review.id);
    }
  };

  if (!isAdminUnlocked) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-[#f5f2ed] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="w-12 h-12 bg-black text-[#f5f2ed] mx-auto flex items-center justify-center border-2 border-[#8b0000]">
            <FolderLock size={24} />
          </div>
          <span className="font-mono text-xs uppercase font-bold text-[#8b0000] tracking-widest block">
            RESTRICTED SECTION • EVIDENCE LOCKER
          </span>
          <h2 className="font-serif text-3xl font-black uppercase text-[#1a1a1a]">
            CHIEF INVESTIGATOR CLEARANCE REQUIRED
          </h2>
          <p className="font-serif text-sm italic text-[#4a4a4a] max-w-md mx-auto">
            This management desk is reserved for the website editor to modify case dossiers, archive books, and manage records. Public visitors can browse the open case files freely.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveView('casefiles')}
              className="px-5 py-2 border-2 border-black font-sans text-xs font-bold uppercase hover:bg-white transition-colors"
            >
              Browse Public Case Files
            </button>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-5 py-2 bg-[#8b0000] hover:bg-black text-white font-sans text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors"
            >
              Unlock Editor Desk
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Editorial Header */}
      <header className="border-b-4 border-black pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-[#8b0000]">
            <FolderLock size={15} />
            <span>CENTRAL ARCHIVE & DOSSIER LOCKER</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('backup-sync')}
              className="flex items-center gap-1.5 bg-white hover:bg-[#faf7f2] text-[#1a1a1a] border-2 border-black px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              <Download size={13} />
              <span>EXPORT / REDEPLOY SYNC</span>
            </button>

            <button
              onClick={() => setIsNewReviewModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-black text-white px-3.5 py-1.5 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              <PlusCircle size={14} />
              <span>+ FILE NEW CASE</span>
            </button>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#1a1a1a] tracking-tight font-serif">
          Edit Old Books & Case Dossiers
        </h1>

        <p className="font-serif italic text-base text-[#4a4a4a] max-w-3xl leading-relaxed">
          Manage your complete thriller archive in one central locker. Click <strong className="text-[#8b0000]">"EDIT DOSSIER"</strong> on any book below to modify reviews, rewrite suspects, tweak ratings, or adjust classified spoilers.
        </p>

        {/* Quick Archive Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-sans text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
              TOTAL ARCHIVED CASES
            </span>
            <span className="font-mono text-2xl font-black text-[#1a1a1a]">
              {reviews.length} Files
            </span>
          </div>

          <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-sans text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
              TOTAL PAGES LOGGED
            </span>
            <span className="font-mono text-2xl font-black text-[#8b0000]">
              {totalPages.toLocaleString()}
            </span>
          </div>

          <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-sans text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
              SUSPECTS ACCUSED
            </span>
            <span className="font-mono text-2xl font-black text-[#1a1a1a]">
              {totalSuspects} Persons
            </span>
          </div>

          <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-sans text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
              READER ENDORSEMENTS
            </span>
            <span className="font-mono text-2xl font-black text-[#8b0000] flex items-center gap-1.5">
              <Heart size={18} className="fill-[#8b0000]" />
              <span>{totalLikes}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Filter & Search Bar */}
      <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, or Case #..."
              className="w-full pl-9 pr-3 py-2 border border-black text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black bg-[#faf9f5]"
            />
          </div>

          {/* Genre Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value as any)}
              className="w-full py-2 px-3 border border-black text-xs font-sans bg-[#faf9f5]"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>Genre: {g}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full py-2 px-3 border border-black text-xs font-sans bg-[#faf9f5]"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>Status: {st}</option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-1 bg-[#faf9f5] border border-black px-2 py-1.5">
              <ArrowUpDown size={13} className="text-[#737373]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-transparent text-xs font-sans focus:outline-none"
              >
                <option value="case-desc">Case # (Newest First)</option>
                <option value="case-asc">Case # (Oldest First)</option>
                <option value="rating-desc">Highest Rating (★ 5.0)</option>
                <option value="pages-desc">Longest Page Count</option>
                <option value="likes-desc">Most Reader Likes</option>
                <option value="title">Book Title (A-Z)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Filter status count */}
        <div className="flex items-center justify-between text-xs font-sans text-[#737373] pt-1 border-t border-black border-opacity-10">
          <span>Showing <strong>{filteredAndSorted.length}</strong> of {reviews.length} case files</span>
          {(search || selectedGenre !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedGenre('All');
                setSelectedStatus('All');
              }}
              className="text-[#8b0000] font-bold underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Book Dossier Archive List */}
      <div className="space-y-4">
        {filteredAndSorted.length === 0 ? (
          <div className="bg-white border-2 border-black p-12 text-center space-y-3">
            <FolderLock size={36} className="mx-auto text-[#737373]" />
            <h3 className="font-serif text-xl font-bold uppercase text-[#1a1a1a]">
              No Case Files Match Your Criteria
            </h3>
            <p className="font-serif italic text-sm text-[#737373]">
              Try adjusting your search terms or filters above.
            </p>
          </div>
        ) : (
          filteredAndSorted.map((review) => {
            const likes = postLikes[review.id] ?? (review.likes || 0);
            const comments = witnessComments[review.id] || review.witnessComments || [];

            return (
              <div
                key={review.id}
                className="bg-white border-2 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-[#8b0000] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                
                {/* Book Thumbnail + Info */}
                <div className="flex items-start gap-4 flex-1">
                  
                  {/* Book Cover */}
                  <div className="relative flex-shrink-0 w-16 sm:w-20 h-24 sm:h-28 bg-[#e8e2d8] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                    <img
                      src={review.coverImage}
                      alt={review.title}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 bg-black text-white font-mono text-[8px] px-1 font-bold">
                      #{review.caseNumber}
                    </span>
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-black text-white text-[10px] font-sans font-bold uppercase px-2 py-0.5 tracking-wider">
                        CASE #{review.caseNumber}
                      </span>
                      <span className="font-sans text-xs text-[#8b0000] font-bold uppercase">
                        {review.genre}
                      </span>
                      <span className="text-black opacity-30">•</span>
                      <span className="font-sans text-xs font-bold text-[#737373]">
                        {review.dateRead}
                      </span>
                      <span className="text-black opacity-30">•</span>
                      <span className="bg-[#e8e2d8] text-[#1a1a1a] text-[10px] font-sans font-bold uppercase px-1.5 py-0.5 border border-black border-opacity-30">
                        {review.status}
                      </span>
                    </div>

                    <h3 
                      onClick={() => {
                        setSelectedReview(review);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xl sm:text-2xl font-black uppercase font-serif text-[#1a1a1a] hover:text-[#8b0000] cursor-pointer transition-colors leading-snug truncate"
                    >
                      {review.title}
                    </h3>

                    <p className="font-serif italic text-sm text-[#4a4a4a]">
                      by {review.author} • {review.pages} Pages • <span className="text-[#8b0000] font-bold">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    </p>

                    {/* Suspects & Engagement summary badges */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-sans font-bold text-[#737373] uppercase">
                      <span>{review.suspects?.length || 0} Suspects</span>
                      <span>•</span>
                      <span>{review.clues?.length || 0} Clues</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#8b0000]">
                        <Heart size={11} className="fill-[#8b0000]" />
                        <span>{likes} Likes</span>
                      </span>
                      <span>•</span>
                      <span>{comments.length} Comments</span>
                    </div>
                  </div>

                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-black border-opacity-10">
                  
                  {/* Primary Edit Button */}
                  <button
                    type="button"
                    onClick={() => setEditingReview(review)}
                    className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-black text-white px-3.5 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    title="Open full editor for this case dossier"
                  >
                    <Edit3 size={13} />
                    <span>EDIT DOSSIER</span>
                  </button>

                  {/* View Full Case File */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReview(review);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1 bg-white hover:bg-[#faf7f2] text-[#1a1a1a] border border-black px-2.5 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    title="Read full case dossier"
                  >
                    <Eye size={13} />
                    <span className="hidden sm:inline">View</span>
                  </button>

                  {/* Duplicate / Clone */}
                  <button
                    type="button"
                    onClick={() => duplicateReview(review.id)}
                    className="flex items-center gap-1 bg-white hover:bg-[#faf7f2] text-[#1a1a1a] border border-black px-2.5 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    title="Duplicate as new case file template"
                  >
                    <Copy size={13} />
                    <span className="hidden sm:inline">Clone</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(review)}
                    className="flex items-center gap-1 bg-white hover:bg-[#ffefef] text-[#8b0000] border border-[#8b0000] px-2.5 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all hover:bg-red-700 hover:text-white"
                    title="Delete this case file"
                  >
                    <Trash2 size={13} />
                  </button>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
