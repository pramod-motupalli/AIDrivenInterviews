import urllib.request, json, urllib.error, sys, os

BASE = 'http://localhost:8000/api/v1'

def req(url, method='GET', data=None, token=None):
    r = urllib.request.Request(url, method=method)
    r.add_header('Content-Type', 'application/json')
    if token: r.add_header('Authorization', 'Bearer ' + token)
    if data:  r.data = json.dumps(data).encode()
    try:
        with urllib.request.urlopen(r, timeout=10) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        try: body = json.loads(e.read().decode())
        except: body = {}
        return e.code, body

sys.path.insert(0, 'backend')
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings.base'
import django; django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()

# 1. Clean up any old test user
User.objects.filter(email='profiletest@example.com').delete()

# 2. Register
code, body = req(BASE + '/auth/register/recruiter/', 'POST',
                 {'email': 'profiletest@example.com', 'password': 'Test1234!'})
msg = body.get('message', str(body))
print('[1] Register ->', code, ':', msg)

# 3. Approve via ORM
user = User.objects.get(email='profiletest@example.com')
user.is_approved = True
user.save()
print('[2] Approved user id =', user.id)

# 4. Login
code, body = req(BASE + '/auth/login/', 'POST',
                 {'email': 'profiletest@example.com', 'password': 'Test1234!'})
token = body.get('access', '')
print('[3] Login ->', code, '| token =', token[:20] + '...' if token else 'MISSING')

# 5. GET /auth/me/ — profile before update
code, body = req(BASE + '/auth/me/', token=token)
print('[4] GET /auth/me/ ->', code)
print('    full_name=%r  company=%r  title=%r  phone=%r  location=%r' % (
    body.get('full_name'), body.get('company_name'),
    body.get('title'), body.get('phone'), body.get('location')))

# 6. PATCH /auth/me/ — send profile data
patch_data = {
    'full_name': 'Alice Recruiter',
    'company_name': 'TechCorp',
    'title': 'Senior HR',
    'phone': 9876543210,
    'location': 'Hyderabad'
}
code, body = req(BASE + '/auth/me/', 'PATCH', patch_data, token=token)
print('[5] PATCH /auth/me/ ->', code)
print('    full_name=%r  company=%r  title=%r  phone=%r  location=%r' % (
    body.get('full_name'), body.get('company_name'),
    body.get('title'), body.get('phone'), body.get('location')))

# 7. GET /auth/me/ again — verify persisted
code, body = req(BASE + '/auth/me/', token=token)
print('[6] GET /auth/me/ (after patch) ->', code)
print('    full_name=%r  company=%r  title=%r  phone=%r  location=%r' % (
    body.get('full_name'), body.get('company_name'),
    body.get('title'), body.get('phone'), body.get('location')))

ok = (body.get('full_name') == 'Alice Recruiter' and
      body.get('company_name') == 'TechCorp' and
      body.get('phone') == 9876543210)
print()
print('PROFILE SAVE + RELOAD:', 'PASS' if ok else 'FAIL')
