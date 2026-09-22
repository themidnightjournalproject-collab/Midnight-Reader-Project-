import React from 'react';
import { JournalProvider, useJournal } from './context/JournalContext';
import { Masthead } from './components/Masthead';
import { HeroHeadline } from './components/HeroHeadline';
import { CurrentlyReadingBanner } from './components/CurrentlyReadingBanner';
import { ReadingJournalSection } from './components/ReadingJournalSection';
import { NonFictionSection } from './components/NonFictionSection';
import { CaseFilesGallery } from './components/CaseFilesGallery';
import { SuspectBoardGlobal } from './components/SuspectBoardGlobal';
import { ReadingTimeline } from './components/ReadingTimeline';
import { ReadingStatsSection } from './components/ReadingStatsSection';
import { AboutMeSection } from './components/AboutMeSection';
import { CaseFileFullView } from './components/CaseFileFullView';
import { ArchiveManager } from './components/ArchiveManager';
import { BackupSyncSection } from './components/BackupSyncSection';
import { ReaderAnalyticsDashboard } from './components/ReaderAnalyticsDashboard';
import { NewReviewModal } from './components/modals/NewReviewModal';
import { EditReviewModal } from './components/modals/EditReviewModal';
import { NonFictionEditorModal } from './components/NonFictionEditorModal';
import { EditHeroModal } from './components/EditHeroModal';
import { StatsEditorModal } from './components/modals/StatsEditorModal';
import { TimelineEditorModal } from './components/modals/TimelineEditorModal';
import { IntelligenceEditorModal } from './components/modals/IntelligenceEditorModal';
import { CurrentlyReadingModal } from './components/modals/CurrentlyReadingModal';
import { AdminAuthModal } from './components/modals/AdminAuthModal';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { selectedReview, activeView } = useJournal();

  // If a specific case review is currently opened, display full case file view
  if (selectedReview) {
    return <CaseFileFullView review={selectedReview} />;
  }

  // Render view according to navigation
  switch (activeView) {
    case 'journal':
      return <ReadingJournalSection />;
    
    case 'casefiles':
    case 'reviews':
      return <CaseFilesGallery />;

    case 'non-fiction':
      return <NonFictionSection />;

    case 'currently-reading':
      return (
        <div className="space-y-6">
          <CurrentlyReadingBanner />
          <SuspectBoardGlobal />
        </div>
      );

    case 'suspect-board':
      return <SuspectBoardGlobal />;

    case 'timeline':
      return <ReadingTimeline />;

    case 'manage-books':
      return <ArchiveManager />;

    case 'backup-sync':
      return <BackupSyncSection />;

    case 'analytics':
      return <ReaderAnalyticsDashboard />;

    case 'stats':
      return <ReadingStatsSection />;

    case 'about':
      return <AboutMeSection />;

    case 'home':
    default:
      return (
        <div className="space-y-8">
          <HeroHeadline />
          <CurrentlyReadingBanner />
          <ReadingJournalSection />
          <NonFictionSection />
          <ReadingStatsSection />
        </div>
      );
  }
};

export default function App() {
  return (
    <JournalProvider>
      <div className="min-h-screen flex flex-col justify-between selection:bg-[#8b1e1e] selection:text-white">
        <div>
          <Masthead />
          <main className="w-full">
            <MainContent />
          </main>
        </div>

        {/* Global Modals */}
        <NewReviewModal />
        <EditReviewModal />
        <NonFictionEditorModal />
        <EditHeroModal />
        <StatsEditorModal />
        <TimelineEditorModal />
        <IntelligenceEditorModal />
        <CurrentlyReadingModal />
        <AdminAuthModal />

        <Footer />
      </div>
    </JournalProvider>
  );
}
