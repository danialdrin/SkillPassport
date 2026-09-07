# Feature Specification: Space Cards Resize & Recents Section Conditional Display

**Feature Branch**: `014-space-card-size-hide-empty-recents`

**Created**: 2026-09-06

**Status**: Draft

**Input**: User description: "Increase the size of the space cards. If there is no recents in the page then don't show that section, only show when it has anything to show."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Larger & More Prominent Space Cards (Priority: P1)

As a user organizing my learning spaces on the dashboard, I want the Space cards to be larger and more visually distinct, so that I can easily read space titles, count indicators, and interact with space actions.

**Why this priority**: Improves dashboard readability, scannability, and touch/click ergonomics for primary workspace components.

**Independent Test**: View the home page dashboard. Verify that Space cards feature increased width and height, larger title typography, and expanded card padding.

**Acceptance Scenarios**:

1. **Given** a user views the Spaces section on the home page, **When** observing Space cards, **Then** each card renders with expanded dimensions (larger width, height, and title typography).
2. **Given** a user creates a new space or edits an existing space, **When** interacting with the enlarged cards, **Then** all action menus and click triggers function smoothly.

---

### User Story 2 - Conditional Recents Section Display (Priority: P2)

As a user browsing the home page when I have no recent materials, I want the Recents section to be completely hidden rather than displaying an empty placeholder box, so that my dashboard stays clean and uncluttered.

**Why this priority**: Eliminates empty visual noise when no recent strong-analyzed items exist, ensuring the section only appears when relevant content is present.

**Independent Test**:
- Case A (0 items): Verify that when there are no recent strong-analyzed materials, the "Recents" section header and empty state box are completely hidden from the page layout.
- Case B (>0 items): Verify that as soon as 1 or more recent materials are available, the "Recents" section automatically appears and displays the cards.

**Acceptance Scenarios**:

1. **Given** the user has 0 recent strong-analyzed resources, **When** rendering the home page, **Then** the Recents section (including header and placeholder) is completely hidden.
2. **Given** the user has 1 or more recent strong-analyzed resources, **When** rendering the home page, **Then** the Recents section is displayed with the corresponding resource cards.

---

### Edge Cases

- What happens while recent resources are loading from the database? A minimal loading state/skeleton or smooth conditional render is shown without layout flicker.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Space cards MUST render with increased card width, height, padding, and text scale.
- **FR-002**: The Recents section MUST be hidden when there are 0 recent strong-analyzed resources available.
- **FR-003**: The Recents section MUST automatically display whenever 1 or more recent strong-analyzed resources are available.

### Key Entities *(include if feature involves data)*

- **SpaceCardComponent**: Manages rendering dimensions, styling, and interaction triggers for individual learning spaces.
- **RecentsSectionVisibility**: Controls conditional rendering of the Recents container based on active resource counts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Space cards display with expanded card dimensions (increased width and height).
- **SC-002**: 0 empty state placeholder boxes rendered for the Recents section when recent resource count is 0.
- **SC-003**: 100% of home page loads cleanly display the Recents section if and only if recent resource count > 0.

## Assumptions

- Tailwind styling parameters control card sizes.
