import { useMediaQuery } from "@mui/material";
import theme from "@utils/theme";

const EditorLayout = ({ children, readOnly }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div
      style={{
        paddingInline: theme.spacing(4),
        backgroundColor: theme.palette.primary.light,
        maxWidth: "1280px",
        margin: "auto",
        marginBottom: readOnly ? "0px" : isMobile ? "500px" : "300px",
        borderRadius: "10px",
      }}
    >
      {children}
    </div>
  );
};

export default EditorLayout;
