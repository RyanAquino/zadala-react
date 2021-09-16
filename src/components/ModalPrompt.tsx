import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Button, Modal } from "@material-ui/core";
import { useHistory } from "react-router";
import { validateToken } from "../api/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 200,
      textAlign: "center",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const ModalPrompt = ({ onConfirm }: { onConfirm: () => void }): JSX.Element => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setIsOpen] = React.useState(false);
  const history = useHistory();

  const setOpen = () => {
    setIsOpen(true);
  };

  const addToCart = () => {
    if (!validateToken()) history.push("/login");
    else onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={setOpen}
      >
        Add to cart
      </Button>
      <Modal
        open={open}
        onClose={() => setIsOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h4 id="simple-modal-title">
            Are you sure you want to add to your cart?
          </h4>
          <Button variant="contained" color="primary" onClick={addToCart}>
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ModalPrompt;
