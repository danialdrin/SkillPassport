# Research: Student Skill Intelligence Frontend

## Decision: React + Vite + TypeScript

**Rationale**: The frontend is an authenticated client-side application with no SSR requirement. Vite gives a small fast build, while TypeScript makes the many backend response variants explicit at the API boundary.

**Alternatives considered**: Next.js adds server-rendering and routing infrastructure that the current backend/API-only scope does not need.

## Decision: Tailwind CSS with the supplied token system

**Rationale**: The design specifies named mastery and surface tokens, responsive breakpoints, and a compact component vocabulary. Tailwind keeps those tokens close to the UI without introducing a second component design system.

**Alternatives considered**: A component library would accelerate generic controls but would make the asymmetric academic-report visual language harder to preserve.

## Decision: TanStack Query for server state and polling

**Rationale**: Resources, graph data, passport data, AI panels, and background jobs are server-owned state. Query caching, invalidation, retry, and conditional `refetchInterval` directly match the required flows.

**Alternatives considered**: Hand-written effects would duplicate loading/error/cache logic across pages; Redux would add global state machinery for data that is already server state.

## Decision: Context plus localStorage for authentication

**Rationale**: The backend exposes a bearer token with no refresh endpoint. A small AuthContext can hydrate `/auth/me`, clear invalid tokens, and protect routes without introducing another state library.

**Alternatives considered**: Cookies require backend changes and Redux/Zustand is unnecessary for the single-session client state.

## Decision: Typed API envelopes with defensive unknown-content adapters

**Rationale**: Stable backend envelopes such as auth, jobs, resources, and assessments can be typed. LLM-generated summary, flashcard, quiz, and interview bodies must remain `unknown` at the transport boundary and be normalized with safe fallbacks.

**Alternatives considered**: Assuming one fixed LLM JSON shape would make panels crash when provider output changes.

## Decision: SVG for home graph and a bounded full-graph layout

**Rationale**: The home graph needs no heavy dependency. The full graph can use a dedicated layout implementation only if node counts require it; preview nodes stay capped for readability and performance.

**Alternatives considered**: Shipping a force-graph dependency for every screen increases bundle and interaction complexity before scale requires it.

## Decision: Contract and manual-flow validation against a live backend

**Rationale**: Existing backend tests do not comprehensively cover the frontend endpoint contract. A quickstart walkthrough plus API client tests should validate auth, error handling, job polling, assessment state, and secret hygiene.

**Alternatives considered**: Relying only on visual smoke tests would miss request shapes and `401`/`503` behavior.
