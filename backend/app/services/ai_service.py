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
You are an Elite Principal Staff Software Engineer and Lead Technical Interviewer at Google/FAANG.

You are conducting a hyper-realistic, highly structured, and authentic technical interview for a candidate applying for the target role: "{role}" (Experience Level: {experience}, Interview Rigor / Difficulty: {difficulty}).

CANDIDATE RESUME
------------------------
{resume_text}
------------------------

You MUST generate EXACTLY {total_questions} interview questions adhering STRICTLY to the following sequence and category distribution:

=== MANDATORY 10-QUESTION BLUEPRINT ===

Q1 — PERSONAL INTRODUCTION & BACKGROUND:
  - Question MUST BE EXACTLY: "Tell me about yourself and walk me through your background relevant to this role."
  - Ideal Answer: A structured 2-3 minute response covering education, key technical skills, primary projects, and career alignment with the {role} role.

Q2 — RECENT TECH STACK & SKILLS EXPLORATION:
  - Question MUST BE EXACTLY: "What are the recent skills and technologies you have worked with in your latest projects or roles?"
  - Ideal Answer: Clear summary of tools, languages, frameworks, cloud services, and recent hands-on projects worked on.

Q3 — TECHNICAL SKILLS SECTION DEEP-DIVE (1 Question):
  - Read the candidate's Technical Skills section on their resume carefully.
  - Pick one of their core listed skills, frameworks, or languages and ask a deep technical concept, framework architecture, or language internal question.
  - Ideal Answer: Deep technical explanation covering internal mechanics, best practices, and practical implementation.

Q4, Q5, Q6 — PROJECT DEEP-DIVES (3 Questions):
  - Read the candidate's Projects section on their resume.
  - Ask 3 deep, highly realistic architectural, schema, or system trade-off questions explicitly referencing actual project names, databases, APIs, and tools listed on their resume.
  - Q4: Project Architecture, API Design, and Database Schema choices.
  - Q5: Scalability bottlenecks, Caching strategies, and Performance optimizations.
  - Q6: Security trade-offs, Authentication, Third-party APIs, or Deployment Pipeline decisions.
  - Ideal Answer: Detailed architectural response addressing trade-offs, edge cases, and design choices.

Q7, Q8 — EASY CODING & ALGORITHMIC QUESTIONS (2 Questions):
  - Ask 2 practical, entry/intermediate-level hands-on coding or algorithmic problem-solving questions tailored to their primary programming language (e.g. Python, JavaScript, Java, C++).
  - Focus: Arrays, Strings, HashMaps, Data Transformation pipelines, or basic algorithmic logic.
  - Scale difficulty to: Easy / Intermediate for {difficulty}.
  - Ideal Answer: Optimal code snippet, step-by-step logic explanation, and Time/Space Complexity analysis (e.g., O(N) time, O(1) space).

Q9 — HARD CODING & COMPLEX PROBLEM-SOLVING QUESTION (1 Question):
  - Ask 1 advanced coding or complex algorithmic problem-solving challenge scaled to the specified {difficulty} level.
  - Focus: Concurrency/Multithreading, Rate-Limiting algorithm, Complex Data Structure implementation (e.g. LRU Cache, Trie, Graph traversal), or Heavy Data Processing optimization.
  - Ideal Answer: Complete algorithmic code solution, handling of edge cases, time/space complexity proof, and concurrency/memory trade-offs.

Q10 — MANAGEMENT & BEHAVIORAL LEADERSHIP QUESTION (1 Question):
  - Ask an authentic behavioral/management question focused on technical leadership, handling conflict with teammates/managers, making difficult priority trade-offs under tight deadlines, or managing production outages.
  - Ideal Answer: A structured STAR-method (Situation, Task, Action, Result) response showing engineering maturity, ownership, and emotional intelligence.

=== CRITICAL EVALUATION RULES ===
1. Generate an extremely precise, detailed, high-quality `ideal_answer` for EVERY single question (Q1 through Q10).
2. For coding questions (Q7, Q8, Q9), include code snippets, optimal time/space complexity (O(N), O(1)), and key edge cases in the `ideal_answer`.
3. Output ONLY valid JSON in the exact structure below.

