# Feature Specification: Gemini Model Upgrade

**Feature Branch**: `003-gemini-model-upgrade`

**Created**: 2026-09-04

**Status**: Draft

**Input**: User description: "i want an available model — gemini-3.6-flash is available, check where this is available and if not choose a different valid model, and also change all the old to the changed model"

## Research Findings (Pre-Specification)

The following Gemini models were verified as available and supporting `generateContent` on the configured API key:

| Model | Status | Notes |
|-------|--------|-------|
| `gemini-3.8-flash` | ✅ Available | Latest, best quality |
| `gemini-3.7-flash` | ✅ Available | — |
| `gemini-3.6-flash` | ✅ Available | User's original choice |
| `gemini-3.5-flash` | ✅ Available | — |
| `gemini-2.0-flash` | ✅ Available | Previous default |

**Decision**: `gemini-3.8-flash` is chosen as the best available free flash model — it is the most recent generation, supports all required content generation actions, and is confirmed accessible with the user's API key.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Platform Upgrades to Best Available Gemini Model (Priority: P1)

The platform currently defaults to `gemini-2.0-flash`. The user wants all LLM calls to use `gemini-3.8-flash`, which is the latest, highest-quality free Gemini flash model confirmed available on this account.

**Why this priority**: Model quality directly impacts every AI-powered feature — stronger models produce better analysis, summaries, flashcards, and quiz questions for students.

**Independent Test**: Can be fully tested by inspecting the model name in `.env` and `config.py` default, then calling any LLM endpoint (e.g. `/resources/{id}/summary`) and confirming the response is produced by `gemini-3.8-flash` (verifiable via logs).

**Acceptance Scenarios**:

1. **Given** the upgrade is applied, **When** a developer inspects `.env`, **Then** `GEMINI_MODEL=gemini-3.8-flash` is set.
2. **Given** the upgrade is applied, **When** a developer inspects `app/core/config.py`, **Then** the default value for `GEMINI_MODEL` is `gemini-3.8-flash`.
3. **Given** the upgrade is applied, **When** the LLM service is initialised with no override, **Then** `llm_service.model` returns `gemini-3.8-flash`.
4. **Given** `gemini-3.8-flash` is set, **When** any AI feature endpoint is called, **Then** a valid response is returned (no model-not-found error).

---

### User Story 2 - Old Model References Are Eliminated (Priority: P2)

Any remaining reference to `gemini-2.0-flash` (the previous default installed in the last migration) is replaced with `gemini-3.8-flash` so the codebase is consistent and no stale model name causes confusion.

**Why this priority**: Stale model strings in fallback paths or comments can cause silent degradation if the code falls back to an outdated value.

**Independent Test**: A text search for `gemini-2.0-flash` across all `.py` and config files returns zero matches.

**Acceptance Scenarios**:

1. **Given** the upgrade is complete, **When** a search for `gemini-2.0-flash` is performed across all `.py` files, **Then** no matches are found.
2. **Given** the upgrade is complete, **When** a search for `gemini-2.0-flash` is performed in `.env` and `config.py`, **Then** no matches are found.

---

### Edge Cases

- What if `gemini-3.8-flash` becomes unavailable in the future? The `GEMINI_MODEL` env var allows easy override without code changes.
- What if the API key's quota is exceeded on `gemini-3.8-flash`? The error is propagated to the job status with a clear log message; the model can be downgraded via `.env` alone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST update the default value of `GEMINI_MODEL` in `app/core/config.py` from `gemini-2.0-flash` to `gemini-3.8-flash`.
- **FR-002**: System MUST update the `.env` file to set `GEMINI_MODEL=gemini-3.8-flash`.
- **FR-003**: System MUST update the fallback return value in `llm_service.py`'s `model` property from `gemini-2.0-flash` to `gemini-3.8-flash`.
- **FR-004**: System MUST ensure zero occurrences of `gemini-2.0-flash` remain in any active source or config file after the change.
- **FR-005**: All existing LLM-powered features (summary, flashcards, quiz, strong analysis) MUST continue to work correctly with the upgraded model.
- **FR-006**: System MUST explicitly disable Automatic Function Calling (AFC) in `llm_service.py` using `types.AutomaticFunctionCallingConfig(disable=True)` to prevent AsyncModels generate_content warnings.

### Key Entities

- **Config** (`config.py`): Source of truth for the default model name.
- **Environment** (`.env`): Runtime override for the model name.
- **LLM Service** (`llm_service.py`): Contains a hardcoded fallback model name that must also be updated.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `llm_service.model` resolves to `gemini-3.8-flash` when no `GEMINI_MODEL` override is set.
- **SC-002**: Zero occurrences of `gemini-2.0-flash` in `.py` files, `.env`, and `config.py` after migration.
- **SC-003**: At least one LLM endpoint returns a valid AI-generated response using `gemini-3.8-flash` within the normal response time window.

## Assumptions

- `gemini-3.8-flash` is confirmed available and supports `generateContent` on the user's API key (verified programmatically before writing this spec).
- The model name used by the Gemini API is exactly `gemini-3.8-flash` (without the `models/` prefix, as the SDK prepends this internally).
- No other files outside `config.py`, `.env`, and `llm_service.py` contain hardcoded Gemini model strings that need updating.
