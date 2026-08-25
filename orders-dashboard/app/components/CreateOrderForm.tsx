"use client";

import { FormEvent, useState } from "react";
import { createOrder } from "@/lib/api";
import { Order } from "@/types/order";

export function CreateOrderForm({ onCreated }: { onCreated: (order: Order) => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const order = await createOrder({
        customer_name: String(form.get("customer_name")),
        customer_email: String(form.get("customer_email")),
        product_name: String(form.get("product_name")),
        quantity: Number(form.get("quantity")),
        unit_price: String(form.get("unit_price")),
      });
      setMessage("Order created");
      onCreated(order);
      formElement.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create order");
    } finally {
      setSubmitting(false);
    }
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
          <label>Quantity<input name="quantity" type="number" min="1" defaultValue="1" required /></label>
          <label>Unit price<input name="unit_price" type="number" min="0.01" step="0.01" required /></label>
        </div>
        <button disabled={submitting}>{submitting ? "Saving..." : "Create order"}</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="form-error">{error}</p>}
      </form>
    </section>
  );
}
