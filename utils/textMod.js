import * as toxicity from "@tensorflow-models/toxicity";
import "@tensorflow/tfjs";

export const loadToxicity = async (threshold = 0.85) => {
  try {
    const model = await toxicity.load(threshold);

    return model;
  } catch (error) {
    console.log(error);
    throw new Error("failed to load model");
  }
};

export const useToxicity = async (model, text) => {
  try {
    const predictions = await model.classify(text);
    const prediction = predictions.filter((p) => p.results[0].match);
    console.log(predictions);
    return prediction.length > 0;
  } catch (error) {
    console.log(error);
    throw new Error("failed to classify text");
  }
};
