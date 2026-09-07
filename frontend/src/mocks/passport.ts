import { InterviewHistoryItem } from '../types/assessment';
import { GapRecommendationResponse, PassportResponse } from '../types/passport';

export const mockPassport: PassportResponse = {
  user_id: 'mock-student-001',
  updated_at: '2026-08-28T09:30:00Z',
  nodes: [
    { node_id: 'skill-typescript', display_name: 'TypeScript', description: 'Typed application development and reusable interfaces.', bloom_level: 'Evaluate', competency_score: 88, last_updated: '2026-08-28T09:30:00Z', evidence_event_ids: ['quiz-ts-01', 'interview-ts-01', 'quiz-ts-02'] },
    { node_id: 'skill-react', display_name: 'React', description: 'Component architecture, hooks, and state-driven UI.', bloom_level: 'Apply', competency_score: 82, last_updated: '2026-08-25T14:10:00Z', evidence_event_ids: ['quiz-react-01', 'project-react-01'] },
    { node_id: 'skill-api-design', display_name: 'API Design', description: 'Resource modeling, validation, and reliable HTTP contracts.', bloom_level: 'Apply', competency_score: 74, last_updated: '2026-08-21T11:45:00Z', evidence_event_ids: ['interview-api-01', 'quiz-api-01'] },
    { node_id: 'skill-sql', display_name: 'SQL', description: 'Query composition, joins, and practical data modeling.', bloom_level: 'Understand', competency_score: 68, last_updated: '2026-08-18T16:20:00Z', evidence_event_ids: ['quiz-sql-01'] },
    { node_id: 'skill-testing', display_name: 'Testing', description: 'Focused unit tests and behavior-oriented integration checks.', bloom_level: 'Apply', competency_score: 61, last_updated: '2026-08-15T10:05:00Z', evidence_event_ids: ['quiz-test-01', 'interview-test-01'] },
    { node_id: 'skill-system-design', display_name: 'System Design', description: 'Scalable services, boundaries, and trade-off reasoning.', bloom_level: 'Analyze', competency_score: 54, last_updated: '2026-08-12T13:50:00Z', evidence_event_ids: ['interview-system-01'] },
    { node_id: 'skill-caching', display_name: 'Caching', description: 'Cache invalidation, TTL strategy, and consistency choices.', bloom_level: 'Understand', competency_score: 43, last_updated: '2026-08-10T08:15:00Z', evidence_event_ids: ['quiz-cache-01'] },
  ],
};

export const mockPassportGaps: GapRecommendationResponse = {
  user_id: 'mock-student-001',
  gaps: [
    { node_id: 'skill-system-design', display_name: 'System Design', competency_score: 54, recommended_prerequisites: ['API Design', 'Caching'] },
    { node_id: 'skill-caching', display_name: 'Caching', competency_score: 43, recommended_prerequisites: ['SQL', 'API Design'] },
  ],
};

export const mockInterviewHistory: InterviewHistoryItem[] = [
  {
    session_id: 'mock-session-system-001',
    resource_id: 'resource-system-design',
    status: 'completed',
    turns_count: 3,
    created_at: '2026-08-27T10:15:00Z',
    turns: [
      {
        turn_index: 1,
        question: 'How would you design a URL shortener for high read traffic?',
        answer: 'I would use a stateless API, a database for mappings, and a cache for popular URLs.',
        evaluation: { question_id: 'q-system-1', node_id: 'skill-system-design', feedback: 'Good core architecture; explain key generation and cache invalidation further.', raw_score: 0.82 },
        ts: '2026-08-27T10:16:00Z',
      },
      {
        turn_index: 2,
        question: 'What happens when the cache is unavailable?',
        answer: 'The service falls back to the database and applies rate limits to protect it.',
        evaluation: { question_id: 'q-system-2', node_id: 'skill-caching', feedback: 'Strong failure-mode reasoning and clear protection strategy.', raw_score: 0.9 },
        ts: '2026-08-27T10:18:00Z',
      },
      {
        turn_index: 3,
        question: 'Which metrics would you monitor?',
        answer: 'Latency, error rate, cache hit ratio, database load, and request volume.',
        evaluation: { question_id: 'q-system-3', node_id: 'skill-system-design', feedback: 'Covers the most important operational signals.', raw_score: 0.86 },
        ts: '2026-08-27T10:20:00Z',
      },
    ],
  },
];