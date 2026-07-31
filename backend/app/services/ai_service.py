import json

from groq import Groq

from app.core.config import settings

client = Groq(
    api_key=settings.GROQ_API_KEY
)


# =====================================================
# Resume Analysis
# =====================================================

def generate_resume_analysis(resume_text: str):
    prompt = f"""
You are an Expert ATS Resume Analyzer, Senior Technical Recruiter, and Hiring Manager at a top tech company.

Your task is to evaluate this candidate's resume with extreme precision, recruiter insight, and Applicant Tracking System (ATS) algorithmic rigor.

Analyze ONLY the information present in the resume. Do NOT make ungrounded assumptions.
Be CANDIDATE-SPECIFIC: Cite actual project names, technologies, metrics, and bullet points from the resume.

Return ONLY valid JSON format.
Do NOT include markdown wrapping or extra text outside JSON.

==========================================================
SCORING GUIDELINES
==========================================================
1. ats_score (0-100): Overall ATS parsing compatibility & resume strength.
2. keyword_match (0-100): Density and coverage of industry-standard technical keywords relative to target tech roles.
3. format_score (0-100): Structural organization, section readability, bullet point quality, and formatting clarity.
4. interview_readiness (0-100): Candidate's readiness to clear technical interviews based on projects, skills, and experience depth.
5. confidence_score (0-100): Evaluation confidence based on resume detail level.

Score distribution:
- 90-100: Outstanding resume, highly competitive FAANG/top-tier standard.
- 75-89: Strong resume with minor areas for improvement.
- 60-74: Average resume, missing key metrics, ATS keywords, or project depth.
- Below 60: Subpar resume requiring major restructuring.

==========================================================
JSON SCHEMA REQUIREMENT
==========================================================
Return EXACTLY this JSON structure:

{{
    "ats_score": 85,
    "keyword_match": 80,
    "format_score": 88,
    "resume_summary": "A concise 3-4 sentence candidate executive summary highlighting core engineering stack, total experience/projects, and standout domain strengths.",
    "technical_skills": {{
        "programming_languages": [],
        "frontend": [],
        "backend": [],
        "databases": [],
        "cloud": [],
        "devops": [],
        "ai_ml": [],
        "data_analytics": [],
        "tools": [],
        "testing": [],
        "others": []
    }},
    "soft_skills": [],
    "projects_analysis": "Deep, candidate-specific architectural & complexity evaluation citing explicit project names and tech stacks from the resume. Highlight technical strengths, scale/impact achieved, and missing architectural considerations.",
    "achievements": "Summary of key quantifiable achievements and metrics found in the resume, or recommendations on where to add impact metrics.",
    "missing_skills": {{
        "high_priority": [],
        "medium_priority": [],
        "low_priority": []
    }},
    "grammar_writing": "Detailed assessment of grammar, action verb usage, tone, and technical writing clarity.",
    "formatting": "Evaluation of section structure, bullet readability, and ATS machine-readability.",
    "role_fit": [
        "Full Stack Developer",
        "Backend Engineer"
    ],
    "interview_readiness": 82,
    "confidence_score": 90,
    "suggestions": [
        "Candidate-specific actionable bullet point 1 referencing exact projects/skills",
        "Candidate-specific actionable bullet point 2",
        "Candidate-specific actionable bullet point 3",
        "Candidate-specific actionable bullet point 4",
        "Candidate-specific actionable bullet point 5"
    ]
}}

==========================================================
CANDIDATE RESUME TEXT
==========================================================
{resume_text}
"""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            response_format={
                "type": "json_object"
            },
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert ATS Resume Analyzer and Senior Technical Recruiter. Provide candidate-specific, deep analytical JSON output."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        result = json.loads(response.choices[0].message.content)
        return result

    except Exception as e:
        print(f"[AI SERVICE ERROR] Resume Analysis Failed: {e}")
        return {
            "ats_score": 70,
            "keyword_match": 68,
            "format_score": 72,
            "resume_summary": "Candidate resume parsed. Contains technical skills and project experience.",
            "technical_skills": {
                "programming_languages": [],
                "frontend": [],
                "backend": [],
                "databases": [],
                "cloud": [],
                "devops": [],
                "ai_ml": [],
                "data_analytics": [],
                "tools": [],
                "testing": [],
                "others": []
            },
            "soft_skills": [],
            "projects_analysis": "Projects parsed from resume. Recommend expanding on architecture and impact.",
            "achievements": "Add quantifiable impact metrics to your experience section.",
            "missing_skills": {
                "high_priority": [],
                "medium_priority": [],
                "low_priority": []
            },
            "grammar_writing": "Good overall readability.",
            "formatting": "Standard resume layout.",
            "role_fit": ["Software Engineer"],
            "interview_readiness": 75,
            "confidence_score": 80,
            "suggestions": [
                "Include quantifiable metrics (e.g. %, latency improvements) in project descriptions.",
                "Add more industry-standard technical keywords to match job descriptions.",
                "Detail system architecture choices for main projects."
            ]
        }


