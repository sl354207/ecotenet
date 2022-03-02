import { FormControl, InputLabel, InputBase, Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  alpha,
  makeStyles,
  withStyles,
  useTheme,
} from "@material-ui/core/styles";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    // fontSize: 20,
    // maxWidth: 40,

    // [theme.breakpoints.down("xs")]: {
    //   fontSize: 10,
    // },
    borderRadius: "10px",
  },
  tabbar: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: "10px",
  },
  title: {
    marginBottom: 20,
    marginTop: 20,
  },
  ecoregions: {
    marginBottom: 20,
  },
  tab: {
    // fontSize: 18,
    // minWidth: 65,
    flexGrow: 1,
    backgroundColor: theme.palette.primary.light,
    minHeight: 80,
    borderRadius: "10px",
    "&:hover": {
      color: theme.text,
      opacity: 1,
    },
  },
  tablerow: {
    backgroundColor: "#001e3c!important",
    textAlign: "center",
    color: "#ffffff!important",
  },
  table: {
    [theme.breakpoints.down("xs")]: {
      margin: "auto",
      float: "none",
    },
    float: "right",
    border: "thin solid",
    marginLeft: 10,
  },
  buttonpost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    // border: "1px solid #94c9ff",
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    margin: "20px auto",
    borderRadius: "10px",
  },
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
  card: {
    // display: "flex",
    flex: "auto",
    marginRight: 20,
    // display: "block",
  },
  buttongroup: {
    // flexDirection: "column",
    display: "grid",
    margin: "auto 0px auto 20px",
  },
  buttonedit: {
    margin: "4px 0px",
    minWidth: "fit-content",
    justifyContent: "start",
  },
  dialog: {
    backgroundColor: theme.palette.primary.light,
  },
  profile: {
    // border: "thin solid",
    // borderRadius: "10px",
  },
  items: {
    // display: "flex",
    flexGrow: 1,
  },
}));

const BootstrapInput = withStyles((theme) => ({
  root: {
    // 'label + &': {
    //   marginTop: theme.spacing(3),
    // },
    // marginLeft: 60,
  },
  input: {
    position: "relative",
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    // fontSize: 16,
    width: "auto",
    padding: "20px 10px",
    flexGrow: 1,
    // transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    // fontFamily: [
    //   '-apple-system',
    //   'BlinkMacSystemFont',
    //   '"Segoe UI"',
    //   'Roboto',
    //   '"Helvetica Neue"',
    //   'Arial',
    //   'sans-serif',
    //   '"Apple Color Emoji"',
    //   '"Segoe UI Emoji"',
    //   '"Segoe UI Symbol"',
    // ].join(','),
    "&:focus": {
      // boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
      flexGrow: 1,
    },
  },
}))(InputBase);

const DashboardComments = ({ result, handleClickOpen }) => {
  const theme = useTheme();
  const classes = useStyles();

  const [commentValue, setCommentValue] = useState("");

  // const [show, setShow] = useState(false);
  // const container = useRef(null);

  // const handleClick = () => {
  //   setShow(!show);
  // };

  // update text input field
  const handleCommentChange = (event) => {
    setCommentValue(event.target.value);
  };

  // handle comment submission to database through api
  const handleCommentSubmit = async (commentValue, post_id, comment_ref) => {
    //convert comment values to key value pairs
    const textObject = {
      text: commentValue,
    };

    const idObject = {
      post_id: post_id,
    };

    const refObject = {
      comment_ref: comment_ref,
    };

    const dateObject = {
      date: new Date().toUTCString(),
    };
    //combine all objects and send to api
    const comment = Object.assign(idObject, refObject, dateObject, textObject);

    const res = await fetch("/api/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
  };

  return (
    <>
      <FormControl className={classes.items}>
        <InputLabel shrink htmlFor="bootstrap"></InputLabel>
        <BootstrapInput
          defaultValue={result.text}
          id="bootstrap"
          onChange={handleCommentChange}
          onSubmit={handleCommentSubmit}
          multiline
        />
      </FormControl>
      <div className={classes.buttongroup}>
        {commentValue != "" ? (
          <Button
            variant="contained"
            color="secondary"
            className={classes.buttonedit}
            // startIcon={<EditIcon />}
            size="small"
            onClick={handleCommentSubmit}
          >
            Save Change
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            className={classes.buttonedit}
            // startIcon={<EditIcon />}
            size="small"
            disabled
            onClick={handleCommentSubmit}
          >
            Save Change
          </Button>
        )}

        <Button
          variant="contained"
          color="secondary"
          className={classes.buttonedit}
          startIcon={<DeleteIcon />}
          size="small"
          onClick={handleClickOpen}
        >
          Delete
        </Button>
      </div>
    </>
  );
};

export default DashboardComments;
