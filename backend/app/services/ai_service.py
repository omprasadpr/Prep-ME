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
You are an Expert ATS Resume Analyzer, Senior Technical Recruiter, and Hiring Manager.

Your task is to evaluate this resume exactly as a modern Applicant Tracking System (ATS) and an experienced recruiter would.

Analyze ONLY the information present in the resume.

Do NOT assume anything that is not explicitly written.

Return ONLY valid JSON.
Do NOT return markdown.
Do NOT return explanations.
Do NOT include extra text.

==========================================================
SCORING GUIDELINES
==========================================================

Evaluate the resume fairly.

Do NOT score based on whether the candidate is a fresher or experienced.

Instead evaluate:

1. Resume Structure
2. ATS Compatibility
3. Technical Skills
4. Project Quality
5. Work Experience (if available)
6. Education
7. Certifications
8. Communication & Writing
9. Technical Keyword Coverage
10. Overall Professionalism

Scoring Rules

95-100
Outstanding resume that is highly competitive.

85-94
Excellent resume with only minor improvements needed.

75-84
Strong resume but missing some improvements.

65-74
Average resume.

50-64
Needs significant improvements.

Below 50
Poor resume.

Never return ATS score out of 10.

ATS score MUST be an integer between 0 and 100.

==========================================================
TECHNICAL SKILLS
==========================================================

Extract EVERY technical skill mentioned anywhere.

Do NOT miss any.

Group them into:

Programming Languages
Frontend
Backend
Databases
Cloud
DevOps
AI / Machine Learning
Data Analytics
Tools
Testing
Other Technologies

==========================================================
SOFT SKILLS
==========================================================

Extract all soft skills mentioned.

==========================================================
PROJECT ANALYSIS
==========================================================

Evaluate:

Project complexity

Real-world relevance

Architecture

Implementation quality

Technical depth

Impact

Mention strengths and weaknesses.

==========================================================
MISSING SKILLS
==========================================================

Recommend missing skills based on the candidate profile.

Separate into:

High Priority

Medium Priority

Low Priority

==========================================================
GRAMMAR
==========================================================

Evaluate:

Grammar

Spelling

Professional writing

Formatting

Readability

==========================================================
ROLE FIT
==========================================================

Suggest the roles this resume is best suited for.

Examples:

Backend Developer

Frontend Developer

Full Stack Developer

Python Developer

Software Engineer

Data Analyst

AI Engineer

Data Engineer

==========================================================
INTERVIEW READINESS
==========================================================

Estimate interview readiness between 0 and 100.

Consider:

Technical knowledge

Projects

Communication

Resume quality

==========================================================
CONFIDENCE SCORE
==========================================================

Return confidence_score between 0 and 100.

This represents how confident you are in your evaluation.

==========================================================
RETURN EXACTLY THIS JSON
==========================================================

{{
    "ats_score":0,

    "resume_summary":"",

    "technical_skills":{{
        "programming_languages":[],
        "frontend":[],
        "backend":[],
        "databases":[],
        "cloud":[],
        "devops":[],
        "ai_ml":[],
        "data_analytics":[],
        "tools":[],
        "testing":[],
        "others":[]
    }},

    "soft_skills":[],

    "projects_analysis":"",

    "achievements":"",

    "missing_skills":{{
        "high_priority":[],
        "medium_priority":[],
        "low_priority":[]
    }},

    "grammar_writing":"",

    "formatting":"",

    "role_fit":[],

    "interview_readiness":0,

    "confidence_score":0,

    "suggestions":[]
}}

