import React from "react";
import { ProductDetailsPropTypes } from "../Interfaces/Product.interface";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { addToCart } from "../api/utils";

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
      maxHeight: "450px",
    },
    cardContent: {
      padding: "10px",
    },
  })
);

const ProductDetails: ({
  location,
}: {
  location: ProductDetailsPropTypes;
}) => JSX.Element = ({ location }: { location: ProductDetailsPropTypes }) => {
  const product = location.state.product;
  const classes = useStyles();

  return (
    <Container maxWidth={"lg"}>
      <Grid item container justify={"center"} spacing={1}>
        <Grid item sm={4} md={3}>
          <Paper elevation={3} variant={"outlined"}>
            <img
              src={product.image}
              alt="Product image"
              className={classes.productImage}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                ₱{product.price}
              </Typography>
              <Typography variant="h5" component="h2">
                {product.name}
              </Typography>
              <Typography variant="h5" component="h2">
                {product.quantity}
              </Typography>
              <Typography color="textSecondary">
                {product.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product.id);
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
