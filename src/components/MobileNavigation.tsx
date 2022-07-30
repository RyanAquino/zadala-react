import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import { AccountCircle, Home, History } from "@mui/icons-material";
import { Link } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { OrdersContext } from "../context/OrdersContext";
import { OrdersContextInterface } from "../Interfaces/Orders.interface";
import { getOrders, validateToken } from "../api/utils";

const useStyles = makeStyles({
  root: {
    marginTop: "30%",
  },
  stickToBottom: {
    width: "100%",
    position: "fixed",
    bottom: 0,
  },
});

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

const MobileNavigation: React.FC = () => {
  const classes = useStyles();
  const { orderData, setOrderData } = useContext<OrdersContextInterface>(
    OrdersContext
  );

  useEffect(() => {
    if (!validateToken()) return;
    const fetchOrders = async () => await getOrders();
    fetchOrders().then((orderData) => {
      setOrderData(orderData);
    });
  }, []);

  return (
    <Box className={classes.root}>
      <BottomNavigation showLabels className={classes.stickToBottom}>
        <BottomNavigationAction
          label="Home"
          icon={<Home />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="Cart"
          icon={
            <StyledBadge badgeContent={orderData.total_items} color="error">
              <ShoppingCartIcon />
            </StyledBadge>
          }
          component={Link}
          to={localStorage.getItem("token") === undefined ? "/login" : "/cart"}
        />
        <BottomNavigationAction
          label="Account"
          icon={<AccountCircle />}
          component={Link}
          to={
            localStorage.getItem("token") === undefined ? "/login" : "/profile"
          }
        />
        <BottomNavigationAction
          label="Orders"
          icon={<History />}
          component={Link}
          to={
            localStorage.getItem("token") === undefined ? "/login" : "/orders"
          }
        />
      </BottomNavigation>
    </Box>
  );
};

export default MobileNavigation;
