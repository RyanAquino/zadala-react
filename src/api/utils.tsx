import axios from "axios";

export const addToCart = (productId: number): void => {
  axios
    .post(
      `${process.env.REACT_APP_API_URL}/v1/orders/update-cart/`,
      {
        productId: productId,
        action: "add",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
        },
      }
    )
    .then(() => {
      console.log("Success");
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        alert(error.response.data.detail);
      }
    });
};
