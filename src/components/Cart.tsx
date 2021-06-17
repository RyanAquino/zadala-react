import React, { useContext, useEffect } from "react";
import { OrdersContext } from "../context/OrdersContext";
import { Grid } from "@material-ui/core";
import {
  OrderItem,
  OrdersContextInterface,
} from "../Interfaces/Orders.interface";
import { getOrders } from "../api/utils";

const Cart: React.FC = () => {
  const { orderData, setOrderData } = useContext<OrdersContextInterface>(
    OrdersContext
  );
  useEffect(() => {
    console.log("use effect cart page");
    const fetchOrders = async () => await getOrders();
    fetchOrders().then((orderData) => {
      setOrderData(orderData);
    });
  }, []);
  const products: OrderItem[] = orderData.products;
  return (
    <Grid item container justify={"center"}>
      {products
        ? products.map((product: OrderItem, index: number) => {
            return (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <p>{product.product.name}</p>
                <p>{product.product.price}</p>
                <p>{product.quantity}</p>
              </Grid>
            );
          })
        : null}
    </Grid>
  );
};

export default Cart;
