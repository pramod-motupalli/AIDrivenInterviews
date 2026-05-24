import os
import sys
import requests
from pathlib import Path
from decouple import AutoConfig

BASE_DIR = Path(__file__).resolve().parent.parent
config = AutoConfig(search_path=str(BASE_DIR.parent))

def check_supabase():
    supabase_url = config('SUPABASE_URL', default='')
    supabase_key = config('SUPABASE_KEY', default='')
    
    url = f"{supabase_url}/rest/v1/screenings"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}"
    }
    try:
        response = requests.get(url + "?limit=1", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data:
                print("Sample row:")
                for k, v in data[0].items():
                    print(f"  {k}: {v}")
            else:
                print("Table is empty or no rows returned.")
        else:
            print(f"Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_supabase()
