import { checkName } from "@utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405);
  }

  // set id based on id of url query
  const name = req.query.q;
  // console.log(_id);

  // try get request, if successful return response, otherwise return error message
  try {
    const person = await checkName(name);
    // console.log(person);

    return res.status(200).json(person);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
