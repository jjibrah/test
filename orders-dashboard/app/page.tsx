"use client";

import { useEffect, useState } from "react";
import { CreateOrderForm } from "./components/CreateOrderForm";
import { OrdersTable } from "./components/OrdersTable";
import { SummaryCards } from "./components/SummaryCards";
import { getOrders, getOrderSummary } from "@/lib/api";
import { Order, OrderSummary } from "@/types/order";

const PAGE_SIZE = 5;

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<OrderSummary>({
    total_orders: 0,
    pending_orders: 0,
    completed_orders: 0,
    total_value: "0",
    latest_created_at: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setLoading(true);
    Promise.all([getOrders(page, PAGE_SIZE), getOrderSummary()])
      .then(([{ orders: pageOrders, total: orderCount }, orderSummary]) => {
        setOrders(pageOrders);
        setTotal(orderCount);
        setSummary(orderSummary);
      })
      .catch(() => setError("Could not load orders"))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handleCreated(order: Order) {
    setTotal((current) => current + 1);
    getOrderSummary().then(setSummary).catch(() => setError("Could not refresh summary"));
    if (page === 1) {
      setOrders((current) => [order, ...current].slice(0, PAGE_SIZE));
    } else {
      setPage(1);
    }
  }

  return (
    <div className="dashboard">
      {error && <div className="error-banner">{error}</div>}
      <SummaryCards summary={summary} />
      <div className="content-grid">
        <section className="panel orders-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Overview</span>
              <h2>Recent orders</h2>
            </div>
            <span className="muted">
              Latest: {summary.latest_created_at ? new Date(summary.latest_created_at).toLocaleDateString() : "—"}
            </span>
          </div>
          <OrdersTable orders={orders} />
          <nav className="pagination" aria-label="Orders pagination">
            <button
              type="button"
              onClick={() => setPage((current) => current - 1)}
              disabled={loading || page === 1}
            >
              Previous
            </button>
            <span>{loading ? "Loading…" : `Page ${page} of ${totalPages}`}</span>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={loading || page >= totalPages}
            >
              Next
            </button>
          </nav>
        </section>
        <CreateOrderForm onCreated={handleCreated} />
      </div>
    </div>
  );
}
