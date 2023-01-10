import { checkPerson, getPostVotes } from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const id = req.query.id;
  const getName = req.query.name;
  if (typeof id == "string" && id.length == 24 && typeof getName == "string") {
    if (session) {
      if (session.user.name && session.user.name == getName) {
        try {
          const results = await getPostVotes(id);
          if (results.voters.includes(getName)) {
            // deny. Already voted
            results.voters = false;

            return res.status(200).json(results);
          } else {
            // accept
            results.voters = true;

            return res.status(200).json(results);
          }
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        const person = await checkPerson(getName);
        if (person && person.email == session.user.email) {
          try {
            const results = await getPostVotes(id);
            if (results.voters.includes(getName)) {
              // deny. Already voted
              results.voters = false;

              return res.status(200).json(results);
            } else {
              // accept
              results.voters = true;

              return res.status(200).json(results);
            }
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          res.status(401);
        }
      }
    } else {
      try {
        const results = await getPostVotes(id);
        // accept
        results.voters = true;

        return res.status(200).json(results);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }
    }
  } else {
    res.status(403);
  }
}
