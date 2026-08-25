import { CreateOrderInput, Order, OrderStatus } from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders`, { cache: "no-store" });
  const data = await response.json();
  return data.orders;
}

export async function getOrder(id: number): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}`, { cache: "no-store" });
  return response.json();
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.json();
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return response.json();
}
