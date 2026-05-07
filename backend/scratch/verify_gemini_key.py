import google.generativeai as genai
from decouple import config
import sys

def verify_from_env():
    api_key = config('GEMINI_API_KEY')
    print(f"Testing API Key from .env: {api_key[:10]}...")
    genai.configure(api_key=api_key)
    # Using a model from the list
    model = genai.GenerativeModel('gemini-pro-latest')
    
    try:
        response = model.generate_content("Say hello")
        print("Success!")
        print(f"Response: {response.text}")
        return True
    except Exception as e:
        print(f"Failed: {e}")
        return False

if __name__ == "__main__":
    verify_from_env()