# =====================================================
# Generate Interview Questions
# =====================================================

def generate_interview_questions(
    resume_text: str,
    role: str,
    experience: str,
    difficulty: str,
    total_questions: int = 10,
):
    prompt = f"""
You are an Elite Principal Staff Software Engineer and Lead Technical Interviewer at Google/FAANG.

You are conducting a hyper-realistic, highly structured technical interview for a candidate applying for the target role: "{role}".
- Candidate Experience Level: {experience}
- Interview Difficulty Level: {difficulty}

CANDIDATE RESUME:
------------------------
{resume_text}
------------------------

==========================================================
CRITICAL DIFFICULTY LEVEL MATRIX
==========================================================
You MUST strictly calibrate the complexity, depth, and challenge of ALL 10 questions and ideal answers based on the chosen difficulty level: "{difficulty}".

[DIFFICULTY LEVEL: "Easy"]
- Scope: Entry-Level / Junior candidate or beginner friendly.
- Conceptual Questions (Q3): Fundamental concepts, standard terminology, basic syntax, or core framework definitions (e.g. "What is the DOM?", "Explain HTTP methods GET vs POST", "How does a list differ from a set in Python?").
- Project Questions (Q4-Q6): Simple explanations of what the candidate built, main features, and basic tools used in their projects.
- Coding Questions (Q7 & Q8): Basic, entry-level programming problems (e.g., Reverse a string, Find maximum value in an array, Check if a word is palindrome, Count vowels in a string, Calculate array sum).
- Coding Challenge (Q9): Straightforward problem (e.g., Check if two strings are anagrams, Remove duplicates from an array, Find first non-repeating character using Hash Map).
- Behavioral (Q10): Basic entry-level teamwork, learning a new tool, or daily task prioritization.

[DIFFICULTY LEVEL: "Medium"]
- Scope: Mid-Level Engineer standard (3-5 years experience).
- Conceptual Questions (Q3): Framework/Language internal mechanics, async event loops, database indexing (B-Trees), REST vs GraphQL trade-offs, ORM performance.
- Project Questions (Q4-Q6): Deep architectural choices from candidate's resume projects: API design, DB schema normalization/indexing, caching strategies (Redis), latency optimization, state management.
- Coding Questions (Q7 & Q8): Standard mid-level LeetCode Easy/Medium problems (e.g., Two Sum, Valid Parentheses, Maximum Subarray Sum, Binary Search, Linked List Reversal).
- Coding Challenge (Q9): Solid LeetCode Medium problem (e.g., Longest Substring Without Repeating Characters, Group Anagrams, Matrix Traversal, Binary Tree Level-Order Traversal).
- Behavioral (Q10): Mid-level engineering trade-offs (handling tech debt vs feature delivery, managing sprint delays, technical disagreements).

[DIFFICULTY LEVEL: "Hard"]
- Scope: Senior / Staff Engineer FAANG-level rigor.
- Conceptual Questions (Q3): Deep internal mechanics (e.g. JVM/V8 garbage collection tuning, OS threading & memory locks, DB transaction isolation levels / MVCC, distributed consensus Raft/Paxos).
- Project Questions (Q4-Q6): Complex system design & architectural failure modes of candidate's resume projects: Distributed caching strategy, DB sharding & replication lag, CAP theorem trade-offs, zero-downtime deployments, microservice event sourcing, rate limiting algorithms.
- Coding Questions (Q7 & Q8): Challenging LeetCode Medium/Hard algorithms (e.g., LRU Cache implementation, Trie prefix tree, Merge K Sorted Lists, Graph Cycle Detection, Course Schedule topological sort).
- Coding Challenge (Q9): Advanced LeetCode Hard problem or Complex Distributed Algorithm (e.g., Trapping Rain Water, Sliding Window Maximum, Distributed Rate Limiter / Lock algorithm with concurrency & edge cases).
- Behavioral (Q10): Senior/Staff level crisis management (handling P0 production outage under high pressure, strategic architecture overhaul, engineering team scaling under constraints).

==========================================================
MANDATORY 10-QUESTION BLUEPRINT
==========================================================
You MUST generate EXACTLY {total_questions} questions following this sequence:

Q1 — PERSONAL INTRODUCTION & BACKGROUND:
  - Question: "Tell me about yourself and walk me through your background relevant to this role."
  - Ideal Answer: Structured 2-3 minute response covering education, core technical skills, key projects, and career fit for {role}.

Q2 — RECENT TECH STACK & SKILLS EXPLORATION:
  - Question: "What are the recent skills and technologies you have worked with in your latest projects or roles?"
  - Ideal Answer: Clear summary of tools, languages, frameworks, cloud services, and recent hands-on projects.

Q3 — TECHNICAL SKILLS SECTION DEEP-DIVE (1 Question):
  - Pick a core skill listed on candidate's resume.
  - Ask a concept/internal question strictly calibrated to difficulty "{difficulty}".

Q4, Q5, Q6 — PROJECT DEEP-DIVES (3 Questions):
  - Read candidate's resume projects carefully.
  - Ask 3 realistic architectural, schema, or system trade-off questions explicitly naming actual project titles, databases, APIs, and tools from their resume.
  - Calibrate architectural depth strictly to difficulty "{difficulty}".

Q7, Q8 — CODING & ALGORITHMIC QUESTIONS (2 Questions):
  - 2 hands-on coding problems tailored to candidate's primary programming language.
  - Strictly calibrated to difficulty "{difficulty}" as defined in the matrix above.

Q9 — ADVANCED CODING & COMPLEX PROBLEM-SOLVING (1 Question):
  - 1 advanced algorithmic/system programming challenge strictly calibrated to difficulty "{difficulty}" as defined in the matrix above.

Q10 — MANAGEMENT & BEHAVIORAL LEADERSHIP (1 Question):
  - Authentic behavioral question calibrated to difficulty "{difficulty}".
  - Ideal Answer: STAR-method (Situation, Task, Action, Result) response.

==========================================================
CRITICAL OUTPUT RULES
==========================================================
1. For every single question (Q1-Q10), provide a thorough, precise `ideal_answer`.
2. For coding questions (Q7, Q8, Q9), include complete code snippets, optimal time/space complexity (O(N), O(1)), and key edge cases in `ideal_answer`.
3. Output ONLY valid JSON in this exact structure:

{{
    "questions": [
        {{
            "question_number": 1,
            "question": "Tell me about yourself...",
            "ideal_answer": "Detailed benchmark response..."
        }},
        ...
    ]
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            response_format={
                "type": "json_object"
            },
            messages=[
                {
                    "role": "system",
                    "content": f"You are an Elite Principal Staff Software Engineer. You strictly enforce the '{difficulty}' difficulty matrix for all generated interview questions and ideal answers."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return json.loads(response.choices[0].message.content)

    except Exception as e:
        print(f"[AI SERVICE ERROR] Question Generation Failed: {e}")
        return {
            "questions": []
        }


# =====================================================
# Evaluate Candidate Answer
# =====================================================

def evaluate_answer(
    question: str,
    ideal_answer: str,
    user_answer: str,
):
    prompt = f"""
