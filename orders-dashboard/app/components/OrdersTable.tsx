"use client";

import { useEffect, useState } from "react";
import { deleteOrder, updateOrderStatus } from "@/lib/api";
import { Order, OrderStatus } from "@/types/order";

export function OrdersTable({
  orders,
  onOrderChanged,
}: {
  orders: Order[];
  onOrderChanged: () => Promise<void>;
}) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    if (!selectedOrder) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedOrder(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedOrder]);

  async function changeStatus(status: OrderStatus) {
    if (!selectedOrder) return;
    setSaving(true);
    setModalError("");
    try {
      const updated = await updateOrderStatus(selectedOrder.id, status);
      setSelectedOrder(updated);
      await onOrderChanged();
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Could not update order");
    } finally {
      setSaving(false);
    }
  }

  async function removeOrder() {
    if (!selectedOrder || !window.confirm(`Delete order #${selectedOrder.id}?`)) return;
    setSaving(true);
    setModalError("");
    try {
      await deleteOrder(selectedOrder.id);
      setSelectedOrder(null);
      await onOrderChanged();
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Could not delete order");
      setSaving(false);
    }
  }

  if (orders.length === 0) {
    return <p className="empty-state">No orders have been created.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <strong>{order.customer_name}</strong>
                <small>{order.customer_email}</small>
              </td>
              <td>{order.product_name}</td>
              <td>{order.quantity}</td>
              <td>${(Number(order.unit_price) * order.quantity).toFixed(2)}</td>
              <td><span className={`status status-${order.status}`}>{order.status}</span></td>
              <td>
                <button
                  type="button"
                  className="view-button"
                  onClick={() => {
                    setModalError("");
                    setSelectedOrder(order);
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedOrder(null);
          }}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">Order #{selectedOrder.id}</span>
                <h2 id="order-modal-title">{selectedOrder.product_name}</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="Close order details"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>
            <dl className="order-details">
              <div><dt>Customer</dt><dd>{selectedOrder.customer_name}</dd></div>
              <div><dt>Email</dt><dd>{selectedOrder.customer_email}</dd></div>
              <div><dt>Quantity</dt><dd>{selectedOrder.quantity}</dd></div>
              <div><dt>Unit price</dt><dd>${Number(selectedOrder.unit_price).toFixed(2)}</dd></div>
              <div><dt>Total</dt><dd>${(Number(selectedOrder.unit_price) * selectedOrder.quantity).toFixed(2)}</dd></div>
              <div>
                <dt>Status</dt>
                <dd>
                  <select
                    aria-label="Order status"
                    value={selectedOrder.status}
                    disabled={saving}
                    onChange={(event) => changeStatus(event.target.value as OrderStatus)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </dd>
              </div>
              <div><dt>Created</dt><dd>{new Date(selectedOrder.created_at).toLocaleString()}</dd></div>
            </dl>
            {modalError && <p className="form-error">{modalError}</p>}
            <div className="modal-actions">
              <button
                type="button"
                className="danger-button"
                disabled={saving}
                onClick={removeOrder}
              >
                {saving ? "Working…" : "Delete order"}
              </button>
              <button type="button" disabled={saving} onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
