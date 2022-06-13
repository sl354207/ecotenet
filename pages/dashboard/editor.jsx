import StepForm from "@components/postForm/StepForm";
import { useUserContext } from "@components/UserContext";

const DashboardEditor = () => {
  const { user } = useUserContext();
  const initialDetailValues = {
    title: "",
    description: "",
    category: "",
    tags: [],
    ecoregions: [],
    id: "",
    status: "",
  };

  return <StepForm post={initialDetailValues} pathName="editor" user={user} />;
};

export default DashboardEditor;
