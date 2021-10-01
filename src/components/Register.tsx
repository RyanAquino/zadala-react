import React, { Dispatch, useState } from "react";
import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  Snackbar,
  SnackbarOrigin,
  TextField,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Registration } from "../Interfaces/User.interface";
import { useHistory } from "react-router";
import { register } from "../api/utils";
import Alert from "./Alerts";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Register = ({
  setRegister,
}: {
  setRegister: Dispatch<boolean>;
}): JSX.Element => {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({} as Registration);
  const [errors, setErrors] = useState<string[] | []>([]);
  const history = useHistory();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    handleToggle();
    e.preventDefault();
    const response = await register(userInfo).catch((e) => {
      const error = e.response.data;
      if (error.email) {
        setErrors([error.email]);
      }
    });

    handleClose();

    if (response) {
      setRegister(true);
      history.push("/login");
    }
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Container component="main" maxWidth="xs">
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
        open={errors.length !== 0}
        autoHideDuration={5000}
        onClose={() => true}
      >
        <Alert severity="error" onClose={() => true}>
          {errors.length == 1
            ? errors[0]
            : Array.from(errors).map((err: string, index: number) => (
                <p key={index}>{err}</p>
              ))}
        </Alert>
      </Snackbar>

      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="first_name"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value={userInfo.first_name || ""}
                onChange={handleFormChange}
                error={userInfo.first_name === ""}
                inputProps={{
                  minLength: 2,
                  maxLength: 254,
                }}
                helperText={
                  userInfo.first_name === "" ? "Field is required" : null
                }
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="last_name"
                autoComplete="lname"
                value={userInfo.last_name || ""}
                onChange={handleFormChange}
                inputProps={{
                  minLength: 2,
                  maxLength: 254,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type={"email"}
                value={userInfo.email || ""}
                onChange={handleFormChange}
                inputProps={{
                  minLength: 4,
                  maxLength: 254,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={userInfo.password || ""}
                onChange={handleFormChange}
                inputProps={{
                  minLength: 8,
                  maxLength: 65,
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item>
              <Link href={"/login"} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Register;
