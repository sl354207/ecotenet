import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  const id = req.query.id;
  // let getDonationsError = false;
  try {
    if (!id.startsWith("cs_")) {
      throw Error("Incorrect CheckoutSession ID.");
    }
    const checkout_session = await stripe.checkout.sessions.retrieve(id);

    res.status(200).json(checkout_session);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    // getDonationsError = true;
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
  // if (!getDonationsError) {
  //   try {
  //     const amount = 10;
  //     await updateDonations();
  //   } catch (err) {
  //     // Handle any specific error from updateDonations()
  //     console.error(err);
  //   }
  // }
}
