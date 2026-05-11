import os
import sys
sys.path.append(os.getcwd())
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from ai_engine.services import GeminiExtractionService

def test():
    service = GeminiExtractionService()
    try:
        res = service.process_screening("Need a Python dev", "I am a Python dev")
        print(res)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
