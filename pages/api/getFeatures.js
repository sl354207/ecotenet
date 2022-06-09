import { getFeatureCandidates } from "@utils/mongodb";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405);
  }
  // const k = req.query;

  // if (Object.keys(k).length) {
  //   console.log(Object.keys(k));
  // } else {
  //   console.log("no");
  // }

  // try get request, if successful return response, otherwise return error message
  try {
    const features = await getFeatureCandidates();

    return res.status(200).json(features);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
