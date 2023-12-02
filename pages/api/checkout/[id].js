import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  const id = req.query.id;
  // let checkoutError = false;
  // let checkoutResult;
  try {
    if (!id.startsWith("cs_")) {
      throw Error("Incorrect CheckoutSession ID.");
    }
    const checkout_session = await stripe.checkout.sessions.retrieve(id);
    // console.log(checkout_session);
    // checkoutResult = checkout_session;

    res.status(200).json(checkout_session);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    // checkoutError = true;
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
  // if (!checkoutError && checkoutResult.status === "complete") {
  //   const { mode, amount_total } = checkoutResult;
  //   const amount = amount_total / 100;
  //   if (mode === "payment") {
  //     try {
  //       await updateDonations({ one_time: amount });
  //       console.log(`one_time: ${amount}`);
  //     } catch (err) {
  //       // Handle any specific error from updateDonations()
  //       console.error(err);
  //     }
  //   }

  //   if (mode === "subscription") {
  //     try {
  //       await updateDonations({ monthly: amount });
  //       console.log(`monthly: ${amount}`);
  //     } catch (err) {
  //       // Handle any specific error from updateDonations()
  //       console.error(err);
  //     }
  //   }
  // }
}
