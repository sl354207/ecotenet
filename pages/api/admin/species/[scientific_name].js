import { ajv } from "@schema/validation";
import { updateSpecies } from "@utils/mongodb/mongoHelpers";

// api endpoint to get all posts by user from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const validate = ajv.getSchema("species");
  const valid = validate(req.body);

  const data = req.body;

  if (valid) {
    try {
      const update = await updateSpecies(data);

      return res.status(200).json(update);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Something went wrong." });
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
}
