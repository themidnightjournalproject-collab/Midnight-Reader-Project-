import React, { useState, useEffect, useMemo } from 'react';
import { useJournal } from '../../context/JournalContext';
import { BookAlbumItem } from '../../types';
import { BookCoverImage } from '../common/BookCoverImage';
import {
  X,
  Layers,
  Search,
  Check,
  ArrowUp,
  ArrowDown,
  Trash2,
  Loader2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

interface CatalogBookOption {
  kind: 'thriller' | 'non-fiction';
  id: string;
  key: string;
  code: string;
  title: string;
  author: string;
  genre: string;
  coverImage: string;
}

export const AlbumEditorModal: React.FC = () => {
  const {
    isAlbumEditorOpen,
    setIsAlbumEditorOpen,
    editingAlbum,
    setEditingAlbum,
    reviews,
    nonFictionBooks,
    saveBookAlbum,
    deleteBookAlbum,
    setViewingAlbumId,
  } = useJournal();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [orderedItems, setOrderedItems] = useState<BookAlbumItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<'all' | 'thriller' | 'non-fiction'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allBooks: CatalogBookOption[] = useMemo(() => {
    const thrillerOpts: CatalogBookOption[] = reviews.map((r) => ({
      kind: 'thriller',
      id: r.id,
      key: `thriller:${r.id}`,
      code: `CASE #${r.caseNumber}`,
      title: r.title,
      author: r.author,
      genre: r.genre,
      coverImage: r.coverImage,
    }));
    const nfOpts: CatalogBookOption[] = nonFictionBooks.map((b) => ({
      kind: 'non-fiction',
      id: b.id,
      key: `non-fiction:${b.id}`,
      code: b.catalogNumber,
      title: b.title,
      author: b.author,
      genre: b.genre,
      coverImage: b.coverImage || b.coverUrl || '',
    }));
    return [...thrillerOpts, ...nfOpts];
  }, [reviews, nonFictionBooks]);

  const bookLookup = useMemo(() => {
    const map = new Map<string, CatalogBookOption>();
    allBooks.forEach((b) => map.set(b.key, b));
    return map;
  }, [allBooks]);

  useEffect(() => {
    if (!isAlbumEditorOpen) return;
    setErrorMessage(null);
    setSearchQuery('');
    setKindFilter('all');

    if (editingAlbum) {
      setName(editingAlbum.name || '');
      setDescription(editingAlbum.description || '');
      setOrderedItems([...(editingAlbum.items || [])]);
    } else {
      setName('');
      setDescription('');
      setOrderedItems([]);
    }
  }, [isAlbumEditorOpen, editingAlbum]);

  if (!isAlbumEditorOpen) return null;

  const selectedKeys = new Map<string, number>();
  orderedItems.forEach((it, idx) => selectedKeys.set(`${it.kind}:${it.id}`, idx + 1));

  const filteredCatalog = allBooks.filter((b) => {
    if (kindFilter !== 'all' && b.kind !== kindFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genre.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q)
    );
  });

  const handleToggleBook = (opt: CatalogBookOption) => {
    const exists = selectedKeys.has(opt.key);
    if (exists) {
      setOrderedItems((prev) =>
        prev.filter((it) => !(it.kind === opt.kind && it.id === opt.id))
      );
    } else {
      setOrderedItems((prev) => [...prev, { kind: opt.kind, id: opt.id }]);
    }
  };

  const handleMoveItem = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= orderedItems.length) return;
    setOrderedItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setOrderedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClose = () => {
    setIsAlbumEditorOpen(false);
    setEditingAlbum(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMessage('Please enter a name for your book album.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const saved = await saveBookAlbum({
        id: editingAlbum?.id,
        name: cleanName,
        description: description.trim(),
        items: orderedItems,
      });
      setIsAlbumEditorOpen(false);
      setEditingAlbum(null);
      setViewingAlbumId(saved.id);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save album. Please retry.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingAlbum) return;
    if (
      window.confirm(
        `Delete album "${editingAlbum.name}"? All books inside will stay in your library.`
      )
    ) {
      setIsSaving(true);
      setErrorMessage(null);
      try {
        await deleteBookAlbum(editingAlbum.id);
        handleClose();
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to delete album.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-[#fcfaf2] border-4 border-black w-full max-w-5xl max-h-[94vh] overflow-y-auto p-5 sm:p-7 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-[#8b0000] text-white p-2 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Layers size={20} />
            </div>
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-bold tracking-widest block">
                LIBRARY BOOK ALBUM ORGANIZER
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-serif uppercase text-[#1a1a1a] leading-tight">
                {editingAlbum ? `Edit Album: ${editingAlbum.name}` : 'Create New Book Album'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 bg-white hover:bg-[#8b0000] hover:text-white border-2 border-black text-black font-bold cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 bg-[#8b0000]/10 border-2 border-[#8b0000] p-3 text-xs text-[#8b0000] flex items-center justify-between font-sans">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="font-bold underline uppercase ml-2 text-[10px]"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 font-sans text-xs">
          {/* Album Name & Optional Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <label className="block font-bold uppercase text-[10px] text-[#8b0000] mb-1">
                Album Name * (e.g. Series Name or Custom Shelf)
              </label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Housemaid Trilogy, Freida McFadden, Fall Reads..."
                className="w-full bg-[#fcfaf2] border-2 border-black p-2.5 text-sm font-serif font-bold text-[#1a1a1a] focus:outline-none focus:border-[#8b0000]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-[10px] text-[#1a1a1a] mb-1">
                Description / Curator Note (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Complete Millie Calloway series in reading order..."
                className="w-full bg-[#fcfaf2] border-2 border-black p-2.5 text-xs font-serif text-[#1a1a1a] focus:outline-none focus:border-[#8b0000]"
              />
            </div>
          </div>

          {/* Two-Column Picker + Reading Order Arranger */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Select Existing Books */}
            <div className="lg:col-span-7 bg-white border-2 border-black p-4 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black pb-2.5 mb-3">
                <h3 className="font-bold uppercase tracking-wider text-xs text-[#1a1a1a]">
                  1. Select Existing Books ({allBooks.length})
                </h3>
                <div className="flex items-center gap-1">
                  {(['all', 'thriller', 'non-fiction'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKindFilter(k)}
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase border cursor-pointer ${
                        kindFilter === k
                          ? 'bg-black text-white border-black'
                          : 'bg-[#fcfaf2] text-[#4a4a4a] border-black/30 hover:border-black'
                      }`}
                    >
                      {k === 'all' ? 'All' : k === 'thriller' ? 'Case Files' : 'Off the Record'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mb-3">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search library by title, author, genre, or case #..."
                  className="w-full bg-[#fcfaf2] border border-black pl-8 pr-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredCatalog.length === 0 ? (
                  <p className="text-xs font-serif italic text-gray-500 py-6 text-center">
                    No matching books found in your library.
                  </p>
                ) : (
                  filteredCatalog.map((opt) => {
                    const orderNum = selectedKeys.get(opt.key);
                    const isSelected = orderNum !== undefined;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleToggleBook(opt)}
                        className={`w-full flex items-center justify-between gap-3 p-2 border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#fffef7] border-2 border-[#8b0000] shadow-[2px_2px_0px_0px_rgba(139,0,0,0.5)]'
                            : 'bg-[#fcfaf2] border border-black/40 hover:border-black'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className={`w-5 h-5 shrink-0 border flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#8b0000] border-[#8b0000] text-white'
                                : 'bg-white border-black'
                            }`}
                          >
                            {isSelected && <Check size={12} />}
                          </div>
                          <div className="w-9 h-13 shrink-0 border border-black bg-black overflow-hidden">
                            <BookCoverImage
                              src={opt.coverImage}
                              title={opt.title}
                              author={opt.author}
                              genre={opt.genre}
                              alt={opt.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-mono text-[9px] font-bold uppercase text-[#8b0000] block">
                              {opt.code} • {opt.genre}
                            </span>
                            <span className="font-serif font-bold text-xs text-[#1a1a1a] line-clamp-1 block">
                              {opt.title}
                            </span>
                            <span className="font-serif italic text-[11px] text-[#555] line-clamp-1 block">
                              By {opt.author}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="bg-black text-white font-mono text-[10px] font-bold px-2 py-0.5 shrink-0">
                            BOOK #{orderNum}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Reading Order List */}
            <div className="lg:col-span-5 bg-white border-2 border-black p-4 flex flex-col">
              <div className="flex items-center justify-between border-b border-black pb-2.5 mb-3">
                <h3 className="font-bold uppercase tracking-wider text-xs text-[#8b0000]">
                  2. Reading Order ({orderedItems.length} Selected)
                </h3>
                {orderedItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setOrderedItems([])}
                    className="text-[10px] font-bold uppercase text-gray-500 hover:text-[#8b0000] underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {orderedItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-black/30 bg-[#fcfaf2]">
                  <BookOpen size={26} className="text-[#8b0000] mb-2" />
                  <p className="font-serif italic text-xs text-[#4a4a4a]">
                    Click books on the left to add them to this album, then arrange them in reading order here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {orderedItems.map((it, idx) => {
                    const info = bookLookup.get(`${it.kind}:${it.id}`);
                    if (!info) return null;
                    return (
                      <div
                        key={`${it.kind}-${it.id}`}
                        className="flex items-center gap-2 p-2 bg-[#fcfaf2] border border-black"
                      >
                        <span className="bg-black text-white font-mono font-bold text-[10px] px-1.5 py-1 min-w-[28px] text-center shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="w-8 h-12 shrink-0 border border-black bg-black overflow-hidden">
                          <BookCoverImage
                            src={info.coverImage}
                            title={info.title}
                            author={info.author}
                            genre={info.genre}
                            alt={info.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-serif font-bold text-xs text-[#1a1a1a] line-clamp-1 block">
                            {info.title}
                          </span>
                          <span className="font-mono text-[9px] text-[#737373] block">
                            {info.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveItem(idx, -1)}
                            title="Move Up"
                            className="p-1 bg-white border border-black/40 hover:border-black disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <ArrowUp size={11} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === orderedItems.length - 1}
                            onClick={() => handleMoveItem(idx, 1)}
                            title="Move Down"
                            className="p-1 bg-white border border-black/40 hover:border-black disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <ArrowDown size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            title="Remove from album"
                            className="p-1 bg-white border border-black/40 hover:border-[#8b0000] hover:text-[#8b0000] cursor-pointer"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-black">
            <div>
              {editingAlbum && (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-red-50 text-[#8b0000] border border-[#8b0000] font-bold uppercase text-xs cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  <span>Delete Album</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleClose}
                className="px-4 py-2 text-[#4a4a4a] hover:text-black font-bold uppercase text-xs cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-[#8b0000] hover:bg-black text-white px-6 py-2.5 font-bold uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                <span>{editingAlbum ? 'Save Album Changes' : 'Create Book Album'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
