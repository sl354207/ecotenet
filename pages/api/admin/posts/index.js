import { getFeatureCandidates, getPosts } from "@utils/mongodb/mongoHelpers";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405);
  }

  let post;

  if (Object.keys(req.query).length) {
    post = "post";
  } else {
    post = "feature";
  }
  //   console.log(query)

  switch (post) {
    case "post":
      const status = req.query.q1;
      const approved = req.query.q2;

      if (
        typeof status == "string" &&
        (status == "published" || status == "draft") &&
        typeof approved == "string" &&
        (approved == "true" || approved == "false" || approved == "pending")
      ) {
        try {
          const posts = await getPosts(status, approved);

          return res.status(200).json(posts);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        res.status(403);
      }

      // try get request, if successful return response, otherwise return error message

      break;
    case "feature":
      try {
        const features = await getFeatureCandidates();

        return res.status(200).json(features);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }

      break;

    default:
      break;
  }
}
