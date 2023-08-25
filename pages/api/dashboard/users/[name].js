import { authOptions } from "@pages/api/auth/[...nextauth]";
import { ajv } from "@schema/validation";
import {
  deletePerson,
  getPersonDash,
  updatePerson,
} from "@utils/mongodb/mongoHelpers";
import { validName, validURL } from "@utils/validationHelpers";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  // console.log(session);
  if (session) {
    const method = req.method;

    switch (method) {
      case "GET":
        const getName = req.query.name;

        if (session.user.name && session.user.name === getName) {
          // try get request, if successful return response, otherwise return error message
          try {
            const person = await getPersonDash(getName);

            return res.status(200).json(person);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          res.status(401).json({ msg: "Unauthorized" });
        }

        break;
      case "PUT":
        const { email, name, ...data } = req.body;

        const validate = ajv.getSchema("person");
        const valid = validate(req.body);

        let validSocials = true;

        if (data.socials && data.socials.length > 0) {
          let i = 0;
          while (i < data.socials.length) {
            if (!validURL(data.socials[i])) {
              validSocials = false;

              break;
            }
            i++;
          }
        }

        //needed for when username is created and no website is provided
        let validWebsite;
        if (data.website) {
          validWebsite = validURL(data.website);
        } else {
          validWebsite = true;
        }

        if (valid && validName(name) && validSocials && validWebsite) {
          if (session.user.email === email) {
            try {
              data.approved = "pending";

              const update = await updatePerson(
                email,
                Object.keys(data).length === 1 ? { name: name } : data
              );

              // console.log(update);
              return res.status(200).json(update);
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

      case "DELETE":
        // set id based on request body
        const deleteName = req.body;

        if (session.user.name && session.user.name === deleteName) {
          // try get request, if successful return response, otherwise return error message
          try {
            const deleted = await deletePerson(deleteName);
            return res.status(200).json(deleted);
          } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          res.status(401).json({ msg: "Unauthorized" });
        }

        break;

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
