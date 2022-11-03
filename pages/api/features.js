import { getFeatures } from "@utils/mongodb/helpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  try {
    const results = await getFeatures();

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
