from tests.conftest import get_token_headers


def test_admin_can_access_system_overview(client, seed_test_data):
    admin = seed_test_data["admin"]
    headers = get_token_headers(admin)
    response = client.get("/api/v1/admin/overview", headers=headers)
    assert response.status_code == 200
    assert "metrics" in response.json()


def test_citizen_cannot_access_admin_overview(client, seed_test_data):
    citizen = seed_test_data["citizen"]
    headers = get_token_headers(citizen)
    response = client.get("/api/v1/admin/overview", headers=headers)
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "PERMISSION_DENIED"


def test_driver_cannot_triage_emergency(client, seed_test_data):
    driver = seed_test_data["driver"]
    headers = get_token_headers(driver)
    response = client.post(
        "/api/v1/emergencies/fake-id/triage",
        headers=headers,
        json={"priority": "HIGH"},
    )
    assert response.status_code == 403


def test_citizen_cannot_assign_vehicle(client, seed_test_data):
    citizen = seed_test_data["citizen"]
    vehicle = seed_test_data["vehicle"]
    headers = get_token_headers(citizen)
    response = client.post(
        "/api/v1/emergencies/fake-id/assign",
        headers=headers,
        json={"vehicle_id": vehicle.id},
    )
    assert response.status_code == 403
