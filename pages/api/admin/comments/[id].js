import { deleteComment, updateComment } from "@utils/mongodb";

export default async function handler(req, res) {
  const method = req.method;
  switch (method) {
    case "PUT":
      const { _id, ...data } = req.body;
      try {
        const updatedComment = await updateComment(_id, data);
        return res.status(200).json(updatedComment);
      } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Something went wrong." });
      }

      break;

    case "DELETE":
      // set id based on request body
      const id = req.body;

      // try delete request, if successful return response, otherwise return error message
      try {
        const deleted = await deleteComment(id);
        return res.status(200).json(deleted);
      } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Something went wrong." });
      }

      break;

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
