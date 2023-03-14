import { authOptions } from "@pages/api/auth/[...nextauth]";
import { generateUploadURL } from "@utils/aws";
import { checkPerson } from "@utils/mongodb/mongoHelpers";
import { getServerSession } from "next-auth/next";

// api endpoint to get image from aws s3 bucket
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    if (req.method !== "GET") {
      return res.status(405).json({ msg: "Method not allowed" });
    }

    const name = req.query.name;
    const postId = req.query.post_id;
    const ext = req.query.ext;

    const allowedExtensions = [
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpg",
      "image/jpeg",
      "image/jfif",
      "image/pjpeg",
      "image/pjp",
      "image/png",
      "image/svg",
      "image/webp",
    ];
    if (
      typeof name === "string" &&
      name.length <= 100 &&
      typeof postId === "string" &&
      postId.length === 24 &&
      allowedExtensions.includes(ext.toLowerCase())
    ) {
      if (session.user.name && session.user.name === name) {
        try {
          const url = await generateUploadURL(name, postId, ext);
          // console.log(res.json(url));
          return res.status(200).json(url.substring(1, url.length - 1));
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else if (!session.user.name) {
        const person = await checkPerson(name);

        if (person && person.email === session.user.email) {
          // try get request, if successful return response, otherwise return error message
          try {
            const url = await generateUploadURL(name, postId, ext);
            // console.log(res.json(url));
            return res.status(200).json(url.substring(1, url.length - 1));
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          res.status(401).json({ msg: "Unauthorized" });
        }
      } else {
        res.status(401).json({ msg: "Unauthorized" });
      }
    } else {
      res.status(403).json({ msg: "Forbidden" });
    }
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
