import StepForm from "@components/postForm/StepForm";

const DashboardEditor = () => {
  const initialDetailValues = {
    title: "",
    description: "",
    category: "",
    tags: [],
    ecoregions: [],
    id: "",
    status: "",
  };

  return <StepForm post={initialDetailValues} pathName="editor" />;
};

export default DashboardEditor;
