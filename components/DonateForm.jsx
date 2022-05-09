import { Button, Input, Slider } from "@material-ui/core";
import { alpha, makeStyles } from "@material-ui/core/styles";
import { fetchPostJSON } from "@utils/stripe/api-helpers";
import getStripe from "@utils/stripe/get-stripe";
import { formatAmountForDisplay } from "@utils/stripe/stripe-helpers";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  input: {
    position: "relative",
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    display: "flex",
    padding: "10px 10px",
    flexGrow: 1,
    "&:focus-within": {
      border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
      flexGrow: 1,
    },
  },
}));

const DonateForm = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(5.0);

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create a Checkout Session.
    const response = await fetchPostJSON("/api/checkout", {
      amount: value,
    });

    if (response.statusCode === 500) {
      console.error(response.message);
      return;
    }

    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Custom donation amount ({formatAmountForDisplay(1.0, "usd")}-
        {formatAmountForDisplay(1000.0, "usd")}):
        <Input
          className={classes.input}
          value={value}
          color="secondary"
          disableUnderline
          onChange={handleInputChange}
          inputProps={{
            step: 1.0,
            min: 1.0,
            max: 1000.0,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
        <Slider
          value={typeof value === "number" ? value : 1.0}
          color="secondary"
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          min={1.0}
          max={1000.0}
        />
      </label>
      <Button
        variant="contained"
        color="secondary"
        type="submit"
        disabled={loading}
      >
        Donate {formatAmountForDisplay(value, "usd")}
      </Button>
    </form>
  );
};

export default DonateForm;
