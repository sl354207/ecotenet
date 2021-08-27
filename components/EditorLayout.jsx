// UPDATE
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles(
  (theme) => ({
    root: {
      display: "flex",
      flexGrow: 1,
      padding: theme.spacing(4),
      backgroundColor: "#eee",
    },

    content: {
      flexGrow: 1,
      padding: theme.spacing(4),
      backgroundColor: "white",
      maxWidth: 1280,
      margin: "auto",
    },
  })
  // createStyles({
  //   root: {
  //     display: "flex",
  //   },
  //   drawer: {
  //     [theme.breakpoints.up("sm")]: {
  //       width: drawerWidth,
  //       flexShrink: 0,
  //     },
  //   },
  //   appBar: {
  //     [theme.breakpoints.up("sm")]: {
  //       width: `calc(100% - ${drawerWidth}px)`,
  //       marginLeft: drawerWidth,
  //     },
  //   },
  //   menuButton: {
  //     marginRight: theme.spacing(2),
  //     [theme.breakpoints.up("sm")]: {
  //       display: "none",
  //     },
  //   },
  //   // necessary for content to be below app bar
  //   toolbar: theme.mixins.toolbar,
  //   drawerPaper: {
  //     width: drawerWidth,
  //     zIndex: 0,
  //   },
  //   main: {
  //     flexGrow: 1,
  //     padding: theme.spacing(4),
  //     backgroundColor: "#eee",
  //   },
  //   content: {
  //     flexGrow: 1,
  //     padding: theme.spacing(4),
  //     backgroundColor: "white",
  //     maxWidth: 1280,
  //     margin: "auto",
  //   },
  // })
);

const EditorLayout = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.root}>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default EditorLayout;
