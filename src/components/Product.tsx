import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from "@material-ui/core";
import default_image from "../static/default.jpg";
import React from "react";
import { Product as ProductType } from "../Interfaces/Product.interface";

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

const Product: React.FC<any> = ({ product }: { product: ProductType }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          component="img"
          height={"140"}
          image={product.image ? product.image : default_image}
          title="Product image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default Product;
