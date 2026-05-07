import os
import json
import google.generativeai as genai
from django.conf import settings
from decouple import config

class GeminiExtractionService:
    def __init__(self):
        api_key = config('GEMINI_API_KEY')
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(config('GEMINI_MODEL', default='gemini-1.5-pro'))

    def process_screening(self, jd_text, resume_text):
        """
        Extracts information from JD and Resume, and calculates ATS score.
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
        
        Return the result ONLY as a valid JSON object with the following structure:
        {{
            "job_config": {{
                "title": "Extracted Job Title",
                "department": "Extracted Department",
                "skills": ["Skill1", "Skill2", ...]
            }},
            "candidate_details": {{
                "name": "Candidate Full Name",
                "email": "Candidate Email",
                "skills": ["Skill1", "Skill2", ...],
                "ats_score": 85,
                "highlights": ["Highlight 1", "Highlight 2"]
            }}
        }}
        """

        response = None
        text = ""
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                ),
            )
            text = response.text
            import re
            print(f"DEBUG: Gemini Raw Response (length {len(text)})")
            
            # Try to find the first JSON object in the response
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            
            return json.loads(text)
        except Exception as e:
            print(f"Gemini Error: {e}")
            if text:
                print(f"Problematic response: {text[:200]}...")
            
            return {
                "error": str(e),
                "job_config": {
                    "title": "Extraction Failed",
                    "department": "N/A",
                    "skills": []
                },
                "candidate_details": {
                    "name": "N/A",
                    "email": "N/A",
                    "skills": [],
                    "ats_score": 0,
                    "highlights": [f"Error: {str(e)}"]
                }
            }
