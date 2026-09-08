# Implementation Plan: Gemini Model & AFC Configuration Upgrade

**Feature Branch**: `003-gemini-model-upgrade`
**Status**: Approved

## User Stories & Scope

1. **US1 (P1)**: Upgrade default model to `gemini-3.8-flash` in `.env`, `config.py`, and `llm_service.py`.
2. **US2 (P2)**: Eliminate old stale model strings (`gemini-2.0-flash`, `gemini-3.6-flash`).
3. **US3 (P2)**: Disable Automatic Function Calling (AFC) in `llm_service.py` via `AutomaticFunctionCallingConfig(disable=True)`.

## Proposed Changes

### Configuration & Environment
- Update `GEMINI_MODEL=gemini-3.8-flash` in [.env](file:///media/SharedMemory/project/final%20year%20project/1/.env)
- Update `GEMINI_MODEL` default in [app/core/config.py](file:///media/SharedMemory/project/final%20year%20project/1/app/core/config.py)

### Services
- Update fallback model name in [app/services/llm_service.py](file:///media/SharedMemory/project/final%20year%20project/1/app/services/llm_service.py)
- Pass `automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True)` into `types.GenerateContentConfig` inside `llm_service.py`'s `call_llm` method.

## Verification
- Execute test script invoking `llm_service.call_llm()` and confirm output works with zero AFC warnings.
- Confirm zero stale model strings exist in codebase.
