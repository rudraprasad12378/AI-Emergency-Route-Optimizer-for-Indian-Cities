from tests.conftest import get_token_headers


def test_calculate_routes_and_ai_recommendation(client, seed_test_data):
    dispatcher = seed_test_data["dispatcher"]
    headers = get_token_headers(dispatcher)

    calc_payload = {
        "pickup_lat": 20.2961,
        "pickup_lng": 85.8245,
        "dest_lat": 20.2285,
        "dest_lng": 85.7765,
        "priority": "CRITICAL",
        "avoid_incidents": True,
    }
    response = client.post("/api/v1/routes/calculate", headers=headers, json=calc_payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["routes"]) >= 1
    assert data["ai_recommendation"] is not None
    assert "recommended_route_id" in data["ai_recommendation"]
    assert data["ai_recommendation"]["time_saved_minutes"] >= 0
    assert data["ai_recommendation"]["confidence"] > 0.5


def test_dispatcher_reroute_flow(client, seed_test_data):
    citizen = seed_test_data["citizen"]
    dispatcher = seed_test_data["dispatcher"]
    driver = seed_test_data["driver"]
    vehicle = seed_test_data["vehicle"]
    hospital = seed_test_data["hospital"]

    citizen_headers = get_token_headers(citizen)
    dispatcher_headers = get_token_headers(dispatcher)
    driver_headers = get_token_headers(driver)

    # 1. Create and progress emergency to EN_ROUTE
    emg = client.post(
        "/api/v1/emergencies",
        headers=citizen_headers,
        json={
            "type": "MEDICAL",
            "priority": "CRITICAL",
            "pickup_address": "Saheed Nagar",
            "pickup_latitude": 20.2961,
            "pickup_longitude": 85.8245,
            "destination_name": hospital.name,
            "destination_latitude": hospital.latitude,
            "destination_longitude": hospital.longitude,
        },
    ).json()
    emg_id = emg["id"]

    client.post(f"/api/v1/emergencies/{emg_id}/assign", headers=dispatcher_headers, json={"vehicle_id": vehicle.id})
    client.post(f"/api/v1/emergencies/{emg_id}/accept", headers=driver_headers)
    client.post(f"/api/v1/emergencies/{emg_id}/start", headers=driver_headers)

    # 2. Execute Reroute
    reroute_res = client.post(
        "/api/v1/routes/reroute",
        headers=dispatcher_headers,
        json={
            "emergency_id": emg_id,
            "reason": "Sudden road flooding reported at primary corridor",
        },
    )
    assert reroute_res.status_code == 200
    rdata = reroute_res.json()
    assert rdata["status"] == "REROUTED"
    assert rdata["event_id"] is not None
    assert len(rdata["routes"]) >= 1
