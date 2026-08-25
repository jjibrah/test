"use client";

import { useEffect, useState } from "react";
import { CreateOrderForm } from "./components/CreateOrderForm";
import { OrdersTable } from "./components/OrdersTable";
import { SummaryCards } from "./components/SummaryCards";
import { getOrders } from "@/lib/api";
import { Order } from "@/types/order";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setError("Could not load orders"));
  }, []);

  return (
    <div className="dashboard">
      {error && <div className="error-banner">{error}</div>}
      <SummaryCards orders={orders} />
      <div className="content-grid">
        <section className="panel orders-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Overview</span>
              <h2>Recent orders</h2>
            </div>
            <span className="muted">
              Latest: {orders.length ? new Date(orders[0].created_at).toLocaleDateString() : "—"}
            </span>
          </div>
          <OrdersTable orders={orders} />
        </section>
        <CreateOrderForm onCreated={(order) => setOrders([...orders, order])} />
      </div>
    </div>
  );
}
