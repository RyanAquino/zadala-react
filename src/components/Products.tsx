import Product from "./Product";
import {
  Product as ProductType,
  ProductsContextInterface,
} from "../Interfaces/Product.interface";
import { ProductsContext } from "../context/ProductsContext";
import {
  CircularProgress,
  Grid,
  Snackbar,
  SnackbarOrigin,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { useCallback, useRef, useContext, Dispatch } from "react";
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

const Products = ({
  loading,
  hasMore,
  pageNumber,
  setPageNumber,
}: {
  loading: boolean;
  hasMore: boolean;
  pageNumber: number;
  setPageNumber: Dispatch<number>;
}): JSX.Element => {
  const classes = useStyles();
  const { products } = useContext<ProductsContextInterface>(ProductsContext);
  const [open, setOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const observer = useRef<HTMLElement | IntersectionObserver>();

  const handleClick = (success: boolean) => {
    setOpen(true);
    setIsSuccess(success);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      setOpen(false);
      return;
    }
    setIsSuccess(false);
    setOpen(false);
  };

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
    <Grid
      item
      container
      className={classes.gridContainer}
      justifyContent={"center"}
    >
      {isSuccess && (
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
          <Alert severity="success" onClose={handleClose}>
            Added to cart
          </Alert>
        </Snackbar>
      )}
      {!isSuccess && (
        <Snackbar
          open={open}
          anchorOrigin={
            {
              vertical: "top",
              horizontal: "center",
            } as SnackbarOrigin
          }
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert severity="warning" onClose={handleClose}>
            You have reached the maximum quantity available for this item
          </Alert>
        </Snackbar>
      )}
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
