import { getPostById } from "../../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405);
  }

  // set id based on id of url query
  const _id = req.query._id;
  // console.log(_id);

  // try get request, if successful return response, otherwise return error message
  try {
    const draft = await getPostById(_id);

    return res.status(200).json(draft);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
