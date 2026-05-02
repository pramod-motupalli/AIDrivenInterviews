from django.db import models
from django.conf import settings
from jobs.models import Job

class Interview(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('malpractice', 'Malpractice'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('on_hold', 'On Hold'),
    )

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='interviews')
    candidate = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='interviews')
    
    session_token = models.CharField(max_length=255, unique=True, null=True, blank=True)
    link1 = models.URLField(max_length=500, blank=True)
    link2 = models.URLField(max_length=500, blank=True)
    link1_expiry = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    question_bank = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate.email} - {self.job.title}"

class Response(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='responses')
    question_index = models.IntegerField()
    question_text = models.TextField()
    answer_text = models.TextField()
    
    relevance_score = models.FloatField(null=True, blank=True)
    accuracy_score = models.FloatField(null=True, blank=True)
    clarity_score = models.FloatField(null=True, blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response {self.question_index} for {self.interview.id}"

class AnomalyLog(models.Model):
    SEVERITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='anomalies')
    event_type = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='low')
    snapshot_url = models.URLField(max_length=500, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event_type} - {self.interview.id}"
