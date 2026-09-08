import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from app.core.deps import get_current_user
from app.db.mongo import get_collection
from app.models.resource import SearchQueryRequest, SearchResponse, CandidateResourceResponse, ResourceResponse, MediumAnalysisScores
from app.services.youtube_service import youtube_service
from app.services.transcript_service import transcript_service
from app.services.medium_analysis_service import medium_analysis_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/search", tags=["Search & Medium Analysis"])

@router.post("", response_model=SearchResponse)
async def search_resources(
    body: SearchQueryRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id_obj = ObjectId(current_user["_id"])
    resources_coll = get_collection("resources")
    normalized_query = body.query.strip().lower()

    # Check for existing cached candidates in database unless force_refresh or pagination is requested
    if not body.page_token and not body.force_refresh:
        existing_cursor = resources_coll.find({
            "user_id": user_id_obj,
            "search_query": normalized_query
        }).sort("created_at", -1)
        existing_docs = await existing_cursor.to_list(length=50)

        if existing_docs:
            logger.info(f"[SEARCH_CACHE_HIT] Returning {len(existing_docs)} stored candidate videos for query='{body.query}' without YouTube API call.")
            candidates = []
            for doc in existing_docs:
                url = doc.get("url_or_file", "")
                video_id = ""
                if "v=" in url and len(url.split("v=")) > 1:
                    video_id = url.split("v=")[1].split("&")[0]
                elif "youtu.be/" in url and len(url.split("youtu.be/")) > 1:
                    video_id = url.split("youtu.be/")[1].split("?")[0]
                else:
                    video_id = url
                ma = doc.get("medium_analysis")
                candidates.append(CandidateResourceResponse(
                    resource_id=str(doc["_id"]),
                    video_id=video_id,
                    title=doc.get("title", ""),
                    channel=doc.get("channel", "YouTube"),
                    thumbnail=doc.get("thumbnail", ""),
                    description=doc.get("description", ""),
                    is_mock=False,
                    medium_analysis=MediumAnalysisScores(**ma) if ma else None
                ))
            return SearchResponse(candidates=candidates, next_page_token=None)

    logger.info(f"[SEARCH_API_CALL] Fetching YouTube candidate videos for query='{body.query}' page_token={body.page_token}")
    yt_res = await youtube_service.search_videos(
        query=body.query,
        page_token=body.page_token
    )

    candidates = []
    for item in yt_res.get("candidates", []):
        video_id = item["video_id"]
        url = f"https://www.youtube.com/watch?v={video_id}"

        # Upsert lightweight pending resource doc
        existing = await resources_coll.find_one({"user_id": user_id_obj, "url_or_file": url})
        if existing:
            resource_id_str = str(existing["_id"])
            medium_scores = existing.get("medium_analysis")
            # Update search_query if missing
            await resources_coll.update_one(
                {"_id": existing["_id"]},
                {"$set": {"search_query": normalized_query}}
            )
        else:
            resource_doc = {
                "user_id": user_id_obj,
                "source_type": "youtube",
                "url_or_file": url,
                "title": item["title"],
                "channel": item["channel"],
                "thumbnail": item["thumbnail"],
                "description": item.get("description", ""),
                "status": "pending",
                "medium_analysis": None,
                "search_query": normalized_query,
                "created_at": datetime.now(timezone.utc)
            }
            res = await resources_coll.insert_one(resource_doc)
            resource_id_str = str(res.inserted_id)
            medium_scores = None

        candidates.append(CandidateResourceResponse(
            resource_id=resource_id_str,
            video_id=video_id,
            title=item["title"],
            channel=item["channel"],
            thumbnail=item["thumbnail"],
            description=item.get("description", ""),
            is_mock=item.get("is_mock", False),
            medium_analysis=MediumAnalysisScores(**medium_scores) if medium_scores else None
        ))

    return SearchResponse(
        candidates=candidates,
        next_page_token=yt_res.get("next_page_token")
    )

@router.post("/{resource_id}/analyze-medium", response_model=ResourceResponse)
async def analyze_medium(
    resource_id: str,
    current_user: dict = Depends(get_current_user)
):
    logger.info(f"[MEDIUM_ANALYSIS_START] resource_id={resource_id} user_id={current_user['_id']}")
    resources_coll = get_collection("resources")
    try:
        r_id = ObjectId(resource_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid resource_id")

    resource = await resources_coll.find_one({"_id": r_id, "user_id": ObjectId(current_user["_id"])})
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")

    url = resource.get("url_or_file", "")
    video_id = url
    if "v=" in url and len(url.split("v=")) > 1:
        video_id = url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url and len(url.split("youtu.be/")) > 1:
        video_id = url.split("youtu.be/")[1].split("?")[0]

    # Fetch transcript
    full_text, segments, transcript_avail = transcript_service.get_transcript(video_id)
    query = resource.get("search_query", resource.get("title", ""))

    # Run local CPU scoring
    scores = medium_analysis_service.compute_scores(
        query=query,
        title=resource.get("title", ""),
        description=resource.get("description", ""),
        transcript_text=full_text,
        segments=segments,
        transcript_available=transcript_avail
    )

    scores_dict = scores.model_dump()

    # Update resource document
    await resources_coll.update_one(
        {"_id": r_id},
        {"$set": {
            "status": "medium_analyzed",
            "medium_analysis": scores_dict,
            "updated_at": datetime.now(timezone.utc)
        }}
    )

    resource["status"] = "medium_analyzed"
    resource["medium_analysis"] = scores_dict

    logger.info(f"[MEDIUM_ANALYSIS_COMPLETE] resource_id={resource_id} video_id={video_id} overall_score={scores.overall} transcript_available={transcript_avail}")

    return ResourceResponse(
        resource_id=str(resource["_id"]),
        user_id=str(resource["user_id"]),
        source_type=resource.get("source_type", "youtube"),
        url_or_file=resource.get("url_or_file", ""),
        title=resource.get("title", ""),
        status="medium_analyzed",
        medium_analysis=scores,
        created_at=resource.get("created_at", datetime.now(timezone.utc))
    )
