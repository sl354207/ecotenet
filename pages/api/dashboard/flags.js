import { checkPerson, createFlag } from "@utils/mongodb/helpers";
import { getSession } from "next-auth/react";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  const session = await getSession({ req });

  // console.log(session);
  if (session) {
    if (req.method !== "POST") {
      return res.status(405).json({ msg: "Method not allowed" });
    }
    const { name, flagged, type, text, content_id, ref, status, date } =
      req.body;

    if (session.user.name && session.user.name == name) {
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
    } else if (!session.user.name) {
      const person = await checkPerson(name);
      if (person && person.email == session.user.email) {
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
      } else {
        res.status(401);
      }
    } else {
      res.status(401);
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
