import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2023-10-16",
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  const id = req.query.id;

  try {
    if (!id.startsWith("cs_")) {
      throw Error("Incorrect CheckoutSession ID.");
    }
    const checkout_session = await stripe.checkout.sessions.retrieve(id);
    const { status, payment_intent, subscription } = checkout_session;

    return res.status(200).json({
      status: status,
      payment_intent: payment_intent,
      subscription: subscription,
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";

    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
}
