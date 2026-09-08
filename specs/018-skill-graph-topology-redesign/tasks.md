# Tasks: Student Knowledge State Topology — Interactive Skill Graph Redesign

**Feature Branch**: `018-skill-graph-topology-redesign`
**Spec**: [spec.md](file:///media/SharedMemory/project/final%20year%20project/MySkills/specs/018-skill-graph-topology-redesign/spec.md) | **Plan**: [plan.md](file:///media/SharedMemory/project/final%20year%20project/MySkills/specs/018-skill-graph-topology-redesign/plan.md)

## Tasks

- [x] T001 [US1] Create direct MongoDB database seeding script `seed_kg_topology.py` in [seed_kg_topology.py](file:///media/SharedMemory/project/final%20year%20project/MySkills/backend/scripts/seed_kg_topology.py)
- [x] T002 [US1] Run MongoDB seeding script to insert rich interconnected skill topology directly into MongoDB
- [x] T003 [US1] Update backend schemas in [knowledge_graph.py](file:///media/SharedMemory/project/final%20year%20project/MySkills/backend/app/models/knowledge_graph.py) and router in [knowledge_graph.py](file:///media/SharedMemory/project/final%20year%20project/MySkills/backend/app/routers/knowledge_graph.py) to return full node metadata and edges
- [x] T004 [US1] Update frontend TypeScript types in [knowledge_graph.ts](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/types/knowledge_graph.ts)
- [x] T005 [US1] Redesign `SkillGraphPage` in [SkillGraph.tsx](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/src/pages/SkillGraph.tsx) with Student Root Node, network topology layout, hover expansion, click inspector, Reveal All progressive animation, zoom/pan controls, and fit-to-view containment
- [x] T006 [US1] Verify frontend build (`npx tsc --noEmit`) and UI rendering in browser
- [x] T007 [US1] Implement iterative force/repulsion collision avoidance algorithm in `SkillGraph.tsx` so nodes never overlap or hide behind one another
