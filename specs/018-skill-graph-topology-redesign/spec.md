# Feature Specification: Student Knowledge State Topology — Interactive Skill Graph Redesign

**Feature Branch**: `018-skill-graph-topology-redesign`
**Created**: 2026-09-07
**Status**: Draft

**Input**: User request to redesign the Student Knowledge State Topology into an interactive, visually stunning knowledge network graph anchored by the authenticated user's root node, with hover expansion, click details inspection, progressive "Reveal All" animation, zoom/pan controls, fit-to-view containment, and direct MongoDB database seeding.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Root Anchor & Interactive Topology View (Priority: P1)
As a student viewing my Skill Graph page, I want the central root node to represent me (displaying my name) and my learned concepts to branch outward as an interactive network topology (not a static tree), so that I can intuitively see how my knowledge is connected.

**Acceptance Scenarios**:
1. **Given** an authenticated user (e.g. `arul`), **When** navigating to `/skill-graph`, **Then** the central root node displays the student's name (`arul`) with a distinct avatar styling and "Student Knowledge State" subtitle.
2. **Given** evaluated concepts, **When** rendered on the canvas, **Then** concept nodes show competency scores, mastery colors (Mastered >=80, Developing 60-79, Needs Work <60), and organic connecting edges.

### User Story 2 - Node Hover, Progressive Reveal & Inspector Details (Priority: P1)
As a student exploring concepts, I want hovering over a node to scale it up and reveal its connected sub-concepts, and clicking a node to display its complete details in the inspector drawer.

**Acceptance Scenarios**:
1. **Given** a concept node on the graph, **When** hovered, **Then** it scales up smoothly, brings connected edges to high visibility, dims unrelated nodes, and reveals connected child nodes.
2. **Given** a concept node, **When** clicked, **Then** the right-hand `Concept Node Details` inspector drawer updates with its display name, competency score, description, parent/child relationships, prerequisites, and evidence counts.

### User Story 3 - Reveal All, Auto-Fit Containment & Zoom/Pan Navigation (Priority: P1)
As a student with a multi-level knowledge topology, I want controls to progressively reveal the entire graph, zoom/pan around, and fit the graph perfectly inside its container without overflow.

**Acceptance Scenarios**:
1. **Given** the graph section, **When** clicking `[Reveal All]`, **Then** all concept nodes progressively animate outward from the root node.
2. **Given** any graph size, **When** rendered or resized, **Then** the viewport automatically scales and centers so all nodes stay inside the container.
3. **Given** graph navigation controls (`[+]`, `[-]`, `[Fit]`, `[Reset]`), **When** used or when mouse wheel/drag is performed, **Then** the user can pan and zoom smoothly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Root node MUST display the authenticated student's name and be visually distinct from concept nodes.
- **FR-002**: Graph layout MUST render as an interactive topology network anchored around the student root node.
- **FR-003**: Backend `get_student_kg` API MUST return enriched node details (`description`, `type`, `bloom_level`, `parent_id`, `prerequisite_ids`) and connected `edges`.
- **FR-004**: Hovering a node MUST scale it up, highlight connected edges, dim unrelated nodes, and reveal sub-concepts without collapsing previously revealed paths.
- **FR-005**: Clicking a node MUST populate the existing `Concept Node Details` inspector panel.
- **FR-006**: `Reveal All` button MUST progressively animate the topology expansion and toggle to `Collapse`.
- **FR-007**: Graph view container MUST calculate fit-to-view scaling so no nodes overflow outside container bounds.
- **FR-008**: Interactive Zoom and Pan controls MUST be available (`[+]`, `[-]`, `[Fit]`, `[Reset]`, drag, wheel).
- **FR-009**: MongoDB database seeding script MUST seed rich, interconnected concept nodes (`skill_nodes`), edges (`kg_edges`), and student state (`student_kg_state`) directly into MongoDB.

## Success Criteria *(mandatory)*

- **SC-001**: 100% of graph renders remain contained within the graph card container without horizontal overflow.
- **SC-002**: Clicking any concept node updates `Concept Node Details` with full definition and metadata.
- **SC-003**: 0 TypeScript or build errors.
