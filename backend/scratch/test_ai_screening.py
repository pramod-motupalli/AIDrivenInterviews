import os
import django
import sys
import json
import google.generativeai as genai

# Setup Django environment
sys.path.append('c:/Users/vinay/OneDrive/Desktop/AI_Interview_App/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from ai_engine.services import GeminiExtractionService

def test_screening():
    jd_text = """
    Job Title: Senior React Developer
    Department: Engineering
    Requirements:
    - 5+ years of experience with React.js and TypeScript.
    - Strong knowledge of Tailwind CSS.
    - Experience with Node.js and GraphQL.
    - Excellent communication skills.
    """
    
    resume_text = """
    John Doe
    Email: john.doe@example.com
    Skills: React.js, TypeScript, Tailwind CSS, Node.js, JavaScript, HTML, CSS.
    Experience:
    - Senior Developer at TechCorp (4 years): Built large scale React apps.
    - Frontend Developer at WebWorks (2 years): Specialized in UI components.
    """
    
    print("Starting Gemini Extraction...")
    # Using the key from .env.example
    genai.configure(api_key="AIzaSyDtnxAgmi7JYxgRbYcx7JSSg2TMWaEFcFw")
    model = genai.GenerativeModel("gemini-1.5-pro")
    
    service = GeminiExtractionService()
    service.model = model
    
    result = service.process_screening(jd_text, resume_text)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_screening()
