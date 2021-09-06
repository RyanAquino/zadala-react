import "./App.css";
import { Grid, Hidden } from "@material-ui/core";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import Home from "./components/Home";
import ProductDetails from "./components/ProductDetails";
import MobileNavigation from "./components/MobileNavigation";
import { ProductsProvider } from "./context/ProductsContext";
import { UserProvider } from "./context/UserContext";
import { BrowserRouter as Router, Route } from "react-router-dom";
import React, { useState } from "react";
import HeaderBar from "./components/HeaderBar";
import ModalPrompt from "./components/ModalPrompt";
import { OrdersProvider } from "./context/OrdersContext";
import Login from "./components/Login";
import Register from "./components/Register";

const App: React.FC = () => {
  const [registered, setRegister] = useState<boolean>(false);

  return (
    <Router>
      <Grid container>
        <UserProvider>
          <OrdersProvider>
            <ProductsProvider>
              <Grid item container>
                <HeaderBar />
              </Grid>
              <Grid item container xs={12} justify={"center"}>
                <Route path={"/"} exact component={() => <Home />} />
                <Route
                  path={"/login"}
                  exact
                  component={() => (
                    <Login registered={registered} setRegister={setRegister} />
                  )}
                />
                <Route
                  path={"/register"}
                  exact
                  component={() => <Register setRegister={setRegister} />}
                />
                <Route path={"/profile"} exact component={Profile} />
                <Route path={"/cart"} exact component={Cart} />
                <Route
                  path={"/products/:id"}
                  exact
                  component={ProductDetails}
                />
                <Route path={"/modal"} exact component={ModalPrompt} />
              </Grid>
              <Grid item container>
                <Hidden smUp>
                  <MobileNavigation />
                </Hidden>
              </Grid>
            </ProductsProvider>
          </OrdersProvider>
        </UserProvider>
      </Grid>
    </Router>
  );
};

export default App;
