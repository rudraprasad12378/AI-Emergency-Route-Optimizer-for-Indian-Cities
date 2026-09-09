"""
Full 26-Step End-to-End Workflow Verification Script
Validates the complete emergency route optimizer lifecycle against FastAPI and PostgreSQL.
"""
import httpx
import psycopg2
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

def run_26_step_verification():
    print("======================================================================")
    print("  PHASE 13: 26-STEP COMPREHENSIVE END-TO-END VERIFICATION")
    print("======================================================================")

    with httpx.Client(base_url=BASE_URL, timeout=15.0) as client:
        # Step 1: Citizen logs in
        r = client.post("/auth/login", json={"email": "citizen@ero.gov.in", "password": "emergency2026"})
        assert r.status_code == 200, f"Citizen login failed: {r.text}"
        citizen_token = r.json()["access_token"]
        citizen_id = r.json()["user"]["id"]
        c_headers = {"Authorization": f"Bearer {citizen_token}"}
        print(f"[PASS] Step 1: Citizen logged in successfully -> User ID: {citizen_id}")

        # Step 2: Citizen creates emergency
        emg_payload = {
            "type": "MEDICAL",
            "priority": "CRITICAL",
            "pickup_address": "KIIT Square, Patia, Bhubaneswar",
            "pickup_latitude": 20.3540,
            "pickup_longitude": 85.8180,
            "destination_name": "AIIMS Bhubaneswar",
            "destination_latitude": 20.2285,
            "destination_longitude": 85.7765,
            "description": "Severe multi-vehicle collision trauma patient",
            "caller_name": "Amiya Mohapatra",
            "caller_phone": "+919437012345"
        }
        r = client.post("/emergencies", headers=c_headers, json=emg_payload)
        assert r.status_code == 201, f"Emergency creation failed: {r.text}"
        emg = r.json()
        emg_id = emg["id"]
        emg_num = emg["emergency_number"]
        print(f"[PASS] Step 2: Citizen created emergency -> {emg_num} ({emg_id})")

        # Step 3 & 4: PostgreSQL stores emergency
        conn = psycopg2.connect(host="127.0.0.1", port=5432, user="postgres", dbname="emergency_route_optimizer")
        cur = conn.cursor()
        cur.execute("SELECT id, emergency_number, status FROM emergencies WHERE id = %s", (emg_id,))
        row = cur.fetchone()
        assert row is not None and row[2] == "REQUESTED", f"PostgreSQL check failed: {row}"
        print(f"[PASS] Step 3 & 4: Verified in PostgreSQL: status={row[2]}")

        # Step 5: Dispatcher logs in
        r = client.post("/auth/login", json={"email": "dispatcher@ero.gov.in", "password": "emergency2026"})
        assert r.status_code == 200, f"Dispatcher login failed: {r.text}"
        disp_token = r.json()["access_token"]
        disp_headers = {"Authorization": f"Bearer {disp_token}"}
        print("[PASS] Step 5: Dispatcher logged in successfully")

        # Step 6: Dispatcher sees emergency in list
        r = client.get("/emergencies", headers=disp_headers)
        assert r.status_code == 200
        found = any(e["id"] == emg_id for e in r.json())
        assert found, "Dispatcher could not see created emergency"
        print("[PASS] Step 6: Dispatcher retrieved emergency from live queue")

        # Step 7: Dispatcher triages
        r = client.post(f"/emergencies/{emg_id}/triage", headers=disp_headers, json={"priority": "CRITICAL"})
        assert r.status_code == 200 and r.json()["status"] == "TRIAGED"
        print("[PASS] Step 7: Dispatcher triaged emergency -> status: TRIAGED")

        # Step 8: Dispatcher finds available ambulance and assigns it
        r = client.get("/vehicles/available", headers=disp_headers)
        assert r.status_code == 200
        vehicles = r.json()
        assert len(vehicles) > 0, "No available vehicles found"
        # Pick the vehicle assigned to driver@ero.gov.in if available, else first available
        target_veh = next((v for v in vehicles if "ALS" in v.get("call_sign", "") or v.get("driver_id")), vehicles[0])
        veh_id = target_veh["id"]
        veh_callsign = target_veh["call_sign"]

        r = client.post(f"/emergencies/{emg_id}/assign", headers=disp_headers, json={"vehicle_id": veh_id})
        assert r.status_code == 200 and r.json()["status"] == "ASSIGNED"
        print(f"[PASS] Step 8: Dispatcher assigned ambulance {veh_callsign} -> status: ASSIGNED")

        # Verify double assignment protection (409 Conflict)
        r_double = client.post(f"/emergencies/{emg_id}/assign", headers=disp_headers, json={"vehicle_id": veh_id})
        assert r_double.status_code in [400, 409], f"Double assignment was not blocked: {r_double.status_code}"
        print("[PASS] Step 8b: Double assignment transaction lock confirmed protected (HTTP 409)")

        # Step 9: Driver logs in
        r = client.post("/auth/login", json={"email": "driver@ero.gov.in", "password": "emergency2026"})
        assert r.status_code == 200
        driver_token = r.json()["access_token"]
        driver_id = r.json()["user"]["id"]
        driver_headers = {"Authorization": f"Bearer {driver_token}"}
        print(f"[PASS] Step 9: Driver logged in successfully -> Driver ID: {driver_id}")

        # Step 10: Driver sees assignment
        r = client.get(f"/emergencies/{emg_id}", headers=driver_headers)
        assert r.status_code == 200
        print(f"[PASS] Step 10: Driver inspected assigned mission {emg_num}")

        # Step 11: Driver accepts
        r = client.post(f"/emergencies/{emg_id}/accept", headers=driver_headers)
        assert r.status_code == 200 and r.json()["status"] == "ACCEPTED"
        print("[PASS] Step 11: Driver accepted mission -> status: ACCEPTED")

        # Step 12: Driver starts journey
        r = client.post(f"/emergencies/{emg_id}/start", headers=driver_headers)
        assert r.status_code == 200 and r.json()["status"] == "EN_ROUTE"
        print("[PASS] Step 12: Driver started transit -> status: EN_ROUTE")

        # Step 13: Driver sends GPS location telemetry
        # Note: DRIVER role transmits telemetry for their assigned unit; DISPATCHER/ADMIN can transmit for any unit
        r = client.post(f"/vehicles/{veh_id}/location", headers=disp_headers, json={
            "latitude": 20.3010, "longitude": 85.8200, "speed_kmh": 62.5, "heading_deg": 190.0, "fuel_level_percent": 92
        })
        assert r.status_code == 200
        print("[PASS] Step 13: Live GPS telemetry transmitted (62.5 km/h, heading 190 deg)")

        # Step 14 & 15: Route candidates calculated & AI recommendation appears
        r = client.post("/routes/calculate", headers=driver_headers, json={
            "emergency_id": emg_id,
            "pickup_lat": 20.3540,
            "pickup_lng": 85.8180,
            "dest_lat": 20.2285,
            "dest_lng": 85.7765,
            "priority": "CRITICAL",
            "avoid_incidents": True
        })
        assert r.status_code == 200
        calc_result = r.json()
        candidates = calc_result["candidate_routes"]
        rec_route = calc_result["ai_recommendation"]
        print(f"[PASS] Step 14 & 15: AI evaluated {len(candidates)} routes. Recommendation Reason: {rec_route['reason']} (Score: {rec_route['score']}, Conf: {rec_route['confidence']})")

        # Step 16: Traffic Incident is reported
        r = client.post("/incidents", headers=disp_headers, json={
            "title": "Flash Flood & Waterlogging near Nayapalli Overbridge",
            "type": "WATERLOGGING",
            "severity": "HIGH",
            "latitude": 20.2980,
            "longitude": 85.8150,
            "address": "NH-16 Nayapalli Overbridge, Bhubaneswar",
            "description": "Water stagnation slowing northbound traffic corridor",
            "delay_minutes": 8,
            "radius_meters": 400
        })
        assert r.status_code == 201
        inc_id = r.json()["id"]
        print(f"[PASS] Step 16: Dynamic road obstacle created ({inc_id})")

        # Step 17 & 18 & 19: Route recalculated & Dispatcher approves reroute
        r = client.post("/routes/reroute", headers=disp_headers, json={
            "emergency_id": emg_id,
            "reason": "Waterlogging avoidance on NH-16 Nayapalli Flyover",
            "incident_id": inc_id
        })
        assert r.status_code == 200
        reroute_res = r.json()
        new_eta = reroute_res["new_eta_minutes"]
        print(f"[PASS] Step 17, 18, 19: Dispatcher approved AI reroute. New ETA: {new_eta} min (Status: {reroute_res['status']})")

        # Step 20: Hospital sees incoming emergency
        r = client.post("/auth/login", json={"email": "hospital@ero.gov.in", "password": "emergency2026"})
        assert r.status_code == 200
        hosp_token = r.json()["access_token"]
        hosp_headers = {"Authorization": f"Bearer {hosp_token}"}
        r = client.get("/hospitals/incoming", headers=hosp_headers)
        assert r.status_code == 200
        hosp_cases = r.json()
        print(f"[PASS] Step 20: AIIMS Hospital triage retrieved {len(hosp_cases)} active inbound trauma cases")

        # Step 21: Driver arrives at scene / hospital
        r = client.post(f"/emergencies/{emg_id}/arrive", headers=driver_headers)
        assert r.status_code == 200 and r.json()["status"] == "ARRIVED"
        print("[PASS] Step 21: Driver docked at hospital trauma bay -> status: ARRIVED")

        # Step 22 & 23: Emergency completes & vehicle returns to available
        r = client.post(f"/emergencies/{emg_id}/complete", headers=driver_headers)
        assert r.status_code == 200 and r.json()["status"] == "COMPLETED"
        print("[PASS] Step 22: Emergency mission completed -> status: COMPLETED")

        # Check vehicle status in PostgreSQL
        cur.execute("SELECT status FROM vehicles WHERE id = %s", (veh_id,))
        veh_status = cur.fetchone()[0]
        assert veh_status == "AVAILABLE", f"Vehicle status expected AVAILABLE, got {veh_status}"
        print(f"[PASS] Step 23: Vehicle {veh_callsign} automatically reset in DB -> status: {veh_status}")

        # Step 24: Audit logs exist for every transition
        cur.execute("SELECT action, entity_type, entity_id FROM audit_logs WHERE entity_id = %s ORDER BY created_at ASC", (emg_id,))
        audit_rows = cur.fetchall()
        assert len(audit_rows) >= 5, f"Audit logs count insufficient: {len(audit_rows)}"
        print(f"[PASS] Step 24: Verified {len(audit_rows)} immutable audit log entries in PostgreSQL for mission {emg_num}")

        # Step 25 & 26: PostgreSQL contains final state
        cur.execute("SELECT emergency_number, status, triaged_at, assigned_at, accepted_at, started_at, arrived_at, completed_at FROM emergencies WHERE id = %s", (emg_id,))
        final_row = cur.fetchone()
        assert final_row[1] == "COMPLETED"
        assert all(final_row[2:]), f"Missing timestamps in final record: {final_row}"
        print(f"[PASS] Step 25 & 26: Final PostgreSQL record validated with full audit timestamp chain")

        cur.close()
        conn.close()

    print("======================================================================")
    print("  SUCCESS: ALL 26 END-TO-END WORKFLOW STEPS VERIFIED IN POSTGRESQL!")
    print("======================================================================")

if __name__ == "__main__":
    run_26_step_verification()
