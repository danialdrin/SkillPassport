# Feature Specification: Ingest Modal Portal Rendering & Main Section Centering

**Feature Branch**: `011-ingest-modal-portal-centering`

**Created**: 2026-09-06

**Status**: Draft

**Input**: User description: "When I click the ingest button the component should appear in the main section but now it's appearing in the nav itself."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Main Page Body Portal Centering for Ingest Modal (Priority: P1)

As a user clicking the "Ingest" button in the top navigation bar or anywhere on the site, I want the Ingest modal component to render directly in the center of the main page body via a DOM portal, so that it is never trapped inside, behind, or cut off by the navigation bar header.

**Why this priority**: Solves the layout bug where the modal was being rendered inside the `<header>` element stack, causing its header to be clipped or trapped inside the navigation bar.

**Independent Test**: Click the "Ingest" button in the top bar. Verify that the modal backdrop covers the entire window and the modal dialog is positioned in the exact vertical and horizontal center of the main page viewport, independent of header layout or scroll position.

**Acceptance Scenarios**:

1. **Given** a user clicks the "Ingest" button located in the top navigation bar, **When** the ingest component opens, **Then** the modal is mounted directly into the root document body (outside of `<header>`) and renders in the exact center of the main page viewport.
2. **Given** the modal is open, **When** inspecting the DOM structure, **Then** the dialog overlay is not a descendant of the sticky header navigation bar.
3. **Given** the ingest modal is open on any screen size, **When** viewing the modal header title ("Ingest Learning Material"), **Then** it is fully visible in the main page body without any overlap or clipping from the top navigation bar.

---

### Edge Cases

- What happens if the page is scrolled when clicking "Ingest" from the top bar? The backdrop locks scroll or overlays the visible viewport, positioning the modal centrally on screen.
- What happens if the user presses Escape or clicks outside the modal body? The modal closes cleanly and focus returns to the main page section.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The modal dialog component MUST render its DOM node at the root `document.body` level using a React DOM Portal (`createPortal`).
- **FR-002**: The modal backdrop and container MUST NOT inherit positioning, clipping, or z-index constraints from parent navigation or header elements.
- **FR-003**: The ingest modal dialog MUST appear in the center of the main viewport section with clear margins on all sides.
- **FR-004**: Clicking the "Ingest" button in the navigation bar MUST open the portal-rendered ingest dialog centered in the main page area.

### Key Entities *(include if feature involves data)*

- **PortalDialogOverlay**: Mounts the dialog backdrop and modal content container into `document.body` to detach from navigation layout boundaries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of modal instances triggered from top bar navigation render outside the `<header>` DOM hierarchy.
- **SC-002**: 0px overlap between top navigation bar and ingest modal header text.
- **SC-003**: 100% of ingest modal viewports render in the vertical and horizontal center of the screen.

## Assumptions

- React DOM `createPortal` is available in standard React 19 environment.
- Document body is available on client side when modal is open.
