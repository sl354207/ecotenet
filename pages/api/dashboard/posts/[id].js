import {
  checkPerson,
  deletePost,
  getPostById,
  updatePost,
} from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session) {
    const method = req.method;
    switch (method) {
      case "GET":
        const getName = req.query.name;
        const id = req.query.id;
        // console.log(getName);
        if (session.user.name && session.user.name == getName) {
          // try get request, if successful return response, otherwise return error message
          try {
            const post = await getPostById(id);

            return res.status(200).json(post);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else if (!session.user.name) {
          const person = await checkPerson(getName);

          if (person && person.email == session.user.email) {
            // try get request, if successful return response, otherwise return error message
            try {
              const post = await getPostById(id);

              return res.status(200).json(post);
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
      case "PUT":
        const { _id, name, ...data } = req.body;
        // console.log(req.body);

        if (session.user.name && session.user.name == name) {
          try {
            const update = await updatePost(_id, data);

            // console.log(update);
            return res.status(200).json(update);
          } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Something went wrong." });
          }
        } else if (!session.user.name) {
          const person = await checkPerson(name);

          if (person && person.email == session.user.email) {
            // try get request, if successful return response, otherwise return error message
            try {
              const update = await updatePost(_id, data);

              // console.log(update);
              return res.status(200).json(update);
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
        const deleteId = req.body._id;
        const deleteName = req.body.name;

        // try delete request, if successful return response, otherwise return error message

        // console.log(req.body);
        if (session.user.name && session.user.name == deleteName) {
          try {
            const deleted = await deletePost(deleteId);
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
              const deleted = await deletePost(deleteId);
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
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
