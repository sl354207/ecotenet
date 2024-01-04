import { getLatestPosts } from "@utils/mongodb/mongoHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  //   const page = 2;
  //   console.log(req.query.page);
  const page = req.query.page;
  const pageSize = 2;
  try {
    const results = await getLatestPosts(page, pageSize);
    // console.log(results[0].data);

    return res.status(200).json(results[0].data);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
