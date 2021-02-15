import axios from "axios";
import Product from "./Product";
import {
  ProductsList,
  Product as ProductType,
} from "../Interfaces/Product.interface";
import { ProductsContext } from "../context/ProductsContext";
import { CircularProgress, Grid, makeStyles } from "@material-ui/core";
import React, {
  useCallback,
  useRef,
  useContext,
  useState,
  useEffect,
} from "react";
const useStyles = makeStyles({
  gridContainer: {
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  productContainer: {
    padding: "3px",
  },
});

const Products: React.FC = () => {
  const classes = useStyles();
  const observer = useRef<HTMLElement | IntersectionObserver>();
  const { products, addProducts } = useContext(ProductsContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    setLoading(true);

    const fetchProducts = async () => {
      const { data } = await axios.get<ProductsList>(
        `http://localhost:8000/v1/products`,
        {
          params: { page: pageNumber },
        }
      );
      return data;
    };

    const getProducts = async () => {
      const response: ProductsList = await fetchProducts();
      if (response.next) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      return response.results;
    };

    getProducts()
      .then((products: ProductType[]) => {
        addProducts(products);
        setLoading(false);
      })
      .catch((e) => {
        setHasMore(false);
        setLoading(false);
        e.toString();
        return;
      });
  }, [pageNumber]);

  const lastProductElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current)
        if ("disconnect" in observer.current) {
          observer.current.disconnect();
        }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(pageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, pageNumber]
  );

  return (
    <Grid item container className={classes.gridContainer} justify={"center"}>
      {products.map((product: ProductType, index: number) => {
        if (products.length === index + 1) {
          return (
            <Grid
              item
              key={index}
              ref={lastProductElement}
              xs={6}
              sm={4}
              md={3}
              className={classes.productContainer}
            >
              <Product product={product} />
            </Grid>
          );
        } else {
          return (
            <Grid
              item
              key={index}
              xs={6}
              sm={4}
              md={3}
              className={classes.productContainer}
            >
              <Product product={product} />
            </Grid>
          );
        }
      })}
      {loading && <CircularProgress />}
    </Grid>
  );
};

export default Products;
