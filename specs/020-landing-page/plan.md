# Implementation Plan: Landing Page

## Architecture & Layout Plan
1. **Route Restructuring**:
   - `/`: Renders `LandingPage` (public landing page).
   - `/home`: Renders `Home` dashboard (protected workspace page).
   - Header detects auth state to show "Go to Dashboard" if logged in, or "Sign In" / "Get Started" if unauthenticated.

2. **Components**:
   - `WaterWaveSkillCard.tsx`: SVG animated liquid wave container filling card height to match percentage score.
   - `LandingHero.tsx`: Headline, CTAs, and floating passport card deck with liquid wave visuals.
   - `LandingSections.tsx`: Implementation of narrative sections (Problem/Solution, Resource Intelligence, Knowledge Graph, AI Tutor preview, Programming Intelligence, Passport Showcase, Skill Gap, Career Readiness, Institutions, Final CTA, Footer).
   - `Landing.tsx`: Page wrapper with smooth scrolling navigation handlers.

3. **Visual Design Tokens**:
   - Theme variables: `--color-paper` (`#EEF2ED`), `--color-surface` (`#F5F7F3`), `--color-ink` (`#1C2430`), `--color-mastered` (`#2F6F5E`), `--color-developing` (`#C99A3E`), `--color-gap` (`#A63D2F`).
   - Fonts: `font-serif`, `font-mono`, `font-sans`.
