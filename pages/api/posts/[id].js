import { getApprovedPostById } from "@utils/mongodb/helpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const id = req.query.id;
  // console.log(id);

  try {
    const results = await getApprovedPostById(id);

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
