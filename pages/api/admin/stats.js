import { getStats } from "@utils/mongodb";
import { getSession } from "next-auth/react";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  const session = await getSession({ req });
  // console.log(session);
  if (session && session.user.role == "admin") {
    if (req.method !== "GET") {
      return res.status(405).json({ msg: "Method not allowed" });
    }
    // try get request, if successful return response, otherwise return error message
    try {
      const stats = await getStats();

      return res.status(200).json(stats);
    } catch (err) {
      console.error(err);

      res.status(500).json({ msg: "Something went wrong." });
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
