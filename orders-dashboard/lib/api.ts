import {
  CreateOrderInput,
  Order,
  OrderListResponse,
  OrderStatus,
  OrderSummary,
} from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getOrders(
  page = 1,
  pageSize = 5,
): Promise<OrderListResponse> {
  const skip = (page - 1) * pageSize;
  const response = await fetch(
    `${API_URL}/orders?skip=${skip}&limit=${pageSize}`,
    { cache: "no-store" },
  );
  if (!response.ok) throw new Error(`Could not load orders (${response.status})`);
  return response.json();
}

export async function getOrder(id: number): Promise<Order> {
  if (!Number.isInteger(id)) throw new Error("Invalid order ID");
  const response = await fetch(`${API_URL}/orders/${id}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load order (${response.status})`);
  return response.json();
}

export async function getOrderSummary(): Promise<OrderSummary> {
  const response = await fetch(`${API_URL}/orders/summary`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load order summary (${response.status})`);
  return response.json();
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(`Could not create order (${response.status})`);
  return response.json();
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error(`Could not update order (${response.status})`);
  return response.json();
}
