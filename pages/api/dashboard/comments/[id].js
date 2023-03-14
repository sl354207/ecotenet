import { authOptions } from "@pages/api/auth/[...nextauth]";
import {
  checkPerson,
  deleteComment,
  updateComment,
} from "@utils/mongodb/mongoHelpers";
import { getServerSession } from "next-auth/next";

import { ajv } from "@schema/validation";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  // console.log(session);
  if (session) {
    const method = req.method;
    const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;
    switch (method) {
      case "PUT":
        const { id, ...data } = req.body;
        const validate = ajv.getSchema("comment");
        const valid = validate(data);
        if (typeof id === "string" && id.length === 24 && valid) {
          if (session.user.name && session.user.name === data.name) {
            try {
              data.date = new Date().toUTCString();
              data.approved = "pending";
              data.updated = true;
              const updatedComment = await updateComment(id, data);
              return res.status(200).json(updatedComment);
            } catch (err) {
              console.error(err);
              // console.log(err);
              res.status(500).json({ msg: "Something went wrong." });
            }
          } else if (!session.user.name && !regex.test(data.name)) {
            const person = await checkPerson(data.name);

            if (person && person.email === session.user.email) {
              // try get request, if successful return response, otherwise return error message
              try {
                data.date = new Date().toUTCString();
                data.approved = "pending";
                data.updated = true;
                const updatedComment = await updateComment(id, data);
                return res.status(200).json(updatedComment);
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
          // console.log(validate.errors);
          res.status(403).json({ msg: "Forbidden" });
        }

        break;
      case "DELETE":
        const deleteId = req.body.id;
        const deleteName = req.body.name;

        // try delete request, if successful return response, otherwise return error message

        // console.log(req.body);
        if (typeof deleteId === "string" && deleteId.length === 24) {
          if (session.user.name && session.user.name === deleteName) {
            try {
              const deleted = await deleteComment(deleteId);
              return res.status(200).json(deleted);
            } catch (err) {
              console.error(err);
              res.status(500).json({ msg: "Something went wrong." });
            }
          } else if (
            !session.user.name &&
            typeof deleteName === "string" &&
            deleteName.length <= 60 &&
            !regex.test(deleteName)
          ) {
            const person = await checkPerson(deleteName);

            if (person && person.email === session.user.email) {
              // try get request, if successful return response, otherwise return error message
              try {
                const deleted = await deleteComment(deleteId);
                return res.status(200).json(deleted);
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

        break;

      default:
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
