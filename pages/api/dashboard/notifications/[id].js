import { authOptions } from "@pages/api/auth/[...nextauth]";
import { checkPerson, updateNotification } from "@utils/mongodb/mongoHelpers";
import { validID, validName } from "@utils/validationHelpers";
import { getServerSession } from "next-auth/next";

// api endpoint to get all posts by user from database
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // console.log(session);
  if (session) {
    if (req.method !== "PUT") {
      return res.status(405).json({ msg: "Method not allowed" });
    }
    const { name, id, viewed } = req.body;

    if (validID(id) && viewed === true) {
      if (session.user.name && session.user.name === name) {
        try {
          const updatedNotification = await updateNotification(id, viewed);
          return res.status(200).json(updatedNotification);
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      } else if (!session.user.name && validName(name)) {
        const person = await checkPerson(name);

        if (person && person.email === session.user.email) {
          try {
            const updatedNotification = await updateNotification(id, viewed);
            return res.status(200).json(updatedNotification);
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
    // console.log(name);
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
