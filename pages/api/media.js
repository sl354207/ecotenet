import { generateUploadURL } from "@utils/aws";

// api endpoint to get image from aws s3 bucket
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405);
  }

  // try get request, if successful return response, otherwise return error message
  try {
    const url = await generateUploadURL();
    // await console.log(res.json(url))
    return res.status(200).json(url);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
