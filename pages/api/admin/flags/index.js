import { getFlags } from "@utils/mongodb";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  try {
    const flags = await getFlags();

    return res.status(200).json(flags);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
