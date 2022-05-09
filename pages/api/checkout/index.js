import Stripe from "stripe";
import { formatAmountForStripe } from "../../../utils/stripe/stripe-helpers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// console.log(stripe);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const amount = req.body.amount;
    try {
      // Validate the amount that was passed from the client.
      if (!(amount >= 1.0 && amount <= 1000.0)) {
        throw new Error("Invalid amount.");
      }
      // Create Checkout Sessions from body params.
      const params = {
        submit_type: "donate",
        payment_method_types: ["card"],
        line_items: [
          {
            name: "Donation",
            amount: formatAmountForStripe(amount, "usd"),
            currency: "usd",
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/approved?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/donate`,
      };
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
