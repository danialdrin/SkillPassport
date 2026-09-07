# Implementation Plan: Space Cards Resize, Recents Conditional Display & TopBar Alignment

**Feature**: Space Cards Resize, Recents Conditional Display & TopBar Alignment
**Branch**: `014-space-card-size-hide-empty-recents`
**Created**: 2026-09-06

## User Review Required

> [!IMPORTANT]
> 1. Space cards on the Home dashboard will be enlarged (increased height, width, padding, and text size).
> 2. The Recents section on the Home dashboard will be hidden when there are 0 recent strong-analyzed items (only shown when items exist).
> 3. Navigation header layout will be updated with `justify-between` so that when `status === 'anonymous'`, the logo stays anchored to the far left end and the "Sign In" / "Get Started" buttons stay anchored to the far right end.

## Technical Context

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide icons.
- **Files to Modify**:
  - `frontend/src/components/dashboard/SpaceCard.tsx`: Increase card size (`h-32 w-48 sm:w-56`), padding, icon size, and title font size.
  - `frontend/src/pages/Home.tsx`: Conditionally render the Recents section only when `strongAnalyzedResources.length > 0`.
  - `frontend/src/components/layout/TopBar.tsx`: Add `justify-between` positioning to top container so left elements (logo) and right elements (auth buttons / profile) are anchored to opposite ends of the header.

## Proposed Changes

### Dashboard & Layout Components

#### [MODIFY] [SpaceCard.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/components/dashboard/SpaceCard.tsx)
- Increase container height and width (e.g. `h-32 w-48 sm:w-56`).
- Increase padding and typography scale (`text-sm sm:text-base font-bold`).

#### [MODIFY] [Home.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/pages/Home.tsx)
- Wrap Recents `<section>` in `{strongAnalyzedResources.length > 0 && (...)}`.
- Remove empty placeholder state for Recents when 0 items.

#### [MODIFY] [TopBar.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/components/layout/TopBar.tsx)
- Ensure top flex container uses `justify-between` so logo is anchored far-left and auth action buttons are anchored far-right when unauthenticated.

## Verification Plan

### Automated Tests
- Run TypeScript typecheck `npx tsc --noEmit` in `frontend/`.

### Manual Verification
- View Home page with 0 resources: verify Recents section is hidden.
- View Space cards: verify cards are larger and more prominent.
- View top navigation bar as anonymous user: verify logo is on the left and auth buttons are at the opposite far-right end.
