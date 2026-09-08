# Tasks: Gemini API Migration

## Phase 1: Setup & Dependencies

- [X] TASK-001: Add `google-genai` to requirements.txt and install it
- [X] TASK-002: Create/verify .gitignore for Python project

## Phase 2: Core Configuration

- [X] TASK-003: Update `app/core/config.py` — replace OMNIROUTE_* settings with GEMINI_API_KEY and GEMINI_MODEL
- [X] TASK-004: Update `.env` — replace OMNIROUTE_* keys with GEMINI_API_KEY and GEMINI_MODEL=gemini-2.0-flash

## Phase 3: LLM Service Rewrite

- [X] TASK-005: Rewrite `app/services/llm_service.py` to use google-genai SDK (async client) instead of AsyncOpenAI+OmniRoute

## Phase 4: Comment/Description Cleanup

- [X] TASK-006: Update `app/main.py` description string to remove OmniRoute mention
- [X] TASK-007: Update `app/routers/interactive.py` comment "Generate via OmniRoute LLM" → Gemini
- [X] TASK-007b: Update `app/services/medium_analysis_service.py` docstring (no OmniRoute call)

## Phase 5: Validation

- [X] TASK-008: Verified zero OMNIROUTE references in .py files — CLEAN
- [X] TASK-009: Verified backend imports successfully, GEMINI_MODEL=gemini-2.0-flash, google-genai Client initialised
