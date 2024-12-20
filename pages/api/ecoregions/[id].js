import {
  getDsmwById,
  getEcoregionById,
  getFeowById,
} from "@utils/mongodb/mongoHelpers";
import { validEco } from "@utils/validationHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const id = req.query.id;
  const layer = req.query.layer;
  if (validEco(id)) {
    switch (layer) {
      case "ecoregions":
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

        break;
      case "feow":
        try {
          const results = await getFeowById(id);
          res.setHeader(
            "Cache-Control",
            "public, s-maxage=604800, stale-while-revalidate=59"
          );
          // console.log(results);
          return res.status(200).json(results);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
        break;
      case "dsmw":
        try {
          const results = await getDsmwById(id);
          res.setHeader(
            "Cache-Control",
            "public, s-maxage=604800, stale-while-revalidate=59"
          );

          return res.status(200).json(results);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
        break;

      default:
        res.status(400).json({ msg: "Bad request" });
        break;
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
  // console.log(id);
}
