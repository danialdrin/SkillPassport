import { CandidateResourceResponse, ResourceResponse } from '../types/resources';

export const getMockRecentsKey = (email: string) => `myskills.mock.recents.${email.toLowerCase().trim()}`;

const mockVideoIds = [
  'rfscVS0vtbw', 'kqtD5dpn9C8', 'x7X9w_GIm1s', 'HGOBQPFzWKo',
  'pTB0EiLXUC8', 'eWRfhZUzrAc', 'WGJJIrtnfpk', 'TqPzwenhMj0',
  'YfO28f6yyaM', 'uHyfQV0kbgo', 'DIn-3G5g8Jw', 'm67-bOpOoPU',
];

export const getMockSearchResults = (query: string): CandidateResourceResponse[] => {
  const topic = query.trim() || 'Python';

  return mockVideoIds.map((videoId, index) => ({
    resource_id: `mock-resource-${videoId}`,
    video_id: videoId,
    title: `${topic} Tutorial: Part ${index + 1} - Practical Guide`,
    channel: ['freeCodeCamp.org', 'Programming with Mosh', 'Corey Schafer', 'Tech Academy', 'Traversy Media', 'CS Dojo'][index % 6],
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    description: `A practical ${topic} lesson with examples and guided explanations.`,
    is_mock: true,
    medium_analysis: {
      relevance: 90 - index * 4,
      topic_coverage: 88 - index * 3,
      depth: 84 - index * 2,
      examples: 86 - index * 2,
      clarity: 91 - index,
      structure: 87 - index * 2,
      redundancy: 8 + index,
      overall: 88 - index * 3,
      transcript_available: true,
    },
  }));
};

export const getMockTranscript = (resourceId: string): string => {
  const videoId = resourceId.replace('mock-resource-', '');
  return [
    `Transcript for the analyzed Python lesson (${videoId}).`,
    'Python is a general-purpose programming language designed to be readable and practical.',
    'We begin by defining variables and using clear names to store values in a program.',
    'Functions group reusable logic. A function can receive parameters and return a result.',
    'Lists keep ordered collections, while dictionaries store values using key and value pairs.',
    'Use a loop when a task needs to be repeated, and use a conditional when the program must make a decision.',
    'Small examples and tests make it easier to understand behavior and find mistakes early.',
    'The main takeaway is to build one small working example, then improve it step by step.',
  ].join('\n');
};

export const getMockRecents = (email: string): ResourceResponse[] => {
  try {
    const stored = localStorage.getItem(getMockRecentsKey(email));
    return stored ? (JSON.parse(stored) as ResourceResponse[]) : [];
  } catch {
    return [];
  }
};

export const saveMockRecent = (candidate: CandidateResourceResponse, email: string): ResourceResponse => {
  const resource: ResourceResponse = {
    resource_id: candidate.resource_id,
    user_id: email.toLowerCase().trim(),
    source_type: 'youtube',
    url_or_file: `https://www.youtube.com/watch?v=${candidate.video_id}`,
    title: candidate.title,
    thumbnail: candidate.thumbnail,
    status: 'strong_analyzed',
    medium_analysis: candidate.medium_analysis,
    created_at: new Date().toISOString(),
  };
  const recents = [resource, ...getMockRecents(email).filter((item) => item.resource_id !== resource.resource_id)].slice(0, 10);
  localStorage.setItem(getMockRecentsKey(email), JSON.stringify(recents));
  return resource;
};