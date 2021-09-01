import { Grid, Snackbar, SnackbarOrigin } from "@material-ui/core";
import Search from "./Search";
import Products from "./Products";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React, { useContext, useEffect } from "react";
import useProductSearch from "./useProductSearch";
import { UserContextInterface } from "../Interfaces/User.interface";
import { UserContext } from "../context/UserContext";
import Alert from "./Alerts";

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
  const { user, setUserData } = useContext<UserContextInterface>(UserContext);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (user.login) setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setUserData({ ...user, login: false });
  };

  return (
    <>
      {user.login && (
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
            Welcome {user.first_name} !
          </Alert>
        </Snackbar>
      )}
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
