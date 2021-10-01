import "./App.css";
import { Grid, Hidden } from "@mui/material";
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
import { OrdersProvider } from "./context/OrdersContext";
import Login from "./components/Login";
import Register from "./components/Register";
import { ThemeProvider } from "@mui/material/styles";
import { Theme, createTheme } from "@mui/material/styles";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const App: React.FC = () => {
  const [registered, setRegister] = useState<boolean>(false);
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Grid container>
          <UserProvider>
            <OrdersProvider>
              <ProductsProvider>
                <Grid item container>
                  <HeaderBar />
                </Grid>
                <Grid item container xs={12} justifyContent={"center"}>
                  <Route path={"/"} exact component={() => <Home />} />
                  <Route
                    path={"/login"}
                    exact
                    component={() => (
                      <Login
                        registered={registered}
                        setRegister={setRegister}
                      />
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
                </Grid>
                <Grid item container>
                  <Hidden mdUp>
                    <MobileNavigation />
                  </Hidden>
                </Grid>
              </ProductsProvider>
            </OrdersProvider>
          </UserProvider>
        </Grid>
      </Router>
    </ThemeProvider>
  );
};

export default App;
