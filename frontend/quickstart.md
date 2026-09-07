# Frontend Validation Quickstart

## Prerequisites

- Node.js and npm installed.
- Backend running at `http://localhost:8000` with its own environment configured.
- A frontend `.env` containing `VITE_API_BASE_URL=http://localhost:8000`.

## Setup and checks

```bash
npm install
npm run dev
npm run build
```

The build must complete without exposing `MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, or `YOUTUBE_API_KEY` in source or generated assets.

## Manual acceptance flow

1. Register a new account; verify validation and duplicate-email errors.
2. Sign in, reload, and verify `/auth/me` restores the session. Open a protected route without a token and verify redirect to login.
3. Search for material. Verify candidates, client-side filters, pagination, and a distinct `503` unavailable message.
4. Analyze and select a candidate, or upload exactly one PDF/URL. Verify job polling displays active states and stops on completion or failure.
5. Open completed resource detail. Check transcript/chapters, analysis, material graph, summary, flashcards, and casual ungraded quiz independently.
6. Start an adaptive quiz and exercise `mcq`, `short_answer`, and `code_explain`; submit and verify per-question feedback.
7. Start an interview, answer until the backend returns `completed` with no question, and verify there is no manual end action.
8. Verify passport, gaps, home graph, and full graph refresh after assessment activity.
9. Repeat the key flows at a viewport below 768px and with keyboard navigation. Enable reduced motion and verify graph entrance animation is suppressed.

The endpoint shapes and state transitions are defined in [contracts/api.md](contracts/api.md); client-side entities and invariants are in [data-model.md](data-model.md).
