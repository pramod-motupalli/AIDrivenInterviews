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
You are an expert technical interviewer.
Evaluate the candidate's answer to the following interview question.

Question: {question_text}
Candidate's Answer: {answer_text}

Score the answer from 0 to 100 on three dimensions:
1. Relevance  – does it directly address the question?
2. Accuracy   – is the technical/factual content correct?
3. Clarity    – is it well-structured and easy to understand?

Also provide a single overall score (0-100) and one sentence of brief feedback.

Return ONLY a JSON object with this exact structure:
{{
    "relevance_score": 85,
    "accuracy_score": 90,
    "clarity_score": 80,
    "overall_score": 85,
    "feedback": "Brief feedback here."
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
        Generates the next interview question dynamically.
        Adjusts difficulty based on the candidate's previous score.
        """
        jd_text = interview.job.description if interview.job else "No job description provided."
        resume_text = interview.resume_text if interview.resume_text else "No resume provided."

        # Difficulty logic
        if previous_score is None:
            difficulty_instruction = "Ask an opening medium-difficulty question to assess the candidate's foundational knowledge."
        elif previous_score > 80:
            difficulty_instruction = (
                "The candidate answered excellently. Ask a significantly harder, "
                "advanced deep-dive question to probe their expert-level understanding."
            )
        elif previous_score < 50:
            difficulty_instruction = (
                "The candidate struggled. Ask a simpler, more foundational question "
                "to help them demonstrate their baseline knowledge."
            )
        else:
            difficulty_instruction = "Ask a medium-difficulty question relevant to their role and experience."

        prompt = f"""
You are an expert technical interviewer conducting a job interview.

Context:
- Job Description (excerpt): {jd_text[:800]}
- Candidate Resume (excerpt): {resume_text[:800]}

Previous context:
- Candidate's last answer: {previous_answer if previous_answer else "None – this is the very first question."}
- Score on last answer: {previous_score if previous_score is not None else "N/A"}

Instruction:
{difficulty_instruction}

Rules:
- Generate ONLY the question text. No preamble, no explanation, no numbering.
- The question must be directly relevant to the candidate's background and the job role.
- Do NOT repeat a question that has already been asked.
"""
        try:
            return self._chat_text(prompt)
        except Exception as e:
            print(f"Groq Error (generate_next_question): {e}")
            return "Can you walk me through a challenging project you've worked on and the impact it had?"


# Backwards-compatible alias so existing imports keep working
GeminiExtractionService = GroqAIService
