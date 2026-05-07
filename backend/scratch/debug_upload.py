import requests

def debug_upload():
    login_url = "http://localhost:8000/api/v1/auth/login/"
    upload_url = "http://localhost:8000/api/v1/upload/"
    
    # 1. Login
    print("Logging in...")
    login_data = {"email": "v@gmail.com", "password": "123"}
    res = requests.post(login_url, json=login_data)
    if res.status_code != 200:
        print(f"Login failed: {res.status_code} {res.text}")
        return
    
    token = res.json().get('access')
    print(f"Logged in. Token starts with: {token[:10]}")
    
    # 2. Upload JD
    print("Uploading JD...")
    files = {'file': ('test_jd.pdf', b'fake pdf content', 'application/pdf')}
    data = {'type': 'jd'}
    headers = {'Authorization': f'Bearer {token}'}
    
    res = requests.post(upload_url, headers=headers, files=files, data=data)
    print(f"Upload Response Status: {res.status_code}")
    print(f"Upload Response Body: {res.text}")

if __name__ == "__main__":
    debug_upload()
