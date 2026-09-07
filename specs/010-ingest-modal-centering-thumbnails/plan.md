# Implementation Plan: Ingest Modal Centering & Recent Video Thumbnails

**Feature**: Ingest Modal Centering & Recent Video Thumbnails
**Branch**: `010-ingest-modal-centering-thumbnails`
**Created**: 2026-09-06

## User Review Required

> [!IMPORTANT]
> The top 3 action cards (Upload, Link, Paste) on the home page will be removed. The ingest modal dialog will be perfectly centered on the screen with centered text typography. Recent video cards will now display their actual YouTube video thumbnails.

## Technical Context

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide icons, Dialog UI components.
- **Components to Modify**:
  - `frontend/src/components/ui/dialog.tsx`: Enforce viewport-centered flexbox overlay positioning with `my-auto` and vertical padding constraints.
  - `frontend/src/components/resources/UploadModal.tsx`: Center all header text, description text, and form controls inside the ingest modal body.
  - `frontend/src/pages/Home.tsx`: Remove the 3 action tile cards (Upload, Link, Paste), center greeting and intake trigger, and simplify section spacing.
  - `frontend/src/components/dashboard/RecentResourceCard.tsx`: Render the actual video thumbnail image (using `resource.thumbnail` or YouTube thumbnail fallback URL `https://img.youtube.com/vi/{video_id}/hqdefault.jpg`).

## Proposed Changes

### Dialog & Modal Components

#### [MODIFY] [dialog.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/components/ui/dialog.tsx)
- Ensure the overlay overlay container uses `fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto`.
- Ensure the dialog body container has `my-auto max-h-[90vh] overflow-y-auto` so it centers cleanly on all viewport sizes without clipping off top screen edge.

#### [MODIFY] [UploadModal.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/components/resources/UploadModal.tsx)
- Update `DialogHeader`, `DialogTitle`, and `DialogDescription` to use `text-center`.
- Center tab buttons and form elements.

### Dashboard & Pages

#### [MODIFY] [Home.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/pages/Home.tsx)
- Remove the 3 action cards (Upload, Link, Paste) section.
- Center the greeting text and primary ingestion action in the middle of the hero section.

#### [MODIFY] [RecentResourceCard.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/components/dashboard/RecentResourceCard.tsx)
- Extract YouTube `video_id` or use `resource.thumbnail`.
- Render an `<img>` tag with `src={thumbnailUrl}` and fallback placeholder when images are loading or failing to load.

## Verification Plan

### Automated Tests
- Run TypeScript typecheck `npx tsc --noEmit` in `frontend/`.

### Manual Verification
- Open Home page: verify the 3 cards (Upload, Link, Paste) are removed and text is centered.
- Click Ingest button: verify the modal opens in the exact vertical and horizontal center of the viewport without top clipping.
- Observe Recents section: verify recent videos display their corresponding thumbnail images.
