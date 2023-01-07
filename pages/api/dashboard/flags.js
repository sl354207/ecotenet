import { ajv } from "@schema/validation";
import { checkPerson, createFlag } from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  const session = await getSession({ req });

  // console.log(session);
  if (session) {
    if (req.method !== "POST") {
      return res.status(405).json({ msg: "Method not allowed" });
    }
    const data = req.body;
    const validate = ajv.getSchema("flag");
    const valid = validate(data);
    if (valid) {
      if (session.user.name && session.user.name == data.name) {
        try {
          const createdFlag = await createFlag(data);

          return res.status(200).json(createdFlag);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else if (!session.user.name) {
        const person = await checkPerson(data.name);
        if (person && person.email == session.user.email) {
          try {
            const createdFlag = await createFlag(data);

            return res.status(200).json(createdFlag);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          res.status(401);
        }
      } else {
        res.status(401);
      }
    } else {
      res.status(403);
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
