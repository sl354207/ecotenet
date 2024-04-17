import { useHomepageContext } from "@components/context/HomepageContext";
import { Button, ListItem, Typography, useMediaQuery } from "@mui/material";
import theme from "@utils/theme";
import { useRouter } from "next/router";

const SpeciesItem = ({ result, handleClose }) => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { setFS, setFSOpen, setEcoOpen, setFilterOpen, setEcoChips, setTab } =
    useHomepageContext();
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
        onClick={() => {
          if (router.pathname === "/") {
            setFS({ state: "Search Result", item: result });
            handleClose();
            setFilterOpen(false);
            if (isMobile) {
              setEcoOpen(false);
            }
            setFSOpen(true);

            result.id = result.scientific_name;
            setEcoChips([result]);

            setTab({ id: 2, label: "Distributions" });
          } else {
            router.push(
              `/species/${result.scientific_name.replace(/ /g, "_")}`
            );
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
