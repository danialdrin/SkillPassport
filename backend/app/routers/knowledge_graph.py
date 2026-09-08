from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from app.core.deps import get_current_user
from app.db.mongo import get_collection
from app.models.knowledge_graph import MaterialKGResponse, StudentKGResponse, StudentKGStateItem
from app.services.kg_service import kg_service

router = APIRouter(prefix="/knowledge-graph", tags=["Knowledge Graph"])

@router.get("/material/{analysis_id}", response_model=MaterialKGResponse)
async def get_material_kg(
    analysis_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        analyses_coll = get_collection("analyses")
        resources_coll = get_collection("resources")
        analysis = await analyses_coll.find_one({"_id": ObjectId(analysis_id)})
        if not analysis:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
        resource = await resources_coll.find_one({"_id": analysis["resource_id"], "user_id": ObjectId(current_user["_id"])})
        if not resource:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot access another student's material graph")
        data = await kg_service.get_material_kg(analysis_id)
        return data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Material KG not found: {e}")

@router.get("/student/{user_id}", response_model=StudentKGResponse)
async def get_student_kg(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    # Ensure student can only view their own passport/KG unless authorized
    if current_user["_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot access another student's graph")

    student_kg_coll = get_collection("student_kg_state")
    skill_nodes_coll = get_collection("skill_nodes")
    kg_edges_coll = get_collection("kg_edges")

    cursor = student_kg_coll.find({"user_id": ObjectId(user_id)})
    docs = await cursor.to_list(length=500)

    node_ids = [d["node_id"] for d in docs]
    items = []

    for d in docs:
        node_doc = await skill_nodes_coll.find_one({"_id": d["node_id"]})
        if node_doc:
            display_name = node_doc.get("display_name") or node_doc.get("name") or "Unknown Node"
            description = node_doc.get("description")
            node_type = node_doc.get("type", "concept")
            bloom_level = node_doc.get("bloom_level")
            parent_id = str(node_doc["parent_id"]) if node_doc.get("parent_id") else None
            prerequisite_ids = [str(pid) for pid in node_doc.get("prerequisite_ids", [])]
        else:
            display_name = "Unknown Node"
            description = None
            node_type = "concept"
            bloom_level = None
            parent_id = None
            prerequisite_ids = []

        items.append(StudentKGStateItem(
            node_id=str(d["node_id"]),
            display_name=display_name,
            description=description,
            type=node_type,
            bloom_level=bloom_level,
            parent_id=parent_id,
            prerequisite_ids=prerequisite_ids,
            competency_score=d.get("competency_score", 0.0),
            last_updated=d.get("last_updated", datetime.now(timezone.utc)),
            evidence_event_ids=[str(eid) for eid in d.get("evidence_event_ids", [])]
        ))

    # Fetch edges between any of these evaluated nodes
    formatted_edges = []
    if node_ids:
        edges_cursor = kg_edges_coll.find({
            "from_node_id": {"$in": node_ids},
            "to_node_id": {"$in": node_ids}
        })
        edge_docs = await edges_cursor.to_list(length=500)
        from app.models.knowledge_graph import KGEdgeSchema
        for e in edge_docs:
            formatted_edges.append(KGEdgeSchema(
                edge_id=str(e["_id"]),
                from_node_id=str(e["from_node_id"]),
                to_node_id=str(e["to_node_id"]),
                relation=e.get("relation", "prerequisite"),
                material_id=str(e["material_id"]) if e.get("material_id") else None
            ))

    return StudentKGResponse(
        user_id=user_id,
        skills=items,
        edges=formatted_edges
    )
