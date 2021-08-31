import axios from "axios";
import { Order } from "../Interfaces/Orders.interface";
import default_image from "../static/default.jpg";
import {
  Product,
  ProductParams,
  ProductsList,
} from "../Interfaces/Product.interface";
import {
  ProfileDetailsInterface,
  ProfileInterface,
} from "../Interfaces/Profile.interface";
import { ShippingAddress } from "../Interfaces/Shipping.interface";
import { Authentication, User } from "../Interfaces/User.interface";

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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(({ data }) => data);
};

export const determineImage = (product: Product): string => {
  product.image = product.image_url ? product.image_url : default_image;
  return product.image;
};

export const getProfileDetails = (): Promise<ProfileInterface> => {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/v1/auth/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(({ data }) => data);
};

export const logout = (): void => {
  axios
    .get(`${process.env.REACT_APP_API_URL}/v1/auth/logout`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then();
};

export const updateProfileDetails = (
  data: ProfileDetailsInterface
): Promise<ProfileInterface> => {
  return axios
    .patch(`${process.env.REACT_APP_API_URL}/v1/auth/profile/`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then();
};

export const processOrder = (
  data: ShippingAddress
): Promise<ShippingAddress> => {
  return axios
    .post(`${process.env.REACT_APP_API_URL}/v1/orders/process-order/`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then();
};

export const fetchProducts = async (
  params: ProductParams
): Promise<ProductsList> => {
  const page = params.page || 1;
  const search = params.search || "";
  const cancelToken = params.cancelToken;

  return axios
    .get<ProductsList>(`${process.env.REACT_APP_API_URL}/v1/products/`, {
      params: { page: page, search: search },
      cancelToken: cancelToken,
    })
    .then(({ data }) => data);
};

export const authenticate = (auth: Authentication): Promise<User> => {
  return axios
    .post(`${process.env.REACT_APP_API_URL}/v1/auth/login/`, auth)
    .then(({ data }) => data)
    .catch((e) => e);
};

export const retrieveProduct = async (id: string): Promise<Product> => {
  return axios
    .get<Product>(`${process.env.REACT_APP_API_URL}/v1/products/${id}/`)
    .then(({ data }) => data);
};
