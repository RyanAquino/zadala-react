import React, { useContext, useEffect, useState } from "react";
import { OrdersContext } from "../context/OrdersContext";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  makeStyles,
  CardMedia,
  SnackbarOrigin,
  Snackbar,
} from "@material-ui/core";
import {
  OrderItem,
  OrdersContextInterface,
} from "../Interfaces/Orders.interface";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import { determineImage, getOrders, updateCart } from "../api/utils";
import Checkout from "../components/Checkout";
import Alert from "./Alerts";

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
    width: "50%",
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
});

const Cart: React.FC = () => {
  const { orderData, setOrderData } = useContext<OrdersContextInterface>(
    OrdersContext
  );
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [getTotalItems, setTotalItems] = React.useState(orderData.total_items);

  useEffect(() => {
    const fetchOrders = async () => await getOrders();
    fetchOrders().then((orderData) => {
      setOrderData(orderData);
    });
  }, []);
  const products: OrderItem[] = orderData.products;
  const totalAmount: number = orderData.total_amount;

  const processMaxQuantity = (product: OrderItem, action: string) => {
    product.product.isMax = action == "add";
    return {
      total_items: getTotalItems,
      total_amount: totalAmount,
      products: [...products],
    };
  };

  const processAddToCart = async (product: OrderItem): Promise<void> => {
    const productCopy = { ...product };
    const action = "add";
    if (++productCopy.quantity <= product.product.quantity) {
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
      justify={"center"}
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
      <Grid item container justify={"center"}>
        {totalAmount ? (
          products.map((product: OrderItem, index: number) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                className={classes.orderItemContainer}
              >
                <Card className={classes.root}>
                  <div className={classes.details}>
                    <CardContent>
                      <Typography variant="h5" component="h6">
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
                    <CardActions>
                      <IconButton
                        aria-label="add"
                        color="primary"
                        onClick={() => processAddToCart(product)}
                      >
                        <AddCircleIcon fontSize={"large"} />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        onClick={() => processRemoveToCart(product)}
                      >
                        <RemoveCircleIcon fontSize={"large"} />
                      </IconButton>
                    </CardActions>
                  </div>
                  <CardMedia
                    className={classes.cover}
                    component="img"
                    height={"140"}
                    image={determineImage(product.product)}
                    title="Product image"
                  />
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
