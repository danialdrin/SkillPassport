import React from 'react';
import { ClientQuestion } from '../../types/assessment';
import { Badge } from '../ui/badge';
import { CheckCircle2, Code, FileText, HelpCircle } from 'lucide-react';

export interface QuestionRendererProps {
  question: ClientQuestion;
  value: string;
  onChange: (val: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  value,
  onChange,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <div className="bg-surface border border-line rounded-sm p-6 space-y-5">
      {/* Question Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-ink uppercase bg-paper border border-line px-2 py-0.5 rounded-xs">
            Question {questionNumber} of {totalQuestions}
          </span>
          {question.target_bloom && (
            <Badge variant="secondary" className="text-[10px]">
              Bloom: {question.target_bloom}
            </Badge>
          )}
        </div>
        <span className="font-mono text-xs uppercase text-ink-muted flex items-center gap-1">
          {question.type === 'mcq' && <HelpCircle className="w-3.5 h-3.5" />}
          {question.type === 'short_answer' && <FileText className="w-3.5 h-3.5" />}
          {question.type === 'code_explain' && <Code className="w-3.5 h-3.5" />}
          {question.type.replace('_', ' ')}
        </span>
      </div>

      {/* Question Prompt */}
      <h3 className="font-serif text-base sm:text-lg font-bold text-ink leading-relaxed">
        {question.prompt}
      </h3>

      {/* Input Options / Field switching on type */}
      {question.type === 'mcq' && question.options && (
        <div className="space-y-2 pt-1">
          {question.options.map((opt, idx) => {
            const isSelected = value === opt;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(opt)}
                className={`w-full text-left p-3 rounded-xs border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-paper border-ink text-ink font-semibold shadow-2xs'
                    : 'bg-paper/40 border-line text-ink-muted hover:text-ink hover:border-ink/40'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-mastered shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'short_answer' && (
        <div className="space-y-2 pt-1">
          <textarea
            rows={4}
            placeholder="Type your explanation here. Focus on core principles and technical accuracy..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 bg-paper border border-line rounded-sm text-xs sm:text-sm text-ink placeholder:text-ink-muted/50 focus:border-ink focus-visible:outline-none font-sans"
          />
          <span className="text-[11px] font-mono text-ink-muted block text-right">
            {value.length} characters
          </span>
        </div>
      )}

      {question.type === 'code_explain' && (
        <div className="space-y-3 pt-1">
          <div className="p-3 bg-ink text-paper rounded-xs font-mono text-xs overflow-x-auto leading-relaxed border border-line">
            <code>// Explain implementation logic and potential edge cases for this concept</code>
          </div>
          <textarea
            rows={5}
            placeholder="Explain how you would write or optimize code for this concept..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 bg-paper border border-line rounded-sm text-xs sm:text-sm text-ink placeholder:text-ink-muted/50 focus:border-ink focus-visible:outline-none font-mono"
          />
        </div>
      )}
    </div>
  );
};
