import theme from "@utils/theme";

const EditorLayout = ({ children, mobile }) => {
  return (
    <div
      style={{
        display: "flex",
        flexGrow: 1,
        backgroundColor: theme.palette.primary.light,
      }}
    >
      <div
        style={{
          flexGrow: 1,
          padding: theme.spacing(4),
          paddingTop: mobile ? "10px" : theme.spacing(4),
          backgroundColor: theme.palette.primary.light,
          maxWidth: "1280px",
          margin: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default EditorLayout;