Return format:
{{
    "questions": [
        {{
            "question_number": 1,
            "question": "Tell me about yourself and walk me through your background relevant to this role.",
            "ideal_answer": "A structured response covering..."
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
                    "content": "You are an Elite Principal Staff Software Engineer and Lead Technical Interviewer. You ALWAYS follow the exact 10-question blueprint provided without skipping or changing any category."
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
You are a Principal Staff Software Engineer at Google/FAANG evaluating a candidate's answer during a real technical interview.

QUESTION ASKED:
{question}

IDEAL / BENCHMARK ANSWER:
{ideal_answer}

CANDIDATE'S SUBMITTED ANSWER:
{user_answer}

EVALUATION CRITERIA:
1. Technical Accuracy & Depth: Does the candidate demonstrate true engineering competence, or surface-level fluff?
2. Logical Flaws & Edge Cases: Did they identify failure modes, time/space complexity trade-offs, or security/concurrency risks?
3. Communication & Structure: For coding questions, is code clean & correct? For behavioral/project questions, is it structured (STAR method)?
4. Scoring Scale (0 to 10):
   - 9-10: Exceptional. Deep understanding, covers edge cases & trade-offs flawlessly.
   - 7-8: Solid. Correct explanation, minor details or optimizations missed.
   - 5-6: Partial. Grasps basic idea, but lacks technical depth or contains slight misunderstandings.
   - 3-4: Weak. Misses key concepts, contains notable errors or fluff.
   - 1-2: Poor. Critical technical misunderstandings.
   - 0: Completely incorrect, blank, or irrelevant answer.

FEEDBACK REQUIREMENTS:
- Be realistic, professional, direct, and constructive like a real senior interviewer.
- Clearly state what the candidate got right, what key technical details/edge cases were missed, and how to improve.

Return ONLY valid JSON format:
{{
    "score": 8,
    "feedback": "Detailed, highly actionable, professional feedback explaining strengths, missing technical details, and improvement recommendations."
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
                    "content": "You are an expert technical interviewer evaluating candidate answers with strict engineering rigor."
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
You are a Lead Hiring Committee Chair and Principal Staff Engineer reviewing the complete transcript of a candidate's 10-question technical interview.

CANDIDATE PROFILE:
Role: {role}
Experience Level: {experience}
Interview Difficulty: {difficulty}

CANDIDATE RESUME:
-----------------------------
{resume_text}
-----------------------------

INTERVIEW TRANSCRIPT & EVALUATIONS:
--------------------------------
{questions_and_answers}
--------------------------------

Conduct a thorough, analytical, objective evaluation across all dimensions:
1. Technical Competence & Architectural Depth (Resume Projects & Technical Questions Q3-Q6)
2. Algorithmic & Problem Solving Mastery (Coding Questions Q7, Q8, Q9)
3. Management, Leadership & Communication Maturity (Intro & Behavioral Q1, Q2, Q10)
4. Consistency & Seniority Alignment with Resume Claims

SCORING (Integer 0 to 100):
- overall_score: Weighted composite performance score (0-100).
- technical_score: Deep system architecture & technical skills score (0-100).
- communication_score: Clarity, structure, and STAR method articulation score (0-100).
- confidence_score: Confidence and technical conviction demonstrated (0-100).

HIRING RECOMMENDATION MUST BE ONE OF:
- "Strong Hire" (Top 5% candidate, outstanding across coding, architecture, and communication)
- "Hire" (Solid engineer, meets bar, minor gaps that can be mentored)
- "Borderline" (Mixed signals, weak in coding or project depth)
- "Needs Improvement" (Clear technical gaps or failed coding/architectural challenges)

INSIGHTS REQUIRED:
- `strengths`: 3-4 specific technical and communication strengths highlighted during the interview.
- `weaknesses`: 3-4 concrete technical gaps, missing edge cases, or code inefficiencies identified.
- `overall_feedback`: In-depth executive summary (4-6 sentences) synthesizing their overall fit for the {role} role.

Return ONLY valid JSON format:
{{
    "overall_score": 85,
    "technical_score": 88,
    "communication_score": 82,
    "confidence_score": 84,
    "strengths": "• Excellent understanding of microservice API design and SQL query indexing.\\n• Solved the easy coding problem cleanly with O(N) time complexity.\\n• Strong STAR-method communication during project trade-off discussions.",
    "weaknesses": "• Struggled with memory allocation trade-offs in the hard coding question.\\n• Did not mention rate-limiting edge cases when scaling backend services.",
    "overall_feedback": "The candidate demonstrated strong core technical proficiency suitable for a {role}. They showed solid communication and practical project experience...",
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
                    "content": "You are a Lead Hiring Committee Chair and Principal Staff Engineer evaluating technical candidate transcripts."
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
