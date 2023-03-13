import {
  searchAllPosts,
  searchAllSpecies,
  searchEcoPosts,
  searchEcoSpecies,
} from "@utils/mongodb/mongoHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const query = req.query.q;
  const filter = req.query.filter;
  const eco = req.query.eco;
  if (
    typeof query == "string" &&
    query.length <= 100 &&
    typeof filter == "string" &&
    filter.length <= 100 &&
    typeof eco == "string" &&
    eco.length >= 1 &&
    eco.length <= 4
  ) {
    switch (filter) {
      case "allPosts":
        try {
          const results = await searchAllPosts(query);

          return res.status(200).json(results);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
        break;
      case "allSpecies":
        try {
          const results = await searchAllSpecies(query);

          return res.status(200).json(results);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
        break;
      case "ecoPosts":
        try {
          const results = await searchEcoPosts(query, eco);

          return res.status(200).json(results);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
        break;
      case "ecoSpecies":
        try {
          const results = await searchEcoSpecies(query, eco);

          return res.status(200).json(results);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
        break;
      default:
        res.status(403).json({ msg: "Forbidden" });
        break;
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
}
