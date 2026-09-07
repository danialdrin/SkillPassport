# Feature Specification: TopBar Logo Removal and Search Bar Centering

**Feature Branch**: `016-remove-logo-topbar`

**Created**: 2026-09-07

**Status**: Draft

**Input**: User description: "look at the search input field and the ingest btn the section is in the center of the nav technically but not actually in the center because the elements in the right that is the menu and the logo are pushing the search to the left taking the search away from the center ... remove the logo entirely"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Remove Logo & Achieve True Viewport Centering for Search & Ingest Controls (Priority: P1)

As a student using the SkillPassport application, I want the central navigation container (Search input field + Ingest button) to be accurately centered in the top header relative to the entire screen width, without being offset to the left by brand logo elements.

**Why this priority**: Eliminates visual layout imbalance in the primary navigation header bar and ensures the primary search and ingest actions sit at the true visual midpoint of the screen.

**Independent Test**:
1. Log in to the application and view the top header navigation bar (`TopBar.tsx`).
2. Verify that the "SkillPassport Intelligence" logo mark and text are completely removed from the header.
3. Measure/verify that the search bar and "+ Ingest" button container is perfectly centered relative to the total width of the navigation bar container.

**Acceptance Scenarios**:

1. **Given** an authenticated user on any main application view, **When** viewing the top navigation header bar, **Then** the SkillPassport logo text and icon mark are not visible.
2. **Given** an authenticated user viewing the top navigation bar, **When** examining the menu icon on the left (36px width) and profile button on the right (36px width), **Then** the search input field and Ingest button are visually centered in the middle of the navbar.
3. **Given** an unauthenticated user on `/login` or `/register`, **When** viewing the top navigation bar, **Then** no logo is displayed and layout balance is preserved.

---

### Edge Cases

- **Mobile / Narrow Viewports**: On small screens, the menu toggle button remains on the left and the profile avatar remains on the right, while the search input and ingest button shrink gracefully in the center without overlapping or wrapping awkwardly.
- **Dropdown Menu Access**: The navigation menu toggle button remains fully functional on the left side of the header bar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Remove the `SkillPassport` logo block (`SP` avatar square + text labels) entirely from `TopBar.tsx`.
- **FR-002**: Align the left column containing the navigation menu toggle button (`w-9` / `h-9`) with equal effective layout weight as the right column containing the profile avatar (`w-9` / `h-9`).
- **FR-003**: Ensure the central search bar and Ingest button flex container (`flex-1 max-w-xl mx-auto justify-center`) calculates true center position across all viewport sizes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 instances of the SkillPassport logo rendering in `TopBar.tsx`.
- **SC-002**: Search input and Ingest button group is visually centered in `TopBar.tsx`.
