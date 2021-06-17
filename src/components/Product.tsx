import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from "@material-ui/core";
import default_image from "../static/default.jpg";
import React, { useContext } from "react";
import { Product as ProductType } from "../Interfaces/Product.interface";
import { Link } from "react-router-dom";
import { addToCart } from "../api/utils";
import ModalPrompt from "./ModalPrompt";
import { OrdersContext } from "../context/OrdersContext";
import { OrdersContextInterface } from "../Interfaces/Orders.interface";

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

const Product: React.FC<{ product: ProductType; handleClick: () => void }> = ({
  product,
  handleClick,
}: {
  product: ProductType;
  handleClick: () => void;
}) => {
  const classes = useStyles();
  const { orderData, setOrderData } = useContext<OrdersContextInterface>(
    OrdersContext
  );

  const determineImage = () => {
    if (product.image_url) {
      product.image = product.image_url;
    } else {
      product.image = default_image;
    }
    return product.image;
  };

  const handleConfirm = (id: number): void => {
    addToCart(id);
    handleClick();
    setOrderData({
      ...orderData,
      total_items: orderData.total_items + 1,
    });
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
          image={determineImage()}
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
        <ModalPrompt onConfirm={() => handleConfirm(product.id)} />
      </CardActions>
    </Card>
  );
};

export default Product;
