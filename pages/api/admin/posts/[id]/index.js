import { deletePost, getPostById, updatePost } from "@utils/mongodb";

export default async function handler(req, res) {
  const method = req.method;
  // set id based on id of url query
  const id = req.query.id;
  switch (method) {
    case "GET":
      try {
        const post = await getPostById(id);

        return res.status(200).json(post);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }

      break;
    case "PUT":
      const { _id, ...data } = req.body;
      // console.log(req);

      try {
        const update = await updatePost(_id, data);

        // console.log(update);
        return res.status(200).json(update);
      } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Something went wrong." });
      }
      break;

    case "DELETE":
      const deleteId = req.body._id;
      try {
        const deleted = await deletePost(deleteId);
        return res.status(200).json(deleted);
      } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Something went wrong." });
      }

      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
