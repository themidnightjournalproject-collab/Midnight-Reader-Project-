import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Sparkles, X, Check, Camera, RefreshCw } from 'lucide-react';

export const CURATED_THRILLER_COVERS = [
  {
    name: 'The Housemaid (Domestic Mystery)',
    url: 'https://imgs.search.brave.com/Wy7CV-9Cw3aIMDYtE5525byLLeXxeS29XANx3P6mzHM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2E4LzZl/L2I2L2E4NmViNjdk/NzU3ZTU1YjU2NGZk/YzBjYzUzMzk4MmRi/LmpwZw'
  },
  {
    name: 'The Silent Patient (Clinical Noir)',
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Gothic Brownstone (Window Noir)',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Vintage Crime Ledger (Old Case)',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Dark Mystery Room (Midnight Glow)',
    url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Stormy Island Estate (Locked Room)',
    url: 'https://images.unsplash.com/photo-1507842229457-78b98c6f84b3?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Foggy Forest Road (Cold Case)',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Antique Typewriter (Evidence Desk)',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Rainy Street Lamp (London Noir)',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Candlelit Manor Study (Dark Academia)',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80'
  }
];

export const CURATED_NON_THRILLER_COVERS = [
  {
    name: 'Thinking Fast & Slow (Cognitive Science)',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'When Breath Becomes Air (Memoir & Light)',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Project Hail Mary (Deep Cosmos Sci-Fi)',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Deep Work & Architecture (Minimalist Desk)',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Classical Philosophy & Meditations',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Vintage Clothbound Classic Fiction',
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Speculative Future & Cybernetic Geometry',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Botanical & Ecological Nature Study',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Historical Chronicle & Ancient Archives',
    url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Contemporary Literary Journal',
    url: 'https://images.unsplash.com/photo-1507842229457-78b98c6f84b3?auto=format&fit=crop&w=600&q=80'
  }
];

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (newImageUrl: string) => void;
  aspectRatioLabel?: string;
  presetCategory?: 'thriller' | 'research' | 'all';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = "Cover Image (File Upload, Web URL, or Presets)",
  value,
  onChange,
  aspectRatioLabel = "Recommended: 2:3 or 3:4 portrait book aspect ratio",
  presetCategory = 'thriller'
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [presetTab, setPresetTab] = useState<'thriller' | 'research'>(
    presetCategory === 'research' ? 'research' : 'thriller'
  );
  const [urlInput, setUrlInput] = useState<string>(value || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and optimize image file client-side to keep base64 compact and ultra-fast
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP, GIF).');
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Max dimensions to avoid bloating storage
        const maxDimension = 900;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(dataUrl);
          setUrlInput(dataUrl);
          setIsProcessing(false);
        } else {
          // Fallback to raw data url
          const rawUrl = readerEvent.target?.result as string;
          onChange(rawUrl);
          setUrlInput(rawUrl);
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setUploadError('Failed to parse the selected image file.');
        setIsProcessing(false);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Error reading the image file from your device.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUploadError(null);
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    onChange(presetUrl);
    setUrlInput(presetUrl);
    setUploadError(null);
  };

  const handleClearImage = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-[#f5f2ed] border-2 border-black p-3.5 sm:p-4 space-y-3 font-sans">
      
      {/* Header & Mode Switches */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black border-opacity-20 pb-2">
        <div>
          <label className="block text-[#1a1a1a] font-bold uppercase text-[10px] tracking-wider">
            {label}
          </label>
          <span className="text-[10px] text-[#737373] block">{aspectRatioLabel}</span>
        </div>

        {/* Tabs for choosing method */}
        <div className="flex items-center gap-1 bg-white border border-black p-0.5">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeMode === 'upload'
                ? 'bg-black text-white'
                : 'text-[#4a4a4a] hover:bg-[#faf7f2]'
            }`}
          >
            <Upload size={11} />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeMode === 'url'
                ? 'bg-black text-white'
                : 'text-[#4a4a4a] hover:bg-[#faf7f2]'
            }`}
          >
            <LinkIcon size={11} />
            <span>Web Link / URL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('presets')}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeMode === 'presets'
                ? 'bg-[#8b0000] text-white'
                : 'text-[#4a4a4a] hover:bg-[#faf7f2]'
            }`}
          >
            <Sparkles size={11} />
            <span>Curated Presets</span>
          </button>
        </div>
      </div>

      {/* Main Mode Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        
        {/* Left Side: Upload / URL / Presets Input Controls */}
        <div className="md:col-span-8 space-y-3">
          
          {/* MODE 1: FILE DRAG & DROP / BROWSE */}
          {activeMode === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-file-input-dossier"
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#8b0000] bg-[#ffefef]'
                    : 'border-black bg-white hover:bg-[#faf9f5]'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#f5f2ed] border border-black flex items-center justify-center text-[#8b0000]">
                    {isProcessing ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <Camera size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#1a1a1a] uppercase tracking-wider">
                      {isProcessing ? 'Optimizing image...' : 'Click to Browse or Drag & Drop Any Photo'}
                    </p>
                    <p className="text-[10px] text-[#737373] mt-0.5">
                      Supports JPG, PNG, WebP, GIF from your computer or phone
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-2 bg-black hover:bg-[#8b0000] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Select File from Device
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: WEB URL */}
          {activeMode === 'url' && (
            <div className="bg-white border border-black p-3 space-y-2">
              <label className="block text-[10px] font-bold uppercase text-[#1a1a1a]">
                Paste Direct Web Image Address:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    onChange(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/... or https://.../cover.jpg"
                  className="flex-1 bg-[#faf9f5] border border-black p-2 text-xs text-[#1a1a1a] focus:outline-none focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="bg-black hover:bg-[#8b0000] text-white px-3 py-2 text-xs font-bold uppercase tracking-wider"
                >
                  Apply
                </button>
              </div>
              <p className="text-[9px] text-[#737373] italic">
                Tip: Works with Goodreads, Amazon, Pinterest, Unsplash, or any public web image URL.
              </p>
            </div>
          )}

          {/* MODE 3: PRESETS GALLERY */}
          {activeMode === 'presets' && (
            <div className="bg-white border border-black p-3 space-y-2.5">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <p className="text-[10px] font-bold uppercase text-[#8b0000] tracking-wider">
                  Select a Curated Cover:
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPresetTab('thriller')}
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase border transition-colors ${
                      presetTab === 'thriller'
                        ? 'bg-black text-white border-black'
                        : 'bg-[#faf9f5] text-gray-700 border-gray-300 hover:border-black'
                    }`}
                  >
                    Noir & Thriller
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetTab('research')}
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase border transition-colors ${
                      presetTab === 'research'
                        ? 'bg-black text-white border-black'
                        : 'bg-[#faf9f5] text-gray-700 border-gray-300 hover:border-black'
                    }`}
                  >
                    Research & Literature
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                {(presetTab === 'research' ? CURATED_NON_THRILLER_COVERS : CURATED_THRILLER_COVERS).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`p-1.5 border text-left transition-all group flex items-center gap-2 ${
                      value === preset.url
                        ? 'border-[#8b0000] bg-[#ffefef] font-bold shadow-[2px_2px_0px_0px_rgba(139,0,0,1)]'
                        : 'border-black bg-[#faf9f5] hover:bg-white hover:border-[#8b0000]'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-8 h-11 object-cover border border-black shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-[#1a1a1a] block truncate leading-tight">
                        {preset.name}
                      </span>
                      {value === preset.url && (
                        <span className="text-[8px] text-[#8b0000] font-mono font-bold flex items-center gap-0.5">
                          <Check size={8} /> Active
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Notice */}
          {uploadError && (
            <div className="bg-[#ffefef] border-l-4 border-[#8b0000] p-2 text-[#8b0000] text-xs font-bold">
              {uploadError}
            </div>
          )}
        </div>

        {/* Right Side: Live Image Preview Dossier Frame */}
        <div className="md:col-span-4 flex flex-col items-center">
          <div className="bg-white border-2 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center w-full max-w-[170px]">
            <div className="font-mono text-[9px] uppercase font-bold text-[#8b0000] border-b border-black pb-1 mb-1 tracking-wider">
              COVER PREVIEW
            </div>
            
            <div className="w-full h-40 bg-[#f5f2ed] border border-black overflow-hidden relative flex items-center justify-center">
              {value ? (
                <img
                  src={value}
                  alt="Dossier cover preview"
                  className="w-full h-full object-cover grayscale-[10%] contrast-[105%]"
                  referrerPolicy="no-referrer"
                  onError={() => setUploadError('Image failed to load. Check that the file or URL is valid.')}
                />
              ) : (
                <div className="text-center p-2 text-[#737373]">
                  <ImageIcon size={24} className="mx-auto mb-1 opacity-40" />
                  <span className="text-[9px] uppercase block font-mono">No Image Attached</span>
                </div>
              )}
            </div>

            {value && (
              <div className="mt-2 flex items-center justify-between gap-1 pt-1 border-t border-black">
                <span className="text-[8px] font-mono text-[#737373] uppercase truncate max-w-[90px]">
                  {value.startsWith('data:') ? 'Custom File' : 'Web URL'}
                </span>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="text-[9px] text-[#8b0000] hover:underline font-bold uppercase flex items-center gap-0.5"
                >
                  <X size={10} /> Remove
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
