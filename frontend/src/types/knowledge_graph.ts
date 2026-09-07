export interface SkillNode {
  node_id: string;
  name: string;
  display_name: string;
  description?: string | null;
  type: string; // "concept" | "skill"
  bloom_level?: string | null;
  parent_id?: string | null;
  prerequisite_ids: string[];
}

export interface KGEdge {
  edge_id: string;
  from_node_id: string;
  to_node_id: string;
  relation: string; // "prerequisite" | "part_of" | "related_to"
  material_id?: string | null;
}

export interface MaterialKGResponse {
  analysis_id: string;
  nodes: SkillNode[];
  edges: KGEdge[];
}

export interface StudentKGStateItem {
  node_id: string;
  display_name: string;
  competency_score: number;
  last_updated: string;
  evidence_event_ids: string[];
}

export interface StudentKGResponse {
  user_id: string;
  skills: StudentKGStateItem[];
}
