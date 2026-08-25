"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/order";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!selectedOrder) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedOrder(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedOrder]);

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
                  onClick={() => setSelectedOrder(order)}
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
                <dd><span className={`status status-${selectedOrder.status}`}>{selectedOrder.status}</span></dd>
              </div>
              <div><dt>Created</dt><dd>{new Date(selectedOrder.created_at).toLocaleString()}</dd></div>
            </dl>
          </section>
        </div>
      )}
    </div>
  );
}
