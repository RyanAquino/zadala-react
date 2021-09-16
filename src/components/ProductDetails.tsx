import React, { useContext, useEffect, useState } from "react";
import {
  Product,
  ProductDetailsPropTypes,
} from "../Interfaces/Product.interface";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
  Snackbar,
  SnackbarOrigin,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  determineImage,
  retrieveProduct,
  updateCart,
  validateToken,
} from "../api/utils";
import Alert from "./Alerts";
import { OrdersContext } from "../context/OrdersContext";
import {
  OrderItem,
  OrdersContextInterface,
} from "../Interfaces/Orders.interface";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: "5px",
    },
    productComponent: {
      padding: "5px",
    },
    productImage: {
      height: "100%",
      width: "100%",
      paddingTop: "5px",
    },
    cardContent: {
      padding: "10px",
    },
    alert: {
      marginBottom: "10px",
    },
  })
);

const ProductDetails: ({
  location,
}: {
  location: ProductDetailsPropTypes;
}) => JSX.Element = ({ location }: { location: ProductDetailsPropTypes }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { orderData, setOrderData } = useContext<OrdersContextInterface>(
    OrdersContext
  );
  const [product, setProduct] = useState({} as Product);
  const history = useHistory();
  const { id } = useParams<{ id?: string | undefined }>();

  useEffect(() => {
    const fetchProduct = async () => {
      if (location.state === undefined && id) {
        setProduct(await retrieveProduct(id).then((data) => data));
      } else {
        setProduct(location.state.product);
      }
    };
    fetchProduct().then();
  }, []);

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

  const processAddToCart = async (): Promise<void> => {
    const orderItems: OrderItem[] = orderData.products;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [orderItem, ...rest] = orderItems.filter(
      (item: OrderItem) => item.product.id === product.id
    );
    if (!orderItem || orderItem.quantity + 1 <= orderItem.product.quantity) {
      handleClick(true);
      const response = await updateCart(product.id, "add");
      setOrderData(response);
    } else {
      handleClick(false);
    }
  };

  return (
    <Container maxWidth={"lg"}>
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
      <Grid item container justify={"center"} spacing={1}>
        <Grid item sm={4} md={3}>
          <Paper elevation={3} variant={"outlined"}>
            <img
              src={determineImage(product)}
              alt="Product image"
              className={classes.productImage}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {product.name}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                ₱{product.price}
              </Typography>
              <Typography variant="subtitle1" component="h6" gutterBottom>
                {product.quantity} piece available
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {product.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  if (!validateToken()) history.push("/login");
                  else processAddToCart().then();
                }}
              >
                Add to cart
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
