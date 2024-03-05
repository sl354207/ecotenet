import { getAdminPending, getStats } from "@utils/mongodb/mongoHelpers";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  // try get request, if successful return response, otherwise return error message
  try {
    const stats = await getStats();

    const pending = await getAdminPending();

    const response = {
      stats: stats,
      pending: pending,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
