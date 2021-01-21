import Product from "./Product";
import { CircularProgress, Grid, makeStyles } from "@material-ui/core";
import React, {
  useCallback,
  useRef,
  useContext,
  useState,
  useEffect,
} from "react";
import { ProductsContext } from "../context/ProductsContext";
import axios from "axios";

const useStyles = makeStyles({
  root: {},
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
  const observer: any = useRef();
  const [products, setProducts] = useContext(ProductsContext);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      let response = await axios.get("https://openlibrary.org/search.json", {
        params: {
          q: "Hello",
          page: pageNumber,
        },
      });
      return response.data;
    };
    const getProducts = async () => {
      return await fetchProducts();
    };
    getProducts().then((products) => {
      setProducts((prevProducts: any) => {
        return Array.from(new Set([...prevProducts, ...products.docs]));
      });
      setHasMore(products.docs.length > 0);
      setLoading(false);
    });
  }, [pageNumber, setProducts]);

  const lastProductElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((pageNumber: any) => pageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <Grid item container className={classes.gridContainer} justify={"center"}>
      {products.map((product: any, index: number) => {
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
