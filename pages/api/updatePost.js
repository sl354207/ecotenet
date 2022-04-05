import { updatePost } from "../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  // body must be in same format as database query
  const {
    title,
    name,
    description,
    category,
    tags,
    ecoregions,
    _id,
    id,
    version,
    rows,
    status,
    approved,
    updated,
    featured,
  } = req.body;

  try {
    const update = await updatePost(
      title,
      name,
      description,
      category,
      tags,
      ecoregions,
      _id,
      id,
      version,
      rows,
      status,
      approved,
      updated,
      featured
    );
    return res.status(200).json(update);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
