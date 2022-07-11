import { generateUploadURL } from "@utils/aws";
import { checkPerson } from "@utils/mongodb";
import { getSession } from "next-auth/react";

// api endpoint to get image from aws s3 bucket
export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session) {
    const name = req.query.name;
    const postId = req.query.post_id;
    const type = req.query.type;

    if (session.user.name && session.user.name == name) {
      try {
        const url = await generateUploadURL(name, postId, type);
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
          const url = await generateUploadURL(name, postId, type);
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
    // Not Signed in
    res.status(401);
  }
  res.end();
}
