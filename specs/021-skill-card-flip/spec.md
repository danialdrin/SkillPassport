# Feature Specification: Digital Skill Passport 3D Card Flip Interaction

## Objective
Convert `WaterWaveSkillCard.tsx` from a vertical accordion into a smooth two-sided 3D card (`perspective: 1000px`, `transform: rotateY(180deg)`).

## Core Requirements
1. **Card Dimensions**:
   - Fixed height (`h-[310px] w-full`) for both front and back faces. Zero vertical layout shifts or height expansion.
2. **Front Side**:
   - Skill name with competency status indicator (`● React`, `Developing → Strong`).
   - Prominent `76% COMPETENCY` display.
   - Low-opacity animated liquid water-wave fill background matching competency percentage.
   - Verification state (`✓ Verified Evidence` • `Continuous Evaluation`).
   - Hover hint (`Hover to explore →`).
3. **Back Side (Concept Node Intelligence)**:
   - Header: `CONCEPT NODES` with `[Skill Name] competency breakdown`.
   - 6 concept node progress bars with score & status label.
   - `AI FOCUS` box highlighting the weakest concept node (e.g. `Context API — 51%`).
   - Footer: `6 Concept Nodes • Verified through continuous assessment`.
4. **Interaction**:
   - 180° Y-axis rotation on hover.
   - Touch tap fallback for mobile devices.
   - Keyboard Space/Enter focus support.
