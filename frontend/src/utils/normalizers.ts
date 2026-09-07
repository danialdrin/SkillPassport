import { SummaryContent, FlashcardsContent, PracticeQuizContent, PracticeQuizQuestion } from '../types/interactive';

/**
 * Defensive normalizer for summary endpoint response.
 * Handles missing fields or non-standard JSON safely.
 */
export function normalizeSummary(raw: unknown): SummaryContent {
  if (!raw || typeof raw !== 'object') {
    return {
      title: 'Resource Summary',
      summary_points: ['Summary unavailable or format unsupported.'],
      key_takeaway: 'Key takeaway not extracted.',
    };
  }

  const obj = raw as Record<string, unknown>;

  const title = typeof obj.title === 'string' && obj.title.trim() ? obj.title : 'Resource Summary';

  let summary_points: string[] = [];
  if (Array.isArray(obj.summary_points)) {
    summary_points = obj.summary_points.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  } else if (Array.isArray(obj.bullets)) {
    summary_points = obj.bullets.filter((item): item is string => typeof item === 'string');
  } else if (typeof obj.summary === 'string') {
    summary_points = [obj.summary];
  }

  if (summary_points.length === 0) {
    summary_points = ['No detailed summary points extracted for this resource.'];
  }

  const key_takeaway = typeof obj.key_takeaway === 'string' && obj.key_takeaway.trim()
    ? obj.key_takeaway
    : (summary_points[0] || 'Main takeaway unavailable.');

  return {
    title,
    summary_points,
    key_takeaway,
  };
}

/**
 * Defensive normalizer for flashcards response.
 */
export function normalizeFlashcards(raw: unknown): FlashcardsContent {
  if (!raw || typeof raw !== 'object') {
    return { flashcards: [] };
  }

  const obj = raw as Record<string, unknown>;
  const rawCards = Array.isArray(obj.flashcards)
    ? obj.flashcards
    : Array.isArray(raw)
      ? raw
      : [];

  const flashcards = rawCards
    .map((card: unknown) => {
      if (!card || typeof card !== 'object') return null;
      const c = card as Record<string, unknown>;
      const front = typeof c.front === 'string' ? c.front : typeof c.question === 'string' ? c.question : '';
      const back = typeof c.back === 'string' ? c.back : typeof c.answer === 'string' ? c.answer : '';
      if (!front && !back) return null;
      return { front: front || 'Question', back: back || 'Answer' };
    })
    .filter((c): c is { front: string; back: string } => c !== null);

  return { flashcards };
}

/**
 * Defensive normalizer for casual practice quiz.
 */
export function normalizePracticeQuiz(raw: unknown): PracticeQuizContent {
  if (!raw || typeof raw !== 'object') {
    return { quiz: [] };
  }

  const obj = raw as Record<string, unknown>;
  const rawQuiz = Array.isArray(obj.quiz)
    ? obj.quiz
    : Array.isArray(obj.questions)
      ? obj.questions
      : [];

  const quiz: PracticeQuizQuestion[] = [];
  for (const item of rawQuiz) {
    if (!item || typeof item !== 'object') continue;
    const q = item as Record<string, unknown>;
    const question = typeof q.question === 'string' ? q.question : typeof q.prompt === 'string' ? q.prompt : '';
    let options: string[] = [];
    if (Array.isArray(q.options)) {
      options = q.options.filter((opt): opt is string => typeof opt === 'string');
    }
    const answer = typeof q.answer === 'string' ? q.answer : typeof q.correct_answer === 'string' ? q.correct_answer : '';
    const explanation = typeof q.explanation === 'string' ? q.explanation : undefined;

    if (question) {
      quiz.push({ question, options, answer, explanation });
    }
  }

  return { quiz };
}
