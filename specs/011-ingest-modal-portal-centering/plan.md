# Implementation Plan: Ingest Modal Portal Rendering & Main Section Centering

**Feature**: Ingest Modal Portal Rendering & Main Section Centering
**Branch**: `011-ingest-modal-portal-centering`
**Created**: 2026-09-06

## User Review Required

> [!IMPORTANT]
> The Dialog modal component will use React DOM `createPortal` to render directly into `document.body`. This un-nests the modal overlay from the sticky navigation header element stack, guaranteeing that the ingest modal displays cleanly in the vertical and horizontal center of the main page viewport without header clipping.

## Technical Context

- **Frontend**: React 19, `ReactDOM.createPortal`, TypeScript, Tailwind CSS, Lucide icons.
- **Component to Modify**:
  - `frontend/src/components/ui/dialog.tsx`: Wrap the overlay render in `createPortal(..., document.body)` so modals mount to the top-level document body.

## Proposed Changes

### UI Components

#### [MODIFY] [dialog.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/components/ui/dialog.tsx)
- Import `createPortal` from `react-dom`.
- Wrap the modal JSX in `createPortal(..., document.body)`.
- Ensure backdrop and container use `fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto`.

## Verification Plan

### Automated Tests
- Run TypeScript typecheck `npx tsc --noEmit` in `frontend/`.

### Manual Verification
- Click "Ingest" button in the top navigation header.
- Confirm the ingest modal mounts at the `document.body` level and appears in the exact center of the screen, with 0% clipping or overlap from the top bar navigation.
