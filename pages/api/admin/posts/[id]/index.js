import { deletePost, getPostById, updatePost } from "@utils/mongodb";

export default async function handler(req, res) {
  const method = req.method;
  // set id based on id of url query
  const _id = req.query.id;
  switch (method) {
    case "GET":
      try {
        const post = await getPostById(_id);

        return res.status(200).json(post);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }

      break;
    case "PUT":
      const { ...data } = req.body;
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
      try {
        const deleted = await deletePost(_id);
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
