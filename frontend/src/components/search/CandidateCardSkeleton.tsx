import React from 'react';
import { Skeleton } from '../ui/skeleton';

export const CandidateCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface border border-line rounded-sm overflow-hidden flex flex-col justify-between h-full space-y-3">
      <div>
        {/* 16:9 Thumbnail Skeleton */}
        <Skeleton className="aspect-video w-full bg-stone-200/70" />

        {/* Content Details Skeleton */}
        <div className="p-4 space-y-3">
          {/* Title skeleton (2 lines) */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-11/12 bg-stone-200/80 rounded-xs" />
            <Skeleton className="h-4 w-3/4 bg-stone-200/60 rounded-xs" />
          </div>

          {/* Channel skeleton */}
          <Skeleton className="h-3 w-1/3 bg-stone-200/60 rounded-xs" />

          {/* Description skeleton */}
          <div className="space-y-1 pt-1">
            <Skeleton className="h-3 w-full bg-stone-200/50 rounded-xs" />
            <Skeleton className="h-3 w-4/5 bg-stone-200/40 rounded-xs" />
          </div>
        </div>
      </div>

      {/* Action Footer Skeleton */}
      <div className="p-4 pt-0 space-y-2">
        <Skeleton className="h-8 w-full bg-stone-200/70 rounded-xs" />
        <Skeleton className="h-8 w-full bg-stone-300/70 rounded-xs" />
      </div>
    </div>
  );
};
