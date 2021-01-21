import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  makeStyles,
} from "@material-ui/core";
import { Home, ShoppingCart, AccountCircle } from "@material-ui/icons";
import { Link } from "react-router-dom";
import React from "react";

const useStyles = makeStyles({
  stickToBottom: {
    width: "100%",
    position: "fixed",
    bottom: 0,
  },
});

const MobileNavigation: React.FC = () => {
  const classes = useStyles();
  return (
    <Box>
      <BottomNavigation showLabels className={classes.stickToBottom}>
        <BottomNavigationAction
          label="Home"
          icon={<Home />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="Cart"
          icon={<ShoppingCart />}
          component={Link}
          to="/cart"
        />
        <BottomNavigationAction
          label="Account"
          icon={<AccountCircle />}
          component={Link}
          to="/account"
        />
      </BottomNavigation>
    </Box>
  );
};

export default MobileNavigation;
