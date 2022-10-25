import { Button } from "@mui/material";
import { createPost } from "@utils/api-helpers";
import { useRouter } from "next/router";

const CreatePostButton = ({ name, snackbar, setSnackbar, nav }) => {
  const router = useRouter();

  const startPost = async () => {
    const value = {
      title: "",
      description: "",
      category: "",
      tags: [],
      ecoregions: [],
      id: "",
      status: "",
      name: name,
      status: "draft",
      approved: "false",
      updated: false,
      featured: false,
      feature: "false",
      date: "",
      version: 1,
      rows: [],
    };

    const createResponse = await createPost(value);

    if (createResponse.ok) {
      const ID = await createResponse.json();
      router.push(`/dashboard/posts/${ID.insertedId}`);
    }
    if (!createResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "error",
        message: "There was a problem creating post. Please try again later",
      });
    }
  };
  return (
    <Button
      // href="/dashboard/editor"
      onClick={() => startPost()}
      variant={nav ? "outlined" : "contained"}
      color="secondary"
      size={nav ? "medium" : "large"}
    >
      {nav ? "Create Post" : "Create New Post"}
    </Button>
  );
};

export default CreatePostButton;
