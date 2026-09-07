import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { interactiveApi } from '../../api/interactive';
import { Skeleton } from '../ui/skeleton';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';
import { RotateCw, ChevronLeft, ChevronRight, RefreshCw, BookOpen } from 'lucide-react';

export interface FlashcardsPanelProps {
  resourceId: string;
}

export const FlashcardsPanel: React.FC<FlashcardsPanelProps> = ({ resourceId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const {
    data: flashcardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['flashcards', resourceId],
    queryFn: () => interactiveApi.getFlashcards(resourceId),
    enabled: !!resourceId,
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-44 w-full bg-surface rounded-sm" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 space-y-3">
        <Alert variant="error">
          <span>Failed to load flashcards: {(error as { detail?: string }).detail || 'API error'}</span>
        </Alert>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry Flashcards
        </Button>
      </div>
    );
  }

  const cards = flashcardData?.flashcards || [];

  if (cards.length === 0) {
    return (
      <div className="p-6 bg-surface border border-line rounded-sm text-center">
        <BookOpen className="w-6 h-6 text-ink-muted mx-auto mb-2" />
        <p className="text-xs text-ink-muted">No flashcards available for this resource.</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
        <span>Flashcard {currentIndex + 1} of {cards.length}</span>
        <span>Click card to flip</span>
      </div>

      {/* Interactive Flip Card Container */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="w-full min-h-[180px] p-6 bg-surface border border-line rounded-sm flex flex-col justify-between items-center text-center cursor-pointer transition-all hover:border-ink hover:shadow-xs select-none"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted">
          {flipped ? 'ANSWER' : 'QUESTION / CONCEPT'}
        </span>

        <div className="my-auto py-2">
          <p className="font-serif text-base sm:text-lg font-semibold text-ink leading-relaxed">
            {flipped ? currentCard.back : currentCard.front}
          </p>
        </div>

        <div className="text-[11px] font-mono text-ink-muted flex items-center gap-1 opacity-70">
          <RotateCw className="w-3 h-3" /> {flipped ? 'Show Question' : 'Reveal Answer'}
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handlePrev} disabled={cards.length <= 1}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <span className="text-xs font-mono text-ink-muted">
          {currentIndex + 1} / {cards.length}
        </span>
        <Button variant="outline" size="sm" onClick={handleNext} disabled={cards.length <= 1}>
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
