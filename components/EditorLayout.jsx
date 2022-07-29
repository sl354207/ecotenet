// UPDATE
import theme from "@utils/theme";

// const useStyles = makeStyles((theme) => ({
//   // root: {
//   //   display: "flex",
//   //   flexGrow: 1,
//   //   backgroundColor: theme.palette.primary.light,
//   // },
//   // content: {
//   //   flexGrow: 1,
//   //   padding: theme.spacing(4),
//   //   backgroundColor: theme.palette.primary.light,
//   //   maxWidth: 1280,
//   //   margin: "auto",
//   // },
// }));

const EditorLayout = ({ children }) => {
  // const classes = useStyles();

  return (
    <div
      // className={classes.root}
      style={{
        display: "flex",
        flexGrow: 1,
        backgroundColor: theme.palette.primary.light,
      }}
    >
      <div
        // className={classes.content}
        style={{
          flexGrow: 1,
          padding: theme.spacing(4),
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
