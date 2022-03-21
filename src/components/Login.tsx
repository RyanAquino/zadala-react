import React, { Dispatch, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  Avatar,
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Snackbar,
  SnackbarOrigin,
  TextField,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Authentication,
  User,
  UserContextInterface,
} from "../Interfaces/User.interface";
import { UserContext } from "../context/UserContext";
import {
  authenticate,
  getOrders,
  socialLoginGoogle,
  validateToken,
} from "../api/utils";
import { useHistory } from "react-router";
import { OrdersContextInterface } from "../Interfaces/Orders.interface";
import { OrdersContext } from "../context/OrdersContext";
import Alert from "./Alerts";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { OAuthError } from "../Interfaces/OAuth.interface";

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
    backgroundColor: theme.palette.primary.dark,
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
  socialLogins: {
    marginTop: "5px",
  },
}));

const Login = ({
  registered,
  setRegister,
}: {
  registered: boolean;
  setRegister: Dispatch<boolean>;
}): JSX.Element => {
  const classes = useStyles();
  const { setUserData } = useContext<UserContextInterface>(UserContext);
  const [credentials, setCredentials] = useState({} as Authentication);
  const history = useHistory();
  const { setOrderData } = useContext<OrdersContextInterface>(OrdersContext);
  const [errors, setErrors] = useState<string[] | []>([]);
  const [errorWindow, setErrorWindow] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["email"]);
  const [rememberMe, setRememberMe] = useState(Boolean(cookies.email) || false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (validateToken()) history.push("/");
    if (rememberMe) setCredentials({ ...credentials, email: cookies.email });
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    handleToggle();
    e.preventDefault();

    const response = await authenticate(credentials).catch((err) => {
      const statusCode = err.response.status;
      let error = ["Something went wrong"];

      if (statusCode === 403) {
        const { detail }: { detail: string } = err.response.data;
        error = [detail];
      } else if (statusCode === 400) {
        const { email, password } = err.response.data;
        error = [];

        if (email) {
          error.push(`Email Address: ${email[0]}`);
        }
        if (password) {
          error.push(`Password: ${password[0]}`);
        }
      }
      setErrorWindow(true);
      setErrors(error);
    });

    if (response) {
      loginSuccess(response);
    }

    if (rememberMe) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      setCookie("email", credentials.email || "", {
        path: "/",
        expires,
      });
    } else {
      removeCookie("email");
    }

    handleClose();
  };
  const loginSuccess = (response: User) => {
    setUserData({ ...response, login: true, logout: false });
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

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const handleSnackbarClose = () => {
    setRegister(false);
  };

  const handleErrorSnackbarClose = () => {
    setErrorWindow(false);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const responseSuccessGoogle = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (!("tokenId" in response)) return;
    handleToggle();
    const user = await socialLoginGoogle(response.tokenId).catch((err) => {
      const statusCode = err.response.status;
      let error = ["Something went wrong"];

      if (statusCode === 403) {
        const { email }: { email: string } = err.response.data;
        error = [email];
      }
      setErrorWindow(true);
      setErrors(error);
    });
    if (user) {
      loginSuccess(user);
    }
    handleClose();
  };

  const responseFailGoogle = (response: OAuthError) => {
    if ("error" in response && "details" in response) {
      setErrorWindow(true);
      setErrors([response.details]);
    }
  };

  return (
    <Container maxWidth={"xs"} className={classes.root}>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        anchorOrigin={
          {
            vertical: "top",
            horizontal: "center",
          } as SnackbarOrigin
        }
        open={registered}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" onClose={handleSnackbarClose}>
          Your account has been successfully created.
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={
          {
            vertical: "top",
            horizontal: "center",
          } as SnackbarOrigin
        }
        open={errorWindow}
        autoHideDuration={5000}
        onClose={handleErrorSnackbarClose}
      >
        <Alert severity="error" onClose={handleErrorSnackbarClose}>
          {errors.length == 1
            ? errors[0]
            : Array.from(errors).map((err: string, index: number) => (
                <p key={index}>{err}</p>
              ))}
        </Alert>
      </Snackbar>

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
          type={"email"}
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
          control={
            <Checkbox
              value="remember"
              color="primary"
              checked={rememberMe}
              onChange={handleRememberMe}
            />
          }
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
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}
          buttonText="Sign in with Google"
          onSuccess={responseSuccessGoogle}
          onFailure={responseFailGoogle}
          cookiePolicy={"single_host_origin"}
          className={classes.socialLogins}
        />
      </form>
    </Container>
  );
};

export default Login;
