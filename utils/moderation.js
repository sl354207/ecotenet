import * as toxicity from "@tensorflow-models/toxicity";
import * as tf from "@tensorflow/tfjs";
import * as nsfwjs from "nsfwjs";

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

    return prediction.length > 0;
  } catch (error) {
    console.log(error);
    throw new Error("failed to classify text");
  }
};

export const loadImageClassifier = async () => {
  tf.enableProdMode();
  try {
    const model = await nsfwjs.load();

    return model;
  } catch (error) {
    console.log(error);
    throw new Error("failed to load model");
  }
};

export const useImageClassifier = async (model, img) => {
  tf.enableProdMode();

  try {
    const predictions = await model.classify(img);
    const prediction = predictions.filter(
      (p) =>
        p.probability >= 0.7 &&
        (p.className === "Sexy" ||
          p.className === "Porn" ||
          p.className === "Hentai")
    );
    // console.log(predictions);

    return prediction.length > 0;
  } catch (error) {
    console.log(error);
    throw new Error("failed to classify image");
  }
};
