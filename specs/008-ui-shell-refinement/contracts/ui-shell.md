# UI Shell Contract

This contract defines the observable behavior of the shared frontend shell after the refinement. It is a browser-facing UI contract, not a backend API contract.

## Authenticated Top Bar

The authenticated top bar MUST expose these regions in order:

1. Interactive Menu control
2. Logo link to `/`
3. Search input
4. Profile control at the far right

The top bar MUST NOT expose direct top-level entries for Overview, Find & Ingest, Skill Gap, or Digital Passport outside the Menu.

## Menu Contents

When an authenticated user opens Menu, the menu MUST contain exactly these primary destinations:

| Label            | Existing route | Expected behavior                                              |
| ---------------- | -------------- | -------------------------------------------------------------- |
| Skill Gap        | `/skill-graph` | Navigates to the existing skill graph page and closes the menu |
| Digital Passport | `/passport`    | Navigates to the existing passport page and closes the menu    |

The menu MUST NOT contain Find & Ingest or Overview.

## Search

The search input remains in the top bar, keeps its existing visual language, and adapts in width at narrower breakpoints without causing horizontal overflow or obscuring the logo/profile controls.

## Profile

The authenticated profile area remains a simple right-side control using existing account/logout behavior. No unrelated labels, badges, or new account workflows are required.

## Shared Page Shell

- The global footer is absent.
- Footer content, footer links, footer border, and footer-only spacing are absent.
- Main content retains responsive side padding.
- The shared container is wider than the existing narrow constraint on desktop/laptop screens while local readable content widths remain intentional.

## Accessibility

- Menu has an accessible name and exposes its expanded/collapsed state.
- Search has an accessible label or equivalent meaningful name.
- Menu destinations are keyboard reachable.
- Focus-visible styling remains visible.
- The menu can be dismissed without trapping keyboard focus.
