import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useHistory } from "react-router";
import { validateToken } from "../api/utils";

const ModalPrompt = ({ onConfirm }: { onConfirm: () => void }): JSX.Element => {
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
      <Dialog
        open={open}
        onClose={() => setIsOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <DialogTitle>Add to cart</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to add this item to your cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setIsOpen(!open)}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={addToCart}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalPrompt;
