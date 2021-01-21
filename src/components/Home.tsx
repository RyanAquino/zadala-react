import { Grid } from "@material-ui/core";
import Search from "./Search";
import Products from "./Products";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "5px 5px",
    },
    productsContainer: {
      paddingBottom: "100px",
    },
  })
);

const Home: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <Grid
        item
        container
        xs={12}
        sm={8}
        justify={"center"}
        className={classes.root}
      >
        <Search />
      </Grid>
      <Grid
        item
        container
        className={classes.productsContainer}
        xs={12}
        sm={10}
        md={8}
        justify={"center"}
      >
        <Products />
      </Grid>
    </>
  );
};

export default Home;
