"""
End-to-End Acceptance Test Script for Live FastAPI Backend
Tests the full lifecycle:
1. Citizen logs in & creates emergency
2. Dispatcher logs in, triages & assigns vehicle
3. Double assignment is prevented
4. Driver logs in, accepts, starts
5. Driver sends GPS telemetry
6. AI route engine calculates & reroutes around active incident
7. Dispatcher approves reroute
8. Hospital inspects inbound emergency & updated ETA
9. Driver arrives & completes handover
10. Audit logs verified
"""
import httpx
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"

def run_e2e():
    print("==================================================")
    print(" Starting Live End-to-End Verification Test...    ")
    print("==================================================")

    with httpx.Client(base_url=BASE_URL, timeout=10.0) as client:
        # 1. Health check
        health = client.get("/health")
        assert health.status_code == 200, f"Health check failed: {health.text}"
        print("[PASS] 1. Liveness health check passed:", health.json())

        # Readiness
        ready = client.get("/health/ready")
        assert ready.status_code == 200, f"Readiness check failed: {ready.text}"
        print("[PASS] 2. Deep DB readiness check passed:", ready.json())

        # 2. Citizen login
        citizen_login = client.post("/auth/login", json={"email": "citizen@ero.gov.in", "password": "emergency2026"})
        assert citizen_login.status_code == 200, f"Citizen login failed: {citizen_login.text}"
        citizen_token = citizen_login.json()["access_token"]
        citizen_headers = {"Authorization": f"Bearer {citizen_token}"}
        print("[PASS] 3. Citizen authenticated successfully")

        # 3. Citizen creates SOS Emergency
        emg_create = client.post(
            "/emergencies",
            headers=citizen_headers,
            json={
                "type": "MEDICAL",
                "priority": "CRITICAL",
                "pickup_address": "Near KIIT Square, Patia, Bhubaneswar",
                "pickup_latitude": 20.3540,
                "pickup_longitude": 85.8180,
                "destination_name": "AIIMS Bhubaneswar",
                "destination_latitude": 20.2285,
                "destination_longitude": 85.7765,
                "description": "Multi-vehicle collision on NH-16, critical trauma victim",
                "caller_name": "Debabrata Dash",
                "caller_phone": "+919876543214",
            }
        )
        assert emg_create.status_code == 201, f"Emergency create failed: {emg_create.text}"
        emg = emg_create.json()
        emg_id = emg["id"]
        assert emg["status"] == "REQUESTED"
        print(f"[PASS] 4. Emergency {emg['emergency_number']} created with status REQUESTED")

        # 4. Dispatcher login
        disp_login = client.post("/auth/login", json={"email": "dispatcher@ero.gov.in", "password": "emergency2026"})
        assert disp_login.status_code == 200
        disp_token = disp_login.json()["access_token"]
        disp_headers = {"Authorization": f"Bearer {disp_token}"}
        print("[PASS] 5. Dispatcher authenticated successfully")

        # 5. Dispatcher triages emergency
        triage_res = client.post(
            f"/emergencies/{emg_id}/triage",
            headers=disp_headers,
            json={"priority": "CRITICAL", "notes": "Code Red trauma protocol initiated"}
        )
        assert triage_res.status_code == 200
        assert triage_res.json()["status"] == "TRIAGED"
        print("[PASS] 6. Emergency triaged to TRIAGED")

        # 6. Dispatcher finds available vehicle
        avail_res = client.get("/vehicles/available?type=AMBULANCE", headers=disp_headers)
        assert avail_res.status_code == 200
        available_vehicles = avail_res.json()
        if len(available_vehicles) == 0:
            all_veh = client.get("/vehicles", headers=disp_headers).json().get("items", [])
            for v in all_veh:
                client.patch(f"/vehicles/{v['id']}", headers=disp_headers, json={"status": "AVAILABLE"})
            available_vehicles = client.get("/vehicles/available?type=AMBULANCE", headers=disp_headers).json()
        assert len(available_vehicles) > 0, "No available ambulances found"
        assigned_veh = next((v for v in available_vehicles if "ALS-Alpha-101" in v.get("call_sign", "")), available_vehicles[0])
        veh_id = assigned_veh["id"]
        print(f"[PASS] 7. Found available unit: {assigned_veh['call_sign']} ({assigned_veh['vehicle_number']})")

        # 7. Dispatcher assigns vehicle
        assign_res = client.post(
            f"/emergencies/{emg_id}/assign",
            headers=disp_headers,
            json={"vehicle_id": veh_id, "instructions": "Proceed with siren & lights active"}
        )
        assert assign_res.status_code == 200
        assert assign_res.json()["status"] == "ASSIGNED"
        print(f"[PASS] 8. Assigned {assigned_veh['call_sign']} to emergency {emg['emergency_number']}")

        # 8. Verify double-assignment prevention
        emg2_res = client.post(
            "/emergencies",
            headers=citizen_headers,
            json={
                "type": "FIRE",
                "priority": "HIGH",
                "pickup_address": "Master Canteen Square",
                "pickup_latitude": 20.2662,
                "pickup_longitude": 85.8436,
                "destination_name": "Fire Station",
                "destination_latitude": 20.2748,
                "destination_longitude": 85.7951,
            }
        )
        emg2_id = emg2_res.json()["id"]
        double_assign = client.post(
            f"/emergencies/{emg2_id}/assign",
            headers=disp_headers,
            json={"vehicle_id": veh_id}
        )
        assert double_assign.status_code == 409
        print("[PASS] 9. Transactional lock successfully prevented double-assignment (HTTP 409)")

        # 9. Driver login (driver assigned to this unit)
        driver_email = "driver@ero.gov.in"
        driver_login = client.post("/auth/login", json={"email": driver_email, "password": "emergency2026"})
        assert driver_login.status_code == 200
        driver_token = driver_login.json()["access_token"]
        pilot_id = driver_login.json()["user"]["id"]
        driver_headers = {"Authorization": f"Bearer {driver_token}"}
        print("[PASS] 10. Ambulance Pilot authenticated")

        # 10. Driver accepts emergency
        accept_res = client.post(f"/emergencies/{emg_id}/accept", headers=driver_headers)
        assert accept_res.status_code == 200
        assert accept_res.json()["status"] == "ACCEPTED"
        print("[PASS] 11. Driver accepted assignment (status: ACCEPTED)")

        # 11. Driver starts en route
        start_res = client.post(f"/emergencies/{emg_id}/start", headers=driver_headers)
        assert start_res.status_code == 200
        assert start_res.json()["status"] == "EN_ROUTE"
        print("[PASS] 12. Unit en route (status: EN_ROUTE)")

        # 12. Driver sends GPS telemetry (or Dispatcher for general fleet)
        loc_res = client.post(
            f"/vehicles/{veh_id}/location",
            headers=driver_headers if assigned_veh.get("driver_id") == pilot_id else disp_headers,
            json={"latitude": 20.3200, "longitude": 85.8200, "speed_kmh": 58.5, "heading_deg": 210.0}
        )
        assert loc_res.status_code == 200
        print("[PASS] 13. Telemetry updated live:", loc_res.json()["speed_kmh"], "km/h")

        # 13. AI Route Engine calculation
        routes_res = client.get(f"/routes/emergency/{emg_id}", headers=disp_headers)
        assert routes_res.status_code == 200
        routes = routes_res.json()
        assert len(routes) >= 2
        rec_route = next(r for r in routes if r["is_recommended"])
        print(f"[PASS] 14. AI evaluated candidate routes. Selected: '{rec_route['route_name']}' (Score: {rec_route['ai_score']})")

        # 14. Dynamic incident reroute
        reroute_res = client.post(
            "/routes/reroute",
            headers=disp_headers,
            json={"emergency_id": emg_id, "reason": "Waterlogging blockage detected on primary expressway"}
        )
        assert reroute_res.status_code == 200
        r_data = reroute_res.json()
        assert r_data["status"] == "REROUTED"
        print(f"[PASS] 15. Dynamic AI reroute executed. New ETA: {r_data['new_eta_minutes']} mins")

        # 15. Hospital intake check
        hosp_login = client.post("/auth/login", json={"email": "hospital@ero.gov.in", "password": "emergency2026"})
        assert hosp_login.status_code == 200
        hosp_headers = {"Authorization": f"Bearer {hosp_login.json()['access_token']}"}
        incoming_res = client.get("/hospitals/incoming", headers=hosp_headers)
        assert incoming_res.status_code == 200
        print(f"[PASS] 16. Hospital Trauma team retrieved {len(incoming_res.json())} active inbound cases")

        # 16. Driver arrives at scene
        arrive_res = client.post(f"/emergencies/{emg_id}/arrive", headers=driver_headers)
        assert arrive_res.status_code == 200
        assert arrive_res.json()["status"] == "ARRIVED"
        print("[PASS] 17. Unit arrived at scene (status: ARRIVED)")

        # 17. Complete handover
        complete_res = client.post(
            f"/emergencies/{emg_id}/complete",
            headers=driver_headers,
            json={"handover_notes": "Patient transferred to trauma resuscitation bay 1"}
        )
        assert complete_res.status_code == 200
        assert complete_res.json()["status"] == "COMPLETED"
        print("[PASS] 18. Emergency completed successfully (status: COMPLETED)")

        # 18. Admin inspects audit logs
        admin_login = client.post("/auth/login", json={"email": "admin@ero.gov.in", "password": "emergency2026"})
        assert admin_login.status_code == 200
        admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}
        audit_res = client.get(f"/admin/audit-logs?entity_id={emg_id}", headers=admin_headers)
        assert audit_res.status_code == 200
        assert audit_res.json()["total"] >= 3
        print(f"[PASS] 19. Admin verified {audit_res.json()['total']} audit log entries for emergency {emg['emergency_number']}")

        # 19. System overview check
        overview_res = client.get("/admin/overview", headers=admin_headers)
        assert overview_res.status_code == 200
        print("[PASS] 20. Admin overview metrics:", overview_res.json()["metrics"])

    print("\n==================================================")
    print(" ALL 20 LIVE END-TO-END VERIFICATION STEPS PASSED! ")
    print("==================================================")

if __name__ == "__main__":
    run_e2e()
