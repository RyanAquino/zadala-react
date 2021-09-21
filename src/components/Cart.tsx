import React, { useContext, useEffect, useState } from "react";
import { OrdersContext } from "../context/OrdersContext";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  CardMedia,
  SnackbarOrigin,
  Snackbar,
  Box,
  Tooltip,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import {
  OrderItem,
  OrdersContextInterface,
} from "../Interfaces/Orders.interface";
import IconButton from "@mui/material/IconButton";
import {
  determineImage,
  getOrders,
  updateCart,
  validateToken,
} from "../api/utils";
import Checkout from "../components/Checkout";
import Alert from "./Alerts";
import { useHistory } from "react-router";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  summaryRoot: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  orderItemContainer: {
    padding: "3px",
  },
  orderItemsGrid: {
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  summaryGrid: {
    paddingBottom: "10px",
  },
  portCardClParent: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    width: "100%",
  },
  portCardCl: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flexBasis: "100%",
    flex: 1,
  },
  portBodyCl: {
    display: "flex",
    flex: "1 0 auto",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
  },
  portButCl: {
    display: "flex",
    justifyContent: "flex-start",
  },
});

const Cart: React.FC = () => {
  const { orderData, setOrderData } = useContext<OrdersContextInterface>(
    OrdersContext
  );
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [getTotalItems, setTotalItems] = React.useState(orderData.total_items);
  const products: OrderItem[] = orderData.products;
  const totalAmount: number = orderData.total_amount;
  const history = useHistory();

  useEffect(() => {
    if (!validateToken()) history.push("/login");
    if (Object.entries(orderData).length === 0) {
      const fetchOrders = async () => await getOrders();
      fetchOrders().then((orderData) => {
        setOrderData(orderData);
        setTotalItems(orderData.total_items);
      });
    }
  }, []);

  const processMaxQuantity = (product: OrderItem, action: string) => {
    product.product.isMax = action == "add";
    return {
      total_items: orderData.total_items,
      total_amount: orderData.total_amount,
      products: [...products],
    };
  };

  const processAddToCart = async (product: OrderItem): Promise<void> => {
    const productCopy = { ...product };
    const action = "add";
    if (productCopy.quantity + 1 <= product.product.quantity) {
      const response = await updateCart(product.product.id, action);
      setOrderData(response);
    } else {
      setOrderData(() => processMaxQuantity(product, action));
    }
  };

  const processRemoveToCart = async (product: OrderItem): Promise<void> => {
    const action = "remove";
    const response = await updateCart(product.product.id, action);
    if (response.total_items === 0) {
      setTotalItems(response.total_items);
    }
    setOrderData(response);
  };

  return (
    <Grid
      item
      container
      justifyContent={"center"}
      className={classes.orderItemsGrid}
      xs={12}
      md={10}
    >
      <Snackbar
        anchorOrigin={
          {
            vertical: "top",
            horizontal: "center",
          } as SnackbarOrigin
        }
        open={success}
        onClose={() => setSuccess(false)}
        autoHideDuration={5000}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Order Success
        </Alert>
      </Snackbar>
      <Grid
        item
        container
        xs={12}
        sm={10}
        md={8}
        className={classes.summaryGrid}
      >
        <Card className={classes.summaryRoot}>
          <CardContent>
            <Typography color="textPrimary">
              Total Amount: {totalAmount ? `₱${totalAmount}` : `₱0`}
            </Typography>
          </CardContent>
          <CardActions>
            <Checkout
              setSuccessState={(state: boolean) => {
                setSuccess(state);
              }}
              getTotalItems={getTotalItems}
              setTotalItems={setTotalItems}
            />
          </CardActions>
        </Card>
      </Grid>
      <Grid item container justifyContent={"center"}>
        {totalAmount ? (
          products.map((product: OrderItem, index: number) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                lg={4}
                key={index}
                className={classes.orderItemContainer}
              >
                <Card className={classes.portCardClParent}>
                  <Box className={classes.portCardCl}>
                    <CardContent className={classes.portBodyCl}>
                      <Typography variant="subtitle1" component="h6">
                        {product.product.name}
                      </Typography>
                      <Typography color="textSecondary">
                        Price: ₱{product.product.price}
                      </Typography>
                      <Typography color="textSecondary">
                        Quantity: {product.quantity}
                      </Typography>
                      <Typography color="error" paragraph={true}>
                        {product.product.isMax
                          ? "You have reached the maximum quantity available for this item"
                          : null}
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.portButCl}>
                      <Tooltip title={"Add to cart"} arrow>
                        <IconButton
                          aria-label="add"
                          color="primary"
                          onClick={() => processAddToCart(product)}
                          size="large"
                        >
                          <AddShoppingCartIcon fontSize={"large"} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={"Remove from cart"} arrow>
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => processRemoveToCart(product)}
                          size="large"
                        >
                          <RemoveShoppingCartIcon fontSize={"large"} />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Box>
                  <Box className={classes.portCardCl}>
                    <CardMedia
                      className={classes.cover}
                      component="img"
                      height={"140"}
                      image={determineImage(product.product)}
                      title="Product image"
                    />
                  </Box>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography variant="h6" gutterBottom>
            No items to show
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Cart;
