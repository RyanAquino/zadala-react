import "./App.css";
import { Grid, Hidden } from "@material-ui/core";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import Home from "./components/Home";
import ProductDetails from "./components/ProductDetails";
import MobileNavigation from "./components/MobileNavigation";
import { ProductsProvider } from "./context/ProductsContext";
import { Route, BrowserRouter as Router } from "react-router-dom";
import React from "react";
import HeaderBar from "./components/HeaderBar";
import ModalPrompt from "./components/ModalPrompt";
import { OrdersProvider } from "./context/OrdersContext";

const App: React.FC = () => {
  return (
    <Router>
      <Grid container>
        <OrdersProvider>
          <ProductsProvider>
            <Grid item container>
              <HeaderBar />
            </Grid>
            <Grid item container xs={12} justify={"center"}>
              <Route path={"/"} exact component={Home} />
              <Route path={"/profile"} exact component={Profile} />
              <Route path={"/cart"} exact component={Cart} />
              <Route path={"/products/:id"} exact component={ProductDetails} />
              <Route path={"/modal"} exact component={ModalPrompt} />
            </Grid>
            <Grid item container>
              <Hidden smUp>
                <MobileNavigation />
              </Hidden>
            </Grid>
          </ProductsProvider>
        </OrdersProvider>
      </Grid>
    </Router>
  );
};

export default App;
