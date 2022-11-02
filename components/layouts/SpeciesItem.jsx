import { useHomepageContext } from "@components/context/HomepageContext";
import { Button, ListItem, Typography } from "@mui/material";
import { useRouter } from "next/router";

const SpeciesItem = ({ result, handleClose }) => {
  const router = useRouter();

  const { setFS, setFSOpen, distributionDispatch, setTab } =
    useHomepageContext();
  return (
    <ListItem key={result._id}>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{
          display: "block",
          justifyContent: "start",
          textTransform: "none",
        }}
        // href={`/species/${result._id}`}
        onClick={() => {
          if (router.pathname == "/") {
            setFS(result);
            handleClose();
            setFSOpen(true);
            distributionDispatch({
              type: "add",
              payload: 0,
              value: result.unique_id,
              s_name: result.scientific_name,
              c_name: result.common_name,
              _id: result._id,
            });
            setTab({ id: 2, label: "Distributions" });
          } else {
            router.push(`/species/${result._id}`);
            handleClose();
          }
        }}
      >
        <Typography variant="h6" color="textPrimary" align="left">
          <i>{result.scientific_name}</i>
        </Typography>
        {result.common_name && (
          <Typography variant="h6" color="textPrimary" align="left">
            {result.common_name}
          </Typography>
        )}
      </Button>
    </ListItem>
  );
};

export default SpeciesItem;
