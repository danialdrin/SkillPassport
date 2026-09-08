# Tasks: 3D Skill Card Flip Interaction

- [ ] 1. Modify `WaterWaveSkillCard.tsx`
  - Implement 3D card layout (`h-[310px] w-full [perspective:1000px]`)
  - Implement Front Face (Water-wave liquid fill, score, status, evidence badge, `Hover to explore →`)
  - Implement Back Face (Header `CONCEPT NODES`, concept progress bars, `AI FOCUS` box for weakest node, footer metadata)
  - Remove button accordion & vertical expanding logic
  - Add mobile tap and keyboard focus support

- [ ] 2. Update `LandingHero.tsx`
  - Populate detailed concept node datasets for Python, Problem Solving, and Communication cards

- [ ] 3. Verification & Testing
  - Run TypeScript type checks (`npx tsc --noEmit`)
  - Run frontend build (`npm run build`)
  - Verify smooth 3D 180° flip on hover without layout shifts
