"""
Integration tests for Interview CRUD endpoints.
"""
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from ai_engine.models import Job
from ai_engine.models import Interview
import uuid

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def recruiter(db):
    return User.objects.create_user(
        email="recruiter@test.com",
        password="Testpass123!",
        role="recruiter",
        is_approved=True,
        is_active=True,
    )


@pytest.fixture
def other_recruiter(db):
    return User.objects.create_user(
        email="other_recruiter@test.com",
        password="Testpass123!",
        role="recruiter",
        is_approved=True,
        is_active=True,
    )


@pytest.fixture
def candidate(db):
    return User.objects.create_user(
        email="candidate@test.com",
        password="Testpass123!",
        role="candidate",
        is_active=True,
    )


@pytest.fixture
def job(db, recruiter):
    return Job.objects.create(
        title="Software Engineer",
        description="Build cool things.",
        recruiter=recruiter,
    )


@pytest.fixture
def interview(db, job, candidate):
    return Interview.objects.create(
        job=job,
        candidate=candidate,
        session_token=str(uuid.uuid4()),
        status="scheduled",
    )


def auth_client(api_client, user):
    url = reverse("token_obtain_pair")
    resp = api_client.post(url, {"email": user.email, "password": "Testpass123!"})
    token = resp.data["access"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return api_client


@pytest.mark.django_db
class TestInterviewList:
    def test_recruiter_sees_own_interviews(self, api_client, recruiter, interview):
        client = auth_client(api_client, recruiter)
        resp = client.get("/api/v1/interviews/interviews/")
        assert resp.status_code == 200
        results = resp.data.get('results', resp.data)
        assert len(results) == 1

    def test_recruiter_cannot_see_others_interviews(self, api_client, other_recruiter, interview):
        client = auth_client(api_client, other_recruiter)
        resp = client.get("/api/v1/interviews/interviews/")
        assert resp.status_code == 200
        results = resp.data.get('results', resp.data)
        assert len(results) == 0

    def test_candidate_sees_own_interviews(self, api_client, candidate, interview):
        client = auth_client(api_client, candidate)
        resp = client.get("/api/v1/interviews/interviews/")
        assert resp.status_code == 200
        results = resp.data.get('results', resp.data)
        assert len(results) == 1

    def test_unauthenticated_blocked(self, api_client):
        resp = api_client.get("/api/v1/interviews/interviews/")
        assert resp.status_code == 401


@pytest.mark.django_db
class TestInterviewDetail:
    def test_recruiter_can_retrieve(self, api_client, recruiter, interview):
        client = auth_client(api_client, recruiter)
        resp = client.get(f"/api/v1/interviews/interviews/{interview.id}/")
        assert resp.status_code == 200
        assert resp.data["id"] == interview.id

    def test_other_recruiter_cannot_retrieve(self, api_client, other_recruiter, interview):
        client = auth_client(api_client, other_recruiter)
        resp = client.get(f"/api/v1/interviews/interviews/{interview.id}/")
        assert resp.status_code == 404


@pytest.mark.django_db
class TestInterviewStatusUpdate:
    def test_recruiter_can_update_status(self, api_client, recruiter, interview):
        client = auth_client(api_client, recruiter)
        resp = client.patch(
            f"/api/v1/interviews/interviews/{interview.id}/",
            {"status": "completed"},
            format="json",
        )
        assert resp.status_code == 200
        interview.refresh_from_db()
        assert interview.status == "completed"
