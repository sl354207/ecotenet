import { getEcoregionById } from "@utils/mongodb/mongoHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const id = req.query.id;
  if (typeof id == "string" && id.length >= 1 && id.length <= 4) {
    try {
      const results = await getEcoregionById(id);

      return res.status(200).json(results);
    } catch (err) {
      console.error(err);

      res.status(500).json({ msg: "Something went wrong." });
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
  // console.log(id);
}
