import { AppBar, IconButton, Toolbar } from "@material-ui/core";
import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// import zadala_logo from "../assets/zadala-logo.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      paddingBottom: "5px",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const HeaderBar = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            logo here
            {/*<img src={zadala_logo} alt="Zadala logo" />*/}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default HeaderBar;
