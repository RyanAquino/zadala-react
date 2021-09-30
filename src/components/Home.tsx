import {
  Box,
  Grid,
  Snackbar,
  SnackbarOrigin,
  useScrollTrigger,
  Zoom,
} from "@mui/material";
import Search from "./Search";
import Products from "./Products";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { useContext, useEffect } from "react";
import useProductSearch from "./useProductSearch";
import { User, UserContextInterface } from "../Interfaces/User.interface";
import { UserContext } from "../context/UserContext";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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

const ScrollTop = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 70, right: 20 }}
      >
        {children}
      </Box>
    </Zoom>
  );
};

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
          Welcome {user.first_name}!
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
          You have successfully logged out!
        </Alert>
      </Snackbar>
      <Grid
        item
        container
        xs={12}
        sm={8}
        justifyContent={"center"}
        className={classes.root}
        id="back-to-top-anchor"
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
      <ScrollTop>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
};

export default Home;
