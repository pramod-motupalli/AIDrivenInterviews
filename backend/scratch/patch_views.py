import re

path = 'interviews/views.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Normalize line endings
content = content.replace('\r\n', '\n')

old_block = (
    "        user, created = User.objects.get_or_create(email=email, defaults={'role': 'candidate'})\n"
    "        # No password needed, using session tokens for access\n"
    "\n"
    "        # Create Interview Session\n"
    "        session_token = str(uuid.uuid4())\n"
    "        # Link points to candidate frontend URL\n"
    "        invite_link = f\"{settings.FRONTEND_URL}/interview/{session_token}\"\n"
    "        \n"
    "        interview = Interview.objects.create(\n"
    "            job=job,\n"
    "            candidate=user,\n"
    "            session_token=session_token,\n"
    "            link1=invite_link,\n"
    "            link1_expiry=timezone.now() + timedelta(hours=settings.SESSION_LINK_EXPIRY_HOURS),\n"
    "            resume_text=resume_text\n"
    "        )\n"
    "\n"
    "        # Send Email\n"
    "        context = {\n"
    "            'job_title': job.title,\n"
    "            'email': user.email,\n"
    "            'invite_link': invite_link\n"
    "        }\n"
    "        send_html_email(\"Interview Invitation\", \"emails/invite_email.html\", context, [user.email])\n"
    "\n"
    "        return Response({\n"
    "            \"message\": \"Candidate invited successfully\", \n"
    "            \"interview_id\": interview.id,\n"
    "            \"session_token\": session_token,\n"
    "            \"invite_link\": invite_link\n"
    "        }, status=status.HTTP_201_CREATED)"
)

new_block = (
    "        user, created = User.objects.get_or_create(email=email, defaults={'role': 'candidate'})\n"
    "\n"
    "        temp_password = None\n"
    "        if created or not user.has_usable_password():\n"
    "            temp_password = User.objects.make_random_password()\n"
    "            user.set_password(temp_password)\n"
    "            user.is_first_login = True\n"
    "            user.save()\n"
    "\n"
    "        # Create Interview Session\n"
    "        session_token = str(uuid.uuid4())\n"
    "        # Link 1: time-bound candidate interview link\n"
    "        invite_link = f\"{settings.FRONTEND_URL}/interview/{session_token}\"\n"
    "        # Link 2: permanent recruiter tracking link\n"
    "        tracking_link = f\"{settings.FRONTEND_URL}/recruiter/interviews/{session_token}/track\"\n"
    "\n"
    "        interview = Interview.objects.create(\n"
    "            job=job,\n"
    "            candidate=user,\n"
    "            session_token=session_token,\n"
    "            link1=invite_link,\n"
    "            link2=tracking_link,\n"
    "            link1_expiry=timezone.now() + timedelta(hours=settings.SESSION_LINK_EXPIRY_HOURS),\n"
    "            resume_text=resume_text\n"
    "        )\n"
    "\n"
    "        # Send Email with credentials and both links\n"
    "        context = {\n"
    "            'job_title': job.title,\n"
    "            'email': user.email,\n"
    "            'invite_link': invite_link,\n"
    "            'temp_password': temp_password,\n"
    "            'tracking_link': tracking_link,\n"
    "        }\n"
    "        send_html_email(\"Interview Invitation\", \"emails/invite_email.html\", context, [user.email])\n"
    "\n"
    "        return Response({\n"
    "            \"message\": \"Candidate invited successfully\",\n"
    "            \"interview_id\": interview.id,\n"
    "            \"session_token\": session_token,\n"
    "            \"invite_link\": invite_link,\n"
    "            \"tracking_link\": tracking_link,\n"
    "        }, status=status.HTTP_201_CREATED)"
)

if old_block in content:
    content = content.replace(old_block, new_block)
    print("SUCCESS: Block replaced.")
else:
    print("ERROR: Block not found. Showing snippet around line 43:")
    lines = content.split('\n')
    for i, line in enumerate(lines[40:75], start=41):
        print(f"{i}: {repr(line)}")

# Write back with original line endings for Windows
with open(path, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)
