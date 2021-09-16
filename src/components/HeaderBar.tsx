import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Hidden,
  IconButton,
  Badge,
  withStyles,
} from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import {
  AccountCircle,
  Home,
  ShoppingCart,
  ExitToApp,
} from "@material-ui/icons";
import { User, UserContextInterface } from "../Interfaces/User.interface";
import { useHistory } from "react-router";
import { UserContext } from "../context/UserContext";
import { OrdersContextInterface } from "../Interfaces/Orders.interface";
import { OrdersContext } from "../context/OrdersContext";
import { getOrders, validateToken } from "../api/utils";
// import zadala_logo from "../assets/zadala-logo.png";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      paddingBottom: "5px",
    },
  })
);

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  })
)(Badge);

const HeaderBar = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const { setUserData } = useContext<UserContextInterface>(UserContext);
  const { orderData, setOrderData } = useContext<OrdersContextInterface>(
    OrdersContext
  );

  const handleLogout = () => {
    history.push("/");
    setOrderData((prevOrder) => {
      return {
        ...prevOrder,
        total_items: 0,
      };
    });
    localStorage.removeItem("token");
    setUserData({ logout: true } as User);
  };

  useEffect(() => {
    if (!validateToken()) return;
    const fetchOrders = async () => await getOrders();
    fetchOrders().then((orderData) => {
      setOrderData(orderData);
    });
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <Typography variant="h5">Zadala</Typography>
          </Box>
          <Hidden xsDown>
            <Box display="flex" flexGrow={2} justifyContent={"space-evenly"}>
              <Button
                startIcon={<Home />}
                color="inherit"
                component={Link}
                to={"/"}
              >
                Home
              </Button>
              <Button
                startIcon={
                  <Badge badgeContent={orderData.total_items} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                }
                color="inherit"
                component={Link}
                to={"/cart"}
              >
                Cart
              </Button>
              <Button
                startIcon={<AccountCircle />}
                color="inherit"
                component={Link}
                to={"/profile"}
              >
                Account
              </Button>
            </Box>
          </Hidden>
          <Box display="flex" flexGrow={1} justifyContent={"flex-end"}>
            {!validateToken() ? (
              <Box>
                <Button color="inherit" component={Link} to={"/login"}>
                  Login
                </Button>
                <Button color="inherit" component={Link} to={"/register"}>
                  Register
                </Button>
              </Box>
            ) : (
              <Button
                startIcon={<ExitToApp />}
                color="inherit"
                onClick={() => handleLogout()}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default HeaderBar;
