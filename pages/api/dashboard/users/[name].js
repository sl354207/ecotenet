import { authOptions } from "@pages/api/auth/[...nextauth]";
import { ajv } from "@schema/validation";
import {
  checkPerson,
  deletePerson,
  getPersonDash,
} from "@utils/mongodb/mongoHelpers";
import { getServerSession } from "next-auth/next";
import URISanity from "urisanity";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  // console.log(session);
  if (session) {
    const method = req.method;
    switch (method) {
      case "GET":
        const getName = req.query.name;

        if (typeof getName == "string" && getName.length <= 100) {
          if (session.user.name && session.user.name === getName) {
            // try get request, if successful return response, otherwise return error message
            try {
              const person = await getPersonDash(getName);

              return res.status(200).json(person);
            } catch (err) {
              console.error(err);

              res.status(500).json({ msg: "Something went wrong." });
            }
          } else if (!session.user.name) {
            const person = await checkPerson(getName);
            // console.log(person);

            if (person && person.email === session.user.email) {
              // try get request, if successful return response, otherwise return error message
              try {
                const person = await getPersonDash(getName);

                return res.status(200).json(person);
              } catch (err) {
                console.error(err);

                res.status(500).json({ msg: "Something went wrong." });
              }
            } else {
              // console.log("test1");
              res.status(401);
            }
          } else {
            res.status(401);
          }
        } else {
          res.status(403);
        }

        break;
      case "PUT":
        const { email, name, ...data } = req.body;

        const validate = ajv.getSchema("person");
        const valid = validate(req.body);

        const validWebsite = URISanity.vet(data.website, {
          allowWebTransportURI: true,
        });

        let validSocials = true;

        if (data.socials.length > 0) {
          let i = 0;
          while (i < data.socials.length) {
            if (
              URISanity.vet(data.socials[i], {
                allowWebTransportURI: true,
              }) === "about:blank"
            ) {
              validSocials = false;

              break;
            }
            i++;
          }
        }

        if (
          valid &&
          validSocials &&
          (validWebsite !== "about:blank" || test.website === "")
        ) {
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
            res.status(401);
          }
        } else {
          res.status(403);
        }

        break;

      case "DELETE":
        // set id based on request body
        const deleteName = req.body;
        if (typeof deleteName == "string" && deleteName.length <= 100) {
          if (session.user.name && session.user.name === deleteName) {
            // try get request, if successful return response, otherwise return error message
            try {
              const deleted = await deletePerson(deleteName);
              return res.status(200).json(deleted);
            } catch (err) {
              console.error(err);
              res.status(500).json({ msg: "Something went wrong." });
            }
          } else if (!session.user.name) {
            const person = await checkPerson(deleteName);

            if (person && person.email === session.user.email) {
              // try get request, if successful return response, otherwise return error message
              try {
                const deleted = await deletePerson(deleteName);
                return res.status(200).json(deleted);
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

        break;

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
