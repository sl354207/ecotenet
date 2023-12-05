import { formatAmountForStripe } from "@utils/stripe/stripeHelpers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const amount = req.body.amount;
    const subscription = req.body.sub;
    try {
      // Validate the amount that was passed from the client.
      if (!(amount >= 1.0 && amount <= 10000.0)) {
        throw new Error("Invalid amount.");
      }
      let params;
      let priceID;
      if (subscription) {
        switch (amount) {
          case 2:
            priceID = process.env.STRIPE_2;

            break;
          case 5:
            priceID = process.env.STRIPE_5;

            break;
          case 10:
            priceID = process.env.STRIPE_10;

            break;
          case 20:
            priceID = process.env.STRIPE_20;

            break;
          case 50:
            priceID = process.env.STRIPE_50;

            break;
          case 100:
            priceID = process.env.STRIPE_100;

            break;

          default:
            break;
        }
        // Create Checkout Sessions from body params.

        params = {
          mode: "subscription",
          // payment_method_types: ["card"],
          line_items: [
            {
              price: priceID,
              // For metered billing, do not pass quantity
              quantity: 1,
            },
          ],
          success_url: `${req.headers.origin}/approved?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/donate`,
        };
      } else {
        // Create Checkout Sessions from body params.
        params = {
          submit_type: "donate",
          mode: "payment",
          // payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: formatAmountForStripe(amount, "usd"),
                product_data: {
                  name: "Donation",
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${req.headers.origin}/approved?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/donate`,
        };
      }

      const checkoutSession = await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
