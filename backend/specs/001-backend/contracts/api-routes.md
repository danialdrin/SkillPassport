# API Interface Contracts Specification

All endpoints communicate using JSON request/response bodies and standard HTTP status codes. Authorized endpoints require `Authorization: Bearer <jwt_token>`.

---

## 1. Auth Router (`/auth`)

### `POST /auth/register`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "user_id": "64d0f1a2b...",
    "email": "jane@example.com",
    "message": "User registered successfully"
  }
  ```

### `POST /auth/login`
- **Description**: Authenticates user and returns JWT token.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
  ```

---

## 2. Search Router (`/search`)

### `POST /search`
- **Description**: Searches YouTube for candidate learning videos.
- **Request Body**:
  ```json
  {
    "query": "React Hooks tutorial",
    "page_token": "CAUQAA"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "candidates": [
      {
        "resource_id": "64d0f2b...",
        "video_id": "dQw4w9WgXcQ",
        "title": "React Hooks Explained in 15 Mins",
        "channel": "Code Academy",
        "thumbnail": "https://i.ytimg.com/..."
      }
    ],
    "next_page_token": "CBQQAA"
  }
  ```

### `POST /search/{resource_id}/analyze-medium`
- **Description**: Triggers zero-LLM local SentenceTransformer scoring for a candidate video.
- **Response (200 OK)**:
  ```json
  {
    "resource_id": "64d0f2b...",
    "status": "medium_analyzed",
    "scores": {
      "relevance": 0.85,
      "topic_coverage": 0.78,
      "depth": 0.65,
      "examples": 0.70,
      "clarity": 0.82,
      "structure": 0.90,
      "redundancy": 0.20,
      "overall": 77.4
    }
  }
  ```

---

## 3. Resources Router (`/resources`)

### `POST /resources/{resource_id}/select`
- **Description**: Selects a candidate video for deep analysis and kicks off background Strong Analysis job.
- **Response (200 OK)**:
  ```json
  {
    "resource_id": "64d0f2b...",
    "status": "selected",
    "job_id": "64d0f3c..."
  }
  ```

### `POST /resources/upload`
- **Description**: Uploads a PDF document (or direct YouTube URL) for immediate background Strong Analysis.
- **Form Data**:
  - `file`: PDF file stream OR `url`: string
- **Response (201 Created)**:
  ```json
  {
    "resource_id": "64d0f4d...",
    "title": "React_Hooks_Documentation.pdf",
    "status": "selected",
    "job_id": "64d0f3c..."
  }
  ```

---

## 4. Analysis Router (`/analyses`, `/jobs`)

### `GET /jobs/{job_id}`
- **Description**: Polls status of long-running asynchronous Strong Analysis job.
- **Response (200 OK)**:
  ```json
  {
    "job_id": "64d0f3c...",
    "status": "processing", // "queued" | "processing" | "done" | "failed"
    "result": null,
    "error": null
  }
  ```

### `GET /analyses/{analysis_id}`
- **Description**: Fetches completed deep semantic analysis output.
- **Response (200 OK)**: Returns full extracted topics, concepts, bloom levels, and relationships schema.

---

## 5. Knowledge Graph Router (`/knowledge-graph`)

### `GET /knowledge-graph/material/{analysis_id}`
- **Description**: Returns concept map nodes and edges extracted from a specific resource analysis.

### `GET /knowledge-graph/student/{user_id}`
- **Description**: Returns personal skill tree joining student competency state with concept metadata.

---

## 6. Interactive Router (`/resources/{resource_id}/...`)

### `GET /resources/{resource_id}/summary`
- **Description**: Fetches summary (Redis-cached key `summary:{analysis_id}:{version}`).

### `GET /resources/{resource_id}/quiz`
- **Description**: Fetches practice quiz questions (Redis-cached).

### `GET /resources/{resource_id}/flashcards`
- **Description**: Fetches flashcards (Redis-cached).

---

## 7. Exams Router (`/exams`)

### `POST /exams/quiz/start`
- **Request Body**: `{ "resource_id": "64d0f2b..." }`
- **Response (200 OK)**: Returns assessment questions (without answer keys).

### `POST /exams/quiz/{assessment_id}/submit`
- **Request Body**: `{ "answers": [{ "question_id": "q1", "user_answer": "useState" }] }`
- **Response (200 OK)**: Graded results with partial scores and updated competency events.

### `POST /exams/interview/start`
- **Request Body**: `{ "resource_id": "64d0f2b..." }`
- **Response (200 OK)**: `{ "session_id": "...", "question": "Can you explain how useEffect cleanup functions work?" }`

### `POST /exams/interview/{session_id}/answer`
- **Request Body**: `{ "answer": "Cleanup functions run before the component unmounts..." }`
- **Response (200 OK)**: `{ "evaluation": { "raw_score": 0.85, "feedback": "..." }, "next_question": "..." }`

---

## 8. Digital Skill Passport Router (`/passport`)

### `GET /passport/{user_id}`
- **Response (200 OK)**: Full passport document containing nodes with current competency scores and linked evidence event IDs.

### `GET /passport/{user_id}/gaps`
- **Response (200 OK)**: Filtered list of nodes where `competency_score < 60`, with prerequisite traversal recommendations.
