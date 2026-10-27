import React, { useState } from 'react';
import { Camera, Edit3, UserCheck } from 'lucide-react';
import { QuickImageModal } from './modals/QuickImageModal';
import { useJournal } from '../context/JournalContext';

export const AboutMeSection: React.FC = () => {
  const { 
    aboutConfig, 
    updateAboutConfig, 
    isAdminUnlocked, 
    setIsEditAboutModalOpen 
  } = useJournal();

  const [isQuickImageOpen, setIsQuickImageOpen] = useState(false);

  const handleSaveAboutImage = (newUrl: string) => {
    updateAboutConfig({ curatorPhoto: newUrl });
  };

  const photo = aboutConfig.curatorPhoto || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80";

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="border-b-2 border-black pb-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest">
              {aboutConfig.headerBadge || 'CORRESPONDENT PROFILE'}
            </span>
            <span className="text-[#737373]">•</span>
            <span className="font-sans text-xs text-[#4a4a4a] uppercase">
              {aboutConfig.headerSubtitle || 'THE STUDENT BEHIND THE LEDGER'}
            </span>
          </div>

          {/* Admin Edit Trigger (strictly protected) */}
          {isAdminUnlocked && (
            <button
              type="button"
              onClick={() => setIsEditAboutModalOpen(true)}
              className="flex items-center gap-1.5 bg-black hover:bg-[#8b0000] text-white px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider font-bold transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              <Edit3 size={13} />
              <span>EDIT ABOUT SECTION</span>
            </button>
          )}
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight uppercase font-serif">
          {aboutConfig.pageTitle || 'ABOUT THE CURATOR'}
        </h2>
      </div>

      {/* Main Container */}
      <div className="border-2 border-black p-6 sm:p-10 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10 pb-8 border-b border-black">
          {/* Left: Vintage Student Desk Photo Mockup */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="p-3 bg-[#f5f2ed] border-2 border-black rotate-[-1.5deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-3 text-center group relative">
              <div className="relative overflow-hidden">
                <img
                  src={photo}
                  alt="Detective reading desk at midnight"
                  className="w-48 sm:w-56 h-60 object-cover grayscale-[30%] contrast-[115%]"
                  referrerPolicy="no-referrer"
                />

                {/* Hover overlay to change image - ONLY for unlocked admin */}
                {isAdminUnlocked && (
                  <div 
                    onClick={() => setIsQuickImageOpen(true)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 cursor-pointer text-white text-center"
                  >
                    <Camera size={24} className="mb-1 text-[#e8e2d8]" />
                    <span className="font-sans text-[10px] uppercase font-black tracking-wider">
                      Change Curator Photo
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-black">
                <span className="font-sans text-[9px] uppercase text-[#1a1a1a] font-bold block tracking-wider truncate max-w-[130px]">
                  {aboutConfig.photoStamp || 'DESK AT 2:15 AM'}
                </span>
                {isAdminUnlocked && (
                  <button
                    type="button"
                    onClick={() => setIsQuickImageOpen(true)}
                    className="text-[9px] font-sans font-bold uppercase text-[#8b0000] hover:underline flex items-center gap-0.5"
                  >
                    <Camera size={9} /> Change
                  </button>
                )}
              </div>
            </div>

            {isAdminUnlocked && (
              <button
                type="button"
                onClick={() => setIsQuickImageOpen(true)}
                className="bg-[#f5f2ed] hover:bg-black hover:text-white text-[#1a1a1a] border border-black px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none mb-3"
              >
                <Camera size={11} />
                <span>Replace Curator Photo</span>
              </button>
            )}

            <div className="text-center font-mono text-xs text-[#4a4a4a] mt-1">
              <p>Classification: {aboutConfig.classification || 'Full-Time Student'}</p>
              <p>Obsession: {aboutConfig.obsession || 'Unreliable Narrators'}</p>
            </div>
          </div>

          {/* Right: Personal Bio & Student Manifesto */}
          <div className="md:col-span-8 space-y-4">
            <div className="bg-[#f5f2ed] border-l-4 border-[#8b0000] p-4">
              <p className="font-serif text-xl text-[#1a1a1a] italic font-semibold leading-snug">
                “{aboutConfig.featuredQuote || 'I started reading thrillers because I wanted to know what happened. I continued reading them because apparently I enjoy distrusting fictional strangers.'}”
              </p>
            </div>

            <p className="font-serif text-base text-[#1a1a1a] leading-relaxed">
              {aboutConfig.bioParagraph1}
            </p>

            <p className="font-serif text-base text-[#1a1a1a] leading-relaxed">
              {aboutConfig.bioParagraph2}
            </p>

            <p className="font-serif text-base text-[#4a4a4a] leading-relaxed">
              {aboutConfig.bioParagraph3}
            </p>
          </div>
        </div>

        {/* Student's Golden Rules of Thriller Reading */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4 uppercase font-serif">
            {aboutConfig.rulesHeading || 'MY 4 GOLDEN RULES OF THRILLER INVESTIGATION'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            {(aboutConfig.rules || []).map((rule, idx) => (
              <div key={idx} className="p-4 bg-[#f5f2ed] border border-black">
                <strong className="text-[#8b0000] block mb-1 uppercase tracking-wider">
                  {rule.title || `RULE #${rule.number || idx + 1}:`}
                </strong>
                <p className="text-[#1a1a1a] leading-relaxed">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Student Desk Marginalia */}
        <div className="p-5 bg-[#fffef7] border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[0.5deg]">
          <span className="font-sans text-[10px] text-[#8b0000] uppercase tracking-widest font-bold block mb-1">
            FINAL NOTE TO VISITORS:
          </span>
          <p className="font-serif italic text-xl text-[#1a1a1a] font-bold leading-relaxed">
            “{aboutConfig.finalNote}”
          </p>
        </div>

      </div>

      {/* Quick Image Replacement Modal for Curator Photo */}
      <QuickImageModal
        isOpen={isQuickImageOpen}
        onClose={() => setIsQuickImageOpen(false)}
        targetType="custom"
        initialImage={photo}
        onSaveImage={handleSaveAboutImage}
        title="Replace Curator Desk Photo"
      />
    </section>
  );
};
