import {
  getPostsByCategoryAndRegion,
  getSpecies,
} from "@utils/mongodb/mongoHelpers";

import { ajv } from "@schema/validation";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const id = req.query.region;
  const categoryQuery = decodeURIComponent(req.query.category);
  const categorySub = decodeURIComponent(req.query.sub);
  // console.log(categorySub);
  const dataCheck = {
    id: id,
    title: categoryQuery,
    sub: categorySub !== "undefined" ? categorySub : null,
  };
  // console.log(categorySub);

  const validate = ajv.getSchema("category");
  const valid = validate(dataCheck);

  if (valid) {
    if (categorySub == "undefined") {
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
