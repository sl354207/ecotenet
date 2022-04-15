import { updatePerson } from "../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  // body must be in same format as database query
  const { _id, bio, email, website, socials, flags, denials, approved } =
    req.body;
  // console.log(req);

  try {
    const update = await updatePerson(
      _id,
      bio,
      email,
      website,
      socials,
      flags,
      denials,
      approved
    );

    // console.log(update);
    return res.status(200).json(update);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
