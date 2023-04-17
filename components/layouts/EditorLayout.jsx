import theme from "@utils/theme";

const EditorLayout = ({ children }) => {
  return (
    <div
      style={{
        flexGrow: 1,
        backgroundColor: theme.palette.primary.light,
      }}
    >
      <div
        style={{
          flexGrow: 1,
          padding: theme.spacing(4),
          paddingTop: theme.spacing(4),
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