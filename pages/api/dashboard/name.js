import { checkName } from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";

// api endpoint to get image from aws s3 bucket
export default async function handler(req, res) {
  const session = await getSession({ req });
  // only allow get request
  if (session) {
    if (req.method !== "GET") {
      return res.status(405);
    }

    const name = req.query.name;
    if (typeof name == "string") {
      try {
        const nameResponse = await checkName(name);

        return res.status(200).json(nameResponse);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }
    } else {
      res.status(403);
    }
  }
}
