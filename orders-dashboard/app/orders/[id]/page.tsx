"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getOrder, updateOrderStatus } from "@/lib/api";
import { Order, OrderStatus } from "@/types/order";

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    getOrder(Number(id))
      .then(setOrder)
      .catch(() => setError("Could not load this order"));
  }, [id]);

  async function changeStatus(status: OrderStatus) {
    const updated = await updateOrderStatus(Number(id), status);
    setOrder(updated);
  }

  if (error) {
    return <div className="detail-shell error-banner">{error}</div>;
  }

  if (!order) return <div className="detail-shell">Loading order...</div>;

  return (
    <div className="detail-shell">
      <Link href="/">← All orders</Link>
      <section className="panel detail-card">
        <span className="eyebrow">Order #{order.id}</span>
        <h2>{order.product_name}</h2>
        <dl>
          <div><dt>Customer</dt><dd>{order.customer_name}</dd></div>
          <div><dt>Email</dt><dd>{order.customer_email}</dd></div>
          <div><dt>Quantity</dt><dd>{order.quantity}</dd></div>
          <div><dt>Unit price</dt><dd>${Number(order.unit_price).toFixed(2)}</dd></div>
        </dl>
        <label>
          Status
          <select value={order.status} onChange={(e) => changeStatus(e.target.value as OrderStatus)}>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </section>
    </div>
  );
}
