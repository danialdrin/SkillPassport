import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format score with semantic color token and label
 */
export function getScoreSemantic(score: number): {
  colorClass: string;
  bgClass: string;
  borderClass: string;
  label: string;
} {
  if (score >= 80) {
    return {
      colorClass: 'text-mastered',
      bgClass: 'bg-mastered/10',
      borderClass: 'border-mastered',
      label: 'Mastered',
    };
  } else if (score >= 60) {
    return {
      colorClass: 'text-developing',
      bgClass: 'bg-developing/10',
      borderClass: 'border-developing',
      label: 'Developing',
    };
  } else {
    return {
      colorClass: 'text-gap',
      bgClass: 'bg-gap/10',
      borderClass: 'border-gap',
      label: 'Needs Work',
    };
  }
}
