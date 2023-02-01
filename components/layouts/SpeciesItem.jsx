import { useHomepageContext } from "@components/context/HomepageContext";
import { Button, ListItem, Typography, useMediaQuery } from "@mui/material";
import theme from "@utils/theme";
import { useRouter } from "next/router";

const SpeciesItem = ({ result, handleClose }) => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    setFS,
    setFSOpen,
    setEcoOpen,
    setFilterOpen,
    distributionDispatch,
    setTab,
  } = useHomepageContext();
  return (
    <ListItem>
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
            setFS({ state: "Search Result", item: result });
            handleClose();
            setFilterOpen(false);
            if (isMobile) {
              setEcoOpen(false);
            }
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
