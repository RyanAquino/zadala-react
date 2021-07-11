import axios from "axios";
import { Order } from "../Interfaces/Orders.interface";
import default_image from "../static/default.jpg";
import { Product } from "../Interfaces/Product.interface";

export const updateCart = (
  productId: number,
  action: string
): Promise<Order> => {
  return axios
    .post(
      `${process.env.REACT_APP_API_URL}/v1/orders/update-cart/`,
      {
        productId: productId,
        action: action,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
        },
      }
    )
    .then(({ data }) => data)
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        alert(error.response.data.detail);
      }
    });
};

export const getOrders = (): Promise<Order> => {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/v1/orders/`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
      },
    })
    .then(({ data }) => data);
};

export const determineImage = (product: Product): string => {
  product.image = product.image_url ? product.image_url : default_image;
  return product.image;
};
