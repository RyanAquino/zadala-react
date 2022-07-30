import axios from "axios";
import jwt_decode from "jwt-decode";
import { Order, OrderHistory } from "../Interfaces/Orders.interface";
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
import {
  Authentication,
  Registration,
  TokenDetails,
  User,
} from "../Interfaces/User.interface";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const updateCart = (
  productId: number,
  action: string
): Promise<Order> => {
  return axios
    .post(
      `${API_URL}/v1/orders/update-cart/`,
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
    .get(`${API_URL}/v1/orders/`, {
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
    .get(`${API_URL}/v1/auth/profile/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(({ data }) => data);
};

export const logout = (): void => {
  axios
    .get(`${API_URL}/v1/auth/logout`, {
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
    .patch(`${API_URL}/v1/auth/profile/`, data, {
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
    .post(`${API_URL}/v1/orders/process-order/`, data, {
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
    .get<ProductsList>(`${API_URL}/v1/products/`, {
      params: { page: page, search: search },
      cancelToken: cancelToken,
    })
    .then(({ data }) => data);
};

export const authenticate = (auth: Authentication): Promise<User> => {
  return axios.post(`${API_URL}/v1/auth/login/`, auth).then(({ data }) => data);
};

export const retrieveProduct = async (id: string): Promise<Product> => {
  return axios
    .get<Product>(`${API_URL}/v1/products/${id}/`)
    .then(({ data }) => data);
};

export const register = (userInfo: Registration): Promise<JSON> => {
  return axios
    .post(`${API_URL}/v1/auth/customer/register/`, userInfo)
    .then(({ data }) => data);
};

export const validateToken = (): boolean => {
  const token = localStorage.getItem("token") || "";
  const today = new Date();
  const now = today.getTime();
  let decoded = {} as TokenDetails;

  try {
    decoded = jwt_decode(token);
    const decodedMs = decoded.exp * 1000;
    if (now >= decodedMs) return false;
  } catch (e) {
    return false;
  }
  return true;
};

export const socialLoginGoogle = (authToken: string): Promise<User> => {
  return axios
    .post(`${API_URL}/v1/social-auth/google/`, { auth_token: authToken })
    .then(({ data }) => data);
};

export const fetchOrderHistory = async (
  page = 1,
  pageSize = 5
): Promise<OrderHistory> => {
  return axios
    .get<OrderHistory>(`${API_URL}/v1/orders/history/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        page_size: pageSize,
        page: page,
      },
    })
    .then(({ data }) => data);
};
