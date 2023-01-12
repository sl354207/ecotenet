import { Button } from "@mui/material";
import { createPost } from "@utils/apiHelpers";
import { useRouter } from "next/router";

const CreatePostButton = ({ name, snackbar, setSnackbar, nav, isTab }) => {
  const router = useRouter();

  const startPost = async () => {
    const value = {
      title: "",
      description: "",
      category: "",
      tags: [],
      ecoregions: [],
      id: "",
      name: name,
      status: "draft",
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
      // sx={{ marginLeft: nav ? "10px" : "0px" }}
      onClick={() => startPost()}
      variant={nav ? "outlined" : "contained"}
      color="secondary"
      size={nav ? (isTab ? "small" : "medium") : "large"}
    >
      {nav ? "Create Post" : "Create New Post"}
    </Button>
  );
};

export default CreatePostButton;
