export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  product_name: string;
  quantity: number;
  unit_price: string;
  status: OrderStatus;
  created_at: string;
}

export interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  product_name: string;
  quantity: number;
  unit_price: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
}

export interface OrderSummary {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_value: string;
}
