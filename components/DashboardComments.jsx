import {
  FormControl,
  InputLabel,
  InputBase,
  Button,
  Link,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  alpha,
  makeStyles,
  withStyles,
  useTheme,
} from "@material-ui/core/styles";
import { useState } from "react";
import TextBox from "./TextBox";
import { useRouter } from "next/router";

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
  text: {
    display: "flex",
    flexGrow: 1,
  },
  comment: {
    flexGrow: 1,
  },
  link: {
    color: theme.palette.secondary.light,
  },
}));

const DashboardComments = ({
  result,
  handleClickOpen,
  mutate,
  setSnackbar,
}) => {
  const theme = useTheme();
  const classes = useStyles();

  const router = useRouter();

  const [commentValue, setCommentValue] = useState("");

  // update text input field
  const handleCommentChange = (event) => {
    setCommentValue(event.target.value);
  };

  // handle comment submission to database through api
  const handleCommentUpdate = async (commentValue) => {
    //combine all objects and send to api
    const comment = {
      _id: result._id,
      date: new Date().toUTCString(),
      text: commentValue,
      approved: "pending",
      updated: true,
    };

    const res = await fetch("/api/updateComment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
    if (res.ok) {
      mutate();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Comment updated successfully",
      });
      setCommentValue("");
    }
  };

  return (
    <div className={classes.comment}>
      <Link href={`/posts/${result.post_id}`} className={classes.link}>
        View Post
      </Link>{" "}
      {result.date}
      <div className={classes.text}>
        <FormControl className={classes.items}>
          <InputLabel shrink htmlFor="dashboardcomment"></InputLabel>
          <TextBox
            defaultValue={result.text}
            placeHolder={null}
            id="dashboardcomment"
            handleChange={handleCommentChange}
            autoFocus={false}
            // rows={1}
          />
        </FormControl>
        <div className={classes.buttongroup}>
          {commentValue != "" ? (
            <Button
              variant="contained"
              color="secondary"
              className={classes.buttonedit}
              size="small"
              onClick={() => handleCommentUpdate(commentValue)}
            >
              Save Change
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              className={classes.buttonedit}
              size="small"
              disabled
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
      </div>
    </div>
  );
};

export default DashboardComments;
