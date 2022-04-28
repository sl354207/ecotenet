import { createFlag } from "../../utils/mongodb";

// api endpoint to post a comment to the database
export default async function handler(req, res) {
  // body must be in same format as database query
  const { name, flagged, type, text, content_id, ref, status, date } = req.body;

  // only allow post method
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  // try post request, if successful return response, otherwise return error message.
  try {
    const createdFlag = await createFlag(
      name,
      flagged,
      type,
      text,
      content_id,
      ref,
      status,
      date
    );

    return res.status(200).json(createdFlag);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
