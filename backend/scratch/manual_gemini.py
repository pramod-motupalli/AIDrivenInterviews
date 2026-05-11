import google.generativeai as genai
from decouple import config
import json

def manual_gemini():
    api_key = config('GEMINI_API_KEY')
    model_name = config('GEMINI_MODEL')
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)
    
    jd_text = """
    Job Title: Senior Frontend Developer (React)
    Department: Engineering
    Requirements:
    - 5+ years of experience with React.js and TypeScript.
    - Strong knowledge of Tailwind CSS.
    - Experience with Node.js and GraphQL.
    - Excellent communication skills.
    """
    
    resume_text = """
    Vinay Mudhiraj
    Email: vinay@example.com
    GitHub: https://github.com/vinay-mudhiraj18
    Skills: JavaScript, React, Django, Python, HTML/CSS, Git.
    Summary: Frontend-focused Software Engineer with strong expertise in JavaScript, React fundamentals, and modern web technologies.
    """
    
    prompt = f"""
    You are an expert HR Analyst. 
    Analyze the following JD and Resume.
    JD: {jd_text}
    Resume: {resume_text}
    Return JSON:
    {{
        "job_config": {{"title": "...", "department": "...", "skills": [...]}},
        "candidate_details": {{"name": "...", "email": "...", "skills": [...], "ats_score": 85, "highlights": [...]}}
    }}
    """
    
    try:
        response = model.generate_content(prompt, generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    manual_gemini()
