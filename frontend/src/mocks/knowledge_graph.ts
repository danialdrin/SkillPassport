import { StudentKGResponse } from "../types/knowledge_graph";

export const mockStudentKnowledgeGraph: StudentKGResponse = {
  user_id: "mock-student-001",
  skills: [
    {
      node_id: "skill-typescript",
      display_name: "TypeScript",
      competency_score: 88,
      last_updated: "2026-08-28T09:30:00Z",
      evidence_event_ids: ["quiz-ts-01", "interview-ts-01", "quiz-ts-02"],
    },
    {
      node_id: "skill-react",
      display_name: "React",
      competency_score: 82,
      last_updated: "2026-08-25T14:10:00Z",
      evidence_event_ids: ["quiz-react-01", "project-react-01"],
    },
    {
      node_id: "skill-api-design",
      display_name: "API Design",
      competency_score: 74,
      last_updated: "2026-08-21T11:45:00Z",
      evidence_event_ids: ["interview-api-01", "quiz-api-01"],
    },
    {
      node_id: "skill-sql",
      display_name: "SQL",
      competency_score: 68,
      last_updated: "2026-08-18T16:20:00Z",
      evidence_event_ids: ["quiz-sql-01"],
    },
    {
      node_id: "skill-testing",
      display_name: "Testing",
      competency_score: 61,
      last_updated: "2026-08-15T10:05:00Z",
      evidence_event_ids: ["quiz-test-01", "interview-test-01"],
    },
    {
      node_id: "skill-system-design",
      display_name: "System Design",
      competency_score: 54,
      last_updated: "2026-08-12T13:50:00Z",
      evidence_event_ids: ["interview-system-01"],
    },
    {
      node_id: "skill-caching",
      display_name: "Caching",
      competency_score: 43,
      last_updated: "2026-08-10T08:15:00Z",
      evidence_event_ids: ["quiz-cache-01"],
    },
    {
      node_id: "skill-observability",
      display_name: "Observability",
      competency_score: 32,
      last_updated: "2026-08-06T15:40:00Z",
      evidence_event_ids: ["quiz-observe-01"],
    },
  ],
};
