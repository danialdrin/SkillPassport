# Tasks: Gemini Model & AFC Configuration Upgrade

## Phase 1: Setup & Configuration

- [X] T001 Update GEMINI_MODEL in [.env](file:///media/SharedMemory/project/final%20year%20project/1/.env) to `gemini-3.8-flash`
- [X] T002 Update GEMINI_MODEL default in [app/core/config.py](file:///media/SharedMemory/project/final%20year%20project/1/app/core/config.py) to `gemini-3.8-flash`

## Phase 2: User Story 1 - Gemini Model Upgrade (Priority: P1)

- [X] T003 [US1] Update fallback model string in [app/services/llm_service.py](file:///media/SharedMemory/project/final%20year%20project/1/app/services/llm_service.py) to `gemini-3.8-flash`

## Phase 3: User Story 2 - Disable Automatic Function Calling (AFC) (Priority: P2)

- [X] T004 [US2] Pass `automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True)` into `types.GenerateContentConfig` in [app/services/llm_service.py](file:///media/SharedMemory/project/final%20year%20project/1/app/services/llm_service.py)

## Phase 4: Polish & Verification

- [X] T005 [P] Run Python script calling `llm_service.call_llm` to verify clean execution and absence of AFC warnings
- [X] T006 [P] Verify zero occurrences of stale model strings across the codebase

## Dependencies & Execution Order

- **Phase 1**: Setup configuration
- **Phase 2 & 3**: Service updates in `app/services/llm_service.py`
- **Phase 4**: Verification tests
