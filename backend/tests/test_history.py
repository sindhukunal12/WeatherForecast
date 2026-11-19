"""
Integration tests for Search History tracking and retrieval.
"""


def test_search_history_lifecycle(client):
    """Verify that querying weather automatically logs search history and supports clear."""
    # 1. Querying weather for London and Berlin
    client.get("/api/weather/London")
    client.get("/api/weather/Berlin")

    # 2. Retrieve history
    history_res = client.get("/api/history")
    assert history_res.status_code == 200
    history = history_res.get_json()
    assert len(history) >= 2
    city_names = [item["city_name"] for item in history]
    assert "Berlin" in city_names
    assert "London" in city_names

    # 3. Explicitly logging a search via POST
    post_res = client.post("/api/history", json={"city_name": "Sydney"})
    assert post_res.status_code == 201

    # 4. Clear history via DELETE
    del_res = client.delete("/api/history")
    assert del_res.status_code == 200

    # 5. Verify history is cleared
    check_res = client.get("/api/history")
    assert check_res.status_code == 200
    assert len(check_res.get_json()) == 0
