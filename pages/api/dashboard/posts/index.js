import { authOptions } from "@pages/api/auth/[...nextauth]";
import { ajv } from "@schema/validation";
import { createPost, getDashboardPosts } from "@utils/mongodb/mongoHelpers";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    const method = req.method;

    switch (method) {
      case "GET":
        const getName = req.query.name;
        const getStatus = req.query.status;
        // console.log(req.body);
        // try get request, if successful return response, otherwise return error message
        if (getStatus === "published" || getStatus === "draft") {
          if (session.user.name && session.user.name === getName) {
            try {
              const posts = await getDashboardPosts(getName, getStatus);

              return res.status(200).json(posts);
            } catch (err) {
              console.error(err);

              res.status(500).json({ msg: "Something went wrong." });
            }
          } else {
            res.status(401).json({ msg: "Unauthorized" });
          }
        } else {
          res.status(403).json({ msg: "Forbidden" });
        }

        break;
      case "POST":
        const data = req.body;
        const validate = ajv.getSchema("post");
        const valid = validate(data);
        if (valid) {
          if (session.user.name && session.user.name === data.name) {
            try {
              data.updated = false;
              data.featured = false;
              data.feature = "false";
              data.date = new Date();
              data.approved = "pending";
              const createdPost = await createPost(data);

              return res.status(200).json(createdPost);
            } catch (err) {
              console.error(err);

              res.status(500).json({ msg: "Something went wrong." });
            }
          } else {
            res.status(401).json({ msg: "Unauthorized" });
          }
        } else {
          // console.log(validate.errors);
          res.status(403).json({ msg: "Forbidden" });
        }

        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