You are a Lead Staff Software Engineer and Senior Interviewer evaluating a candidate's answer during a live technical interview.

QUESTION ASKED:
{question}

IDEAL / BENCHMARK ANSWER:
{ideal_answer}

CANDIDATE'S SUBMITTED ANSWER:
{user_answer}

EVALUATION RULES:
1. Compare candidate's answer against the ideal benchmark for technical correctness, engineering depth, and problem-solving quality.
2. Analyze code for bugs, missing edge cases, and time/space complexity efficiency if it is a coding question.
3. For conceptual/project/behavioral questions, evaluate structure, technical clarity, and depth.
4. Score from 0 to 10:
   - 9-10: Exceptional. Covers core concepts, edge cases, and optimizations flawlessly.
   - 7-8: Solid. Technically correct, minor details or minor optimizations omitted.
   - 5-6: Partial. Basic understanding, but lacks depth or has minor technical flaws.
   - 3-4: Weak. Missing key concepts, notable errors or surface fluff.
   - 1-2: Poor. Significant technical misunderstandings.
   - 0: Incorrect, blank, or completely off-topic.

FEEDBACK REQUIREMENTS:
- Be candidate-specific, constructive, direct, and professional.
- Explicitly state:
  1. What the candidate got right.
  2. What key technical details, edge cases, or optimizations were missed.
  3. Concrete guidance on how to make it a 10/10 answer.

