# Feature Specification: Hero Greeting Font Size Increase & Button Removal

**Feature Branch**: `012-hero-greeting-size-remove-button`

**Created**: 2026-09-06

**Status**: Draft

**Input**: User description: "Increase 'Good evening, Dani' font size and delete the button below that."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Larger Hero Greeting & Streamlined Dashboard Header (Priority: P1)

As a user landing on the home dashboard, I want the personalized greeting text ("Good evening, Dani") to be rendered in a prominent, larger font size without an unnecessary duplicate ingest button underneath it, so that the header feels clean, elegant, and visually striking.

**Why this priority**: Directly addresses user visual hierarchy preference by emphasizing the personalized greeting while removing redundant hero actions (since Ingest is already accessible in the top bar).

**Independent Test**: Navigate to the home page. Verify that the greeting heading text is noticeably larger and bolder, and that the "+ Ingest Learning Material" button below the greeting subtitle is removed.

**Acceptance Scenarios**:

1. **Given** a user views the home page, **When** observing the hero greeting header, **Then** the font size of the greeting ("Good evening, Dani") is increased to a prominent large display scale (e.g., `text-4xl` / `text-5xl`).
2. **Given** a user views the home page hero area, **When** checking below the greeting subtitle text, **Then** the primary "+ Ingest Learning Material" hero button is completely removed.

---

### Edge Cases

- What happens on mobile viewports? The greeting heading scales gracefully from large text on mobile to prominent display text on desktop without horizontal overflow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page greeting heading ("Good evening, {userName}") MUST display with an increased font size scale.
- **FR-002**: The "+ Ingest Learning Material" button located in the home hero section MUST be removed.
- **FR-003**: The space and layout margin below the greeting subtitle MUST be adjusted cleanly to maintain balanced vertical padding.

### Key Entities *(include if feature involves data)*

- **HeroHeaderLayout**: Configures the typographic scale and element composition of the dashboard home section.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of home page visits render the greeting heading at an increased display font size (at least 3.5rem / 4xl on desktop).
- **SC-002**: 0 hero ingest buttons rendered on the home page dashboard.

## Assumptions

- Navigation bar ingest button remains fully functional and accessible for ingesting custom material.
