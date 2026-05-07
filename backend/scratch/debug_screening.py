import requests

def debug_screening():
    login_url = "http://localhost:8000/api/v1/auth/login/"
    screening_url = "http://localhost:8000/api/v1/ai/screening/process/"
    
    # 1. Login
    print("Logging in...")
    login_data = {"email": "v@gmail.com", "password": "123"}
    res = requests.post(login_url, json=login_data)
    if res.status_code != 200:
        print(f"Login failed: {res.status_code} {res.text}")
        return
    
    token = res.json().get('access')
    headers = {'Authorization': f'Bearer {token}'}
    
    # 2. Trigger screening
    jd_path = "jds/JD.docx"
    resume_path = "resumes/resume.docx"
    print(f"Triggering screening for {jd_path} and {resume_path}...")
    
    res = requests.post(screening_url, headers=headers, json={
        "jd_path": jd_path,
        "resume_path": resume_path
    })
    
    print(f"Response Status: {res.status_code}")
    print(f"Response Body: {res.text}")

if __name__ == "__main__":
    debug_screening()
