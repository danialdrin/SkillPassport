# Tasks: UI Shell Refinement

**Input**: Design artifacts from `specs/008-ui-shell-refinement/`
**Prerequisites**: `plan.md`, `spec.md`, `contracts/ui-shell.md`, `quickstart.md`

## Phase 1: Setup and validation baseline

- [x] T001 Verify frontend scripts, ignore files, and current shared-shell files in `frontend/`
- [x] T002 [P] Run focused static assertions for required menu labels/routes and footer absence using the existing validation setup

## Phase 2: Shared top navigation

- [x] T003 Update `frontend/src/components/layout/TopBar.tsx` to use one authenticated Menu control before the logo and remove direct Overview, Find & Ingest, Skill Gap, and Digital Passport links
- [x] T004 Update `frontend/src/components/layout/TopBar.tsx` so the menu contains exactly Skill Gap -> `/skill-graph` and Digital Passport -> `/passport`, with active styling and close-on-selection behavior
- [x] T005 Update `frontend/src/components/layout/TopBar.tsx` to keep search between logo and profile, preserve anonymous auth actions, and support responsive sizing without overflow
- [x] T006 Update `frontend/src/components/layout/TopBar.tsx` for accessible menu naming/state, keyboard dismissal, and preserved focus-visible behavior

## Phase 3: Shared shell and workspace cleanup

- [x] T007 Update `frontend/src/components/layout/PageShell.tsx` to widen the shared content container while retaining responsive side padding
- [x] T008 Update `frontend/src/components/layout/PageShell.tsx` to remove the global footer, footer border, wrapper, and footer-only spacing
- [x] T009 Inspect and update `frontend/src/pages/Home.tsx` to remove Overview-only presentation and leftover spacing while preserving unrelated workspace panels and actions
- [x] T010 [P] Assess `frontend/src/index.css`; no change was required because existing responsive and focus-visible rules already covered the shell

## Phase 4: Verification and completion

- [x] T011 Run `npm run build` from `frontend/` and repair implementation errors in the touched slice
- [x] T012 Attempt `npm run lint` from `frontend/`; record that the script cannot run because `eslint` is not installed
- [x] T013 Verify the shell at 1440x900, 1280x800, 768x1024, and 390x844 for order, overflow, overlap, spacing, menu contents, and footer absence
- [x] T014 Verify Skill Gap and Digital Passport navigation routes, search presence, profile placement, Overview absence, and Find & Ingest absence against `contracts/ui-shell.md`
- [x] T015 Mark all completed tasks and record any environment-limited validation in the completion report

## Dependencies

- T001 must complete before implementation tasks.
- T003-T006 are sequential because they modify the same component.
- T007-T009 are sequential because shell width/footer and home spacing interact.
- T010 may run in parallel with T007-T009 only if no shared CSS conflict is introduced.
- T011-T012 follow all implementation tasks.
- T013-T014 follow the successful build and lint checks.
- T015 is the final task.

## Validation Notes

- `npm run build` passed.
- `npm run lint` was attempted but could not start because `eslint` is not installed in `frontend/node_modules` and no ESLint configuration is present.
- Browser checks passed at 1440x900, 1280x800, 768x1024, and 390x844 with no horizontal overflow, no global footer, no Overview/Find & Ingest labels, and a menu containing exactly Skill Gap and Digital Passport.
