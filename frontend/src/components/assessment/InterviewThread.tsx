import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '../../api/exams';
import { InterviewTurnResponse, QuestionResultItem } from '../../types/assessment';
import { InterviewTurnItem } from './InterviewTurnItem';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Alert } from '../ui/alert';
import { Send, Loader2, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface InterviewThreadProps {
  resourceId: string;
}

interface CompletedTurn {
  turnIndex: number;
  question: string;
  answer: string;
  evaluation?: QuestionResultItem | null;
}

export const InterviewThread: React.FC<InterviewThreadProps> = ({ resourceId }) => {
  const queryClient = useQueryClient();

  const [turns, setTurns] = useState<CompletedTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [turnIndex, setTurnIndex] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');

  // Start Interview Query
  const {
    isLoading: startLoading,
    isError: startIsError,
    error: startError,
    refetch: refetchStart,
  } = useQuery({
    queryKey: ['interview-start', resourceId],
    queryFn: async () => {
      const turn = await examsApi.startInterview(resourceId);
      setSessionId(turn.session_id);
      setCurrentQuestion(turn.question || 'Tell me about what you learned.');
      setTurnIndex(turn.turn_index);
      setIsCompleted(false);
      setTurns([]);
      return turn;
    },
    enabled: !!resourceId,
    staleTime: Infinity,
  });

  // Answer Turn Mutation
  const answerMutation = useMutation({
    mutationFn: (answerText: string) => {
      if (!sessionId) throw new Error('No active session ID');
      return examsApi.answerInterviewTurn(sessionId, answerText);
    },
    onSuccess: (res: InterviewTurnResponse) => {
      // Record completed turn
      setTurns((prev) => [
        ...prev,
        {
          turnIndex,
          question: currentQuestion || '',
          answer: currentAnswer,
          evaluation: res.evaluation,
        },
      ]);
      setCurrentAnswer('');

      // Check if interview concluded
      if (res.status === 'completed' || !res.question) {
        setIsCompleted(true);
        setCurrentQuestion(null);
        // Invalidate passport queries on interview complete
        queryClient.invalidateQueries({ queryKey: ['passport'] });
        queryClient.invalidateQueries({ queryKey: ['passport-gaps'] });
        queryClient.invalidateQueries({ queryKey: ['student-graph'] });
      } else {
        setCurrentQuestion(res.question);
        setTurnIndex(res.turn_index);
      }
    },
  });

  const handleSendAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || answerMutation.isPending) return;
    answerMutation.mutate(currentAnswer.trim());
  };

  if (startLoading) {
    return (
      <div className="space-y-4 p-4 max-w-2xl mx-auto">
        <Skeleton className="h-24 w-full bg-surface" />
        <Skeleton className="h-24 w-full bg-surface" />
      </div>
    );
  }

  if (startIsError) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-3">
        <Alert variant="error">
          <span>Failed to start interview: {(startError as { detail?: string }).detail || 'Resource not analyzed yet. Run Strong Analysis first.'}</span>
        </Alert>
        <Button variant="outline" size="sm" onClick={() => refetchStart()}>
          Retry Start
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Turn Progress Header */}
      <div className="flex items-center justify-between p-3 bg-surface border border-line rounded-sm text-xs font-mono">
        <span>INTERVIEW_SESSION: {sessionId ? sessionId.slice(-8) : 'ACTIVE'}</span>
        <span>
          {isCompleted ? 'STATUS: COMPLETED (5/5 TURNS)' : `TURN: ${turnIndex} / 5`}
        </span>
      </div>

      {/* Historical Turns */}
      <div className="space-y-4">
        {turns.map((turn) => (
          <InterviewTurnItem
            key={turn.turnIndex}
            turnIndex={turn.turnIndex}
            question={turn.question}
            answer={turn.answer}
            evaluation={turn.evaluation}
          />
        ))}
      </div>

      {/* Active Turn Form */}
      {!isCompleted && currentQuestion && (
        <form onSubmit={handleSendAnswer} className="space-y-3 p-4 bg-surface border border-line rounded-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-ink-muted font-semibold block">
              Active Question &bull; Turn {turnIndex}
            </span>
            <p className="font-serif text-sm font-semibold text-ink leading-relaxed">
              {currentQuestion}
            </p>
          </div>

          <textarea
            rows={4}
            placeholder="Type your response to the interviewer. Provide technical details, rationale, or code logic..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full p-3 bg-paper border border-line rounded-sm text-xs sm:text-sm text-ink placeholder:text-ink-muted/50 focus:border-ink focus-visible:outline-none font-sans"
            disabled={answerMutation.isPending}
          />

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={answerMutation.isPending || !currentAnswer.trim()}
            >
              {answerMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
              ) : (
                <Send className="w-3.5 h-3.5 mr-1" />
              )}
              {answerMutation.isPending ? 'Evaluating Response...' : 'Send Response'}
            </Button>
          </div>
        </form>
      )}

      {/* Completion Summary Card */}
      {isCompleted && (
        <div className="p-6 bg-mastered/10 border border-mastered/30 rounded-sm text-center space-y-4">
          <div className="p-3 bg-mastered/20 text-mastered rounded-full w-12 h-12 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-ink">Interview Session Completed</h3>
            <p className="text-xs text-ink-muted leading-relaxed max-w-md mx-auto mt-1">
              You answered all 5 technical interview turns. Your evidence evaluations have updated relevant node scores in your Digital Skill Passport.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Link to={`/resources/${resourceId}`}>
              <Button variant="outline" size="sm">Back to Study</Button>
            </Link>
            <Link to="/passport">
              <Button variant="primary" size="sm">
                View Updated Passport <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
