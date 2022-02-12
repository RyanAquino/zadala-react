import React, { useContext, useEffect, useRef, useState } from "react";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import {
  Grid,
  Button,
  CardContent,
  Card,
  Avatar,
  TextField,
  Snackbar,
  SnackbarOrigin,
  Typography,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  getProfileDetails,
  updateProfileDetails,
  validateToken,
} from "../api/utils";
import { ProfileInterface } from "../Interfaces/Profile.interface";
import Alert from "./Alerts";
import { useHistory } from "react-router";
import { User, UserContextInterface } from "../Interfaces/User.interface";
import { UserContext } from "../context/UserContext";
import { OrdersContextInterface } from "../Interfaces/Orders.interface";
import { OrdersContext } from "../context/OrdersContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 275,
    },
    fieldsRoot: {
      padding: "10px",
    },
    avatarRoot: {
      padding: "5px 5px",
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
  })
);

const Profile: React.FC = () => {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [profileDetails, setProfileDetails] = useState({} as ProfileInterface);
  const [initialDetails, setInitialDetails] = useState({} as ProfileInterface);
  const [readOnly, setReadonly] = useState(true);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();
  const { setUserData } = useContext<UserContextInterface>(UserContext);
  const { setOrderData } = useContext<OrdersContextInterface>(OrdersContext);

  const saveProfile = async () => {
    setIsEditing(false);
    setReadonly(true);
    setSuccess(true);
    setInitialDetails(profileDetails);
    await updateProfileDetails(profileDetails).catch((e) => console.log(e));
  };

  const editProfile = () => {
    setIsEditing(true);
    setReadonly(false);
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (!validateToken()) history.push("/login");
    else {
      const fetchProfileDetails = async () => {
        const data = await getProfileDetails();
        setProfileDetails(data);
        setInitialDetails(data);
      };
      fetchProfileDetails().then();
    }
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    history.push("/");
    setUserData({ logout: true } as User);
    setOrderData((prevOrder) => {
      return {
        ...prevOrder,
        total_items: 0,
      };
    });
    localStorage.removeItem("token");
  };

  const handleDate = (date: string) => new Date(date).toDateString();

  return (
    <Grid item container justifyContent={"center"} xs={12}>
      <Snackbar
        anchorOrigin={
          {
            vertical: "top",
            horizontal: "center",
          } as SnackbarOrigin
        }
        open={success}
        onClose={() => setSuccess(false)}
        autoHideDuration={5000}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Profile Updated
        </Alert>
      </Snackbar>
      <Card style={{ width: "80%" }}>
        <CardContent>
          <Grid item container xs={12}>
            <Grid
              item
              container
              sm={6}
              alignItems={"center"}
              direction="column"
            >
              <Avatar className={classes.large} />
              <Typography variant="h5" component="h2" gutterBottom>
                {profileDetails.first_name} {profileDetails.last_name}
              </Typography>
            </Grid>
            <Grid
              item
              container
              justifyContent={"center"}
              xs={12}
              sm={6}
              alignItems="center"
            >
              <Grid item xs={12} className={classes.fieldsRoot}>
                <TextField
                  id="email"
                  fullWidth
                  type={"email"}
                  label="Email Address"
                  name={"email"}
                  variant={"outlined"}
                  value={profileDetails.email || ""}
                  onChange={handleFormChange}
                  inputRef={inputRef}
                  InputProps={{
                    readOnly: readOnly,
                  }}
                />
              </Grid>
              <Grid item xs={12} className={classes.fieldsRoot}>
                <TextField
                  id="first-name"
                  label="First Name"
                  fullWidth
                  name={"first_name"}
                  value={profileDetails.first_name || ""}
                  onChange={handleFormChange}
                  variant={"outlined"}
                  InputProps={{
                    readOnly: readOnly,
                  }}
                />
              </Grid>
              <Grid item xs={12} className={classes.fieldsRoot}>
                <TextField
                  id="last-name"
                  label="Last Name"
                  name={"last_name"}
                  variant={"outlined"}
                  fullWidth
                  value={profileDetails.last_name || ""}
                  onChange={handleFormChange}
                  InputProps={{
                    readOnly: readOnly,
                  }}
                />
              </Grid>
              {profileDetails.auth_provider == "email" ? (
                <Grid item xs={12} className={classes.fieldsRoot}>
                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    name={"password"}
                    autoComplete="current-password"
                    fullWidth
                    variant={"outlined"}
                    onChange={handleFormChange}
                    InputProps={{
                      readOnly: readOnly,
                    }}
                  />
                </Grid>
              ) : (
                ""
              )}
              <Grid item xs={12} className={classes.fieldsRoot}>
                <TextField
                  disabled
                  id="member-since"
                  label="Member Since"
                  variant={"outlined"}
                  value={handleDate(profileDetails.date_joined) || ""}
                  onChange={handleFormChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} className={classes.fieldsRoot}>
                <TextField
                  disabled
                  id="last-login"
                  label="Last Login"
                  variant={"outlined"}
                  value={handleDate(profileDetails.last_login) || ""}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} className={classes.fieldsRoot}>
                <Grid item container xs={12}>
                  {isEditing ? (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        size={"large"}
                        color={"error"}
                        fullWidth
                        onClick={() => {
                          setIsEditing(false);
                          setReadonly(true);
                          setProfileDetails(initialDetails);
                        }}
                        style={{ marginBottom: 8 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        size={"large"}
                        fullWidth
                        onClick={() => saveProfile()}
                      >
                        Save
                      </Button>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        size={"large"}
                        color={"primary"}
                        fullWidth
                        onClick={() => editProfile()}
                      >
                        Edit
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.fieldsRoot}>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<ExitToAppIcon />}
                  size={"large"}
                  fullWidth
                  onClick={() => handleLogout()}
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Profile;
