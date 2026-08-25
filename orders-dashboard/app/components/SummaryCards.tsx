import { Order } from "@/types/order";

export function SummaryCards({ orders }: { orders: Order[] }) {
  const pending = orders.filter((order) => order.status === "pending").length;
  const completed = orders.filter((order) => order.status === "completed").length;
  const totalValue = orders.reduce((total, order) => total + Number(order.unit_price), 0);

  const cards = [
    { label: "Total orders", value: orders.length.toString() },
    { label: "Pending", value: pending.toString() },
    { label: "Completed", value: completed.toString() },
    { label: "Order value", value: `$${totalValue.toFixed(2)}` },
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
