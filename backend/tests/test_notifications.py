from tests.conftest import get_token_headers


def test_user_notifications_and_read_state(client, seed_test_data):
    dispatcher = seed_test_data["dispatcher"]
    headers = get_token_headers(dispatcher)

    # 1. Fetch user notifications
    res = client.get("/api/v1/notifications", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "total" in data

    # 2. Mark all notifications as read
    read_all_res = client.post("/api/v1/notifications/read-all", headers=headers)
    assert read_all_res.status_code == 200
    assert "updated_count" in read_all_res.json()
