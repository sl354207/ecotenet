import { checkPerson, createPost, getDashboardPosts } from "@utils/mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session) {
    const method = req.method;
    switch (method) {
      case "GET":
        const getName = req.query.name;
        const getStatus = req.query.status;
        // console.log(req.body);
        // try get request, if successful return response, otherwise return error message

        if (session.user.name && session.user.name == getName) {
          try {
            const posts = await getDashboardPosts(getName, getStatus);

            return res.status(200).json(posts);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else if (!session.user.name) {
          const person = await checkPerson(getName);

          if (person && person.email == session.user.email) {
            // try get request, if successful return response, otherwise return error message
            try {
              const posts = await getDashboardPosts(getName, getStatus);

              return res.status(200).json(posts);
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

        break;
      case "POST":
        const {
          title,
          name,
          description,
          category,
          tags,
          ecoregions,
          id,
          version,
          rows,
          count,
          status,
          approved,
          updated,
          featured,
          date,
          feature,
        } = req.body;
        // console.log(req.body);
        if (session.user.name && session.user.name == name) {
          try {
            const createdPost = await createPost(
              title,
              name,
              description,
              category,
              tags,
              ecoregions,
              id,
              version,
              rows,
              status,
              approved,
              updated,
              featured,
              date,
              feature
            );

            return res.status(200).json(createdPost);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else if (!session.user.name) {
          const person = await checkPerson(name);

          if (person && person.email == session.user.email) {
            // try get request, if successful return response, otherwise return error message
            try {
              const createdPost = await createPost(
                title,
                name,
                description,
                category,
                tags,
                ecoregions,
                id,
                version,
                rows,
                status,
                approved,
                updated,
                featured,
                date,
                feature
              );

              return res.status(200).json(createdPost);
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

        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
