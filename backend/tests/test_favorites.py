"""
Integration tests for Favorites CRUD operations.
"""


def test_favorites_lifecycle(client):
    """Test full CRUD lifecycle: empty check -> create -> duplicate prevention -> list -> delete -> verify delete."""
    # 1. Initial list should be empty
    get_res = client.get("/api/favorites")
    assert get_res.status_code == 200
    assert get_res.get_json() == []

    # 2. Add new favorite city
    payload = {
        "city_name": "Tokyo",
        "country": "JP",
        "latitude": 35.6762,
        "longitude": 139.6503,
    }
    post_res = client.post("/api/favorites", json=payload)
    assert post_res.status_code == 201
    post_data = post_res.get_json()
    assert "favorite" in post_data
    fav_id = post_data["favorite"]["id"]
    assert post_data["favorite"]["city_name"] == "Tokyo"
    assert post_data["favorite"]["country"] == "JP"

    # 3. Duplicate insertion should return 409 Conflict
    dup_res = client.post("/api/favorites", json={"city_name": "tokyo"})
    assert dup_res.status_code == 409

    # 4. List favorites should now contain the added city
    list_res = client.get("/api/favorites")
    assert list_res.status_code == 200
    favorites = list_res.get_json()
    assert len(favorites) == 1
    assert favorites[0]["id"] == fav_id

    # 5. Delete favorite by ID
    del_res = client.delete(f"/api/favorites/{fav_id}")
    assert del_res.status_code == 200

    # 6. Verify favorite is removed
    empty_res = client.get("/api/favorites")
    assert empty_res.status_code == 200
    assert len(empty_res.get_json()) == 0

    # 7. Deleting a non-existent ID should return 404
    missing_del = client.delete(f"/api/favorites/{fav_id}")
    assert missing_del.status_code == 404


def test_add_favorite_missing_name_returns_400(client):
    """Verify adding favorite with missing city_name returns 400 Bad Request."""
    response = client.post("/api/favorites", json={})
    assert response.status_code == 400
