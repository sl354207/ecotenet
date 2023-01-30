import { authOptions } from "@pages/api/auth/[...nextauth]";
import { checkName } from "@utils/mongodb/mongoHelpers";
import { getServerSession } from "next-auth/next";

// api endpoint to get image from aws s3 bucket
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
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
