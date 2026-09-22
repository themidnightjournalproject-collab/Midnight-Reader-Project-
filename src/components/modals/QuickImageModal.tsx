import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import { ImageUploader } from '../common/ImageUploader';
import { Camera, Check, X } from 'lucide-react';
import { BookReview } from '../../types';

interface QuickImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'review' | 'currentlyReading' | 'custom';
  targetReview?: BookReview | null;
  initialImage: string;
  onSaveImage: (newUrl: string) => void;
  title: string;
}

export const QuickImageModal: React.FC<QuickImageModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetReview,
  initialImage,
  onSaveImage,
  title
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>(initialImage || '');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveImage(currentUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-4 border-black w-full max-w-2xl p-5 sm:p-7 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Camera className="text-[#8b0000]" size={22} />
            <div>
              <span className="font-sans text-[10px] text-[#8b0000] uppercase font-bold tracking-widest block">
                EVIDENCE PHOTO REPLACEMENT
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1a1a1a] uppercase font-serif">
                {title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#e8e2d8] text-black font-sans font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Uploader Component */}
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUploader
            label="Upload Any Photo from Device or Paste Image URL"
            value={currentUrl}
            onChange={(newImg) => setCurrentUrl(newImg)}
            aspectRatioLabel="You can upload any custom book cover, evidence photo, or photo from your device"
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-sans font-bold uppercase text-xs text-[#4a4a4a] hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#8b0000] hover:bg-black text-white px-6 py-2 font-sans font-bold uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>APPLY NEW COVER IMAGE</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
