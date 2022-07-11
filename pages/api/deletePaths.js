// import { deleteRecursive } from "@utils/aws";

import { deleteDirectoryPromise } from "@utils/aws";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  // only allow get request
  //   if (req.method !== "GET") {
  //     return res.status(405);
  //   }

  try {
    // const paths = await deleteRecursive("/Muskrat/62c9c684a38cd3357c7e28f3");
    const paths = await deleteDirectoryPromise("62c9c684a38cd3357c7e28f3");

    return res.status(200).json(paths);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
