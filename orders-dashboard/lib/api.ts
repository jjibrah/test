import {
  CreateOrderInput,
  Order,
  OrderListResponse,
  OrderStatus,
  OrderSummary,
} from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiError(response: Response, fallback: string): Promise<Error> {
  try {
    const body = await response.json();
    if (typeof body.detail === "string") return new Error(body.detail);
    if (Array.isArray(body.detail)) {
      const details = body.detail
        .map((item: { loc?: Array<string | number>; msg?: string }) => {
          const field = item.loc?.at(-1);
          return field && item.msg ? `${field}: ${item.msg}` : item.msg;
        })
        .filter(Boolean)
        .join("; ");
      if (details) return new Error(details);
    }
  } catch {
    // Use the fallback when the API does not return a JSON error body.
  }
  return new Error(`${fallback} (${response.status})`);
}

export async function getOrders(
  page = 1,
  pageSize = 5,
): Promise<OrderListResponse> {
  const skip = (page - 1) * pageSize;
  const response = await fetch(
    `${API_URL}/orders?skip=${skip}&limit=${pageSize}`,
    { cache: "no-store" },
  );
  if (!response.ok) throw await apiError(response, "Could not load orders");
  return response.json();
}

export async function getOrder(id: number): Promise<Order> {
  if (!Number.isInteger(id)) throw new Error("Invalid order ID");
  const response = await fetch(`${API_URL}/orders/${id}`, { cache: "no-store" });
  if (!response.ok) throw await apiError(response, "Could not load order");
  return response.json();
}

export async function getOrderSummary(): Promise<OrderSummary> {
  const response = await fetch(`${API_URL}/orders/summary`, { cache: "no-store" });
  if (!response.ok) throw await apiError(response, "Could not load order summary");
  return response.json();
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw await apiError(response, "Could not create order");
  return response.json();
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw await apiError(response, "Could not update order");
  return response.json();
}

export async function deleteOrder(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/orders/${id}`, { method: "DELETE" });
  if (!response.ok) throw await apiError(response, "Could not delete order");
}
