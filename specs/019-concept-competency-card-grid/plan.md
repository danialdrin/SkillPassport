# Implementation Plan: Concept Competency Card Grid Redesign

## Architecture & Layout Plan
1. **Component Modularization**:
   - `ConceptCompetencyCard.tsx`: Individual 3D card component with front/back faces, score accents, CSS perspective, hover flip, touch tap handler, and keyboard event handlers.
   - `ConceptCompetencyGrid.tsx`: Grid wrapper with search/filter, pagination state (15 items/page), responsive grid layout (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`), skeleton loader, and empty state.
   - `PassportNodeTable.tsx`: Refactored entry point delegating to `ConceptCompetencyGrid` while maintaining signature.

2. **Card Dimensions & CSS 3D**:
   - Fixed footprint: `h-[210px] w-full` on container, front, and back faces to guarantee zero layout shifts during flip.
   - `perspective: 1000px` on wrapper, `transform-style: preserve-3d` on card inner element, `backface-visibility: hidden` on faces.
   - `rotateY(180deg)` for back face default and inner element when flipped/hovered.

3. **Pagination Logic**:
   - Page size: `const PAGE_SIZE = 15`.
   - Active page state: `const [currentPage, setCurrentPage] = useState(1)`.
   - Slice filtered data: `filteredNodes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)`.
   - Reset `currentPage` to `1` whenever filter or search query changes.

4. **Visual Accent System**:
   - Mastered (`>= 80`): `border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400`
   - Developing (`60-79`): `border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400`
   - Needs Work (`< 60`): `border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400`
