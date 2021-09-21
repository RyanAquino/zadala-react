import { Grid, Snackbar, SnackbarOrigin } from "@mui/material";
import Search from "./Search";
import Products from "./Products";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { useContext, useEffect } from "react";
import useProductSearch from "./useProductSearch";
import { User, UserContextInterface } from "../Interfaces/User.interface";
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

const Home = (): JSX.Element => {
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

  const handleLoginClose = () => {
    setOpen(false);
    setUserData({ ...user, login: false });
  };

  const handleLogoutClose = () => {
    setUserData({ logout: false } as User);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={
          {
            vertical: "top",
            horizontal: "center",
          } as SnackbarOrigin
        }
        open={open}
        autoHideDuration={3000}
        onClose={handleLoginClose}
      >
        <Alert severity="success" onClose={handleLoginClose}>
          Welcome {user.first_name} !
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={
          {
            vertical: "top",
            horizontal: "center",
          } as SnackbarOrigin
        }
        open={user.logout}
        autoHideDuration={2000}
        onClose={handleLogoutClose}
      >
        <Alert severity="success" onClose={handleLogoutClose}>
          You have successfully logged out !
        </Alert>
      </Snackbar>
      <Grid
        item
        container
        xs={12}
        sm={8}
        justifyContent={"center"}
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
        justifyContent={"center"}
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
