import React, { useState, createContext } from "react";
import { Order, OrdersContextInterface } from "../Interfaces/Orders.interface";

const contextDefaultValues: OrdersContextInterface = {
  orderData: {} as Order,
  setOrderData: () => {
    return;
  },
};

export const OrdersContext = createContext<OrdersContextInterface>(
  contextDefaultValues
);
export const OrdersProvider: React.FC = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [orderData, setOrderData] = useState<Order>({} as Order);

  return (
    <OrdersContext.Provider value={{ orderData, setOrderData }}>
      {children}
    </OrdersContext.Provider>
  );
};
