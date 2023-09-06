import {
  getAllStatSpecies,
  getDistinctCategory,
  getFilteredStats,
} from "@utils/mongodb/mongoHelpers";
import { validStatInputs } from "@utils/validationHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const v1 = req.query.v1;
  const v2 = req.query.v2;
  if (validStatInputs(v1, v2)) {
    if (v2 === "undefined") {
      if (v1 === "all species") {
        try {
          const results = await getAllStatSpecies(v1);
          return res.status(200).json(results);
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        try {
          const results = await getDistinctCategory(v1);
          return res.status(200).json(results);
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      }
    } else {
      try {
        const results = await getFilteredStats(v1, v2);

        return res.status(200).json(results);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
}
