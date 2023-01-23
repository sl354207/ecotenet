import { ajv } from "@schema/validation";
import {
  checkPerson,
  createComment,
  getDashboardComments,
} from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session) {
    const method = req.method;
    switch (method) {
      case "GET":
        const getName = req.query.name;
        if (typeof getName == "string") {
          if (session.user.name && session.user.name == getName) {
            try {
              const comments = await getDashboardComments(getName);

              return res.status(200).json(comments);
            } catch (err) {
              console.error(err);

              res.status(500).json({ msg: "Something went wrong." });
            }
          } else if (!session.user.name) {
            const person = await checkPerson(getName);

            if (person && person.email == session.user.email) {
              // try get request, if successful return response, otherwise return error message
              try {
                const comments = await getDashboardComments(getName);

                return res.status(200).json(comments);
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

        break;
      case "POST":
        const data = req.body;
        const validate = ajv.getSchema("comment");
        const valid = validate(data);
        if (valid) {
          if (session.user.name && session.user.name == data.name) {
            try {
              data.date = new Date().toUTCString();
              data.approved = "pending";
              data.updated = false;
              const createdComment = await createComment(data);

              return res.status(200).json(createdComment);
            } catch (err) {
              console.error(err);

              res.status(500).json({ msg: "Something went wrong." });
            }
          } else if (!session.user.name) {
            const person = await checkPerson(data.name);

            if (person && person.email == session.user.email) {
              // try get request, if successful return response, otherwise return error message
              try {
                data.date = new Date().toUTCString();
                data.approved = "pending";
                data.updated = false;
                const createdComment = await createComment(data);

                return res.status(200).json(createdComment);
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
        // console.log(req.body);

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
