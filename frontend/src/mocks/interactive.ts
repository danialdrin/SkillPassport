import { MaterialKGResponse } from '../types/knowledge_graph';
import { FlashcardsContent, PracticeQuizContent, SummaryContent } from '../types/interactive';

export const mockSummary: SummaryContent = {
  title: 'Python Fundamentals',
  key_takeaway: 'Readable Python programs are built from small functions, clear data structures, and simple control flow.',
  summary_points: [
    'Variables and functions make Python code easy to organize and reuse.',
    'Lists preserve order, while dictionaries map keys to values.',
    'Loops repeat work and conditionals let a program choose what to do next.',
    'Small examples and tests help you verify each idea as you learn it.',
  ],
};

export const mockFlashcards: FlashcardsContent = {
  flashcards: [
    { front: 'What is a Python function?', back: 'A reusable block of code that can accept inputs and return a result.' },
    { front: 'When should you use a dictionary?', back: 'When values should be looked up by named keys instead of numeric positions.' },
    { front: 'What does a loop do?', back: 'It repeats a block of code for each item or while a condition is true.' },
    { front: 'Why write small tests?', back: 'They quickly confirm expected behavior and make future changes safer.' },
  ],
};

export const mockPracticeQuiz: PracticeQuizContent = {
  quiz: [
    { question: 'Which structure stores key-value pairs?', options: ['List', 'Dictionary', 'Tuple', 'String'], answer: 'Dictionary', explanation: 'Dictionaries map unique keys to values.' },
    { question: 'Which keyword defines a function?', options: ['func', 'define', 'def', 'function'], answer: 'def', explanation: 'Python uses def followed by the function name.' },
    { question: 'What does range(3) produce for a loop?', options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '3 only'], answer: '0, 1, 2', explanation: 'The stop value is excluded and counting starts at zero.' },
  ],
};

export const mockMaterialKnowledgeGraph: MaterialKGResponse = {
  analysis_id: 'mock-analysis-python',
  nodes: [
    { node_id: 'python', name: 'python', display_name: 'Python', type: 'concept', prerequisite_ids: [] },
    { node_id: 'syntax', name: 'syntax', display_name: 'Syntax', type: 'concept', parent_id: 'python', prerequisite_ids: ['python'] },
    { node_id: 'functions', name: 'functions', display_name: 'Functions', type: 'concept', parent_id: 'python', prerequisite_ids: ['syntax'] },
    { node_id: 'lists', name: 'lists', display_name: 'Lists', type: 'concept', parent_id: 'python', prerequisite_ids: ['syntax'] },
    { node_id: 'dictionaries', name: 'dictionaries', display_name: 'Dictionaries', type: 'concept', parent_id: 'python', prerequisite_ids: ['lists'] },
    { node_id: 'loops', name: 'loops', display_name: 'Loops', type: 'concept', parent_id: 'python', prerequisite_ids: ['syntax'] },
  ],
  edges: [
    { edge_id: 'edge-1', from_node_id: 'python', to_node_id: 'syntax', relation: 'part_of' },
    { edge_id: 'edge-2', from_node_id: 'python', to_node_id: 'functions', relation: 'part_of' },
    { edge_id: 'edge-3', from_node_id: 'python', to_node_id: 'lists', relation: 'part_of' },
    { edge_id: 'edge-4', from_node_id: 'lists', to_node_id: 'dictionaries', relation: 'prerequisite' },
    { edge_id: 'edge-5', from_node_id: 'python', to_node_id: 'loops', relation: 'part_of' },
  ],
};