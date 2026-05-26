import re
import os

views_path = r"c:\Users\Abhishek\AI_Interview_App\backend\interviews\views.py"

with open(views_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Define the generate_interview_report function
# We'll insert it right above `class SubmitAnswerView(APIView):`
func_code = """
def generate_interview_report(interview):
    try:
        from reports.models import Report
        from ai_engine.services import GroqAIService
        
        ai_service = GroqAIService()
        responses = InterviewResponse.objects.filter(interview=interview)
        
        status_note = ""
        if interview.status == 'malpractice':
            status_note = "\\nCRITICAL NOTE: This interview was TERMINATED EARLY due to suspected malpractice (e.g. cheating, tab switching, multiple people). You must give an overall score of 0, and strongly recommend 'Reject'."
            
        if not responses.exists() and interview.status == 'malpractice':
            responses_text = "No responses provided (Interview terminated early)."
        else:
            responses_text = "\\n".join([f"Q: {r.question_text}\\nA: {r.answer_text}\\nScore: {r.relevance_score+r.accuracy_score+r.clarity_score}/300" for r in responses])
        
        report_prompt = f\"\"\"
You are a Senior Talent Acquisition Lead. Summarize this technical interview.
Job Description: {interview.job.description[:500]}
Responses:
{responses_text}{status_note}

Provide:
1. Overall Score (0-100)
2. Overall Summary (brief 2-3 sentence overview of the performance)
3. Strengths
4. Weaknesses
5. Recommendation (Hire/Reject/Maybe)

Return ONLY a JSON object:
{{
    "overall_score": 85,
    "overall_summary": "A brief overview...",
    "strengths": "List strengths",
    "weaknesses": "List weaknesses",
    "recommendation": "Hire"
}}
\"\"\"
        report_data = ai_service._chat_json(report_prompt)
        report_obj = Report.objects.create(
            interview=interview,
            overall_score=report_data.get('overall_score', 0),
            overall_summary=report_data.get('overall_summary', 'No summary generated.'),
            strengths=report_data.get('strengths', ''),
            weaknesses=report_data.get('weaknesses', ''),
            recommendation=report_data.get('recommendation', 'Reject'),
            is_visible_to_candidate=True
        )

        try:
            from core.supabase_client import supabase_service
            import uuid as _uuid
            candidate_email = interview.candidate.email
            unique_id = str(_uuid.uuid4())
            report_remote_path = f"reports/{unique_id}_{interview.id}_report.json"

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
                "status": interview.status,
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

            supabase_service.update_screening_with_report(candidate_email, report_url)
            report_obj.pdf_s3_url = report_url
            report_obj.save()
            print(f"Report uploaded to Supabase: {report_url}")
        except Exception as supabase_err:
            print(f"Supabase report upload failed: {supabase_err}")

    except Exception as e:
        print(f"Error generating report: {e}")

class SubmitAnswerView(APIView):
"""

content = content.replace("class SubmitAnswerView(APIView):", func_code)

# 2. Replace the chunk in SubmitAnswerView with a call to generate_interview_report(interview)
chunk_to_replace = '''                # Generate Final Report
                try:
                    from reports.models import Report
                    responses = InterviewResponse.objects.filter(interview=interview)
                    responses_text = "\\n".join([f"Q: {r.question_text}\\nA: {r.answer_text}\\nScore: {r.relevance_score+r.accuracy_score+r.clarity_score}/300" for r in responses])
                    
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

                    # Candidate results portal is disabled; no completion email or password reset needed.

                except Exception as e:
                    print(f"Error generating report: {e}")'''

content = content.replace(chunk_to_replace, "                # Generate Final Report\n                generate_interview_report(interview)")

# 3. Add to AnomalyLogView
anomaly_chunk = """            if terminate:
                interview.status = 'malpractice'
                interview.save()"""

anomaly_replacement = """            if terminate:
                interview.status = 'malpractice'
                interview.save()
                
                # Generate a report even if terminated due to malpractice
                generate_interview_report(interview)"""

content = content.replace(anomaly_chunk, anomaly_replacement)

with open(views_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Refactoring complete.")
