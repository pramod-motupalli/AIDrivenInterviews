import json
from groq import Groq
from decouple import config


class GroqAIService:
    """
    AI service powered by Groq (llama3-70b-8192 by default).
    Drop-in replacement for GeminiExtractionService.
    """

    def __init__(self):
        self.client = Groq(api_key=config('GROQ_API_KEY'))
        self.model = config('GROQ_MODEL', default='llama-3.3-70b-versatile')

    # ------------------------------------------------------------------ #
    # Internal helpers
    # ------------------------------------------------------------------ #

    def _chat_json(self, prompt: str) -> dict:
        """Call Groq and parse the response as JSON."""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        return json.loads(raw)

    def _chat_text(self, prompt: str) -> str:
        """Call Groq and return plain text."""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
        )
        return response.choices[0].message.content.strip()

    # ------------------------------------------------------------------ #
    # Public methods
    # ------------------------------------------------------------------ #

    def process_screening(self, jd_text: str, resume_text: str) -> dict:
        """
        Extracts information from JD and Resume and calculates ATS score.
        """
        prompt = f"""
You are an expert HR Analyst and ATS (Applicant Tracking System).
Analyze the following Job Description (JD) and Candidate Resume.

--- JOB DESCRIPTION ---
{jd_text}

--- CANDIDATE RESUME ---
{resume_text}

--- TASK ---
1. Extract Job Details (Role, Department, Required Skills).
2. Extract Candidate Details (Name, Email, Skills).
3. Calculate an ATS Match Score (0-100) based on how well the resume matches the JD.
4. Provide 2-3 "Key Highlights" (strengths).

Return ONLY a valid JSON object with this structure:
{{
    "job_config": {{
        "title": "Extracted Job Title",
        "department": "Extracted Department",
        "skills": ["Skill1", "Skill2"]
    }},
    "candidate_details": {{
        "name": "Candidate Full Name",
        "email": "Candidate Email",
        "skills": ["Skill1", "Skill2"],
        "ats_score": 85,
        "highlights": ["Highlight 1", "Highlight 2"]
    }}
}}
"""
        try:
            print("DEBUG: Calling Groq service (process_screening)...")
            return self._chat_json(prompt)
        except Exception as e:
            print(f"Groq Error (process_screening): {e}")
            return {
                "error": str(e),
                "job_config": {"title": "Extraction Failed", "department": "N/A", "skills": []},
                "candidate_details": {
                    "name": "N/A",
                    "email": "N/A",
                    "skills": [],
                    "ats_score": 0,
                    "highlights": [f"Error: {str(e)}"],
                },
            }

    def evaluate_answer(self, question_text: str, answer_text: str) -> dict:
        """
        Evaluates a candidate's answer and returns scoring dimensions.
        """
        prompt = f"""
You are a Senior Talent Acquisition Lead conducting a rigorous technical interview.
Evaluate the candidate's answer to the following technical question.

Question: {question_text}
Candidate's Answer: {answer_text}

Score the answer from 0 to 100 on three dimensions:
1. Relevance  – does it directly address the technical core of the question?
2. Accuracy   – is the technical/factual content precise and correct?
3. Clarity    – is the explanation professional, well-structured, and easy to follow?

Also provide a single overall score (0-100) and one sentence of brief, professional feedback as a senior interviewer.

Return ONLY a JSON object with this exact structure:
{{
    "relevance_score": 85,
    "accuracy_score": 90,
    "clarity_score": 80,
    "overall_score": 85,
    "feedback": "Professional feedback here."
}}
"""
        try:
            return self._chat_json(prompt)
        except Exception as e:
            print(f"Groq Error (evaluate_answer): {e}")
            return {
                "relevance_score": 50,
                "accuracy_score": 50,
                "clarity_score": 50,
                "overall_score": 50,
                "feedback": "Could not evaluate due to an error.",
            }

    def generate_next_question(self, interview, previous_answer=None, previous_score=None) -> str:
        """
        Generates the next technical interview question dynamically.
        Varies difficulty from beginner to professional level based on performance.
        """
        jd_text = interview.job.description if interview.job else "No job description provided."
        resume_text = interview.resume_text if interview.resume_text else "No resume provided."

        # Difficulty logic for evaluating candidate from beginner to professional
        if previous_score is None:
            difficulty_instruction = (
                "Start with a foundational (Beginner level) technical question to assess basic knowledge "
                "relevant to the role and the candidate's resume."
            )
        elif previous_score > 85:
            difficulty_instruction = (
                "The candidate showed excellent proficiency. Ask a highly advanced (Professional/Architectural level) "
                "question to challenge their expertise and probe the limits of their senior-level skills."
            )
        elif previous_score > 60:
            difficulty_instruction = (
                "The candidate has a good grasp. Ask a solid (Intermediate level) technical question "
                "that bridges fundamentals with practical, scenario-based application."
            )
        else:
            difficulty_instruction = (
                "The candidate struggled or was average. Ask a clear, direct technical question "
                "to re-verify their foundational understanding of core concepts."
            )

        prompt = f"""
You are a Senior Talent Acquisition Lead conducting a professional technical interview.

Context:
- Job Description: {jd_text[:1000]}
- Candidate Resume: {resume_text[:1000]}

Previous Context:
- Last Answer: {previous_answer if previous_answer else "None – starting the interview."}
- Performance Score: {previous_score if previous_score is not None else "N/A"}

Instruction:
{difficulty_instruction}

Rules:
1. Act as a Senior Talent Acquisition Lead.
2. Ask ONLY one clear, professional technical question.
3. Keep the question SHORT and CONCISE (maximum 20 words).
4. The question must be based on their resume projects or the JD requirements.
5. Goal: Evaluate the candidate across the spectrum from beginner level to professional expertise.
6. Return ONLY the question text. No preamble, no explanation.
"""
        try:
            return self._chat_text(prompt)
        except Exception as e:
            print(f"Groq Error (generate_next_question): {e}")
            return "Can you explain the technical architecture of a complex project you've led recently?"



# Backwards-compatible alias so existing imports keep working
GeminiExtractionService = GroqAIService
