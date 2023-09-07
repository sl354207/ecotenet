import {
  getAllStatSpecies,
  getDistinctCategory,
  getFilteredStats,
  getStatsEcoregions,
} from "@utils/mongodb/mongoHelpers";
import { validStatInputs } from "@utils/validationHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const v1 = req.query.v1;
  const v2 = req.query.v2;
  if (validStatInputs(v1, v2)) {
    if (v2 === "undefined") {
      if (v1 === "all species") {
        try {
          const results = await getAllStatSpecies(v1);
          const ecoregions = await getStatsEcoregions();
          if (results.length > 0) {
            const rankedArray = [];
            for (const result of results) {
              const rankedResult = result.unique_id.reduce((acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
              }, {});

              rankedArray.push(rankedResult);
            }

            const rankedObject = {};
            rankedArray.forEach((item) => {
              for (const key in item) {
                if (!rankedObject[key]) {
                  rankedObject[key] = item[key];
                } else {
                  rankedObject[key] += item[key];
                }
              }
            });

            for (const ecoregion of ecoregions) {
              if (rankedObject[ecoregion.unique_id] === undefined) {
                ecoregion["rank"] = 0;
              } else {
                ecoregion["rank"] = rankedObject[ecoregion.unique_id];
              }
            }

            const sorted = ecoregions.sort(function (a, b) {
              return b.rank - a.rank;
            });

            return res.status(200).json(sorted);
          } else {
            return res.status(200).json([]);
          }
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        try {
          const results = await getDistinctCategory(v1);
          return res.status(200).json(results);
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: "Something went wrong." });
        }
      }
    } else {
      try {
        const results = await getFilteredStats(v1, v2);
        const ecoregions = await getStatsEcoregions();
        if (results.length > 0) {
          const rankedArray = [];
          for (const result of results) {
            const rankedResult = result.unique_id.reduce((acc, curr) => {
              acc[curr] = (acc[curr] || 0) + 1;
              return acc;
            }, {});

            rankedArray.push(rankedResult);
          }

          const rankedObject = {};
          rankedArray.forEach((item) => {
            for (const key in item) {
              if (!rankedObject[key]) {
                rankedObject[key] = item[key];
              } else {
                rankedObject[key] += item[key];
              }
            }
          });

          for (const ecoregion of ecoregions) {
            if (rankedObject[ecoregion.unique_id] === undefined) {
              ecoregion["rank"] = 0;
            } else {
              ecoregion["rank"] = rankedObject[ecoregion.unique_id];
            }
          }

          const sorted = ecoregions.sort(function (a, b) {
            return b.rank - a.rank;
          });

          return res.status(200).json(sorted);
        } else {
          return res.status(200).json([]);
        }

        // const test = results.slice(1, 3);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
}
