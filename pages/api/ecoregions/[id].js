import { getEcoregionById } from "@utils/mongodb/mongoHelpers";
import { validEco } from "@utils/validationHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const id = req.query.id;
  if (validEco(id)) {
    try {
      const results = await getEcoregionById(id);
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=604800, stale-while-revalidate=59"
      );

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
