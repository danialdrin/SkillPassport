export interface MediumAnalysisScores {
  relevance: number;
  topic_coverage: number;
  depth: number;
  examples: number;
  clarity: number;
  structure: number;
  redundancy: number;
  overall: number;
  transcript_available: boolean;
}

export type ResourceStatus = 'pending' | 'medium_analyzed' | 'selected' | 'strong_analyzed';

export interface ResourceResponse {
  resource_id: string;
  user_id?: string;
  source_type: 'youtube' | 'pdf';
  url_or_file: string;
  title: string;
  thumbnail?: string | null;
  status: ResourceStatus;
  medium_analysis?: MediumAnalysisScores | null;
  created_at: string;
}

export interface CandidateResourceResponse {
  resource_id: string;
  video_id: string;
  title: string;
  channel: string;
  thumbnail: string;
  description: string;
  is_mock: boolean;
  medium_analysis?: MediumAnalysisScores | null;
}

export interface SearchResponse {
  candidates: CandidateResourceResponse[];
  next_page_token?: string | null;
}

export interface SearchQueryRequest {
  query: string;
  page_token?: string;
}

export type JobStatus = 'queued' | 'processing' | 'done' | 'failed';

export interface JobResponse {
  job_id: string;
  type: string;
  status: JobStatus;
  result?: {
    analysis_id: string;
    resource_id: string;
  } | null;
  error?: string | null;
  created_at: string;
}
