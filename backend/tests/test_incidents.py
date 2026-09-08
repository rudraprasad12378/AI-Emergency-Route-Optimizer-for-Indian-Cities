from tests.conftest import get_token_headers


def test_create_and_resolve_incident(client, seed_test_data):
    dispatcher = seed_test_data["dispatcher"]
    headers = get_token_headers(dispatcher)

    # 1. Report Incident
    incident_payload = {
        "title": "Khandagiri Square Tree Fall",
        "type": "ROAD_BLOCKAGE",
        "severity": "HIGH",
        "latitude": 20.2588,
        "longitude": 85.7836,
        "address": "Khandagiri Square, NH-16",
        "description": "Fallen tree blocking two lanes towards Baramunda",
        "delay_minutes": 10,
        "radius_meters": 200,
    }
    create_res = client.post("/api/v1/incidents", headers=headers, json=incident_payload)
    assert create_res.status_code == 201
    inc_data = create_res.json()
    assert inc_data["status"] == "ACTIVE"
    inc_id = inc_data["id"]

    # 2. List Active Incidents
    active_res = client.get("/api/v1/incidents/active", headers=headers)
    assert active_res.status_code == 200
    assert any(i["id"] == inc_id for i in active_res.json())

    # 3. Resolve Incident
    resolve_res = client.post(
        f"/api/v1/incidents/{inc_id}/resolve",
        headers=headers,
        json={"notes": "Tree cleared by municipal disaster response team"},
    )
    assert resolve_res.status_code == 200
    assert resolve_res.json()["status"] == "RESOLVED"
    assert resolve_res.json()["resolved_at"] is not None
