import "./App.css";
import { Grid, Hidden } from "@material-ui/core";
import Account from "./components/Account";
import Cart from "./components/Cart";
import Home from "./components/Home";
import MobileNavigation from "./components/MobileNavigation";
import DesktopNavigation from "./components/DesktopNavigation";
import { ProductsProvider } from "./context/ProductsContext";
import { Route, BrowserRouter as Router } from "react-router-dom";
import React from "react";

const App: React.FC = () => {
  return (
    <Router>
      <Grid container>
        <ProductsProvider>
          <Grid item container>
            <Hidden xsDown>
              <DesktopNavigation />
            </Hidden>
          </Grid>
          <Grid item container xs={12} justify={"center"}>
            <Route path={"/"} exact component={Home} />
            <Route path={"/account"} exact component={Account} />
            <Route path={"/cart"} exact component={Cart} />
          </Grid>
          <Grid item container>
            <Hidden smUp>
              <MobileNavigation />
            </Hidden>
          </Grid>
        </ProductsProvider>
      </Grid>
    </Router>
  );
};

export default App;
