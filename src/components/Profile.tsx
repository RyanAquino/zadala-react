import React, { useEffect, useRef, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  CardContent,
  Card,
  Avatar,
  TextField,
  Hidden,
  Snackbar,
  SnackbarOrigin,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { getProfileDetails, updateProfileDetails } from "../api/utils";
import { ProfileInterface } from "../Interfaces/Profile.interface";
import Alert from "./Alerts";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 275,
    },
    fieldsRoot: {
      padding: "5px 5px",
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
    const fetchProfileDetails = async () => {
      const data = await getProfileDetails();
      setProfileDetails(data);
      setInitialDetails(data);
    };
    fetchProfileDetails().then();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  };

  const handleDate = (date: string) => new Date(date).toDateString();

  return (
    <Grid item container justify={"center"}>
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
      <Grid item className={classes.avatarRoot}>
        <Avatar className={classes.large} />
      </Grid>
      <Grid item className={classes.fieldsRoot}>
        <Card>
          <CardContent>
            <TextField
              id="email"
              fullWidth
              type={"email"}
              label="Email Address"
              name={"email"}
              value={profileDetails.email || ""}
              onChange={handleFormChange}
              inputRef={inputRef}
              InputProps={{
                readOnly: readOnly,
              }}
            />
            <TextField
              id="first-name"
              label="First Name"
              fullWidth
              name={"first_name"}
              value={profileDetails.first_name || ""}
              onChange={handleFormChange}
              InputProps={{
                readOnly: readOnly,
              }}
            />
            <TextField
              id="last-name"
              label="Last Name"
              name={"last_name"}
              fullWidth
              value={profileDetails.last_name || ""}
              onChange={handleFormChange}
              InputProps={{
                readOnly: readOnly,
              }}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              name={"password"}
              autoComplete="current-password"
              fullWidth
              onChange={handleFormChange}
              InputProps={{
                readOnly: readOnly,
              }}
            />
            <TextField
              disabled
              id="member-since"
              label="Member Since"
              value={handleDate(profileDetails.date_joined) || ""}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              disabled
              id="last-login"
              label="Last Login"
              value={handleDate(profileDetails.last_login) || ""}
              fullWidth
            />
          </CardContent>
        </Card>
      </Grid>
      <Hidden smUp>
        <Grid item xs={12} container spacing={1} justify={"center"}>
          <Grid item container xs={12}>
            {isEditing ? (
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  size={"large"}
                  color={"secondary"}
                  fullWidth
                  onClick={() => {
                    setIsEditing(false);
                    setReadonly(true);
                    setProfileDetails(initialDetails);
                  }}
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
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ExitToAppIcon />}
              size={"large"}
              fullWidth
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Hidden>
    </Grid>
  );
};

export default Profile;
