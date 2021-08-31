import React, { useContext, useState } from "react";
import {
  Grid,
  Avatar,
  Typography,
  TextField,
  Button,
  Link,
  FormControlLabel,
  Checkbox,
  makeStyles,
  Container,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {
  Authentication,
  UserContextInterface,
} from "../Interfaces/User.interface";
import { UserContext } from "../context/UserContext";
import { authenticate, getOrders } from "../api/utils";
import { useHistory } from "react-router";
import { OrdersContextInterface } from "../Interfaces/Orders.interface";
import { OrdersContext } from "../context/OrdersContext";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
    padding: "5px 5px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Login: React.FC = () => {
  const classes = useStyles();
  const { setUserData } = useContext<UserContextInterface>(UserContext);
  const [credentials, setCredentials] = useState({} as Authentication);
  const history = useHistory();
  const { setOrderData } = useContext<OrdersContextInterface>(OrdersContext);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    handleToggle();
    e.preventDefault();
    const response = await authenticate(credentials);
    setUserData(response);
    localStorage.setItem("token", response.access);
    const fetchOrders = async () => await getOrders();
    fetchOrders().then((orderData) => {
      setOrderData(orderData);
    });
    history.push("/");
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Container maxWidth={"xs"} className={classes.root}>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form className={classes.form} onSubmit={handleLogin}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={credentials.email || ""}
          onChange={handleFormChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={credentials.password || ""}
          onChange={handleFormChange}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href={"/register"} variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Login;
