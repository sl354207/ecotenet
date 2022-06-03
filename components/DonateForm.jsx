import {
  Box,
  Button,
  CircularProgress,
  Input,
  Slider,
  Tab,
  Tabs,
} from "@material-ui/core";
import { alpha, makeStyles } from "@material-ui/core/styles";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { fetchPostJSON } from "@utils/stripe/api-helpers";
import getStripe from "@utils/stripe/get-stripe";
import { formatAmountForDisplay } from "@utils/stripe/stripe-helpers";
import PropTypes from "prop-types";
import { useState } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  tab: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.light,
    margin: 20,
    minHeight: 80,
    borderRadius: "10px",
    "&:hover": {
      color: theme.text,
      opacity: 1,
    },
  },
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
  toggleGroup: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  toggle: {
    color: "rgba(255, 255, 255, 0.7)",
    padding: "30px!important",
    marginInline: "20px!important",
    marginBlock: "10px!important",
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}!important`,
    borderRadius: "4px!important",
  },
  selected: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 1)}!important`,
    borderRadius: "4px!important",
  },
  button: {
    display: "flex",
    margin: "auto",
    marginTop: 10,
    minWidth: 300,
  },
  progress: {
    marginInline: "auto",
    display: "flex",
    justifySelf: "center",
  },
}));

const DonateForm = () => {
  const classes = useStyles();

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(5.0);
  const [monthly, setMonthly] = useState({
    amount: 5.0,
    priceID: "price_1KyfgSIxZCxSXd1iyenrfWb5",
  });

  const handleInputChange = (event) => {
    setValue(
      event.currentTarget.value === "" ? "" : Number(event.currentTarget.value)
    );
  };
  const handleMonthlyChange = (event) => {
    switch (event.currentTarget.value) {
      case "2":
        setMonthly({
          amount: Number(event.currentTarget.value),
          priceID: "price_1KydUGIxZCxSXd1ihseMlZY1",
        });
        break;
      case "5":
        setMonthly({
          amount: Number(event.currentTarget.value),
          priceID: "price_1KyfgSIxZCxSXd1iyenrfWb5",
        });
        break;
      case "10":
        setMonthly({
          amount: Number(event.currentTarget.value),
          priceID: "price_1KyfgpIxZCxSXd1i61bID9fv",
        });
        break;
      case "20":
        setMonthly({
          amount: Number(event.currentTarget.value),
          priceID: "price_1KyfhZIxZCxSXd1i0FMziStb",
        });
        break;
      case "50":
        setMonthly({
          amount: Number(event.currentTarget.value),
          priceID: "price_1Kyfi8IxZCxSXd1iv0I8IsNs",
        });
        break;
      case "100":
        setMonthly({
          amount: Number(event.currentTarget.value),
          priceID: "price_1KyfihIxZCxSXd1iHsLTrftf",
        });
        break;

      default:
        break;
    }
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleMonthlyDonation = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create a Checkout Session.
    const response = await fetchPostJSON("/api/checkout", {
      amount: monthly.amount,
      priceID: monthly.priceID,
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

  const handleOneTimeDonation = async (e) => {
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
    <>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="simple tabs example"
        centered
      >
        <Tab
          className={classes.tab}
          label="Monthly Donation"
          {...a11yProps(0)}
        />
        <Tab
          className={classes.tab}
          label="One Time Donation"
          {...a11yProps(1)}
        />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <form onSubmit={handleMonthlyDonation}>
          <label></label>
          <ToggleButtonGroup
            value={monthly.amount}
            exclusive
            onChange={handleMonthlyChange}
            className={classes.toggleGroup}
            aria-label="text alignment"
          >
            <ToggleButton
              value={2.0}
              aria-label="left aligned"
              className={classes.toggle}
              classes={{
                selected: classes.selected,
              }}
            >
              {formatAmountForDisplay(2, "usd")}
            </ToggleButton>
            <ToggleButton
              value={5.0}
              aria-label="left aligned"
              className={classes.toggle}
              classes={{
                selected: classes.selected,
              }}
            >
              {formatAmountForDisplay(5, "usd")}
            </ToggleButton>
            <ToggleButton
              value={10.0}
              aria-label="centered"
              className={classes.toggle}
              classes={{
                selected: classes.selected,
              }}
            >
              {formatAmountForDisplay(10, "usd")}
            </ToggleButton>
            <ToggleButton
              value={20.0}
              aria-label="right aligned"
              className={classes.toggle}
              classes={{
                selected: classes.selected,
              }}
            >
              {formatAmountForDisplay(20, "usd")}
            </ToggleButton>
            <ToggleButton
              value={50.0}
              aria-label="justified"
              className={classes.toggle}
              classes={{
                selected: classes.selected,
              }}
            >
              {formatAmountForDisplay(50, "usd")}
            </ToggleButton>
            <ToggleButton
              value={100.0}
              aria-label="justified"
              className={classes.toggle}
              classes={{
                selected: classes.selected,
              }}
            >
              {formatAmountForDisplay(100, "usd")}
            </ToggleButton>
          </ToggleButtonGroup>
          {loading ? (
            <CircularProgress
              color="secondary"
              disableShrink={true}
              className={classes.progress}
            />
          ) : (
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={loading}
              className={classes.button}
            >
              Donate {formatAmountForDisplay(monthly.amount, "usd")}/Month
            </Button>
          )}
        </form>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <form onSubmit={handleOneTimeDonation}>
          <label>
            Custom donation amount ({formatAmountForDisplay(1.0, "usd")}-
            {formatAmountForDisplay(1000.0, "usd")}):
          </label>
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
          {loading ? (
            <CircularProgress
              color="secondary"
              disableShrink={true}
              className={classes.progress}
            />
          ) : (
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={loading}
              className={classes.button}
            >
              Donate {formatAmountForDisplay(value, "usd")}
            </Button>
          )}
        </form>
      </TabPanel>
    </>
  );
};

export default DonateForm;
