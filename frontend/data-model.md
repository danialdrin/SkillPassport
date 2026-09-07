# Frontend Data Model

The frontend models API data at the client boundary. Backend persistence remains authoritative; these are view and cache shapes, not new database entities.

## UserSession

- `accessToken: string`
- `user: User | null`
- `status: "loading" | "authenticated" | "anonymous"`

`User` contains `user_id`, `name`, `email`, and `created_at`. Registration and login are public; `/auth/me` hydrates an existing token. Any `401` transitions the session to anonymous and redirects to login.

## Resource

- `resource_id`, `user_id`, `source_type`, `url_or_file`, `title`, `created_at`
- `status: "pending" | "medium_analyzed" | "selected" | "strong_analyzed"`
- optional `medium_analysis`

Resource ownership is established by the authenticated list/search/select/upload flows. The UI must not accept arbitrary resource IDs from user input.

## Job

- `job_id`, `type`, `status: "queued" | "processing" | "done" | "failed"`
- optional `result: { analysis_id, resource_id }`
- optional `error`, `created_at`

State transition: `queued -> processing -> done|failed`. Poll at approximately two-second intervals only while active.

## Analysis and MaterialGraph

`Analysis` contains `analysis_id`, `resource_id`, `transcript_or_text`, `version`, `created_at`, and `extracted_data` with topics, concepts, relationships, and important sections.

`MaterialGraph` contains nodes with `node_id`, `display_name`, `description`, `type`, `bloom_level`, `parent_id`, and `prerequisite_ids`, plus typed edges. The resource detail mindmap selects a primary topic and directly related/`part_of` nodes.

## Competency and PassportGap

Competency nodes include `display_name`, `competency_score` in `0..100`, `last_updated`, and evidence references. Gaps are competency nodes below `60` and include recommended prerequisite names. Scores are always displayed with their semantic label; color is never the only signal.

## AssessmentState

Quiz state stores `assessment_id`, questions, and local answers keyed by `question_id`. Supported question types are `mcq`, `short_answer`, and `code_explain`. Submission returns an overall score and per-question results.

Interview state stores `session_id`, ordered turns, optional evaluation, and status. The UI ends only when the response is `status: "completed"` with `question: null`.

## UntypedInteractiveContent

Summary, flashcards, casual quiz, and interview content are treated as `unknown` responses. Normalizers provide empty-state and retryable-error views when expected optional fields are absent. The casual quiz is explicitly labeled ungraded because answers are exposed.
