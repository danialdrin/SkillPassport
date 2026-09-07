# Implementation Plan: Search Page Pagination with Automatic Medium Analysis

**Feature**: Search Page Pagination with Automatic Medium Analysis
**Branch**: `009-search-pagination-auto-analysis`
**Created**: 2026-09-06

## User Review Required

> [!IMPORTANT]
> The search results grid layout will update to a 5-column by 3-row layout (15 items per page) on wide viewports, with automatic sequential Medium Analysis running in the background for visible page items. Manual "Analyze" buttons are replaced with dynamic state indicators (`Waiting`, `Analyzing...`, `Analysis Complete`, `Analysis Failed`).

## Technical Context

- **Frontend**: React 19, TypeScript, React Query (`@tanstack/react-query`), Tailwind CSS, Lucide icons.
- **State Management**: React state + TanStack Query cache for candidate resources.
- **Backend API**: FastAPI endpoint `POST /search/{resource_id}/analyze-medium` returns single resource analysis. `POST /search` returns up to 50 search candidates.
- **Grid Layout**: 5-column grid on desktop screens (`xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1`) ensuring 5 videos per row × 3 rows = 15 items per page.

## Proposed Changes

### Frontend Component & Page Architecture

#### [MODIFY] [Search.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/pages/Search.tsx)
- Implement `currentPage` state (defaulting to 1).
- Slice `filteredCandidates` into 15-item pages (`PAGE_SIZE = 15`).
- Implement an automatic sequential analysis queue effect tied to `currentPage` and `currentPagedCandidates`.
- Track individual video analysis statuses (`waiting`, `analyzing`, `complete`, `failed`) in local state or query cache.
- Maintain sequential execution loop: process index 0, wait for API resolve/reject, update state, process index 1, etc.
- Reuse existing candidate analysis results if candidate already has `medium_analysis` present.
- Render clean pagination controls (`Prev`, `Page 1`, `Page 2`, ..., `Next`, page indicators).
- Pass status props (`analysisStatus`, `localMedium`) down to `CandidateCard`.

#### [MODIFY] [CandidateCard.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/components/search/CandidateCard.tsx)
- Remove manual "Analyze Quality" button.
- Support `analysisStatus` prop: `'waiting' | 'analyzing' | 'complete' | 'failed'`.
- Render distinct status indicators:
  - `Analyzing...`: Spinner + loading skeleton representation for score breakdown.
  - `Waiting`: Subtle queued state badge (`Queued for Analysis`).
  - `Analysis Complete`: Shows score overall and breakdown.
  - `Analysis Failed`: Shows error badge (`Analysis Unavailable`) while keeping `Select & Start Strong Analysis` usable.

#### [NEW] [PaginationControls.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/components/search/PaginationControls.tsx)
- Dedicated pagination component rendering page numbers, active page highlighting, previous/next controls, and item count ranges (e.g., "Showing 1–15 of 50 videos").

## Verification Plan

### Automated Tests
- Run `npm test` or typecheck `npx tsc --noEmit` in `frontend/`.

### Manual Verification
- Execute search query (e.g. "Python").
- Verify Page 1 displays 15 videos in a 5-column × 3-row grid.
- Observe automatic sequential Medium Analysis running video by video.
- Confirm future page videos (Page 2) are not pre-analyzed.
- Click Page 2, verify videos 16–30 load and start sequential analysis.
- Click Page 1, verify completed analysis results are instantly displayed without re-fetching.
- Validate error resilience: if an analysis fails, verify the queue continues to the next video without halting.
