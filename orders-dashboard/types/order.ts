export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface Order {
  id: number;
  customerName: string;
  customer_email: string;
  product_name: string;
  quantity: number;
  unit_price: string;
  status: OrderStatus;
  created_at: string;
}

export interface CreateOrderInput {
  customerName: string;
  customer_email: string;
  product_name: string;
  quantity: number;
  unit_price: string;
}
