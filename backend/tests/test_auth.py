"""
Integration tests for authentication endpoints.
"""
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def recruiter_user(db):
    return User.objects.create_user(
        email="recruiter@test.com",
        password="Testpass123!",
        role="recruiter",
        is_approved=True,
        is_active=True,
    )


@pytest.fixture
def candidate_user(db):
    return User.objects.create_user(
        email="candidate@test.com",
        password="Testpass123!",
        role="candidate",
        is_active=True,
        is_first_login=True,
    )


@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, api_client, recruiter_user):
        url = reverse("token_obtain_pair")
        resp = api_client.post(url, {"email": "recruiter@test.com", "password": "Testpass123!"})
        assert resp.status_code == 200
        assert "access" in resp.data
        assert "refresh" in resp.data

    def test_login_wrong_password(self, api_client, recruiter_user):
        url = reverse("token_obtain_pair")
        resp = api_client.post(url, {"email": "recruiter@test.com", "password": "wrongpass"})
        assert resp.status_code == 401

    def test_login_unknown_user(self, api_client):
        url = reverse("token_obtain_pair")
        resp = api_client.post(url, {"email": "nobody@test.com", "password": "pass"})
        assert resp.status_code == 401


@pytest.mark.django_db
class TestFirstLoginPasswordReset:
    def _auth(self, api_client, user):
        url = reverse("token_obtain_pair")
        resp = api_client.post(url, {"email": user.email, "password": "Testpass123!"})
        token = resp.data["access"]
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_reset_succeeds_on_first_login(self, api_client, candidate_user):
        self._auth(api_client, candidate_user)
        url = reverse("first_login_password_reset")
        resp = api_client.post(url, {"new_password": "NewSecurePass99!"})
        assert resp.status_code == 200
        candidate_user.refresh_from_db()
        assert candidate_user.is_first_login is False

    def test_reset_blocked_after_first_use(self, api_client, candidate_user):
        self._auth(api_client, candidate_user)
        url = reverse("first_login_password_reset")
        # First reset
        api_client.post(url, {"new_password": "NewSecurePass99!"})
        # Re-auth with new password and try again
        api_client.credentials()
        api_client.post(reverse("token_obtain_pair"), {"email": candidate_user.email, "password": "NewSecurePass99!"})
        resp = api_client.post(url, {"new_password": "AnotherPass123!"})
        # Should fail because is_first_login is now False
        assert resp.status_code in (400, 401)

    def test_reset_requires_auth(self, api_client):
        url = reverse("first_login_password_reset")
        resp = api_client.post(url, {"new_password": "SomePass123!"})
        assert resp.status_code == 401
