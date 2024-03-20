import {
  getPostsByCategoryAndRegion,
  getSpecies,
} from "@utils/mongodb/mongoHelpers";

import { ajv } from "@schema/validation";
import { validEco } from "@utils/validationHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const id = req.query.region;
  let categoryQuery = req.query.category;
  let categorySub = req.query.sub;

  // catch malicious or improper encoding
  try {
    categoryQuery = decodeURIComponent(categoryQuery);
    categorySub = decodeURIComponent(categorySub);
  } catch (error) {
    console.error(error);
    return res.status(403).json({ msg: "Forbidden" });
  }

  // console.log(categorySub);
  const dataCheck = {
    title: categoryQuery,
    sub: categorySub !== "undefined" ? categorySub : null,
  };
  // console.log(categorySub);

  const validate = ajv.getSchema("category");
  const valid = validate(dataCheck);

  if (valid && validEco(id)) {
    if (categorySub === "undefined") {
      try {
        const category = await getSpecies(categoryQuery, id);

        return res.status(200).json({
          tag: "species",
          category: category,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Something went wrong." });
      }
    } else {
      try {
        const postQuery = { title: categoryQuery, sub: categorySub };
        const category = await getPostsByCategoryAndRegion(postQuery, id);

        return res.status(200).json({
          tag: "post",
          category: category,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Something went wrong." });
      }
    }
  } else {
    // console.log(validate.errors);
    res.status(403).json({ msg: "Forbidden" });
  }
}
