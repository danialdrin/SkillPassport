# Feature Specification: UI Shell Refinement

**Feature Branch**: `008-ui-shell-refinement`

**Created**: 2026-09-06

**Status**: Draft

**Input**: User description: "Make targeted UI changes to the existing student website: reduce excessive horizontal whitespace, remove the Overview section and footer, reorganize the top navigation as Menu, Logo, Search, Profile, move Skill Gap and Digital Passport into the menu, remove Find & Ingest from all navigation, preserve existing routes and visual identity, and verify responsive behavior."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Navigate from a focused top bar (Priority: P1)

As an authenticated student, I want a simple top bar with the menu before the logo, a prominent search input, and my profile control at the far right so that I can orient myself and reach common destinations without a crowded header.

**Why this priority**: The top bar is present on every authenticated view and directly affects navigation, orientation, and available screen space.

**Independent Test**: Open any authenticated page on desktop and mobile, confirm the visual order and interact with the menu, search input, and profile control.

**Acceptance Scenarios**:

1. **Given** an authenticated student is viewing a page, **When** the top bar renders, **Then** its order is Menu, Logo, Search, Profile from left to right, with the profile control remaining on the far right.
2. **Given** the student opens the menu, **When** the menu is visible, **Then** it provides access to Skill Gap and Digital Passport and does not provide Find & Ingest.
3. **Given** the student selects Skill Gap or Digital Passport from the menu, **When** navigation completes, **Then** the existing destination and behavior remain available.
4. **Given** the student uses the search input at a desktop, tablet, or mobile width, **When** the viewport changes, **Then** the input adapts without overlapping, hiding, or compressing the logo and profile control beyond usability.

### User Story 2 - Use the workspace without redundant overview chrome (Priority: P1)

As a student, I want the redundant Overview section removed so that the remaining learning workspace begins naturally and keeps attention on current study information and actions.

**Why this priority**: Removing duplicate overview content is a core scope requirement and should reduce vertical noise without removing unrelated student workflows.

**Independent Test**: Open the home workspace, verify that Overview headings, overview-only cards/content, and overview-only navigation are absent, then confirm the remaining content starts without a vacant placeholder or excess gap.

**Acceptance Scenarios**:

1. **Given** the student opens the home workspace, **When** the page loads, **Then** no Overview heading, overview-only section, or Overview navigation item is shown.
2. **Given** the Overview section has been removed, **When** the remaining workspace renders, **Then** adjacent content moves into its place without an empty reserved region or orphaned spacing.
3. **Given** the student opens the home workspace, **When** they use remaining learning actions and panels, **Then** those unrelated workflows remain available and visually coherent.

### User Story 3 - Make better use of available width (Priority: P2)

As a student using a laptop or desktop, I want the workspace to use more of the available viewport while retaining comfortable side padding so that the interface feels spacious rather than surrounded by large empty margins.

**Why this priority**: The current horizontal constraint makes the application feel unnecessarily narrow and reduces the usefulness of the main workspace.

**Independent Test**: Compare the workspace at desktop, laptop, tablet, and mobile widths; verify that the main content expands on wider screens, keeps readable internal widths, and never touches the viewport edges.

**Acceptance Scenarios**:

1. **Given** a desktop or laptop viewport, **When** the main workspace renders, **Then** excessive left and right whitespace is reduced and the content uses the available width more effectively.
2. **Given** a tablet or mobile viewport, **When** the main workspace renders, **Then** horizontal padding remains comfortable, content does not overflow, and no desktop-only width assumption breaks the layout.
3. **Given** content that benefits from a readable line length, **When** the wider layout renders, **Then** text and focused reading areas retain an intentional readable width instead of becoming arbitrarily full-width.

### User Story 4 - End the page without a footer (Priority: P2)

As a student, I want the page to end after the main workspace rather than reserving a footer area that does not support my current task.

**Why this priority**: Removing the footer is an explicit shell simplification and prevents unnecessary vertical space after the useful content.

**Independent Test**: Scroll to the end of authenticated and unauthenticated page shells and verify that footer content, links, borders, and footer-specific spacing are absent.

**Acceptance Scenarios**:

1. **Given** any page that uses the shared shell, **When** the student reaches the end of the page, **Then** no footer content or footer navigation is rendered.
2. **Given** the footer is removed, **When** the page ends, **Then** no empty footer-sized gap or footer-only border remains.

### Edge Cases

