import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import { Home, AccountCircle } from "@material-ui/icons";
import { Link } from "react-router-dom";
import React from "react";
import { createStyles, Theme } from "@material-ui/core/styles";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

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
            <StyledBadge badgeContent={1} color="secondary">
              <ShoppingCartIcon />
            </StyledBadge>
          }
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
