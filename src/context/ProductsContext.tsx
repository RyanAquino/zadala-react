import React, { useState, createContext } from "react";
import {
  Product,
  ProductsContextInterface,
} from "../Interfaces/Product.interface";

const contextDefaultValues: ProductsContextInterface = {
  products: [],
  setProducts: () => {
    return;
  },
};

export const ProductsContext = createContext<ProductsContextInterface>(
  contextDefaultValues
);
export const ProductsProvider: React.FC = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
