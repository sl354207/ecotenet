import { updatePerson } from "../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  // body must be in same format as database query
  const { name, ...data } = req.body;
  console.log(req.body);

  try {
    const update = await updatePerson(name, data);

    // console.log(update);
    return res.status(200).json(update);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
