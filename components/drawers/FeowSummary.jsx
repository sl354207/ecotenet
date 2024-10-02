import { Typography } from "@mui/material";

const FeowSummary = ({ ecoFilter }) => {
  return (
    <>
      {ecoFilter && ecoFilter.layer === "Freshwater" ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" align="center">
              FEOW-{ecoFilter._id}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ marginBottom: "15px" }}
            >
              {ecoFilter.name}
            </Typography>
          </div>
        </>
      ) : (
        <Typography variant="h5" align="center" sx={{ marginTop: "20px" }}>
          Please select an ecoregion from the map or ecoregions tab to view a
          summary
        </Typography>
      )}
    </>
  );
};

export default FeowSummary;
