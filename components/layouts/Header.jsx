import { Typography } from "@mui/material";

const Header = ({ title }) => {
  return (
    <Typography variant="h4" align="center" sx={{ marginTop: "40px" }}>
      {title}
    </Typography>
  );
};

export default Header;
