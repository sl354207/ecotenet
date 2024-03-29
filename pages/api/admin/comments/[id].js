import { deleteComment, updateComment } from "@utils/mongodb/mongoHelpers";
import { validID } from "@utils/validationHelpers";

export default async function handler(req, res) {
  const method = req.method;

  switch (method) {
    case "PUT":
      const { id, ...data } = req.body;

      if (
        validID(id) &&
        (data.approved === "true" || data.approved === "false")
      ) {
        try {
          const updatedComment = await updateComment(id, data);
          return res.status(200).json(updatedComment);
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        res.status(403).json({ msg: "Forbidden" });
      }

      break;

    case "DELETE":
      // set id based on request body
      const deleteId = req.body.id;
      if (validID(deleteId)) {
        try {
          const deleted = await deleteComment(deleteId);
          return res.status(200).json(deleted);
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
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
}
