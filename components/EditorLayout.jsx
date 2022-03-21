// UPDATE
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    // padding: theme.spacing(4),
    backgroundColor: theme.palette.primary.light,
  },

  content: {
    flexGrow: 1,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.primary.light,
    maxWidth: 1280,
    margin: "auto",
  },
}));

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
