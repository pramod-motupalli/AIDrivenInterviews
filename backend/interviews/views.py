from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from jobs.models import Job
from .models import Interview
from notifications.utils import send_html_email
import uuid
import secrets
import string
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class InviteCandidateView(APIView):
    permission_classes = [IsAuthenticated] # Assuming Recruiter

    def post(self, request):
        email = request.data.get('email')
        job_id = request.data.get('job_id')
        job_title = request.data.get('job_title') # Support for extracted jobs
        resume_text = request.data.get('resume_text', '') # Fetch resume text from request
        candidate_name = request.data.get('name', '') # Capture candidate name sent by UI

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Handle job creation if job_id is not provided
        if not job_id:
            if not job_title:
                return Response({"error": "Job ID or Job Title is required"}, status=status.HTTP_400_BAD_REQUEST)
            job, _ = Job.objects.get_or_create(
                title=job_title, 
                recruiter=request.user,
                defaults={'description': f"Auto-generated job for {job_title}"}
            )
        else:
            try:
                job = Job.objects.get(id=job_id, recruiter=request.user)
            except Job.DoesNotExist:
                return Response({"error": "Job not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

        user, created = User.objects.get_or_create(email=email, defaults={'role': 'candidate'})

        # Always generate a fresh temp password on every invite
        # so the candidate always receives working credentials in their email
        alphabet = string.ascii_letters + string.digits
        temp_password = ''.join(secrets.choice(alphabet) for _ in range(12))
        user.set_password(temp_password)
        user.is_first_login = True
        user.role = 'candidate'
        user.is_active = True
        user.save()

        # Create Interview Session
        session_token = str(uuid.uuid4())
        # Link 1: time-bound candidate interview link
        invite_link = f"{settings.CANDIDATE_FRONTEND_URL}/interview/{session_token}"
        # Link 2: permanent recruiter tracking link
        tracking_link = f"{settings.RECRUITER_FRONTEND_URL}/recruiter/interviews/{session_token}/track"

        interview = Interview.objects.create(
            job=job,
            candidate=user,
            session_token=session_token,
            link1=invite_link,
            link2=tracking_link,
            link1_expiry=timezone.now() + timedelta(hours=settings.SESSION_LINK_EXPIRY_HOURS),
            resume_text=resume_text,
            candidate_name=candidate_name
        )

        # Send Email with credentials and both links
        context = {
            'job_title': job.title,
            'email': user.email,
            'invite_link': invite_link,
            'tracking_link': tracking_link,
        }
        send_html_email("Interview Invitation", "emails/invite_email.html", context, [user.email])

        return Response({
            "message": "Candidate invited successfully",
            "interview_id": str(interview.id),
            "session_token": session_token,
            "invite_link": invite_link,
            "tracking_link": tracking_link,
        }, status=status.HTTP_201_CREATED)

class ValidateSessionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            interview = Interview.objects.get(session_token=token)
            
            # Check Expiry
            if interview.link1_expiry and interview.link1_expiry < timezone.now():
                return Response({"error": "Session link has expired"}, status=status.HTTP_403_FORBIDDEN)
            
            # Try to extract name if not already set
            if not interview.candidate_name and interview.resume_text:
                try:
                    from ai_engine.services import GroqAIService
                    ai_service = GroqAIService()
                    jd_text = interview.job.description if interview.job else ""
                    screening_data = ai_service.process_screening(jd_text, interview.resume_text)
                    extracted_name = screening_data.get('candidate_details', {}).get('name')
                    if extracted_name and extracted_name != "N/A":
                        interview.candidate_name = extracted_name
                        interview.save()
                except Exception as e:
                    print(f"Name extraction error in validate session: {e}")

            refresh = RefreshToken.for_user(interview.candidate)
            return Response({
                "valid": True,
                "candidate_name": interview.candidate_name or interview.candidate.email,
                "job_title": interview.job.title,
                "status": interview.status,
                "interview_id": str(interview.id),
                "recruiter_name": interview.job.recruiter.email,
                "access_token": str(refresh.access_token)
            }, status=status.HTTP_200_OK)

            
        except Interview.DoesNotExist:
            return Response({"error": "Invalid session token"}, status=status.HTTP_404_NOT_FOUND)

from ai_engine.services import GroqAIService
from .models import Interview, Response as InterviewResponse

class StartInterviewView(APIView):
    permission_classes = [AllowAny] # Session token provides security

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({"error": "Session token required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            interview = Interview.objects.get(session_token=token)
            ai_service = GroqAIService()

            # 1. Extract candidate name from resume if not already set
            if not interview.candidate_name and interview.resume_text:
                jd_text = interview.job.description if interview.job else ""
                screening_data = ai_service.process_screening(jd_text, interview.resume_text)
                candidate_info = screening_data.get('candidate_details', {})
                extracted_name = candidate_info.get('name')
                if extracted_name and extracted_name != "N/A":
                    interview.candidate_name = extracted_name
                    interview.save()

            # 2. Generate first question if bank is empty
            if not interview.question_bank:
                first_q = ai_service.generate_next_question(interview)
                interview.question_bank = [{"text": first_q, "index": 0}]
                interview.status = 'in_progress'
                interview.save()
            
            return Response({
                "questions": interview.question_bank,
                "candidate_name": interview.candidate_name or interview.candidate.email,
                "job_title": interview.job.title,
                "status": interview.status
            }, status=status.HTTP_200_OK)

        except Interview.DoesNotExist:
            return Response({"error": "Invalid session token"}, status=status.HTTP_404_NOT_FOUND)

class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated] # Candidate should be authenticated by now

    def post(self, request):
        interview_id = request.data.get('interview_id')
        question_text = request.data.get('question_text')
        answer_text = request.data.get('answer_text')
        question_index = request.data.get('question_index', 0)

        try:
            interview = Interview.objects.get(id=interview_id, candidate=request.user)
            ai_service = GroqAIService()

            # 1. Evaluate the answer
            evaluation = ai_service.evaluate_answer(question_text, answer_text)
            
            # 2. Save Response
            InterviewResponse.objects.create(
                interview=interview,
                question_index=question_index,
                question_text=question_text,
                answer_text=answer_text,
                relevance_score=evaluation.get('relevance_score'),
                accuracy_score=evaluation.get('accuracy_score'),
                clarity_score=evaluation.get('clarity_score')
            )

            # 3. Decide on next question (Limit to 5)
            next_index = question_index + 1
            if next_index < 5:
                next_q_text = ai_service.generate_next_question(
                    interview, 
                    previous_answer=answer_text, 
                    previous_score=evaluation.get('overall_score')
                )
                
                # Update question bank
                interview.question_bank.append({"text": next_q_text, "index": next_index})
                interview.save()
                
                return Response({
                    "next_question": next_q_text,
                    "index": next_index,
                    "evaluation": evaluation,
                    "is_complete": False
                }, status=status.HTTP_200_OK)
            else:
                interview.status = 'completed'
                interview.save()

                # Generate Final Report
                try:
                    from reports.models import Report
                    responses = InterviewResponse.objects.filter(interview=interview)
                    responses_text = "\n".join([f"Q: {r.question_text}\nA: {r.answer_text}\nScore: {r.relevance_score+r.accuracy_score+r.clarity_score}/300" for r in responses])
                    
                    report_prompt = f"""
You are a Senior Talent Acquisition Lead. Summarize this technical interview.
Job Description: {interview.job.description[:500]}
Responses:
{responses_text}

Provide:
1. Overall Score (0-100)
2. Overall Summary (brief 2-3 sentence overview of the performance)
3. Strengths
4. Weaknesses
5. Recommendation (Hire/Reject/Maybe)

Return ONLY a JSON object:
{{
    "overall_score": 85,
    "overall_summary": "A brief overview of how the candidate performed across all questions.",
    "strengths": "List strengths",
    "weaknesses": "List weaknesses",
    "recommendation": "Hire"
}}
"""
                    report_data = ai_service._chat_json(report_prompt)
                    report_obj = Report.objects.create(
                        interview=interview,
                        overall_score=report_data.get('overall_score'),
                        overall_summary=report_data.get('overall_summary'),
                        strengths=report_data.get('strengths'),
                        weaknesses=report_data.get('weaknesses'),
                        recommendation=report_data.get('recommendation'),
                        is_visible_to_candidate=True
                    )

                    # Upload full report JSON to Supabase Storage
                    try:
                        from core.supabase_client import supabase_service
                        import uuid as _uuid
                        candidate_email = interview.candidate.email
                        unique_id = str(_uuid.uuid4())
                        report_remote_path = f"reports/{unique_id}_{interview.id}_report.json"

                        # Build a rich report payload to store in Supabase
                        all_responses = InterviewResponse.objects.filter(interview=interview).order_by('question_index')
                        supabase_report_payload = {
                            "interview_id": str(interview.id),
                            "candidate_name": interview.candidate_name or candidate_email,
                            "candidate_email": candidate_email,
                            "job_title": interview.job.title if interview.job else "",
                            "overall_score": report_data.get('overall_score'),
                            "overall_summary": report_data.get('overall_summary'),
                            "strengths": report_data.get('strengths'),
                            "weaknesses": report_data.get('weaknesses'),
                            "recommendation": report_data.get('recommendation'),
                            "responses": [
                                {
                                    "question_index": r.question_index,
                                    "question": r.question_text,
                                    "answer": r.answer_text,
                                    "relevance_score": r.relevance_score,
                                    "accuracy_score": r.accuracy_score,
                                    "clarity_score": r.clarity_score,
                                }
                                for r in all_responses
                            ]
                        }

                        report_url = supabase_service.upload_json_report(
                            supabase_report_payload,
                            report_remote_path
                        )

                        # Update the screenings table row for this candidate with the report URL
                        supabase_service.update_screening_with_report(candidate_email, report_url)

                        # Also store report URL on the Report model for easy retrieval
                        report_obj.pdf_s3_url = report_url
                        report_obj.save()

                        print(f"Report uploaded to Supabase: {report_url}")
                    except Exception as supabase_err:
                        print(f"Supabase report upload failed (non-critical): {supabase_err}")

                    # 4. Generate new password and send completion email
                    try:
                        import string, secrets
                        from notifications.utils import send_candidate_completion_email
                        
                        user = interview.candidate
                        alphabet = string.ascii_letters + string.digits
                        new_password = ''.join(secrets.choice(alphabet) for _ in range(12))
                        
                        user.set_password(new_password)
                        user.save()
                        
                        send_candidate_completion_email(user, new_password)
                        print(f"Sent completion email to {user.email}")
                    except Exception as mail_err:
                        print(f"Failed to send completion email: {mail_err}")

                except Exception as e:
                    print(f"Error generating report: {e}")

                return Response({
                    "is_complete": True,
                    "evaluation": evaluation,
                    "interview_id": str(interview.id),
                    "message": "Interview completed successfully"
                }, status=status.HTTP_200_OK)

        except Interview.DoesNotExist:
            return Response({"error": "Interview not found"}, status=status.HTTP_404_NOT_FOUND)


class GetResultsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        interview_id = request.query_params.get('interview_id')
        try:
            if interview_id:
                interview = Interview.objects.get(id=interview_id, candidate=request.user)
            else:
                interview = Interview.objects.filter(candidate=request.user, status='completed').latest('created_at')
        except Interview.DoesNotExist:
            return Response({"error": "Interview not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch Q&A responses
        responses = InterviewResponse.objects.filter(interview=interview).order_by('question_index')
        qa_list = [
            {
                "question": r.question_text,
                "answer": r.answer_text,
                "relevance_score": r.relevance_score,
                "accuracy_score": r.accuracy_score,
                "clarity_score": r.clarity_score,
            }
            for r in responses
        ]

        # Fetch the AI-generated report
        report_data = {}
        try:
            report = interview.report
            report_data = {
                "overall_score": report.overall_score,
                "strengths": report.strengths,
                "weaknesses": report.weaknesses,
                "recommendation": report.recommendation,
            }
        except Exception:
            pass

        return Response({
            "candidate_name": interview.candidate_name or interview.candidate.email,
            "job_title": interview.job.title if interview.job else "",
            "status": interview.status,
            "responses": qa_list,
            **report_data,
        }, status=status.HTTP_200_OK)


from rest_framework import viewsets, serializers

class InterviewSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)

    class Meta:
        model = Interview
        fields = ['id', 'job_title', 'candidate_email', 'status', 'ats_score', 'created_at', 'link1_expiry', 'candidate_name']
        read_only_fields = ['id', 'job_title', 'candidate_email', 'ats_score', 'created_at', 'link1_expiry']

class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'recruiter':
            return Interview.objects.filter(job__recruiter=user)
        elif user.role == 'candidate':
            return Interview.objects.filter(candidate=user)
        return Interview.objects.none()


class SubmitReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from .models import CandidateReview
        interview_id = request.data.get('interview_id')
        
        interview = None
        if interview_id:
            try:
                interview = Interview.objects.get(id=interview_id, candidate=request.user)
            except Interview.DoesNotExist:
                pass

        review, _ = CandidateReview.objects.update_or_create(
            candidate_email=request.user.email,
            defaults={
                'interview': interview,
                'overall_experience': request.data.get('overall_experience'),
                'ai_clarity': request.data.get('ai_clarity'),
                'ease_of_use': request.data.get('ease_of_use'),
                'technical_stability': request.data.get('technical_stability'),
                'comment': request.data.get('comment', ''),
            }
        )
        return Response({"message": "Review submitted successfully"}, status=status.HTTP_201_CREATED)
