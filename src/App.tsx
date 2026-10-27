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
import { AboutEditorModal } from './components/modals/AboutEditorModal';
import { OffTheRecordEditorModal } from './components/modals/OffTheRecordEditorModal';
import { AdminAuthModal } from './components/modals/AdminAuthModal';
import { GitHubAuthModal } from './components/modals/GitHubAuthModal';
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
        <div className="py-4">
          <CurrentlyReadingBanner />
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

function AppContent() {
  const { setIsAdminModalOpen } = useJournal();

  // Listen for secret keyboard combo (Ctrl+Alt+E or Cmd+Alt+E) or ?editor=true URL param
  React.useEffect(() => {
    // 1. Check URL parameters
    const params = new URLSearchParams(window.location.search);
    if (params.get('editor') === '1' || params.get('admin') === '1' || params.has('secret')) {
      setIsAdminModalOpen(true);
    }

    // 2. Secret keyboard listener for the blog owner
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        setIsAdminModalOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminModalOpen]);

  return (
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
      <AboutEditorModal />
      <OffTheRecordEditorModal />
      <AdminAuthModal />
      <GitHubAuthModal />

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <JournalProvider>
      <AppContent />
    </JournalProvider>
  );
}
