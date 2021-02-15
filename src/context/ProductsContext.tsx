import React, { useState, createContext } from "react";
import {
  Product,
  ProductsContextInterface,
} from "../Interfaces/Product.interface";

const contextDefaultValues: ProductsContextInterface = {
  products: [],
  addProducts: () => {
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
  const addProducts = (newProducts: Product[]) =>
    setProducts((products): Product[] =>
      Array.from(new Set([...products, ...newProducts]))
    );

  return (
    <ProductsContext.Provider value={{ products, addProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
