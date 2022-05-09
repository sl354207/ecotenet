import { deleteComment } from "@utils/mongodb";

// api endpoint to delete a draft from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "DELETE") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  // set id based on request body
  const _id = req.body;

  // try delete request, if successful return response, otherwise return error message
  try {
    const deleted = await deleteComment(_id);
    return res.status(200).json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
