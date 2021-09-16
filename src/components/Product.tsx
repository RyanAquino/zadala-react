import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useContext } from "react";
import { Product as ProductType } from "../Interfaces/Product.interface";
import { Link } from "react-router-dom";
import { updateCart, determineImage } from "../api/utils";
import ModalPrompt from "./ModalPrompt";
import { OrdersContext } from "../context/OrdersContext";
import {
  OrderItem,
  OrdersContextInterface,
} from "../Interfaces/Orders.interface";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 14,
  },
  media: {
    height: "100%",
    width: "100%",
  },
});

const Product: React.FC<{
  product: ProductType;
  onClick: (success: boolean) => void;
}> = ({
  product,
  onClick,
}: {
  product: ProductType;
  onClick: (success: boolean) => void;
}) => {
  const classes = useStyles();
  const { orderData, setOrderData } = useContext<OrdersContextInterface>(
    OrdersContext
  );

  const handleConfirm = async (product: ProductType): Promise<void> => {
    const orderItems = orderData.products;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [orderItem, ...rest] = orderItems.filter(
      (item: OrderItem) => item.product.id === product.id
    );
    if (!orderItem || orderItem.quantity + 1 <= orderItem.product.quantity) {
      onClick(true);
      const response = await updateCart(product.id, "add");
      setOrderData(response);
    } else {
      onClick(false);
    }
  };

  return (
    <Card className={classes.root}>
      <CardActionArea
        component={Link}
        to={{
          pathname: `/products/${product.id}`,
          state: {
            product: product,
          },
        }}
      >
        <CardMedia
          className={classes.media}
          component="img"
          height={"140"}
          image={determineImage(product)}
          title="Product image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
          <Typography gutterBottom variant="h6" component="h2">
            ₱{product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <ModalPrompt onConfirm={() => handleConfirm(product)} />
      </CardActions>
    </Card>
  );
};

export default Product;
