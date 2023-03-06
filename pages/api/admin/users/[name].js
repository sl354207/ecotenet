import { ajv } from "@schema/validation";
import {
  deletePerson,
  getPersonAdmin,
  updatePerson,
} from "@utils/mongodb/mongoHelpers";

export default async function handler(req, res) {
  const method = req.method;
  switch (method) {
    case "GET":
      const getName = req.query.name;

      if (typeof getName == "string" && getName.length <= 100) {
        try {
          const person = await getPersonAdmin(getName);

          return res.status(200).json(person);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
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
        try {
          const update = await updatePerson(email, data);

          // console.log(update);
          return res.status(200).json(update);
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        res.status(403);
      }
      // console.log(req.body);

      break;

    case "DELETE":
      // set id based on request body
      const deleteName = req.body;

      if (typeof deleteName == "string" && deleteName.length <= 100) {
        try {
          const deleted = await deletePerson(deleteName);
          return res.status(200).json(deleted);
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
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
}
