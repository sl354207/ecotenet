import * as toxicity from "@tensorflow-models/toxicity";
import * as tf from "@tensorflow/tfjs";

export const loadToxicity = async (threshold = 0.85) => {
  tf.enableProdMode();
  try {
    const model = await toxicity.load(threshold);

    return model;
  } catch (error) {
    console.log(error);
    throw new Error("failed to load model");
  }
};

export const useToxicity = async (model, text) => {
  tf.enableProdMode();
  try {
    const predictions = await model.classify(text);
    const prediction = predictions.filter(
      (p) => p.results[0].match || p.results[0].match === null
    );
    // console.log(predictions);
    // console.log(prediction);
    return prediction.length > 0;
  } catch (error) {
    console.log(error);
    throw new Error("failed to classify text");
  }
};
