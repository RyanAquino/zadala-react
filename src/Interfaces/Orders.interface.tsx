import { Product } from "./Product.interface";
import React from "react";
import { ShippingAddress } from "./Shipping.interface";

export interface OrderItem {
  product: Product;
  order: number;
  quantity: number;
  date_added: string;
  total: number;
}

export interface Order {
  total_items: number;
  total_amount: number;
  products: OrderItem[];
}

export interface OrdersContextInterface {
  orderData: Order;
  setOrderData: React.Dispatch<React.SetStateAction<Order>>;
}

export interface OrderedItems {
  date_ordered: string;
  transaction_id: string;
  order_items: OrderItem[];
}

export interface OrderHistory {
  count: number;
  next: string;
  previous: string;
  results: OrderHistoryResults;
}

export interface OrderHistoryResults extends ShippingAddress {
  order: OrderedItems;
  date_added: string;
}
