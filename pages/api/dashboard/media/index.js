import { authOptions } from "@pages/api/auth/[...nextauth]";
import { generateUploadURL } from "@utils/aws";
import { getServerSession } from "next-auth/next";

// api endpoint to get image from aws s3 bucket
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    if (req.method !== "GET") {
      return res.status(405);
    }
    // console.log(req);
    const name = req.query.name;
    const postId = req.query.post_id;
    const ext = req.query.ext;
    if (
      typeof name == "string" &&
      typeof postId == "string" &&
      postId.length == 24 &&
      typeof ext == "string" &&
      (ext == "jpg" || ext == "jpeg" || ext == "png")
    ) {
      if (session.user.name && session.user.name == name) {
        try {
          const url = await generateUploadURL(name, postId, ext);
          // await console.log(res.json(url))
          return res.status(200).json(url);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else if (!session.user.name) {
        const person = await checkPerson(name);

        if (person && person.email == session.user.email) {
          // try get request, if successful return response, otherwise return error message
          try {
            const url = await generateUploadURL(name, postId, ext);
            // await console.log(res.json(url))
            return res.status(200).json(url);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          res.status(401);
        }
      } else {
        res.status(401);
      }
    } else {
      res.status(403);
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
