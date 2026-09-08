from tests.conftest import get_token_headers


def test_login_success(client, seed_test_data):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "dispatcher@test.com", "password": "testpass123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "dispatcher@test.com"
    assert data["user"]["role"] == "DISPATCHER"


def test_login_invalid_password(client, seed_test_data):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "dispatcher@test.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "AUTHENTICATION_FAILED"


def test_login_inactive_user(client, seed_test_data):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "inactive@test.com", "password": "testpass123"},
    )
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "INACTIVE_USER"


def test_get_current_user_me(client, seed_test_data):
    dispatcher = seed_test_data["dispatcher"]
    headers = get_token_headers(dispatcher)
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "dispatcher@test.com"
    assert response.json()["name"] == "Test Dispatcher"


def test_unauthenticated_request_rejected(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
