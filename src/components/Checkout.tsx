import React, { Dispatch, useContext, useState } from "react";
import {
  Fade,
  Backdrop,
  Modal,
  Button,
  createStyles,
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Theme,
  TextField,
  Grid,
  Box,
} from "@material-ui/core";
import {
  Order,
  OrderItem,
  OrdersContextInterface,
} from "../Interfaces/Orders.interface";
import { OrdersContext } from "../context/OrdersContext";
import { ShippingAddress } from "../Interfaces/Shipping.interface";
import { processOrder } from "../api/utils";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "scroll"
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    root: {
      width: "100%",
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  })
);

const Checkout = ({
  setSuccessState,
  getTotalItems,
  setTotalItems,
}: {
  setSuccessState: Dispatch<boolean>;
  getTotalItems: number;
  setTotalItems: Dispatch<number>;
}): JSX.Element => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [shipping, setShipping] = React.useState({} as ShippingAddress);
  const getSteps = () => [
    "Shipping Address",
    "Payment Details",
    "Review your order",
  ];
  const steps = getSteps();
  const { orderData, setOrderData } = useContext<OrdersContextInterface>(
    OrdersContext
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const products: OrderItem[] = orderData.products;
  const totalAmount: number = orderData.total_amount;
  const history = useHistory();

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid item container spacing={2}>
            <Grid item>
              <TextField
                id="address"
                label="Address"
                name={"address"}
                value={shipping.address || ""}
                onChange={handleFormChange}
                error={shipping.address === ""}
                helperText={
                  shipping.address === "" ? "Field is required" : null
                }
                required
              />
            </Grid>
            <Grid item>
              <TextField
                id="city"
                label="City"
                name={"city"}
                value={shipping.city || ""}
                onChange={handleFormChange}
                error={shipping.city === ""}
                helperText={shipping.city === "" ? "Field is required" : null}
                required
              />
            </Grid>
            <Grid item>
              <TextField
                id="state"
                label="State"
                name={"state"}
                value={shipping.state || ""}
                onChange={handleFormChange}
                error={shipping.state === ""}
                helperText={shipping.state === "" ? "Field is required" : null}
                required
              />
            </Grid>
            <Grid item>
              <TextField
                id="zipcode"
                label="Zip"
                name={"zipcode"}
                value={shipping.zipcode || ""}
                onChange={handleFormChange}
                error={shipping.zipcode === ""}
                helperText={
                  shipping.zipcode === "" ? "Field is required" : null
                }
                required
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid item>
            <Typography variant="h6" gutterBottom>
              Cash on Delivery*
            </Typography>
          </Grid>
        );
      case 2:
        return products != null ? (
          <Grid item container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="h6" component="h2" gutterBottom>
                Order Summary
              </Typography>
              {products.map((product: OrderItem, index) => {
                return (
                  <div key={index}>
                    <Typography>{product.product.name}</Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                      ₱{product.product.price} x{product.quantity}
                    </Typography>
                  </div>
                );
              })}
            </Grid>
            <Grid item>
              <Typography>Shipping: {"Free"}</Typography>
              <Typography>Total Items: {orderData.total_items}</Typography>
              <Typography component="div">
                Total Amount:
                <Box fontWeight="fontWeightBold" display={"inline"}>
                  ₱{totalAmount}
                </Box>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" component="h2" gutterBottom>
                Shipping Address
              </Typography>
              <Typography>
                {shipping.address}, {shipping.city}, {shipping.state},{" "}
                {shipping.zipcode}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" component="h2" gutterBottom>
                Payment Details
              </Typography>
              <Typography>{"Cash on delivery"}</Typography>
            </Grid>
          </Grid>
        ) : (
          ""
        );
      default:
        return "Unknown step";
    }
  };
  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      handleClose();
      handleReset();
      setSuccessState(true);
      await processOrder(shipping);
      setOrderData({} as Order);
      setTotalItems(0);
      setTimeout(() => {
        history.push("/");
      }, 6000);
    } else if (activeStep === 0) {
      const { address, state, city, zipcode } = shipping;
      if (address && state && city && zipcode) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        const requiredKeyVal = ["address", "city", "state", "zipcode"];
        const neededKeyVal = requiredKeyVal.filter(
          (el) => !Object.keys(shipping).includes(el)
        );
        type ShippingAddressKey = keyof ShippingAddress;
        neededKeyVal.forEach((item) => {
          shipping[item as ShippingAddressKey] = "";
        });
        setShipping((prevShipping) => {
          return { ...prevShipping };
        });
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={handleOpen}
        disabled={getTotalItems === 0 || getTotalItems === undefined}
      >
        Checkout
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box className={classes.paper}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    <Grid container>{getStepContent(index)}</Grid>
                    <div className={classes.actionsContainer}>
                      <div>
                        {
                          activeStep !== 0 && (
                              <Button
                                  disabled={activeStep === 0}
                                  onClick={handleBack}
                                  className={classes.button}
                              >
                                Back
                              </Button>
                          )
                        }
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                          className={classes.button}
                        >
                          {activeStep === steps.length - 1
                            ? "Place Order"
                            : "Next"}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Checkout;
