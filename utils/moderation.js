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

//   const dbName = "tensorflowjs";
//   const objectStoreName = "model_info_store";
//   const key = "image-model";

//   try {
//     const databaseExists = await checkDatabaseExists(dbName);

//     if (databaseExists) {
//       console.log(`Database exists in IndexedDB`);
//       const db = await openDatabase(dbName);
//       const storeExists = await checkObjectStoreExists(db, objectStoreName);

//       if (storeExists) {
//         console.log("Object store exists in IndexedDB");

//         const objectStore = getObjectStore(db, objectStoreName);
//         const keys = await getObjectStoreKeys(objectStore);
//         // console.log(keys);

//         if (keys.includes(key)) {
//           console.log("Image model exists in IndexedDB");
//           const model = await nsfwjs.load("indexeddb://image-model", {
//             type: "graph",
//           });

//           return model;
//         } else {
//           console.log("Image model does not exist in IndexedDB");
//           const deleteDb = await deleteDatabase(dbName);
//           console.log(deleteDb);

//           if (deleteDb) {
//             console.log("test");
//             const initialLoad = await nsfwjs.load(
//               `${process.env.NEXT_PUBLIC_AWS_MODEL_URL}`,
//               { type: "graph" }
//             );

//             await initialLoad.model.save("indexeddb://image-model");
//             return initialLoad;
//           } else {
//             throw new Error("failed to load model");
//           }
//         }
//       } else {
//         console.log("Object store does not exist in IndexedDB");
//         await deleteDatabase(dbName);

//         const initialLoad = await nsfwjs.load(
//           `${process.env.NEXT_PUBLIC_AWS_MODEL_URL}`,
//           { type: "graph" }
//         );

//         await initialLoad.model.save("indexeddb://image-model");
//         return initialLoad;
//       }
//     } else {
//       console.log("Database does not exist in IndexedDB");
//       const initialLoad = await nsfwjs.load(
//         `${process.env.NEXT_PUBLIC_AWS_MODEL_URL}`,
//         { type: "graph" }
//       );

//       await initialLoad.model.save("indexeddb://image-model");
//       return initialLoad;
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error("failed to load model");
//   }
// };
// export const loadImageClassifier = async () => {
//   tf.enableProdMode();
//   const dbName = "tensorflowjs";
//   const objectStoreName = "model_info_store";
//   const key = "image-model";

//   try {
//     const databaseExists = await checkDatabaseExists(dbName);

//     if (databaseExists) {
//       console.log(`Database exists in IndexedDB`);
//       const db = await openDatabase(dbName);
//       const storeExists = await checkObjectStoreExists(db, objectStoreName);

//       if (storeExists) {
//         console.log("Object store exists in IndexedDB");

//         const objectStore = getObjectStore(db, objectStoreName);
//         const keys = await getObjectStoreKeys(objectStore);

//         if (keys.includes(key)) {
//           console.log("Image model exists in IndexedDB");
//           const model = await nsfwjs.load("indexeddb://image-model", {
//             type: "graph",
//           });

//           return model;
//         } else {
//           console.log("Image model does not exist in IndexedDB");
//           const deleteDb = await deleteDatabase(dbName);

//           if (deleteDb) {
//             return await loadModelFromUrl();
//           } else {
//             throw new Error("failed to load model");
//           }
//         }
//       } else {
//         await deleteDatabase(dbName);
//         return await loadModelFromUrl();
//       }
//     } else {
//       return await loadModelFromUrl();
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error("failed to load model");
//   }
// };
// export const loadImageClassifier = async () => {
//   tf.enableProdMode();
//   const databaseName = "tensorflowjs";
//   const objectStoreName = "model_info_store";
//   const modelKey = "image-model";

//   try {
//     const databaseExists = await checkDatabaseExists(databaseName);

//     if (databaseExists) {
//       const db = await openDatabase(databaseName);
//       const objectStoreExists = await checkObjectStoreExists(
//         db,
//         objectStoreName
//       );

