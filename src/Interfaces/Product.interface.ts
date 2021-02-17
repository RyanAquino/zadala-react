import React from "react";

export interface Product {
  id: number;
  name: string;
  description: string;
  digital: boolean | null;
  price: number;
  image: string | undefined;
  image_url: string;
  quantity: number;
  created_at: string;
  supplier: number | null;
}

export interface ProductsList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface ProductsContextInterface {
  products: Product[] | [];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export interface ProductDetailsPropTypes {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: {
    product: Product;
  };
}