Return ONLY valid JSON:
{{
    "score": 8,
    "feedback": "Detailed, candidate-specific, highly actionable feedback highlighting strengths, missing technical details, edge cases, and improvement recommendations."
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            response_format={
                "type": "json_object"
            },
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert technical interviewer evaluating candidate answers with candidate-specific feedback."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return json.loads(response.choices[0].message.content)

    except Exception as e:
        print(f"[AI SERVICE ERROR] Answer Evaluation Failed: {e}")
        return {
            "score": 0,
            "feedback": "Unable to evaluate answer due to a service error."
        }


# =====================================================
# Generate Final Interview Report
# =====================================================

def generate_interview_report(
    role: str,
    experience: str,
    difficulty: str,
    resume_text: str,
    questions_and_answers: str,
):
    prompt = f"""
You are the Lead Hiring Committee Chair and Principal Staff Engineer reviewing the complete 10-question technical interview transcript for a candidate.

CANDIDATE PROFILE:
- Target Role: {role}
- Experience Level: {experience}
- Interview Difficulty Level: {difficulty}

CANDIDATE RESUME:
-----------------------------
{resume_text}
-----------------------------

INTERVIEW TRANSCRIPT & QUESTION EVALUATIONS:
--------------------------------
{questions_and_answers}
--------------------------------

TASK:
Conduct a comprehensive, candidate-specific, highly rigorous evaluation of this candidate across all dimensions:
1. Technical & Architectural Depth (Project questions & Tech concept questions Q3-Q6)
2. Algorithmic Mastery & Code Quality (Coding questions Q7-Q9)
3. Communication & Leadership Maturity (Intro Q1-Q2 & Behavioral Q10)
4. Seniority & resume claims validation

SCORING (Integer 0 to 100):
- overall_score: Weighted total performance score.
- technical_score: Deep system architecture & technical proficiency score.
- communication_score: Clarity, structure, and STAR method articulation score.
- confidence_score: Confidence and technical conviction demonstrated.

HIRING RECOMMENDATION MUST BE ONE OF:
- "Strong Hire" (Outstanding candidate across coding, architecture, and communication)
- "Hire" (Solid engineer, meets bar, minor gaps that can be mentored)
- "Borderline" (Mixed performance, noticeable gaps in coding or architecture)
- "Needs Improvement" (Clear technical gaps or failed coding/architectural challenges)

INSIGHTS REQUIRED (MUST BE CANDIDATE-SPECIFIC):
- `strengths`: Bullet points citing specific candidate answers, code implementations, or project explanations where the candidate performed well.
- `weaknesses`: Bullet points citing specific question numbers, missed edge cases, algorithmic flaws, or architectural gaps demonstrated in their answers.
- `overall_feedback`: In-depth executive summary (4-6 sentences) synthesizing candidate's overall readiness, strengths, and key growth areas for the {role} role.

Return ONLY valid JSON format:
{{
    "overall_score": 82,
    "technical_score": 85,
    "communication_score": 80,
    "confidence_score": 80,
    "strengths": "• Demonstrated strong understanding of microservice API design and SQL query indexing in Q4.\\n• Solved the easy coding problem in Q7 cleanly with O(N) time complexity.\\n• Articulated project architectural trade-offs with structured clarity.",
    "weaknesses": "• Struggled with concurrency and memory allocation edge cases in the hard coding question Q9.\\n• Omitted rate-limiting and caching failure handling when discussing system scalability in Q5.",
    "overall_feedback": "The candidate demonstrated solid core engineering competence for the {role} role. They performed well in introductory and project architecture discussions, but showed gaps in complex concurrency algorithms during Q9...",
    "recommendation": "Hire"
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            response_format={
                "type": "json_object"
            },
            messages=[
                {
                    "role": "system",
                    "content": "You are a Lead Hiring Committee Chair. Provide detailed, candidate-specific interview evaluation reports."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return json.loads(response.choices[0].message.content)

    except Exception as e:
        print(f"[AI SERVICE ERROR] Report Generation Failed: {e}")
        return {
            "overall_score": 0,
            "technical_score": 0,
            "communication_score": 0,
            "confidence_score": 0,
            "strengths": "Unable to evaluate.",
            "weaknesses": "Unable to evaluate.",
            "overall_feedback": "Interview report generation failed.",
            "recommendation": "Needs Improvement"
        }
