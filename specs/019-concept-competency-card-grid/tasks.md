# Tasks: Concept Competency Card Grid Redesign

- [ ] 1. Create `ConceptCompetencyCard.tsx` component with 180° 3D CSS flip support
  - Implement front face (Name, Description, Bloom level badge, Competency Score & Tier status)
  - Implement back face / Evidence Panel (Last Evaluated date, Evidence event count with singular/plural text)
  - Add score-based visual accents (Mastered / Developing / Needs Work)
  - Add mobile tap and keyboard focus support for flip interaction
  - Ensure zero layout shifting or dimension mismatch during flip

- [ ] 2. Create `ConceptCompetencyGrid.tsx` with responsive layout and pagination
  - Implement desktop 5-column grid layout (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`)
  - Implement 15 items per page client-side pagination with Previous/Next controls
  - Preserve search input and tier filter functionality ('all', 'mastered', 'developing', 'gap')
  - Add Skeleton loading grid (10–15 placeholders matching card dimensions) and Empty state
  - Ensure card flip state resets when switching pages

- [ ] 3. Refactor `PassportNodeTable.tsx`
  - Update `PassportNodeTable.tsx` to render `ConceptCompetencyGrid` while maintaining interface compatibility

- [ ] 4. Verification and Testing
  - Run TypeScript compiler checks (`npx tsc --noEmit`)
  - Verify card grid layout (5 columns, 15 cards per page on desktop)
  - Test 180° flip interaction for zero flickering or layout shifts on hover and mobile tap
