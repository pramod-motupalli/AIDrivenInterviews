import requests
import io

token = '96206813-6bef-4ead-904c-bc010fd61c3c'
url = 'http://localhost:8000/api/v1/interviews/anomaly/'

data = {
    'token': token,
    'event_type': 'Tech Object Detected (Cell Phone)',
    'severity': 'high',
    'terminate': 'false'
}
files = {
    'image': ('snapshot.png', io.BytesIO(b'fake image data'), 'image/png')
}

response = requests.post(url, data=data, files=files)
print(response.status_code)
print(response.json())
