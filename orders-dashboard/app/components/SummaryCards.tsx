import { OrderSummary } from "@/types/order";

export function SummaryCards({ summary }: { summary: OrderSummary }) {
  const cards = [
    { label: "Total orders", value: summary.total_orders.toString() },
    { label: "Pending", value: summary.pending_orders.toString() },
    { label: "Completed", value: summary.completed_orders.toString() },
    { label: "Order value", value: `$${Number(summary.total_value).toFixed(2)}` },
  ];

  return (
    <section className="summary-grid" aria-label="Order summary">
      {cards.map((card) => (
        <article className="summary-card" key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}
