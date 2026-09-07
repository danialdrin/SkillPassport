export interface PassportNodeItem {
  node_id: string;
  display_name: string;
  description?: string | null;
  bloom_level?: string | null;
  competency_score: number;
  last_updated: string;
  evidence_event_ids: string[];
}

export interface PassportResponse {
  user_id: string;
  nodes: PassportNodeItem[];
  updated_at: string;
}

export interface GapItem {
  node_id: string;
  display_name: string;
  competency_score: number;
  recommended_prerequisites: string[];
}

export interface GapRecommendationResponse {
  user_id: string;
  gaps: GapItem[];
}
