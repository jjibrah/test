"use client";

import { FormEvent, useState } from "react";
import { createOrder } from "@/lib/api";
import { Order } from "@/types/order";

export function CreateOrderForm({ onCreated }: { onCreated: (order: Order) => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const order = await createOrder({
      customerName: String(form.get("customer_name")),
      customer_email: String(form.get("customer_email")),
      product_name: String(form.get("product_name")),
      quantity: parseInt(String(form.get("quantity"))),
      unit_price: String(form.get("unit_price")),
    });
    setMessage("Order created");
    setSubmitting(false);
    onCreated(order);
    event.currentTarget.reset();
  }

  return (
    <section className="panel form-panel">
      <span className="eyebrow">New request</span>
      <h2>Create order</h2>
      <form onSubmit={handleSubmit}>
        <label>Customer name<input name="customer_name" required /></label>
        <label>Email<input name="customer_email" type="email" required /></label>
        <label>Product<input name="product_name" required /></label>
        <div className="field-row">
          <label>Quantity<input name="quantity" type="number" defaultValue="1" /></label>
          <label>Unit price<input name="unit_price" type="number" step="0.01" /></label>
        </div>
        <button disabled={submitting}>{submitting ? "Saving..." : "Create order"}</button>
        {message && <p className="success-message">{message}</p>}
      </form>
    </section>
  );
}
