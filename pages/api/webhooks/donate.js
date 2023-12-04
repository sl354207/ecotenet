import { updateDonations } from "@utils/mongodb/mongoHelpers";
import { buffer } from "micro";
import Cors from "micro-cors";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const webhookHandler = async (req, res) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err) {
      console.log(` Error message: ${err}`);
      res.status(400).send(`Webhook Error: ${err}`);
      return;
    }

    // Cast event data to Stripe object.
    if (event.type === "checkout.session.completed") {
      const checkoutSessionCompleted = event.data.object;

      const { mode, amount_total } = checkoutSessionCompleted;
      const amount = amount_total / 100;

      if (mode === "payment") {
        try {
          await updateDonations({ one_time: amount });
        } catch (err) {
          // Handle any specific error from updateDonations()
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      }

      if (mode === "subscription") {
        try {
          await updateDonations({ monthly: amount });
        } catch (err) {
          // Handle any specific error from updateDonations()
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      }
    } else {
      console.warn(`Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default cors(webhookHandler);
