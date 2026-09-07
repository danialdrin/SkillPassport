export interface Topic {
  topic: string;
  subtopics?: string[];
  difficulty?: string;
  skills?: string[];
  learning_outcomes?: string[];
}

export interface Concept {
  name: string;
  definition: string;
  examples?: string[];
  prerequisites?: string[];
  bloom_level?: string;
  difficulty?: string;
  timestamp_or_page?: string | null;
}

export interface Relationship {
  from: string;
  to: string;
  relation: 'prerequisite' | 'part_of' | 'related_to' | string;
}

export interface ImportantSection {
  title: string;
  timestamp_or_page?: string | null;
  why_important: string;
}

export interface StrongAnalysisResult {
  topics: Topic[];
  concepts: Concept[];
  relationships: Relationship[];
  important_sections: ImportantSection[];
}

export interface AnalysisResponse {
  analysis_id: string;
  resource_id: string;
  transcript_or_text: string;
  version: number;
  extracted_data: StrongAnalysisResult;
  created_at: string;
}
