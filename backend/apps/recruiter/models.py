from django.db import models
from django.conf import settings

class JobApplication(models.Model):
    recruiter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_applications')
    job_title = models.CharField(max_length=255, default="New Job")
    jd_file = models.FileField(upload_to='jds/', blank=True, null=True)
    jd_text = models.TextField(blank=True, null=True)
    resume_file = models.FileField(upload_to='resumes/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.job_title} - {self.recruiter.email}"
