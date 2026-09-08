import asyncio
import os
import sys
from datetime import datetime, timezone
from bson import ObjectId

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.mongo import get_collection

async def seed_topology():
    print("Starting MongoDB Knowledge Graph Topology Direct Seeding...")

    users_coll = get_collection("users")
    skill_nodes_coll = get_collection("skill_nodes")
    kg_edges_coll = get_collection("kg_edges")
    student_kg_coll = get_collection("student_kg_state")

    # 1. Fetch active users (e.g. arul, dani, etc.)
    users = await users_coll.find().to_list(100)
    if not users:
        print("No users found in database.")
        return

    print(f"Found {len(users)} users in MongoDB.")

    # 2. Define rich multi-tier concept hierarchy & relationships
    # Tier 1: Major Skill Domains (React Core, Backend Systems, Database Architecture)
    # Tier 2: Core Concepts
    # Tier 3: Advanced Concepts / Techniques

    concepts_data = [
        # Domain 1: React & Frontend Architecture
        {
            "key": "react",
            "name": "react",
            "display_name": "React Ecosystem",
            "description": "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
            "type": "skill",
            "bloom_level": "analyze",
            "parent_key": None,
            "prerequisite_keys": [],
            "score": 88
        },
        {
            "key": "components",
            "name": "react components",
            "display_name": "React Components",
            "description": "Independent, reusable pieces of UI code that handle rendering and state encapsulation.",
            "type": "concept",
            "bloom_level": "understand",
            "parent_key": "react",
            "prerequisite_keys": ["react"],
            "score": 92
        },
        {
            "key": "props",
            "name": "props & data flow",
            "display_name": "Props & Data Flow",
            "description": "Unidirectional data passing mechanism from parent components to child components.",
            "type": "concept",
            "bloom_level": "apply",
            "parent_key": "components",
            "prerequisite_keys": ["components"],
            "score": 85
        },
        {
            "key": "state",
            "name": "component state",
            "display_name": "State Management",
            "description": "Local component data that changes over time and triggers UI re-renders.",
            "type": "concept",
            "bloom_level": "apply",
            "parent_key": "components",
            "prerequisite_keys": ["props"],
            "score": 80
        },
        {
            "key": "hooks",
            "name": "react hooks",
            "display_name": "React Hooks (useState/useEffect)",
            "description": "Functions that let you hook into React state and lifecycle features from function components.",
            "type": "concept",
            "bloom_level": "analyze",
            "parent_key": "state",
            "prerequisite_keys": ["state"],
            "score": 76
        },
        {
            "key": "context",
            "name": "context api",
            "display_name": "Context API & Global State",
            "description": "Provides a way to pass data through the component tree without manually passing props at every level.",
            "type": "concept",
            "bloom_level": "apply",
            "parent_key": "react",
            "prerequisite_keys": ["hooks"],
            "score": 68
        },

        # Domain 2: Backend & System Design
        {
            "key": "system_design",
            "name": "system design",
            "display_name": "System Architecture",
            "description": "Process of defining the architecture, modules, interfaces, and data for a system to satisfy requirements.",
            "type": "skill",
            "bloom_level": "evaluate",
            "parent_key": None,
            "prerequisite_keys": [],
            "score": 74
        },
        {
            "key": "api_design",
            "name": "api design",
            "display_name": "REST & GraphQL APIs",
            "description": "Designing clean, scalable interface contracts for client-server communication.",
            "type": "concept",
            "bloom_level": "create",
            "parent_key": "system_design",
            "prerequisite_keys": ["system_design"],
            "score": 81
        },
        {
            "key": "caching",
            "name": "distributed caching",
            "display_name": "Caching & Redis",
            "description": "High-speed data storage layer storing a subset of data for fast retrieval.",
            "type": "concept",
            "bloom_level": "apply",
            "parent_key": "system_design",
            "prerequisite_keys": ["api_design"],
            "score": 58
        },

        # Domain 3: Databases & Persistence
        {
            "key": "database",
            "name": "database architecture",
            "display_name": "Database Systems",
            "description": "Relational and document storage systems designed for transactional integrity and analytical querying.",
            "type": "skill",
            "bloom_level": "analyze",
            "parent_key": None,
            "prerequisite_keys": [],
            "score": 78
        },
        {
            "key": "sql",
            "name": "sql & relational databases",
            "display_name": "SQL Query Optimization",
            "description": "Structured Query Language for managing and querying relational database systems.",
            "type": "concept",
            "bloom_level": "apply",
            "parent_key": "database",
            "prerequisite_keys": ["database"],
            "score": 84
        },
        {
            "key": "mongodb",
            "name": "mongodb & nosql",
            "display_name": "MongoDB Document Store",
            "description": "Document-oriented NoSQL database providing flexible JSON-like BSON schemas.",
            "type": "concept",
            "bloom_level": "understand",
            "parent_key": "database",
            "prerequisite_keys": ["database"],
            "score": 62
        },
    ]

    key_to_node_id = {}

    # 3. Create or update Skill Nodes in MongoDB
    for c in concepts_data:
        existing = await skill_nodes_coll.find_one({"name": c["name"]})
        if existing:
            node_id = existing["_id"]
            await skill_nodes_coll.update_one(
                {"_id": node_id},
                {"$set": {
                    "display_name": c["display_name"],
                    "description": c["description"],
                    "type": c["type"],
                    "bloom_level": c["bloom_level"],
                }}
            )
        else:
            doc = {
                "name": c["name"],
                "display_name": c["display_name"],
                "description": c["description"],
                "type": c["type"],
                "bloom_level": c["bloom_level"],
                "parent_id": None,
                "prerequisite_ids": [],
                "created_at": datetime.now(timezone.utc)
            }
            res = await skill_nodes_coll.insert_one(doc)
            node_id = res.inserted_id

        key_to_node_id[c["key"]] = node_id

    # 4. Resolve Parent IDs and Prerequisite IDs
    for c in concepts_data:
        node_id = key_to_node_id[c["key"]]
        parent_id = key_to_node_id.get(c["parent_key"]) if c["parent_key"] else None
        prereq_ids = [key_to_node_id[pk] for pk in c["prerequisite_keys"] if pk in key_to_node_id]

        await skill_nodes_coll.update_one(
            {"_id": node_id},
            {"$set": {
                "parent_id": parent_id,
                "prerequisite_ids": prereq_ids
            }}
        )

    # 5. Insert explicit KG Edges
    edges_to_create = [
        ("react", "components", "part_of"),
        ("components", "props", "prerequisite"),
        ("props", "state", "prerequisite"),
        ("state", "hooks", "prerequisite"),
        ("react", "context", "part_of"),
        ("system_design", "api_design", "part_of"),
        ("api_design", "caching", "prerequisite"),
        ("database", "sql", "part_of"),
        ("database", "mongodb", "part_of"),
        ("caching", "mongodb", "related_to"),
        ("api_design", "react", "related_to"),
    ]

    for from_key, to_key, relation in edges_to_create:
        from_id = key_to_node_id.get(from_key)
        to_id = key_to_node_id.get(to_key)
        if from_id and to_id:
            existing_edge = await kg_edges_coll.find_one({"from_node_id": from_id, "to_node_id": to_id})
            if not existing_edge:
                await kg_edges_coll.insert_one({
                    "from_node_id": from_id,
                    "to_node_id": to_id,
                    "relation": relation,
                    "material_id": None,
                    "created_at": datetime.now(timezone.utc)
                })

    # 6. Seed Student KG State for all users in the database
    for u in users:
        uid = u["_id"]
        for c in concepts_data:
            node_id = key_to_node_id[c["key"]]
            score = float(c["score"])
            existing_sk = await student_kg_coll.find_one({"user_id": uid, "node_id": node_id})
            if not existing_sk:
                await student_kg_coll.insert_one({
                    "user_id": uid,
                    "node_id": node_id,
                    "competency_score": score,
                    "last_updated": datetime.now(timezone.utc),
                    "evidence_event_ids": [ObjectId(), ObjectId()]
                })
            else:
                await student_kg_coll.update_one(
                    {"_id": existing_sk["_id"]},
                    {"$set": {
                        "competency_score": score,
                        "last_updated": datetime.now(timezone.utc)
                    }}
                )

    print(f"Successfully seeded {len(concepts_data)} nodes and {len(edges_to_create)} edges for all {len(users)} users.")

if __name__ == "__main__":
    asyncio.run(seed_topology())
