import { useState, createContext } from "react";
import { Product } from "../Interfaces/Product.interface";

export const ProductsContext = createContext([] as any);
export const ProductsProvider = (props: any) => {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <ProductsContext.Provider value={[products, setProducts]}>
      {props.children}
    </ProductsContext.Provider>
  );
};
