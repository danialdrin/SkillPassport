import React from 'react';
import { AttemptResponse } from '../../types/assessment';
import { ScoreChip } from '../dashboard/ScoreChip';
import { Button } from '../ui/button';
import { CheckCircle2, ArrowRight, Award, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface QuizResultsViewProps {
  attempt: AttemptResponse;
  resourceId: string;
  onRetake: () => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  attempt,
  resourceId,
  onRetake,
}) => {
  return (
    <div className="bg-surface border border-line rounded-sm p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
      {/* Header Result */}
      <div className="text-center space-y-2 pb-6 border-b border-line">
        <div className="inline-flex p-3 bg-mastered/10 text-mastered rounded-full mb-2">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink">Assessment Completed</h2>
        <p className="text-xs text-ink-muted leading-relaxed">
          Your responses were evaluated by the Competency Engine. Concept scores in your Skill Passport have been updated via Exponential Moving Average.
        </p>

        <div className="pt-3">
          <ScoreChip score={attempt.score} size="lg" />
        </div>
      </div>

      {/* Per Question Results & Feedback */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase text-ink-muted tracking-wider">
          Detailed Question Feedback
        </h3>

        <div className="space-y-3">
          {attempt.per_question_result.map((res, idx) => (
            <div key={idx} className="p-4 bg-paper border border-line rounded-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-ink">Question {idx + 1}</span>
                <span className="font-mono text-ink font-semibold">
                  Raw Credit: {Math.round(res.raw_score * 100)}%
                </span>
              </div>
              <p className="text-xs text-ink leading-relaxed font-sans">{res.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-line flex flex-col sm:flex-row gap-3 justify-between">
        <Button variant="outline" size="sm" onClick={onRetake}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retake Assessment
        </Button>
        <div className="flex gap-2">
          <Link to={`/resources/${resourceId}`}>
            <Button variant="secondary" size="sm">Back to Study</Button>
          </Link>
          <Link to="/passport">
            <Button variant="primary" size="sm">
              View Updated Passport <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
