import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { QuickImageModal } from './modals/QuickImageModal';

const DEFAULT_ABOUT_IMAGE = "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80";
const ABOUT_IMAGE_STORAGE_KEY = "midnight_curator_about_image";

export const AboutMeSection: React.FC = () => {
  const [aboutImage, setAboutImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ABOUT_IMAGE_STORAGE_KEY);
      return saved || DEFAULT_ABOUT_IMAGE;
    } catch {
      return DEFAULT_ABOUT_IMAGE;
    }
  });

  const [isQuickImageOpen, setIsQuickImageOpen] = useState(false);

  const handleSaveAboutImage = (newUrl: string) => {
    setAboutImage(newUrl || DEFAULT_ABOUT_IMAGE);
    try {
      localStorage.setItem(ABOUT_IMAGE_STORAGE_KEY, newUrl || DEFAULT_ABOUT_IMAGE);
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="border-b-2 border-black pb-4 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest">
            CORRESPONDENT PROFILE
          </span>
          <span className="text-[#737373]">•</span>
          <span className="font-sans text-xs text-[#4a4a4a] uppercase">
            THE STUDENT BEHIND THE LEDGER
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight uppercase font-serif">
          ABOUT THE CURATOR
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
                  src={aboutImage}
                  alt="Detective reading desk at midnight"
                  className="w-48 sm:w-56 h-60 object-cover grayscale-[30%] contrast-[115%]"
                  referrerPolicy="no-referrer"
                />

                {/* Hover overlay to change image */}
                <div 
                  onClick={() => setIsQuickImageOpen(true)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 cursor-pointer text-white text-center"
                >
                  <Camera size={24} className="mb-1 text-[#e8e2d8]" />
                  <span className="font-sans text-[10px] uppercase font-black tracking-wider">
                    Change Curator Photo
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-black">
                <span className="font-sans text-[9px] uppercase text-[#1a1a1a] font-bold block tracking-wider truncate max-w-[130px]">
                  DESK AT 2:15 AM
                </span>
                <button
                  type="button"
                  onClick={() => setIsQuickImageOpen(true)}
                  className="text-[9px] font-sans font-bold uppercase text-[#8b0000] hover:underline flex items-center gap-0.5"
                >
                  <Camera size={9} /> Change
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsQuickImageOpen(true)}
              className="bg-[#f5f2ed] hover:bg-black hover:text-white text-[#1a1a1a] border border-black px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none mb-3"
            >
              <Camera size={11} />
              <span>Replace Curator Photo</span>
            </button>

            <div className="text-center font-mono text-xs text-[#4a4a4a] mt-1">
              <p>Classification: Full-Time Student</p>
              <p>Obsession: Unreliable Narrators</p>
            </div>
          </div>

          {/* Right: Personal Bio & Student Manifesto */}
          <div className="md:col-span-8 space-y-4">
            <div className="bg-[#f5f2ed] border-l-4 border-[#8b0000] p-4">
              <p className="font-serif text-xl text-[#1a1a1a] italic font-semibold leading-snug">
                “I started reading thrillers because I wanted to know what happened. I continued reading them because apparently I enjoy distrusting fictional strangers.”
              </p>
            </div>

            <p className="font-serif text-base text-[#1a1a1a] leading-relaxed">
              Hello! I'm a student who divides their waking hours between academic obligations and meticulously suspecting innocent fictional characters of capital murder.
            </p>

            <p className="font-serif text-base text-[#1a1a1a] leading-relaxed">
              This blog is not a commercial book review portal or a highbrow literary magazine. It is my private case file archive—a place where I document plot twists, file wild theories before the climax, and lament the fact that I almost never guess the ending correctly despite having 400 pages of warning.
            </p>

            <p className="font-serif text-base text-[#4a4a4a] leading-relaxed">
              When I'm not reading until my eyes water at 3:00 AM, you can find me analyzing red herrings, arguing with book characters about why they should not explore the dark cellar alone, and brewing excessive amounts of Earl Grey tea.
            </p>
          </div>
        </div>

        {/* Student's Golden Rules of Thriller Reading */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4 uppercase font-serif">
            MY 4 GOLDEN RULES OF THRILLER INVESTIGATION
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 bg-[#f5f2ed] border border-black">
              <strong className="text-[#8b0000] block mb-1 uppercase tracking-wider">RULE #1:</strong>
              <p className="text-[#1a1a1a] leading-relaxed">
                The character introduced in Chapter 3 who seems "too helpful and harmless" is definitely running the secret underground society.
              </p>
            </div>

            <div className="p-4 bg-[#f5f2ed] border border-black">
              <strong className="text-[#8b0000] block mb-1 uppercase tracking-wider">RULE #2:</strong>
              <p className="text-[#1a1a1a] leading-relaxed">
                Never accept an invitation to a weekend housewarming party on an uninhabited island with no cell service.
              </p>
            </div>

            <div className="p-4 bg-[#f5f2ed] border border-black">
              <strong className="text-[#8b0000] block mb-1 uppercase tracking-wider">RULE #3:</strong>
              <p className="text-[#1a1a1a] leading-relaxed">
                If a protagonist says "I felt completely safe for the first time in years," start a 5-page countdown to a home invasion.
              </p>
            </div>

            <div className="p-4 bg-[#f5f2ed] border border-black">
              <strong className="text-[#8b0000] block mb-1 uppercase tracking-wider">RULE #4:</strong>
              <p className="text-[#1a1a1a] leading-relaxed">
                Do not begin the final 50 pages of any locked-room mystery on a school night. You will not sleep.
              </p>
            </div>
          </div>
        </div>

        {/* Student Desk Marginalia */}
        <div className="p-5 bg-[#fffef7] border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[0.5deg]">
          <span className="font-sans text-[10px] text-[#8b0000] uppercase tracking-widest font-bold block mb-1">
            FINAL NOTE TO VISITORS:
          </span>
          <p className="font-serif italic text-xl text-[#1a1a1a] font-bold leading-relaxed">
            “Feel free to submit your own theories on any case file. If you guess correctly, you get bragging rights. If you guess incorrectly, welcome to the club.”
          </p>
        </div>

      </div>

      {/* Quick Image Replacement Modal for Curator Photo */}
      <QuickImageModal
        isOpen={isQuickImageOpen}
        onClose={() => setIsQuickImageOpen(false)}
        targetType="custom"
        initialImage={aboutImage}
        onSaveImage={handleSaveAboutImage}
        title="Replace Curator Desk Photo"
      />
    </section>
  );
};

