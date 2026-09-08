
import requests
import time
import json

BASE_URL = "http://localhost:8000"

def run_demo():
    print("=" * 60)
    print("1. AUTHENTICATION: Login user")
    print("=" * 60)
    login_resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    print(f"Login Status: {login_resp.status_code}")
    auth_data = login_resp.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    print(f"Access Token Obtained: {token[:30]}...")

    # Get User Profile
    me_resp = requests.get(f"{BASE_URL}/auth/me", headers=headers).json()
    user_id = me_resp["user_id"]
    print(f"Authenticated User ID: {user_id}\n")

    print("=" * 60)
    print("2. SEARCH: Search for candidates ('React Hooks')")
    print("=" * 60)
    search_resp = requests.post(f"{BASE_URL}/search", json={"query": "React Hooks"}, headers=headers)
    print(f"Search Status: {search_resp.status_code}")
    search_data = search_resp.json()
    candidates = search_data.get("candidates", [])
    print(f"Candidates Found: {len(candidates)}")
    if not candidates:
        print("No candidates found. Exiting.")
        return

    first_candidate = candidates[0]
    resource_id = first_candidate["resource_id"]
    print(f"Selected Candidate Resource ID: {resource_id}")
    print(f"Title: {first_candidate['title']}\n")

    print("=" * 60)
    print("3. MEDIUM ANALYSIS: Local CPU scoring (Zero-LLM)")
    print("=" * 60)
    medium_resp = requests.post(f"{BASE_URL}/search/{resource_id}/analyze-medium", headers=headers)
    print(f"Medium Analysis Status: {medium_resp.status_code}")
    medium_data = medium_resp.json()
    scores = medium_data.get("medium_analysis", {})
    print("Medium Analysis Scores:")
    print(json.dumps(scores, indent=2))
    print()

    print("=" * 60)
    print("4. SELECTION & STRONG ANALYSIS: Triggering background LLM analysis")
    print("=" * 60)
    select_resp = requests.post(f"{BASE_URL}/resources/{resource_id}/select", headers=headers)
    print(f"Select Status: {select_resp.status_code}")
    select_data = select_resp.json()
    job_id = select_data["job_id"]
    print(f"Background Job ID: {job_id}\n")

    print("=" * 60)
    print("5. POLLING JOB: Waiting for Strong Analysis completion...")
    print("=" * 60)
    analysis_id = None
    for attempt in range(1, 60):
        job_resp = requests.get(f"{BASE_URL}/jobs/{job_id}", headers=headers).json()
        status = job_resp.get("status")
        print(f"Attempt {attempt}: Job Status = {status}")
        if status == "done":
            result = job_resp.get("result", {})
            analysis_id = result.get("analysis_id")
            print(f"Strong Analysis Complete! Analysis ID: {analysis_id}\n")
            break
        elif status == "failed":
            print(f"Job Failed! Error: {job_resp.get('error')}")
            break
        time.sleep(3)

    if not analysis_id:
        print("Skipping downstream steps requiring analysis_id due to incomplete analysis.")
        return

    print("=" * 60)
    print("6. KNOWLEDGE GRAPH: Fetching Material KG")
    print("=" * 60)
    kg_resp = requests.get(f"{BASE_URL}/knowledge-graph/material/{analysis_id}", headers=headers).json()
    print(f"Nodes Extracted: {len(kg_resp.get('nodes', []))}")
    print(f"Edges Extracted: {len(kg_resp.get('edges', []))}\n")

    print("=" * 60)
    print("7. INTERACTIVE MODULES: Summary, Flashcards, Quiz")
    print("=" * 60)
    summary = requests.get(f"{BASE_URL}/resources/{resource_id}/summary", headers=headers).json()
    print("Summary:")
    print(json.dumps(summary, indent=2))
    
    flashcards = requests.get(f"{BASE_URL}/resources/{resource_id}/flashcards", headers=headers).json()
    print(f"\nFlashcards Count: {len(flashcards.get('flashcards', []))}")
    
    quiz = requests.get(f"{BASE_URL}/resources/{resource_id}/quiz", headers=headers).json()
    print(f"Practice Quiz Questions: {len(quiz.get('quiz', []))}\n")

    print("=" * 60)
    print("8. EXAM MODULE: Starting and Submitting Exam Quiz")
    print("=" * 60)
    quiz_start = requests.post(f"{BASE_URL}/exams/quiz/start", json={"resource_id": resource_id}, headers=headers).json()
    assessment_id = quiz_start.get("assessment_id")
    questions = quiz_start.get("questions", [])
    print(f"Exam Assessment ID: {assessment_id}")
    print(f"Questions Generated: {len(questions)}")

    if assessment_id and questions:
        answers = []
        for q in questions:
            opts = q.get("options")
            user_ans = opts[0] if opts else "Sample answer"
            answers.append({"question_id": q["question_id"], "user_answer": user_ans})
        
        submit_resp = requests.post(f"{BASE_URL}/exams/quiz/{assessment_id}/submit", json={"answers": answers}, headers=headers).json()
        print("Quiz Submission Score:", submit_resp.get("score"))
        print("Detailed Result:")
        print(json.dumps(submit_resp.get("per_question_result"), indent=2))
        print()

    print("=" * 60)
    print("9. DIGITAL SKILL PASSPORT: Fetching Passport & Gap Analysis")
    print("=" * 60)
    passport = requests.get(f"{BASE_URL}/passport/{user_id}", headers=headers).json()
    print("Updated Skill Passport Nodes:")
    print(json.dumps(passport.get("nodes"), indent=2))

    gaps = requests.get(f"{BASE_URL}/passport/{user_id}/gaps", headers=headers).json()
    print("\nCompetency Gaps & Recommendations:")
    print(json.dumps(gaps.get("gaps"), indent=2))
    print("=" * 60)
    print("FLOW COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_demo()

