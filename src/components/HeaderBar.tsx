import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Hidden,
  Badge,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { Link } from "react-router-dom";
import { AccountCircle, Home, ExitToApp, History } from "@mui/icons-material";
import { User, UserContextInterface } from "../Interfaces/User.interface";
import { useHistory } from "react-router";
import { UserContext } from "../context/UserContext";
import { OrdersContextInterface } from "../Interfaces/Orders.interface";
import { OrdersContext } from "../context/OrdersContext";
import { getOrders, validateToken } from "../api/utils";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import zadala_logo from "../assets/zadala-logo.png";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      paddingBottom: "5px",
    },
  })
);

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
          <Hidden mdDown>
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
                  <Badge badgeContent={orderData.total_items} color="error">
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
              <Button
                startIcon={<History />}
                color="inherit"
                component={Link}
                to={"/orders"}
              >
                Orders
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
