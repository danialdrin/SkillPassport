# Research: UI Shell Refinement

## Decision: Reuse the existing shared shell and visual tokens

- **Decision**: Implement the refinement in the existing `TopBar` and `PageShell` components using current Tailwind utility classes, lucide icons, local Button/Input conventions, and existing color/type tokens.
- **Rationale**: The request explicitly limits scope to targeted UI refinement. The current shell already owns the relevant behavior, so extending it avoids duplicated navigation logic and preserves the established visual identity.
- **Alternatives considered**: A new layout or design-system abstraction was rejected because it would broaden the change and risk visual drift without solving a separate problem.

## Decision: Use a single responsive menu model across desktop and mobile

- **Decision**: Replace the always-visible authenticated navigation with one interactive Menu control and one menu content model containing exactly Skill Gap and Digital Passport. Use responsive positioning/width rules so the same destinations remain available at all supported viewport widths.
- **Rationale**: One source of truth prevents desktop/mobile navigation divergence and guarantees that Find & Ingest cannot reappear in one breakpoint. The existing `mobileMenuOpen` state and route-aware active styling provide a compatible starting pattern.
- **Alternatives considered**: Keeping separate desktop links and a mobile drawer was rejected because the requested top bar removes direct navigation items and requires the menu to own the destinations.

## Decision: Preserve route paths while changing labels

- **Decision**: Keep `/skill-graph` and `/passport` as the existing destinations, presenting the former as “Skill Gap” in the menu.
- **Rationale**: The feature requires preserving functionality and explicitly permits route preservation. No route-definition change is needed.
- **Alternatives considered**: Adding a new `/skill-gap` route was rejected because it would add redirect/compatibility work without user value.

## Decision: Widen the shared content container without removing readable constraints

- **Decision**: Replace the current narrow shared `max-w-6xl` shell constraint with a wider intentional container and retain responsive horizontal padding. Keep narrower text blocks locally constrained where readability requires it.
- **Rationale**: The current `PageShell` directly explains the excessive side whitespace. Adjusting the owning container fixes the cause rather than using negative margins or page-specific hacks.
- **Alternatives considered**: Full-width content and arbitrary negative margins were rejected because they would either harm reading width or create fragile layout behavior.

## Decision: Remove the shared footer at the shell boundary

- **Decision**: Delete the `PageShell` footer and its wrapper spacing/border while leaving local card/form action footers untouched.
- **Rationale**: The feature targets the global footer and its reserved space; `PageShell` is the single owner of that structure.
- **Alternatives considered**: Hiding footer content with CSS was rejected because it would leave dead structure and could preserve unwanted spacing.

## Decision: Validate with existing scripts plus manual responsive checks

- **Decision**: Use `npm run build` and `npm run lint` as automated checks, then manually verify navigation, absence requirements, routes, keyboard access, and horizontal overflow at representative viewport sizes.
- **Rationale**: The package defines build and lint scripts but no component-test runner. The feature is visual and interaction-oriented, so browser checks are required in addition to static validation.
- **Alternatives considered**: Adding a new test framework was rejected for this narrow shell change because it would expand dependencies and setup beyond the current project conventions.
