import theme from "@utils/theme";

const EditorLayout = ({ children }) => {
  return (
    <div
      style={{
        paddingInline: theme.spacing(4),
        backgroundColor: theme.palette.primary.light,
        maxWidth: "1280px",
        margin: "auto",
      }}
    >
      {children}
    </div>
  );
};

export default EditorLayout;
