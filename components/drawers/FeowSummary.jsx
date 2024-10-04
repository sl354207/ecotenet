import Link from "@components/layouts/Link";
import { Typography } from "@mui/material";

const FeowSummary = ({ ecoFilter }) => {
  return (
    <>
      {ecoFilter && ecoFilter.layer === "Freshwater" ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" align="center" sx={{ marginTop: "20px" }}>
              FEOW-{ecoFilter._id}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ marginBottom: "15px" }}
            >
              {ecoFilter.name}
            </Typography>
            <Typography variant="h6" sx={{ marginTop: "10px" }}>
              Source:{" "}
              <Link
                href={`https://www.feow.org/ecoregions/details/${ecoFilter._id}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                FEOW
              </Link>
            </Typography>
          </div>
        </>
      ) : (
        <Typography variant="h5" align="center" sx={{ marginTop: "20px" }}>
          Please select a freshwater ecoregion from the map or ecoregions tab to
          view a summary
        </Typography>
      )}
    </>
  );
};

export default FeowSummary;
