from tests.conftest import get_token_headers


def test_list_vehicles(client, seed_test_data):
    dispatcher = seed_test_data["dispatcher"]
    headers = get_token_headers(dispatcher)
    res = client.get("/api/v1/vehicles", headers=headers)
    assert res.status_code == 200
    assert res.json()["total"] >= 1


def test_driver_can_update_own_vehicle_location(client, seed_test_data):
    driver = seed_test_data["driver"]
    vehicle = seed_test_data["vehicle"]
    headers = get_token_headers(driver)

    update_payload = {
        "latitude": 20.3012,
        "longitude": 85.8340,
        "speed_kmh": 45.0,
        "heading_deg": 180.0,
        "fuel_level_percent": 85,
    }
    res = client.post(f"/api/v1/vehicles/{vehicle.id}/location", headers=headers, json=update_payload)
    assert res.status_code == 200
    assert res.json()["current_latitude"] == 20.3012
    assert res.json()["current_longitude"] == 85.8340
    assert res.json()["speed_kmh"] == 45.0


def test_unauthorized_driver_cannot_update_other_vehicle_location(client, seed_test_data):
    driver2 = seed_test_data["driver2"]  # Not assigned to vehicle
    vehicle = seed_test_data["vehicle"]
    headers = get_token_headers(driver2)

    update_payload = {
        "latitude": 20.3012,
        "longitude": 85.8340,
        "speed_kmh": 50.0,
    }
    res = client.post(f"/api/v1/vehicles/{vehicle.id}/location", headers=headers, json=update_payload)
    assert res.status_code == 403
    assert res.json()["error"]["code"] == "UNAUTHORIZED_VEHICLE_CONTROL"


def test_double_vehicle_assignment_prevented(client, seed_test_data):
    citizen = seed_test_data["citizen"]
    dispatcher = seed_test_data["dispatcher"]
    vehicle = seed_test_data["vehicle"]
    citizen_headers = get_token_headers(citizen)
    dispatcher_headers = get_token_headers(dispatcher)

    # Create Emergency 1
    emg1 = client.post(
        "/api/v1/emergencies",
        headers=citizen_headers,
        json={
            "type": "MEDICAL",
            "priority": "HIGH",
            "pickup_address": "Saheed Nagar",
            "pickup_latitude": 20.2961,
            "pickup_longitude": 85.8245,
            "destination_name": "AIIMS",
            "destination_latitude": 20.2285,
            "destination_longitude": 85.7765,
        },
    ).json()

    # Create Emergency 2
    emg2 = client.post(
        "/api/v1/emergencies",
        headers=citizen_headers,
        json={
            "type": "MEDICAL",
            "priority": "CRITICAL",
            "pickup_address": "Jayadev Vihar",
            "pickup_latitude": 20.3041,
            "pickup_longitude": 85.8239,
            "destination_name": "AIIMS",
            "destination_latitude": 20.2285,
            "destination_longitude": 85.7765,
        },
    ).json()

    # Assign vehicle to Emergency 1 -> Should succeed
    res1 = client.post(
        f"/api/v1/emergencies/{emg1['id']}/assign",
        headers=dispatcher_headers,
        json={"vehicle_id": vehicle.id},
    )
    assert res1.status_code == 200

    # Assign same vehicle to Emergency 2 -> Must fail with 409 Conflict
    res2 = client.post(
        f"/api/v1/emergencies/{emg2['id']}/assign",
        headers=dispatcher_headers,
        json={"vehicle_id": vehicle.id},
    )
    assert res2.status_code == 409
    assert res2.json()["error"]["code"] == "VEHICLE_UNAVAILABLE"
