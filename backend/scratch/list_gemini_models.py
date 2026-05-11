import google.generativeai as genai
from decouple import config

def list_models_from_env():
    api_key = config('GEMINI_API_KEY')
    print(f"Listing models for key: {api_key[:10]}...")
    genai.configure(api_key=api_key)
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e:
        print(f"Failed to list models: {e}")

if __name__ == "__main__":
    list_models_from_env()
