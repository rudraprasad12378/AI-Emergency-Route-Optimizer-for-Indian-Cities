from tests.conftest import get_token_headers


def test_hospitals_and_incoming_emergencies(client, seed_test_data):
    hospital_user = seed_test_data["hospital_user"]
    hospital = seed_test_data["hospital"]
    citizen = seed_test_data["citizen"]
    dispatcher = seed_test_data["dispatcher"]
    driver = seed_test_data["driver"]
    vehicle = seed_test_data["vehicle"]

    hosp_headers = get_token_headers(hospital_user)
    cit_headers = get_token_headers(citizen)
    disp_headers = get_token_headers(dispatcher)
    drv_headers = get_token_headers(driver)

    # 1. List trauma centers
    hosp_list_res = client.get("/api/v1/hospitals", headers=hosp_headers)
    assert hosp_list_res.status_code == 200
    assert len(hosp_list_res.json()) >= 1

    # 2. Create and dispatch emergency inbound to this hospital
    emg_res = client.post(
        "/api/v1/emergencies",
        headers=cit_headers,
        json={
            "type": "MEDICAL",
            "priority": "CRITICAL",
            "pickup_address": "Baramunda, Bhubaneswar",
            "pickup_latitude": 20.2748,
            "pickup_longitude": 85.7951,
            "destination_name": hospital.name,
            "destination_latitude": hospital.latitude,
            "destination_longitude": hospital.longitude,
            "destination_hospital_id": hospital.id,
        },
    )
    emg_id = emg_res.json()["id"]

    client.post(f"/api/v1/emergencies/{emg_id}/assign", headers=disp_headers, json={"vehicle_id": vehicle.id})
    client.post(f"/api/v1/emergencies/{emg_id}/accept", headers=drv_headers)
    client.post(f"/api/v1/emergencies/{emg_id}/start", headers=drv_headers)

    # 3. Hospital checks incoming emergencies
    incoming_res = client.get(f"/api/v1/hospitals/incoming?hospital_id={hospital.id}", headers=hosp_headers)
    assert incoming_res.status_code == 200
    incoming_list = incoming_res.json()
    assert any(e["id"] == emg_id for e in incoming_list)
