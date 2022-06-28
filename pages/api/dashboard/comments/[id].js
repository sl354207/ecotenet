import { checkPerson, deleteComment, updateComment } from "@utils/mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session) {
    const method = req.method;
    switch (method) {
      case "PUT":
        const { id, name, ...data } = req.body;

        if (session.user.name && session.user.name == name) {
          try {
            const updatedComment = await updateComment(id, data);
            return res.status(200).json(updatedComment);
          } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Something went wrong." });
          }
        } else if (!session.user.name) {
          const person = await checkPerson(name);

          if (person && person.email == session.user.email) {
            // try get request, if successful return response, otherwise return error message
            try {
              const updatedComment = await updateComment(id, data);
              return res.status(200).json(updatedComment);
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

        break;
      case "DELETE":
        const deleteId = req.body.id;
        const deleteName = req.body.name;

        // try delete request, if successful return response, otherwise return error message

        // console.log(req.body);
        if (session.user.name && session.user.name == deleteName) {
          try {
            const deleted = await deleteComment(deleteId);
            return res.status(200).json(deleted);
          } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Something went wrong." });
          }
        } else if (!session.user.name) {
          const person = await checkPerson(deleteName);

          if (person && person.email == session.user.email) {
            // try get request, if successful return response, otherwise return error message
            try {
              const deleted = await deleteComment(deleteId);
              return res.status(200).json(deleted);
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

        break;

      default:
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}