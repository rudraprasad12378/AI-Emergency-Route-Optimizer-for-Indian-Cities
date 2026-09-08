from tests.conftest import get_token_headers


def test_full_emergency_lifecycle_and_state_machine(client, seed_test_data):
    citizen = seed_test_data["citizen"]
    dispatcher = seed_test_data["dispatcher"]
    driver = seed_test_data["driver"]
    vehicle = seed_test_data["vehicle"]
    hospital = seed_test_data["hospital"]

    citizen_headers = get_token_headers(citizen)
    dispatcher_headers = get_token_headers(dispatcher)
    driver_headers = get_token_headers(driver)

    # 1. Citizen creates SOS Emergency
    create_payload = {
        "type": "MEDICAL",
        "priority": "CRITICAL",
        "pickup_address": "Khandagiri Square, Bhubaneswar",
        "pickup_latitude": 20.2588,
        "pickup_longitude": 85.7836,
        "destination_name": hospital.name,
        "destination_latitude": hospital.latitude,
        "destination_longitude": hospital.longitude,
        "description": "Pedestrian accident, acute head injury",
        "caller_name": "Debabrata Dash",
        "caller_phone": "+919876543214",
    }
    create_res = client.post("/api/v1/emergencies", headers=citizen_headers, json=create_payload)
    assert create_res.status_code == 201
    emergency = create_res.json()
    emergency_id = emergency["id"]
    assert emergency["status"] == "REQUESTED"
    assert emergency["emergency_number"].startswith("EMG-")

    # 2. Dispatcher Triages the Emergency
    triage_res = client.post(
        f"/api/v1/emergencies/{emergency_id}/triage",
        headers=dispatcher_headers,
        json={"priority": "CRITICAL", "notes": "Trauma team alerted at AIIMS"},
    )
    assert triage_res.status_code == 200
    assert triage_res.json()["status"] == "TRIAGED"

    # 3. Dispatcher Assigns Available Vehicle
    assign_res = client.post(
        f"/api/v1/emergencies/{emergency_id}/assign",
        headers=dispatcher_headers,
        json={"vehicle_id": vehicle.id, "instructions": "Proceed via Green Corridor"},
    )
    assert assign_res.status_code == 200
    assert assign_res.json()["status"] == "ASSIGNED"
    assert assign_res.json()["assigned_vehicle_id"] == vehicle.id

    # 4. Driver Accepts Emergency
    accept_res = client.post(
        f"/api/v1/emergencies/{emergency_id}/accept",
        headers=driver_headers,
    )
    assert accept_res.status_code == 200
    assert accept_res.json()["status"] == "ACCEPTED"

    # 5. Driver Starts En Route
    start_res = client.post(
        f"/api/v1/emergencies/{emergency_id}/start",
        headers=driver_headers,
    )
    assert start_res.status_code == 200
    assert start_res.json()["status"] == "EN_ROUTE"

    # 6. Driver Arrives at Scene
    arrive_res = client.post(
        f"/api/v1/emergencies/{emergency_id}/arrive",
        headers=driver_headers,
    )
    assert arrive_res.status_code == 200
    assert arrive_res.json()["status"] == "ARRIVED"

    # 7. Complete Handover
    complete_res = client.post(
        f"/api/v1/emergencies/{emergency_id}/complete",
        headers=driver_headers,
        json={"handover_notes": "Patient handed over to AIIMS ICU triage bay 1"},
    )
    assert complete_res.status_code == 200
    assert complete_res.json()["status"] == "COMPLETED"


def test_invalid_state_transition_fails(client, seed_test_data):
    citizen = seed_test_data["citizen"]
    driver = seed_test_data["driver"]
    citizen_headers = get_token_headers(citizen)
    driver_headers = get_token_headers(driver)

    # Create emergency (status: REQUESTED)
    create_payload = {
        "type": "MEDICAL",
        "priority": "HIGH",
        "pickup_address": "Saheed Nagar, Bhubaneswar",
        "pickup_latitude": 20.2961,
        "pickup_longitude": 85.8245,
        "destination_name": "AIIMS",
        "destination_latitude": 20.2285,
        "destination_longitude": 85.7765,
    }
    create_res = client.post("/api/v1/emergencies", headers=citizen_headers, json=create_payload)
    emergency_id = create_res.json()["id"]

    # Attempting to directly complete a REQUESTED emergency must fail with 409
    invalid_res = client.post(
        f"/api/v1/emergencies/{emergency_id}/complete",
        headers=driver_headers,
        json={"handover_notes": "Premature completion"},
    )
    assert invalid_res.status_code == 409
    assert invalid_res.json()["error"]["code"] == "INVALID_STATE_TRANSITION"


def test_emergency_cancellation(client, seed_test_data):
    citizen = seed_test_data["citizen"]
    dispatcher = seed_test_data["dispatcher"]
    citizen_headers = get_token_headers(citizen)
    dispatcher_headers = get_token_headers(dispatcher)

    create_res = client.post(
        "/api/v1/emergencies",
        headers=citizen_headers,
        json={
            "type": "FIRE",
            "priority": "MEDIUM",
            "pickup_address": "Patia, Bhubaneswar",
            "pickup_latitude": 20.3588,
            "pickup_longitude": 85.8312,
            "destination_name": "Fire Station",
            "destination_latitude": 20.2748,
            "destination_longitude": 85.7951,
        },
    )
    emergency_id = create_res.json()["id"]

    cancel_res = client.post(
        f"/api/v1/emergencies/{emergency_id}/cancel",
        headers=dispatcher_headers,
        json={"reason": "False alarm reported by neighborhood security"},
    )
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "CANCELLED"
