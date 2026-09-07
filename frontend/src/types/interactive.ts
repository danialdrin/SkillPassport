export interface SummaryContent {
  title: string;
  summary_points: string[];
  key_takeaway: string;
}

export interface FlashcardItem {
  front: string;
  back: string;
}

export interface FlashcardsContent {
  flashcards: FlashcardItem[];
}

export interface PracticeQuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface PracticeQuizContent {
  quiz: PracticeQuizQuestion[];
}
