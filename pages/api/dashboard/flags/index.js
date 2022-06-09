import { checkPerson, createFlag, getFlags } from "@utils/mongodb";
import { getSession } from "next-auth/react";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  const session = await getSession({ req });
  //   console.log(session);
  const { name, flagged, type, text, content_id, ref, status, date } = req.body;
  const method = req.method;
  // console.log(session);
  if (session) {
    switch (method) {
      case "POST":
        const person = await checkPerson(name);
        if (person.email == session.user.email) {
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

        break;
      case "GET":
        if (session.user.role == "admin") {
          try {
            const flags = await getFlags();

            return res.status(200).json(flags);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          res.status(401);
        }

        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
