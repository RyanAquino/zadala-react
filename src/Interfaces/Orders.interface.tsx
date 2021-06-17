import { Product } from "./Product.interface";
import React from "react";

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
