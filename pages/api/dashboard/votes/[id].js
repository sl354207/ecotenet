import { authOptions } from "@pages/api/auth/[...nextauth]";
import { ajv } from "@schema/validation";
import {
  checkPerson,
  getPostVotes,
  updateVote,
} from "@utils/mongodb/mongoHelpers";
import { getServerSession } from "next-auth/next";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // console.log(session);
  if (session) {
    if (req.method !== "PUT") {
      return res.status(405).json({ msg: "Method not allowed" });
    }
    const data = req.body;
    const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;
    const validate = ajv.getSchema("vote");
    const valid = validate(data);
    if (valid) {
      if (session.user.name && session.user.name === data.name) {
        let voterNames;
        try {
          voterNames = await getPostVotes(data._id);
        } catch (error) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }

        if (voterNames.voters.includes(data.name)) {
          res.status(406).json({ msg: "You have already voted on this post." });
        } else {
          if (data.vote === "add") {
            data.vote = 1;
            try {
              const response = await updateVote(data);

              return res.status(200).json(response);
            } catch (error) {
              console.error(err);

              res.status(500).json({ msg: "Something went wrong." });
            }
          } else {
            data.vote = -1;
            try {
              const response = await updateVote(data);

              return res.status(200).json(response);
            } catch (error) {
              console.error(err);

              res.status(500).json({ msg: "Something went wrong." });
            }
          }
        }
      } else if (
        !session.user.name &&
        typeof data.name === "string" &&
        data.name.length <= 60 &&
        !regex.test(data.name)
      ) {
        const person = await checkPerson(data.name);
        if (person && person.email === session.user.email) {
          let voterNames;
          try {
            voterNames = await getPostVotes(data._id);
          } catch (error) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
          if (voterNames.voters.includes(data.name)) {
            res
              .status(406)
              .json({ msg: "You have already voted on this post." });
          } else {
            if (data.vote === "add") {
              data.vote = 1;
              try {
                const response = await updateVote(data);

                return res.status(200).json(response);
              } catch (error) {
                console.error(err);

                res.status(500).json({ msg: "Something went wrong." });
              }
            } else {
              data.vote = -1;
              try {
                const response = await updateVote(data);

                return res.status(200).json(response);
              } catch (error) {
                console.error(err);

                res.status(500).json({ msg: "Something went wrong." });
              }
            }
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
