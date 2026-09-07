import React from 'react';
import { QuestionResultItem } from '../../types/assessment';
import { Bot, User, CheckCircle2 } from 'lucide-react';

export interface InterviewTurnItemProps {
  turnIndex: number;
  question: string;
  answer?: string;
  evaluation?: QuestionResultItem | null;
}

export const InterviewTurnItem: React.FC<InterviewTurnItemProps> = ({
  turnIndex,
  question,
  answer,
  evaluation,
}) => {
  return (
    <div className="space-y-3 p-4 bg-surface border border-line rounded-sm">
      {/* AI Interviewer Turn Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-ink text-paper rounded-xs shrink-0 mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-ink-muted block font-semibold">
            Turn {turnIndex} &bull; AI Technical Interviewer
          </span>
          <p className="font-serif text-sm font-semibold text-ink leading-relaxed">
            {question}
          </p>
        </div>
      </div>

      {/* Student Answer */}
      {answer && (
        <div className="flex items-start gap-3 pl-6 pt-2 border-t border-line/60">
          <div className="p-1.5 bg-paper border border-line rounded-xs text-ink shrink-0 mt-0.5">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-ink-muted block">
              Your Response
            </span>
            <p className="text-xs text-ink leading-relaxed font-sans">{answer}</p>
          </div>
        </div>
      )}

      {/* Turn Evaluation Feedback */}
      {evaluation && (
        <div className="p-3 bg-mastered/10 border border-mastered/30 rounded-xs text-xs space-y-1 ml-6">
          <div className="flex items-center justify-between text-mastered font-mono font-semibold">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Turn Evaluated
            </span>
            <span>Raw Credit: {Math.round(evaluation.raw_score * 100)}%</span>
          </div>
          <p className="text-ink font-sans leading-normal">{evaluation.feedback}</p>
        </div>
      )}
    </div>
  );
};
