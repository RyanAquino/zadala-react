import { useState, createContext } from "react";

export const ProductsContext = createContext([] as any);
export const ProductsProvider = (props: any) => {
  const [product, setProducts]: [product: any, setProducts: any] = useState<[]>(
    []
  );

  return (
    <ProductsContext.Provider value={[product, setProducts]}>
      {props.children}
    </ProductsContext.Provider>
  );
};
