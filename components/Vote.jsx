import { useState } from "react";
import { Button, IconButton, Typography } from "@material-ui/core";
import {
  ArrowDropDown,
  ArrowDropUp,
  FullscreenExitTwoTone,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    // display: "flex",
    marginLeft: 20,
  },
  count: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    maxWidth: 50,
  },
}));

const Vote = ({ counter }) => {
  const classes = useStyles();
  //set count value for post
  const [count, setCount] = useState(counter);
  //set limit for count
  const [limit, setLimit] = useState(0);

  const handleCountUp = () => {
    if (limit == 1) {
      setLimit(1);
      setCount(count);
    } else {
      setLimit(limit + 1);
      setCount(count + 1);
    }
  };

  const handleCountDown = () => {
    if (count == 0) {
      setLimit(0);
      setCount(count);
    } else if (limit == -1) {
      setLimit(limit);
      setCount(count);
    } else {
      setLimit(limit - 1);
      setCount(count - 1);
    }
  };
  return (
    <>
      <div className={classes.root}>
        <div className={classes.count}>
          <IconButton onClick={handleCountUp} color="secondary">
            <ArrowDropUp fontSize="large" />
          </IconButton>
          <Typography align="center">{count}</Typography>
          <IconButton onClick={handleCountDown} color="secondary">
            <ArrowDropDown fontSize="large" />
          </IconButton>
        </div>
      </div>
      {count !== counter ? (
        <Button variant="contained" color="secondary">
          Vote
        </Button>
      ) : (
        <Button variant="contained" color="secondary" disabled>
          Vote
        </Button>
      )}
    </>
  );
};

export default Vote;
