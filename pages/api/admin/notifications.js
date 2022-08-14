import { createNotification } from "@utils/mongodb/helpers";

// api endpoint to post a comment to the database
export default async function handler(req, res) {
  // body must be in same format as database query
  const { name, reason, text, add_info, ref, date, viewed } = req.body;

  // only allow post method
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  // try post request, if successful return response, otherwise return error message.
  try {
    const createdNotification = await createNotification(
      name,
      reason,
      text,
      add_info,
      ref,
      date,
      viewed
    );

    return res.status(200).json(createdNotification);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
