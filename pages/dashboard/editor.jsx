import StepForm from "../../components/PostForm/StepForm";

const DashboardEditor = () => {
  const initialDetailValues = {
    title: "",
    author: "",
    description: "",
    category: "",
    tags: [],
    ecoregions: [],
    id: "",
  };

  return <StepForm post={initialDetailValues} pathName="editor" />;
};

export default DashboardEditor;
