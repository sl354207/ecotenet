import { ajv } from "@schema/validation";
import {
  checkPerson,
  deletePerson,
  getPerson,
  updatePerson,
} from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session) {
    const method = req.method;
    switch (method) {
      case "GET":
        const getName = req.query.name;
        // console.log(getName);
        if (typeof getName == "string") {
          if (session.user.name && session.user.name == getName) {
            // try get request, if successful return response, otherwise return error message
            try {
              const person = await getPerson(getName);

              return res.status(200).json(person);
            } catch (err) {
              console.error(err);

              res.status(500).json({ msg: "Something went wrong." });
            }
          } else if (!session.user.name) {
            const person = await checkPerson(getName);

            if (person && person.email == session.user.email) {
              // try get request, if successful return response, otherwise return error message
              try {
                const person = await getPerson(getName);

                return res.status(200).json(person);
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
      case "PUT":
        const { email, name, ...data } = req.body;
        const validate = ajv.getSchema("person");
        const valid = validate(req.body);
        if (valid) {
          if (session.user.email == email) {
            try {
              const update = await updatePerson(
                email,
                Object.keys(data).length ? data : { name: name }
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
        if (typeof deleteName == "string") {
          if (session.user.name && session.user.name == deleteName) {
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

            if (person && person.email == session.user.email) {
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
