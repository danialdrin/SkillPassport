import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '../api/exams';
import { ClientQuestion, AttemptResponse } from '../types/assessment';
import { PageShell } from '../components/layout/PageShell';
import { QuestionRenderer } from '../components/assessment/QuestionRenderer';
import { QuizResultsView } from '../components/assessment/QuizResultsView';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Alert } from '../components/ui/alert';
import { ArrowLeft, ChevronRight, Loader2, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const QuizPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isMockResource = resourceId?.startsWith('mock-resource-') === true;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submissionResult, setSubmissionResult] = useState<AttemptResponse | null>(null);

  // Start Adaptive Quiz Query
  const {
    data: quizData,
    isLoading: quizLoading,
    isError: quizIsError,
    error: quizError,
    refetch: refetchQuiz,
  } = useQuery({
    queryKey: ['exam-quiz', resourceId],
    queryFn: () => isMockResource
      ? Promise.resolve({
          assessment_id: `mock-assessment-${resourceId}`,
          questions: [
            { question_id: 'mock-q-1', type: 'mcq' as const, prompt: 'Which Python feature is used to group reusable code?', options: ['A function', 'A loop', 'A comment', 'A variable'], node_id: 'skill-python-basics', target_bloom: 'understand' },
            { question_id: 'mock-q-2', type: 'short_answer' as const, prompt: 'Explain one practical use for a Python dictionary.', node_id: 'skill-python-data', target_bloom: 'apply' },
            { question_id: 'mock-q-3', type: 'code_explain' as const, prompt: 'What does this expression return: [x * 2 for x in range(3)]?', node_id: 'skill-python-syntax', target_bloom: 'analyze' },
          ],
        })
      : examsApi.startQuiz(resourceId!),
    enabled: !!resourceId,
  });

  // Submit Quiz Mutation
  const submitMutation = useMutation({
    mutationFn: (answersArray: Array<{ question_id: string; user_answer: string }>) => {
      if (!quizData?.assessment_id) throw new Error('Missing assessment ID');
      if (isMockResource) {
        return Promise.resolve({
          attempt_id: `mock-attempt-${resourceId}`,
          assessment_id: quizData.assessment_id,
          user_id: user?.email || 'arul@gmail.com',
          score: Math.round((answersArray.filter((answer) => answer.user_answer.trim()).length / answersArray.length) * 100),
          per_question_result: answersArray.map((answer) => ({ question_id: answer.question_id, raw_score: answer.user_answer.trim() ? 1 : 0, feedback: answer.user_answer.trim() ? 'Answer recorded for mock evaluation.' : 'No answer provided.', node_id: 'skill-python-basics' })),
          created_at: new Date().toISOString(),
        });
      }
      return examsApi.submitQuiz(quizData.assessment_id, { answers: answersArray });
    },
    onSuccess: (attempt) => {
      // Invalidate passport queries on submit
      queryClient.invalidateQueries({ queryKey: ['passport'] });
      queryClient.invalidateQueries({ queryKey: ['passport-gaps'] });
      queryClient.invalidateQueries({ queryKey: ['student-graph'] });
      setSubmissionResult(attempt);
    },
  });

  if (!resourceId) return null;

  const questions: ClientQuestion[] = quizData?.questions || [];
  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (val: string) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.question_id]: val,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    const formattedAnswers = questions.map((q) => ({
      question_id: q.question_id,
      user_answer: userAnswers[q.question_id] || '',
    }));
    submitMutation.mutate(formattedAnswers);
  };

  const handleRetake = () => {
    setSubmissionResult(null);
    setUserAnswers({});
    setCurrentIndex(0);
    refetchQuiz();
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <Link to={`/resources/${resourceId}`}>
            <Button variant="outline" size="sm" className="h-8 px-2.5">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Study
            </Button>
          </Link>
          <div>
            <span className="text-[11px] font-mono uppercase text-ink-muted block">
              Adaptive Evaluation Engine
            </span>
            <h1 className="font-serif text-xl font-bold text-ink">Adaptive Skill Exam</h1>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {quizLoading && (
        <div className="max-w-2xl mx-auto space-y-4 py-8">
          <Skeleton className="h-8 w-48 bg-line/40 mx-auto" />
          <Skeleton className="h-64 w-full bg-surface rounded-sm" />
        </div>
      )}

      {/* Error state */}
      {quizIsError && (
        <div className="max-w-2xl mx-auto py-8 space-y-4">
          <Alert variant="error">
            <span>Failed to initialize quiz: {(quizError as { detail?: string }).detail || 'Resource not analyzed yet. Run Strong Analysis first.'}</span>
          </Alert>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetchQuiz()}>
              Retry Start
            </Button>
            <Link to={`/resources/${resourceId}`}>
              <Button variant="primary" size="sm">Go to Resource Study</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Submission Results State */}
      {submissionResult ? (
        <QuizResultsView
          attempt={submissionResult}
          resourceId={resourceId}
          onRetake={handleRetake}
        />
      ) : questions.length > 0 && currentQuestion ? (
        /* Question Stepper View */
        <div className="max-w-2xl mx-auto space-y-6">
          <QuestionRenderer
            question={currentQuestion}
            value={userAnswers[currentQuestion.question_id] || ''}
            onChange={handleAnswerChange}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
          />

          {/* Stepper Navigation Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              Previous Question
            </Button>

            {currentIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                disabled={!userAnswers[currentQuestion.question_id]?.trim()}
              >
                Next Question <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                variant="mastered"
                size="sm"
                onClick={handleSubmit}
                disabled={submitMutation.isPending || !userAnswers[currentQuestion.question_id]?.trim()}
              >
                {submitMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <Send className="w-4 h-4 mr-1" />
                )}
                {submitMutation.isPending ? 'Grading Assessment...' : 'Submit Assessment'}
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </PageShell>
  );
};
