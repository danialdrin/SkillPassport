# Implementation Plan: UI Shell Refinement

## Project Structure

### Documentation (this feature)

```text
specs/008-ui-shell-refinement/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/ui-shell.md
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/layout/TopBar.tsx
│   ├── components/layout/PageShell.tsx
│   ├── pages/Home.tsx
│   ├── App.tsx
│   └── index.css
└── package.json
```

**Structure Decision**: Keep the change within the existing frontend shared-shell boundary. `TopBar.tsx` owns navigation/menu/profile presentation, `PageShell.tsx` owns the global container/footer, and `Home.tsx` is inspected only to ensure no Overview-only content or spacing remains. No backend, route-definition, or new design-system files are needed.

## Complexity Tracking

No constitution violations or additional complexity requiring justification.

## Technical Context

**Language/Version**: TypeScript with React and Vite

**Primary Dependencies**: Existing React Router, Tailwind CSS utilities, lucide-react icons, and local UI components

**Storage**: No new persistent storage; menu open/closed state remains transient component state

**Testing**: Existing frontend build and lint scripts, plus focused browser validation at desktop, laptop, tablet, and mobile widths

**Target Platform**: Modern desktop and mobile browsers at the current application breakpoints

**Project Type**: Existing authenticated single-page frontend

**Performance Goals**: Preserve current shell rendering and motion behavior; avoid adding layout shifts or new heavy dependencies

**Constraints**: Preserve established visual identity; keep existing routes; remove only the shared footer and requested navigation/Overview surfaces; do not change backend contracts

**Scale/Scope**: Shared authenticated/public shell refinement across pages using `PageShell` and `TopBar`; no domain data or API changes

## Constitution Check

The repository constitution is an unratified placeholder and defines no enforceable principles or gates. This plan complies with the feature constraints by keeping the change within the existing shared-shell boundary, preserving routes and visual tokens, and avoiding new dependencies or backend changes.

**Gate status**: PASS

## Implementation Design

### Top bar and menu

- Make the authenticated top bar a single responsive row with the required order: Menu, Logo, Search, Profile.
- Keep the existing logo link and profile/logout behavior, but replace direct desktop navigation with the interactive Menu control.
- Define the menu destinations once as `Skill Gap` -> `/skill-graph` and `Digital Passport` -> `/passport`; do not include Overview or Find & Ingest.
- Preserve route-aware active styling and close the menu after destination selection, logout, Escape, or equivalent dismissal.
- Keep the existing auth actions for anonymous users and ensure authenticated-only destinations are not exposed before login.
- Keep the search input in the shared top bar, using flexible width and breakpoint-specific sizing so it yields space without overlapping the logo or profile area.

### Shell width and footer

- Change the owning `PageShell` container constraint from the current narrow `max-w-6xl` value to the wider intentional width selected during implementation.
- Retain responsive horizontal padding and apply local readable-width constraints only where content needs them; do not add negative margins or full-width hacks.
- Remove the global `PageShell` footer element and its border, wrapper, and footer-only spacing.
- Leave card/form action footers elsewhere untouched.

### Overview removal

- Remove the Overview navigation entry from the shared destination model.
- Inspect `Home.tsx` for Overview-only heading/content and remove only those surfaces; preserve the student workspace panels and actions that remain in scope.
- Remove any resulting empty wrapper or spacing so the first remaining content begins naturally.

## File Impact

Expected implementation changes are limited to:

- `frontend/src/components/layout/TopBar.tsx`: menu source of truth, responsive top-bar structure, search placement, profile alignment, and dismissal behavior.
- `frontend/src/components/layout/PageShell.tsx`: wider shared container and removal of the global footer.
- `frontend/src/pages/Home.tsx`: removal of any Overview-only presentation or spacing discovered during implementation.
- `frontend/src/index.css`: only if a small existing global responsive/accessibility adjustment is required; avoid unrelated styling changes.

No changes are expected in `frontend/src/App.tsx`, backend files, API contracts, route definitions, or persistent data models.

## Implementation Phases

### Phase 1 - Update the shared top bar

1. Replace the current direct desktop navigation and mobile-only drawer trigger with the unified authenticated Menu control.
2. Reduce the destination collection to Skill Gap and Digital Passport while preserving existing paths and active states.
3. Place the existing search control in the flexible middle region and retain the profile/logout behavior at the right edge.
4. Preserve keyboard names, focus-visible styles, Escape/dismiss behavior, and anonymous auth actions.

### Phase 2 - Refine the shared shell

1. Widen the shared `PageShell` container based on the existing layout cause and preserve responsive side padding.
2. Remove the global footer and all of its shell-only spacing/border structure.
3. Verify pages using the shell retain natural vertical endings and do not inherit empty footer space.

### Phase 3 - Remove Overview remnants

1. Remove Overview-only heading, content, navigation, and spacing from the home workspace.
2. Confirm unrelated learning actions, graph preview, gaps, resources, and passport access remain available.
3. Confirm no Find & Ingest navigation label remains in either shared menu presentation.

### Phase 4 - Validate

1. Run `npm run build` and `npm run lint` from `frontend/`.
2. Run the browser acceptance walkthrough from `quickstart.md` against representative authenticated and unauthenticated screens.
3. Check 1440x900, 1280x800, 768x1024, and 390x844 for overflow, overlap, clipped controls, and incorrect menu contents.
4. Verify `/skill-graph` and `/passport` remain reachable from the menu and the search control remains present in the top bar.

## Risks and Mitigations

| Risk                                                                   | Mitigation                                                                                                                   |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Flexible top-bar regions compress the logo or profile at mobile widths | Use explicit minimum sizes and breakpoint-aware search width; validate at the 390px viewport.                                |
| Desktop and mobile menu implementations diverge                        | Keep one destination collection and one interaction model rather than separate link lists.                                   |
| Widening the shell makes text blocks too long                          | Preserve local readable-width constraints for text-heavy sections.                                                           |
| Removing the footer affects local card actions                         | Change only the footer owned by `PageShell`; leave component-level action footers unchanged.                                 |
| Overview removal accidentally removes useful student actions           | Treat existing home panels as retained unless they are explicitly Overview-only, then validate the remaining workspace flow. |

## Definition of Done

- All functional requirements in `spec.md` are represented by the implementation and acceptance walkthrough.
- Build and lint pass without new errors.
- Menu, Logo, Search, Profile order is usable at all four viewport classes.
- Menu contains Skill Gap and Digital Passport only; Find & Ingest and Overview are absent from navigation.
- The shared footer and its reserved space are absent.
- Existing Skill Gap and Digital Passport routes still load.
- The widened shell reduces desktop/laptop side whitespace without touching viewport edges or causing overflow.
