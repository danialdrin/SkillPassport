# Tasks: Landing Page Implementation

- [ ] 1. Create `WaterWaveSkillCard.tsx` component
  - Implement animated SVG liquid wave fill matching competency score percentage
  - Implement expandable sub-skills breakdown (e.g. React: Components 90%, Props 87%, State 72%, Hooks 64%, Context 51%, Routing 81%)

- [ ] 2. Create `LandingHero.tsx` component
  - Implement hero section with headline "Know what you know. Prove what you can do."
  - Render floating Digital Skill Passport interface featuring interactive `WaterWaveSkillCard` items

- [ ] 3. Create `LandingSections.tsx` component
  - Implement Learning Sources Convergence strip (YouTube, NPTEL, PDFs -> Passport)
  - Implement Problem & Solution Pipeline (Learn -> Understand -> Assess -> Verify -> Track -> Grow)
  - Implement How Resource Intelligence Works (Medium Analysis vs Strong Analysis)
  - Implement Interactive Knowledge Graph & Sub-skill visualizer
  - Implement Contextual AI Tutor & Assistant preview
  - Implement Assessment & Verification flow + Programming Intelligence 4 hint states & 6 code dimensions
  - Implement Living Digital Skill Passport Showcase & Skill Gap Intelligence (Cross-skill & Within-skill gaps)
  - Implement Career Readiness (Skills -> Roles & Role -> Skill gaps)
  - Implement External Learning Evidence Ingestion, Student Benefits, Read-only Institutional Capability Access, Final CTA & Footer

- [ ] 4. Create `Landing.tsx` page component & update `App.tsx` routing
  - Create `Landing.tsx` assembling header nav, hero, sections, and footer
  - Update `App.tsx` router so `/` renders `Landing` and `/home` renders protected `Home`

- [ ] 5. Verification & Testing
  - Run TypeScript type checks (`npx tsc --noEmit`)
  - Run frontend build (`npm run build`)
  - Verify landing page responsiveness, smooth scrolling, navigation links, and liquid wave animations
