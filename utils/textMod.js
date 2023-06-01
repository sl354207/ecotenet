// // import { useEffect, useState } from 'react'
// import * as toxicity from "@tensorflow-models/toxicity";
// import "@tensorflow/tfjs";

// export const loadToxicity = (threshold = 0.85) => {
//   //   const [loading, setLoading] = useState(true)
//   //   const [isToxic, setIsToxic] = useState(false)
//   const model = toxicity.load(threshold);
//   //   console.log(threshold);
//   //   console.log(model);

//   //   useEffect(() => {
//   //     const loadToxicity = async () => {
//   //       setLoading(true)

//   //       const predictions = await model.classify(text)
//   //       const toxicPredictions = predictions.filter((p) => p.results[0].match)
//   //       setIsToxic(toxicPredictions.length > 0)
//   //       setLoading(false)
//   //     }
//   //     const checkToxicity = async () => {
//   //       setLoading(true)
//   //       const model = await toxicity.load(threshold, [])
//   //       const predictions = await model.classify(text)
//   //       const toxicPredictions = predictions.filter((p) => p.results[0].match)
//   //       setIsToxic(toxicPredictions.length > 0)
//   //       setLoading(false)
//   //     }
//   //     loadToxicity()
//   //   }, [text])

//   return model;
// };

// export const useToxicity = (model, text) => {
//   //   const [loading, setLoading] = useState(true)
//   //   const [isToxic, setIsToxic] = useState(false)
//   // const model = await toxicity.load(threshold)
//   const result = model.classify(text);
//   console.log(result);
//   return result;
//   //   let predictions = await model.classify(text);
//   //   for (let item of predictions) {
//   //     console.log(item.results[0].probabilities);

//   //     // for (let i in item.results) {

//   //     //   if (item.results[i].match === true) {

//   //     //     return true;

//   //     //   }

//   //     // }
//   //   }
// };
import * as toxicity from "@tensorflow-models/toxicity";
import "@tensorflow/tfjs";
import { useEffect, useState } from "react";

const useToxicity = (text) => {
  const [loading, setLoading] = useState(true);
  const [isToxic, setIsToxic] = useState(false);
  const threshold = 0.9;

  useEffect(() => {
    const checkToxicity = async () => {
      setLoading(true);
      const model = await toxicity.load(threshold, []);
      const predictions = await model.classify(text);
      const toxicPredictions = predictions.filter((p) => p.results[0].match);
      setIsToxic(toxicPredictions.length > 0);
      setLoading(false);
    };
    checkToxicity();
  }, [text]);
  //   console.log(isToxic);
  return { loading, isToxic };
};

export default useToxicity;
