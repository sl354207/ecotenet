import { getEcoregions, getFeowEcoregions } from "@utils/mongodb/mongoHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  const layer = req.query.layer;

  switch (layer) {
    case "ecoregions":
      try {
        const results = await getEcoregions();
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
        const results = await getFeowEcoregions();
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
    // case "dsmw":
    //   try {
    //     // UPDATE
    //     const results = await getEcoregions();
    //     res.setHeader(
    //       "Cache-Control",
    //       "public, s-maxage=604800, stale-while-revalidate=59"
    //     );

    //     return res.status(200).json(results);
    //   } catch (err) {
    //     console.error(err);

    //     res.status(500).json({ msg: "Something went wrong." });
    //   }
    //   break;

    default:
      res.status(400).json({ msg: "Bad request" });
      break;
  }
}
