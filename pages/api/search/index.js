import {
  searchAllPosts,
  searchAllSpecies,
  searchEcoPosts,
  searchEcoSpecies,
} from "@utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const query = req.query.q;
  const filter = req.query.filter;

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
        const results = await searchEcoPosts(query);

        return res.status(200).json(results);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }
      break;
    case "ecoSpecies":
      try {
        const results = await searchEcoSpecies(query);

        return res.status(200).json(results);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }
      break;
    default:
      //   res.setHeader('Allow', ['GET'])
      //   res.status(405).end(`Method ${method} Not Allowed`)
      break;
  }
}