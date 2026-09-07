# Feature Specification: Ingest Modal Centering & Recent Video Thumbnails

**Feature Branch**: `010-ingest-modal-centering-thumbnails`

**Created**: 2026-09-06

**Status**: Draft

**Input**: User description: "When I click the ingest button the component is at the top of the page with half of the component body out of the page. I want the component to come in the center of the page, remove the 3 cards (upload, link, paste), bring the text in the middle, and add the corresponding thumbnails in the recent videos list."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Centered Viewport Placement for Ingest Component (Priority: P1)

As a user clicking the ingest button, I want the ingest modal/dialog to open smoothly in the dead center of my screen (both vertically and horizontally) without being truncated or cut off at the top of the window, so that I can comfortably interact with it.

**Why this priority**: Solves a critical UI/UX positioning bug where half the dialog body was rendering off-screen above the viewport header.

**Independent Test**: Click the "Ingest" / "Upload Custom Material" button on any page. Verify the dialog overlay is vertically and horizontally centered in the browser viewport without clipping or top overflow.

**Acceptance Scenarios**:

1. **Given** a user clicks the ingest trigger button on any screen size, **When** the ingest component appears, **Then** it is rendered strictly in the vertical and horizontal center of the viewport.
2. **Given** the ingest modal is open, **When** the window is resized or scrolled, **Then** the modal stays anchored centrally without moving outside the visible screen boundaries.

---

### User Story 2 - Simplified & Centered Ingest Interface (Priority: P2)

As a user opening the ingest tool, I want a clean, single-focused form with centered text rather than 3 separate cards (upload, link, paste), so that ingesting custom material is straightforward and uncluttered.

**Why this priority**: Streamlines the UI workflow by removing unnecessary visual cards and focusing user attention on a central input experience.

**Independent Test**: Open the ingest modal. Verify the 3 separate cards (upload, link, paste) are replaced by a unified, centrally aligned interface with centered typography and input options.

**Acceptance Scenarios**:

1. **Given** the ingest modal opens, **When** viewing the modal layout, **Then** the 3 card choices (Upload, Link, Paste) are absent.
2. **Given** the ingest modal layout, **When** observing header titles, descriptions, and primary inputs, **Then** all primary typography and helper text are centered within the component.

---

### User Story 3 - Visual Thumbnails for Recent Videos (Priority: P3)

As a user reviewing recently ingested or processed videos within the interface, I want each item in the recent videos list to show its corresponding video thumbnail, so that I can visually identify learning materials.

**Why this priority**: Enhances content scannability and visual recognizability across learning materials.

**Independent Test**: Navigate to the recent videos section in the ingest modal or page. Verify that every listed video entry renders its associated thumbnail image alongside its title and metadata.

**Acceptance Scenarios**:

1. **Given** a list of recent videos, **When** rendered on screen, **Then** each video item displays its corresponding thumbnail image on the left side of its title.
2. **Given** a video item whose thumbnail image fails to load or is missing, **When** rendered, **Then** a clean fallback placeholder thumbnail is displayed without breaking the layout.

---

### Edge Cases

- What happens on small mobile viewports where the centered modal height exceeds the screen height? The modal maintains centered alignment while enabling internal vertical scrolling with padded margins to prevent clipping.
- What happens if a video in recent videos has no thumbnail URL? The system renders a styled video icon placeholder thumbnail with standard aspect ratio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The ingest modal dialog MUST position itself strictly in the vertical and horizontal center of the viewport upon opening.
- **FR-002**: The ingest modal container MUST NOT render with negative top offsets or overflow outside the top edge of the browser window.
- **FR-003**: The 3 option cards (Upload, Link, Paste) MUST be removed from the ingest modal interface in favor of a single unified input layout.
- **FR-004**: Modal text, headers, helper captions, and primary action controls MUST be aligned to the center of the component body.
- **FR-005**: Every video item displayed in the recent videos section MUST include its corresponding thumbnail image.
- **FR-006**: Video thumbnails in recent lists MUST maintain a consistent aspect ratio (e.g. 16:9 or 4:3) with smooth rounded corners.
- **FR-007**: Broken thumbnail image URLs MUST automatically degrade to a styled fallback placeholder image without throwing console errors.

### Key Entities *(include if feature involves data)*

- **IngestModalState**: Manages visibility, positioning mode (centered fixed flex/grid overlay), and active input parameters for custom material ingestion.
- **RecentVideoItem**: Represents a recently ingested video entity, including `resource_id`, `title`, `thumbnail`, `channel`, and `created_at` timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of ingest modal triggers center the component within visible viewport boundaries (0px top overflow clipping).
- **SC-002**: 0 instances of the 3 separate cards (upload, link, paste) rendered in the ingest modal.
- **SC-003**: 100% of text elements within the main ingest card body are centrally aligned.
- **SC-004**: 100% of items in the recent videos list render a valid thumbnail image or styled fallback thumbnail.

## Assumptions

- Tailwind fixed flex/grid overlay techniques (`fixed inset-0 flex items-center justify-center`) provide cross-browser viewport centering.
- Existing resource entities stored in database contain `thumbnail` or `url_or_file` attributes from YouTube or custom upload metadata.
