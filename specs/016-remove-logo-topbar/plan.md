# Implementation Plan: TopBar Logo Removal and Search Bar Centering

**Branch**: `016-remove-logo-topbar` | **Date**: 2026-09-07 | **Spec**: [specs/016-remove-logo-topbar/spec.md](file:///media/SharedMemory/project/final%20year%20project/MySkills/specs/016-remove-logo-topbar/spec.md)

**Input**: Feature specification from `/specs/016-remove-logo-topbar/spec.md`

## Summary

Remove the `SkillPassport Intelligence` logo block from `TopBar.tsx` and adjust the header flex/grid layout so that the central search input field and "+ Ingest" button container are aligned to the true horizontal center of the navigation bar.

## Technical Context

**Language/Version**: TypeScript, React 19
**Primary Dependencies**: Vite, Tailwind CSS, Lucide React
**Storage**: N/A (UI layout change)
**Testing**: Manual visual testing & Playwright UI validation
**Target Platform**: Web browsers (Desktop & Mobile viewports)
**Project Type**: React Single-Page Application (Frontend)
**Performance Goals**: Instant UI rendering, zero cumulative layout shift (CLS)
**Constraints**: Keep dropdown menu and user profile dropdown fully functional

## Constitution Check

*GATE: Passed*
- Single component modification (`TopBar.tsx`).
- No breaking API changes or state alterations.

## Project Structure

### Documentation (this feature)

```text
specs/016-remove-logo-topbar/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code

```text
frontend/
└── src/
    └── components/
        └── layout/
            └── TopBar.tsx
```

**Structure Decision**: Single file modification in `frontend/src/components/layout/TopBar.tsx`.

## Proposed Changes

### TopBar Component Layout Refactoring

#### [MODIFY] [TopBar.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/components/layout/TopBar.tsx)

1. Delete the `<Link to="/">` containing logo square icon ("SP") and logo title text ("SkillPassport Intelligence").
2. Wrap the left side (Menu button) and right side (User avatar circle / Auth buttons) in equal structural containers or grid column layouts (`w-12` or `w-auto` symmetry) so the middle section (`flex-1 max-w-xl mx-auto justify-center`) resolves to the exact center of the screen width.

## Verification Plan

### Manual Verification
1. Inspect top bar layout in browser (authenticated and unauthenticated states).
2. Verify logo is absent.
3. Verify menu button on left and profile avatar on right have matching offset/width so the search bar sits at the absolute center of the navbar.
