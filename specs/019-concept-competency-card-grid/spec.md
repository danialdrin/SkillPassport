# Feature Specification: Concept Competency Card Grid Redesign

## Objective
Redesign the existing dense HTML table in the **Concept Competency** section of the Digital Skill Passport into an interactive, high-end **Knowledge Card Grid**.

## Core Requirements
1. **Desktop Grid**:
   - Exactly 5 cards per row on desktop breakpoints (`xl:grid-cols-5`).
   - 15 concepts per page (3 rows × 5 cards).
2. **Card Structure**:
   - **Front Face**:
     - Concept/Skill Name (`node.display_name`).
     - Short description (`node.description`), clamped to 2-3 lines.
     - Bloom Taxonomy Level badge (`node.bloom_level`).
     - Competency score (`node.competency_score`) & score status text.
   - **Back Face (Evidence Panel)**:
     - "Last Evaluated" date (formatted consistently, e.g. `7 Sep 2026`).
     - "Evidence" count with correct pluralization (`1 Event` vs `N Events`).
     - Score tier accent visual continuity.
3. **180° Flip Interaction**:
   - 180° Y-axis rotation on desktop hover (500–700ms transition duration).
   - Outer card container with `perspective: 1000px` to prevent flickering.
   - Mobile touch fallback (tap to flip).
   - Keyboard navigation (`tabIndex={0}` + Enter/Space to flip).
   - `prefers-reduced-motion` compliance.
4. **Pagination**:
   - 15 items per page.
   - Previous/Next navigation controls with current page indicator.
   - Disables Previous on page 1, disables Next on last page.
   - Resets flipped state of cards when switching pages.
5. **Score Visual Identity**:
   - 80–100: Mastered (Emerald accent border/tint)
   - 60–79: Developing (Amber accent border/tint)
   - 0–59: Needs Work (Rose accent border/tint)
6. **Data & Component Integrity**:
   - Preserves all existing APIs, calculations, and data contracts (`PassportNodeItem`).
