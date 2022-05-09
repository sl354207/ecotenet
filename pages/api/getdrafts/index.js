import { getDraftsByUser } from "@utils/mongodb";

// api endpoint to get all drafts by user from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405);
  }
  // try get request, if successful return response, otherwise return error message
  try {
    const drafts = await getDraftsByUser();

    return res.status(200).json(drafts);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
