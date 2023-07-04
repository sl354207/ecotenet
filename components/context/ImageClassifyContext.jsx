import { loadImageClassifier } from "@utils/moderation";
import { createContext, useContext, useEffect, useState } from "react";

export const ImageClassifyContext = createContext();

export const useImageClassifyContext = () => useContext(ImageClassifyContext);

export const ImageClassifyProvider = ({ children }) => {
  const [model, setModel] = useState();
  const [modelLoading, setModelLoading] = useState(false);
  const [modelError, setModelError] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      setModelLoading(true);
      try {
        // Loading model
        const model = await loadImageClassifier();
        if (model) {
          setModel(model);
          setModelLoading(false);
        }
      } catch (error) {
        console.log(error);
        setModelError(true);
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  return (
    <ImageClassifyContext.Provider value={{ model, modelLoading, modelError }}>
      {children}
    </ImageClassifyContext.Provider>
  );
};
