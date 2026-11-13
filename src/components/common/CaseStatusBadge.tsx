import React from 'react';
import { CheckCircle2, Snowflake } from 'lucide-react';
import { BookReview, NonFictionBook } from '../../types';

export type ReviewProgressStatus = 'Active' | 'Cold Case' | 'Solved';

export interface ProgressStatusDetails {
  status: ReviewProgressStatus;
  label: string;
  subLabel?: string;
  badgeClass: string;
  dotColor?: string;
  icon: React.ReactNode;
  percentComplete?: number;
}

/**
 * Computes whether a book review / journal entry is 'Active', 'Cold Case', or 'Solved'
 * based on review progress (dates, pages, completion status, or verdict).
 */
export function computeReviewProgressStatus(item: {
  status?: string;
  currentPage?: number;
  pages?: number;
  dateStarted?: string;
  dateFinished?: string;
  dateRead?: string;
  correctGuess?: boolean;
}): ProgressStatusDetails {
  const rawStatus = (item.status || '').trim();
  const upper = rawStatus.toUpperCase();

  // Compute page percentage if available
  let percentComplete: number | undefined;
  if (item.currentPage && item.pages && item.pages > 0) {
    percentComplete = Math.min(100, Math.round((item.currentPage / item.pages) * 100));
  }

  // 1. COLD CASE: Unsolved mysteries, abandoned dossiers, or explicit cold case status
  if (
    upper === 'COLD CASE' || 
    upper === 'COLDCASE' || 
    upper === 'COLD' ||
    upper === 'ABANDONED' || 
    upper === 'UNSOLVED'
  ) {
    return {
      status: 'Cold Case',
      label: 'Cold Case',
      subLabel: 'Unsolved Mystery',
      badgeClass: 'bg-[#0f172a] text-[#e2e8f0] border-2 border-[#64748b] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      icon: <Snowflake size={11} className="text-[#38bdf8] shrink-0" />,
      percentComplete
    };
  }

  // 2. ACTIVE: Currently reading, active investigation, or dateStarted without dateFinished
  const isExplicitActive = 
    upper === 'ACTIVE' || 
    upper === 'UNDER INVESTIGATION' || 
    upper === 'READING' || 
    upper === 'IN PROGRESS';

  const isReadingInProgress = 
    Boolean(item.dateStarted && !item.dateFinished && upper !== 'CLOSED' && upper !== 'SOLVED' && upper !== 'COMPLETED');

  const hasIncompletePages = 
    Boolean(item.currentPage && item.pages && item.currentPage < item.pages && upper !== 'CLOSED' && upper !== 'SOLVED' && upper !== 'COMPLETED');

  if (isExplicitActive || isReadingInProgress || hasIncompletePages) {
    let sub = 'Investigation In Progress';
    if (percentComplete !== undefined && item.pages && item.currentPage) {
      sub = `Page ${item.currentPage}/${item.pages} (${percentComplete}%)`;
    } else if (item.dateStarted) {
      sub = `Started ${item.dateStarted}`;
    }

    return {
      status: 'Active',
      label: 'Active',
      subLabel: sub,
      badgeClass: 'bg-[#fef3c7] text-[#92400e] border-2 border-[#b45309] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      icon: (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
        </span>
      ),
      percentComplete
    };
  }

  // 3. SOLVED: Case closed, completed read, or verified reveal
  let sub = 'Case Solved';
  if (item.correctGuess) {
    sub = 'Twist Solved';
  } else if (item.dateFinished) {
    sub = `Closed ${item.dateFinished}`;
  }

  return {
    status: 'Solved',
    label: 'Solved',
    subLabel: sub,
    badgeClass: 'bg-[#8b0000] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg]',
    icon: <CheckCircle2 size={11} className="text-white shrink-0" />,
    percentComplete: 100
  };
}

interface CaseStatusBadgeProps {
  item: BookReview | (NonFictionBook & { status?: string; currentPage?: number; correctGuess?: boolean });
  size?: 'sm' | 'md' | 'lg';
  showProgressDetails?: boolean;
  className?: string;
}

export const CaseStatusBadge: React.FC<CaseStatusBadgeProps> = ({
  item,
  size = 'md',
  showProgressDetails = false,
  className = ''
}) => {
  const details = computeReviewProgressStatus(item);

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5 gap-1',
    md: 'text-[10px] px-2 py-0.5 gap-1.5',
    lg: 'text-xs px-2.5 py-1 gap-2'
  }[size];

  return (
    <div className={`inline-flex flex-col items-end ${className}`}>
      <span
        title={`Status: ${details.label} (${details.subLabel || details.status})`}
        className={`font-mono font-bold uppercase tracking-wider inline-flex items-center transition-transform ${sizeClasses} ${details.badgeClass}`}
      >
        {details.icon}
        <span>{details.label}</span>
      </span>

      {showProgressDetails && details.subLabel && (
        <span className="text-[9px] font-mono text-[#737373] mt-0.5 tracking-tight">
          {details.subLabel}
        </span>
      )}
    </div>
  );
};
