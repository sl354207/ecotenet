import { authOptions } from "@pages/api/auth/[...nextauth]";
import { ajv } from "@schema/validation";
import { createFlag } from "@utils/mongodb/mongoHelpers";
import { validName } from "@utils/validationHelpers";
import { getServerSession } from "next-auth/next";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // console.log(session);
  if (session) {
    if (req.method !== "POST") {
      return res.status(405).json({ msg: "Method not allowed" });
    }
    const data = req.body;

    const validate = ajv.getSchema("flag");
    const valid = validate(data);
    if (valid) {
      if (
        session.user.name &&
        session.user.name === data.name &&
        validName(data.flagged)
      ) {
        try {
          data.status = "pending";
          data.date = new Date().toUTCString();
          const createdFlag = await createFlag(data);

          return res.status(200).json(createdFlag);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        res.status(401).json({ msg: "Unauthorized" });
      }
    } else {
      // console.log(validate.errors);
      res.status(403).json({ msg: "Forbidden" });
    }
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
