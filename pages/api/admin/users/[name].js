import { deletePerson, getPerson, updatePerson } from "@utils/mongodb";

export default async function handler(req, res) {
  const method = req.method;
  switch (method) {
    case "GET":
      const getName = req.query.name;
      // console.log(getName);

      // try get request, if successful return response, otherwise return error message
      try {
        const person = await getPerson(getName);

        return res.status(200).json(person);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }

      break;
    case "PUT":
      const { email, name, ...data } = req.body;
      // console.log(req.body);

      try {
        const update = await updatePerson(email, data);

        // console.log(update);
        return res.status(200).json(update);
      } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Something went wrong." });
      }

      break;

    case "DELETE":
      // set id based on request body
      const deleteName = req.body;

      // try delete request, if successful return response, otherwise return error message
      try {
        const deleted = await deletePerson(deleteName);
        return res.status(200).json(deleted);
      } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Something went wrong." });
      }

      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