- On a narrow mobile viewport, the menu trigger, logo, search control, and profile control must remain usable without horizontal scrolling.
- When the menu is open and the viewport changes size, the navigation must remain dismissible and must not leave an inaccessible overlay or duplicated menu.
- When a student is unauthenticated, the existing sign-in and registration actions must continue to work without exposing authenticated menu destinations.
- The removed Find & Ingest label must not remain in either desktop navigation, mobile navigation, menu content, or overview-only actions that are part of navigation.
- Removing the footer must not remove footer-like action areas that belong to individual cards or forms and are unrelated to the shared page shell.
- Existing destinations for Skill Gap and Digital Passport must continue to resolve without broken links.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The website MUST preserve the established visual identity, including existing typography, colors, spacing language, component styling, and motion behavior except where changes are required to implement this feature.
- **FR-002**: The authenticated top navigation MUST present controls in the order Menu, Logo, Search, Profile, with the profile control aligned to the far right when space permits.
- **FR-003**: The Menu control MUST be interactive and MUST expose Skill Gap and Digital Passport as the remaining primary destinations.
- **FR-004**: The website MUST remove Find & Ingest from every top-navigation and menu presentation while preserving any unrelated learning workflow that is not a navigation entry.
- **FR-005**: The website MUST remove the Overview heading, Overview-specific content, Overview-only cards, and Overview-only navigation affordances without leaving an empty placeholder.
- **FR-006**: The website MUST retain access to the student workspace and all unrelated learning content that is not specific to the removed Overview section.
- **FR-007**: The main layout MUST reduce the current excessive left and right whitespace by increasing effective content width and removing the underlying unnecessary width constraint, margin, padding, or grid limitation causing it.
- **FR-008**: The main layout MUST retain reasonable viewport padding and readable content widths so wider screens feel spacious rather than cramped or indiscriminately full-width.
- **FR-009**: The layout MUST adapt across desktop, laptop, tablet, and mobile widths without horizontal overflow, clipped controls, or unusable spacing.
- **FR-010**: The search input MUST remain in the top navigation, remain visually prominent without dominating the bar, and adapt at smaller breakpoints without obscuring the logo or profile control.
- **FR-011**: The profile control MUST remain visually simple, remain on the far right of the top navigation where the layout allows, and MUST NOT gain unrelated text, badges, or controls.
- **FR-012**: The shared page shell MUST remove the footer, its content, its navigation/links, its border, and its footer-specific spacing without affecting local action areas elsewhere in the interface.
- **FR-013**: Existing Skill Gap and Digital Passport destinations MUST remain functional after the navigation restructure.
- **FR-014**: The changed navigation and shell MUST remain accessible by keyboard and expose meaningful accessible names for the Menu, Search, Profile, and dismiss controls.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In a review of authenticated desktop and mobile pages, 100% of the required top-level navigation order checks pass: Menu precedes Logo, Search remains in the bar, and Profile remains the rightmost user control.
- **SC-002**: In a navigation review, 100% of checks find Skill Gap and Digital Passport reachable through the Menu and find zero Find & Ingest entries in top-level navigation or menu content.
- **SC-003**: In a page-shell review across home, study, graph, passport, login, and registration views, 100% of checks find no shared footer content, footer-only spacing, or footer-only border.
- **SC-004**: At desktop and laptop widths, the main workspace visibly uses more available horizontal space than the current shell while preserving nonzero side padding and readable text regions.
- **SC-005**: At representative desktop, laptop, tablet, and mobile widths, 100% of responsive checks complete without horizontal scrolling, clipped navigation controls, or overlapping Menu, Logo, Search, and Profile controls.
- **SC-006**: In a focused task walkthrough, students can open the menu and reach either remaining destination within two interactions from any authenticated page.
- **SC-007**: In stakeholder review, the changed screens are judged consistent with the existing visual identity, with no newly introduced decorative elements, broad redesign patterns, or unrelated controls.

## Assumptions

- “Skill Gap” is the requested user-facing navigation label for the existing skill-graph/skill-gap destination; its underlying destination and behavior are preserved.
- The home route remains the authenticated student workspace; only Overview-specific presentation and navigation are removed, while unrelated learning panels and actions remain unless they are exclusively part of Overview.
- The existing search capability and profile behavior are reused; this feature does not introduce new search semantics, account settings, or profile workflows.
- Existing authentication and destination permissions remain unchanged.
- Responsive verification uses representative desktop, laptop, tablet, and mobile viewport sizes supported by the current application.
- No backend data model or API behavior changes are required for this UI-only refinement.
