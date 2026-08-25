def sample_order(**overrides):
    payload = {
        "customer_name": "Sam Lee",
        "customer_email": "sam@example.com",
        "product_name": "Wireless Mouse",
        "quantity": 2,
        "unit_price": 39.95,
    }
    payload.update(overrides)
    return payload


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_orders(client):
    response = client.get("/orders")
    assert response.status_code == 200
    assert len(response.json()["orders"]) == 3


def test_create_order_preserves_decimal_price(client):
    response = client.post("/orders", json=sample_order(unit_price=19.99))
    assert response.status_code == 201
    assert float(response.json()["unit_price"]) == 19.99


def test_quantity_must_be_positive(client):
    response = client.post("/orders", json=sample_order(quantity=0))
    assert response.status_code == 422


def test_patch_only_changes_supplied_fields(client):
    created = client.post("/orders", json=sample_order()).json()
    response = client.patch(f"/orders/{created['id']}", json={"status": "completed"})
    assert response.status_code == 200
    assert response.json()["customer_name"] == "Sam Lee"


def test_missing_order_is_404(client):
    response = client.get("/orders/99999")
    assert response.status_code == 404
