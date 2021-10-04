import { updatePost } from "../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  // body must be in same format as database query
  const {
    title,
    author,
    description,
    category,
    tags,
    ecoregions,
    _id,
    id,
    version,
    rows,
  } = req.body;

  try {
    const updated = await updatePost(
      title,
      author,
      description,
      category,
      tags,
      ecoregions,
      _id,
      id,
      version,
      rows
    );
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
