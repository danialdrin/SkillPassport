# Implementation Plan: Hero Greeting Font Size Increase & Button Removal

**Feature**: Hero Greeting Font Size Increase & Button Removal
**Branch**: `012-hero-greeting-size-remove-button`
**Created**: 2026-09-06

## User Review Required

> [!IMPORTANT]
> The personalized greeting heading on the home page dashboard will be increased to `text-4xl sm:text-5xl lg:text-6xl`, and the "+ Ingest Learning Material" button below the greeting subtitle will be completely removed.

## Technical Context

- **Frontend**: React 19, TypeScript, Tailwind CSS.
- **Component to Modify**:
  - `frontend/src/pages/Home.tsx`: Update font size class on the `<h1>` greeting element and remove the `<Button>` ingest button container inside the hero section.

## Proposed Changes

### Dashboard Pages

#### [MODIFY] [Home.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/pages/Home.tsx)
- Change `h1` styling from `text-2xl sm:text-3xl` to `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink`.
- Remove the `Button` element for "Ingest Learning Material" below the hero subtitle paragraph.

## Verification Plan

### Automated Tests
- Run TypeScript typecheck `npx tsc --noEmit` in `frontend/`.

### Manual Verification
- Open Home page: verify the greeting ("Good evening, Dani") is significantly larger and bolder, and the ingest button below it is gone.
