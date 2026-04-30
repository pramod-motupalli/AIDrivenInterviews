from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages

def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid email or password.")
            
    return render(request, 'login_screen.html')

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def dashboard_view(request):
    total_applications = JobApplication.objects.filter(recruiter=request.user).count()
    recent_applications = JobApplication.objects.filter(recruiter=request.user).order_by('-created_at')[:5]
    
    context = {
        'total_jobs': total_applications, # Assuming each application is for a job in this simplified model
        'total_candidates': total_applications,
        'recent_applications': recent_applications,
    }
    return render(request, 'dashboard_screen.html', context)

from .models import JobApplication

@login_required
def jobs_view(request):
    if request.method == 'POST':
        jd_file = request.FILES.get('jd_file')
        jd_text = request.POST.get('jd_text')
        resume_file = request.FILES.get('resume_file')
        
        if (jd_file or jd_text) and resume_file:
            JobApplication.objects.create(
                recruiter=request.user,
                jd_file=jd_file,
                jd_text=jd_text,
                resume_file=resume_file
            )
            messages.success(request, "Application processed successfully!")
            return redirect('jobs')
        else:
            messages.error(request, "Please provide a Job Description (File or Text) and a Candidate Resume.")
            
    applications = JobApplication.objects.filter(recruiter=request.user).order_by('-created_at')
    return render(request, 'jobs_screen.html', {'applications': applications})

@login_required
def reports_view(request):
    applications = JobApplication.objects.filter(recruiter=request.user).order_by('-created_at')
    return render(request, 'reports_screen.html', {'applications': applications})

@login_required
def report_detail_view(request, id):
    return render(request, 'report_detail_screen.html')
