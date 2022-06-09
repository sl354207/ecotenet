import { updateFlag } from "@utils/mongodb";
// import { getSession } from "next-auth/react";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  // const session = await getSession({ req });

  // if (session && session.user.role == "admin") {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  const { status } = req.body;

  const _id = req.query.id;

  try {
    const updatedFlag = await updateFlag(_id, status);
    return res.status(200).json(updatedFlag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
  // } else {
  //   // Not Signed in
  //   res.status(401);
  // }
  // res.end();
  //   console.log(session);
}
