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
import default_image from "../default.jpg";
import React from "react";

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

const Product: React.FC<any> = ({ product }: { product: any }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          component="img"
          height={"140"}
          image={default_image}
          title="Product image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {2478524}
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
