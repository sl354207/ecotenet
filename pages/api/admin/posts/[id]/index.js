import { ajv } from "@schema/validation";
import {
  deletePost,
  getPostById,
  updatePost,
} from "@utils/mongodb/mongoHelpers";

export default async function handler(req, res) {
  const method = req.method;
  // set id based on id of url query

  switch (method) {
    case "GET":
      const id = req.query.id;
      if (typeof id === "string" && id.length === 24) {
        try {
          const post = await getPostById(id);

          return res.status(200).json(post);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        res.status(403).json({ msg: "Forbidden" });
      }

      break;
    case "PUT":
      const { _id, ...data } = req.body;
      // console.log(req);
      const validate = ajv.getSchema("post");
      const valid = validate(data);
      if (typeof _id === "string" && _id.length === 24 && valid) {
        try {
          const update = await updatePost(_id, data);

          // console.log(update);
          return res.status(200).json(update);
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        res.status(403).json({ msg: "Forbidden" });
      }

      break;

    case "DELETE":
      const deleteId = req.body._id;
      if (typeof deleteId === "string" && deleteId.length === 24) {
        try {
          const deleted = await deletePost(deleteId);
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
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
