# Implementation Plan: 3D Card Flip Interaction

## Architecture & Layout Plan
1. **Component Design**:
   - `WaterWaveSkillCard.tsx`: Re-engineered as a 3D flip card with front and back faces using `perspective: 1000px`, `transform-style: preserve-3d`, and `backface-visibility: hidden`.
2. **Visual Accents & Color Palette**:
   - Mastered (`>= 80%`): `border-mastered/40 bg-surface-raised text-mastered`.
   - Developing (`60–79%`): `border-developing/40 bg-surface-raised text-developing`.
   - Gap (`< 60%`): `border-gap/40 bg-surface-raised text-gap`.
3. **Weakest Node AI Focus Calculation**:
   - Automatically computes the minimum score sub-skill to populate the `AI FOCUS` box on the back face.
