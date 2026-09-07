# Frontend API Contract

All routes below require `Authorization: Bearer <access_token>` except register and login. The client base URL is `VITE_API_BASE_URL`; request and response bodies are JSON unless stated otherwise.

## Authentication

| Method | Path             | Request                     | Response                       |
| ------ | ---------------- | --------------------------- | ------------------------------ |
| POST   | `/auth/register` | `{ name, email, password }` | `201`: user profile            |
| POST   | `/auth/login`    | `{ email, password }`       | `{ access_token, token_type }` |
| GET    | `/auth/me`       | none                        | user profile                   |

Register surfaces `400 Email already registered`; login surfaces `401 Incorrect email or password`.

## Resources and jobs

| Method | Path                                   | Request                   | Response                                   |
| ------ | -------------------------------------- | ------------------------- | ------------------------------------------ |
| POST   | `/search`                              | `{ query, page_token? }`  | `{ candidates, next_page_token? }`         |
| POST   | `/search/{resource_id}/analyze-medium` | none                      | resource with medium analysis              |
| POST   | `/resources/{resource_id}/select`      | none                      | `{ resource_id, status, job_id, message }` |
| POST   | `/resources/upload`                    | multipart `file` or `url` | resource/job reference                     |
| GET    | `/resources`                           | none                      | current user resource array                |
| GET    | `/jobs/{job_id}`                       | none                      | job state/result/error                     |

Job polling stops on `done` or `failed`; successful results contain `analysis_id` and `resource_id`. A search `503` is rendered as a distinct unavailable state.

## Study data

| Method | Path                                      | Response                                         |
| ------ | ----------------------------------------- | ------------------------------------------------ |
| GET    | `/analyses/{analysis_id}`                 | analysis with transcript/text and extracted data |
| GET    | `/knowledge-graph/material/{analysis_id}` | material graph nodes and edges                   |
| GET    | `/resources/{resource_id}/summary`        | untyped summary JSON                             |
| GET    | `/resources/{resource_id}/flashcards`     | untyped flashcard JSON                           |
| GET    | `/resources/{resource_id}/quiz`           | untyped casual quiz JSON                         |

## Competency and assessments

| Method | Path                                   | Request           | Response                           |
| ------ | -------------------------------------- | ----------------- | ---------------------------------- |
| GET    | `/knowledge-graph/student/{user_id}`   | none              | student graph                      |
| GET    | `/passport/{user_id}`                  | none              | passport nodes and route timestamp |
| GET    | `/passport/{user_id}/gaps`             | none              | gap list                           |
| POST   | `/exams/quiz/start`                    | `{ resource_id }` | assessment and questions           |
| POST   | `/exams/quiz/{assessment_id}/submit`   | `{ answers }`     | score and per-question results     |
| POST   | `/exams/interview/start`               | `{ resource_id }` | interview session/question         |
| POST   | `/exams/interview/{session_id}/answer` | `{ answer }`      | evaluation, next question, status  |
| GET    | `/exams/interview/history/{user_id}`   | none              | optional interview history         |

The frontend invalidates passport, gaps, and student graph queries after assessment completion. Interactive endpoints are authenticated but should only be called with IDs already received for the current user.
