import { autoSpecies } from "@utils/mongodb/mongoHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  // set id based on id of url query
  const query = req.query.q;

  // try get request, if successful return response, otherwise return error message
  try {
    const results = await autoSpecies(query);

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
