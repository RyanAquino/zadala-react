import { Dispatch, useContext, useEffect, useState } from "react";
import {
  Product,
  ProductsContextInterface,
} from "../Interfaces/Product.interface";
import { fetchProducts } from "../api/utils";
import { ProductsContext } from "../context/ProductsContext";
import axios, { CancelTokenSource } from "axios";

let cancelToken: CancelTokenSource;

const useProductSearch = (): {
  setQuery: Dispatch<string>;
  loading: boolean;
  hasMore: boolean;
  pageNumber: number;
  setPageNumber: Dispatch<number>;
} => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { setProducts } = useContext<ProductsContextInterface>(ProductsContext);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    setProducts([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);

    if (cancelToken != undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }

    cancelToken = axios.CancelToken.source();

    const getProducts = async () => {
      return await fetchProducts({
        page: pageNumber,
        search: query,
        cancelToken: cancelToken.token,
      });
    };
    getProducts()
      .then((data) => {
        setProducts((prevProducts: Product[]): Product[] => [
          ...prevProducts,
          ...data.results,
        ]);
        if (data.next) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setHasMore(false);
        setLoading(false);
        e.toString();
        return;
      });
  }, [query, pageNumber]);

  return { setQuery, loading, hasMore, pageNumber, setPageNumber };
};

export default useProductSearch;