==========================================================
RESUME
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
                    "content": "You are an expert ATS Resume Analyzer."
                },

                {
                    "role": "user",
                    "content": prompt
                }

            ]

        )

        return json.loads(
            response.choices[0].message.content
        )

    except Exception:

        return {

            "ats_score": 0,

            "resume_summary": "Unable to analyze resume.",

            "technical_skills": [],

            "soft_skills": [],

            "projects_analysis": "",

            "achievements": "",

            "missing_skills": [],

            "grammar_writing": "",

            "formatting": "",

            "role_fit": "",

            "interview_readiness": "",

            "confidence_score": 0,

            "suggestions": [
                "Resume analysis failed."
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
You are an Elite Staff Software Engineer and Technical Interviewer at a top-tier tech company.

You are conducting a highly realistic and rigorous STRUCTURED technical interview.

Candidate Resume
------------------------
{resume_text}
------------------------

Target Role: {role}
Experience: {experience}
Difficulty: {difficulty}

Generate EXACTLY {total_questions} interview questions following this STRICT structure in this EXACT order.
DO NOT change the order. DO NOT skip any category.

=== MANDATORY QUESTION STRUCTURE ===

Q1 — INTRODUCTION (1 question):
  The question MUST be: "Tell me about yourself and walk me through your background relevant to this role."
  ideal_answer: A structured response covering the candidate's education, key technologies from their resume, notable projects, and how their background aligns with the {role} role.

Q2, Q3, Q4, Q5 — PROJECT-BASED (4 questions):
  - Read the candidate resume carefully. Find their actual listed projects.
  - Ask DEEP, highly specific questions referencing those real project names and technologies.
  - Focus on: architecture decisions, database schema choices, scalability bottlenecks, security trade-offs, third-party integrations, and deployment strategy.
  - FORBIDDEN: Do NOT ask "What is REST?" or "What is React?" or any definition-style question.
  - REQUIRED: Use "how", "why", "what trade-offs", "how would you scale" phrasing.
  - Anti-Hallucination: Only reference projects and skills explicitly listed in the resume.

Q6, Q7 — CODING / TECHNICAL PROBLEM SOLVING (2 questions):
  - Ask practical, implementation-level questions directly relevant to the {role} role.
  - Examples: write a function to do X, explain the time complexity of your approach, optimize a database query, debug a given code snippet, choose a data structure and justify it.
  - Scale difficulty to: {difficulty}.
  - These should be hands-on, not theoretical.

Q8, Q9, Q10 — BEHAVIOURAL & MANAGEMENT (3 questions, one from each category):
  Q8 — Conflict Resolution: Ask about a time the candidate disagreed with a teammate or manager on a technical decision and how they resolved it.
  Q9 — Leadership & Ownership: Ask about a situation where they took ownership of a project or stepped up when things were going wrong.
  Q10 — Prioritization & Time Management: Ask how they handle competing deadlines, ambiguous requirements, or urgent production issues.
  - All 3 must be open-ended STAR-method style questions.
  - ideal_answer for each should describe what a strong STAR response looks like.

=== GENERAL RULES ===
- NO duplicate questions.
- Generate an extremely precise `ideal_answer` for EVERY question appropriate for the {experience} level.
- Output ONLY valid JSON. No extra text outside the JSON.

Return ONLY this JSON format:

{{
    "questions":[
        {{
            "question_number":1,
            "question":"Tell me about yourself and walk me through your background relevant to this role.",
            "ideal_answer":"A structured 2-3 minute answer covering: education background, primary technical skills from the resume, 1-2 key projects with impact, the candidate's interest in the {role} role, and their career goal."
        }}
    ]
}}
"""

    try:

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            temperature=0.4,

            response_format={
                "type": "json_object"
            },

            messages=[

                {
                    "role": "system",
                    "content": "You are an Elite Staff Software Engineer and structured technical interviewer. You ALWAYS follow the exact question structure given. You NEVER deviate from the order or categories specified in the prompt."
                },

                {
                    "role": "user",
                    "content": prompt
                }

            ]

        )

        return json.loads(
            response.choices[0].message.content
        )

    except Exception:

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
You are an Elite Staff Software Engineer conducting a strict but fair technical interview.

Critically evaluate the candidate's answer for deep technical accuracy and practical understanding.

Question:
{question}

Ideal Answer (Baseline for correctness):
{ideal_answer}

Candidate Answer:
{user_answer}

Instructions for High Accuracy Evaluation:
1. Conceptual Correctness: Do not just look for keyword matches. If the candidate explains the concept correctly using different terminology, give them credit.
2. Flaw Detection: Identify logical flaws, incorrect assumptions, or bad practices in their answer.
3. Scoring (0 to 10):
   - 9-10: Perfect, deep understanding, addresses edge cases.
   - 7-8: Correct but slightly incomplete.
   - 4-6: Partial understanding, missing key technical details.
   - 1-3: Fundamentally incorrect or showing critical misunderstandings.
   - 0: Completely irrelevant or no answer.
4. Actionable Feedback: Be highly specific. State exactly what was wrong or missing. Do NOT use generic phrases like "Good effort".
5. Keep feedback concise (2-4 sentences max).

Return ONLY valid JSON.

Format:

{{
    "score": 0,
    "feedback": "Specific technical feedback explaining exactly what was correct, missing, or fundamentally misunderstood."
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
                    "content":
                    "You are an expert technical interviewer."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return json.loads(
            response.choices[0].message.content
        )

    except Exception:

        return {
            "score": 0,
            "feedback": "Unable to evaluate answer."
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
You are a Principal Staff Engineer and Hiring Committee Member at a top-tier tech company.

You are evaluating a candidate based on a complete transcript of a highly rigorous technical interview.

Candidate Resume
-----------------------------
{resume_text}
-----------------------------

Role:
{role}
Experience:
{experience}
Difficulty:
{difficulty}

Interview Transcript
--------------------------------
{questions_and_answers}
--------------------------------

Your task is to provide a highly accurate, analytical, and objective evaluation of the candidate's performance.

Evaluation Dimensions:
- Technical Depth: Did they understand the underlying systems, or just surface-level APIs?
- Problem Solving: Did they identify edge cases and trade-offs?
- Communication: Were their answers structured and articulate?
- Authenticity: Did their answers align with the seniority claimed in their resume?

IMPORTANT SCORING RULES
- Return ALL scores as INTEGER values between 0 and 100. DO NOT use a 0–10 scale. DO NOT return decimal values.
- Scoring Guide:
  - 90-100: Exceptional (Top 5% of candidates, deep expertise)
  - 80-89: Strong (Solid understanding, independent contributor)
  - 70-79: Passable (Has basics, but lacks depth in some areas)
  - 50-69: Needs Improvement (Fundamental gaps identified)
  - 0-49: Fail (Critical technical misunderstandings)

Actionable Insights:
- `strengths`: Extract 2-3 highly specific technical strengths demonstrated in the transcript.
- `weaknesses`: Extract 2-3 specific technical gaps or misunderstandings from their answers. Avoid generic feedback.
- `overall_feedback`: Write a critical, executive summary (3-4 sentences) justifying your recommendation.

Recommendation MUST be exactly one of:
Strong Hire
Hire
Borderline
Needs Improvement

Return ONLY valid JSON.

Format:

{{
    "overall_score":0,
    "technical_score":0,
    "communication_score":0,
    "confidence_score":0,
    "strengths":"Specific strength 1. Specific strength 2.",
    "weaknesses":"Specific weakness 1. Specific weakness 2.",
    "overall_feedback":"Justification based on specific performance.",
    "recommendation":"Hire"
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
                    "content": "You are a senior software engineering interviewer."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return json.loads(
            response.choices[0].message.content
        )

    except Exception:

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
