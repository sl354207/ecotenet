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

// export const loadImageClassifier = async () => {
//   tf.enableProdMode();
//   const databaseName = "tensorflowjs";
//   const objectStoreName = "model_info_store";
//   const modelKey = "image-model";

//   let model;

//   try {
//     // const databaseExists = await checkDatabaseExists(databaseName);

//     // if (databaseExists) {
//     //   const db = await openDatabase(databaseName);
//     //   const objectStoreExists = await checkObjectStoreExists(
//     //     db,
//     //     objectStoreName
//     //   );

//     //   if (objectStoreExists) {
//     //     const objectStore = getObjectStore(db, objectStoreName);
//     //     const keys = await getObjectStoreKeys(objectStore);

//     //     if (keys.includes(modelKey)) {
//     //       model = await nsfwjs.load("indexeddb://image-model", {
//     //         type: "graph",
//     //       });
//     //     } else {
//     //       const initialLoad = await loadModelFromUrl();
//     //       await initialLoad.model.save("indexeddb://image-model");

//     //       model = initialLoad;
//     //     }
//     //   } else {
//     //     const initialLoad = await loadModelFromUrl();
//     //     await initialLoad.model.save("indexeddb://image-model");

//     //     model = initialLoad;
//     //   }
//     // } else {
//     //   const initialLoad = await loadModelFromUrl();
//     //   await initialLoad.model.save("indexeddb://image-model");

//     //   model = initialLoad;
//     // }
//     model = await nsfwjs.load("indexeddb://image-model", {
//       type: "graph",
//     });
//     // console.log(model);

//     return model;
//   } catch (error) {
//     try {
//       model = await loadModelFromUrl();
//       await model.model.save("indexeddb://image-model");
//       return model;
//     } catch (error) {
//       console.log(error);
//       //  throw new Error("failed to load model");
//     }
//     console.log(error);
//     throw new Error("failed to load model");
//   }
// };

// export const loadImageClassifier2 = async () => {
//   tf.enableProdMode();
//   const databaseName = "tensorflowjs";
//   const objectStoreName = "model_info_store";
//   const modelKey = "image-model";

//   let model;

//   // try to load model from indexeddb. If not found, load from url and save to indexeddb
//   try {
//     model = await nsfwjs.load("indexeddb://image-model", {
//       type: "graph",
//     });
//     // console.log(model);
//     return model;
//   } catch (error) {
//     try {
//       model = await loadModelFromUrl();
//       await model.model.save("indexeddb://image-model");
//       return model;
//     } catch (error) {
//       console.log(error);
//       //  throw new Error("failed to load model");
//     }
//     console.log(error);
//     throw new Error("failed to load model");
//   }

// };

export const loadImageClassifier = async () => {
  tf.enableProdMode();

  try {
    const model = await nsfwjs.load("indexeddb://image-model", {
      type: "graph",
    });

    return model;
  } catch (error) {
    console.log("Failed to load model from IndexedDB:", error);

    // Load the model from an external URL
    const initialLoad = await loadModelFromUrl();

    try {
      await initialLoad.model.save("indexeddb://image-model");
    } catch (error) {
      console.log("Failed to open IndexedDB:", error);
    }

    return initialLoad;
  }
};

export const useImageClassifier = async (model, img) => {
  tf.enableProdMode();
  // console.log(model);

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

const loadModelFromUrl = async () => {
  console.log("loading model from url");
  const initialLoad = await nsfwjs.load(
    `${process.env.NEXT_PUBLIC_AWS_MODEL_URL}`,
    { type: "graph" }
  );

  return initialLoad;
};

async function checkDatabaseExists(databaseName) {
  try {
    console.log("checking db");
    const databaseList = await indexedDB.databases();

    // Check if the desired database name exists
    const exists = databaseList.some(
      (database) => database.name === databaseName
    );

    return exists;
  } catch (error) {
    throw error;
  }
}

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
  console.log("checking keys");

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
  console.log("checking object store");
  const objectStoreNames = db.objectStoreNames;
  return objectStoreNames.contains(objectStoreName);
};
