import { deleteComment, updateComment } from "@utils/mongodb/mongoHelpers";

import { ajv } from "@schema/validation";

export default async function handler(req, res) {
  const method = req.method;
  switch (method) {
    case "PUT":
      const { id, ...data } = req.body;
      const validate = ajv.getSchema("comment");
      const valid = validate(data);
      if (typeof id == "string" && id.length == 24 && valid) {
        try {
          const updatedComment = await updateComment(id, data);
          return res.status(200).json(updatedComment);
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        res.status(403);
      }

      break;

    case "DELETE":
      // set id based on request body
      const deleteId = req.body.id;
      if (typeof deleteId == "string" && deleteId.length == 24) {
        try {
          const deleted = await deleteComment(deleteId);
          return res.status(200).json(deleted);
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        res.status(403);
      }

      // try delete request, if successful return response, otherwise return error message

      break;

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
