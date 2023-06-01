import * as toxicity from "@tensorflow-models/toxicity";

import "@tensorflow/tfjs-node";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  try {
    // const toxicity = require("@tensorflow-models/toxicity");
    const threshold = 0.9;
    // console.log(getName);
    // console.log(tf.env());
    // tf.enableProdMode();

    let model = await toxicity.load(threshold);
    // console.log(model);

    const messages = ["you suck"];
    console.log(messages);

    let predictions = await model.classify(messages);
    for (let item of predictions) {
      console.log(item.results[0].probabilities);

      // for (let i in item.results) {

      //   if (item.results[i].match === true) {

      //     return true;

      //   }

      // }
    }

    // console.log(predictions);
    // toxicity.load(threshold).then((model) => {
    //   const sentences = ["you suck"];
    //   console.log(sentences);

    //   model.classify(sentences).then((predictions) => {
    //     // `predictions` is an array of objects, one for each prediction head,
    //     // that contains the raw probabilities for each input along with the
    //     // final prediction in `match` (either `false` or `true`).
    //     // If neither prediction exceeds the threshold, `match` is `null`.

    //     console.log(predictions);
    //     /*
    //     prints:
    //     {
    //       "label": "identity_attack",
    //       "results": [{
    //         "probabilities": [0.9659664034843445, 0.03403361141681671],
    //         "match": false
    //       }]
    //     },
    //     {
    //       "label": "insult",
    //       "results": [{
    //         "probabilities": [0.08124706149101257, 0.9187529683113098],
    //         "match": true
    //       }]
    //     },
    //     ...
    //      */
    //   });
    // });

    return res.status(200).json("success");
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
