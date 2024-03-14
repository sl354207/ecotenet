import { getLatestEcoPosts, getLatestPosts } from "@utils/mongodb/mongoHelpers";
import { validEco } from "@utils/validationHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const page = req.query.page;
  const ecoregion = req.query.id;

  const pageSize = 10;

  if (ecoregion !== "undefined") {
    if (validEco(ecoregion)) {
      try {
        const results = await getLatestEcoPosts(ecoregion, page, pageSize);

        return res.status(200).json(results[0].data);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }
    } else {
      return res.status(403).json({ msg: "Forbidden" });
    }
  } else {
    try {
      const results = await getLatestPosts(page, pageSize);

      return res.status(200).json(results[0].data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ msg: "Something went wrong." });
    }
  }
}