//       if (objectStoreExists) {
//         const objectStore = getObjectStore(db, objectStoreName);
//         const keys = await getObjectStoreKeys(objectStore);

//         if (keys.includes(modelKey)) {
//           const model = await nsfwjs.load("indexeddb://image-model", {
//             type: "graph",
//           });

//           return model;
//         } else {
//           await deleteDatabase(databaseName);
//           return await loadModelFromUrl();
//         }
//       } else {
//         await deleteDatabase(databaseName);
//         return await loadModelFromUrl();
//       }
//     } else {
//       return await loadModelFromUrl();
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error("failed to load model");
//   }
// };

// export const loadImageClassifier = async () => {
//   tf.enableProdMode();
//   const databaseName = "tensorflowjs";
//   const objectStoreName = "model_info_store";
//   const modelKey = "image-model";

//   try {
//     const databaseExists = await checkDatabaseExists(databaseName);

//     if (databaseExists) {
//       const db = await openDatabase(databaseName);
//       const objectStoreExists = await checkObjectStoreExists(
//         db,
//         objectStoreName
//       );

//       if (objectStoreExists) {
//         const objectStore = getObjectStore(db, objectStoreName);
//         const keys = await getObjectStoreKeys(objectStore);

//         if (keys.includes(modelKey)) {
//           const model = await nsfwjs.load("indexeddb://image-model", {
//             type: "graph",
//           });

//           return model;
//         } else {
//           await deleteDatabase(databaseName);
//           return await loadModelFromUrl();
//         }
//       } else {
//         await deleteDatabase(databaseName);
//         return await loadModelFromUrl();
//       }
//     } else {
//       return await loadModelFromUrl();
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error("failed to load model");
//   }
// };
// export const loadImageClassifier = async () => {
//   tf.enableProdMode();
//   const databaseName = "tensorflowjs";
//   const objectStoreName = "model_info_store";
//   const modelKey = "image-model";

//   try {
//     const databaseExists = await checkDatabaseExists(databaseName);

//     if (databaseExists) {
//       const db = await openDatabase(databaseName);
//       const objectStoreExists = await checkObjectStoreExists(
//         db,
//         objectStoreName
//       );

//       if (objectStoreExists) {
//         const objectStore = getObjectStore(db, objectStoreName);
//         const keys = await getObjectStoreKeys(objectStore);

//         if (keys.includes(modelKey)) {
//           const model = await nsfwjs.load("indexeddb://image-model", {
//             type: "graph",
//           });

//           return model;
//         } else {
//           await deleteDatabase(databaseName);
//           return await loadModelFromUrl();
//         }
//       } else {
//         await deleteDatabase(databaseName);
//         return await loadModelFromUrl();
//       }
//     } else {
//       return await loadModelFromUrl();
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error("failed to load model");
//   }
// };

// export const loadImageClassifier = async () => {
//   tf.enableProdMode();
//   const databaseName = "tensorflowjs";
//   const objectStoreName = "model_info_store";
//   const modelKey = "image-model";

//   try {
//     const databaseExists = await checkDatabaseExists(databaseName);

//     if (databaseExists) {
//       const db = await openDatabase(databaseName);
//       const objectStoreExists = await checkObjectStoreExists(
//         db,
//         objectStoreName
//       );

//       if (objectStoreExists) {
//         const objectStore = getObjectStore(db, objectStoreName);
//         const keys = await getObjectStoreKeys(objectStore);

//         if (keys.includes(modelKey)) {
//           const model = await nsfwjs.load("indexeddb://image-model", {
//             type: "graph",
//           });

//           return model;
//         } else {
//           await deleteDatabase(databaseName);
//           await loadModelFromUrl(); // Wait for database deletion
//         }
//       } else {
//         await deleteDatabase(databaseName);
//         await loadModelFromUrl(); // Wait for database deletion
//       }
//     } else {
//       await loadModelFromUrl(); // Database doesn't exist, load model directly
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error("failed to load model");
//   }
// };

