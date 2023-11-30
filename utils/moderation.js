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

  const dbName = "tensorflowjs";
  const objectStoreName = "model_info_store";
  const key = "image-model";
  try {
    const db = await openDatabase(dbName);
    const exists = await checkObjectStoreExists(db, objectStoreName);

    if (exists) {
      console.log("Object store exists in IndexedDB");

      const objectStore = getObjectStore(db, objectStoreName);
      const keys = await getObjectStoreKeys(objectStore);
      // console.log(keys);

      if (keys.includes(key)) {
        const model = await nsfwjs.load("indexeddb://image-model", {
          type: "graph",
        });

        return model;
      } else {
        console.log("Image model does not exist in IndexedDB");
        const initialLoad = await nsfwjs.load(
          `${process.env.NEXT_PUBLIC_AWS_MODEL_URL}`,
          { type: "graph" }
        );

        await initialLoad.model.save("indexeddb://image-model");
        return initialLoad;
      }

      //
    } else {
      console.log("Object store does not exist in IndexedDB");
      // Load the model from another source and save it to IndexedDB

      const initialLoad = await nsfwjs.load(
        `${process.env.NEXT_PUBLIC_AWS_MODEL_URL}`,
        { type: "graph" }
      );

      await initialLoad.model.save("indexeddb://image-model");
      return initialLoad;
    }
  } catch (error) {
    console.log(error);
    throw new Error("failed to load model");
  }
};

const openDatabase = (dbName) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onerror = (event) => {
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

const getObjectStore = (db, objectStoreName) => {
  return db
    .transaction(objectStoreName, "readwrite")
    .objectStore(objectStoreName);
};
const getObjectStoreKeys = (objectStore) => {
  const request = objectStore.getAllKeys();

  return new Promise((resolve, reject) => {
    request.onerror = (event) => {
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const keys = event.target.result;
      // console.log(keys);

      resolve(keys);
    };
  });
};

const checkObjectStoreExists = async (db, objectStoreName) => {
  const objectStoreNames = db.objectStoreNames;
  return objectStoreNames.contains(objectStoreName);
};

export const useImageClassifier = async (model, img) => {
  tf.enableProdMode();
  // console.log(img);

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

export const checkLinks = async (links) => {
  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.NEXT_PUBLIC_GOOGLE_SAFE_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            clientId: "ecotenet",
            clientVersion: "1.0.0",
          },
          threatInfo: {
            threatTypes: [
              "MALWARE",
              "SOCIAL_ENGINEERING",
              "UNWANTED_SOFTWARE",
              "POTENTIALLY_HARMFUL_APPLICATION",
              "THREAT_TYPE_UNSPECIFIED",
            ],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: links.map((link) =>
              Object.assign({}, { url: link })
            ),
          },
        }),
      }
    );

    // returns empty object if no matches
    // returns object with 'matches' key containing an array of objects if matches
    const response = await res.json();
    // console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("failed to check links");
  }
};
