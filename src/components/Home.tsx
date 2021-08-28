import { Grid } from "@material-ui/core";
import Search from "./Search";
import Products from "./Products";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import useProductSearch from "./useProductSearch";

const useStyles = makeStyles(() =>
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
  const {
    setQuery,
    loading,
    hasMore,
    pageNumber,
    setPageNumber,
  } = useProductSearch();

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
        <Search setPageNumber={setPageNumber} setQuery={setQuery} />
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
        <Products
          loading={loading}
          hasMore={hasMore}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </Grid>
    </>
  );
};

export default Home;
