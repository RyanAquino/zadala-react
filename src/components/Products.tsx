import axios from "axios";
import Product from "./Product";
import {
  ProductsList,
  Product as ProductType,
  ProductsContextInterface,
} from "../Interfaces/Product.interface";
import { ProductsContext } from "../context/ProductsContext";
import {
  CircularProgress,
  Grid,
  makeStyles,
  Snackbar,
  SnackbarOrigin,
} from "@material-ui/core";
import React, {
  useCallback,
  useRef,
  useContext,
  useState,
  useEffect,
} from "react";
import Alert from "./Alerts";
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
  const { products, setProducts } = useContext<ProductsContextInterface>(
    ProductsContext
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [open, setOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  useEffect(() => setProducts([]), []);

  useEffect(() => {
    setLoading(true);

    const fetchProducts = async () => {
      const { data } = await axios.get<ProductsList>(
        `${process.env.REACT_APP_API_URL}/v1/products/`,
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
        setProducts((prevProducts: ProductType[]): ProductType[] => [
          ...prevProducts,
          ...products,
        ]);
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

  const handleClick = (success: boolean) => {
    setOpen(true);
    setIsSuccess(success);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSuccess(false);
    setOpen(false);
  };

  return (
    <Grid item container className={classes.gridContainer} justify={"center"}>
      <Snackbar
        anchorOrigin={
          {
            vertical: "top",
            horizontal: "center",
          } as SnackbarOrigin
        }
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        {isSuccess ? (
          <Alert severity="success" onClose={handleClose}>
            Added to cart
          </Alert>
        ) : (
          <Alert severity="warning" onClose={handleClose}>
            You have reached the maximum quantity available for this item
          </Alert>
        )}
      </Snackbar>
      {Array.from(products).map((product: ProductType, index: number) => {
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
              <Product product={product} onClick={handleClick} />
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
              <Product product={product} onClick={handleClick} />
            </Grid>
          );
        }
      })}
      {loading && <CircularProgress />}
    </Grid>
  );
};

export default Products;
