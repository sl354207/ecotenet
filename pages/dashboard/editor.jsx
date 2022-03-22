import StepForm from "../../components/PostForm/StepForm";

const DashboardEditor = () => {
  const initialDetailValues = {
    title: "",
    author: "",
    description: "",
    category: "",
    tags: [],
    ecoregions: [],
  };

  return <StepForm post={initialDetailValues} />;
};

export default DashboardEditor;
