import { Typography } from "@mui/material";

const Description = ({ description, align }) => {
  return (
    <Typography
      variant="body1"
      align={align}
      sx={{ marginTop: "20px", marginBottom: "20px" }}
    >
      {description}
    </Typography>
  );
};

export default Description;