// export const loadImageClassifier = async () => {
//   tf.enableProdMode();
//   const databaseName = "tensorflowjs";
//   const objectStoreName = "model_info_store";
//   const modelKey = "image-model";

//   let model;

//   try {
//     const databaseExists = await checkDatabaseExists(databaseName);

//     if (databaseExists) {
//       const db = await openDatabase(databaseName);
//       const objectStoreExists = await checkObjectStoreExists(
//         db,
//         objectStoreName
//       );

//       if (objectStoreExists) {
//         const objectStore = getObjectStore(db, objectStoreName);
//         const keys = await getObjectStoreKeys(objectStore);

//         if (keys.includes(modelKey)) {
//           model = await nsfwjs.load("indexeddb://image-model", {
//             type: "graph",
//           });
//         } else {
//           await deleteDatabase(databaseName);
//           model = await loadModelFromUrl(); // Wait for database deletion
//         }
//       } else {
//         await deleteDatabase(databaseName);
//         model = await loadModelFromUrl(); // Wait for database deletion
//       }
//     } else {
//       model = await loadModelFromUrl(); // Database doesn't exist, load model directly
//     }

//     return model;
//   } catch (error) {
//     console.log(error);
//     throw new Error("failed to load model");
//   }
// };

export const loadImageClassifier = async () => {
  tf.enableProdMode();
  const databaseName = "tensorflowjs";
  const objectStoreName = "model_info_store";
  const modelKey = "image-model";

  let model;

  try {
    const databaseExists = await checkDatabaseExists(databaseName);

    if (databaseExists) {
      const db = await openDatabase(databaseName);
      const objectStoreExists = await checkObjectStoreExists(
        db,
        objectStoreName
      );

      if (objectStoreExists) {
        const objectStore = getObjectStore(db, objectStoreName);
        const keys = await getObjectStoreKeys(objectStore);

        if (keys.includes(modelKey)) {
          model = await nsfwjs.load("indexeddb://image-model", {
            type: "graph",
          });
        } else {
          // const test = await deleteDatabase(databaseName);
          // console.log(test);
          const request = indexedDB.deleteDatabase(databaseName);
          console.log(request);

          request.onerror = (event) => {
            console.error("Error deleting database: ", event.target.error);
          };

          request.onsuccess = async () => {
            console.log("Database deleted");
            model = await loadModelFromUrl(); // Wait for database deletion
            console.log(model);
          };
        }
      } else {
        await deleteDatabase(databaseName);
        model = await loadModelFromUrl(); // Wait for database deletion
      }
    } else {
      model = await loadModelFromUrl(); // Database doesn't exist, load model directly
    }

    return model;
  } catch (error) {
    console.log(error);
    throw new Error("failed to load model");
  }
};

const loadModelFromUrl = async () => {
  console.log("loading model from url");
  const initialLoad = await nsfwjs.load(
    `${process.env.NEXT_PUBLIC_AWS_MODEL_URL}`,
    { type: "graph" }
  );

  await initialLoad.model.save("indexeddb://image-model");
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

// create function that creates an object store
const createObjectStore = (db, objectStoreName) => {
  return db
    .transaction(objectStoreName, "readwrite")
    .objectStore(objectStoreName);
};

// create function that deletes a database
// const deleteDatabase = (dbName) => {
//   console.log("deleting db");
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.deleteDatabase(dbName);

//     request.onerror = (event) => {
//       console.error("Error deleting database: ", event.target.error);
//       reject(event.target.error);
//     };

//     request.onsuccess = () => {
//       console.log("Database deleted");
//       resolve();
//     };
//   });
// };

const deleteDatabase = async (dbName) => {
  // try {
  console.log("deleting db");
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);

    request.onerror = (event) => {
      console.error("Error deleting database: ", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = () => {
      console.log("Database deleted");
      resolve();
    };
  });
  // } catch (error) {
  //   console.error("Error deleting database: ", error);
  //   throw error;
  // }
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
