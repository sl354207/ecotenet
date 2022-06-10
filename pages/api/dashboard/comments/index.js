import {
  checkPerson,
  createComment,
  getDashboardComments,
} from "@utils/mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session) {
    const method = req.method;
    switch (method) {
      case "GET":
        const getName = req.query.name;

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

        break;
      case "POST":
        const { name, post_id, comment_ref, date, text, approved, updated } =
          req.body;
        // console.log(req.body);
        if (session.user.name && session.user.name == name) {
          try {
            const createdComment = await createComment(
              name,
              post_id,
              comment_ref,
              date,
              text,
              approved,
              updated
            );

            return res.status(200).json(createdComment);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else if (!session.user.name) {
          const person = await checkPerson(name);

          if (person && person.email == session.user.email) {
            // try get request, if successful return response, otherwise return error message
            try {
              const createdComment = await createComment(
                name,
                post_id,
                comment_ref,
                date,
                text,
                approved,
                updated
              );

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
