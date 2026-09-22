import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { SuspectBoard } from './interactive/SuspectBoard';
import { ClueBoard } from './interactive/ClueBoard';
import { TheoryBuilder } from './interactive/TheoryBuilder';

export const SuspectBoardGlobal: React.FC = () => {
  const { reviews, setSelectedReview } = useJournal();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    reviews[0]?.id || ''
  );

  const currentCase = reviews.find((r) => r.id === selectedCaseId) || reviews[0];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-sans text-xs uppercase font-bold text-[#8b0000] tracking-widest">
                CENTRAL POLICE BLOTTER
              </span>
              <span className="text-[#737373]">•</span>
              <span className="font-sans text-xs text-[#4a4a4a] uppercase">
                CROSS-EXAMINATION ROOM
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight uppercase font-serif">
              INTERACTIVE SUSPECT BOARD
            </h2>
          </div>

          <span className="border border-[#8b0000] text-[#8b0000] font-mono uppercase text-xs py-0.5 px-2 font-bold rotate-1">
            EVIDENCE IN PROGRESS
          </span>
        </div>

        <p className="font-serif text-base text-[#4a4a4a] italic mt-2 max-w-3xl">
          Choose a case file below to inspect the suspect lineup, analyze motives and alibis, and record your verdict before reading the spoilers.
        </p>

        {/* Case Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-3 border-t border-black">
          <span className="text-xs font-sans text-[#4a4a4a] uppercase font-bold mr-2">
            Select Active Investigation:
          </span>
          {reviews.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedCaseId(r.id)}
              className={`text-xs font-sans uppercase px-3 py-1.5 transition-all font-bold ${
                currentCase?.id === r.id
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black border border-black hover:bg-[#f5f2ed]'
              }`}
            >
              Case #{r.caseNumber}: {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* Render the active case's suspect board & clue board */}
      {currentCase ? (
        <div>
          {/* Quick Header about the selected case */}
          <div className="bg-[#f5f2ed] p-4 border-2 border-black mb-6 flex flex-wrap items-center justify-between gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <span className="font-sans text-xs text-[#8b0000] uppercase font-bold tracking-wider">
                NOW EXAMINING: CASE #{currentCase.caseNumber}
              </span>
              <h3 className="text-xl font-bold text-[#1a1a1a] font-serif">
                {currentCase.title} <span className="font-sans font-normal text-sm text-[#4a4a4a]">by {currentCase.author}</span>
              </h3>
            </div>

            <button
              onClick={() => {
                setSelectedReview(currentCase);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-sans font-bold uppercase bg-black text-white px-3.5 py-1.5 hover:bg-[#8b0000] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              Open Full Case Dossier →
            </button>
          </div>

          <SuspectBoard review={currentCase} />
          <ClueBoard review={currentCase} />
          <TheoryBuilder review={currentCase} />
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-black bg-white">
          <p className="font-serif text-sm text-[#4a4a4a]">
            No case files available. File a new case to start an investigation.
          </p>
        </div>
      )}
    </section>
  );
};

