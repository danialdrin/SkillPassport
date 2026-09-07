import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { interactiveApi } from '../../api/interactive';
import { Skeleton } from '../ui/skeleton';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';
import { HelpCircle, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export interface PracticeQuizPanelProps {
  resourceId: string;
}

export const PracticeQuizPanel: React.FC<PracticeQuizPanelProps> = ({ resourceId }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});

  const {
    data: quizData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['practice-quiz', resourceId],
    queryFn: () => interactiveApi.getPracticeQuiz(resourceId),
    enabled: !!resourceId,
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-28 w-full bg-surface" />
        <Skeleton className="h-28 w-full bg-surface" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 space-y-3">
        <Alert variant="error">
          <span>Failed to load practice quiz: {(error as { detail?: string }).detail || 'API error'}</span>
        </Alert>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry Practice Quiz
        </Button>
      </div>
    );
  }

  const questions = quizData?.quiz || [];

  if (questions.length === 0) {
    return (
      <div className="p-6 bg-surface border border-line rounded-sm text-center">
        <HelpCircle className="w-6 h-6 text-ink-muted mx-auto mb-2" />
        <p className="text-xs text-ink-muted">No practice quiz questions generated for this resource.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Explicit Ungraded Notice */}
      <div className="p-3 bg-surface border border-line rounded-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase bg-paper px-2 py-0.5 border border-line rounded-xs font-semibold text-ink-muted">
            Casual Study
          </span>
          <span className="text-ink-muted">Ungraded practice questions (does not update skill passport score).</span>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const selected = selectedAnswers[qIdx];
          const isRevealed = showExplanations[qIdx];

          return (
            <div key={qIdx} className="p-4 bg-surface border border-line rounded-sm space-y-3">
              <h4 className="font-serif font-semibold text-sm text-ink leading-snug">
                {qIdx + 1}. {q.question}
              </h4>

              {/* Options */}
              {q.options && q.options.length > 0 && (
                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selected === opt;
                    const isCorrect = q.answer && (opt.toLowerCase() === q.answer.toLowerCase() || q.answer.toLowerCase().startsWith(opt.toLowerCase()));

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [qIdx]: opt }))}
                        className={`w-full text-left p-2.5 rounded-xs border text-xs transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-paper border-ink text-ink font-semibold'
                            : 'bg-paper/50 border-line text-ink-muted hover:text-ink hover:border-ink/40'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-mastered" />}
                        {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-gap" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Answer & Explanation Toggle */}
              <div className="pt-2 border-t border-line flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowExplanations((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }))}
                  className="text-xs font-mono text-ink-muted hover:text-ink underline cursor-pointer"
                >
                  {isRevealed ? 'Hide Answer' : 'Show Answer & Explanation'}
                </button>

                {isRevealed && (
                  <span className="text-xs font-mono font-medium text-mastered">
                    Answer: {q.answer}
                  </span>
                )}
              </div>

              {isRevealed && q.explanation && (
                <div className="p-2.5 bg-paper border border-line rounded-xs text-xs text-ink-muted leading-relaxed">
                  <span className="font-mono text-[10px] uppercase text-ink block font-semibold">Explanation:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
