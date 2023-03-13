import { authOptions } from "@pages/api/auth/[...nextauth]";
import { checkPerson, getNotifications } from "@utils/mongodb/mongoHelpers";
import { getServerSession } from "next-auth/next";

// api endpoint to get all posts by user from database
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // console.log(session);
  if (session) {
    if (req.method !== "GET") {
      return res.status(405).json({ msg: "Method not allowed" });
    }
    const { name } = req.query;
    // console.log(name);
    if (typeof name == "string" && name.length <= 100) {
      if (session.user.name && session.user.name === name) {
        try {
          const notifications = await getNotifications(name);

          return res.status(200).json(notifications);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else if (!session.user.name) {
        const person = await checkPerson(name);

        if (person && person.email === session.user.email) {
          try {
            const notifications = await getNotifications(name);

            return res.status(200).json(notifications);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          res.status(401).json({ msg: "Unauthorized" });
        }
      } else {
        res.status(401).json({ msg: "Unauthorized" });
      }
    } else {
      res.status(403).json({ msg: "Forbidden" });
    }
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
